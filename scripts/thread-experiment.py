"""JMeter每线程一次请求，固定启动时长，按平均响应时间逐级加压。"""
import argparse,collections,csv,datetime,gzip,hashlib,importlib.util,json,math,os,re,shlex,statistics,sys,threading,time
from pathlib import Path
import experiment as remote
from hps_quality import assess
P=argparse.ArgumentParser();P.add_argument('backend',choices=['mysql','mongo']);P.add_argument('--output',type=Path,required=True);P.add_argument('--prepare',action='store_true');P.add_argument('--operation',choices=['read','write']);P.add_argument('--only-rate',type=int);A=P.parse_args()
ROOT=Path(__file__).resolve().parents[1];OUT=A.output.resolve();E=OUT/'evidence';RUNS=OUT/'results/runs';E.mkdir(parents=True,exist_ok=True);RUNS.mkdir(parents=True,exist_ok=True)
import round_environment as environment

def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def event(**x):
 x['utc']=datetime.datetime.now(datetime.timezone.utc).isoformat();line=json.dumps(x,ensure_ascii=False);print(line,flush=True)
 with (OUT/'events.jsonl').open('a') as f:f.write(line+'\n')
def q(v,p):
 if not v:return None
 v=sorted(v);i=(len(v)-1)*p;l=int(i);return v[l]+(v[min(l+1,len(v)-1)]-v[l])*(i-l)
remote.QUERIES.update({
 'host_cpu_percent':'100 * (1 - avg by (role) (rate(node_cpu_seconds_total{mode="idle"}[10s])))',
 'host_cpu_per_core':'100 * (1 - rate(node_cpu_seconds_total{mode="idle"}[10s]))',
 'host_load1':'node_load1',
 'host_iowait_percent':'100 * avg by (role) (rate(node_cpu_seconds_total{mode="iowait"}[10s]))',
 'disk_busy_percent':'100 * rate(node_disk_io_time_seconds_total{device="vda"}[10s])',
 'hikari_active':'hikaricp_connections_active', 'hikari_pending':'hikaricp_connections_pending',
 'hikari_max':'hikaricp_connections_max','jvm_threads_live':'jvm_threads_live_threads',
 'process_open_fds':'process_files_open_files','gc_pause_count':'rate(jvm_gc_pause_seconds_count[10s])'})

def snapshot(dest,stop,diagnostic):
 # 中间时段保存瞬时指标、监听队列、Java线程数量；诊断档额外打印线程栈。
 samples=[]
 for delay in [32,7,7]:
  if stop.wait(delay):break
  x={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
  try:
   x['metrics']=remote.remote('monitor','curl -sf --max-time 3 http://172.31.12.145:18080/actuator/prometheus',False)
   x['application']=remote.remote('app',"date -u; free -m; ss -lnt; for p in /proc/[0-9]*; do read -r n < \"$p/comm\" 2>/dev/null || continue; if [ \"$n\" = java ]; then awk '/^(Name|VmRSS|VmSize|Threads):/' \"$p/status\"; fi; done",False)
   if diagnostic and not samples:
    x['thread_dump_signal']=remote.remote('app','docker kill --signal=QUIT lab4-app',False)
    if A.backend=='mysql':cmd='source /opt/lab4/db.env; docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -uroot -e "SHOW FULL PROCESSLIST; SHOW ENGINE INNODB STATUS\\G; SHOW GLOBAL STATUS WHERE Variable_name IN (\'Threads_running\',\'Threads_connected\',\'Innodb_row_lock_current_waits\',\'Innodb_buffer_pool_wait_free\');"'
    else:cmd='''source /opt/lab4/db.env; docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval 'const s=db.serverStatus();printjson({connections:s.connections,globalLock:s.globalLock,locks:s.locks,wiredTiger:s.wiredTiger});printjson(db.currentOp({active:true}));' '''
    x['database']=remote.remote('db',cmd,False)
  except Exception as ex:x['collection_error']=type(ex).__name__+': '+str(ex)[:200]
  samples.append(x);save(dest/'diagnostic-snapshots.json',samples)

def stage(op,rate,purpose='exploration',pool=20,tomcat_max_threads=None):
 tomcat_max_threads=tomcat_max_threads or (40 if purpose=='tomcat40_diagnosis' else 200)
 prior=[json.loads(p.read_text()) for p in RUNS.glob('*/summary.json')]
 if prior:
  last=max(prior,key=lambda x:x['start_ms'])
  if last['error_rate']>.01 or not last['healthy_after']:environment.recover(OUT)
 prefix=f'{A.backend}-{op}-n{rate*55}-r'
 prior_paths=list(RUNS.glob(prefix+'*'))+list((E/'aborted-before-measurement').glob(prefix+'*'))
 repeat=1+max([int(p.name[len(prefix):]) for p in prior_paths] or [0]);name=prefix+str(repeat);d=RUNS/name;d.mkdir();rpath='/opt/lab4/'+OUT.name+'/'+name+'-'+str(time.time_ns())
 event(stage='starting',name=name,threads=rate*55,planned_rps=rate,purpose=purpose,pool=pool,tomcat_max_threads=tomcat_max_threads)
 (d/'reset.txt').write_text(remote.remote('db',f'bash /opt/lab4/scripts/reset-db.sh {A.backend}'));before=remote.count(A.backend);assert before==100000
 stop=threading.Event();probe=threading.Thread(target=snapshot,args=(d,stop,purpose!='exploration'),daemon=True);probe.start()
 try:(d/'command-output.txt').write_text(remote.remote('monitor',f'bash /opt/lab4/scripts/run-single-shot.sh {op} {rate*55} {shlex.quote(rpath)} 55',False))
 finally:stop.set();probe.join(timeout=30)
 for f in ['all.jtl.gz','start-ms.txt','console.log','jmeter.log','generator-health.txt','exit-code.txt','run.jmx']:remote.fetch('monitor',rpath+'/'+f,d/f)
 with gzip.open(d/'all.jtl.gz','rt') as f:rd=csv.DictReader(f);fields=rd.fieldnames;rows=[r for r in rd if r['label'] in ['read','write']]
 # setUp时钟采样不属于被测HTTP请求。原生all.jtl保留时钟行，正式窗口只含HTTP。
 start=int((d/'start-ms.txt').read_text());begin=start+30000;end=start+50000
 formal=[r for r in rows if begin<=int(r['timeStamp'])<end]
 for part,items in [('measurement',formal),('warmup',[r for r in rows if int(r['timeStamp'])<begin]),('cooldown',[r for r in rows if int(r['timeStamp'])>=end])]:
  with gzip.open(d/f'{part}.jtl.gz','wt',newline='') as f:w=csv.DictWriter(f,fields,lineterminator='\n');w.writeheader();w.writerows(items)
 lat=[int(r['elapsed']) for r in formal];success=[int(r['elapsed']) for r in formal if r['success']=='true'];hps=[sum(begin+i*1000<=int(r['timeStamp'])<begin+(i+1)*1000 for r in formal) for i in range(20)]
 after=remote.count(A.backend);monitoring=remote.monitoring(start/1000,end/1000+8);save(d/'monitoring.json',monitoring)
 def vals(key,role=None):return [float(v) for series in monitoring[key]['data'].get('result',[]) if role is None or series['metric'].get('role')==role for t,v in series.get('values',[]) if begin/1000<=t<end/1000 and v not in ['NaN','+Inf','-Inf']]
 cpu={role:statistics.mean(vals('host_cpu_percent',role)) for role in ['application','database','compiler','monitor'] if vals('host_cpu_percent',role)}
 ratio=max(hps)/min(hps) if hps and min(hps)>0 else None
 if not formal:
  # 预热阶段故障同样保留原始记录；该运行没有正式样本，不计算响应均值。
  save(d/'failure.json',{'name':name,'target_rps':rate,'start_ms':start,'reason':'正式窗口没有HTTP请求','generator_exit_code':int((d/'exit-code.txt').read_text()),'hits_per_second':hps})
  (d/'application.log').write_text(remote.remote('app','docker logs --timestamps --since 3m lab4-app 2>&1',False))
  (d/'kernel.log').write_text(remote.remote('app',f"journalctl -k --since '@{int(start/1000)}' --no-pager -o short-iso",False))
  event(stage='aborted_before_measurement',name=name,planned_rps=rate)
  return {'name':name,'generator_limit':True,'mean_ms':None}
 log=(d/'jmeter.log').read_text();mem=[int(v)/1024 for v in re.findall(r'MemAvailable:\s+(\d+) kB',(d/'generator-health.txt').read_text())]
 errors=sum(r['success']!='true' for r in formal);all_success=sum(r['success']=='true' for r in rows)
 s=dict(name=name,backend=A.backend,operation=op,threads=rate*55,ramp_s=55,loops=1,thread_groups=5,target_rps=rate,repeat=repeat,purpose=purpose,pool_size=pool,load_model='jmeter-openmodel-even-arrivals',generator_role='monitor',duration_s=20,start_ms=start,measurement_start_ms=begin,measurement_end_ms=end,samples=len(formal),errors=errors,error_rate=errors/len(formal) if formal else 1,mean_ms=statistics.mean(lat) if lat else None,successful_mean_ms=statistics.mean(success) if success else None,p50_ms=q(lat,.5),p95_ms=q(lat,.95),p99_ms=q(lat,.99),throughput_rps=len(formal)/20,successful_rps=len(success)/20,hits_per_second=hps,hps_min=min(hps),hps_max=max(hps),hps_max_min_ratio=ratio,hps_cv=statistics.pstdev(hps)/statistics.mean(hps) if sum(hps) else None,cpu_percent=cpu,generator_exit_code=int((d/'exit-code.txt').read_text()),generator_min_available_mib=min(mem) if mem else None,all_http_samples=len(rows),all_success=all_success,records_before=before,records_after=after,write_count_difference=after-before-(all_success if op=='write' else 0),response_codes=dict(collections.Counter(r['responseCode'] for r in formal if r['success']!='true')),unique_http_threads=len({r['threadName'] for r in rows}),healthy_after='UP' in remote.remote('monitor','curl --max-time 4 -sf http://172.31.12.145:18080/actuator/health',False),max_inflight=max([int(r['allThreads'] or 0) for r in rows] or [0]))
 s['tomcat_max_threads']=tomcat_max_threads
 s['hps_quality']=assess(hps,rate)
 s['generator_limit']=not s['hps_quality']['passed'] or s['generator_exit_code']!=0 or ratio is None or ratio>=2 or abs(s['throughput_rps']/rate-1)>.1 or len(rows)!=rate*55 or 'unable to create native thread' in log or 'OutOfMemoryError' in log or 'Failed to start' in (d/'console.log').read_text()
 s['severe_degradation']=s['error_rate']>.01 or (s['mean_ms'] or 0)>50
 s['classification']='generator_limit' if s['generator_limit'] else 'stress' if s['severe_degradation'] else 'load'
 save(d/'summary.json',s);save(d/'config.json',{'threads':rate*55,'thread_groups':5,'threads_per_group':rate*11,'ramp_s':55,'loops':1,'measurement_offset_s':[30,50],'pool_size':pool,'jmx_sha256':hashlib.sha256((d/'run.jmx').read_bytes()).hexdigest(),'source_jmx_sha256':hashlib.sha256((ROOT/'jmeter/single-shot-logs.jmx').read_bytes()).hexdigest(),'jmeter_heap_mib':384,'jmeter_stack_kib':256,'tomcat_max_threads':s['tomcat_max_threads']})
 raw=gzip.decompress((d/'all.jtl.gz').read_bytes());save(d/'original.json',{'original_jtl_sha256':hashlib.sha256(raw).hexdigest(),'compressed_sha256':hashlib.sha256((d/'all.jtl.gz').read_bytes()).hexdigest()})
 (d/'application.log').write_text(remote.remote('app','docker logs --timestamps --since 2m lab4-app 2>&1',False))
 (d/'kernel.log').write_text(remote.remote('app',f"journalctl -k --since '@{int(start/1000)}' --no-pager -o short-iso",False))
 event(stage='completed',**{k:s[k] for k in ['name','mean_ms','error_rate','hps_min','hps_max','hps_max_min_ratio','cpu_percent','classification']})
 return s

def configure_pool(pool):
 remote.remote('app',f"sed -i '/^SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=/d; /^SPRING_DATA_MONGODB_URI=/d' /opt/lab4/app.env; printf '\\nSPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE={pool}\\n' >> /opt/lab4/app.env")
 if A.backend=='mongo':remote.remote('app',f'''source /opt/lab4/app.env; printf 'SPRING_DATA_MONGODB_URI=mongodb://%s:%s@172.31.12.231:27017/lab4?authSource=admin&w=1&journal=true&maxPoolSize={pool}&minPoolSize=5\\n' "$DB_USER" "$DB_PASSWORD" >> /opt/lab4/app.env''')
 environment.remove_app();remote.remote('app','bash /opt/lab4/scripts/deploy.sh app');remote.app_ready()

def explore(op):
 rate=80;previous=None;baseline=None;boundary=None
 while True:
  s=stage(op,rate);baseline=baseline or s['mean_ms']
  if s['generator_limit']:
   boundary=s
   # 发送平台失败时复测一次；失败结果单列，禁止用它判断数据库转折。
   environment.recover(OUT);retry=stage(op,rate,'arrival_confirmation')
   if not retry['generator_limit']:
    retry['purpose']='exploration';save(RUNS/retry['name']/'summary.json',retry);s=retry
   else:break
  turning=s['error_rate']>.01 or s['mean_ms']>max(50,baseline*10) or not s['healthy_after']
  if turning:
   boundary=s
   # 转折前后细分一次，避免只比较相隔一倍的两档。
   if previous and rate-previous['target_rps']>=80:
    middle=(rate+previous['target_rps'])//2
    environment.recover(OUT);stage(op,middle,'boundary_refinement')
   environment.recover(OUT);stage(op,rate,'boundary_confirmation')
   # 只改变连接池一个参数，核对等待是否随之改变；记录重启和预热差异。
   configure_pool(40)
   try:stage(op,rate,'pool40_diagnosis',40)
   finally:configure_pool(20)
   stage(op,80,'recovery_confirmation');break
  previous=s;rate=rate*2 if rate<320 else int(math.ceil(rate*1.5/10)*10)
 if boundary:event(stage='boundary',operation=op,name=boundary['name'])

if __name__=='__main__':
 try:
  if A.prepare:environment.prepare(A.backend,OUT)
  for op in [A.operation] if A.operation else ['read','write']:
   if A.only_rate:stage(op,A.only_rate,'pilot')
   else:explore(op)
 finally:
  for c in remote.CLIENTS.values():c.close()
