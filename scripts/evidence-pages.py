from pathlib import Path
import html,json
R=Path(__file__).resolve().parents[1]
style='body{font:16px Georgia,"Songti SC",serif;margin:30px auto;max-width:1220px;color:#17202c}h1{font-size:25px}h2{font-size:19px;margin-top:26px}pre{font:13px/1.5 Menlo,monospace;background:#f3f5f7;border:1px solid #d5dae0;padding:16px;white-space:pre-wrap;overflow-wrap:anywhere}p{color:#505967}'
def save(name,title,body):
 (R/'evidence'/name).write_text('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>'+title+'</title><style>'+style+'</style><h1>'+title+'</h1>'+body)
for backend in ['mysql','mongo']:
 p=R/'evidence'/f'{backend}-deployment.json'
 if not p.exists():continue
 data=json.loads(p.read_text());body='<p>四台服务器实际命令输出，源文件：'+backend+'-deployment.json</p>'
 for role,text in data.items():
  # Show hostname, timestamp, memory and current containers; omit cached image listings.
  lines=text.splitlines();end=next((i for i,s in enumerate(lines) if '@sha256:' in s or s.endswith(' <none>')),len(lines));body+='<h2>'+role+'</h2><pre>'+html.escape('\n'.join(lines[:end]))+'</pre>'
 save(f'{backend}-deployment.html',backend.upper()+' 四机部署记录',body)
 db=(R/'evidence'/f'{backend}-database.txt').read_text();save(f'{backend}-database.html',backend.upper()+' 索引与查询计划','<pre>'+html.escape(db)+'</pre>')
 records=R/'evidence'/f'{backend}-records.txt'
 if records.exists():save(f'{backend}-records.html',backend.upper()+' 压测结束后的实际数据库记录','<p>最终记录总数及createdAt、id降序的3条实际记录。MySQL正文节选显示前80个字符。</p><pre>'+html.escape(records.read_text())+'</pre>')
 smoke=json.loads((R/'evidence'/f'{backend}-smoke.json').read_text());brief={k:v for k,v in smoke['query'].items() if k!='content'};brief['content']=smoke['query']['content'][:2]
 save(f'{backend}-api.html',backend.upper()+' 日志接口验收记录','<p>实际HTTP调用输出。完整响应与'+str(len(smoke['checks']))+'项检查见 '+backend+'-smoke.json。</p><h2>POST /api/logs　HTTP 201</h2><pre>'+html.escape(json.dumps(smoke['write'],ensure_ascii=False,indent=2))+'</pre><h2>GET /api/logs　HTTP 200</h2><pre>'+html.escape(json.dumps(brief,ensure_ascii=False,indent=2))+'</pre><h2>字段校验与时间边界</h2><pre>'+html.escape(json.dumps(smoke['checks'],ensure_ascii=False,indent=2))+'</pre>')
print('Evidence pages generated')
