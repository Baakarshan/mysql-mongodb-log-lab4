"""按浏览器记录的实际区域裁切原生截图，原图完整保留。"""
from pathlib import Path
from PIL import Image
import json,sys,math
R=Path(sys.argv[1]);key=sys.argv[2]
def box(r):return (math.floor(r['x']),math.floor(r['y']),math.ceil(r['x']+r['width']),math.ceil(r['y']+r['height']))
for kind in ['hps','response','percentiles']:
 p=R/'screenshots/original'/(key+'-'+kind)
 r=json.loads(p.with_name(p.name+'-rect.json').read_text());Image.open(p.with_suffix('.png')).crop(box(r)).convert('RGB').save(R/'screenshots'/(key+'-'+kind+'.jpg'),quality=96)
p=R/'screenshots/original'/(key+'-dashboard');r=json.loads(p.with_name(p.name+'-rect.json').read_text());im=Image.open(p.with_suffix('.png'));pie=im.crop(box(r['pie']));table=im.crop(box(r['table']));out=Image.new('RGB',(table.width,pie.height+table.height+16),'white');out.paste(pie,((table.width-pie.width)//2,0));out.paste(table,(0,pie.height+16));out.save(R/'screenshots'/(key+'-dashboard.jpg'),quality=96)
print('Cropped native',key)
