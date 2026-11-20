"""在工作线程上限40下，对照查询连接池20与40，并检查低负载恢复。"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time

p = argparse.ArgumentParser()
p.add_argument('--output', type=Path, required=True)
a = p.parse_args()
root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / 'scripts'))
import experiment as r

if not os.environ.get('LAB_SSH_PASSWORD'):
    raise SystemExit('请设置LAB_SSH_PASSWORD')
out = a.output.resolve()
e = out / 'evidence'
assert json.loads((e / 'rbac-restoration.json').read_text())['restored']
original = json.loads((e / 'rbac-original.json').read_text())
try:
    r.remote('monitor', 'docker service scale --detach=true ' + ' '.join(n + '=0' for n in original))
    for _ in range(30):
        state = r.remote('monitor', "docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'")
        if state and all(x.endswith('0/0') for x in state.splitlines()):
            break
        time.sleep(1)
    r.remote('app', "sed -i '/^SERVER_TOMCAT_THREADS_MAX=/d' /opt/lab4/app.env; printf '\\nSERVER_TOMCAT_THREADS_MAX=40\\n' >> /opt/lab4/app.env")
    for backend in ['mysql', 'mongo']:
        code = """
import sys, importlib.util
sys.argv = ['thread-experiment.py', BACKEND, '--output', OUTPUT]
spec = importlib.util.spec_from_file_location('t', SCRIPT)
t = importlib.util.module_from_spec(spec)
spec.loader.exec_module(t)
t.environment.prepare(BACKEND, t.OUT)
t.configure_pool(40)
try:
    t.stage('read', 1200, 'pool40_diagnosis', 40, tomcat_max_threads=40)
finally:
    t.configure_pool(20)
t.stage('read', 80, 'recovery_confirmation', 20, tomcat_max_threads=40)
""".replace('BACKEND', repr(backend)).replace('OUTPUT', repr(str(out))).replace('SCRIPT', repr(str(root / 'scripts/thread-experiment.py')))
        subprocess.run([sys.executable, '-c', code], check=True, env=dict(os.environ, PYTHONPATH=str(root / 'scripts')))
finally:
    r.remote('monitor', 'docker service scale --detach=true ' + ' '.join(n + '=' + str(v) for n, v in original.items()))
    observed = {}
    for _ in range(90):
        raw = r.remote('monitor', "docker service ls --filter name=rbac_v33 --format '{{.Name}} {{.Replicas}}'")
        observed = dict(x.split() for x in raw.splitlines())
        if all(observed.get(n) == f'{v}/{v}' for n, v in original.items()):
            break
        time.sleep(2)
    (e / 'rbac-restoration.json').write_text(json.dumps({'original': original, 'observed': observed, 'restored': all(observed.get(n) == f'{v}/{v}' for n, v in original.items()), 'phase': 'pool_diagnosis'}, indent=2) + '\n')
    for client in r.CLIENTS.values():
        client.close()
