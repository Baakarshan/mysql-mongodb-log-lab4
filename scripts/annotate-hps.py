"""在原生HPS截图的正式平台中点标注运行编号，原图不变。"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,sys
R=Path(sys.argv[1]);key=sys.argv[2];maximum=float(sys.argv[3]);runs=json.loads((R/'groups'/key/'results/all-runs.json').read_text());rect=json.loads((R/'screenshots/original'/(key+'-hps-rect.json')).read_text());im=Image.open(R/'screenshots/original'/(key+'-hps.png')).crop((int(rect['x']),int(rect['y']),int(rect['x']+rect['width']),int(rect['y']+rect['height']))).convert('RGB');d=ImageDraw.Draw(im);font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',18)
start=min(x['measurement_start_ms'] for x in runs);end=max(x['measurement_end_ms'] for x in runs)-1
for i,s in enumerate(runs,1):
 t=(s['measurement_start_ms']+s['measurement_end_ms'])/2;x=80+(t-start)/(end-start)*867;y=409-s['target_rps']/maximum*338;label=f'{i:02d}';w=d.textbbox((0,0),label,font=font)[2];tx=min(941-w,max(82,x-w/2));ty=y+15 if y<118 else y-44
 d.rectangle((tx-2,ty-2,tx+w+2,ty+20),fill='white');d.text((tx,ty),label,fill='#202020',font=font)
 tip=y+5 if y<118 else y-5;tail=ty-2 if y<118 else ty+22;d.line((x,tail,x,tip),fill='#202020',width=2);direction=-1 if y<118 else 1;d.polygon([(x,tip),(x-4,tip-direction*7),(x+4,tip-direction*7)],fill='#202020')
im.save(R/'screenshots'/(key+'-hps.jpg'),quality=96)
