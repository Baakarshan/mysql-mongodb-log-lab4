"""按每类完整时间轴生成原生Prometheus截图入口与运行编号。"""
from pathlib import Path
import json,datetime,math,urllib.parse,sys
R=Path(sys.argv[1]);data=json.loads((R/'results/all-runs.json').read_text());out={}
for key in ['mysql-read','mysql-write','mongo-read','mongo-write']:
 ss=[s for s in data if s['backend']+'-'+s['operation']==key]
 if not ss:continue
 begin=math.floor((min(s['start_ms'] for s in ss)/1000-10)/60)*60;end=math.ceil((max(s['measurement_end_ms'] for s in ss)/1000+10)/60)*60
 endstr=datetime.datetime.fromtimestamp(end,datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S');urls={}
 for kind,metric in [('cpu','cpu'),('memory','memory')]:
  for mode,suffix in [('lines',''),('stacked','-stacked')]:
   params={'g0.expr':f'node:{metric}_usage_percent{{role=~"application|database"}}','g0.show_tree':'0','g0.tab':'graph','g0.end_input':endstr,'g0.moment_input':endstr,'g0.range_input':str((end-begin)//60)+'m','g0.res_type':'custom','g0.res_step':'2','g0.display_mode':mode,'g0.show_exemplars':'0'}
   urls[kind+suffix]='http://127.0.0.1:19093/query?'+urllib.parse.urlencode(params)
 out[key]={'begin':begin,'end':end,'urls':urls,'runs':[{'number':i,'name':s['name'],'rate':s['target_rps'],'N':s['threads'],'formal_start_ms':s['measurement_start_ms'],'formal_end_ms':s['measurement_end_ms']} for i,s in enumerate(ss,1)]}
 blocks=[]
 for i,s in enumerate(ss,1):
  if not blocks or s['start_ms']-blocks[-1][-1][1]['measurement_end_ms']>600000:blocks.append([])
  blocks[-1].append((i,s))
 out[key]['panels']=[]
 for block in blocks:
  pb=math.floor(block[0][1]['start_ms']/1000-5);pe=math.ceil(block[-1][1]['measurement_end_ms']/1000+5);pu={}
  for kind,url in urls.items():
   parsed=urllib.parse.urlparse(url);q=urllib.parse.parse_qs(parsed.query);endtext=datetime.datetime.fromtimestamp(pe,datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S');q.update({'g0.end_input':[endtext],'g0.moment_input':[endtext],'g0.range_input':[str(pe-pb)+'s']});pu[kind]=urllib.parse.urlunparse(parsed._replace(query=urllib.parse.urlencode(q,doseq=True)))
  out[key]['panels'].append({'begin':pb,'end':pe,'numbers':[i for i,s in block],'urls':pu})
(R/'evidence/screenshot-plan.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False,indent=2))
