"""运行一档读写实验：双发送机、每线程一次请求、30秒预热和20秒正式窗口。"""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shlex
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import experiment as remote
import dual_sender

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('backend', choices=['mysql', 'mongo'])
parser.add_argument('operation', choices=['read', 'write'])
parser.add_argument('--rate', type=int, required=True)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--purpose', default='exploration')
parser.add_argument('--prepare', action='store_true', help='切换数据库、部署应用并执行接口核验')
args = parser.parse_args()
if not os.getenv('LAB_SSH_PASSWORD'):
    parser.error('通过LAB_SSH_PASSWORD提供SSH密码')
if args.rate <= 0 or args.rate % 5:
    parser.error('速率须为正数且为5的整数倍')
out = args.output.resolve()
(out / 'evidence').mkdir(parents=True, exist_ok=True)
method = json.loads((ROOT / 'scripts/monitoring-method.json').read_text())
real_remote, real_fetch = remote.remote, remote.fetch
locations = {}
latest = {}

def send(role, command, check=True):
    # 复用逐档测量程序，只替换发送动作；请求与监控的正式窗口保持一致。
    if role == 'monitor' and command.startswith('bash /opt/lab4/scripts/run-single-shot.sh'):
        parts = shlex.split(command)
        rate = int(parts[3]) // 55
        name = parts[4].rsplit('/', 1)[-1].rsplit('-', 1)[0]
        dest = out / 'results/runs' / name / 'sender'
        audit = dual_sender.run(rate, dest, operation=parts[2])
        locations[parts[4]] = dest
        latest.update(audit=audit, path=dest)
        return json.dumps(audit)
    return real_remote(role, command, check)

def fetch(role, path, local):
    parent, name = path.rsplit('/', 1)
    if role == 'monitor' and parent in locations:
        Path(local).parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(locations[parent] / name, local)
        return
    return real_fetch(role, path, local)

remote.remote, remote.fetch = send, fetch
sys.argv = ['thread-experiment.py', args.backend, '--output', str(out)]
spec = importlib.util.spec_from_file_location('measured_stage', ROOT / 'scripts/thread-experiment.py')
stage_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stage_module)
remote.MONITORING_STEP = 2
method_verb = 'GET' if args.operation == 'read' else 'POST'
remote.QUERIES = {k: v.replace('method="GET"', 'method="' + method_verb + '"') for k, v in method['queries'].items()}
dual_sender.install()
if args.prepare:
    # 使用当前仓库的deploy.sh；两库同一操作采用相同应用参数。
    remote.upload('app', ROOT / 'scripts/deploy.sh', '/opt/lab4/scripts/deploy.sh')
    remote.remote('app', "sed -i '/^SERVER_TOMCAT_MAX_CONNECTIONS=/d; /^SERVER_TOMCAT_ACCEPT_COUNT=/d' /opt/lab4/app.env")
    remote.remote('app', "sed -i '/^SERVER_TOMCAT_THREADS_MAX=/d; /^SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=/d' /opt/lab4/app.env; printf '\\nSERVER_TOMCAT_THREADS_MAX=40\\nSPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=20\\n' >> /opt/lab4/app.env")
    if args.operation == 'write':
        remote.remote('app', "printf '\\nSERVER_TOMCAT_MAX_CONNECTIONS=256\\nSERVER_TOMCAT_ACCEPT_COUNT=256\\n' >> /opt/lab4/app.env")
    stage_module.environment.prepare(args.backend, out, heap_mib=128 if args.operation == 'write' else 192)
summary = stage_module.stage(args.operation, args.rate, args.purpose, 20, tomcat_max_threads=40)
assert summary.get('mean_ms') is not None, '正式窗口没有请求，检查运行目录中的failure.json'
d = out / 'results/runs' / summary['name']
audit = latest['audit']
hosts = audit['hosts']
sender = {'passed': audit['passed'] and not summary['generator_limit'], 'hosts': hosts,
          'max_threads': sum(x['max_threads'] for x in hosts.values()),
          'min_available_mib': min(x['min_available_mib'] for x in hosts.values()),
          'pids_events_before': {k: x['pids_before'] for k, x in hosts.items()},
          'pids_events_after': {k: x['pids_after'] for k, x in hosts.items()}}
(d / 'sender-audit.json').write_text(json.dumps(sender, ensure_ascii=False, indent=2) + '\n')
summary.update(generator_role='monitor+compiler', thread_groups=10, startup_pause_s=5,
               application_heap_mib=128 if args.operation == 'write' else 192,
               tomcat_max_connections=256 if args.operation == 'write' else 8192)
if not sender['passed']:
    summary.update(generator_limit=True, classification='generator_limit')
(d / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
config = json.loads((d / 'config.json').read_text())
config.update(sender_roles=['monitor', 'compiler'], thread_groups=10,
              jmeter_heap_mib={'monitor': 512, 'compiler': 192}, jmeter_stack_kib=192,
              http_implementation='Java', startup_pause_s=5,
              http_connect_timeout_ms=200 if args.operation == 'write' else 2000,
              http_response_timeout_ms=500 if args.operation == 'write' else 2000,
              application_heap_mib=summary['application_heap_mib'],
              tomcat_max_connections=summary['tomcat_max_connections'])
(d / 'config.json').write_text(json.dumps(config, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: summary[k] for k in ['name', 'mean_ms', 'error_rate', 'hps_min', 'hps_max', 'classification']}, ensure_ascii=False))
raise SystemExit(0 if sender['passed'] else 1)
