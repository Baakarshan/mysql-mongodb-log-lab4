"""Preserve each complete native JMeter JTL byte-for-byte with lossless gzip."""
import pathlib,json,hashlib,gzip
import experiment
R=pathlib.Path(__file__).resolve().parents[1]
try:
 for path in sorted((R/'results/runs').glob('*/summary.json')):
  dest=path.parent;name=dest.name;remote='/opt/lab4/results/'+name
  out=experiment.remote('compiler',f'gzip -c {remote}/all.jtl > {remote}/all.jtl.gz; sha256sum {remote}/all.jtl').split()[0]
  experiment.fetch('compiler',remote+'/all.jtl.gz',dest/'all.jtl.gz')
  with gzip.open(dest/'all.jtl.gz','rb') as f:raw=f.read()
  assert hashlib.sha256(raw).hexdigest()==out
  meta={'original_jtl_sha256':out,'compressed_sha256':hashlib.sha256((dest/'all.jtl.gz').read_bytes()).hexdigest(),'original_bytes':len(raw),'compressed_bytes':(dest/'all.jtl.gz').stat().st_size}
  (dest/'original.json').write_text(json.dumps(meta,indent=2));print(name,meta['original_bytes'],flush=True)
finally:
 for c in experiment.CLIENTS.values():c.close()
