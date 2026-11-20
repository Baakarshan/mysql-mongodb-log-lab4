import concurrent.futures,csv,gzip,json,shlex,time,sys,tarfile
from pathlib import Path
sys.path.insert(0,'scripts');import experiment as r
from hps_quality import assess
ROOT=Path(__file__).resolve().parents[1]
FILES=['all.jtl.gz','start-ms.txt','console.log','jmeter.log','exit-code.txt','sender-config.json','sender-timeline.jsonl','generator-health.txt','pids.events.before','pids.events.after','run.jmx']
def install():
 for role in ['monitor','compiler']:
  for name in ['run-certified-shot.sh','probe-sender.py','select-jmeter-operation.py','jmeter.properties']:r.upload(role,ROOT/'scripts'/name,'/opt/lab4/scripts/'+name)
  r.upload(role,ROOT/'jmeter/single-shot-logs.jmx','/opt/lab4/jmeter/single-shot-logs.jmx')
def run(rate,d,host='172.31.12.145',port=18080,operation='read'):
 d=Path(d);d.mkdir(exist_ok=True,parents=True)
 rates={'monitor':round(rate*4/5/5)*5};rates['compiler']=rate-rates['monitor']
 def one(role):
  p='/opt/lab4/dual-'+str(time.time_ns())+'-'+role;n=rates[role]
  cmd=f'LAB4_TARGET_HOST={host} LAB4_TARGET_PORT={port} bash /opt/lab4/scripts/run-certified-shot.sh {operation} {n*55} {shlex.quote(p)} 55'
  raw=r.remote(role,cmd,False);sd=d/role;sd.mkdir();(sd/'command-output.txt').write_text(raw)
  r.remote(role,'if [ ! -f '+p+'/all.jtl.gz ]; then gzip -n -f '+p+'/all.jtl; fi; tar -czf '+p+'/evidence.tar.gz -C '+p+' '+' '.join(FILES))
  r.fetch(role,p+'/evidence.tar.gz',sd/'evidence.tar.gz')
  with tarfile.open(sd/'evidence.tar.gz') as tf:tf.extractall(sd,filter='data')
  return role,sd
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:parts=dict(pool.map(one,rates))
 start=max(int((p/'start-ms.txt').read_text()) for p in parts.values());(d/'start-ms.txt').write_text(str(start));rows=[];audits={}
 for role,p in parts.items():
  rr=list(csv.DictReader(gzip.open(p/'all.jtl.gz','rt')));fields=list(rr[0]) if rr else ['timeStamp','elapsed','label','responseCode','responseMessage','threadName','dataType','success','failureMessage','bytes','sentBytes','grpThreads','allThreads','URL','Latency','IdleTime','Connect'];rr=[x for x in rr if x.get('label')==operation and x.get('threadName') is not None]
  for row in rr:row['threadName']=role+' '+row['threadName']
  rows.extend(rr);timeline=[json.loads(x) for x in (p/'sender-timeline.jsonl').read_text().splitlines()]
  hps=[sum(start+i*1000<=int(x['timeStamp'])<start+(i+1)*1000 for x in rr) for i in range(30,50)]
  logs=(p/'console.log').read_text()+(p/'jmeter.log').read_text();a={'rate':rates[role],'samples':len(rr),'expected':rates[role]*55,'quality':assess(hps,rates[role]),'hps':hps,'exit_code':int((p/'exit-code.txt').read_text()),'min_available_mib':min(x['available_kib'] for x in timeline)/1024,'max_threads':max(x.get('threads',0) for x in timeline),'native_error':any(x in logs for x in ['OutOfMemoryError','Failed to start','unable to create native thread']),'pids_before':(p/'pids.events.before').read_text(),'pids_after':(p/'pids.events.after').read_text()}
  a['passed']=a['samples']==a['expected'] and a['quality']['passed'] and a['exit_code']==0 and a['min_available_mib']>=80 and not a['native_error'] and a['pids_before']==a['pids_after'];audits[role]=a
 rows.sort(key=lambda x:int(x['timeStamp']))
 with gzip.open(d/'all.jtl.gz','wt',newline='') as f:
  w=csv.DictWriter(f,fields,lineterminator='\n');w.writeheader();w.writerows(rows)
 for f in ['console.log','jmeter.log','generator-health.txt']:(d/f).write_text('\n'.join((p/f).read_text() for p in parts.values()))
 for f in ['run.jmx','sender-config.json']:(d/f).write_bytes((parts['monitor']/f).read_bytes())
 (d/'exit-code.txt').write_text(str(max(a['exit_code'] for a in audits.values())))
 a={'rates':rates,'hosts':audits,'passed':all(a['passed'] for a in audits.values()),'errors':sum(x['success']!='true' for x in rows),'samples':len(rows),'planned':rate*55,'clock_offset_ms':{role:int((p/'start-ms.txt').read_text())-start for role,p in parts.items()}}
 (d/'dual-sender-audit.json').write_text(json.dumps(a,indent=2));print('DUAL',json.dumps(a),flush=True);return a
if __name__=='__main__':
 import argparse,os
 parser=argparse.ArgumentParser(description='两台发送机等间隔发送，每线程一次请求')
 parser.add_argument('--rate',type=int,required=True)
 parser.add_argument('--output',type=Path,required=True)
 parser.add_argument('--host',default='172.31.12.145')
 parser.add_argument('--port',type=int,default=18080)
 parser.add_argument('--operation',choices=['read','write'],default='read')
 a=parser.parse_args()
 if not os.environ.get('LAB_SSH_PASSWORD'):parser.error('请通过LAB_SSH_PASSWORD提供SSH密码')
 if a.rate<=0 or a.rate%5:parser.error('速率须为正数，取5的整数倍；每档均检查发送质量')
 install();audit=run(a.rate,a.output,a.host,a.port,a.operation)
 raise SystemExit(0 if audit['passed'] else 1)
