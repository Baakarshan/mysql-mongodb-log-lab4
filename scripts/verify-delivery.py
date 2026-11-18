"""核对本轮原始数据、原生报表、截图与报告交付。"""
from pathlib import Path
import hashlib
import json
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(root / 'scripts/verify-open.py'), str(root)], check=True)
selected = json.loads((root / 'results/selected-runs.json').read_text())
for names in selected.values():
    for name in names:
        original = root / 'results/runs' / name / 'measurement.jtl.gz'
        dashboard = root / 'results/html' / name
        meta = json.loads((dashboard / 'dashboard-source.json').read_text())
        assert meta['measurement_gzip_sha256'] == hashlib.sha256(original.read_bytes()).hexdigest()
        stats = json.loads((dashboard / 'statistics.json').read_text())
        summary = json.loads((original.parent / 'summary.json').read_text())
        total = stats['Total']
        assert total['sampleCount'] == summary['samples']
        assert total['errorCount'] == summary['errors']
        for suffix in ['dashboard', 'OverTime', 'ResponseTimes', 'Throughput']:
            assert (root / 'screenshots' / f'{name}-{suffix}.jpg').stat().st_size > 10000
for ext in ['pdf', 'docx']:
    assert (root / 'report' / f'实验四实验报告.{ext}').stat().st_size > 100000
restored = json.loads((root / 'evidence/rbac-restoration.json').read_text())
assert restored['restored']
for name, n in restored['original'].items():
    assert restored['observed'][name] == f'{n}/{n}'
source = json.loads((root / 'evidence/source-revision.json').read_text())
for name, digest in source['source_sha256'].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == digest, name
for backend in ['mysql', 'mongo']:
    deploy = json.loads((root / 'evidence' / f'{backend}-deployment.json').read_text())
    assert deploy['jar'].split()[0] == source['deployed_jar_sha256']
print('已核对原始JTL、JMeter样本/错误数、页面截图、报告、部署源码和服务恢复。')
