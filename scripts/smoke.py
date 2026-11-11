import urllib.request,urllib.error,json,datetime,random,sys
BASE='http://172.31.12.145:18080';checks=[]
def request(method,path,data=None,expected=200):
 req=urllib.request.Request(BASE+path,data=json.dumps(data).encode() if data is not None else None,method=method,headers={'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(req,timeout=20) as r:status=r.status;body=json.load(r)
 except urllib.error.HTTPError as e:status=e.code;body=json.load(e)
 assert status==expected,(method,path,status,body)
 checks.append({'method':method,'path':path,'status':status});return body
query='/api/logs?level=INFO&from=2026-11-01T06:00:00Z&to=2026-11-01T07:00:00Z&page=0&size=20'
a=request('GET',query);assert len(a['content'])==20
rng=random.Random(20261111);expected=[];alphabet='0123456789ABCDEFGHJKMNPQRSTVWXYZ'
for i in range(100000):
 level=rng.choices(['TRACE','DEBUG','INFO','WARN','ERROR'],[1,9,60,20,10])[0]
 if level=='INFO' and 21600000<=i*864<25200000:expected.append(i)
assert a['totalElements']==len(expected),(a['totalElements'],len(expected))
def ulid(i):
 n=(1793491200000<<80)+i;s=''
 for _ in range(26):s=alphabet[n&31]+s;n>>=5
 return s
assert [e['id'] for e in a['content']]==[ulid(i) for i in expected[::-1][:20]]
b=request('GET',query.replace('page=0','page=1'));assert not ({x['id'] for x in a['content']}&{x['id'] for x in b['content']})
request('GET',query.replace('INFO','INVALID'),expected=400)
request('GET',query.replace('page=0','page=-1'),expected=400)
request('GET',query.replace('size=20','size=101'),expected=400)
empty=request('GET',query.replace('2026-11-01','2020-01-01'));assert empty['content']==[] and empty['totalElements']==0
entry={'traceId':'smoke','level':'INFO','source':'smoke','message':'课程实验日志','clientIp':'::1','createdAt':'2026-11-03T00:00:00.123999Z'}
c=request('POST','/api/logs',entry,201);assert len(c['id'])==26 and c['createdAt']=='2026-11-03T00:00:00.123Z'
for field,value in [('level','INVALID'),('message','x'*4097),('source',''),('traceId','x'*65),('createdAt',None)]:
 d=dict(entry);d[field]=value;request('POST','/api/logs',d,400)
# Verify left-closed/right-open range at stored millisecond precision.
edge='/api/logs?level=INFO&from=2026-11-03T00:00:00.123Z&to=2026-11-03T00:00:00.124Z'
assert request('GET',edge)['content'][0]['id']==c['id']
assert request('GET',edge.replace('from=2026-11-03T00:00:00.123Z','from=2026-11-03T00:00:00.122Z').replace('to=2026-11-03T00:00:00.124Z','to=2026-11-03T00:00:00.123Z'))['totalElements']==0
result={'checks':checks,'query':a,'write':c,'seed_query_count':len(expected),'passed':True}
print(json.dumps(result,ensure_ascii=False,indent=2))
