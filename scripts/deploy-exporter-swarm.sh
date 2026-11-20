#!/usr/bin/env bash
set -euo pipefail
# 在 Manager 执行。先在三个节点分别停止旧的 lab4-node-exporter 容器，释放9100端口。
# 各服务固定到对应节点，绑定内网地址；Prometheus继续使用原来的采集目标。
IMAGE='swr.cn-north-4.myhuaweicloud.com/oomall-javaee/prom/node-exporter@sha256:7bcf2839f207d926b908cd3c566c9f1577efb72268062be0c96cd3b17a5cb283'
while read -r suffix hostname address; do
  docker service create --detach=true --no-resolve-image \
    --name "lab4-node-exporter-$suffix" \
    --constraint "node.hostname==$hostname" --replicas 1 \
    --network host --restart-condition any \
    --mount type=bind,source=/,target=/host,readonly,bind-propagation=rslave \
    "$IMAGE" --path.rootfs=/host --path.procfs=/host/proc --path.sysfs=/host/sys \
    --web.listen-address="$address:9100"
done <<'NODES'
manager course-manager 172.31.7.102
node1 course-node1 172.31.12.231
node2 course-node2 172.31.12.145
NODES

docker service ls --filter name=lab4-node-exporter
