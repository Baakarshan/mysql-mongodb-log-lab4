#!/usr/bin/env bash
set -euo pipefail
# 每个线程仅执行一次HTTP请求；在固定时间内逐个启动线程。
ROOT=${LAB_HOME:-/opt/lab4}
export JAVA_HOME=${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}
export HEAP='-Xms64m -Xmx384m -XX:MaxMetaspaceSize=128m'
export JVM_ARGS='-Xss256k -XX:ActiveProcessorCount=2'
operation=$1
threads=$2
output=$3
ramp=${4:-55}
mkdir -p "$output"
test ! -e "$output/all.jtl.gz"
ulimit -n 65536
python3 "$ROOT/scripts/select-jmeter-operation.py" "$ROOT/jmeter/single-shot-logs.jmx" "$operation" "$output/run.jmx"
timeout --signal=TERM --kill-after=5s 100s "${JMETER_HOME:-/opt/lab3/tools/apache-jmeter-5.6.3}/bin/jmeter" \
  -n -Jjmeterengine.force.system.exit=true -t "$output/run.jmx" -q "$ROOT/scripts/jmeter.properties" \
  -Jhost="${APP_HOST:-172.31.12.145}" -Jport=18080 -Joperation="$operation" \
  -Jgroup_rate="$((threads / ramp / 5))" -Jramp="$ramp" -JclockFile="$output/start-ms.txt" \
  -Lorg.apache.jmeter.threads=WARN -Jsummariser.interval=5 -l "$output/all.jtl" -j "$output/jmeter.log" \
  > "$output/console.log" 2>&1 &
load_pid=$!
(
 while kill -0 "$load_pid" 2>/dev/null; do
  date -u +%s
  jvm_pid=$(pgrep -f "[A]pacheJMeter.jar.*$output/start-ms.txt" || true)
  if [ -n "$jvm_pid" ]; then ps -p "$jvm_pid" -o pid=,pcpu=,rss=,nlwp= || true; fi
  awk '/MemAvailable/ {print}' /proc/meminfo
  sleep 1
 done
) > "$output/generator-health.txt" 2>&1 &
probe_pid=$!
set +e
wait "$load_pid"
status=$?
wait "$probe_pid"
set -e
printf '%s\n' "$status" > "$output/exit-code.txt"
gzip -n "$output/all.jtl"
exit "$status"
