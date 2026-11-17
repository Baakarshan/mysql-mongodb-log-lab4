"""Use observed throughput/latency to choose successive finite, paced JMeter loads."""
import argparse
import collections
import csv
import datetime
import gzip
import hashlib
import json
import math
import os
import re
from pathlib import Path
import shlex
import statistics
import sys
import time

import experiment as remote

REPO = Path(__file__).resolve().parents[1]
P = argparse.ArgumentParser(description=__doc__)
P.add_argument('backend', choices=['mysql', 'mongo'])
P.add_argument('--output', type=Path, required=True)
P.add_argument('--start', type=int, default=8)
P.add_argument('--max-threads', type=int, default=1800)
P.add_argument('--only-threads', type=int)
P.add_argument('--operation', choices=['read', 'write'])
P.add_argument('--prepare', action='store_true')
P.add_argument('--generator', choices=['compiler', 'monitor'], default='compiler')
P.add_argument('--generator-heap', type=int, choices=[256,512], default=256)
A = P.parse_args()
OUT = A.output.resolve()
REMOTE_ROOT = os.environ.get('LAB_RUN_ROOT', '/opt/lab4/' + A.output.resolve().name + '-paced')
for sub in ['results/runs', 'evidence']:
    (OUT / sub).mkdir(parents=True, exist_ok=True)


def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def event(**values):
    values['utc'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    print(json.dumps(values, ensure_ascii=False), flush=True)
    with (OUT / 'events.jsonl').open('a') as f:
        f.write(json.dumps(values, ensure_ascii=False) + '\n')


def quantile(values, fraction):
    if not values:
        return None
    values = sorted(values)
    position = (len(values) - 1) * fraction
    lo = int(position)
    return values[lo] + (values[min(lo + 1, len(values) - 1)] - values[lo]) * (position - lo)


def recover_application():
    """恢复本轮实测中因主机资源耗尽而失去响应的应用。"""
    try:
        remote.remote('app', 'timeout 15s docker restart -t 3 lab4-app')
    except RuntimeError as error:
        event(stage='recovering_with_process_termination', error=str(error))
        command = 'for p in /proc/[0-9]*; do if read -r comm < "$p/comm" 2>/dev/null && [[ "$comm" == java ]]; then mapfile -d "" args < "$p/cmdline"; case "${args[*]}" in *"/app.jar"*) kill -KILL "${p##*/}";; esac; fi; done'
        remote.remote('app', command)
        time.sleep(3)
        remote.remote('app', 'timeout 15s docker start lab4-app', False)
    remote.app_ready()


def prepare():
    remote.remote('app', 'docker stop lab4-app', False)
    other = 'mongo' if A.backend == 'mysql' else 'mysql'
    remote.remote('db', f'docker stop lab4-{other}', False)
    remote.remote('db', f'docker start lab4-{A.backend}')
    for _ in range(30):
        try:
            remote.count(A.backend)
            break
        except Exception:
            time.sleep(1)
    remote.remote('app', 'docker rm -f lab4-app')
    remote.remote('app', f"sed -i 's/^SPRING_PROFILES_ACTIVE=.*/SPRING_PROFILES_ACTIVE={A.backend}/' /opt/lab4/app.env; bash /opt/lab4/scripts/deploy.sh app")
    remote.app_ready()
    remote.remote('db', f'bash /opt/lab4/scripts/reset-db.sh {A.backend}')
    smoke = json.loads(remote.remote('compiler', 'python3 /opt/lab4/scripts/smoke.py'))
    assert smoke['passed']
    save(OUT / 'evidence' / f'{A.backend}-smoke.json', smoke)
    deployment = {}
    for role in remote.HOSTS:
        deployment[role] = remote.remote(role, 'date -u; free -m; docker ps --format "{{.Names}} {{.Image}} {{.Status}}"')
    deployment['jar'] = remote.remote('app', 'sha256sum /opt/lab4/app.jar')
    save(OUT / 'evidence' / f'{A.backend}-deployment.json', deployment)
    if A.backend == 'mysql':
        query = '''source /opt/lab4/db.env; docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -uroot lab4 -e "SELECT VERSION(); SHOW INDEX FROM logs; SELECT @@innodb_buffer_pool_size,@@innodb_flush_log_at_trx_commit,@@log_bin;"'''
    else:
        query = '''source /opt/lab4/db.env; docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval 'print(db.version()); printjson(db.logs.getIndexes()); printjson(db.adminCommand({getCmdLineOpts:1}).parsed.storage);' '''
    (OUT / 'evidence' / f'{A.backend}-database-settings.txt').write_text(remote.remote('db', query))


def summarize(dest, op, threads, repeat, purpose, before, after):
    start = int((dest / 'start-ms.txt').read_text())
    rows = []
    with gzip.open(dest / 'all.jtl.gz', 'rt') as f:
        reader = csv.DictReader(f)
        fields = reader.fieldnames
        rows = [r for r in reader if r['label'] == op]
    begin, end = start + 10000, start + 35000
    formal = [r for r in rows if begin <= int(r['timeStamp']) < end]
    parts = {'warmup': [r for r in rows if int(r['timeStamp']) < begin],
             'measurement': formal,
             'cooldown': [r for r in rows if int(r['timeStamp']) >= end]}
    for label, part in parts.items():
        with gzip.open(dest / f'{label}.jtl.gz', 'wt', newline='') as f:
            writer = csv.DictWriter(f, fields)
            writer.writeheader()
            writer.writerows(part)
    latency = [int(r['elapsed']) for r in formal]
    successful = sum(r['success'] == 'true' for r in rows)
    failures = collections.Counter(r['responseCode'] for r in formal if r['success'] != 'true')
    seconds = [sum(begin + sec * 1000 <= int(r['timeStamp']) < begin + (sec + 1) * 1000 for r in formal) for sec in range(25)]
    bins = [sum(seconds[i:i + 5]) / 5 for i in range(0, 25, 5)]
    s = dict(name=dest.name, backend=A.backend, operation=op, threads=threads,
             repeat=repeat, purpose=purpose, loop_limit=600, target_rps=threads * 10,
             duration_s=25, start_ms=start, measurement_start_ms=begin, measurement_end_ms=end,
             samples=len(formal), errors=sum(failures.values()),
             error_rate=sum(failures.values()) / len(formal) if formal else 1,
             throughput_rps=len(formal) / 25,
             successful_rps=sum(r['success'] == 'true' for r in formal) / 25,
             mean_ms=statistics.mean(latency) if latency else None,
             p50_ms=quantile(latency, .5), p95_ms=quantile(latency, .95), p99_ms=quantile(latency, .99),
             hits_per_second=seconds, hits_per_second_5s=bins,
             hps_cv_5s=statistics.pstdev(bins) / statistics.mean(bins) if sum(bins) else None,
             response_codes=dict(failures), all_http_samples=len(rows), all_success=successful,
             records_before=before, records_after=after,
             record_count_verified=after == before + (successful if op == 'write' else 0))
    # A timed-out write may have committed after its client stopped waiting.
    s['write_count_difference'] = after - before - (successful if op == 'write' else 0)
    raw = gzip.decompress((dest / 'all.jtl.gz').read_bytes())
    save(dest / 'original.json', dict(original_jtl_sha256=hashlib.sha256(raw).hexdigest(),
         compressed_sha256=hashlib.sha256((dest / 'all.jtl.gz').read_bytes()).hexdigest()))
    save(dest / 'summary.json', s)
    save(dest / 'config.json', dict(threads=threads, target_rps=threads * 10, loops=600, generator_role=A.generator, generator_heap_mib=A.generator_heap,
         ramp_s=5, warmup_s=5, measurement_s=25, timeout_ms=5000, jmx_sha256=hashlib.sha256((REPO / 'jmeter/adaptive-logs.jmx').read_bytes()).hexdigest()))
    return s


def stage(op, threads, purpose='exploration'):
    completed = [json.loads(p.read_text()) for p in (OUT / 'results/runs').glob(f'{A.backend}-*/summary.json')]
    completed = [s for s in completed if 'healthy_after' in s]
    last = max(completed, key=lambda s: s['start_ms']) if completed else None
    if last and (last['error_rate'] >= .1 or not last['healthy_after'] or (last['severe_degradation'] and not last['generator_limit'])):
        event(stage='recovering_before_run', previous=last['name'])
        recover_application()
    prefix = f'{A.backend}-{op}-t{threads}-r'
    names = [p.name for p in (OUT / 'results/runs').glob(prefix + '*')]
    if (OUT / 'events.jsonl').exists():
        names.extend(e.get('name','') for e in map(json.loads, (OUT / 'events.jsonl').read_text().splitlines()))
    repeat = 1 + max([int(n[len(prefix):]) for n in names if n.startswith(prefix) and n[len(prefix):].isdigit()] or [0])
    name = prefix + str(repeat)
    dest = OUT / 'results/runs' / name
    dest.mkdir()
    rpath = REMOTE_ROOT + '/' + name
    event(stage='starting', name=name, purpose=purpose)
    reset = remote.remote('db', f'bash /opt/lab4/scripts/reset-db.sh {A.backend}')
    (dest / 'reset.txt').write_text(reset)
    before = remote.count(A.backend)
    assert before == 100000
    # Capture state before stressing so OOM/restart changes remain attributable.
    snapshot = {}
    for role in ['compiler', 'app', 'db']:
        snapshot[role] = remote.remote(role, 'free -m; docker stats --no-stream --format "{{.Name}} {{.CPUPerc}} {{.MemUsage}}"; docker inspect lab4-app --format "{{.State.OOMKilled}} {{.RestartCount}}" 2>/dev/null || true')
    save(dest / 'state-before.json', snapshot)
    command = f'LAB_JMETER_HEAP_MB={A.generator_heap} bash /opt/lab4/scripts/run-adaptive.sh {op} {threads} {shlex.quote(rpath)}'
    output = remote.remote(A.generator, command, False)
    (dest / 'command-output.txt').write_text(output)
    for filename in ['all.jtl.gz', 'start-ms.txt', 'jmeter.log', 'console.log', 'generator-health.txt', 'exit-code.txt']:
        try:
            remote.fetch(A.generator, rpath + '/' + filename, dest / filename)
        except FileNotFoundError:
            pass
    time.sleep(1)
    after = remote.count(A.backend)
    s = summarize(dest, op, threads, repeat, purpose, before, after)
    s['generator_role'] = A.generator
    s['generator_heap_mib'] = A.generator_heap
    monitoring = remote.monitoring(s['start_ms'] / 1000, s['measurement_end_ms'] / 1000 + 5)
    save(dest / 'monitoring.json', monitoring)
    start, end = s['measurement_start_ms'] / 1000, s['measurement_end_ms'] / 1000
    cpu = {}
    for series in monitoring['host_cpu_percent']['data']['result']:
        values = [float(y) for x, y in series['values'] if start <= float(x) < end]
        if values:
            cpu[series['metric'].get('role', 'unknown')] = statistics.mean(values)
    s['cpu_percent'] = cpu
    s['generator_exit_code'] = int((dest / 'exit-code.txt').read_text()) if (dest / 'exit-code.txt').exists() else -1
    generator_log = (dest / 'console.log').read_text() + (dest / 'jmeter.log').read_text()
    s['generator_runtime_failure'] = any(x in generator_log for x in ['OutOfMemoryError', 'unable to create native thread', 'Failed to start thread', 'GC overhead limit'])
    memory = [int(x) / 1024 for x in re.findall(r'MemAvailable:\s+(\d+) kB', (dest / 'generator-health.txt').read_text())]
    s['generator_min_available_mib'] = min(memory) if memory else None
    cpu_role = 'compiler' if A.generator == 'compiler' else 'monitor'
    s['generator_cpu_saturated'] = cpu.get(cpu_role, 0) > 98
    s['generator_hard_limit'] = bool(s['generator_exit_code'] != 0 or s['generator_runtime_failure'] or (memory and min(memory) < 32))
    s['generator_limit'] = s['generator_cpu_saturated'] or s['generator_hard_limit']
    s['severe_degradation'] = s['error_rate'] >= .1 or (s['p95_ms'] or 0) >= 3500
    s['healthy_after'] = 'UP' in remote.remote('compiler', 'curl --max-time 3 -sf http://172.31.12.145:18080/actuator/health', False)
    save(dest / 'summary.json', s)
    (dest / 'application.log').write_text(remote.remote('app', 'docker logs --since 2m lab4-app 2>&1', False))
    states = {}
    for role in ['app', 'db']:
        states[role] = remote.remote(role, 'docker ps -a --format "{{.Names}} {{.Status}}"; docker inspect lab4-app --format "{{.State.OOMKilled}} {{.RestartCount}}" 2>/dev/null || true')
    save(dest / 'state-after.json', states)
    event(stage='completed', **{k: s[k] for k in ['name', 'threads', 'samples', 'throughput_rps', 'p95_ms', 'error_rate', 'hps_cv_5s', 'cpu_percent', 'record_count_verified', 'generator_limit', 'severe_degradation']})
    return s


def explore(op):
    threads = A.start
    previous = None
    peak = None
    while threads <= A.max_threads:
        current = stage(op, threads)
        if peak is None or current['successful_rps'] > peak['successful_rps']:
            peak = current
        if previous and current['successful_rps'] < previous['successful_rps'] * .8:
            event(stage='diagnosing_drop', operation=op, previous=previous['name'], current=current['name'])
            stage(op, previous['threads'], 'drop_previous_retest')
            stage(op, threads, 'drop_current_retest')
        if current.get('generator_hard_limit',current['generator_limit']):
            event(stage='generator_limit', operation=op, name=current['name'])
            break
        if current['severe_degradation'] or not current['healthy_after']:
            confirmation = stage(op, threads, 'failure_confirmation') if current['healthy_after'] else current
            if confirmation.get('generator_hard_limit',confirmation['generator_limit']):
                event(stage='generator_limit', operation=op, name=confirmation['name'])
                break
            if confirmation['error_rate'] >= .1 or not confirmation['healthy_after']:
                event(stage='service_failure_boundary', operation=op, name=current['name'])
                if not confirmation['healthy_after']:
                    event(stage='recovering_application', operation=op)
                    recover_application()
                break
            event(stage='service_degradation_confirmed', operation=op, name=confirmation['name'])
        previous = current
        multiplier = 2 if current['throughput_rps'] >= current['target_rps'] * .8 and (current['p95_ms'] or 0) < 500 else 1.5
        nxt = min(A.max_threads, max(threads + 1, math.ceil(threads * multiplier / 4) * 4))
        if nxt == threads:
            event(stage='configured_generator_ceiling', operation=op, threads=threads)
            break
        threads = nxt
    if peak and peak['threads'] != threads:
        stage(op, peak['threads'], 'peak_confirmation')
    stage(op, A.start, 'baseline_confirmation')


if __name__ == '__main__':
    try:
        remote.QUERIES['host_cpu_percent'] = '100 * (1 - avg by (role) (rate(node_cpu_seconds_total{mode="idle"}[10s])))'
        if A.prepare:
            prepare()
        for op in [A.operation] if A.operation else ['read', 'write']:
            if A.only_threads:
                stage(op, A.only_threads, 'manual_diagnosis')
            else:
                explore(op)
    finally:
        for c in remote.CLIENTS.values():
            c.close()
