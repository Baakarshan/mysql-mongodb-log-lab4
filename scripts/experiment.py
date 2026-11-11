"""Two sequential database rounds. Credentials come from the environment."""
import os,sys,json,time,pathlib,csv,gzip,hashlib,shlex,datetime,subprocess
import paramiko
ROOT=pathlib.Path(__file__).resolve().parents[1]
HOSTS={'compiler':os.getenv('COMPILER_HOST','1.92.106.198'),'db':os.getenv('DATABASE_HOST','119.3.221.88'),'app':os.getenv('APPLICATION_HOST','120.46.176.79'),'monitor':os.getenv('MONITOR_HOST','113.44.144.119')}
CLIENTS={}
def client(role):
 c=CLIENTS.get(role)
 if c is None or not c.get_transport().is_active():
  c=paramiko.SSHClient();c.set_missing_host_key_policy(paramiko.AutoAddPolicy());c.connect(HOSTS[role],username=os.getenv('SSH_USER','root'),password=os.environ['LAB_SSH_PASSWORD'],timeout=20);c.get_transport().set_keepalive(15);CLIENTS[role]=c
 return c
def remote(role,cmd,check=True):
 c=client(role);_,out,err=c.exec_command(cmd,timeout=600);s=out.read().decode();e=err.read().decode();rc=out.channel.recv_exit_status()
 if check and rc:raise RuntimeError(f'{role} exited {rc}: {e[-1200:]} {s[-1000:]}')
 return s
def upload(role,local,path):
 with client(role).open_sftp() as s:s.put(str(local),path)
def fetch(role,path,local):
 local.parent.mkdir(parents=True,exist_ok=True)
 with client(role).open_sftp() as s:s.get(path,str(local))
def event(**kw):
 kw['updated_at']=datetime.datetime.now(datetime.timezone.utc).isoformat();print(json.dumps(kw),flush=True);(ROOT/'results/status.json').write_text(json.dumps(kw,indent=2))
def count(backend):
 if backend=='mysql':cmd='source /opt/lab4/db.env; docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -N -uroot lab4 -e "SELECT COUNT(*) FROM logs"'
 else:cmd='source /opt/lab4/db.env; docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval "print(db.logs.countDocuments({}))"'
 return int(remote('db',cmd).strip().splitlines()[-1])
def app_ready():
 for i in range(45):
  s=remote('compiler','curl --max-time 5 -sf http://172.31.12.145:18080/actuator/health',False)
  if 'UP' in s:return
  time.sleep(2)
 raise RuntimeError(remote('app','docker logs --tail 45 lab4-app',False))
QUERIES={
 'host_cpu_percent':'100 * (1 - avg by (role) (rate(node_cpu_seconds_total{mode="idle"}[30s])))',
 'host_memory_used_percent':'100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)',
 'host_memory_available_mib':'node_memory_MemAvailable_bytes / 1024 / 1024',
 'disk_read_bytes_per_second':'rate(node_disk_read_bytes_total{device="vda"}[30s])',
 'disk_write_bytes_per_second':'rate(node_disk_written_bytes_total{device="vda"}[30s])',
 'jvm_heap_used_bytes':'sum(jvm_memory_used_bytes{area="heap"})',
 'application_cpu_fraction':'process_cpu_usage',
 'gc_pause_seconds_per_second':'rate(jvm_gc_pause_seconds_sum[30s])',
 'http_requests_per_second':'sum(rate(http_server_requests_seconds_count{uri="/api/logs"}[30s]))'}
def monitoring(start,end):
 code='import urllib.request,urllib.parse,json\nqueries='+repr(QUERIES)+'\nout={}\nfor k,q in queries.items():\n u="http://172.31.7.102:19090/api/v1/query_range?"+urllib.parse.urlencode({"query":q,"start":'+str(start)+',"end":'+str(end)+',"step":5})\n out[k]=json.load(urllib.request.urlopen(u,timeout=30))\nprint(json.dumps(out))'
 return json.loads(remote('monitor','python3 -c '+shlex.quote(code)))
def switch_mongo():
 event(stage='switching_to_mongo')
 remote('app','docker rm -f lab4-app');remote('db','docker stop lab4-mysql')
 remote('db','source /opt/lab4/db.env; docker run -d --name lab4-mongo --restart unless-stopped --memory=1g -p 172.31.12.231:27017:27017 -e MONGO_INITDB_ROOT_USERNAME="$DB_USER" -e MONGO_INITDB_ROOT_PASSWORD="$DB_PASSWORD" -v /opt/lab4/mongo:/data/db -v /opt/lab4/fixtures:/fixtures:ro docker.m.daocloud.io/library/mongo:7.0.16 --wiredTigerCacheSizeGB 0.25 --bind_ip_all')
 for i in range(40):
  s=remote('db','source /opt/lab4/db.env; docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin --eval "db.adminCommand({ping:1})"',False)
  if 'ok: 1' in s:break
  time.sleep(2)
 remote('db','bash /opt/lab4/scripts/reset-db.sh mongo')
 remote('app',"sed -i 's/SPRING_PROFILES_ACTIVE=mysql/SPRING_PROFILES_ACTIVE=mongo/' /opt/lab4/app.env; docker run -d --name lab4-app --restart unless-stopped --memory=560m -p 172.31.12.145:18080:8080 --env-file /opt/lab4/app.env -v /opt/lab4/app.jar:/app.jar:ro docker.m.daocloud.io/library/eclipse-temurin:17-jre-jammy java -Xms64m -Xmx256m -Xss256k -XX:MaxMetaspaceSize=128m -jar /app.jar")
 app_ready()
def collect_evidence(backend):
 out={}
 for h in HOSTS:
  out[h]=remote(h,'hostname; date -u; free -m; docker ps --format "{{.Names}} {{.Image}} {{.Status}}"; docker images --digests --format "{{.Repository}}:{{.Tag}} {{.Digest}}"')
 (ROOT/'evidence'/f'{backend}-deployment.json').write_text(json.dumps(out,indent=2))
 if backend=='mysql':
  s=remote('db',r'''source /opt/lab4/db.env; docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -uroot lab4 -e "SELECT VERSION(); SHOW INDEX FROM logs; SELECT @@innodb_buffer_pool_size,@@innodb_flush_log_at_trx_commit,@@log_bin; EXPLAIN SELECT * FROM logs WHERE level='INFO' AND created_at >= '2026-11-01 06:00:00' AND created_at < '2026-11-01 07:00:00' ORDER BY created_at DESC,id DESC LIMIT 20;"''')
 else:s=remote('db',r'''source /opt/lab4/db.env; docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval 'print(db.version()); printjson(db.logs.getIndexes()); printjson(db.logs.find({level:"INFO",createdAt:{$gte:ISODate("2026-11-01T06:00:00Z"),$lt:ISODate("2026-11-01T07:00:00Z")}}).sort({createdAt:-1,_id:-1}).limit(20).explain("executionStats"));' ''')
 (ROOT/'evidence'/f'{backend}-database.txt').write_text(s)
 (ROOT/'evidence'/f'{backend}-application-startup.txt').write_text(remote('app','docker logs lab4-app 2>&1'))
 fetch('compiler','/opt/lab4/build.log',ROOT/'evidence/build.txt')
def run_backend(backend):
 event(stage='validating',backend=backend);app_ready();remote('db',f'bash /opt/lab4/scripts/reset-db.sh {backend}');assert count(backend)==100000
 smoke=remote('compiler','python3 /opt/lab4/scripts/smoke.py');(ROOT/'evidence'/f'{backend}-smoke.json').write_text(smoke)
 collect_evidence(backend)
 # Short preflight verifies that JMeter, JSON assertions, and timestamp splitting work.
 for op in ['read','write']:
  path=f'/opt/lab4/preflight/{backend}-{op}';remote('compiler',f'bash /opt/lab4/scripts/run-one.sh {op} 2 {path} 15')
  for f in ['all.jtl','console.log','jmeter.log']:fetch('compiler',path+'/'+f,ROOT/'evidence/preflight'/f'{backend}-{op}-{f}')
  with (ROOT/'evidence/preflight'/f'{backend}-{op}-all.jtl').open() as f:rows=[r for r in csv.DictReader(f) if r['label']==op]
  assert rows and all(r['success']=='true' for r in rows),rows[:2]
 event(stage='preflight_passed',backend=backend)
 for op in ['read','write']:
  stop=False
  for threads in [1,10,25,50,100,200]:
   for repeat in [1,2,3]:
    name=f'{backend}-{op}-t{threads}-r{repeat}';dest=ROOT/'results/runs'/name;dest.mkdir(parents=True,exist_ok=True)
    if (dest/'summary.json').exists():continue
    event(stage='resetting',backend=backend,operation=op,threads=threads,repeat=repeat,name=name)
    reset=remote('db',f'bash /opt/lab4/scripts/reset-db.sh {backend}');(dest/'reset.txt').write_text(reset);before=count(backend);assert before==100000
    rpath='/opt/lab4/results/'+name
    event(stage='measuring',backend=backend,operation=op,threads=threads,repeat=repeat,name=name)
    remote('compiler',f'bash /opt/lab4/scripts/run-one.sh {op} {threads} {rpath}')
    summary=json.loads(remote('compiler',f'python3 /opt/lab4/scripts/summarize-run.py {rpath}'));after=count(backend)
    summary.update(backend=backend,operation=op,threads=threads,repeat=repeat,name=name,records_before=before,records_after=after)
    assert after==before+(summary['all_success'] if op=='write' else 0),(name,after,before,summary['all_success'])
    summary['record_count_verified']=True
    metrics=monitoring(summary['start_ms']/1000,summary['measurement_end_ms']/1000+5);(dest/'monitoring.json').write_text(json.dumps(metrics))
    for f in ['warmup.jtl.gz','measurement.jtl.gz','console.log','jmeter.log','start-ms.txt']:fetch('compiler',rpath+'/'+f,dest/f)
    for f,digest in summary['files'].items():assert hashlib.sha256((dest/f).read_bytes()).hexdigest()==digest
    (dest/'summary.json').write_text(json.dumps(summary,indent=2));event(stage='run_complete',**{k:summary[k] for k in ['name','backend','operation','threads','repeat','samples','throughput_rps','p95_ms','errors']})
    if summary['samples']==0:stop=True
   # Stop higher levels after a failed process or persistent timeouts, as specified.
   if stop:break
 event(stage='round_complete',backend=backend)
def main():
 for p in ['results','evidence']:(ROOT/p).mkdir(exist_ok=True)
 # Upload the finalized benchmark scripts before launching any measurements.
 for h in ['compiler','db']:
  remote(h,'mkdir -p /opt/lab4/scripts /opt/lab4/jmeter')
  for p in (ROOT/'scripts').glob('*'):
   if p.is_file():upload(h,p,'/opt/lab4/scripts/'+p.name)
  upload(h,ROOT/'jmeter/logs.jmx','/opt/lab4/jmeter/logs.jmx')
 run_backend('mysql');switch_mongo();run_backend('mongo')
 event(stage='collecting_originals')
 subprocess.run([sys.executable,str(ROOT/'scripts/collect-originals.py')],check=True)
 subprocess.run([sys.executable,str(ROOT/'scripts/audit.py'),'--complete'],check=True)
 event(stage='complete',completed_runs=len(list((ROOT/'results/runs').glob('*/summary.json'))))
if __name__=='__main__':
 try:main()
 except Exception as e:event(stage='failed',error=str(e));raise
 finally:
  for c in CLIENTS.values():c.close()
