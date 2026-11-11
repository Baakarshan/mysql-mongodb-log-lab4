#!/usr/bin/env bash
set -euo pipefail
# Usage: run-one.sh read|write threads output-directory [duration=160]
ROOT=${LAB_HOME:-/opt/lab4}
export JAVA_HOME=${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}
export HEAP='-Xms64m -Xmx256m -XX:MaxMetaspaceSize=128m'
export JVM_ARGS='-Xss256k'
mkdir -p "$3"
"${JMETER_HOME:-/opt/lab3/tools/apache-jmeter-5.6.3}/bin/jmeter" -n -t "$ROOT/jmeter/logs.jmx" -q "$ROOT/scripts/jmeter.properties" -Jhost="${APP_HOST:-172.31.12.145}" -Jport=18080 -Joperation="$1" -Jthreads="$2" -Jramp=10 -Jduration="${4:-160}" -JclockFile="$3/start-ms.txt" -l "$3/all.jtl" -j "$3/jmeter.log" > "$3/console.log" 2>&1
