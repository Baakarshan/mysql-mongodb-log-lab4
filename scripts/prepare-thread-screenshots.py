"""从原生页面原图提取正文区域，保留全部页面截图和裁切坐标。"""
from pathlib import Path
import argparse,json
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();d=a.bundle/'screenshots';manifest=[]
for over in sorted(d.glob('*-OverTime.png')):
 name=over.name.removesuffix('-OverTime.png');percent=d/(name+'-ResponseTimes.png');dash=d/(name+'-dashboard.png')
 if not percent.exists():continue
 crop=(266,346,1489,872)
 panels=[Image.open(f).convert('RGB').crop(crop) for f in [over,percent]]
 out=Image.new('RGB',(1223,526*2+16),'white');out.paste(panels[0],(0,0));out.paste(panels[1],(0,542));out.save(d/(name+'-native-pair.png'))
 manifest.append({'output':name+'-native-pair.png','sources':[over.name,percent.name],'crop_xyxy':list(crop),'gap_pixels':16})
 hps=d/(name+'-Throughput.png')
 if hps.exists():
  Image.open(hps).convert('RGB').crop(crop).save(d/(name+'-hps-report.png'));manifest.append({'output':name+'-hps-report.png','sources':[hps.name],'crop_xyxy':list(crop)})
 if dash.exists():
  im=Image.open(dash).convert('RGB');dcrop=(266,346,1489,917);im.crop(dcrop).save(d/(name+'-dashboard-report.png'));manifest.append({'output':name+'-dashboard-report.png','sources':[dash.name],'crop_xyxy':list(dcrop)})
for stem in ['thread-prometheus-cpu','thread-prometheus-memory','thread-prometheus-corrected-cpu','thread-prometheus-hikari','thread-prometheus-mongo-cpu']:
 source=d/(stem+'.png')
 if source.exists():
  im=Image.open(source).convert('RGB');crop=(0,0,im.width,min(im.height,1008));target=stem+'-report.png';im.crop(crop).save(d/target)
  manifest.append({'output':target,'sources':[source.name],'crop_xyxy':list(crop)})
(d/'native-crop-sources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print('Prepared',len(manifest),'report images')
