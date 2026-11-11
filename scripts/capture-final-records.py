"""Read final persisted records after both completed rounds, one database at a time."""
from pathlib import Path
import json,time
import experiment as e
R=Path(__file__).resolve().parents[1]
assert json.loads((R/'results/status.json').read_text())['stage']=='complete'
assert len(list((R/'results/runs').glob('*/summary.json')))==72
try:
 mongo=e.remote('db',r'''date -u; source /opt/lab4/db.env; docker exec lab4-mongo mongosh --quiet -u "$DB_USER" -p "$DB_PASSWORD" --authenticationDatabase admin lab4 --eval 'print("Final log count: " + db.logs.countDocuments({})); printjson(db.logs.find({}).sort({createdAt:-1,_id:-1}).limit(3).toArray());' ''')
 (R/'evidence/mongo-records.txt').write_text(mongo)
 e.remote('app','docker stop lab4-app');e.remote('db','docker stop lab4-mongo; docker start lab4-mysql')
 try:
  for _ in range(30):
   ready=e.remote('db','source /opt/lab4/db.env; docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysqladmin -uroot ping',False)
   if 'alive' in ready:break
   time.sleep(2)
  mysql=e.remote('db',r'''date -u; source /opt/lab4/db.env; docker exec -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -uroot lab4 -e 'SELECT COUNT(*) AS final_log_count FROM logs; SELECT id,trace_id,level,source,LEFT(message,80) AS message_excerpt,client_ip,created_at FROM logs ORDER BY created_at DESC,id DESC LIMIT 3;' ''')
  (R/'evidence/mysql-records.txt').write_text(mysql)
 finally:
  e.remote('db','docker stop lab4-mysql; docker start lab4-mongo');e.remote('app','docker start lab4-app');e.app_ready()
 print('Saved persisted final records; restored MongoDB round services')
finally:
 for c in e.CLIENTS.values():c.close()
