"""生成四类原始结果索引；指标直接来自核验后的JTL汇总。"""
from pathlib import Path
import json,sys,html
r=Path(sys.argv[1]);runs=json.loads((r/'results/all-runs.json').read_text());items=[]
for s in runs:
 k=s['backend']+'-'+s['operation'];items.append({'类别':k,'运行':s['name'],'用途':s['purpose'],'目标HPS':s['target_rps'],'线程总数':s['threads'],'样本数':s['samples'],'平均ms':round(s['mean_ms'],4),'P95ms':round(s['p95_ms'],3),'错误数':s['errors'],'错误率':round(s['error_rate'],6),'最小HPS':s['hps_min'],'最大HPS':s['hps_max'],'HPS':s['hits_per_second'],'开始UTC':__import__('datetime').datetime.fromtimestamp(s['measurement_start_ms']/1000,__import__('datetime').timezone.utc).isoformat()})
headers=list(items[0]);table=''
for x in items:
 cells=[]
 for k,v in x.items():
  if k=='运行':v=f'<a href="results/runs/{html.escape(v)}/summary.json">{html.escape(v)}</a>'
  elif k=='HPS':v=html.escape(', '.join(map(str,v)))
  else:v=html.escape(str(v))
  cells.append('<td>'+v+'</td>')
 cells.append(f'<td><a href="results/runs/{x["运行"]}/measurement.jtl.gz">正式JTL</a> · <a href="results/runs/{x["运行"]}/all.jtl.gz">全部JTL</a> · <a href="results/runs/{x["运行"]}/monitoring.json">监控</a></td>')
 table+='<tr data-category="'+x['类别']+'">'+''.join(cells)+'</tr>'
links=' · '.join(f'<a href="groups/{k}/results/html/{k}-comparison/index.html">{k} JMeter</a>' for k in ['mysql-read','mysql-write','mongo-read','mongo-write'])
page='''<!doctype html><html lang="zh"><meta charset="utf-8"><title>实验四原始结果</title><style>body{font:14px system-ui;margin:24px;color:#172337}h1{font-size:24px}a{color:#0066a3}button{padding:8px 14px;margin-right:8px;background:white;border:1px solid #b7c2cd;border-radius:4px;cursor:pointer}table{border-collapse:collapse;white-space:nowrap;font-size:12px;margin-top:16px}th,td{padding:8px;border:1px solid #d3dbe3;text-align:right}th{background:#ecf1f6;position:sticky;top:0}td:nth-child(1),td:nth-child(2),td:nth-child(3){text-align:left}.scroll{overflow:auto;max-height:78vh}p{line-height:1.7}</style><h1>实验四四类原始结果</h1><p>所有指标来自保留的原始JTL。HPS逐秒列出正式20秒窗口的请求开始数；平均耗时包含成功和失败请求。预热、发送失败及参数排查在独立目录保存。</p><p>LINKS</p><div id="filters"><button data-value="all">全部</button><button data-value="mysql-read">MySQL读取</button><button data-value="mysql-write">MySQL写入</button><button data-value="mongo-read">MongoDB读取</button><button data-value="mongo-write">MongoDB写入</button></div><div class="scroll"><table><thead><tr>HEAD</tr></thead><tbody>ROWS</tbody></table></div><script>document.querySelectorAll('button').forEach(b=>b.onclick=()=>{document.querySelectorAll('tbody tr').forEach(r=>r.hidden=b.dataset.value!=='all'&&r.dataset.category!==b.dataset.value)});</script></html>'''
(r/'index.html').write_text(page.replace('LINKS',links).replace('HEAD',''.join('<th>'+x+'</th>' for x in headers+['原始文件'])).replace('ROWS',table))
print('原始结果索引',len(items))
