"""Verify native JTL hashes and progressive-run windows, including failed requests."""
from pathlib import Path
import argparse,csv,gzip,hashlib,json,collections,math,statistics
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();R=a.bundle
out=[]
for sp in sorted((R/'results/runs').glob('*/summary.json')):
 d=sp.parent;s=json.loads(sp.read_text());meta=json.loads((d/'original.json').read_text());data=(d/'all.jtl.gz').read_bytes();raw=gzip.decompress(data)
 assert hashlib.sha256(raw).hexdigest()==meta['original_jtl_sha256']
 assert hashlib.sha256(data).hexdigest()==meta['compressed_sha256']
 with gzip.open(d/'all.jtl.gz','rt') as f:allrows=[r for r in csv.DictReader(f) if r['label']==s['operation']]
 formal=[r for r in allrows if s['measurement_start_ms']<=int(r['timeStamp'])<s['measurement_end_ms']]
 with gzip.open(d/'measurement.jtl.gz','rt') as f:assert list(csv.DictReader(f))==formal
 assert s['samples']==len(formal)
 assert s['errors']==sum(r['success']!='true' for r in formal)
 assert s['all_success']==sum(r['success']=='true' for r in allrows)
 assert s['throughput_rps']==len(formal)/25
 assert s['successful_rps']==sum(r['success']=='true' for r in formal)/25
 assert s['error_rate']==(s['errors']/len(formal) if formal else 1)
 elapsed=sorted(int(r['elapsed']) for r in formal)
 for field,q in [('p50_ms',.5),('p95_ms',.95),('p99_ms',.99)]:
  if elapsed:
   pos=(len(elapsed)-1)*q;lo=int(pos);expected=elapsed[lo]+(elapsed[min(lo+1,len(elapsed)-1)]-elapsed[lo])*(pos-lo)
   assert math.isclose(s[field],expected,rel_tol=1e-12), (s['name'],field)
  else:assert s[field] is None
 assert s['records_before']==100000
 if s['operation']=='read':assert s['records_after']==100000
 else:assert s['records_after']-100000>=s['all_success']
 assert sum(s['hits_per_second'])==len(formal)
 hps=[sum(s['measurement_start_ms']+i*1000<=int(r['timeStamp'])<s['measurement_start_ms']+(i+1)*1000 for r in formal) for i in range(25)]
 assert hps==s['hits_per_second']
 bins=[sum(hps[i:i+5])/5 for i in range(0,25,5)]
 assert bins==s['hits_per_second_5s']
 if sum(bins):assert math.isclose(s['hps_cv_5s'],statistics.pstdev(bins)/statistics.mean(bins),rel_tol=1e-12)
 config=json.loads((d/'config.json').read_text())
 assert config['generator_role']==s['generator_role']
 assert config['generator_heap_mib']==s['generator_heap_mib']
 assert f"Max memory     ={s['generator_heap_mib']*1024*1024}" in (d/'jmeter.log').read_text()
 assert all(v['status']=='success' for v in json.loads((d/'monitoring.json').read_text()).values())
 out.append(s)
backends=sorted({s['backend'] for s in out})
for b in backends:
 smoke=json.loads((R/'evidence'/f'{b}-smoke.json').read_text());assert smoke['passed'] and len(smoke['checks'])==14
result=dict(verified=True,runs=len(out),measurement_samples=sum(s['samples'] for s in out),measurement_errors=sum(s['errors'] for s in out),backends=backends,write_count_differences=[{'run':s['name'],'difference':s['write_count_difference']} for s in out if s['write_count_difference']])
(R/'results/audit.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
