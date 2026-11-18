"""Generate native JMeter dashboards from recorded HTTP measurements."""
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
  if (dest/'index.html').exists() and meta.exists() and json.loads(meta.read_text()).get('display_version')==4 and json.loads(meta.read_text())['measurement_gzip_sha256']==digest:continue
  if dest.exists():shutil.rmtree(dest)
  with gzip.open(src,'rt') as f,display.open('w',newline='') as out:
   rd=csv.DictReader(f);fields=[k for k in rd.fieldnames if k not in ['scheduledTime','dispatchLagMicros']];wr=csv.DictWriter(out,fields,extrasaction='ignore');wr.writeheader()
   for row in rd:
    # JMeter按线程名最后一个空格之前的部分识别分组，保留请求序号。
    if 'scheduledTime' in row:row['threadName']='Open arrivals '+row['threadName']
    # 传输错误包含临时源端口；展示时按原因归类，原始逐条消息保留在gzip中。
    if row['success']!='true' and not row['responseCode'].isdigit():
     message=(row['responseMessage']+' '+row['responseCode']).lower()
     category='connection timeout' if ('dial tcp' in message and 'timeout' in message) or 'connecttimeoutexception' in message else 'request timeout' if 'client.timeout' in message or 'context deadline exceeded' in message or 'sockettimeoutexception' in message else 'connection reset' if 'connection reset by peer' in message else 'connection refused' if 'connection refused' in message else 'local port exhaustion' if 'cannot assign requested address' in message else 'file descriptor exhaustion' if 'too many open files' in message else 'transport error'
     row['responseMessage']=category;row['failureMessage']=category
    row['timeStamp']=datetime.datetime.fromtimestamp(int(row['timeStamp'])/1000,ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3];wr.writerow(row)
  cmd=[str(a.jmeter.resolve()),'-g',str(display.resolve()),'-q',str(R/'scripts/jmeter.properties'),'-Jjmeter.save.saveservice.timestamp_format=yyyy-MM-dd HH:mm:ss.SSS','-Jjmeter.reportgenerator.overall_granularity=1000','-Jjmeter.reportgenerator.statistic_window=2000000','-o',str(dest.resolve()),'-j',str((work/(name+'-jmeter.log')).resolve())]
  with (work/(name+'-generator.log')).open('w') as f:subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT,env=dict(os.environ,HEAP='-Xms128m -Xmx768m',JVM_ARGS='-Duser.timezone=Asia/Shanghai'),check=True)
  meta.write_text(json.dumps({'run':name,'display_version':4,'measurement_gzip_sha256':digest,'display_timezone':'Asia/Shanghai','thread_name_prefix':('Open arrivals ' if json.loads((a.bundle/'results/runs'/name/'summary.json').read_text()).get('load_model')=='open-fixed-interval' else None),'transport_errors_grouped_by_cause':True,'excluded_from_display':['scheduledTime','dispatchLagMicros'],'load_model':json.loads((a.bundle/'results/runs'/name/'summary.json').read_text()).get('load_model','closed-paced')},indent=2)+'\n')
  print('Generated',name,flush=True)
