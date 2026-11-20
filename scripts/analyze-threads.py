"""核验单次线程请求、逐秒均匀性与平均响应时间，并生成图表。"""
from pathlib import Path
import argparse,csv,gzip,hashlib,json,statistics,collections
from hps_quality import assess
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
P=argparse.ArgumentParser();P.add_argument('bundle',type=Path);P.add_argument('--check-only',action='store_true');A=P.parse_args();R=A.bundle;F=R/'report/figures';F.mkdir(parents=True,exist_ok=True)
runs=sorted([json.loads(p.read_text()) for p in (R/'results/runs').glob('*/summary.json')],key=lambda s:s['start_ms'])
for s in runs:
 s.setdefault('tomcat_max_threads',200)
 d=R/'results/runs'/s['name']
 with gzip.open(d/'all.jtl.gz','rt') as f:rows=[r for r in csv.DictReader(f) if r['label'] in ['read','write']]
 assert len({r['threadName'] for r in rows})==len(rows),s['name']
 formal=[r for r in rows if s['measurement_start_ms']<=int(r['timeStamp'])<s['measurement_end_ms']]
 with gzip.open(d/'measurement.jtl.gz','rt') as f:assert list(csv.DictReader(f))==formal
 assert len(formal)==s['samples'];assert sum(r['success']!='true' for r in formal)==s['errors']
 assert statistics.mean(int(r['elapsed']) for r in formal)==s['mean_ms']
 hps=[sum(s['measurement_start_ms']+i*1000<=int(r['timeStamp'])<s['measurement_start_ms']+(i+1)*1000 for r in formal) for i in range(20)]
 assert hps==s['hits_per_second'];assert s['records_before']==100000
 assert s['write_count_difference']==s['records_after']-100000-(s['all_success'] if s['operation']=='write' else 0)
 meta=json.loads((d/'original.json').read_text());data=(d/'all.jtl.gz').read_bytes();assert hashlib.sha256(data).hexdigest()==meta['compressed_sha256'];assert hashlib.sha256(gzip.decompress(data)).hexdigest()==meta['original_jtl_sha256']
 quality=assess(hps,s['target_rps']);assert quality==s['hps_quality']
 if not s['generator_limit']:assert s['all_http_samples']==s['threads'] and quality['passed']
if A.check_only:
 print(f'已核验{len(runs)}次运行的原始数据。');raise SystemExit(0)
for name,rows in [('all-runs',runs)]:
 (R/'results'/f'{name}.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 fields=['name','backend','operation','threads','ramp_s','loops','target_rps','pool_size','repeat','purpose','classification','samples','mean_ms','successful_mean_ms','throughput_rps','successful_rps','error_rate','hps_min','hps_max','hps_max_min_ratio','hps_cv','max_inflight','healthy_after','tomcat_max_threads','generator_limit','write_count_difference']
 with (R/'results'/f'{name}.csv').open('w',newline='') as f:w=csv.DictWriter(f,fields,extrasaction='ignore',lineterminator='\n');w.writeheader();w.writerows(rows)
groups=collections.defaultdict(list)
for s in runs:groups[s['backend'],s['operation'],s['threads'],s['pool_size'],s['tomcat_max_threads']].append(s)
aggregate=[]
for (b,o,n,p,t),rs in sorted(groups.items()):
 aggregate.append({'backend':b,'operation':o,'threads':n,'pool_size':p,'tomcat_max_threads':t,'runs':len(rs),'qualified_runs':sum(not s['generator_limit'] for s in rs),'qualified_mean_ms_median':statistics.median(s['mean_ms'] for s in rs if not s['generator_limit']) if any(not s['generator_limit'] for s in rs) else None,'run_names':';'.join(s['name'] for s in rs),'mean_ms_median':statistics.median(s['mean_ms'] for s in rs),'error_rate_median':statistics.median(s['error_rate'] for s in rs),'hps_ratio_max':max((s['hps_max_min_ratio'] or float('inf')) for s in rs)})
(R/'results/aggregate.json').write_text(json.dumps(aggregate,ensure_ascii=False,indent=2)+'\n')
with (R/'results/aggregate.csv').open('w',newline='') as f:w=csv.DictWriter(f,list(aggregate[0]),lineterminator='\n');w.writeheader();w.writerows(aggregate)
plt.rcParams.update({'font.family':['Arial','Helvetica','DejaVu Sans'],'font.size':10,'axes.spines.top':False,'axes.spines.right':False,'axes.linewidth':1.1,'legend.frameon':False,'svg.fonttype':'none'})
colors={'mysql':'#0F4D92','mongo':'#B64342'}
def export(fig,name):
 fig.tight_layout(pad=1.2)
 for ext in ['png','pdf','svg']:fig.savefig(F/f'{name}.{ext}',dpi=300,facecolor='white')
 plt.close(fig)
selected={}
for op in ['read','write']:
 fig=plt.figure(figsize=(6.1,5.4));grid=fig.add_gridspec(2,2);axes=[fig.add_subplot(grid[0,:]),fig.add_subplot(grid[1,0]),fig.add_subplot(grid[1,1])]
 for b in ['mysql','mongo']:
  ss=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration']
  if not ss:continue
  for ax,key,ylabel in zip(axes,['mean_ms','successful_rps','error_rate'],['Mean response time (ms)','Successful requests/s','Error fraction']):
   ax.plot([s['threads'] for s in ss if not s['generator_limit']],[s[key] for s in ss if not s['generator_limit']],'-o' if b=='mysql' else '--s',color=colors[b],label=b,markersize=4);ax.scatter([s['threads'] for s in ss if s['generator_limit']],[s[key] for s in ss if s['generator_limit']],marker='x',color=colors[b],s=35);ax.set(xlabel='Total threads (one request each)',ylabel=ylabel);ax.grid(axis='y',alpha=.15)
  valid=[s for s in ss if not s['generator_limit']]
  lastload=[s for s in valid if s['classification']=='load']
  choice=[valid[0],lastload[-1] if lastload else valid[0],valid[-1]] if valid else [ss[0]]
  corrected=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='tomcat40_diagnosis' and not s['generator_limit']]
  if corrected:choice.append(corrected[-1])
  selected[f'{b}-{op}']=list(dict.fromkeys(s['name'] for s in choice))
 axes[0].legend();export(fig,op+'-thread-progression')
 for b in ['mysql','mongo']:
  ss=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration']
  fig,axes=plt.subplots(1,2,figsize=(6.1,3.1))
  for role,color in [('application','#0F4D92'),('database','#B64342'),('monitor','#42949E')]:axes[0].plot([s['threads'] for s in ss],[s['cpu_percent'].get(role,float('nan')) for s in ss],'-o',label=role,color=color,markersize=4)
  axes[0].set(xlabel='Total threads',ylabel='Mean host CPU (%)',ylim=(0,105));axes[0].legend(fontsize=8)
  for s in ss:
   if s['generator_limit']:continue
   axes[1].plot(range(20),s['hits_per_second'],label=str(s['threads']),linewidth=1)
  axes[1].set(xlabel='Measurement time (s)',ylabel='Actual requests started/s');axes[1].legend(title='Threads',fontsize=7,ncol=2)
  for ax in axes:ax.grid(axis='y',alpha=.15)
  export(fig,b+'-'+op+'-cpu-hps')
for op in ['read','write']:
 fig,axes=plt.subplots(2,1,figsize=(6.1,4.8),sharex=True)
 for b in ['mysql','mongo']:
  ss=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='tomcat40_diagnosis' and not s['generator_limit']]
  for ax,key,ylabel in zip(axes,['mean_ms','error_rate'],['Mean response time (ms)','Error fraction']):
   ax.plot([s['target_rps'] for s in ss],[s[key] for s in ss],'-o' if b=='mysql' else '--s',color=colors[b],label=b,markersize=4)
   ax.set_ylabel(ylabel);ax.grid(axis='y',alpha=.15)
 axes[0].legend();axes[1].set_xlabel('Planned requests/s (Tomcat max threads = 40)')
 export(fig,op+'-tomcat40-progression')
for stale in list(F.glob('*-all-hps-*'))+list(F.glob('*-failed-hps-*')):
 stale.unlink()
for b in ['mysql','mongo']:
 ss=[s for s in runs if s['backend']==b and s['operation']=='read']
 if not ss:continue
 fig,axes=plt.subplots(2,1,figsize=(6.1,4.6),sharex=True)
 for ax,key,ylabel in zip(axes,['mean_ms','successful_rps'],['Mean response time (ms)','Successful requests/s']):
  ax.plot(range(1,len(ss)+1),[s[key] for s in ss],'-o',color=colors[b],markersize=4)
  invalid=[(i+1,s) for i,s in enumerate(ss) if s['generator_limit']]
  ax.scatter([i for i,s in invalid],[s[key] for i,s in invalid],marker='x',color='#C00000',s=65,label='Unstable arrivals',zorder=3)
  ax.set_ylabel(ylabel);ax.grid(axis='y',alpha=.15)
 axes[1].set_xticks(range(1,len(ss)+1),[str(i+1)+'\n'+str(s['target_rps']) for i,s in enumerate(ss)],fontsize=8)
 axes[1].set_xlabel('Run order / planned requests per second');axes[0].legend(fontsize=8)
 export(fig,b+'-read-diagnosis-timeline')

for b in ['mysql','mongo']:
 for op in ['read','write']:
  for failed,kind in [(False,'all'),(True,'failed')]:
   series=[s for s in runs if s['backend']==b and s['operation']==op and s['generator_limit']==failed]
   for offset in range(0,len(series),6):
    ss=series[offset:offset+6];rows_n=(len(ss)+1)//2
    fig,axs=plt.subplots(rows_n,2,figsize=(6.1,1.8*rows_n),squeeze=False)
    for ax,s in zip(axs.flat,ss):
     rate=s['target_rps'];h=s['hits_per_second']
     ax.axhspan(rate*.9,rate*1.1,color='#E8EEF4',zorder=0)
     ax.axhline(rate,color='#777777',linestyle='--',linewidth=.8)
     ax.plot(range(20),h,color=colors[b],marker='o',markersize=2,linewidth=1)
     ax.set_title(s['name']+(' INVALID' if s['generator_limit'] else ' PASS'),fontsize=8)
     ax.set(xlabel='Measurement time (s)',ylabel='Hits per second',xlim=(0,19),ylim=(0,max(max(h),rate*1.1)*1.15))
     ax.grid(axis='y',alpha=.15)
    for ax in list(axs.flat)[len(ss):]:ax.set_visible(False)
    export(fig,b+'-'+op+'-'+kind+'-hps-'+str(offset//6+1))

(R/'results/selected-runs.json').write_text(json.dumps(selected,indent=2)+'\n')
audit={'verified':True,'load_model':'jmeter-openmodel-even-arrivals','runs':len(runs),'measurement_samples':sum(s['samples'] for s in runs),'measurement_errors':sum(s['errors'] for s in runs),'each_http_thread_once':True,'invalid_hps_runs':[s['name'] for s in runs if not s['hps_quality']['passed']],'generator_limited_runs':[s['name'] for s in runs if s['generator_limit']]}
(R/'results/audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n');print(json.dumps(audit,ensure_ascii=False,indent=2))
