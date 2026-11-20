"""从每份原始JTL重新统计HPS，生成逐档平台核验清单。"""
import argparse,csv,gzip,json,statistics
from pathlib import Path
from hps_quality import assess
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--output',type=Path);a=p.parse_args()
out=a.output or a.bundle/'results/hps-audit';out.mkdir(parents=True,exist_ok=True)
rows=[]
for d in sorted((a.bundle/'results/runs').iterdir()):
 if not (d/'summary.json').exists():continue
 s=json.loads((d/'summary.json').read_text());begin=s['measurement_start_ms'];end=s['measurement_end_ms']
 with gzip.open(d/'all.jtl.gz','rt') as f:raw=[r for r in csv.DictReader(f) if r['label'] in ['read','write'] and begin<=int(r['timeStamp'])<end]
 hits=[sum(begin+i*1000<=int(r['timeStamp'])<begin+(i+1)*1000 for r in raw) for i in range(20)]
 assert hits==s['hits_per_second'],s['name']
 q=assess(hits,s['target_rps']);rows.append(dict(name=s['name'],backend=s['backend'],operation=s['operation'],threads=s['threads'],purpose=s['purpose'],target_rps=s['target_rps'],hps=hits,**q))
result={'criteria':{'max_absolute_deviation_from_window_mean':.10,'first_last_five_seconds_mean_difference_over_window_mean':.10,'mean_deviation_from_target':.10},'runs':len(rows),'failed':sum(not r['passed'] for r in rows),'rows':rows}
(out/'audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
with (out/'audit.csv').open('w',newline='') as f:
 keys=[k for k in rows[0] if k not in ['hps','reasons']]+['reasons'];w=csv.DictWriter(f,keys,extrasaction='ignore',lineterminator='\n');w.writeheader();w.writerows({**r,'reasons':'；'.join(r['reasons'])} for r in rows)
print(json.dumps({'runs':len(rows),'failed':result['failed'],'failed_names':[r['name'] for r in rows if not r['passed']]},ensure_ascii=False,indent=2))
