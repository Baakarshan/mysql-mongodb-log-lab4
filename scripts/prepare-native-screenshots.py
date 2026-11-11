"""Crop native Edge screenshots without recreating their displayed contents."""
from pathlib import Path
from PIL import Image
import json,hashlib,datetime
R=Path(__file__).resolve().parents[1];S=R/'screenshots';manifest=[]
for p in sorted(S.glob('jmeter-*-summary-native.png')):
 name=p.name.removeprefix('jmeter-').removesuffix('-summary-native.png')
 im=Image.open(p)
 # Native dashboard at Edge 100%, 4096 x 2070 pixels.
 boxes=[(540,850,4028,1415),(540,1500,4028,1960)]
 panels=[im.crop(box) for box in boxes]
 out=Image.new('RGB',(3488,sum(x.height for x in panels)+16),'white');y=0
 for panel in panels:out.paste(panel,(0,y));y+=panel.height+16
 dest=S/f'jmeter-{name}-summary-report.jpg';out.save(dest,quality=96)
 manifest.append({'run':name,'source':f'work/html/{name}/index.html','file':p.name,'report_file':dest.name,'crop_boxes':boxes,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'apdex_t_ms':500,'apdex_f_ms':1500})
(S/'jmeter-summary-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for b in ['mysql','mongo']:
 parts=[];items=[]
 for kind,box in [('post-headers',(400,395,2100,750)),('post-payload',(400,395,2100,830)),('post-response',(400,395,2100,750)),('get-preview',(400,395,2100,750))]:
  p=S/f'{b}-api-{kind}-native.png';im=Image.open(p);parts.append(im.crop(box));items.append({'file':p.name,'crop_box':box})
 out=Image.new('RGB',(1700,sum(p.height for p in parts)+24*(len(parts)-1)),'white');y=0
 for panel in parts:out.paste(panel,(0,y));y+=panel.height+24
 out.save(S/f'{b}-api-network-report.jpg',quality=96)
 (S/f'{b}-api-network-crops.json').write_text(json.dumps(items,indent=2)+'\n')
print('Prepared 12 JMeter summary crops and 2 Network figures')
