"""Verify Repository reruns before replacing the published Template measurements."""
from pathlib import Path
import csv,gzip,hashlib,json,sys
R=Path(__file__).resolve().parents[1]
bundle=Path(sys.argv[1]) if len(sys.argv)>1 else R/'work/repository-rerun'
sys.path.insert(0,str(R/'scripts'))
from audit import audit
expected={f'mongo-{op}-t{t}-r{r}' for op in ['read','write'] for t in [1,10,25,50,100,200] for r in [1,2,3]}
paths={p.parent.name:p.parent for p in (bundle/'results/runs').glob('*/summary.json')}
assert set(paths)==expected,sorted(expected-set(paths))
rows=[]
for name,path in sorted(paths.items()):
 s=audit(path);original=json.loads((path/'original.json').read_text())
 data=(path/'all.jtl.gz').read_bytes();assert hashlib.sha256(data).hexdigest()==original['compressed_sha256']
 with gzip.open(path/'all.jtl.gz','rb') as f:raw=f.read()
 assert hashlib.sha256(raw).hexdigest()==original['original_jtl_sha256']
 with gzip.open(path/'all.jtl.gz','rt') as f:
  samples=[r for r in csv.DictReader(f) if r['label']==s['operation']]
 assert len(samples)==s['all_http_samples']
 assert sum(r['success']=='true' for r in samples)==s['all_success']
 monitoring=json.loads((path/'monitoring.json').read_text())
 assert all(v['status']=='success' and v['data']['result'] for v in monitoring.values())
 rows.append(s)
smoke=json.loads((bundle/'evidence/mongo-smoke.json').read_text());assert smoke['passed'] and len(smoke['checks'])==14
result={'verified':True,'implementation':'MongoRepository','runs':len(rows),'measurement_samples':sum(r['samples'] for r in rows),'measurement_errors':sum(r['errors'] for r in rows),'record_counts_verified':True,'api_checks':len(smoke['checks'])}
(bundle/'evidence/repository-rerun-verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
