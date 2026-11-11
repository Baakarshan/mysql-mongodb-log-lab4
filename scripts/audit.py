"""Audit every raw request, clamp statistics to an exact 120-second window."""
import csv,gzip,json,pathlib,hashlib,statistics,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def audit(path):
 s=json.loads((path/'summary.json').read_text())
 if s.get('audited'):
  for f,h in s['files'].items():assert sha(path/f)==h
  return s
 rows=[];fields=None
 for name in ['warmup.jtl.gz','measurement.jtl.gz']:
  with gzip.open(path/name,'rt') as f:
   r=csv.DictReader(f);fields=r.fieldnames;rows.extend(r)
 warm=[];formal=[];tail=[]
 for r in rows:
  t=int(r['timeStamp'])
  (warm if t<s['measurement_start_ms'] else formal if t<s['measurement_end_ms'] else tail).append(r)
 for name,part in [('warmup.jtl.gz',warm),('measurement.jtl.gz',formal),('cooldown.jtl.gz',tail)]:
  with gzip.open(path/name,'wt',newline='') as f:
   w=csv.DictWriter(f,fields);w.writeheader();w.writerows(part)
 lat=sorted(int(r['elapsed']) for r in formal)
 def q(p):
  if not lat:return None
  k=(len(lat)-1)*p;i=int(k);return lat[i]+(lat[min(i+1,len(lat)-1)]-lat[i])*(k-i)
 successes=sum(r['success']=='true' for r in rows);errors=sum(r['success']!='true' for r in formal)
 assert successes==s['all_success']
 assert s['records_before']==100000 and s['records_after']==100000+(successes if s['operation']=='write' else 0)
 s.update(samples=len(formal),warmup_samples=len(warm),cooldown_samples=len(tail),errors=errors,error_rate=errors/len(formal) if formal else 1,throughput_rps=len(formal)/120,mean_ms=statistics.mean(lat) if lat else None,p50_ms=q(.5),p95_ms=q(.95),p99_ms=q(.99),max_ms=max(lat) if lat else None,all_http_samples=len(rows),audited=True)
 s['files']={n:sha(path/n) for n in ['warmup.jtl.gz','measurement.jtl.gz','cooldown.jtl.gz']}
 (path/'summary.json').write_text(json.dumps(s,indent=2));return s
if __name__=='__main__':
 results=[audit(p.parent) for p in sorted((ROOT/'results/runs').glob('*/summary.json'))]
 expected={(b,o,t,r) for b in ['mysql','mongo'] for o in ['read','write'] for t in [1,10,25,50,100,200] for r in [1,2,3]}
 actual={(s['backend'],s['operation'],s['threads'],s['repeat']) for s in results}
 if '--complete' in sys.argv:assert expected==actual,sorted(expected-actual)
 (ROOT/'results/audit.json').write_text(json.dumps({'runs':len(results),'measurement_samples':sum(s['samples'] for s in results),'measurement_errors':sum(s['errors'] for s in results),'all_http_samples':sum(s['all_http_samples'] for s in results),'all_record_counts_verified':all(s['record_count_verified'] for s in results),'complete':actual==expected},indent=2))
 print((ROOT/'results/audit.json').read_text())
