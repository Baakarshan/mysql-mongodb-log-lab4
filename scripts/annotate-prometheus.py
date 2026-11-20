"""在原生截图上按真实正式窗口添加档位箭头，保留未标注原图。"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,datetime,sys
R=Path(sys.argv[1]);key=sys.argv[2];plan=json.loads((R/'evidence/screenshot-plan.json').read_text())[key];start=float(sys.argv[3]) if len(sys.argv)>3 else plan['begin'];end=float(sys.argv[4]) if len(sys.argv)>4 else plan['end'];ss=json.loads((R/'groups'/key/'results/all-runs.json').read_text());font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',16)
for kind in ['cpu','memory','cpu-stacked','memory-stacked']:
 p=R/'screenshots'/(key+'-'+kind+'.jpg');original=R/'screenshots/original'/(key+'-'+kind+'.png');original.parent.mkdir(exist_ok=True)
 if not original.exists():Image.open(p).save(original)
 im=Image.open(original).convert('RGB');d=ImageDraw.Draw(im)
 centers=[85+(((s['measurement_start_ms']+s['measurement_end_ms'])/2000)-start)/(end-start)*(1448-85) for s in ss]
 labels=centers.copy()
 for i in range(1,len(labels)):labels[i]=max(labels[i],labels[i-1]+58)
 if labels and labels[-1]>1418:
  labels[-1]=1418
  for i in range(len(labels)-2,-1,-1):labels[i]=min(labels[i],labels[i+1]-58)
 for i,s in enumerate(ss,1):
  t=(s['measurement_start_ms']+s['measurement_end_ms'])/2000;x=85+(t-start)/(end-start)*(1448-85);label=f'{i:02d}\n{s["target_rps"]}/s';box=d.multiline_textbbox((0,0),label,font=font,spacing=1);w=box[2];label_x=labels[i-1];tx=max(86,min(label_x-w/2,1447-w));d.rectangle((tx-3,292,tx+w+3,330),fill='white');d.multiline_text((tx,293),label,font=font,spacing=1,fill='#202020',align='center');d.line((label_x,332,x,351),fill='#202020',width=2);d.polygon([(x,358),(x-4,350),(x+4,350)],fill='#202020')
 im.save(p,quality=95)
print('标注',key,len(ss),'档')
