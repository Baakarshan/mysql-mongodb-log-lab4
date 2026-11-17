"""Generate native JMeter dashboards from 25-second progressive measurements."""
from pathlib import Path
import argparse,csv,datetime,gzip,hashlib,json,os,shutil,subprocess
from zoneinfo import ZoneInfo
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--jmeter',type=Path,required=True);a=p.parse_args()
R=Path(__file__).resolve().parents[1];selected=json.loads((a.bundle/'results/selected-runs.json').read_text())
work=a.bundle/'work';(work/'jtl').mkdir(parents=True,exist_ok=True);(work/'html').mkdir(exist_ok=True)
for names in selected.values():
 for name in names:
  dest=work/'html'/name
  src=a.bundle/'results/runs'/name/'measurement.jtl.gz';display=work/'jtl'/(name+'.jtl')
  digest=hashlib.sha256(src.read_bytes()).hexdigest()
  meta=dest/'dashboard-source.json'
  if (dest/'index.html').exists() and meta.exists() and json.loads(meta.read_text())['measurement_gzip_sha256']==digest:continue
  if dest.exists():shutil.rmtree(dest)
  with gzip.open(src,'rt') as f,display.open('w',newline='') as out:
   rd=csv.DictReader(f);wr=csv.DictWriter(out,rd.fieldnames);wr.writeheader()
   for row in rd:
    row['timeStamp']=datetime.datetime.fromtimestamp(int(row['timeStamp'])/1000,ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3];wr.writerow(row)
  cmd=[str(a.jmeter.resolve()),'-g',str(display.resolve()),'-q',str(R/'scripts/jmeter.properties'),'-Jjmeter.save.saveservice.timestamp_format=yyyy-MM-dd HH:mm:ss.SSS','-Jjmeter.reportgenerator.overall_granularity=1000','-Jjmeter.reportgenerator.statistic_window=2000000','-o',str(dest.resolve()),'-j',str((work/(name+'-jmeter.log')).resolve())]
  with (work/(name+'-generator.log')).open('w') as f:subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT,env=dict(os.environ,HEAP='-Xms128m -Xmx768m',JVM_ARGS='-Duser.timezone=Asia/Shanghai'),check=True)
  meta.write_text(json.dumps({'run':name,'measurement_gzip_sha256':digest,'display_timezone':'Asia/Shanghai'},indent=2)+'\n')
  print('Generated',name,flush=True)
