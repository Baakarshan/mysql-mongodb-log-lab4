"""Deterministic 100,000-log fixture, shared by MySQL and MongoDB."""
import json,random,datetime,pathlib,hashlib
out=pathlib.Path(__import__('sys').argv[1] if len(__import__('sys').argv)>1 else 'work');out.mkdir(parents=True,exist_ok=True)
rng=random.Random(20261111);base=datetime.datetime(2026,11,1,tzinfo=datetime.timezone.utc)
a='0123456789ABCDEFGHJKMNPQRSTVWXYZ'
def ulid(i):
 n=(int(base.timestamp()*1000)<<80)+i;s=''
 for _ in range(26):s=a[n&31]+s;n>>=5
 return s
with (out/'logs.tsv').open('w') as sql,(out/'logs.jsonl').open('w') as mongo:
 for i in range(100000):
  t=base+datetime.timedelta(milliseconds=i*864);level=rng.choices(['TRACE','DEBUG','INFO','WARN','ERROR'],[1,9,60,20,10])[0]
  e={'_id':ulid(i),'traceId':f'trace-{i:08d}','level':level,'source':f'course-service-{i%8}','message':f'Log event {i:08d}: '+('course benchmark payload. '*10),'clientIp':f'10.0.{i%250}.{i%254+1}','createdAt':{'$date':t.isoformat(timespec='milliseconds').replace('+00:00','Z')}}
  sql.write('\t'.join([e['_id'],e['traceId'],level,e['source'],e['message'],e['clientIp'],t.strftime('%Y-%m-%d %H:%M:%S.%f')])+'\n')
  mongo.write(json.dumps(e,separators=(',',':'))+'\n')
for p in [out/'logs.tsv',out/'logs.jsonl']:print(p.name,hashlib.sha256(p.read_bytes()).hexdigest())
