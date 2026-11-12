"""Create report crops from preserved original browser screenshots."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
R=Path(__file__).resolve().parents[1];S=R/'screenshots'
# Screenshot capture records contain the observed DOM rectangle of each graph.
manifest=S/'jmeter-manifest.json'
if manifest.exists():
 records=json.loads(manifest.read_text());cropped={}
 for row in records:
  im=Image.open(S/row['file']);rect=row.get('screenshotRect',row['rect']);x,y,w,h=[rect[k] for k in ['x','y','width','height']];box=(int(x),int(y),min(im.width,int(x+w)),min(im.height,int(y+h)))
  assert box[2]>box[0] and box[3]>box[1],row
  panel=im.crop(box);name=row['file'].replace('.jpg','-panel.jpg');panel.save(S/name,quality=96);cropped[row['name'],row['kind']]=panel
 for name in sorted({row['name'] for row in records}):
  left=cropped[name,'time'];right=cropped[name,'percentile'];pair=Image.new('RGB',(left.width+right.width+20,max(left.height,right.height)),'white');pair.paste(left,(0,0));pair.paste(right,(left.width+20,0));pair.save(S/f'jmeter-{name}-pair.jpg',quality=96)
 font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',25)
 for op in ['read','write']:
  items={(b,k):cropped.get((f'{b}-{op}-t200-r1',k)) for b in ['mysql','mongo'] for k in ['time','percentile']}
  if any(v is None for v in items.values()):continue
  width=max(im.width for im in items.values());height=max(im.height for im in items.values());out=Image.new('RGB',(width*2+24,height*2+75),'white');draw=ImageDraw.Draw(out)
  for j,b in enumerate(['mysql','mongo']):
   draw.text((j*(width+24)+15,7),'MySQL / JPA' if b=='mysql' else 'MongoDB / Spring Data',font=font,fill='#111111')
   for i,k in enumerate(['time','percentile']):out.paste(items[b,k],(j*(width+24),42+i*(height+20)))
  out.save(S/f'{op}-jmeter-comparison.jpg',quality=96)
print('Prepared report screenshot crops')

# Preserve both Prometheus pages in a compact, side-by-side report figure.
left=Image.open(S/'mysql-read-t200-r1-prometheus-cpu.jpg')
right=Image.open(S/'mongo-read-t200-r1-prometheus-cpu.jpg')
width=max(left.width,right.width)
left=left.resize((width,round(left.height*width/left.width)),Image.Resampling.LANCZOS)
right=right.resize((width,round(right.height*width/right.width)),Image.Resampling.LANCZOS)
pair=Image.new('RGB',(width*2+20,max(left.height,right.height)),'white')
pair.paste(left,(0,0));pair.paste(right,(width+20,0));pair.save(S/'prometheus-cpu-comparison.jpg',quality=96)
