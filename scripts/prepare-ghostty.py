"""Prepare report panels from author-supplied Ghostty pixels; retain originals."""
from pathlib import Path
from PIL import Image
import json, hashlib, shutil
R=Path(__file__).resolve().parents[1];S=R/'screenshots'
inputs=[('mysql-records','30e3d3c6-25fe-47b3-bd86-ea5194f264da'),('mongo-records','12b80dcb-7b87-4e2f-be46-16331dd38fbd'),('mongo-index-upper','f7a4dc5e-870b-43ee-99ce-c0e5567f4bdf'),('mongo-index-lower','f57b1b82-5198-4158-b2fc-d83734924d19'),('mysql-index','5ff1b269-4474-402a-b51d-f6d1690228e0')]
manifest=[]
for name,uid in inputs:
 p=S/f'{name}-ghostty-native.png'
 if not p.exists():shutil.copyfile(Path('/var/folders/q5/wvn37l211s1dyfxn7mtkyq140000gn/T')/f'codex-clipboard-{uid}.png',p)
 manifest.append({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'size':list(Image.open(p).size)})
def panel(name,parts,layout='vertical'):
 images=[];spec=[]
 for src,rect in parts:
  crop=Image.open(S/f'{src}-ghostty-native.png').convert('RGB').crop(rect);images.append(crop);spec.append({'source':f'{src}-ghostty-native.png','rect':rect})
 gap=24
 if layout=='vertical':
  w=max(i.width for i in images);h=sum(i.height for i in images)+gap*(len(images)-1);out=Image.new('RGB',(w,h),'white');y=0
  for im in images:out.paste(im,(0,y));y+=im.height+gap
 else:
  w=sum(i.width for i in images)+gap*(len(images)-1);h=max(i.height for i in images);out=Image.new('RGB',(w,h),'white');x=0
  for im in images:out.paste(im,(x,0));x+=im.width+gap
 p=S/f'{name}-ghostty-report.png';out.save(p)
 return {'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'layout':layout,'gap':gap,'parts':spec}
reports=[]
reports.append(panel('mysql-records',[('mysql-records',(0,100,1600,435)),('mysql-records',(0,435,1265,607)),('mysql-records',(1265,435,3138,607))]))
reports.append(panel('mongo-records',[('mongo-records',(0,95,2352,1240))]))
reports.append(panel('mysql-index',[('mysql-index',(0,90,1600,200)),('mysql-index',(0,205,1420,500)),('mysql-index',(0,510,2540,680))]))
# The upper panel ends at indexName; the lower screenshot repeats indexName and continues.
reports.append(panel('mongo-index',[('mongo-index-upper',(0,195,720,1300)),('mongo-index-lower',(0,0,1378,1150))],'horizontal'))
(S/'ghostty-manifest.json').write_text(json.dumps({'source':'Author-provided Ghostty screenshots, 2026-11-11 UTC','originals':manifest,'report_panels':reports,'record_counts':{'mysql':765119,'mongo':766809},'demo_records_per_backend':1},ensure_ascii=False,indent=2)+'\n')
