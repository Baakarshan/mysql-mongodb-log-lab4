"""将分开的同库时段原生图组合成一图，保留各自时间轴。"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,sys
R=Path(sys.argv[1]);key=sys.argv[2];plan=json.loads((R/'evidence/screenshot-plan.json').read_text())[key];ss=json.loads((R/'groups'/key/'results/all-runs.json').read_text());font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',17)
for kind in ['cpu','memory','cpu-stacked','memory-stacked']:
 images=[]
 for panel_number,panel in enumerate(plan['panels'],1):
  im=Image.open(R/'screenshots/original'/f'{key}-p{panel_number}-{kind}.png').convert('RGB');draw=ImageDraw.Draw(im);positions=[]
  for number in panel['numbers']:
   s=ss[number-1];t=(s['measurement_start_ms']+s['measurement_end_ms'])/2000;x=85+(t-panel['begin'])/(panel['end']-panel['begin'])*(1448-85);positions.append((number,s,x))
  centers=[x for n,s,x in positions]
  for i in range(1,len(centers)):centers[i]=max(centers[i],centers[i-1]+62)
  if centers and centers[-1]>1415:
   centers[-1]=1415
   for i in range(len(centers)-2,-1,-1):centers[i]=min(centers[i],centers[i+1]-62)
  for j,(number,s,x) in enumerate(positions):
   label=f'{number:02d}\n{s["target_rps"]}/s';w=draw.multiline_textbbox((0,0),label,font=font)[2];tx=max(86,min(centers[j]-w/2,1447-w));draw.rectangle((tx-3,292,tx+w+3,333),fill='white');draw.multiline_text((tx,293),label,font=font,fill='#202020',align='center',spacing=1);draw.line((centers[j],334,x,351),fill='#202020',width=2);draw.polygon([(x,358),(x-4,350),(x+4,350)],fill='#202020')
  images.append(im.crop((15,190,1489,947)))
 out=Image.new('RGB',(images[0].width,sum(x.height for x in images)+16*(len(images)-1)),'white');y=0
 for im in images:out.paste(im,(0,y));y+=im.height+16
 out.save(R/'screenshots'/(key+'-'+kind+'.jpg'),quality=96)
print('Combined native periods',key,len(plan['panels']))
