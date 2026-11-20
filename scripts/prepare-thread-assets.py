"""准备单次线程实验的页面索引、原始证据和报告配图。"""
from pathlib import Path
import argparse,json,shutil,html
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();R=a.bundle;repo=Path(__file__).resolve().parents[1]
for sub in ['screenshots','report','results/html']:(R/sub).mkdir(exist_ok=True,parents=True)
for name in ['mysql-api.png','mongo-api.png','mysql-api-post.png','mongo-api-post.png']:
 shutil.copy2(repo/'screenshots'/name,R/'screenshots'/name)
for name in ['source-revision.json','interface-recapture.json','build.txt','local-maven-verify.txt']:
 if (repo/'evidence'/name).exists():shutil.copy2(repo/'evidence'/name,R/'evidence'/name)
selected=json.loads((R/'results/selected-runs.json').read_text());runs=json.loads((R/'results/all-runs.json').read_text());lookup={s['name']:s for s in runs}
for names in selected.values():
 for name in names:shutil.copytree(R/'work/html'/name,R/'results/html'/name,dirs_exist_ok=True)
body=['<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>实验四原始数据</title><style>body{font:16px system-ui;max-width:1200px;margin:40px auto;color:#222}table{border-collapse:collapse;width:100%;font-size:14px}th,td{padding:8px;border:1px solid #ddd;text-align:right}th:first-child,td:first-child{text-align:left}a{color:#14579c}th{background:#f3f4f5}</style><h1>实验四：单次线程请求测试</h1><p>每逻辑线程一次请求，55秒等间隔发送；主指标为平均响应时间。正式窗口为时钟起点后30–50秒。表中数据来自原生JTL，HPS按20个完整秒统计；逐秒偏离均值、前后5秒均值漂移及平均速率偏离计划均须不超过10%。</p><p><a href="../all-runs.csv">全部结果CSV</a> · <a href="../audit.json">核验结果</a> · <a href="../hps-audit/audit.csv">HPS逐档核验</a></p><h2>原生JMeter报告</h2><ul>']
for names in selected.values():
 for name in names:body.append(f'<li><a href="{html.escape(name)}/index.html">{html.escape(name)}</a></li>')
body.append('</ul><h2>逐次结果</h2><table><tr><th>运行</th><th>线程数</th><th>工作线程上限</th><th>均值ms</th><th>实际HPS</th><th>HPS范围</th><th>最大/最小</th><th>最大偏差</th><th>首尾漂移</th><th>错误率</th><th>发送条件</th></tr>')
for s in runs:
 ratio=s['hps_max_min_ratio'];body.append(f'<tr><td><a href="../runs/{s["name"]}/summary.json">{s["name"]}</a><br><a href="../runs/{s["name"]}/all.jtl.gz">JTL</a> · <a href="../runs/{s["name"]}/monitoring.json">监控</a></td><td>{s["threads"]}</td><td>{s.get("tomcat_max_threads",200)}</td><td>{s["mean_ms"]:.2f}</td><td>{s["throughput_rps"]:.2f}</td><td>{s["hps_min"]}–{s["hps_max"]}</td><td>{ratio:.3f}</td><td>{s["hps_quality"]["max_deviation_fraction"]:.1%}</td><td>{s["hps_quality"]["edge_drift_fraction"]:.1%}</td><td>{s["error_rate"]:.2%}</td><td>{"不合格" if s["generator_limit"] else "合格"}</td></tr>' if ratio is not None else f'<tr><td>{s["name"]}</td><td colspan="8">HPS存在零秒分箱，详见原始结果</td></tr>')
body.append('</table>')
if (R/'results/aborted-runs.json').exists():
 aborted=json.loads((R/'results/aborted-runs.json').read_text())
 if aborted:
  body.append('<h2>预热阶段中断</h2><p>下列运行没有正式窗口样本，原始记录用于故障排查。</p><ul>')
  for s in aborted:body.append(f'<li>{s["name"]}，计划{s["target_rps"]}次/秒，正式样本{s["formal_samples"]}条：<a href="../../evidence/aborted-before-measurement/{s["name"]}/all.jtl.gz">原始JTL</a></li>')
  body.append('</ul>')
body.append('</html>');(R/'results/html/index.html').write_text('\n'.join(body))
print('Prepared',len(runs),'runs')
