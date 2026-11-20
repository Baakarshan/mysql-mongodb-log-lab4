"""四机两轮实验的应用恢复、数据库切换与接口检查。"""
from pathlib import Path
import json,time
import experiment as remote

def save(path,value):
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')

def remove_app():
    # 小内存主机发生OOM时，先释放实验JAR内存，再调用Docker删除实验容器。
    # 调用前暂停共用资源的RBAC服务；此阶段只运行实验JAR。
    command='for p in /proc/[0-9]*; do if read -r comm < "$p/comm" 2>/dev/null && [[ "$comm" == java ]]; then mapfile -d "" args < "$p/cmdline"; case "${args[*]}" in *"/app.jar"*) kill -KILL "${p##*/}";; esac; fi; done'
    remote.remote('app',command)
    remote.remote('app','docker rm -f lab4-app',False)

def recover(out):
    out=Path(out)
    try:
        remote.remote('app','timeout 20s docker restart -t 5 lab4-app')
    except RuntimeError as error:
        (out/'evidence'/'application-recovery-failure.txt').write_text(str(error)+'\n')
        # 只结束实验JAR，释放主机内存后恢复实验容器。
        command='for p in /proc/[0-9]*; do if read -r comm < "$p/comm" 2>/dev/null && [[ "$comm" == java ]]; then mapfile -d "" args < "$p/cmdline"; case "${args[*]}" in *"/app.jar"*) kill -KILL "${p##*/}";; esac; fi; done'
        remote.remote('app',command)
        time.sleep(3)
        remote.remote('app','timeout 20s docker start lab4-app',False)
    remote.app_ready()
def prepare(backend,out,heap_mib=None):
    out=Path(out)
    remote.remote('app','docker stop lab4-app',False)
    other='mongo' if backend=='mysql' else 'mysql'
    remote.remote('db',f'docker stop lab4-{other}',False)
    remote.remote('db',f'docker start lab4-{backend}')
    for _ in range(30):
        try:remote.count(backend);break
        except Exception:time.sleep(1)
    remove_app()
    prefix=f'APP_HEAP_MIB={heap_mib} ' if heap_mib else ''
    remote.remote('app',f"sed -i 's/^SPRING_PROFILES_ACTIVE=.*/SPRING_PROFILES_ACTIVE={backend}/' /opt/lab4/app.env; {prefix}bash /opt/lab4/scripts/deploy.sh app")
    remote.app_ready()
    remote.remote('db',f'bash /opt/lab4/scripts/reset-db.sh {backend}')
    smoke=json.loads(remote.remote('monitor','python3 /opt/lab4/scripts/smoke.py'))
    assert smoke['passed'];save(out/'evidence'/f'{backend}-smoke.json',smoke)
    deployment={role:remote.remote(role,'date -u; free -m; docker ps --format "{{.Names}} {{.Image}} {{.Status}}"',False) for role in remote.HOSTS}
    deployment['jar']=remote.remote('app','sha256sum /opt/lab4/app.jar')
    save(out/'evidence'/f'{backend}-deployment.json',deployment)
    if backend=='mysql':
        cmd='source /opt/lab4/db.env; docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -uroot lab4 -e "SELECT VERSION(); SHOW INDEX FROM logs; SELECT @@innodb_buffer_pool_size,@@innodb_flush_log_at_trx_commit,@@log_bin;"'
    else:
        cmd='''source /opt/lab4/db.env; docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval 'print(db.version()); printjson(db.logs.getIndexes()); printjson(db.adminCommand({getCmdLineOpts:1}).parsed.storage);' '''
    (out/'evidence'/f'{backend}-database-settings.txt').write_text(remote.remote('db',cmd))

