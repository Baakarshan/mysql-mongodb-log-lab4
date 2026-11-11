#!/usr/bin/env bash
set -euo pipefail
# Run 'node' on all four hosts; run 'prometheus' on Manager.
ROOT=${LAB_HOME:-/opt/lab4}
case "$1" in
 node)
  : "${HOST_PRIVATE_IP:?Set HOST_PRIVATE_IP}"
  docker run -d --name lab4-node-exporter --restart unless-stopped --network host --pid host -v /:/host:ro,rslave "${NODE_EXPORTER_IMAGE:-prom/node-exporter:v1.10.2}" --path.rootfs=/host --web.listen-address="$HOST_PRIVATE_IP:9100"
  ;;
 prometheus)
  docker run -d --name lab4-prometheus --restart unless-stopped --memory=512m --network host -v "$ROOT/scripts/prometheus.yml:/etc/prometheus/prometheus.yml:ro" "${PROMETHEUS_IMAGE:-prom/prometheus:v3.7.3}" --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.retention.time=7d --web.listen-address="${MONITOR_PRIVATE_IP:-172.31.7.102}:19090"
  ;;
 *) echo 'Usage: deploy-monitoring.sh node|prometheus' >&2;exit 2;;
esac
