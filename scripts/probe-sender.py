"""每秒记录发送机内存、JMeter线程和任务配额命中数，全程覆盖预热与收尾。"""
import sys,time,json,os
from pathlib import Path
out=Path(sys.argv[1]);pid=int(sys.argv[2]);cg=[x.split(':',2)[2] for x in Path('/proc/self/cgroup').read_text().splitlines() if ':pids:' in x][0];base=Path('/sys/fs/cgroup/pids')/cg.lstrip('/')
previous_cpu=None
with (out/'sender-timeline.jsonl').open('w') as f, (out/'generator-health.txt').open('w') as compat:
 while Path('/proc/'+str(pid)).exists():
  mem=dict(line.split(':',1) for line in Path('/proc/meminfo').read_text().splitlines());x={'time_ms':int(time.time()*1000),'available_kib':int(mem['MemAvailable'].split()[0]),'pids_current':int((base/'pids.current').read_text()),'pids_events':(base/'pids.events').read_text() if (base/'pids.events').exists() else None}
  cpu=[int(v) for v in Path('/proc/stat').read_text().splitlines()[0].split()[1:9]]
  total=sum(cpu);idle=cpu[3]
  if previous_cpu and total>previous_cpu[0]:x['host_cpu_percent']=100*(1-(idle-previous_cpu[1])/(total-previous_cpu[0]))
  previous_cpu=(total,idle)
  for p in Path('/proc').glob('[0-9]*'):
   try:
    args=(p/'cmdline').read_bytes()
    if b'ApacheJMeter.jar' not in args or str(out).encode() not in args:continue
    status=dict(line.split(':',1) for line in (p/'status').read_text().splitlines() if ':' in line)
    x.update(java_pid=int(p.name),threads=int(status['Threads']),rss_kib=int(status['VmRSS'].split()[0]))
   except (FileNotFoundError,ProcessLookupError,PermissionError):pass
  f.write(json.dumps(x)+'\n');f.flush();compat.write(str(x['time_ms']//1000)+'\nMemAvailable: '+str(x['available_kib'])+' kB\n');compat.flush();time.sleep(1)
for n in ['pids.events','pids.current']:
 q=base/n
 if q.exists():(out/(n+'.after')).write_text(q.read_text())
