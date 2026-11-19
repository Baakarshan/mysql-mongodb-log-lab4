"""将各档正式JTL合并为一个原生JMeter对比报告，保留真实时间和来源哈希。"""
import argparse
import csv
import datetime
import gzip
import hashlib
import json
import os
from pathlib import Path
import subprocess
from zoneinfo import ZoneInfo

p = argparse.ArgumentParser()
p.add_argument('bundle', type=Path)
p.add_argument('--jmeter', type=Path, required=True)
a = p.parse_args()
R = a.bundle
root = Path(__file__).resolve().parents[1]
runs = json.loads((R / 'results/all-runs.json').read_text())
dest = R / 'results/html/mysql-read-comparison'
assert not dest.exists(), '已有报告，请先核对来源后另存新目录'
jtl = R / 'work/jtl/mysql-read-comparison.jtl'
jtl.parent.mkdir(parents=True, exist_ok=True)
sources = []
with jtl.open('w', newline='') as f:
    writer = None
    for run_number, s in enumerate(runs, 1):
        source = R / 'results/runs' / s['name'] / 'measurement.jtl.gz'
        count = 0
        with gzip.open(source, 'rt') as inp:
            reader = csv.DictReader(inp)
            if writer is None:
                writer = csv.DictWriter(f, reader.fieldnames, lineterminator='\n')
                writer.writeheader()
            for row in reader:
                row['label'] = f'{run_number:02d} N{s["threads"]} {s["target_rps"]}rps R{s["repeat"]}' + (' INVALID' if s['generator_limit'] else '')
                row['threadName'] = s['name'] + ' ' + row['threadName']
                row['timeStamp'] = datetime.datetime.fromtimestamp(int(row['timeStamp']) / 1000, ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
                writer.writerow(row)
                count += 1
        assert count == s['samples']
        sources.append({'run': s['name'], 'label': f'{run_number:02d} N{s["threads"]} {s["target_rps"]}rps R{s["repeat"]}' + (' INVALID' if s['generator_limit'] else ''), 'measurement_gzip_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'samples': count})
dest.parent.mkdir(exist_ok=True, parents=True)
command = [str(a.jmeter.resolve()), '-g', str(jtl.resolve()), '-q', str(root / 'scripts/jmeter.properties'), '-Jjmeter.save.saveservice.timestamp_format=yyyy-MM-dd HH:mm:ss.SSS', '-Jjmeter.reportgenerator.overall_granularity=1000', '-Jjmeter.reportgenerator.statistic_window=2000000', '-o', str(dest.resolve()), '-j', str((R / 'work/comparison-jmeter.log').resolve())]
with (R / 'work/comparison-generator.log').open('w') as f:
    subprocess.run(command, stdout=f, stderr=subprocess.STDOUT, env=dict(os.environ, HEAP='-Xms128m -Xmx768m', JVM_ARGS='-Duser.timezone=Asia/Shanghai'), check=True)
stats = json.loads((dest / 'statistics.json').read_text())
for item in sources:
    assert stats[item['label']]['sampleCount'] == item['samples']
assert stats['Total']['sampleCount'] == sum(s['samples'] for s in runs)
(dest / 'dashboard-source.json').write_text(json.dumps({'sources': sources, 'display_timezone': 'Asia/Shanghai', 'timestamp_policy': '保留各档真实请求时刻，各正式窗口之间存在预热、重置与重启间隔', 'label_policy': '按线程总数、计划速率及重复编号标识显示序列', 'original_jtl_unchanged': True, 'display_jtl_sha256': hashlib.sha256(jtl.read_bytes()).hexdigest()}, ensure_ascii=False, indent=2) + '\n')
print('已核对合并报告', len(sources), '次运行', stats['Total']['sampleCount'], '条正式请求')
