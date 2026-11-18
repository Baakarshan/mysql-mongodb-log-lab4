"""将内核OOM、容器退出和日志采集失败关联到测量及采集阶段。"""
import argparse,datetime,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();r=a.bundle
runs=json.loads((r/'results/all-runs.json').read_text())
completed={x['name']:datetime.datetime.fromisoformat(x['utc']).timestamp()*1000 for line in (r/'events.jsonl').read_text().splitlines() if (x:=json.loads(line)).get('stage')=='completed'}
kernels=[]
for line in (r/'evidence/application-kernel-final.txt').read_text().splitlines():
 if 'Out of memory: Kill process' in line or 'Killed process' in line:
  kernels.append({'time_ms':datetime.datetime.fromisoformat(line.split()[0]).timestamp()*1000,'line':line})
events=json.loads((r/'evidence/failure-timeline.json').read_text());diagnoses=[]
for s in runs:
 end=completed.get(s['name'],s['measurement_end_ms']+10000)
 def phase(t):return 'warmup' if t<s['measurement_start_ms'] else 'measurement' if t<s['measurement_end_ms'] else 'collection_after_measurement'
 ks=[dict(x,phase=phase(x['time_ms'])) for x in kernels if s['start_ms']<=x['time_ms']<=end]
 dies=[dict(x,phase=phase(datetime.datetime.fromisoformat(x['utc']).timestamp()*1000)) for x in events if x['action']=='容器退出' and s['start_ms']<=datetime.datetime.fromisoformat(x['utc']).timestamp()*1000<=end]
 log=(r/'results/runs'/s['name']/'application.log').read_text()
 diagnoses.append({'run':s['name'],'measurement_start_ms':s['measurement_start_ms'],'measurement_end_ms':s['measurement_end_ms'],'collection_end_ms':end,'kernel_memory_events':ks,'container_exits':dies,'docker_log_command_failed':log.startswith('fatal error: out of memory'),'jvm_native_allocation_failure_in_collected_log':'Native memory allocation (mmap) failed' in log,'generator_limit':s['generator_limit'],'minimum_generator_available_mib':s['generator_min_available_mib']})
(r/'evidence/failure-diagnosis.json').write_text(json.dumps(diagnoses,ensure_ascii=False,indent=2)+'\n')
print('Diagnosed',len(diagnoses),'runs')
