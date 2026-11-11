#!/usr/bin/env bash
set -euo pipefail
# Run on the relevant server after copying the project to /opt/lab4.
ROOT=${LAB_HOME:-/opt/lab4}
DB_IP=${DB_HOST:-172.31.12.231}
APP_IP=${APP_HOST:-172.31.12.145}
MYSQL_IMAGE=${MYSQL_IMAGE:-mysql:8.4.13}
MONGO_IMAGE=${MONGO_IMAGE:-docker.m.daocloud.io/library/mongo@sha256:c630c59342c1493d50345136df2af14a76b9e827dd5316bfabee07a0880a5f3a}
JAVA_IMAGE=${JAVA_IMAGE:-docker.m.daocloud.io/library/eclipse-temurin@sha256:2a9eb226abb654c9d1f91b53cf638d20cb3abb726d1b18a67909c29515545469}
case "$1" in
 mysql)
  source "$ROOT/db.env"
  mkdir -p "$ROOT/mysql" "$ROOT/fixtures"
  docker run -d --name lab4-mysql --restart unless-stopped --memory=1g -p "$DB_IP:3306:3306" -e MYSQL_ROOT_PASSWORD="$DB_PASSWORD" -e MYSQL_DATABASE=lab4 -e MYSQL_USER=lab4 -e MYSQL_PASSWORD="$DB_PASSWORD" -v "$ROOT/mysql:/var/lib/mysql" -v "$ROOT/fixtures:/fixtures" "$MYSQL_IMAGE" --innodb-buffer-pool-size=268435456 --innodb-flush-log-at-trx-commit=1 --skip-log-bin --secure-file-priv=/fixtures --max-connections=100 --performance-schema=OFF
  ;;
 mongo)
  source "$ROOT/db.env"
  docker run -d --name lab4-mongo --restart unless-stopped --memory=1g -p "$DB_IP:27017:27017" -e MONGO_INITDB_ROOT_USERNAME="$DB_USER" -e MONGO_INITDB_ROOT_PASSWORD="$DB_PASSWORD" -v "$ROOT/mongo:/data/db" -v "$ROOT/fixtures:/fixtures:ro" "$MONGO_IMAGE" --wiredTigerCacheSizeGB 0.25 --bind_ip_all
  ;;
 app)
  docker run -d --name lab4-app --restart unless-stopped --memory=560m -p "$APP_IP:18080:8080" --env-file "$ROOT/app.env" -v "$ROOT/app.jar:/app.jar:ro" "$JAVA_IMAGE" java -Xms64m -Xmx256m -Xss256k -XX:MaxMetaspaceSize=128m -jar /app.jar
  ;;
 *) echo 'Usage: deploy.sh mysql|mongo|app' >&2; exit 2;;
esac
