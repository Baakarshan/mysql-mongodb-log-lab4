"""Split unmodified JMeter rows into ramp/warm-up and measurement files."""
import csv,gzip,json,pathlib,sys,math,hashlib
r=pathlib.Path(sys.argv[1]);start=int((r/'start-ms.txt').read_text());cut=start+40000;end=start+160000
lat=[];all_success=0;errors=0;warm=0;measurement=0;labels={};other=0
with (r/'all.jtl').open() as src,gzip.open(r/'warmup.jtl.gz','wt',newline='') as wf,gzip.open(r/'measurement.jtl.gz','wt',newline='') as mf:
 reader=csv.DictReader(src);ww=csv.DictWriter(wf,reader.fieldnames);mw=csv.DictWriter(mf,reader.fieldnames);ww.writeheader();mw.writeheader()
 for row in reader:
  if row['label'] not in ['read','write']:other+=1;continue
  all_success+=row['success']=='true';t=int(row['timeStamp']);labels[row['label']]=labels.get(row['label'],0)+1
  if t<cut:ww.writerow(row);warm+=1
  else:
   mw.writerow(row);lat.append(int(row['elapsed']));measurement+=1;errors+=row['success']!='true'
lat.sort()
def percentile(p):
 if not lat:return None
 n=(len(lat)-1)*p;l=int(n);return lat[l]+(lat[min(l+1,len(lat)-1)]-lat[l])*(n-l)
summary={'start_ms':start,'measurement_start_ms':cut,'measurement_end_ms':end,'duration_s':120,'warmup_samples':warm,'samples':measurement,'all_success':all_success,'errors':errors,'error_rate':errors/measurement if measurement else 1,'throughput_rps':measurement/120,'mean_ms':sum(lat)/measurement if measurement else None,'p50_ms':percentile(.5),'p95_ms':percentile(.95),'p99_ms':percentile(.99),'max_ms':max(lat) if lat else None,'labels':labels,'setup_samples':other,'files':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [r/'warmup.jtl.gz',r/'measurement.jtl.gz']}}
(r/'summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary))
