"""上传JMX并依次测试两库，暂停和恢复共用资源的RBAC副本。"""
import argparse,datetime,json,os,subprocess,sys,time
from pathlib import Path
import experiment as r
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);a=p.parse_args();root=Path(__file__).resolve().parents[1];out=a.output.resolve();e=out/'evidence';e.mkdir(parents=True,exist_ok=True)
if not os.environ.get('LAB_SSH_PASSWORD'):raise SystemExit('请设置LAB_SSH_PASSWORD')
def save(n,x):(e/n).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
raw=r.remote('monitor',"docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'");original={x.split()[0]:int(x.split()[1].split('/')[1]) for x in raw.splitlines()};save('rbac-original.json',original)
for name in ['jmeter/single-shot-logs.jmx','scripts/run-single-shot.sh','scripts/jmeter.properties']:r.upload('monitor',root/name,'/opt/lab4/'+name)
save('load-generator.json',{'tool':'Apache JMeter 5.6.3','java_version':r.remote('monitor','/usr/lib/jvm/java-17-openjdk-amd64/bin/java -version 2>&1'),'loops':1,'ramp_s':35,'delayed_start':True,'thread_groups':5,'heap_mib':384,'stack_kib':256})
try:
 if original:r.remote('monitor','docker service scale '+' '.join(n+'=0' for n in original))
 for i in range(30):
  raw=r.remote('monitor',"docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'")
  if all(x.endswith('0/0') for x in raw.splitlines()):break
  time.sleep(1)
 else:raise RuntimeError('RBAC未暂停')
 save('rbac-paused.json',{'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'observed':raw})
 r.remote('app',"sed -i '/^SERVER_TOMCAT_THREADS_MAX=/d' /opt/lab4/app.env; printf '\\nSERVER_TOMCAT_THREADS_MAX=200\\n' >> /opt/lab4/app.env")
 for backend in ['mysql','mongo']:subprocess.run([sys.executable,str(root/'scripts/thread-experiment.py'),backend,'--prepare','--output',str(out)],check=True,env=os.environ)
finally:
 if original:r.remote('monitor','docker service scale '+' '.join(n+'='+str(v) for n,v in original.items()))
 for i in range(60):
  raw=r.remote('monitor',"docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'");observed=dict(x.split() for x in raw.splitlines())
  if all(observed.get(n)==f'{v}/{v}' for n,v in original.items()):break
  time.sleep(2)
 save('rbac-restoration.json',{'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'original':original,'observed':observed,'restored':all(observed.get(n)==f'{v}/{v}' for n,v in original.items())})
 for c in r.CLIENTS.values():c.close()
