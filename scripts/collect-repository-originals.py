"""Collect native JTL for completed Repository reruns without restarting workloads."""
from pathlib import Path
import gzip,hashlib,json,sys
import experiment as e
R=Path(__file__).resolve().parents[1]
bundle=Path(sys.argv[1]) if len(sys.argv)>1 else R/'work/repository-rerun'
try:
 for sp in sorted((bundle/'results/runs').glob('*/summary.json')):
  dest=sp.parent
  if (dest/'original.json').exists():continue
  rp='/opt/lab4/results/'+dest.name
  digest=e.remote('compiler',f'gzip -c {rp}/all.jtl > {rp}/all.jtl.gz; sha256sum {rp}/all.jtl').split()[0]
  e.fetch('compiler',rp+'/all.jtl.gz',dest/'all.jtl.gz')
  with gzip.open(dest/'all.jtl.gz','rb') as f:raw=f.read()
  assert hashlib.sha256(raw).hexdigest()==digest
  meta={'original_jtl_sha256':digest,'compressed_sha256':hashlib.sha256((dest/'all.jtl.gz').read_bytes()).hexdigest(),'original_bytes':len(raw),'compressed_bytes':(dest/'all.jtl.gz').stat().st_size}
  (dest/'original.json').write_text(json.dumps(meta,indent=2)+'\n');print(dest.name,flush=True)
finally:
 for c in e.CLIENTS.values():c.close()
