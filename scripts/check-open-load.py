"""用慢响应服务检查到达速率是否独立于响应时间。"""
import argparse
import csv
import gzip
import http.server
import json
from pathlib import Path
import subprocess
import tempfile
import threading
import time

p=argparse.ArgumentParser();p.add_argument('binary',type=Path);a=p.parse_args()
class Slow(http.server.BaseHTTPRequestHandler):
    protocol_version='HTTP/1.1'
    def do_GET(self):
        time.sleep(.4)
        body=b'{"totalElements":0}'
        self.send_response(200);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
    def log_message(self,*args): pass
class Server(http.server.ThreadingHTTPServer):
    request_queue_size=1024
    daemon_threads=True
server=Server(('127.0.0.1',0),Slow)
threading.Thread(target=server.serve_forever,daemon=True).start()
with tempfile.TemporaryDirectory() as tmp:
    subprocess.run([str(a.binary.resolve()),'-rate','40','-seconds','3','-output',tmp,'-url',f'http://127.0.0.1:{server.server_port}'],check=True,stdout=subprocess.DEVNULL)
    result=json.loads((Path(tmp)/'arrivals.json').read_text())
    assert all(b['scheduled']==40 and b['started']==40 and b['dropped']==0 for b in result['per_second'][:3]),result
    assert result['max_inflight_observed']>=15,result
    with gzip.open(Path(tmp)/'all.jtl.gz','rt') as f: rows=list(csv.DictReader(f))
    assert len(rows)==120 and all(r['success']=='true' for r in rows)
    print('慢响应400ms，实际启动40次/秒，120次请求全部完成；最大在途',result['max_inflight_observed'])
server.shutdown()
