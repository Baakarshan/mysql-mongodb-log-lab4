"""Aggregate repetitions and draw figures from actual JTL and Prometheus data."""
from pathlib import Path
import json,csv,gzip,statistics,collections,math
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'report/figures';OUT.mkdir(parents=True,exist_ok=True)
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'axes.spines.top':False,'axes.spines.right':False,'savefig.bbox':'tight','figure.dpi':120})
COL={'mysql':'#2368a2','mongo':'#d27425'}
raw=[json.loads(p.read_text()) for p in (ROOT/'results/runs').glob('*/summary.json')];groups=collections.defaultdict(list)
for s in raw:groups[s['backend'],s['operation'],s['threads']].append(s)
metrics=['throughput_rps','mean_ms','p50_ms','p95_ms','p99_ms','error_rate']
ag=[]
for (b,o,t),rs in sorted(groups.items()):
 d={'backend':b,'operation':o,'threads':t,'repeats':len(rs),'samples':sum(s['samples'] for s in rs),'errors':sum(s['errors'] for s in rs)}
 for m in metrics:d[m]=statistics.median(s[m] for s in rs);d[m+'_min']=min(s[m] for s in rs);d[m+'_max']=max(s[m] for s in rs)
 ag.append(d)
(ROOT/'results/aggregate.json').write_text(json.dumps(ag,indent=2))
if ag:
 with (ROOT/'results/aggregate.csv').open('w',newline='') as f:w=csv.DictWriter(f,ag[0].keys());w.writeheader();w.writerows(ag)
 with (ROOT/'results/all-runs.csv').open('w',newline='') as f:
  fields=['name','backend','operation','threads','repeat','samples','errors']+metrics+['records_before','records_after'];w=csv.DictWriter(f,fields,extrasaction='ignore');w.writeheader();w.writerows(sorted(raw,key=lambda x:x['name']))
# Export aligned resource summaries for every repetition and host.
resource_rows=[]
for s in sorted(raw,key=lambda x:x['name']):
 monitoring=json.loads((ROOT/'results/runs'/s['name']/'monitoring.json').read_text())
 start=s['measurement_start_ms']/1000;end=s['measurement_end_ms']/1000
 hosts={role:{k:s[k] for k in ['name','backend','operation','threads','repeat']}|{'role':role} for role in ['compiler','application','database','monitor']}
 for key in ['host_cpu_percent','host_memory_available_mib','disk_read_bytes_per_second','disk_write_bytes_per_second']:
  for series in monitoring[key]['data']['result']:
   role=series['metric'].get('role');values=[float(y) for x,y in series['values'] if start<=float(x)<end]
   if role in hosts and values:
    hosts[role][key+'_mean']=statistics.mean(values)
    hosts[role][key+'_min']=min(values);hosts[role][key+'_max']=max(values)
 resource_rows.extend(hosts.values())
if resource_rows:
 fields=list(dict.fromkeys(k for row in resource_rows for k in row))
 with (ROOT/'results/resources.csv').open('w',newline='') as f:
  writer=csv.DictWriter(f,fields);writer.writeheader();writer.writerows(resource_rows)
selected={}
for op in ['read','write']:
 fig,axs=plt.subplots(1,2,figsize=(8.3,3.1),constrained_layout=True)
 for b in ['mysql','mongo']:
  ds=sorted([d for d in ag if d['backend']==b and d['operation']==op],key=lambda d:d['threads'])
  if not ds:continue
  x=np.array([d['threads'] for d in ds])
  for ax,m,label in zip(axs,['throughput_rps','p95_ms'],['Throughput (requests/s)','P95 response time (ms)']):
   y=np.array([d[m] for d in ds]);err=np.array([[d[m]-d[m+'_min'] for d in ds],[d[m+'_max']-d[m] for d in ds]])
   ax.errorbar(x,y,yerr=err,color=COL[b],marker='o',capsize=3,label='MySQL / JPA' if b=='mysql' else 'MongoDB / Spring Data');ax.set_xlabel('Concurrent threads');ax.set_ylabel(label);ax.set_xscale('log');ax.set_xticks([1,10,25,50,100,200],['1','10','25','50','100','200']);ax.grid(alpha=.2)
  axs[1].set_yscale('log')
 axs[0].legend(fontsize=8);fig.savefig(OUT/f'{op}-comparison.png',dpi=220);plt.close(fig)
 # Representative low, turning-point, and highest observed levels, first repetition.
 levels=sorted({d['threads'] for d in ag if d['operation']==op});middle=50 if 50 in levels else (levels[len(levels)//2] if levels else 1)
 candidates=[]
 for b in ['mysql','mongo']:
  ds=sorted([d for d in ag if d['backend']==b and d['operation']==op],key=lambda d:d['threads'])
  for prev,cur in zip(ds,ds[1:]):
   if cur['throughput_rps']<=prev['throughput_rps']*1.1 and cur['p95_ms']>=prev['p95_ms']*1.5:candidates.append(cur['threads']);break
 if candidates:middle=min(candidates)
 chosen=sorted(set([min(levels),middle,max(levels)])) if levels else []
 selected[op]=chosen
 for t in chosen:
  fig,axs=plt.subplots(1,2,figsize=(8.3,3.1),constrained_layout=True)
  for b in ['mysql','mongo']:
   path=ROOT/'results/runs'/f'{b}-{op}-t{t}-r1';sp=path/'summary.json'
   if not sp.exists():continue
   s=json.loads(sp.read_text());rows=list(csv.DictReader(gzip.open(path/'measurement.jtl.gz','rt')));lat=np.array([int(r['elapsed']) for r in rows]);ts=np.array([(int(r['timeStamp'])-s['measurement_start_ms'])/1000 for r in rows]);bins=np.arange(0,120,5);means=[np.mean(lat[(ts>=x)&(ts<x+5)]) if np.any((ts>=x)&(ts<x+5)) else np.nan for x in bins]
   axs[0].plot(bins+2.5,means,label=b,color=COL[b]);ps=np.array([1,10,25,50,75,90,95,99,99.5,99.9,100]);axs[1].plot(ps,np.percentile(lat,ps),color=COL[b],label=b)
  axs[0].set(xlabel='Measurement time (s)',ylabel='Mean response time (ms)',title=f'{op.capitalize()}, {t} threads');axs[1].set(xlabel='Percentile (%)',ylabel='Response time (ms)',title='Response time percentiles');axs[1].set_yscale('symlog',linthresh=1);axs[1].set_ylim(bottom=0)
  for ax in axs:ax.grid(alpha=.2);ax.legend(fontsize=8)
  fig.savefig(OUT/f'{op}-t{t}-curves.png',dpi=220);plt.close(fig)
 # Resource usage at maximum tested load.
 if levels:
  t=max(levels);fig,axs=plt.subplots(2,2,figsize=(8.3,4.7),constrained_layout=True)
  for j,b in enumerate(['mysql','mongo']):
   path=ROOT/'results/runs'/f'{b}-{op}-t{t}-r1'
   if not (path/'monitoring.json').exists():continue
   s=json.loads((path/'summary.json').read_text());m=json.loads((path/'monitoring.json').read_text());start=s['measurement_start_ms']/1000
   for row,key,ylabel in [(0,'host_cpu_percent','CPU usage (%)'),(1,'host_memory_available_mib','Available memory (MiB)')]:
    for ser in m[key]['data']['result']:
     role=ser['metric'].get('role');
     if role not in ['compiler','database','application']:continue
     xy=[(float(x)-start,float(y)) for x,y in ser['values'] if start<=float(x)<start+120]
     if xy:axs[row,j].plot(*zip(*xy),label=role)
    axs[row,j].set(xlabel='Measurement time (s)',ylabel=ylabel,title=f'{b}, {op}, {t} threads');axs[row,j].grid(alpha=.2);axs[row,j].legend(fontsize=7)
  fig.savefig(OUT/f'{op}-resources.png',dpi=220);plt.close(fig)
(ROOT/'results/selected-levels.json').write_text(json.dumps(selected,indent=2))
print('Aggregated',len(raw),'runs;',len(ag),'groups;',selected)
