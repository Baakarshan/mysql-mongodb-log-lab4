"""MySQL读取：每秒采集、每两秒计算，逐级寻找响应转折。"""
import argparse
import datetime
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import sys
import time

p = argparse.ArgumentParser()
p.add_argument('--output', type=Path, required=True)
a = p.parse_args()
root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / 'scripts'))
import experiment as r

out = a.output.resolve()
e = out / 'evidence'
e.mkdir(parents=True, exist_ok=True)

def save(name, value):
    (e / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def api(path):
    return json.loads(r.remote('monitor', 'curl -sf http://172.31.7.102:19090/api/v1/' + path))

if not os.environ.get('LAB_SSH_PASSWORD'):
    raise SystemExit('请设置LAB_SSH_PASSWORD')
raw = r.remote('monitor', "docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'")
original = {x.split()[0]: int(x.split()[1].split('/')[1]) for x in raw.splitlines()}
save('rbac-original.json', original)
try:
    if original:
        r.remote('monitor', 'docker service scale --detach=true ' + ' '.join(n + '=0' for n in original))
    for _ in range(40):
        raw = r.remote('monitor', "docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'")
        if all(x.endswith('0/0') for x in raw.splitlines()):
            break
        time.sleep(1)
    else:
        raise RuntimeError('RBAC未暂停')
    save('rbac-paused.json', {'observed': raw})
    for name in ['jmeter/single-shot-logs.jmx', 'scripts/run-single-shot.sh', 'scripts/select-jmeter-operation.py', 'scripts/jmeter.properties']:
        r.upload('monitor', root / name, '/opt/lab4/' + name)
    r.remote('app', "sed -i '/^SERVER_TOMCAT_THREADS_MAX=/d; /^SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=/d' /opt/lab4/app.env; printf '\\nSERVER_TOMCAT_THREADS_MAX=40\\nSPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=20\\n' >> /opt/lab4/app.env")
    sys.argv = ['thread-experiment.py', 'mysql', '--output', str(out)]
    spec = importlib.util.spec_from_file_location('t', root / 'scripts/thread-experiment.py')
    t = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(t)
    r.MONITORING_STEP = 2
    r.QUERIES = {k: v.replace('[30s]', '[2s]').replace('[10s]', '[2s]') for k, v in r.QUERIES.items()}
    r.QUERIES.update({
        'host_cpu_percent': 'node:cpu_usage_percent',
        'host_memory_used_percent': 'node:memory_usage_percent',
        'host_cpu_per_core': '100 * (1 - irate(node_cpu_seconds_total{mode="idle"}[2s]))',
        'host_iowait_percent': '100 * avg by (role) (irate(node_cpu_seconds_total{mode="iowait"}[2s]))',
        'disk_read_bytes_per_second': 'node:disk_read_bytes:rate2s{device="vda"}',
        'disk_write_bytes_per_second': 'node:disk_written_bytes:rate2s{device="vda"}',
        'http_requests_per_second': 'sum(spring:http_requests:rate2s{uri="/api/logs",method="GET"})',
        'http_mean_seconds': 'sum(rate(http_server_requests_seconds_sum{uri="/api/logs",method="GET"}[2s])) / sum(rate(http_server_requests_seconds_count{uri="/api/logs",method="GET"}[2s]))',
        'http_mean_seconds_by_status': 'spring:http_request_duration:avg2s{uri="/api/logs",method="GET"}',
        'jvm_heap_usage_by_pool': 'spring:jvm_memory_heap_usage_ratio',
        'jvm_nonheap_usage_by_pool': 'spring:jvm_memory_nonheap_usage_ratio',
        'jvm_threads_live': 'spring:jvm_threads_live_threads',
        'gc_pause_count': 'spring:jvm_gc_pause:rate2s',
        'filesystem_usage_percent': 'node:filesystem_usage_percent',
        'network_receive_bytes_per_second': 'sum by (role) (node:network_receive_bytes:rate2s{device!="lo",device!~"docker.*|veth.*|br-.*"})',
        'network_transmit_bytes_per_second': 'sum by (role) (node:network_transmit_bytes:rate2s{device!="lo",device!~"docker.*|veth.*|br-.*"})',
        'scrape_up': 'up',
        'scrape_duration_seconds': 'scrape_duration_seconds',
    })
    t.environment.prepare('mysql', out)
    save('prometheus-effective-config.json', api('status/config'))
    rules = api('rules')
    save('prometheus-rules-before.json', rules)
    assert len(rules['data']['groups']) == 2
    assert all(g['interval'] == 2 and all(x['health'] == 'ok' for x in g['rules']) for g in rules['data']['groups'])
    save('monitoring-method.json', {'scrape_interval_s': 1, 'recording_interval_s': 2, 'query_step_s': 2, 'rate_window_s': 2, 'queries': r.QUERIES, 'tomcat_max_threads': 40, 'pool_size': 20, 'seed_records': 100000, 'arrival_duration_s': 55, 'measurement_offset_s': [30, 50], 'primary_metric': 'mean_ms'})
    save('measurement-source.json', {n: hashlib.sha256((root / n).read_bytes()).hexdigest() for n in ['scripts/mysql-read-1s2s.py', 'scripts/experiment.py', 'scripts/thread-experiment.py', 'scripts/prometheus.yml', 'scripts/lab4-recording-rules.yml', 'jmeter/single-shot-logs.jmx', 'scripts/run-single-shot.sh']})
    rate = 80
    previous = None
    while True:
        s = t.stage('read', rate, 'exploration', 20, tomcat_max_threads=40)
        if s['generator_limit']:
            # 发送失败先恢复应用并复测，不能用失败发送判断数据库转折。
            t.environment.recover(out)
            retry = t.stage('read', rate, 'arrival_confirmation', 20, tomcat_max_threads=40)
            if retry['generator_limit']:
                break
            s = retry
        if s['severe_degradation'] or not s['healthy_after']:
            if previous and rate - previous['target_rps'] >= 80:
                t.environment.recover(out)
                t.stage('read', (rate + previous['target_rps']) // 2, 'boundary_refinement', 20, tomcat_max_threads=40)
            t.environment.recover(out)
            t.stage('read', rate, 'boundary_confirmation', 20, tomcat_max_threads=40)
            break
        previous = s
        rate = rate * 2 if rate < 320 else int(math.ceil(rate * 1.5 / 10) * 10) if rate < 1080 else rate + 120
    t.environment.recover(out)
    t.stage('read', 80, 'recovery_confirmation', 20, tomcat_max_threads=40)
    save('prometheus-rules-after.json', api('rules'))
    save('prometheus-targets-after.json', api('targets'))
finally:
    if original:
        r.remote('monitor', 'docker service scale --detach=true ' + ' '.join(n + '=' + str(v) for n, v in original.items()))
    observed = {}
    for _ in range(90):
        raw = r.remote('monitor', "docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'")
        observed = dict(x.split() for x in raw.splitlines())
        if all(observed.get(n) == f'{v}/{v}' for n, v in original.items()):
            break
        time.sleep(1)
    save('rbac-restoration.json', {'utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'original': original, 'observed': observed, 'restored': all(observed.get(n) == f'{v}/{v}' for n, v in original.items())})
    save('final-health.json', {'application': r.remote('monitor', 'curl -sf --max-time 5 http://172.31.12.145:18080/actuator/health', False)})
    for c in r.CLIENTS.values():
        c.close()
