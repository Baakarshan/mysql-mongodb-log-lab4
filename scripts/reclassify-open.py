"""由原始日志区分独立调度限制与请求传输失败。"""
from pathlib import Path
import argparse,json,csv,gzip,collections
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();changes=[]
for file in (a.bundle/'results/runs').glob('*/summary.json'):
 s=json.loads(file.read_text());before=s['generator_limit']
 with gzip.open(file.parent/'measurement.jtl.gz','rt') as f:rows=list(csv.DictReader(f))
 types=collections.Counter()
 for r in rows:
  if r['success']=='true':continue
  msg=r['responseMessage']
  kind='连接超时' if 'dial tcp' in msg and 'timeout' in msg else '请求超时' if 'Client.Timeout' in msg or 'context deadline exceeded' in msg else '连接重置' if 'connection reset by peer' in msg else '连接拒绝' if 'connection refused' in msg else '本机端口耗尽' if 'cannot assign requested address' in msg else '文件描述符耗尽' if 'too many open files' in msg else 'HTTP '+r['responseCode'] if r['responseCode'].isdigit() else '其他传输错误'
  types[kind]+=1
 s['failure_types']=dict(types)
 mem=s.get('generator_min_available_mib')
 s['request_delivery_failure']=s['on_wire_ratio']<.98
 s['generator_limit']=bool(s['generator_exit_code']!=0 or s['actual_start_ratio']<.98 or s['dropped_arrivals']>s['target_rps']*.25 or (mem is not None and mem<32) or types.get('本机端口耗尽') or types.get('文件描述符耗尽'))
 s['classification']='generator_limit' if s['generator_limit'] else 'service_degradation' if s['severe_degradation'] else 'controlled_load' if (s['p95_ms'] or 0)<500 else 'saturation'
 if before!=s['generator_limit']:changes.append({'run':s['name'],'before_generator_limit':before,'after_generator_limit':s['generator_limit'],'reason':'独立调度跟上目标；发送下降伴随连接或请求失败，单凭发送比例不足不能归因发压器。'})
 file.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
old=a.bundle/'evidence/classification-corrections.json'
previous=json.loads(old.read_text()) if old.exists() else []
old.write_text(json.dumps(previous+changes,ensure_ascii=False,indent=2)+'\n')
print('Classification updates:',len(changes))
