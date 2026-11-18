"""在 Manager 上按固定到达率逐级测试两条日志链路。"""
import argparse
import collections
import csv
import datetime
import gzip
import hashlib
import json
import math
import os
from pathlib import Path
import re
import shlex
import statistics
import time

import experiment as remote

P=argparse.ArgumentParser(description=__doc__)
P.add_argument('backend',choices=['mysql','mongo'])
P.add_argument('--output',type=Path,required=True)
P.add_argument('--start-rate',type=int,default=80)
P.add_argument('--max-rate',type=int,default=12000)
P.add_argument('--operation',choices=['read','write'])
P.add_argument('--only-rate',type=int)
P.add_argument('--prepare',action='store_true')
A=P.parse_args()
REPO=Path(__file__).resolve().parents[1]
OUT=A.output.resolve()
REMOTE_ROOT='/opt/lab4/'+OUT.name+'-open'
for sub in ['results/runs','evidence']: (OUT/sub).mkdir(parents=True,exist_ok=True)

def save(path,value):path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def event(**values):
    values['utc']=datetime.datetime.now(datetime.timezone.utc).isoformat()
    print(json.dumps(values,ensure_ascii=False),flush=True)
    with (OUT/'events.jsonl').open('a') as f:f.write(json.dumps(values,ensure_ascii=False)+'\n')
def quantile(values,q):
    if not values:return None
    values=sorted(values);pos=(len(values)-1)*q;lo=int(pos)
    return values[lo]+(values[min(lo+1,len(values)-1)]-values[lo])*(pos-lo)
def recover():
    try:
        remote.remote('app','timeout 20s docker restart -t 5 lab4-app')
    except RuntimeError as error:
        (OUT/'evidence'/'application-recovery-failure.txt').write_text(str(error)+'\n')
        # 只结束实验JAR，释放主机内存后恢复实验容器。
        command='for p in /proc/[0-9]*; do if read -r comm < "$p/comm" 2>/dev/null && [[ "$comm" == java ]]; then mapfile -d "" args < "$p/cmdline"; case "${args[*]}" in *"/app.jar"*) kill -KILL "${p##*/}";; esac; fi; done'
        remote.remote('app',command)
        time.sleep(3)
        remote.remote('app','timeout 20s docker start lab4-app',False)
    remote.app_ready()
def prepare():
    remote.remote('app','docker stop lab4-app',False)
    other='mongo' if A.backend=='mysql' else 'mysql'
    remote.remote('db',f'docker stop lab4-{other}',False)
    remote.remote('db',f'docker start lab4-{A.backend}')
    for _ in range(30):
        try:remote.count(A.backend);break
        except Exception:time.sleep(1)
    remote.remote('app','docker rm -f lab4-app')
    remote.remote('app',f"sed -i 's/^SPRING_PROFILES_ACTIVE=.*/SPRING_PROFILES_ACTIVE={A.backend}/' /opt/lab4/app.env; bash /opt/lab4/scripts/deploy.sh app")
    remote.app_ready()
    remote.remote('db',f'bash /opt/lab4/scripts/reset-db.sh {A.backend}')
    smoke=json.loads(remote.remote('monitor','python3 /opt/lab4/scripts/smoke.py'))
    assert smoke['passed'];save(OUT/'evidence'/f'{A.backend}-smoke.json',smoke)
    deployment={role:remote.remote(role,'date -u; free -m; docker ps --format "{{.Names}} {{.Image}} {{.Status}}"') for role in remote.HOSTS}
    deployment['jar']=remote.remote('app','sha256sum /opt/lab4/app.jar')
    save(OUT/'evidence'/f'{A.backend}-deployment.json',deployment)
    if A.backend=='mysql':
        cmd='source /opt/lab4/db.env; docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -uroot lab4 -e "SELECT VERSION(); SHOW INDEX FROM logs; SELECT @@innodb_buffer_pool_size,@@innodb_flush_log_at_trx_commit,@@log_bin;"'
    else:
        cmd='''source /opt/lab4/db.env; docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval 'print(db.version()); printjson(db.logs.getIndexes()); printjson(db.adminCommand({getCmdLineOpts:1}).parsed.storage);' '''
    (OUT/'evidence'/f'{A.backend}-database-settings.txt').write_text(remote.remote('db',cmd))

def summarize(dest,op,rate,repeat,purpose,before,after):
    start=int((dest/'start-ms.txt').read_text());begin,end=start+10000,start+35000
    with gzip.open(dest/'all.jtl.gz','rt') as f:
        reader=csv.DictReader(f);fields=reader.fieldnames;rows=list(reader)
    formal=[r for r in rows if begin<=int(r['timeStamp'])<end]
    for name,part in [('warmup',[r for r in rows if int(r['timeStamp'])<begin]),('measurement',formal),('cooldown',[r for r in rows if int(r['timeStamp'])>=end])]:
        with gzip.open(dest/f'{name}.jtl.gz','wt',newline='') as f:
            w=csv.DictWriter(f,fields,lineterminator='\n');w.writeheader();w.writerows(part)
    lat=[int(r['elapsed']) for r in formal];all_success=sum(r['success']=='true' for r in rows)
    failures=collections.Counter(r['responseCode'] for r in formal if r['success']!='true')
    hps=[sum(begin+i*1000<=int(r['timeStamp'])<begin+(i+1)*1000 for r in formal) for i in range(25)]
    bins=[sum(hps[i:i+5])/5 for i in range(0,25,5)]
    arrivals=json.loads((dest/'arrivals.json').read_text());arrival_bins=arrivals['per_second'][10:35]
    dropped=sum(x['dropped'] for x in arrival_bins);wire=sum(x['on_wire'] for x in arrival_bins)
    s=dict(name=dest.name,backend=A.backend,operation=op,target_rps=rate,repeat=repeat,purpose=purpose,
      load_model='open-fixed-interval',generator_role='monitor',generator_memory_limit_mib=384,
      duration_s=25,start_ms=start,measurement_start_ms=begin,measurement_end_ms=end,
      samples=len(formal),errors=sum(failures.values()),error_rate=sum(failures.values())/len(formal) if formal else 1,
      throughput_rps=len(formal)/25,successful_rps=sum(r['success']=='true' for r in formal)/25,
      mean_ms=statistics.mean(lat) if lat else None,p50_ms=quantile(lat,.5),p95_ms=quantile(lat,.95),p99_ms=quantile(lat,.99),
      hits_per_second=hps,hits_per_second_5s=bins,hps_cv_5s=statistics.pstdev(bins)/statistics.mean(bins) if sum(bins) else None,
      response_codes=dict(failures),all_http_samples=len(rows),all_success=all_success,records_before=before,records_after=after,
      write_count_difference=after-before-(all_success if op=='write' else 0),
      record_count_verified=after==before+(all_success if op=='write' else 0),
      scheduled_requests=rate*25,dropped_arrivals=dropped,on_wire_requests=wire,on_wire_rps=wire/25,
      dispatch_lag_p99_us=arrivals['dispatch_lag_microseconds']['p99'],max_inflight=arrivals['max_inflight_observed'],
      actual_start_ratio=len(formal)/(rate*25),on_wire_ratio=wire/(rate*25))
    raw=gzip.decompress((dest/'all.jtl.gz').read_bytes())
    save(dest/'original.json',dict(original_jtl_sha256=hashlib.sha256(raw).hexdigest(),compressed_sha256=hashlib.sha256((dest/'all.jtl.gz').read_bytes()).hexdigest()))
    save(dest/'config.json',dict(load_model=s['load_model'],target_rps=rate,generator_role='monitor',generator_memory_limit_mib=384,max_inflight=12000,warmup_s=10,measurement_s=25,total_timeout_ms=5000,connect_timeout_ms=2000,binary_sha256=hashlib.sha256((REPO/'work/open-load').read_bytes()).hexdigest()))
    return s

def stage(op,rate,purpose='exploration'):
    summaries=[json.loads(p.read_text()) for p in (OUT/'results/runs').glob('*/summary.json')]
    previous=max(summaries,key=lambda s:s['start_ms']) if summaries else None
    if previous and (previous['severe_degradation'] or not previous['healthy_after']):
        event(stage='recovering_before_run',previous=previous['name']);recover()
    prefix=f'{A.backend}-{op}-rps{rate}-r'
    repeat=1+max([int(p.name[len(prefix):]) for p in (OUT/'results/runs').glob(prefix+'*')] or [0])
    name=prefix+str(repeat);dest=OUT/'results/runs'/name;dest.mkdir();rpath=REMOTE_ROOT+'/'+name
    event(stage='starting',name=name,purpose=purpose)
    save(dest/'state-before.json',{role:remote.remote(role,'free -m; docker inspect lab4-app --format \"{{.State.OOMKilled}} {{.RestartCount}}\" 2>/dev/null || true') for role in ['monitor','app','db']})
    (dest/'reset.txt').write_text(remote.remote('db',f'bash /opt/lab4/scripts/reset-db.sh {A.backend}'))
    before=remote.count(A.backend);assert before==100000
    output=remote.remote('monitor',f'bash /opt/lab4/scripts/run-open.sh {op} {rate} {shlex.quote(rpath)}',False)
    (dest/'command-output.txt').write_text(output)
    for filename in ['all.jtl.gz','start-ms.txt','arrivals.json','console.log','generator-health.txt','exit-code.txt']:
        remote.fetch('monitor',rpath+'/'+filename,dest/filename)
    time.sleep(1);after=remote.count(A.backend)
    s=summarize(dest,op,rate,repeat,purpose,before,after)
    monitoring=remote.monitoring(s['start_ms']/1000,s['measurement_end_ms']/1000+5);save(dest/'monitoring.json',monitoring)
    cpu={}
    for series in monitoring['host_cpu_percent']['data']['result']:
        values=[float(v) for t,v in series['values'] if s['measurement_start_ms']/1000<=float(t)<s['measurement_end_ms']/1000]
        if values:cpu[series['metric'].get('role','unknown')]=statistics.mean(values)
    s['cpu_percent']=cpu;s['generator_exit_code']=int((dest/'exit-code.txt').read_text())
    mem=[int(x)/1024 for x in re.findall(r'MemAvailable:\s+(\d+) kB',(dest/'generator-health.txt').read_text())]
    s['generator_min_available_mib']=min(mem) if mem else None
    s['generator_limit']=s['generator_exit_code']!=0 or s['actual_start_ratio']<.98 or s['dropped_arrivals']>rate*.25 or (mem and min(mem)<32)
    s['severe_degradation']=s['error_rate']>=.1 or (s['p95_ms'] or 0)>=3500
    s['healthy_after']='UP' in remote.remote('monitor','curl --max-time 5 -sf http://172.31.12.145:18080/actuator/health',False)
    s['request_delivery_failure']=s['on_wire_ratio']<.98
    s['classification']='generator_limit' if s['generator_limit'] else 'service_degradation' if s['severe_degradation'] else 'controlled_load' if (s['p95_ms'] or 0)<500 else 'saturation'
    save(dest/'summary.json',s)
    (dest/'application.log').write_text(remote.remote('app','docker logs --since 1m lab4-app 2>&1',False))
    state={role:remote.remote(role,'free -m; docker stats --no-stream --format "{{.Name}} {{.CPUPerc}} {{.MemUsage}}"; docker inspect lab4-app --format "{{.State.OOMKilled}} {{.RestartCount}}" 2>/dev/null || true') for role in ['monitor','app','db']}
    save(dest/'state-after.json',state)
    event(stage='completed',**{k:s[k] for k in ['name','target_rps','throughput_rps','on_wire_rps','p95_ms','error_rate','hps_cv_5s','dispatch_lag_p99_us','max_inflight','cpu_percent','generator_limit','classification']})
    return s

def explore(op):
    rate=A.start_rate;previous=None;peak=None;boundary=None
    while rate<=A.max_rate:
        s=stage(op,rate)
        if not s['generator_limit'] and (peak is None or s['successful_rps']>peak['successful_rps']):peak=s
        if previous and s['successful_rps']<previous['successful_rps']*.8:
            event(stage='diagnosing_drop',previous=previous['name'],current=s['name'])
            stage(op,previous['target_rps'],'drop_previous_retest')
            stage(op,rate,'drop_current_retest')
        if s['generator_limit']:
            event(stage='generator_limit',name=s['name']);boundary=s;break
        if s['severe_degradation'] or not s['healthy_after']:
            confirmation=stage(op,rate,'failure_confirmation')
            if confirmation['error_rate']>=.1 or not confirmation['healthy_after'] or confirmation['p95_ms']>=3500:
                event(stage='service_failure_boundary',name=s['name']);boundary=s;break
        previous=s
        step=2 if s['p95_ms']<100 and s['error_rate']==0 else 1.5
        next_rate=min(A.max_rate,int(math.ceil(rate*step/10)*10))
        if next_rate==rate:break
        rate=next_rate
    if peak and (not boundary or peak['target_rps']!=boundary['target_rps']):stage(op,peak['target_rps'],'peak_confirmation')
    stage(op,A.start_rate,'baseline_confirmation')

if __name__=='__main__':
    try:
        remote.QUERIES['host_cpu_percent']='100 * (1 - avg by (role) (rate(node_cpu_seconds_total{mode="idle"}[10s])))'
        if A.prepare:prepare()
        for op in [A.operation] if A.operation else ['read','write']:
            if A.only_rate:stage(op,A.only_rate,'manual_diagnosis')
            else:explore(op)
    finally:
        for c in remote.CLIENTS.values():c.close()
