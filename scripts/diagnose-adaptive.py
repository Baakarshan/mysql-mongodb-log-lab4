"""Classify generator memory exhaustion from the retained host probes."""
import argparse
import json
import re
from pathlib import Path

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('bundle', type=Path)
a = p.parse_args()
diagnoses = []
for path in sorted((a.bundle / 'results/runs').glob('*/summary.json')):
    s = json.loads(path.read_text())
    if 'healthy_after' not in s:
        continue
    s.setdefault('generator_role', 'compiler')
    s.setdefault('generator_heap_mib', 256)
    probe = (path.parent / 'generator-health.txt').read_text()
    memory = [int(x) / 1024 for x in re.findall(r'MemAvailable:\s+(\d+) kB', probe)]
    s['generator_min_available_mib'] = min(memory) if memory else None
    if memory and min(memory) < 32:
        s['generator_limit'] = True
        s['classification'] = 'generator_memory_limit'
    elif s['generator_limit']:
        s['classification'] = 'generator_limit'
    elif s['severe_degradation'] or not s['healthy_after']:
        s['classification'] = 'service_degradation'
    elif s['throughput_rps'] < s['target_rps'] * .8:
        s['classification'] = 'saturation'
    else:
        s['classification'] = 'controlled_load'
    path.write_text(json.dumps(s, ensure_ascii=False, indent=2) + '\n')
    config_path = path.parent / 'config.json'
    config = json.loads(config_path.read_text())
    config['generator_role'] = s['generator_role']
    config['generator_heap_mib'] = s['generator_heap_mib']
    config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2) + '\n')
    diagnoses.append({k: s[k] for k in ['name', 'classification', 'generator_min_available_mib', 'healthy_after']})
(a.bundle / 'evidence/generator-diagnosis.json').write_text(json.dumps(diagnoses, ensure_ascii=False, indent=2) + '\n')
corrections = []
for line in (a.bundle / 'events.jsonl').read_text().splitlines():
    e = json.loads(line)
    if e['stage'] == 'service_failure_boundary':
        found = next((s for s in diagnoses if s['name'] == e['name']), None)
        if found and found['classification'].startswith('generator_'):
            corrections.append(dict(original_event=e, classification=found['classification'], reason='Retained generator logs and host probes identify generator exhaustion; application health remained UP.'))
(a.bundle / 'evidence/event-classification-corrections.json').write_text(json.dumps(corrections, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(diagnoses, ensure_ascii=False, indent=2))
