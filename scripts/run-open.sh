#!/usr/bin/env bash
set -euo pipefail
# operation requests-per-second output-dir [seconds]
ROOT=${LAB_HOME:-/opt/lab4}
operation=$1
rate=$2
output=$3
duration=${4:-35}
mkdir -p "$output"
ulimit -n 65536
GOMEMLIMIT=384MiB GOMAXPROCS=2 "$ROOT/tools/open-load" \
  -operation "$operation" -rate "$rate" -seconds "$duration" \
  -url "http://${APP_HOST:-172.31.12.145}:18080" -output "$output" \
  > "$output/console.log" 2>&1 &
load_pid=$!
(
 while kill -0 "$load_pid" 2>/dev/null; do
  date -u +%s
  ps -p "$load_pid" -o pid=,pcpu=,rss=,nlwp= || true
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
exit "$status"
