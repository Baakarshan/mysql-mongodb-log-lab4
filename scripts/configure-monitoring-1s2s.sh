#!/usr/bin/env bash
set -euo pipefail
# 在Manager执行；保留现有Prometheus容器和历史数据，校验后重载配置。
ROOT=${LAB_HOME:-/opt/lab4}
docker cp "$ROOT/scripts/lab4-recording-rules.yml" lab4-prometheus:/etc/prometheus/lab4-recording-rules.yml
docker cp "$ROOT/scripts/prometheus.yml" lab4-prometheus:/tmp/lab4-prometheus.yml
docker exec lab4-prometheus /bin/promtool check config /tmp/lab4-prometheus.yml
cp "$ROOT/prometheus.yml" "$ROOT/prometheus.yml.before-1s2s"
# 使用写入保留绑定挂载的原文件，避免重命名导致容器仍读取旧文件。
cat "$ROOT/scripts/prometheus.yml" > "$ROOT/prometheus.yml"
docker kill --signal=HUP lab4-prometheus
