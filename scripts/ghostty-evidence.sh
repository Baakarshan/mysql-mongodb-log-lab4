#!/usr/bin/env bash
# 在 Node1 上执行，只读取现有记录与执行计划；分轮启动已有数据库容器。
set -euo pipefail
source /opt/lab4/db.env
case "${1:-}" in
 mysql-records|mysql-index)
  docker stop lab4-mongo >/dev/null
  docker start lab4-mysql >/dev/null
  for attempt in {1..40}; do
   if docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysqladmin -uroot ping >/dev/null 2>&1; then break; fi
   sleep 1
  done
  date -u '+Capture time: %Y-%m-%d %H:%M:%S UTC'
  if [[ "$1" == mysql-records ]]; then
   docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -t -uroot lab4 -e "SELECT COUNT(*) AS current_log_count, SUM(source='screenshot-demo' AND trace_id='edge-evidence') AS evidence_demo_rows FROM logs; SELECT id,trace_id,level,source,LEFT(message,60) AS message_excerpt,client_ip,created_at FROM logs WHERE level='INFO' AND created_at >= '2026-11-01 06:00:00' AND created_at < '2026-11-01 07:00:00' ORDER BY created_at DESC,id DESC LIMIT 2;"
  else
   docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -t -uroot lab4 -e "SHOW INDEX FROM logs; EXPLAIN SELECT * FROM logs WHERE level='INFO' AND created_at >= '2026-11-01 06:00:00' AND created_at < '2026-11-01 07:00:00' ORDER BY created_at DESC,id DESC LIMIT 20;"
  fi
  ;;
 mongo-records|mongo-index)
  docker stop lab4-mysql >/dev/null
  docker start lab4-mongo >/dev/null
  for attempt in {1..40}; do
   if docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin --eval 'db.adminCommand({ping:1})' >/dev/null 2>&1; then break; fi
   sleep 1
  done
  date -u '+Capture time: %Y-%m-%d %H:%M:%S UTC'
  if [[ "$1" == mongo-records ]]; then
   query='printjson({current_log_count:db.logs.countDocuments({}),evidence_demo_rows:db.logs.countDocuments({source:"screenshot-demo",traceId:"edge-evidence"})}); printjson(db.logs.find({level:"INFO",createdAt:{$gte:ISODate("2026-11-01T06:00:00Z"),$lt:ISODate("2026-11-01T07:00:00Z")}}).sort({createdAt:-1,_id:-1}).limit(2).toArray());'
  else
   query='printjson(db.logs.getIndexes()); const e=db.logs.find({level:"INFO",createdAt:{$gte:ISODate("2026-11-01T06:00:00Z"),$lt:ISODate("2026-11-01T07:00:00Z")}}).sort({createdAt:-1,_id:-1}).limit(20).explain("executionStats"); printjson(e.queryPlanner.winningPlan); printjson({nReturned:e.executionStats.nReturned,totalKeysExamined:e.executionStats.totalKeysExamined,totalDocsExamined:e.executionStats.totalDocsExamined});'
  fi
  docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval "$query"
  ;;
 *) printf 'Usage: %s mysql-records|mysql-index|mongo-records|mongo-index\n' "$0"; exit 2 ;;
esac
