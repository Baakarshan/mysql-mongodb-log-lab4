"""Crop native JMeter panels; retain full screenshots and crop coordinates."""
import argparse,json
from pathlib import Path
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();s=a.bundle/'screenshots';manifest=[]
for f in sorted(s.glob('*-OverTime.png')):
 name=f.name.removesuffix('-OverTime.png');other=s/(name+'-ResponseTimes.png')
 if not other.exists():continue
 panels=[]
 for src in [f,other]:
  im=Image.open(src).convert('RGB');box=(266,346,1489,872);panels.append(im.crop(box));manifest.append(dict(source=src.name,crop=box,output=name+'-native-pair.png'))
 out=Image.new('RGB',(1223,1060),'white');out.paste(panels[0],(0,0));out.paste(panels[1],(0,534));out.save(s/(name+'-native-pair.png'))
for f in sorted(s.glob('*-dashboard.png')):
 im=Image.open(f).convert('RGB');box=(266,346,1489,917);out=f.with_name(f.stem+'-report.png');im.crop(box).save(out);manifest.append(dict(source=f.name,crop=box,output=out.name))
(s/'native-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Prepared',len(manifest),'native panels')
# Keep full DevTools captures and use their visible request area in the report.
for filename in ['mysql-api.png','mongo-api.png','mysql-api-post.png','mongo-api-post.png']:
 target=s/filename
 if not target.exists():continue
 full=target.with_name(target.stem+'-full.png')
 if not full.exists():target.rename(full)
 im=Image.open(full).convert('RGB');box=(0,150,im.width,min(1100,im.height));im.crop(box).save(target)
 manifest.append(dict(source=full.name,crop=box,output=target.name))
(s/'native-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
