"""从每秒发送端记录补充CPU、线程、内存统计。"""
from pathlib import Path
import json,statistics,sys
R=Path(sys.argv[1]);out=[]
for p in (R/'results/runs').glob('*/summary.json'):
 s=json.loads(p.read_text());d=p.parent;hosts={}
 for role in ['monitor','compiler']:
  f=d/'sender'/role/'sender-timeline.jsonl'
  if not f.exists():continue
  allsamples=[json.loads(l) for l in f.read_text().splitlines()]
  v=[x for x in allsamples if s['measurement_start_ms']<=x['time_ms']<s['measurement_end_ms']]
  cpu=[x['host_cpu_percent'] for x in v if 'host_cpu_percent' in x]
  hosts[role]={'formal_cpu_mean_percent':statistics.mean(cpu) if cpu else None,'formal_cpu_max_percent':max(cpu) if cpu else None,'min_available_mib':min(x['available_kib']/1024 for x in allsamples),'max_java_threads':max(x.get('threads',0) for x in allsamples),'max_java_rss_mib':max(x.get('rss_kib',0)/1024 for x in allsamples),'pids_events_unchanged':len({x['pids_events'] for x in allsamples})==1}
 out.append({'run':s['name'],'hosts':hosts})
(R/'evidence/sender-resource-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('发送端资源核对',len(out),'次运行')
