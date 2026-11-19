"""独立复核单轮MySQL读取结果及发送端有效性。"""
import sys,json,csv,gzip,statistics,hashlib,datetime
from pathlib import Path
R=Path(sys.argv[1]);rows=[]
for p in sorted((R/'results/runs').glob('*/summary.json')):
 s=json.loads(p.read_text());d=p.parent;allrows=[x for x in csv.DictReader(gzip.open(d/'all.jtl.gz','rt')) if x['label']=='read'];formal=[x for x in allrows if s['measurement_start_ms']<=int(x['timeStamp'])<s['measurement_end_ms']]
 assert len(formal)==s['samples'];assert statistics.mean(int(x['elapsed']) for x in formal)==s['mean_ms'];assert sum(x['success']!='true' for x in formal)==s['errors'];assert len(allrows)==s['threads']==len({x['threadName'] for x in allrows});assert s['records_before']==s['records_after']==100000
 sender=json.loads((d/'sender-audit.json').read_text());assert sender['passed'];assert sender['pids_events_before']==sender['pids_events_after']
 m=json.loads((d/'monitoring.json').read_text())
 for role in ['application','database']:
  for key,name in [('host_memory_used_percent','memory_percent'),('host_memory_available_mib','available_mib'),('host_cpu_percent','cpu_percent')]:
   v=[float(v) for x in m[key]['data'].get('result',[]) if x['metric'].get('role')==role for t,v in x.get('values',[]) if s['measurement_start_ms']/1000<=t<s['measurement_end_ms']/1000 and v not in ['NaN','+Inf','-Inf']]
   s[role+'_'+name]={'min':min(v),'max':max(v),'mean':statistics.mean(v)} if v else None
 s['sender_audit']=sender
 s['oom_lines']=[x for x in (d/'kernel.log').read_text().splitlines() if 'Out of memory:' in x or 'Killed process' in x]
 rows.append(s)
rows.sort(key=lambda s:s['start_ms']);assert rows
(R/'results/all-runs.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
keys=['name','purpose','target_rps','threads','samples','errors','mean_ms','p95_ms','error_rate','hps_min','hps_max','classification']
with (R/'results/all-runs.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,keys,extrasaction='ignore');w.writeheader();w.writerows(rows)
(R/'results/audit.json').write_text(json.dumps({'runs':len(rows),'formal_samples':sum(x['samples'] for x in rows),'senders_all_passed':True,'one_request_per_thread':True,'records_unchanged':True,'verified_at':datetime.datetime.now(datetime.timezone.utc).isoformat()},indent=2)+'\n')
print(json.dumps([{k:x[k] for k in ['name','target_rps','mean_ms','error_rate','hps_min','hps_max','classification']} for x in rows],indent=2))
