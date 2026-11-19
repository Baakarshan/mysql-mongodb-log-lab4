from pathlib import Path
import csv,gzip,json,collections,sys
R=Path(sys.argv[1]);out={}
for p in (R/'results/runs').glob('*write*/summary.json'):
 s=json.loads(p.read_text());rows=list(csv.DictReader(gzip.open(p.parent/'measurement.jtl.gz','rt')))
 out[s['name']]={'rate':s['target_rps'],'purpose':s['purpose'],'response_codes':dict(collections.Counter(x['responseCode'] for x in rows)), 'error_messages':dict(collections.Counter(x['responseMessage'] for x in rows if x['success']!='true')), 'success_mean_ms':s['successful_mean_ms'],'write_count_difference':s['write_count_difference']}
(R/'evidence/write-response-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
for k,v in out.items():
 if v['error_messages']:print(k,json.dumps(v,ensure_ascii=False))
