"""原配置测试后，对照Tomcat最大工作线程200与40，保留每次原始数据。"""
from pathlib import Path
import sys,os,json,subprocess,time
import argparse
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);a=p.parse_args()
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root/'scripts'));import experiment as r
if not os.environ.get('LAB_SSH_PASSWORD'):raise SystemExit('请设置LAB_SSH_PASSWORD')
out=a.output.resolve();e=out/'evidence'
# 等当前两轮原配置实验结束，再串行执行应用线程参数诊断。
if not (e/'rbac-restoration.json').exists():raise RuntimeError('先完成thread-campaign')
if not json.loads((e/'rbac-restoration.json').read_text())['restored']:raise RuntimeError('原实验服务尚未恢复')
original=json.loads((e/'rbac-original.json').read_text())
r.remote('monitor','docker service scale '+' '.join(n+'=0' for n in original))
for _ in range(30):
 raw=r.remote('monitor',"docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'")
 if all(x.endswith('0/0') for x in raw.splitlines()):break
 time.sleep(1)
try:
 r.remote('app',"sed -i '/^SERVER_TOMCAT_THREADS_MAX=/d' /opt/lab4/app.env; printf '\\nSERVER_TOMCAT_THREADS_MAX=40\\n' >> /opt/lab4/app.env")
 for b in ['mysql','mongo']:
  # 独立进程加载模块，保留原有目录和测试标识；诊断只改变Tomcat最大线程数。
  code="""
import sys,importlib.util
sys.argv=['thread-experiment.py',BACKEND,'--output',OUTPUT]
spec=importlib.util.spec_from_file_location('t',ROOT+'/scripts/thread-experiment.py');t=importlib.util.module_from_spec(spec);spec.loader.exec_module(t)
t.environment.prepare(t.A.backend,t.OUT)
(t.E/(t.A.backend+'-thread-settings.txt')).write_text(t.remote.remote('app','docker exec lab4-app printenv SERVER_TOMCAT_THREADS_MAX SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE'))
for op in ['read','write']:
 t.environment.recover(t.OUT)
 for rate in [80,720,1080]:
  s=t.stage(op,rate,'tomcat40_diagnosis')
  if s['generator_limit']:break
""".replace('BACKEND',repr(b)).replace('OUTPUT',repr(str(out))).replace('ROOT',repr(str(root)))
  subprocess.run([sys.executable,'-c',code],check=True,env=dict(os.environ,PYTHONPATH=str(root/'scripts')))
finally:
 # 参数修正后的部署保留，连接池仍为20。
 r.remote('monitor','docker service scale '+' '.join(n+'='+str(v) for n,v in original.items()))
 observed={}
 for _ in range(60):
  raw=r.remote('monitor',"docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'");observed=dict(x.split() for x in raw.splitlines())
  if all(observed.get(n)==f'{v}/{v}' for n,v in original.items()):break
  time.sleep(2)
 (e/'rbac-restoration.json').write_text(json.dumps({'original':original,'observed':observed,'restored':all(observed.get(n)==f'{v}/{v}' for n,v in original.items()),'phase':'tomcat40_diagnosis'},ensure_ascii=False,indent=2)+'\n')
