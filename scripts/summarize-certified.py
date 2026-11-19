"""从原始JTL复核读写样本、发送质量、记录增长与同窗CPU/内存。"""
import argparse,csv,datetime,gzip,json,statistics,math
from collections import Counter
from hps_quality import assess
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();root=a.bundle;rows=[]
for path in (root/'results/runs').glob('*/summary.json'):
 s=json.loads(path.read_text());d=path.parent
 allrows=[x for x in csv.DictReader(gzip.open(d/'all.jtl.gz','rt')) if x['label']==s['operation']]
 formal=[x for x in allrows if s['measurement_start_ms']<=int(x['timeStamp'])<s['measurement_end_ms']]
 assert len(formal)==s['samples']
 assert formal==list(csv.DictReader(gzip.open(d/'measurement.jtl.gz','rt')))
 counts=Counter((int(x['timeStamp'])-s['measurement_start_ms'])//1000 for x in formal)
 hits=[counts.get(i,0) for i in range(20)]
 assert hits==s['hits_per_second']
 assert assess(hits,s['target_rps'])['passed']
 elapsed=sorted(int(x['elapsed']) for x in formal)
 for prop,pct in [('p50_ms',.5),('p95_ms',.95),('p99_ms',.99)]:
  rank=(len(elapsed)-1)*pct;i=math.floor(rank);j=math.ceil(rank);value=elapsed[i]+(elapsed[j]-elapsed[i])*(rank-i)
  assert math.isclose(value,s[prop],rel_tol=1e-10,abs_tol=1e-8),(s['name'],prop,value,s[prop])
 assert statistics.mean(int(x['elapsed']) for x in formal)==s['mean_ms']
 assert sum(x['success']!='true' for x in formal)==s['errors']
 assert len(allrows)==s['threads']==len({x['threadName'] for x in allrows})
 assert s['records_before']==100000
 if s['operation']=='read':assert s['records_after']==100000
 else:
  assert s['write_count_difference']==s['records_after']-s['records_before']-sum(x['success']=='true' for x in allrows)
  if not any(x['success']!='true' for x in allrows):assert s['write_count_difference']==0
 sender=json.loads((d/'sender-audit.json').read_text());assert sender['passed'];assert sender['pids_events_before']==sender['pids_events_after'];s['sender_audit']=sender
 m=json.loads((d/'monitoring.json').read_text())
 for role in ['application','database','compiler','monitor']:
  for key,name in [('host_memory_used_percent','memory_percent'),('host_memory_available_mib','available_mib'),('host_cpu_percent','cpu_percent')]:
   v=[float(v) for x in m[key]['data'].get('result',[]) if x['metric'].get('role')==role for t,v in x.get('values',[]) if s['measurement_start_ms']/1000<=t<s['measurement_end_ms']/1000 and v not in ['NaN','+Inf','-Inf']]
   s[role+'_'+name]={'min':min(v),'max':max(v),'mean':statistics.mean(v),'samples':len(v),'expected_samples':int((s['measurement_end_ms']-s['measurement_start_ms'])/2000)} if v else None
 s['oom_lines']=[x for x in (d/'kernel.log').read_text().splitlines() if 'Out of memory:' in x or 'Killed process' in x]
 rows.append(s)
rows.sort(key=lambda s:s['start_ms']);assert rows
(root/'results/all-runs.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
keys=['name','backend','operation','purpose','target_rps','threads','samples','errors','mean_ms','p95_ms','error_rate','hps_min','hps_max','classification','records_before','records_after','write_count_difference']
with (root/'results/all-runs.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,keys,extrasaction='ignore');w.writeheader();w.writerows(rows)
(root/'results/audit.json').write_text(json.dumps({'runs':len(rows),'formal_samples':sum(x['samples'] for x in rows),'senders_all_passed':True,'one_request_per_thread':True,'read_records_unchanged':True,'write_count_checked':True,'verified_at':datetime.datetime.now(datetime.timezone.utc).isoformat()},indent=2)+'\n')
print('已核验',len(rows),'次运行',sum(x['samples'] for x in rows),'条正式样本')
