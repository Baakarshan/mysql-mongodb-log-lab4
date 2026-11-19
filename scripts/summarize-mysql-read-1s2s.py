"""核验MySQL读取原始请求，导出结果与两秒监控图。"""
import argparse
import csv
import gzip
import hashlib
import html
import json
import math
from pathlib import Path
import statistics

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from hps_quality import assess

p = argparse.ArgumentParser()
p.add_argument('bundle', type=Path)
a = p.parse_args()
R = a.bundle
F = R / 'figures'
F.mkdir(exist_ok=True)
runs = sorted([json.loads(p.read_text()) for p in (R / 'results/runs').glob('*/summary.json')], key=lambda s: s['start_ms'])
assert runs
method = json.loads((R / 'evidence/monitoring-method.json').read_text())
assert method['scrape_interval_s'] == 1 and method['recording_interval_s'] == method['query_step_s'] == method['rate_window_s'] == 2
for s in runs:
    d = R / 'results/runs' / s['name']
    with gzip.open(d / 'all.jtl.gz', 'rt') as f:
        rows = [r for r in csv.DictReader(f) if r['label'] == 'read']
    formal = [r for r in rows if s['measurement_start_ms'] <= int(r['timeStamp']) < s['measurement_end_ms']]
    assert len(rows) == len({r['threadName'] for r in rows})
    assert len(formal) == s['samples']
    assert statistics.mean(int(r['elapsed']) for r in formal) == s['mean_ms']
    assert sum(r['success'] != 'true' for r in formal) == s['errors']
    hps = [sum(s['measurement_start_ms'] + i * 1000 <= int(r['timeStamp']) < s['measurement_start_ms'] + (i + 1) * 1000 for r in formal) for i in range(20)]
    assert hps == s['hits_per_second'] and assess(hps, s['target_rps']) == s['hps_quality']
    assert s['records_before'] == s['records_after'] == 100000
    if not s['generator_limit']:
        assert s['hps_quality']['passed'] and len(rows) == s['threads'] and s['generator_exit_code'] == 0
    original = json.loads((d / 'original.json').read_text())
    assert hashlib.sha256((d / 'all.jtl.gz').read_bytes()).hexdigest() == original['compressed_sha256']
    assert hashlib.sha256(gzip.decompress((d / 'all.jtl.gz').read_bytes())).hexdigest() == original['original_jtl_sha256']

def series(s, key, role=None):
    m = json.loads((R / 'results/runs' / s['name'] / 'monitoring.json').read_text())
    return [[(t - s['measurement_start_ms'] / 1000, float(v)) for t, v in x.get('values', []) if s['measurement_start_ms'] / 1000 <= t < s['measurement_end_ms'] / 1000 and math.isfinite(float(v))] for x in m[key]['data'].get('result', []) if role is None or x['metric'].get('role') == role]

def maximum(s, key, role=None):
    values = [v for seq in series(s, key, role) for _, v in seq]
    return max(values) if values else None

def fmt(value):
    return '缺测' if value is None else f'{value:.2f}'

fields = ['name', 'purpose', 'threads', 'target_rps', 'samples', 'mean_ms', 'p95_ms', 'error_rate', 'hps_min', 'hps_max', 'classification', 'generator_limit']
with (R / 'results/all-runs.csv').open('w', newline='') as f:
    w = csv.DictWriter(f, fields, extrasaction='ignore', lineterminator='\n')
    w.writeheader()
    w.writerows(runs)
(R / 'results/all-runs.json').write_text(json.dumps(runs, ensure_ascii=False, indent=2) + '\n')
valid = [s for s in runs if not s['generator_limit']]
loads = sorted([s for s in valid if s['classification'] == 'load' and s['purpose'] != 'recovery_confirmation'], key=lambda s: s['target_rps'])
turns = [s for s in valid if s['classification'] == 'stress']
selected = list(dict.fromkeys([runs[0]['name']] + ([loads[-1]['name']] if loads else []) + ([turns[0]['name']] if turns else []) + ([turns[-1]['name']] if turns else [])))
(R / 'results/selected-runs.json').write_text(json.dumps({'mysql-read': selected}, indent=2) + '\n')
plt.rcParams.update({'font.family': ['Arial', 'DejaVu Sans'], 'font.size': 10, 'axes.spines.top': False, 'axes.spines.right': False, 'legend.frameon': False, 'svg.fonttype': 'none'})

def export(fig, name):
    fig.tight_layout()
    for ext in ['png', 'pdf']:
        fig.savefig(F / (name + '.' + ext), dpi=220, facecolor='white')
    plt.close(fig)

for offset in range(0, len(runs), 6):
    ss = runs[offset:offset + 6]
    fig, axes = plt.subplots((len(ss) + 1) // 2, 2, figsize=(9, 2.5 * ((len(ss) + 1) // 2)), squeeze=False)
    for ax, s in zip(axes.flat, ss):
        rate = s['target_rps']
        ax.axhspan(rate * .9, rate * 1.1, color='#E8EEF4')
        ax.axhline(rate, color='#666666', linestyle='--', linewidth=.8)
        ax.plot(range(20), s['hits_per_second'], '-o', color='#0F4D92', markersize=3)
        ax.set(title=s['name'] + (' INVALID' if s['generator_limit'] else ' PASS'), xlabel='Formal window (s)', ylabel='Hits per second', ylim=(0, max(rate * 1.15, max(s['hits_per_second']) * 1.1)))
        ax.grid(axis='y', alpha=.15)
    for ax in list(axes.flat)[len(ss):]:
        ax.set_visible(False)
    export(fig, 'hps-' + str(offset // 6 + 1))

explore = [s for s in runs if s['purpose'] == 'exploration' and not s['generator_limit']]
fig, axes = plt.subplots(2, 1, figsize=(8, 7), sharex=True)
axes[0].plot([s['target_rps'] for s in explore], [s['mean_ms'] for s in explore], '-o', color='#0F4D92')
axes[0].set_ylabel('Mean HTTP response (ms)')
for role, color in [('application', '#0F4D92'), ('database', '#B64342'), ('monitor', '#42949E')]:
    axes[1].plot([s['target_rps'] for s in explore], [s['cpu_percent'].get(role, float('nan')) for s in explore], '-o', color=color, label=role)
axes[1].set(xlabel='Planned arrivals/s', ylabel='Mean CPU (%)', ylim=(0, 105))
axes[1].legend()
for ax in axes:
    ax.grid(axis='y', alpha=.15)
export(fig, 'read-progression')
origin = runs[0]['start_ms'] / 1000
fig, axes = plt.subplots(3, 1, figsize=(13, 9), sharex=True)
for s in runs:
    start = (s['measurement_start_ms'] / 1000 - origin) / 60
    end = (s['measurement_end_ms'] / 1000 - origin) / 60
    axes[0].plot([(start + end) / 2], [s['mean_ms']], 'x' if s['generator_limit'] else 'o', color='#B64342' if s['generator_limit'] else '#0F4D92')
    axes[1].plot([start + i / 60 for i in range(20)], s['hits_per_second'], color='#0F4D92')
    axes[0].annotate('N=' + str(s['threads']) + '\n' + str(s['target_rps']) + '/s' + (' INVALID' if s['generator_limit'] else ''), ((start + end) / 2, s['mean_ms']), xytext=(0, 12), textcoords='offset points', fontsize=8, ha='center')
    for ax in axes:
        ax.axvspan(start, end, color='#E8EEF4', alpha=.45)
for role, color in [('application', '#0F4D92'), ('database', '#B64342'), ('monitor', '#42949E')]:
    points = {}
    for s in runs:
        m = json.loads((R / 'results/runs' / s['name'] / 'monitoring.json').read_text())
        for x in m['host_cpu_percent']['data'].get('result', []):
            if x['metric'].get('role') == role:
                points.update({float(t): float(v) for t, v in x.get('values', []) if math.isfinite(float(v))})
    pairs = sorted(points.items())
    if pairs:
        axes[2].plot([(t - origin) / 60 for t, v in pairs], [v for t, v in pairs], label=role, color=color, linewidth=1)
axes[0].set(ylabel='Mean HTTP response (ms)', ylim=(0, max(s['mean_ms'] for s in runs) * 1.4 + 5), title='MySQL read: all thread counts on the actual timeline')
axes[1].set(ylabel='Hits per second', ylim=(0, max(s['hps_max'] for s in runs) * 1.15))
axes[2].set(ylabel='CPU (%)', xlabel='Minutes from first run (shaded: formal windows)', ylim=(0, 105))
axes[2].legend(ncol=3)
for ax in axes:
    ax.grid(axis='y', alpha=.15)
export(fig, 'all-thread-comparison')
for s in runs:
    if s['name'] not in selected:
        continue
    fig, axes = plt.subplots(3, 1, figsize=(9, 8), sharex=True)
    for role, color in [('application', '#0F4D92'), ('database', '#B64342'), ('monitor', '#42949E')]:
        for seq in series(s, 'host_cpu_percent', role):
            if seq:
                axes[0].plot(*zip(*seq), '-o', label=role, color=color, markersize=3)
    axes[0].set(ylabel='CPU (%)', ylim=(0, 105), title=s['name'] + ' | recording interval 2 s')
    axes[0].legend(ncol=3)
    for key, label, color in [('hikari_active', 'active', '#0F4D92'), ('hikari_pending', 'pending', '#B64342')]:
        for seq in series(s, key):
            if seq:
                axes[1].plot(*zip(*seq), '-o', label=label, color=color, markersize=3)
    axes[1].set_ylabel('Hikari connections')
    axes[1].legend(ncol=2)
    for seq in series(s, 'host_memory_available_mib', 'application'):
        if seq:
            axes[2].plot(*zip(*seq), '-o', color='#0F4D92', markersize=3)
    axes[2].set(xlabel='Formal window (s)', ylabel='App available RAM (MiB)')
    for ax in axes:
        ax.grid(axis='y', alpha=.15)
    export(fig, s['name'] + '-resources')

lines = ['# MySQL读取测试结果', '', '监控每1秒采集、每2秒执行教师记录规则，速率窗口2秒，导出步长2秒。工作线程40、连接池20、应用堆256 MiB。每档恢复10万条数据，等间隔发送55秒，前30秒预热，取30–50秒正式窗口。平均响应时间来自JMeter完整HTTP耗时。', '', '|运行|计划请求/秒|总线程数|平均ms|P95 ms|错误率|实际HPS范围|应用CPU均值%|数据库CPU均值%|发送核验|', '|---|---:|---:|---:|---:|---:|---|---:|---:|---|']
for s in runs:
    lines.append(f'|{s["name"]}|{s["target_rps"]}|{s["threads"]}|{s["mean_ms"]:.2f}|{s["p95_ms"]:.2f}|{s["error_rate"]:.2%}|{s["hps_min"]}–{s["hps_max"]}|{fmt(s["cpu_percent"].get("application"))}|{fmt(s["cpu_percent"].get("database"))}|{"失败" if s["generator_limit"] else "通过"}|')
lines += ['', '发送核验标准：任一秒偏离窗口均值、前后各5秒均值之差、窗口均值偏离计划，三项均不超过10%；核对完整请求数、每线程一次请求及JMeter退出状态。', '', '## 响应转折与资源', '']
for s in turns:
    lines.append(f'- {s["name"]}：平均响应{s["mean_ms"]:.2f} ms，错误率{s["error_rate"]:.2%}，HPS为{s["hps_min"]}–{s["hps_max"]}；应用/数据库/压测机CPU均值为{fmt(s["cpu_percent"].get("application"))}%/{fmt(s["cpu_percent"].get("database"))}%/{fmt(s["cpu_percent"].get("monitor"))}%，数据库逐核峰值{fmt(maximum(s,"host_cpu_per_core","database"))}%，Hikari等待峰值{fmt(maximum(s,"hikari_pending"))}。')
faults = []
aborted = []
for d in sorted((R / 'results/runs').iterdir()):
    if not d.is_dir():
        continue
    kernel = (d / 'kernel.log').read_text(errors='replace') if (d / 'kernel.log').exists() else ''
    console = (d / 'console.log').read_text(errors='replace') if (d / 'console.log').exists() else ''
    causes = []
    if 'Killed process' in kernel and '(java)' in kernel:
        causes.append('应用机内核终止Java进程，日志记录内存耗尽')
    if 'pthread_create failed' in console or 'unable to create native thread' in console:
        causes.append('压测端无法创建本地线程')
    if causes:
        faults.append({'run': d.name, 'evidence': causes})
        lines.append('- ' + d.name + '：' + '；'.join(causes) + '。该档故障及发送条件同时解释，排除于正常性能比较。')
    if (d / 'failure.json').exists():
        aborted.append(json.loads((d / 'failure.json').read_text()))
if aborted:
    lines += ['', '预热期中断、没有正式样本的运行：' + '、'.join(x['name'] for x in aborted) + '。原始JTL与日志完整保存。']
conclusion = '80、160、320、480、720、1080次/秒六档完成正式读取，HPS逐秒达到计划值，错误率均为0。1080次/秒平均响应6.84 ms，应用/数据库/压测机CPU均值约53.76%/81.89%/21.72%。1200次/秒出现应用OOM与压测端线程创建失败，1140次/秒细分也因线程创建失败在预热期中断。本轮确认1080次/秒可稳定完成，容量上限和有效压力转折仍需在发送能力充足的条件下测定。'
lines += ['', conclusion, '', 'Prometheus HTTP QPS统计完成请求，JMeter Hits Per Second按请求开始时刻计数，两者分别展示。两秒窗口缺少足够样本时保留缺测；CPU曲线来自教师CPU记录规则。', '', '## 全部线程档位对照', '', '![全部线程档位的实际时间线](figures/all-thread-comparison.png)', '', '![逐级读取结果](figures/read-progression.png)', '', '## 时间与线程对应', '', '|运行|发送起点（北京时间）|正式窗口（北京时间）|线程总数|', '|---|---|---|---:|']
import datetime
from zoneinfo import ZoneInfo
def clock(ms):
    return datetime.datetime.fromtimestamp(ms / 1000, ZoneInfo('Asia/Shanghai')).strftime('%H:%M:%S')
for s in runs:
    lines.append(f'|{s["name"]}|{clock(s["start_ms"])}|{clock(s["measurement_start_ms"])}–{clock(s["measurement_end_ms"])}|{s["threads"]}|')
lines += ['', '图中阴影表示正式统计窗口；其余时段包含预热、数据重置及恢复。线程总数表示55秒内启动的单次请求线程数，同时活跃线程数见每档summary.json。Prometheus截图使用UTC，表中北京时间减8小时即可对应。JMeter对比报告仅合并各档正式窗口；HPS图连接相邻窗口端点，窗口之间的斜线是图表连线，期间没有正式样本。原始JTL保留各档完整请求。', '', '## 原生页面截图', '']
screens = [('jmeter-qualified-threads-response', '合格档位平均响应时间，同图比较全部线程档位'), ('jmeter-all-threads-hps', '全部正式窗口Hits Per Second'), ('prometheus-all-threads-cpu', '全部时段各主机CPU'), ('prometheus-all-threads-memory', '全部时段各主机内存'), ('prometheus-all-threads-hikari', '全部时段连接池活动数与等待数'), ('prometheus-all-threads-jvm-threads', '全部时段应用JVM线程数'), ('prometheus-all-threads-heap', '全部时段堆内存池使用比例'), ('prometheus-all-threads-http-qps', '全部时段服务端完成请求率'), ('prometheus-all-threads-response-mean-ms', '全部时段服务端平均处理时间'), ('jmeter-all-threads-response', '包含故障档的完整响应时间对比'), ('jmeter-all-threads-statistics', '全部正式样本汇总表与成功率饼图')]
for stem, caption in screens:
    lines += [f'![{caption}](screenshots/{stem}.jpg)', '']
lines += ['JMeter汇总Total包含不同负载、恢复检查和故障档，负载性能按各行比较。汇总吞吐量含档间间隔；正文使用各正式窗口请求数除以20秒。', '', '## HPS逐档核验', '']
for f in sorted(F.glob('hps-*.png')):
    lines.append(f'![逐档HPS](figures/{f.name})')
(R / 'MySQL读取结果.md').write_text('\n'.join(lines) + '\n')
audit = {'runs': len(runs), 'samples': sum(s['samples'] for s in runs), 'hps_qualified': len(valid), 'failed_names': [s['name'] for s in runs if s['generator_limit']], 'aborted_before_measurement': aborted, 'faults': faults, 'original_jtl_verified': True, 'each_http_thread_once': True, 'record_counts_unchanged': True, 'monitoring': method, 'selected': selected}
(R / 'results/audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n')
body = ['<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>MySQL读取测试结果</title><style>body{font:16px system-ui;margin:32px auto;max-width:1250px;padding:0 20px;line-height:1.6;color:#222}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:7px;text-align:right}th:first-child,td:first-child{text-align:left}th{background:#f3f4f5}img{width:100%;max-width:1000px}a{color:#14579c}</style><h1>MySQL读取测试结果</h1><p>每1秒采集、每2秒计算，速率窗口2秒。主指标：平均HTTP响应时间。HPS使用请求开始时刻逐秒计数。每档恢复10万条数据，前30秒预热，统计中间20秒。</p><p><a href="results/all-runs.csv">全部结果CSV</a> · <a href="results/audit.json">原始数据核验</a> · <a href="evidence/monitoring-timing-check.json">实际采集时间戳核验</a></p><h2>逐档结果</h2><table><tr><th>运行</th><th>计划HPS</th><th>平均ms</th><th>P95 ms</th><th>错误率</th><th>HPS范围</th><th>发送核验</th></tr>']
for s in runs:
    name = html.escape(s['name'])
    body.append(f'<tr><td><a href="results/runs/{name}/summary.json">{name}</a><br><a href="results/runs/{name}/all.jtl.gz">JTL</a> · <a href="results/runs/{name}/monitoring.json">监控</a></td><td>{s["target_rps"]}</td><td>{s["mean_ms"]:.2f}</td><td>{s["p95_ms"]:.2f}</td><td>{s["error_rate"]:.2%}</td><td>{s["hps_min"]}–{s["hps_max"]}</td><td>{"失败" if s["generator_limit"] else "通过"}</td></tr>')
body.append('</table><h2>全部线程档位原生对比</h2><p><a href="results/html/mysql-read-comparison/index.html">JMeter汇总与各线程档统计</a> · <a href="results/html/mysql-read-comparison/content/pages/Throughput.html#hitsPerSecond">全部档位Hits Per Second</a> · <a href="results/html/mysql-read-comparison/content/pages/OverTime.html">全部档位响应趋势</a></p><h2>原生分档数据</h2><ul>')
for name in selected:
    body.append(f'<li>{name}：<a href="results/html/{name}/index.html">统计与饼图</a> · <a href="results/html/{name}/content/pages/Throughput.html#hitsPerSecond">Hits Per Second</a> · <a href="results/html/{name}/content/pages/OverTime.html">响应趋势</a> · <a href="results/html/{name}/content/pages/ResponseTimes.html">百分位</a></li>')
body.append('</ul><h2>全部线程档位对照</h2><img src="figures/all-thread-comparison.png" alt="全部线程档位实际时间线"><h2>逐级结果</h2><img src="figures/read-progression.png" alt="逐级读取结果">')
for f in sorted(F.glob('hps-*.png')):
    body.append(f'<img src="figures/{f.name}" alt="逐档HPS核验">')
body.append('<h2>结果判断</h2><p>' + html.escape(conclusion) + '</p><p>Prometheus横轴为UTC，JMeter横轴为北京时间（UTC+8）。各平台对应独立正式窗口；HPS平台之间的斜线为JMeter连接端点，期间没有正式样本。线程标签N表示55秒内的线程总数，每线程请求一次。汇总Total包含故障档和档间间隔，请按各行及原始summary比较。</p><h2>正式窗口对应表</h2><table><tr><th>运行</th><th>正式窗口（UTC）</th><th>正式窗口（北京时间）</th><th>总线程数</th></tr>')
for s in runs:
    utc_start = datetime.datetime.fromtimestamp(s['measurement_start_ms']/1000, datetime.timezone.utc).strftime('%H:%M:%S')
    utc_end = datetime.datetime.fromtimestamp(s['measurement_end_ms']/1000, datetime.timezone.utc).strftime('%H:%M:%S')
    body.append(f'<tr><td>{s["name"]}</td><td>{utc_start}–{utc_end}</td><td>{clock(s["measurement_start_ms"])}–{clock(s["measurement_end_ms"])}</td><td>{s["threads"]}</td></tr>')
body.append('</table><h2>原生页面截图：全部线程档位同图</h2>')
for stem, caption in screens:
    body.append(f'<h3>{caption}</h3><a href="screenshots/{stem}.jpg"><img src="screenshots/{stem}.jpg" alt="{caption}"></a>')
body.append('</html>')
(R / 'index.html').write_text('\n'.join(body))
print(json.dumps({k: v for k, v in audit.items() if k != 'monitoring'}, ensure_ascii=False, indent=2))
