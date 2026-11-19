"""按真实时段组合原生HPS平台，箭头编号对应完整结果表。"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,sys
R=Path(sys.argv[1]);key=sys.argv[2];maxima=list(map(float,sys.argv[3].split(',')));plan=json.loads((R/'evidence/screenshot-plan.json').read_text())[key];ss=json.loads((R/'groups'/key/'results/all-runs.json').read_text());font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',18);images=[]
for n,panel in enumerate(plan['panels'],1):
 maximum=maxima[min(n-1,len(maxima)-1)];base=R/'screenshots/original'/f'{key}-p{n}-hps';rect=json.loads(base.with_name(base.name+'-rect.json').read_text());im=Image.open(base.with_suffix('.png')).crop((int(rect['x']),int(rect['y']),int(rect['x']+rect['width']),int(rect['y']+rect['height']))).convert('RGB');d=ImageDraw.Draw(im);values=[ss[i-1] for i in panel['numbers']];start=min(x['measurement_start_ms'] for x in values);end=max(x['measurement_end_ms'] for x in values)-1
 for number,s in zip(panel['numbers'],values):
  tm=(s['measurement_start_ms']+s['measurement_end_ms'])/2;x=80+(tm-start)/(end-start)*867;y=409-s['target_rps']/maximum*338;label=f'{number:02d}';w=d.textbbox((0,0),label,font=font)[2];tx=min(941-w,max(82,x-w/2));ty=y+15 if y<118 else y-44
  d.rectangle((tx-2,ty-2,tx+w+2,ty+20),fill='white');d.text((tx,ty),label,fill='#202020',font=font);tip=y+5 if y<118 else y-5;tail=ty-2 if y<118 else ty+22;d.line((x,tail,x,tip),fill='#202020',width=2);direction=-1 if y<118 else 1;d.polygon([(x,tip),(x-4,tip-direction*7),(x+4,tip-direction*7)],fill='#202020')
 images.append(im)
out=Image.new('RGB',(max(i.width for i in images),sum(i.height for i in images)+16*(len(images)-1)),'white');yy=0
for im in images:out.paste(im,(0,yy));yy+=im.height+16
out.save(R/'screenshots'/(key+'-hps.jpg'),quality=96);print('Native HPS periods combined',key,len(images))
