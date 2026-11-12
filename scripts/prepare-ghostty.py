"""Rebuild report panels from preserved Ghostty screenshots and recorded crop coordinates."""
from pathlib import Path
from PIL import Image
import json, hashlib
R=Path(__file__).resolve().parents[1];S=R/'screenshots';P=S/'ghostty-manifest.json'
manifest=json.loads(P.read_text())
for item in manifest['originals']:
 p=S/item['file'];item['sha256']=hashlib.sha256(p.read_bytes()).hexdigest();item['size']=list(Image.open(p).size)
for item in manifest['report_panels']:
 images=[Image.open(S/part['source']).convert('RGB').crop(part['rect']) for part in item['parts']]
 gap=item.get('gap',24);vertical=item['layout']=='vertical'
 width=max(im.width for im in images) if vertical else sum(im.width for im in images)+gap*(len(images)-1)
 height=sum(im.height for im in images)+gap*(len(images)-1) if vertical else max(im.height for im in images)
 out=Image.new('RGB',(width,height),'white');offset=0
 for im in images:
  out.paste(im,(0,offset) if vertical else (offset,0));offset+=(im.height if vertical else im.width)+gap
 p=S/item['file'];out.save(p);item['sha256']=hashlib.sha256(p.read_bytes()).hexdigest()
P.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Prepared',len(manifest['report_panels']),'Ghostty report panels')
