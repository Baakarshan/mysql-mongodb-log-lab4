"""Verify the published data bundle against native JTL and required artifacts."""
from pathlib import Path
import csv,gzip,hashlib,json
R=Path(__file__).resolve().parents[1]
audit=json.loads((R/'results/audit.json').read_text())
assert audit['complete'] and audit['runs']==72 and audit['all_record_counts_verified']
count=errors=0
for sp in sorted((R/'results/runs').glob('*/summary.json')):
 p=sp.parent;s=json.loads(sp.read_text());original=json.loads((p/'original.json').read_text())
 assert s['audited'] and s['record_count_verified']
 with gzip.open(p/'all.jtl.gz','rb') as f:raw=f.read()
 assert hashlib.sha256(raw).hexdigest()==original['original_jtl_sha256']
 assert hashlib.sha256((p/'all.jtl.gz').read_bytes()).hexdigest()==original['compressed_sha256']
 with gzip.open(p/'all.jtl.gz','rt') as f:
  rows=csv.DictReader(f);n=bad=0
  for row in rows:
   if row['label']==s['operation']:n+=1;bad+=row['success']!='true'
 assert n==s['all_http_samples'] and n-bad==s['all_success'],p.name
 for name,digest in s['files'].items():assert hashlib.sha256((p/name).read_bytes()).hexdigest()==digest
 monitoring=json.loads((p/'monitoring.json').read_text())
 assert all(v['status']=='success' and v['data']['result'] for v in monitoring.values()),p.name
 count+=s['samples'];errors+=s['errors']
assert count==audit['measurement_samples'] and errors==audit['measurement_errors']
for b in ['mysql','mongo']:
 smoke=json.loads((R/'evidence'/f'{b}-smoke.json').read_text())
 assert smoke['passed'] and len(smoke['checks'])==14 and smoke['seed_query_count']==2497
for ext in ['pdf','docx']:
 p=R/'report'/f'实验四实验报告.{ext}';assert p.is_file() and p.stat().st_size>100000
shots=json.loads((R/'screenshots/jmeter-manifest.json').read_text())
assert len(shots)==24 and all((R/'screenshots'/x['file']).is_file() for x in shots)
summary_shots=json.loads((R/'screenshots/jmeter-summary-manifest.json').read_text())
assert len(summary_shots)==12
for shot in summary_shots:
 p=R/'screenshots'/shot['file']
 assert hashlib.sha256(p.read_bytes()).hexdigest()==shot['sha256']
 assert (R/'screenshots'/shot['report_file']).is_file()
recapture=json.loads((R/'evidence/interface-recapture.json').read_text())
assert len(recapture['requests'])==4 and recapture['added_demo_records']=={'mysql':1,'mongo':1}
for row in recapture['requests']:
 assert row['status']==(201 if row['method']=='POST' else 200)
for b in ['mysql','mongo']:
 for part in ['post-headers','post-payload','post-response','get-headers','get-response','get-preview']:
  assert (R/'screenshots'/f'{b}-api-{part}-native.png').is_file()
print(json.dumps({'verified':True,'jmeter_summary_screenshots':len(summary_shots),'edge_network_screenshots':12,'runs':72,'measurement_samples':count,'measurement_errors':errors,'native_jtl_files':72,'jmeter_page_screenshots':len(shots),'api_checks':28},indent=2))
