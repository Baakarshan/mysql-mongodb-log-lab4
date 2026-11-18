"""收集本轮应用故障与恢复事件，并关联请求时间窗。"""
import argparse,datetime,json
from pathlib import Path
import experiment as remote
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();R=a.bundle;E=R/'evidence';E.mkdir(exist_ok=True)
runs=[json.loads(f.read_text()) for f in (R/'results/runs').glob('*/summary.json')]
start=int(min(s['start_ms'] for s in runs)/1000)-60
end=int(datetime.datetime.now(datetime.timezone.utc).timestamp())
for name,cmd in [('application-container-events-final.jsonl',f"docker events --since {start} --until {end} --filter container=lab4-app --format '{{{{json .}}}}'"),('application-kernel-final.txt',f"journalctl -k --since '@{start}' --until '@{end}' --no-pager -o short-iso"),('mongo-application-full.log','docker logs --timestamps lab4-app 2>&1')]:
 (E/name).write_text(remote.remote('app',cmd,False))
events={}
for f in E.glob('application-container-events*.jsonl'):
 for line in f.read_text().splitlines():
  if not line.strip():continue
  e=json.loads(line);events[(e['timeNano'],e['Action'])]=e
timeline=[]
for _,e in sorted(events.items()):
 if e['Action'] not in ['die','start','restart','oom','kill']:continue
 t=e['time'];possible=[s for s in runs if s['start_ms']/1000-1<=t<=s['measurement_end_ms']/1000+8]
 s=max(possible,key=lambda x:x['start_ms']) if possible else None
 x={'utc':datetime.datetime.fromtimestamp(t,datetime.timezone.utc).isoformat(),'utc_bjt':datetime.datetime.fromtimestamp(t,datetime.timezone(datetime.timedelta(hours=8))).strftime('%m-%d %H:%M:%S'),'action':{'die':'容器退出','start':'容器启动','restart':'重启操作','oom':'内存耗尽','kill':'停止信号'}[e['Action']],'exit_code':e['Actor']['Attributes'].get('exitCode',''),'signal':e['Actor']['Attributes'].get('signal',''),'run':s['name'] if s else None,'backend':s['backend'] if s else '恢复或切换'}
 timeline.append(x)
(E/'failure-timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+'\n')
(E/'events.jsonl').write_text((R/'events.jsonl').read_text())
for c in remote.CLIENTS.values():c.close()
print('Collected',len(timeline),'events')
