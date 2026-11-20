#!/usr/bin/env bash
set -euo pipefail
# 独立的systemd服务拥有明确的任务配额，避免继承SSH用户组限制。
if [[ ${LAB4_IN_UNIT:-0} != 1 ]]; then
 unit="lab4-jmeter-$(date +%s%N)"
 memory_max=1200M
 if [[ $(hostname) == *compiler* ]]; then memory_max=430M; fi
 systemd-run --quiet --wait --unit="$unit" -p TasksMax=10000 -p MemoryMax="$memory_max" -p RuntimeMaxSec=110 -p LimitNOFILE=65536 -p LimitNPROC=10000 /usr/bin/env LAB4_IN_UNIT=1 LAB4_TARGET_HOST="${LAB4_TARGET_HOST:-172.31.12.145}" LAB4_TARGET_PORT="${LAB4_TARGET_PORT:-18080}" bash "$0" "$@"
 exit $?
fi
ROOT=${LAB_HOME:-/opt/lab4}
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
heap_mib=512
if [[ $(hostname) == *compiler* ]]; then heap_mib=192; fi
export HEAP="-Xms64m -Xmx${heap_mib}m -XX:MaxMetaspaceSize=96m -XX:+ExitOnOutOfMemoryError"
export JVM_ARGS='-Xss192k -XX:ActiveProcessorCount=2'
operation=$1; threads=$2; output=$3; ramp=${4:-55}
mkdir -p "$output"
python3 "$ROOT/scripts/select-jmeter-operation.py" "$ROOT/jmeter/single-shot-logs.jmx" "$operation" "$output/run.jmx"
python3 - "$output" "$operation" <<'PY'
import sys,json,resource
from pathlib import Path
p=Path(sys.argv[1]);import xml.etree.ElementTree as ET
t=ET.parse(p/'run.jmx')
for n in t.getroot().iter('stringProp'):
 if n.get('name')=='HTTPSampler.connect_timeout' and sys.argv[2]=='write':n.text='200'
 if n.get('name')=='HTTPSampler.response_timeout':n.text='500' if sys.argv[2]=='write' else '2000'
 if n.get('name')=='OpenModelThreadGroup.schedule':n.text='pause(5 sec) '+n.text
 if n.get('name')=='script' and 'clockFile' in (n.text or ''):n.text=n.text.replace('System.currentTimeMillis() + 999L','System.currentTimeMillis() + 5999L')
for n in t.getroot().iter('HTTPSamplerProxy'):
 ET.SubElement(n,'stringProp',{'name':'HTTPSampler.implementation'}).text='Java'
t.write(p/'run.jmx',encoding='UTF-8',xml_declaration=True)
cg=[x.split(':',2)[2] for x in Path('/proc/self/cgroup').read_text().splitlines() if ':pids:' in x][0];base=Path('/sys/fs/cgroup/pids')/cg.lstrip('/')
x={'cgroup':cg,'pids_max':(base/'pids.max').read_text().strip(),'rlimit_nofile':resource.getrlimit(resource.RLIMIT_NOFILE),'rlimit_nproc':resource.getrlimit(resource.RLIMIT_NPROC),'stack_kib':192,'heap_mib':192 if 'compiler' in __import__('socket').gethostname() else 512,'http_implementation':'Java','startup_pause_s':5}
(p/'sender-config.json').write_text(json.dumps(x,indent=2))
for n in ['pids.events','pids.current']:
 f=base/n
 if f.exists():(p/(n+'.before')).write_text(f.read_text())
PY
host=${LAB4_TARGET_HOST:-172.31.12.145};port=${LAB4_TARGET_PORT:-18080}
timeout --signal=TERM --kill-after=5s 100s "${JMETER_HOME:-/opt/lab3/tools/apache-jmeter-5.6.3}/bin/jmeter" -n -Jjmeterengine.force.system.exit=true -t "$output/run.jmx" -q "$ROOT/scripts/jmeter.properties" -Jhost="$host" -Jport="$port" -Joperation="$operation" -Jgroup_rate="$((threads / ramp / 5))" -Jramp="$ramp" -JclockFile="$output/start-ms.txt" -Lorg.apache.jmeter.threads=WARN -Lorg.apache.jmeter.protocol.http.sampler.HTTPJavaImpl=FATAL -Jsummariser.interval=5 -l "$output/all.jtl" -j "$output/jmeter.log" > "$output/console.log" 2>&1 &
load_pid=$!
python3 "$ROOT/scripts/probe-sender.py" "$output" "$load_pid" &
probe_pid=$!
set +e
wait "$load_pid";status=$?
wait "$probe_pid"
set -e
printf '%s\n' "$status" > "$output/exit-code.txt"
gzip -n "$output/all.jtl"
exit "$status"
