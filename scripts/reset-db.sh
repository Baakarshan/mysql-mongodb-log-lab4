#!/usr/bin/env bash
set -euo pipefail
ROOT=${LAB_HOME:-/opt/lab4}
source "$ROOT/db.env"
if [ "$1" = mysql ]; then
 docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -uroot lab4 -e "TRUNCATE TABLE logs; LOAD DATA INFILE '/fixtures/logs.tsv' INTO TABLE logs FIELDS TERMINATED BY '\\t' LINES TERMINATED BY '\\n' (id,trace_id,level,source,message,client_ip,created_at); ANALYZE TABLE logs; SELECT COUNT(*) AS record_count FROM logs;"
else
 docker exec lab4-mongo mongoimport --host localhost --username "$DB_USER" --password "$DB_PASSWORD" --authenticationDatabase admin --db lab4 --collection logs --drop --file /fixtures/logs.jsonl --quiet
 docker exec lab4-mongo mongosh --quiet --username "$DB_USER" --password "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval 'db.logs.createIndex({level:1,createdAt:-1,_id:-1},{name:"idx_level_time_id"}); print("record_count="+db.logs.countDocuments({}));'
fi
