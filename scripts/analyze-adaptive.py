"""Summarize the progressive runs and retain observed HPS fluctuations."""
from pathlib import Path
import argparse,collections,csv,gzip,json,statistics
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();R=a.bundle
F=R/'report/figures';F.mkdir(parents=True,exist_ok=True)
for obsolete in F.glob('*.png'):obsolete.unlink()
runs=[json.loads(x.read_text()) for x in (R/'results/runs').glob('*/summary.json')]
runs.sort(key=lambda s:s['start_ms']);groups=collections.defaultdict(list)
for s in runs:
 s.setdefault('generator_role','compiler')
 s.setdefault('generator_heap_mib',256)
 s['phase']='exploration' if s['purpose']=='exploration' else 'confirmation' if s['purpose'] in ['peak_confirmation','baseline_confirmation'] else 'diagnosis'
 groups[s['backend'],s['operation'],s['threads'],s['generator_role'],s['generator_heap_mib'],s['phase']].append(s)
aggregate=[]
for (b,o,t,g,h,phase),rs in sorted(groups.items()):
 row=dict(backend=b,operation=o,threads=t,generator_role=g,generator_heap_mib=h,phase=phase,repeats=len(rs),limited_runs=sum(bool(s['generator_limit']) for s in rs))
 for k in ['throughput_rps','successful_rps','p50_ms','p95_ms','p99_ms','error_rate','hps_cv_5s']:
  vals=[s[k] for s in rs if s[k] is not None]
  row[k]=statistics.median(vals) if vals else None
 aggregate.append(row)
for name,rows in [('all-runs',runs),('aggregate',aggregate)]:
 (R/'results'/f'{name}.json').write_text(json.dumps(rows,indent=2))
 fields=['name','backend','operation','threads','generator_role','generator_heap_mib','repeat','purpose','phase','classification','samples','throughput_rps','successful_rps','p50_ms','p95_ms','p99_ms','error_rate','hps_cv_5s','record_count_verified'] if name=='all-runs' else list(rows[0])
 with (R/'results'/f'{name}.csv').open('w',newline='') as f:
  w=csv.DictWriter(f,fields,extrasaction='ignore',lineterminator='\n');w.writeheader();w.writerows(rows)
selected={}
colors={'mysql':'#2469a0','mongo':'#d16b20'}
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':9,'axes.spines.top':False,'axes.spines.right':False})
for op in ['read','write']:
 fig,axs=plt.subplots(1,3,figsize=(10,3),layout='constrained')
 for backend in ['mysql','mongo']:
  rows=sorted([s for s in aggregate if s['backend']==backend and s['operation']==op and s['phase']=='exploration'],key=lambda s:s['threads'])
  if not rows:continue
  for ax,key,ylabel in zip(axs,['successful_rps','p95_ms','error_rate'],['Successful requests/s','P95 (ms)','Error fraction']):
   for generator,heap,style in [('compiler',256,'-o'),('monitor',256,'--s'),('monitor',512,'-.^')]:
    subset=[s for s in rows if s['generator_role']==generator and s['generator_heap_mib']==heap]
    if subset:ax.plot([s['threads'] for s in subset],[s[key] for s in subset],style,label=f'{backend} / {generator} / {heap}m',color=colors[backend],markersize=3)
   ax.set(xlabel='Threads',ylabel=ylabel);ax.grid(alpha=.2);ax.set_xscale('log',base=2)
  candidates=[s for s in runs if s['backend']==backend and s['operation']==op]
  first=min(candidates,key=lambda s:s['threads']);last=max((s for s in candidates if s['samples']),key=lambda s:(s['threads'],s['start_ms']));peak=max((s for s in candidates if not s['generator_limit'] and s['phase']=='exploration'),key=lambda s:s['successful_rps'])
  selected[f'{backend}-{op}']=list(dict.fromkeys(s['name'] for s in [first,peak,last]))
 axs[0].legend();axs[1].set_yscale('log');fig.savefig(F/f'{op}-progressive.png',dpi=200);plt.close(fig)
for names in selected.values():
 for name in names:
  s=next(s for s in runs if s['name']==name);d=R/'results/runs'/name
  with gzip.open(d/'measurement.jtl.gz','rt') as f:rows=list(csv.DictReader(f))
  latency=np.array([int(r['elapsed']) for r in rows]);tm=np.array([(int(r['timeStamp'])-s['measurement_start_ms'])/1000 for r in rows])
  fig,axs=plt.subplots(1,3,figsize=(10,2.8),layout='constrained')
  axs[0].plot(np.arange(25)+.5,s['hits_per_second'],label='Observed hits/s');axs[0].axhline(s['target_rps'],color='#999999',ls='--',label='Requested rate');axs[0].set(xlabel='Measurement time (s)',ylabel='Hits/s');axs[0].legend(fontsize=7)
  values=[np.percentile(latency[(tm>=i)&(tm<i+1)],95) if np.any((tm>=i)&(tm<i+1)) else np.nan for i in range(25)]
  axs[1].plot(np.arange(25)+.5,values);axs[1].set(xlabel='Measurement time (s)',ylabel='P95 per second (ms)')
  q=[1,10,25,50,75,90,95,99,100]
  if len(latency):axs[2].plot(q,np.percentile(latency,q))
  axs[2].set(xlabel='Percentile (%)',ylabel='Response time (ms)')
  for ax in axs:ax.grid(alpha=.2)
  fig.suptitle(name);fig.savefig(F/f'{name}-observed.png',dpi=200);plt.close(fig)
  monitoring=json.loads((d/'monitoring.json').read_text())
  fig,axs=plt.subplots(1,2,figsize=(9,2.8),layout='constrained')
  for key,ax,label in [('host_cpu_percent',axs[0],'CPU (%)'),('host_memory_available_mib',axs[1],'Available memory (MiB)')]:
   for series in monitoring[key]['data']['result']:
    role=series['metric'].get('role')
    if role=='monitor' and s['generator_role']!='monitor':continue
    vals=[(float(t)-s['measurement_start_ms']/1000,float(v)) for t,v in series['values'] if s['measurement_start_ms']/1000<=float(t)<s['measurement_end_ms']/1000]
    if vals:
     expected=np.arange(0,25,5);known={round(t,3):v for t,v in vals}
     ax.plot(expected,[known.get(round(float(t),3),np.nan) for t in expected],label=role)
   ax.set(xlabel='Measurement time (s)',ylabel=label);ax.grid(alpha=.2);ax.legend(fontsize=7)
  fig.suptitle(name);fig.savefig(F/f'{name}-resources.png',dpi=200);plt.close(fig)
(R/'results/selected-runs.json').write_text(json.dumps(selected,indent=2))
print('Summarized',len(runs),'runs; selected',selected)
