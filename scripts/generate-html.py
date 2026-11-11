"""Generate JMeter dashboards locally from the selected original measurements."""
import argparse,pathlib,os,csv,gzip,datetime,json,subprocess,shutil
from zoneinfo import ZoneInfo
R=pathlib.Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--jmeter',default=str(pathlib.Path(os.getenv('JMETER_HOME','/tmp/lab4-tools/apache-jmeter-5.6.3'))/'bin/jmeter'));a=p.parse_args()
selected=json.loads((R/'results/selected-levels.json').read_text());work=R/'work';(work/'jtl').mkdir(parents=True,exist_ok=True);(work/'html').mkdir(exist_ok=True)
for op,levels in selected.items():
 for t in levels:
  for b in ['mysql','mongo']:
   name=f'{b}-{op}-t{t}-r1';src=R/'results/runs'/name/'measurement.jtl.gz'
   if not src.exists():continue
   dst=work/'jtl'/(name+'.jtl')
   # Only the display copy uses readable dates; epoch-ms originals remain intact.
   with gzip.open(src,'rt') as f,dst.open('w',newline='') as out:
    rd=csv.DictReader(f);wr=csv.DictWriter(out,rd.fieldnames);wr.writeheader()
    for row in rd:
     row['timeStamp']=datetime.datetime.fromtimestamp(int(row['timeStamp'])/1000,ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3];wr.writerow(row)
   target=work/'html'/name
   if target.exists():shutil.rmtree(target)
   env=dict(os.environ,HEAP='-Xms128m -Xmx768m',JVM_ARGS='-Duser.timezone=Asia/Shanghai')
   with (work/(name+'-generator.log')).open('w') as f:
    subprocess.run([a.jmeter,'-g',str(dst),'-q',str(R/'scripts/jmeter.properties'),'-Jjmeter.save.saveservice.timestamp_format=yyyy-MM-dd HH:mm:ss.SSS','-Jjmeter.reportgenerator.overall_granularity=5000','-Jjmeter.reportgenerator.statistic_window=2000000','-o',str(target),'-j',str(work/(name+'-jmeter.log'))],env=env,stdout=f,stderr=subprocess.STDOUT,check=True)
   print('Generated',name,flush=True)
