"""交付前核对单次线程数据、原生报告、源码和恢复状态。"""
from pathlib import Path
import argparse,hashlib,json,subprocess,sys,xml.etree.ElementTree as ET
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path,nargs='?',default=Path('.'));a=p.parse_args();R=a.bundle
subprocess.run([sys.executable,str(Path(__file__).with_name('analyze-threads.py')),str(R),'--check-only'],check=True)
for path in (R/'results/runs').glob('*/summary.json'):
 s=json.loads(path.read_text());d=path.parent;config=json.loads((d/'config.json').read_text())
 assert hashlib.sha256((d/'run.jmx').read_bytes()).hexdigest()==config['jmx_sha256']
 tree=ET.parse(d/'run.jmx');http=list(tree.iter('HTTPSamplerProxy'))
 assert len(http)==5 and all(x.get('testname')==s['operation'] for x in http)
 assert not list(tree.iter('IfController')) and not list(tree.iter('JSR223Assertion'))
 schedules=[x.text for x in tree.iter('stringProp') if x.get('name')=='OpenModelThreadGroup.schedule']
 assert len(schedules)==5 and all('even_arrivals' in x for x in schedules)
 assert config['measurement_offset_s']==[30,50] and s['load_model']=='jmeter-openmodel-even-arrivals'
selected=json.loads((R/'results/selected-runs.json').read_text())
for names in selected.values():
 for name in names:
  d=R/'results/html'/name;m=json.loads((d/'dashboard-source.json').read_text());raw=R/'results/runs'/name/'measurement.jtl.gz';s=json.loads((raw.parent/'summary.json').read_text());stats=json.loads((d/'statistics.json').read_text())['Total']
  assert hashlib.sha256(raw.read_bytes()).hexdigest()==m['measurement_gzip_sha256']
  assert stats['sampleCount']==s['samples'] and stats['errorCount']==s['errors']
  assert abs(stats['meanResTime']-s['mean_ms'])<.02
  for suffix in ['dashboard','OverTime','ResponseTimes','Throughput']:assert (R/'screenshots'/f'{name}-{suffix}.png').stat().st_size>10000
for b in ['mysql','mongo']:
 smoke=json.loads((R/'evidence'/f'{b}-smoke.json').read_text());assert smoke['passed'] and len(smoke['checks'])==14
for ext in ['docx','pdf']:assert (R/'report'/f'实验四实验报告.{ext}').stat().st_size>100000
restored=json.loads((R/'evidence/rbac-restoration.json').read_text());assert restored['restored']
for n,v in restored['original'].items():assert restored['observed'][n]==f'{v}/{v}'
source=json.loads((R/'evidence/source-revision.json').read_text());repo=Path(__file__).resolve().parents[1]
for name,digest in source['source_sha256'].items():assert hashlib.sha256((repo/name).read_bytes()).hexdigest()==digest
measurement=json.loads((R/'evidence/measurement-source.json').read_text())
for name,digest in measurement.items():assert hashlib.sha256((repo/name).read_bytes()).hexdigest()==digest
for b in ['mysql','mongo']:
 deploy=json.loads((R/'evidence'/f'{b}-deployment.json').read_text());assert deploy['jar'].split()[0]==source['deployed_jar_sha256']
print('已核对每线程一次、平均值、HPS、原生HTML、截图、报告、源码与服务恢复。')
