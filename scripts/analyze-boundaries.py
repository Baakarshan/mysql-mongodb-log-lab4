"""以同窗原始监控和故障日志生成可审核的转折分析依据。"""
from pathlib import Path
import json,statistics,sys
R=Path(sys.argv[1]);runs=json.loads((R/'results/all-runs.json').read_text());by={x['name']:x for x in runs}
for key in ['mysql-read','mysql-write','mongo-read','mongo-write']:
 tpath=R/'evidence'/(key+'-turning-point.json')
 if not tpath.exists():continue
 turn=json.loads(tpath.read_text());lo=by.get(turn['normal_confirmation']);hi=by.get(turn['stress_confirmation'])
 if not lo or not hi:continue
 details=[]
 for s in [lo,hi]:
  m=json.loads((R/'results/runs'/s['name']/'monitoring.json').read_text());a={}
  for metric in ['hikari_active','hikari_pending','hikari_max','gc_pause_seconds_per_second','jvm_heap_used_bytes','host_iowait_percent','disk_busy_percent','jvm_threads_live','host_cpu_per_core']:
   series=m.get(metric,{}).get('data',{}).get('result',[]);v=[float(v) for z in series for ts,v in z.get('values',[]) if s['measurement_start_ms']/1000<=ts<s['measurement_end_ms']/1000 and v not in ['NaN','+Inf','-Inf']]
   if v:
    a[metric]={'min':min(v),'max':max(v),'mean':statistics.mean(v)}
    if metric=='gc_pause_seconds_per_second':
     total={}
     for z in series:
      for ts,value in z.get('values',[]):
       if s['measurement_start_ms']/1000<=ts<s['measurement_end_ms']/1000 and value not in ['NaN','+Inf','-Inf']:total[ts]=total.get(ts,0)+float(value)
     vv=list(total.values());a[metric]={'min':min(vv),'max':max(vv),'mean':statistics.mean(vv),'aggregation':'sum GC categories at each timestamp'}
    a[metric]['roles']={}
    for role in ['application','database']:
     vv=[float(value) for z in series if z['metric'].get('role')==role for ts,value in z.get('values',[]) if s['measurement_start_ms']/1000<=ts<s['measurement_end_ms']/1000 and value not in ['NaN','+Inf','-Inf']]
     if vv:a[metric]['roles'][role]={'min':min(vv),'max':max(vv),'mean':statistics.mean(vv)}
  details.append({'run':s['name'],'mean_ms':s['mean_ms'],'errors':s['errors'],'resources':{role:{k:s.get(role+'_'+k) for k in ['cpu_percent','memory_percent','available_mib']} for role in ['application','database']},'metrics':a,'oom_lines':s.get('oom_lines',[]),'healthy_after':s['healthy_after'],'write_count_difference':s.get('write_count_difference')})
 (R/'evidence'/(key+'-analysis-evidence.json')).write_text(json.dumps(details,ensure_ascii=False,indent=2)+'\n')
 print(key,json.dumps(details,ensure_ascii=False))
