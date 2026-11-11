"""Local request launcher and HTTP forwarder for Edge Network evidence.
Start an SSH tunnel on localhost:18080 before running this helper.
Supplementary requests are written to work/interface-recapture.ndjson.
"""
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
import urllib.request,urllib.error
PAGE=b'''<!doctype html><meta charset="utf-8"><title>Log API request client</title><h1>Log API request client</h1><button onclick="fetch('/api/logs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({traceId:'edge-evidence',level:'INFO',source:'screenshot-demo',message:'Interface evidence capture',clientIp:'127.0.0.1',createdAt:'2026-11-11T12:00:00.123Z'})}).then(r=>document.querySelector('output').textContent='POST '+r.status)">POST log</button> <button onclick="fetch('/api/logs?level=INFO&from=2026-11-01T06:00:00Z&to=2026-11-01T07:00:00Z&page=0&size=20').then(r=>document.querySelector('output').textContent='GET '+r.status)">GET logs</button><p><output></output>'''
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):self.handle_request()
 def do_POST(self):self.handle_request()
 def handle_request(self):
  if self.path=='/':self.send_response(200);self.send_header('Content-Type','text/html');self.end_headers();self.wfile.write(PAGE);return
  data=self.rfile.read(int(self.headers.get('Content-Length',0))) if self.command=='POST' else None
  req=urllib.request.Request('http://127.0.0.1:18080'+self.path,data=data,headers={'Content-Type':'application/json'},method=self.command)
  try:res=urllib.request.urlopen(req)
  except urllib.error.HTTPError as ex:res=ex
  body=res.read();self.send_response(res.code);self.send_header('Content-Type',res.headers.get('Content-Type','application/json'));self.end_headers();self.wfile.write(body)
  if self.path.startswith('/api/'):
   import json,datetime
   with open('work/interface-recapture.ndjson','a') as f:f.write(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':self.command,'path':self.path,'request':data.decode() if data else None,'status':res.code,'response':body.decode()})+'\n')
ThreadingHTTPServer(('127.0.0.1',18081),Handler).serve_forever()
