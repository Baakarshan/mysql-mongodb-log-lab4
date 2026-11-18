"""核验开放式负载的原始请求、到达计数和数据库增长。"""
from pathlib import Path
import argparse,collections,csv,gzip,hashlib,json,math,statistics
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();R=a.bundle;runs=[]
for file in sorted((R/'results/runs').glob('*/summary.json')):
 d=file.parent;s=json.loads(file.read_text());raw=gzip.decompress((d/'all.jtl.gz').read_bytes());meta=json.loads((d/'original.json').read_text())
 assert hashlib.sha256(raw).hexdigest()==meta['original_jtl_sha256']
 assert hashlib.sha256((d/'all.jtl.gz').read_bytes()).hexdigest()==meta['compressed_sha256']
 with gzip.open(d/'all.jtl.gz','rt') as f:rows=list(csv.DictReader(f))
 formal=[r for r in rows if s['measurement_start_ms']<=int(r['timeStamp'])<s['measurement_end_ms']]
 with gzip.open(d/'measurement.jtl.gz','rt') as f:assert list(csv.DictReader(f))==formal
 assert len(formal)==s['samples']
 errors=sum(r['success']!='true' for r in formal);assert errors==s['errors']
 assert s['error_rate']==(errors/len(formal) if formal else 1)
 assert s['throughput_rps']==len(formal)/25
 assert s['successful_rps']==(len(formal)-errors)/25
 assert s['all_success']==sum(r['success']=='true' for r in rows)
 assert all(int(r['dispatchLagMicros'])>=0 and int(r['timeStamp'])>=int(r['scheduledTime']) for r in rows)
 assert len({r['threadName'] for r in rows})==len(rows)
 values=sorted(int(r['elapsed']) for r in formal)
 for key,q in [('p50_ms',.5),('p95_ms',.95),('p99_ms',.99)]:
  pos=(len(values)-1)*q;lo=int(pos);v=values[lo]+(values[min(lo+1,len(values)-1)]-values[lo])*(pos-lo) if values else None
  assert s[key]==v
 hps=[sum(s['measurement_start_ms']+i*1000<=int(r['timeStamp'])<s['measurement_start_ms']+(i+1)*1000 for r in formal) for i in range(25)]
 assert hps==s['hits_per_second']
 arrival=json.loads((d/'arrivals.json').read_text())
 assert sum(x['scheduled'] for x in arrival['per_second'])==s['target_rps']*35
 assert sum(x['started'] for x in arrival['per_second'])==len(rows)
 assert sum(x['scheduled']-x['dropped'] for x in arrival['per_second'])==len(rows)
 assert sum(x['completed'] for x in arrival['per_second'])==len(rows)
 assert sum(x['dropped'] for x in arrival['per_second'][10:35])==s['dropped_arrivals']
 assert sum(x['on_wire'] for x in arrival['per_second'][10:35])==s['on_wire_requests']
 assert s['generator_role']=='monitor' and s['load_model']=='open-fixed-interval'
 assert s['records_before']==100000
 difference=s['records_after']-100000-(s['all_success'] if s['operation']=='write' else 0)
 assert difference==s['write_count_difference']
 assert all(v['status']=='success' for v in json.loads((d/'monitoring.json').read_text()).values())
 runs.append(s)
for backend in {s['backend'] for s in runs}:
 smoke=json.loads((R/'evidence'/f'{backend}-smoke.json').read_text());assert smoke['passed'] and len(smoke['checks'])==14
result={'verified':True,'load_model':'open-fixed-interval','generator':'Manager','runs':len(runs),'measurement_samples':sum(s['samples'] for s in runs),'measurement_errors':sum(s['errors'] for s in runs),'dropped_formal_arrivals':sum(s['dropped_arrivals'] for s in runs),'write_count_differences':[{'run':s['name'],'difference':s['write_count_difference']} for s in runs if s['write_count_difference']]}
(R/'results/audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False,indent=2))
