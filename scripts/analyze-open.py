"""汇总固定到达率测量并绘制原始每秒速率，不平滑波动。"""
from pathlib import Path
import argparse,csv,gzip,json,statistics,collections
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();R=a.bundle;F=R/'report/figures';F.mkdir(parents=True,exist_ok=True)
runs=sorted([json.loads(x.read_text()) for x in (R/'results/runs').glob('*/summary.json')],key=lambda s:s['start_ms']);groups=collections.defaultdict(list)
for s in runs:
 s['phase']='exploration' if s['purpose']=='exploration' else 'confirmation' if s['purpose'] in ['peak_confirmation','baseline_confirmation','failure_confirmation'] else 'diagnosis'
 groups[s['backend'],s['operation'],s['target_rps'],s['phase']].append(s)
aggregate=[]
for (b,o,rate,phase),rs in sorted(groups.items()):
 row=dict(backend=b,operation=o,target_rps=rate,phase=phase,repeats=len(rs),limited_runs=sum(bool(s['generator_limit']) for s in rs))
 for k in ['throughput_rps','successful_rps','p50_ms','p95_ms','p99_ms','error_rate','hps_cv_5s','actual_start_ratio','on_wire_rps']:
  vals=[s[k] for s in rs if s[k] is not None];row[k]=statistics.median(vals) if vals else None
 aggregate.append(row)
for name,rows in [('all-runs',runs),('aggregate',aggregate)]:
 (R/'results'/f'{name}.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 fields=['name','backend','operation','target_rps','repeat','purpose','phase','classification','samples','throughput_rps','on_wire_rps','successful_rps','p50_ms','p95_ms','p99_ms','error_rate','hps_cv_5s','actual_start_ratio','dropped_arrivals','dispatch_lag_p99_us','max_inflight','record_count_verified'] if name=='all-runs' else list(rows[0])
 with (R/'results'/f'{name}.csv').open('w',newline='') as f:
  w=csv.DictWriter(f,fields,extrasaction='ignore',lineterminator='\n');w.writeheader();w.writerows(rows)
plt.rcParams.update({'font.family':['Arial','Helvetica','DejaVu Sans'],'font.size':10,'axes.spines.top':False,'axes.spines.right':False,'axes.linewidth':1.2,'legend.frameon':False,'svg.fonttype':'none'})
colors={'mysql':'#0F4D92','mongo':'#B64342'}
def export(fig,name):
 fig.tight_layout(pad=1.2)
 for ext in ['png','pdf','svg']:fig.savefig(F/f'{name}.{ext}',dpi=300,facecolor='white')
 plt.close(fig)
selected={}
for op in ['read','write']:
 fig,axes=plt.subplots(1,3,figsize=(10,3.2))
 for b in ['mysql','mongo']:
  ss=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration']
  if not ss:continue
  for ax,key,ylabel in zip(axes,['successful_rps','p95_ms','error_rate'],['Successful requests/s','P95 (ms)','Error fraction']):
   ax.plot([s['target_rps'] for s in ss],[s[key] for s in ss],'-o' if b=='mysql' else '--s',color=colors[b],label=b,markersize=4)
   ax.set(xlabel='Scheduled requests/s',ylabel=ylabel);ax.grid(axis='y',alpha=.15)
  valid=[s for s in ss if not s['generator_limit']]
  peak=max(valid or ss,key=lambda s:s['successful_rps'])
  selected[f'{b}-{op}']=list(dict.fromkeys(s['name'] for s in [ss[0],peak,ss[-1]]))
 axes[0].legend();export(fig,op+'-open-progression')
for names in selected.values():
 for name in names:
  s=next(s for s in runs if s['name']==name);d=R/'results/runs'/name
  arrivals=json.loads((d/'arrivals.json').read_text())['per_second'][10:35]
  with gzip.open(d/'measurement.jtl.gz','rt') as f:rows=list(csv.DictReader(f))
  lat=np.array([int(r['elapsed']) for r in rows]);tm=np.array([(int(r['timeStamp'])-s['measurement_start_ms'])/1000 for r in rows])
  fig,axes=plt.subplots(3,1,figsize=(7.5,7))
  axes[0].step(np.arange(25),[s['target_rps']]*25,where='post',ls='--',color='#767676',label='Scheduled')
  axes[0].plot(np.arange(25)+.5,s['hits_per_second'],'-',color='#0F4D92',label='Started')
  axes[0].plot(np.arange(25)+.5,[b['on_wire'] for b in arrivals],':',color='#42949E',label='Written to socket')
  axes[0].plot(np.arange(25)+.5,[b['completed'] for b in arrivals],color='#B64342',alpha=.8,label='Completed')
  axes[0].set(xlabel='Measurement time (s)',ylabel='Requests/s',ylim=(0,None));axes[0].legend(ncol=2,fontsize=8)
  values=[np.percentile(lat[(tm>=i)&(tm<i+1)],95) if np.any((tm>=i)&(tm<i+1)) else np.nan for i in range(25)]
  axes[1].plot(np.arange(25)+.5,values,color='#0F4D92');axes[1].set(xlabel='Request start time (s)',ylabel='P95 (ms)')
  q=[1,10,25,50,75,90,95,99,100]
  if len(lat):axes[2].plot(q,np.percentile(lat,q),'-o',color='#0F4D92',markersize=3)
  axes[2].set(xlabel='Percentile (%)',ylabel='Response time (ms)')
  for ax in axes:ax.grid(axis='y',alpha=.15)
  fig.suptitle(name,fontsize=11);export(fig,name+'-arrivals')
(R/'results/selected-runs.json').write_text(json.dumps(selected,indent=2)+'\n')
print('Summarized',len(runs),'runs',selected)
