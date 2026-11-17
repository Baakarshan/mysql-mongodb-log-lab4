#!/usr/bin/env bash
set -euo pipefail
# operation threads output-dir [requests-per-second] [seconds] [loops]
ROOT=${LAB_HOME:-/opt/lab4}
export JAVA_HOME=${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}
export HEAP="-Xms64m -Xmx${LAB_JMETER_HEAP_MB:-256}m -XX:MaxMetaspaceSize=128m"
export JVM_ARGS='-Xss256k'
operation=$1
threads=$2
output=$3
rate=${4:-$((threads * 10))}
duration=${5:-35}
loops=${6:-600}
mkdir -p "$output"
test ! -e "$output/all.jtl"
timeout --signal=TERM --kill-after=5s "$((duration + 30))s" \
  "${JMETER_HOME:-/opt/lab3/tools/apache-jmeter-5.6.3}/bin/jmeter" \
  -n -t "$ROOT/jmeter/adaptive-logs.jmx" -q "$ROOT/scripts/jmeter.properties" \
  -Jhost="${APP_HOST:-172.31.12.145}" -Jport=18080 -Joperation="$operation" \
  -Jthreads="$threads" -Jramp=5 -Jduration="$duration" -Jloops="$loops" \
  -Jrpm="$((rate * 60))" -JclockFile="$output/start-ms.txt" \
  -Jsummariser.interval=5 -l "$output/all.jtl" -j "$output/jmeter.log" \
  > "$output/console.log" 2>&1 &
load_pid=$!
(
  while kill -0 "$load_pid" 2>/dev/null; do
    date -u +%s
    ps -eo pid=,pcpu=,rss=,nlwp=,args= | awk -v target="$output" \
      '$0 ~ /ApacheJMeter.jar/ && index($0,target) {print $1,$2,$3,$4}' || true
    awk '/MemAvailable/ {print}' /proc/meminfo
    curl -sS -o /dev/null --max-time 2 -w 'health %{http_code} %{time_total}\n' \
      "http://${APP_HOST:-172.31.12.145}:18080/actuator/health" || true
    sleep 2
  done
) > "$output/generator-health.txt" 2>&1 &
probe_pid=$!
set +e
wait "$load_pid"
load_status=$?
wait "$probe_pid"
set -e
printf '%s\n' "$load_status" > "$output/exit-code.txt"
gzip -c "$output/all.jtl" > "$output/all.jtl.gz"
exit "$load_status"
