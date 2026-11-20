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
def benchmark_command(cmd):
 # A local VPN reconnect can close SSH while the remote test finishes normally.
 # Recover the completed run without repeating writes.
 try:
  return remote('compiler',cmd)
 except Exception:
  CLIENTS.pop('compiler',None)
  result_dir=shlex.split(cmd)[4]
  status=remote('compiler','tail -3 '+shlex.quote(result_dir+'/console.log'),False)
  if 'end of run' in status:return status
  raise
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
MONITORING_STEP=5
def monitoring(start,end):
 code='import urllib.request,urllib.parse,json\nqueries='+repr(QUERIES)+'\nout={}\nfor k,q in queries.items():\n u="http://172.31.7.102:19090/api/v1/query_range?"+urllib.parse.urlencode({"query":q,"start":'+str(start)+',"end":'+str(end)+',"step":'+str(MONITORING_STEP)+'})\n out[k]=json.load(urllib.request.urlopen(u,timeout=30))\nprint(json.dumps(out))'
 return json.loads(remote('monitor','python3 -c '+shlex.quote(code)))

if __name__ == "__main__":
 raise SystemExit("Run scripts/thread-campaign.py; this module provides SSH and monitoring helpers.")
