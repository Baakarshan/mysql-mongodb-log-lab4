"""Crop native Edge screenshots without recreating their displayed contents."""
from pathlib import Path
from PIL import Image
import json,hashlib,datetime
R=Path(__file__).resolve().parents[1];S=R/'screenshots';manifest=[]
for row in json.loads((S/'jmeter-summary-manifest.json').read_text()):
 p=S/row['file'];im=Image.open(p);boxes=row['crop_boxes']
 panels=[im.crop(box).convert('RGB') for box in boxes]
 out=Image.new('RGB',(max(x.width for x in panels),sum(x.height for x in panels)+16*(len(panels)-1)),'white');y=0
 for panel in panels:out.paste(panel,(0,y));y+=panel.height+16
 dest=S/row['report_file'];out.save(dest,quality=96)
 row['sha256']=hashlib.sha256(p.read_bytes()).hexdigest();manifest.append(row)
(S/'jmeter-summary-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for b in ['mysql','mongo']:
 parts=[];items=[]
 for item in json.loads((S/f'{b}-api-network-crops.json').read_text()):
  p=S/item['file'];im=Image.open(p);parts.append(im.crop(item['crop_box']));items.append(item)
 out=Image.new('RGB',(1700,sum(p.height for p in parts)+24*(len(parts)-1)),'white');y=0
 for panel in parts:out.paste(panel,(0,y));y+=panel.height+24
 out.save(S/f'{b}-api-network-report.jpg',quality=96)
 (S/f'{b}-api-network-crops.json').write_text(json.dumps(items,indent=2)+'\n')
print('Prepared 12 JMeter summary crops and 2 Network figures')
