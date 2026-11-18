"""补充各档网络吞吐、丢包与TCP重传序列，供响应转折排查。"""
from pathlib import Path
import argparse,json,os,shlex
import experiment as r
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();runs=[json.loads(x.read_text()) for x in (a.bundle/'results/runs').glob('*/summary.json')]
queries={'network_transmit_bytes_per_second':'sum by (role) (rate(node_network_transmit_bytes_total{device!="lo",device!~"docker.*|veth.*|br-.*"}[10s]))','network_receive_bytes_per_second':'sum by (role) (rate(node_network_receive_bytes_total{device!="lo",device!~"docker.*|veth.*|br-.*"}[10s]))','network_transmit_drop_per_second':'sum by (role) (rate(node_network_transmit_drop_total{device!="lo"}[10s]))','tcp_retransmits_per_second':'rate(node_netstat_Tcp_RetransSegs[10s])'}
r.QUERIES=queries
start=min(s['start_ms'] for s in runs)/1000;end=max(s['measurement_end_ms'] for s in runs)/1000+8
allseries=r.monitoring(start,end)
(a.bundle/'evidence/network-history.json').write_text(json.dumps(allseries,ensure_ascii=False,indent=2)+'\n')
for s in runs:
 path=a.bundle/'results/runs'/s['name']/'monitoring.json';m=json.loads(path.read_text())
 for key,res in allseries.items():
  copy=json.loads(json.dumps(res))
  for series in copy.get('data',{}).get('result',[]):series['values']=[[t,v] for t,v in series.get('values',[]) if s['start_ms']/1000<=t<=s['measurement_end_ms']/1000+8]
  m[key]=copy
 path.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print('已补充',len(runs),'次运行的网络指标')
