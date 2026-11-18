"""裁切真实JMeter图表区域，保存原图、坐标和SHA-256。"""
from pathlib import Path
import argparse,hashlib,json
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();S=a.bundle/'screenshots';manifest=[]
selected=json.loads((a.bundle/'results/selected-runs.json').read_text())
for names in selected.values():
 for name in names:
  panels=[]
  for kind in ['OverTime','ResponseTimes']:
   src=S/f'{name}-{kind}.jpg';im=Image.open(src).convert('RGB');box=(266,346,1489,872);panels.append(im.crop(box));manifest.append({'source':src.name,'crop':box,'output':name+'-native-pair.png','sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
  pair=Image.new('RGB',(1223,1060),'white');pair.paste(panels[0],(0,0));pair.paste(panels[1],(0,534));pair.save(S/f'{name}-native-pair.png')
  for kind,box,suffix in [('dashboard',(266,346,1489,917),'dashboard-report'),('Throughput',(266,346,1489,872),'hps-report')]:
   src=S/f'{name}-{kind}.jpg';im=Image.open(src).convert('RGB');im.crop(box).save(S/f'{name}-{suffix}.png');manifest.append({'source':src.name,'crop':box,'output':f'{name}-{suffix}.png','sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
(S/'native-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Prepared',len(manifest),'panels')
