"""Verify current JTL, dashboards, screenshots and report artifacts."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(root/'scripts/verify-adaptive.py'), str(root)], check=True)
selected = json.loads((root/'results/selected-runs.json').read_text())
for names in selected.values():
    for name in names:
        original = root/'results/runs'/name/'measurement.jtl.gz'
        meta = json.loads((root/'results/html'/name/'dashboard-source.json').read_text())
        assert meta['measurement_gzip_sha256'] == hashlib.sha256(original.read_bytes()).hexdigest()
        for suffix in ['dashboard', 'OverTime', 'ResponseTimes']:
            assert (root/'screenshots'/f'{name}-{suffix}.png').stat().st_size > 10000
for ext in ['pdf', 'docx']:
    assert (root/'report'/f'实验四实验报告.{ext}').stat().st_size > 100000
restored = json.loads((root/'evidence/rbac-restoration.json').read_text())
assert restored['restored'] and all(value == '1/1' for value in restored['observed'].values())
print('Native dashboard sources, screenshots, reports and restoration evidence verified.')
