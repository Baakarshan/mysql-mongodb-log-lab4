"""Build the final sample-aligned Word report from audited experimental results.
Run with the Codex bundled Python runtime (python-docx).
"""
from pathlib import Path
import json,statistics,datetime
from docx import Document
from docx.shared import Mm,Pt,RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT,WD_CELL_VERTICAL_ALIGNMENT
R=Path(__file__).resolve().parents[1];OUT=R/'report';OUT.mkdir(exist_ok=True)
audit=json.loads((R/'results/audit.json').read_text());assert audit['complete']
ag=json.loads((R/'results/aggregate.json').read_text());selected=json.loads((R/'results/selected-levels.json').read_text());lookup={(d['backend'],d['operation'],d['threads']):d for d in ag}
def d(b,o,t):return lookup[b,o,t]
def num(x):return f'{x:,.1f}'
def db_name(b):return 'MySQL' if b=='mysql' else 'MongoDB'
def high(op):
 m=d('mysql',op,200);g=d('mongo',op,200)
 return f'200线程时，MySQL的吞吐量为{num(m["throughput_rps"])}次/秒、P95为{num(m["p95_ms"])} ms；MongoDB的吞吐量为{num(g["throughput_rps"])}次/秒、P95为{num(g["p95_ms"])} ms。'
def compare(op):
 a=d('mysql',op,200);b=d('mongo',op,200);pieces=[]
 for metric,label in [('throughput_rps','吞吐量'),('p95_ms','P95')]:
  change=100*(b[metric]/a[metric]-1);pieces.append(f'{label}{"高" if change>=0 else "低"}{abs(change):.1f}%')
 return '在200线程档，MongoDB相对MySQL的'+ '、'.join(pieces)+'。'
def stats(b,op):
 p=R/'results/runs'/f'{b}-{op}-t200-r1';s=json.loads((p/'summary.json').read_text());data=json.loads((p/'monitoring.json').read_text());start=s['measurement_start_ms']/1000;end=s['measurement_end_ms']/1000;out={}
 for key in ['host_cpu_percent','host_memory_available_mib']:
  out[key]={}
  for series in data[key]['data']['result']:
   role=series['metric'].get('role');v=[float(y) for x,y in series['values'] if start<=float(x)<end]
   if role and v:out[key][role]={'mean':statistics.mean(v),'min':min(v),'max':max(v)}
 return out
D=Document();sec=D.sections[0];sec.page_width=Mm(184.03);sec.page_height=Mm(260.03);sec.top_margin=Mm(23);sec.bottom_margin=Mm(16);sec.left_margin=Mm(14.5);sec.right_margin=Mm(14.5);sec.header_distance=Mm(9);sec.footer_distance=Mm(8)
for name in ['Normal','Body Text','Title','Subtitle','Heading 1','Heading 2','Heading 3','Caption']:
 st=D.styles[name];st.font.name='Times New Roman';st.font.color.rgb=RGBColor(0,0,0);st._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Songti SC');st.paragraph_format.space_after=Pt(5)
normal=D.styles['Normal'];normal.font.size=Pt(9);normal.paragraph_format.line_spacing=Pt(14.1);normal.paragraph_format.first_line_indent=Pt(18)
for name,size in [('Heading 1',10.45),('Heading 2',9),('Heading 3',9)]:
 st=D.styles[name];st.font.size=Pt(size);st.font.bold=True;st.paragraph_format.first_line_indent=Pt(0);st.paragraph_format.space_before=Pt(8);st.paragraph_format.space_after=Pt(5);st.paragraph_format.keep_with_next=True
D.styles['Title'].font.size=Pt(14.05);D.styles['Title'].font.bold=False;D.styles['Title'].paragraph_format.first_line_indent=Pt(0);D.styles['Title'].paragraph_format.space_after=Pt(9);D.styles['Title'].paragraph_format.line_spacing=Pt(20)
D.styles['Caption'].font.size=Pt(8);D.styles['Caption'].font.bold=False;D.styles['Caption'].paragraph_format.first_line_indent=Pt(0);D.styles['Caption'].paragraph_format.line_spacing=Pt(12);D.styles['Caption'].paragraph_format.space_after=Pt(7)
sec.different_first_page_header_footer=True
p=sec.header.paragraphs[0];p.paragraph_format.first_line_indent=Pt(0);p.paragraph_format.space_after=Pt(0);r=p.add_run('MySQL 与 MongoDB 日志读写性能对比');r.font.size=Pt(8);p.add_run('    JavaEE 实验报告 2026年11月').font.size=Pt(8)
for footer in [sec.footer,sec.first_page_footer]:
 p=footer.paragraphs[0];p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.first_line_indent=Pt(0);field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');p._p.append(field)
fig=0;tab=0
md=[]
def para(text,style=None,indent=True):
 p=D.add_paragraph(text,style);md.append(text+'\n')
 if not indent:p.paragraph_format.first_line_indent=Pt(0)
 return p
_new_page=False
def head(text,level=1):
 global _new_page
 p=D.add_heading(text,level);p.paragraph_format.page_break_before=_new_page;_new_page=False;md.append('#'*level+' '+text+'\n')
def page():
 global _new_page
 _new_page=True
def image(path,caption,width=155):
 global fig
 p=D.add_paragraph();p.paragraph_format.first_line_indent=Pt(0);p.paragraph_format.keep_with_next=True;p.paragraph_format.space_after=Pt(2);p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.line_spacing=1.0;p.add_run().add_picture(str(path),width=Mm(width));fig+=1
 p=D.add_paragraph(f'图{fig}　{caption}','Caption');p.alignment=WD_ALIGN_PARAGRAPH.CENTER;md.append(f'![图{fig} {caption}]({path.relative_to(OUT) if path.is_relative_to(OUT) else "../"+str(path.relative_to(R))})\n')
def table(headers,rows,caption,widths=None):
 global tab
 tab+=1;p=para(f'表{tab}　{caption}','Caption',False);p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.keep_with_next=True
 t=D.add_table(rows=1,cols=len(headers));t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.autofit=False
 if widths:
  for col,width in zip(t.columns,widths):col.width=Mm(width)
 for i,h in enumerate(headers):t.rows[0].cells[i].text=h
 for vals in rows:
  cells=t.add_row().cells
  for i,v in enumerate(vals):cells[i].text=str(v)
 trPr=t.rows[0]._tr.get_or_add_trPr();rep=OxmlElement('w:tblHeader');trPr.append(rep)
 for ri,row in enumerate(t.rows):
  for ci,c in enumerate(row.cells):
   if widths:c.width=Mm(widths[ci])
   c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
   for p in c.paragraphs:
    p.paragraph_format.keep_with_next=ri<len(t.rows)-1;p.paragraph_format.first_line_indent=Pt(0);p.paragraph_format.space_after=Pt(3);p.paragraph_format.space_before=Pt(3);p.paragraph_format.line_spacing=Pt(12)
    for run in p.runs:run.font.size=Pt(8);run.bold=ri==0;run.font.color.rgb=RGBColor(0,0,0)
   tcPr=c._tc.get_or_add_tcPr();borders=OxmlElement('w:tcBorders')
   for side in ['top','bottom','left','right']:
    edge=OxmlElement('w:'+side);edge.set(qn('w:val'),'single' if (ri==0 and side in ['top','bottom']) or (ri==len(t.rows)-1 and side=='bottom') else 'nil');edge.set(qn('w:sz'),'6');borders.append(edge)
   tcPr.append(borders)
  np=OxmlElement('w:cantSplit');row._tr.get_or_add_trPr().append(np)
 md.append('| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,row))+' |' for row in rows)+'\n')
# Opening page follows the supplied single-column journal-style course sample.
para('MySQL 与 MongoDB 日志读写性能对比','Title',False);para('温子健',indent=False)
mr=d('mysql','read',200);gr=d('mongo','read',200);mw=d('mysql','write',200);gw=d('mongo','write',200)
abstract=f'本文基于统一日志模型和REST接口，比较Spring Data JPA/MySQL与Spring Data MongoDB/MongoDB的日志读写性能。实验使用四台云主机分两轮部署，预置10万条日志，在1至200线程下测试查询与单条写入，每档重复3次。200线程时，两库查询吞吐量分别为{num(mr["throughput_rps"])}、{num(gr["throughput_rps"])}次/秒，写入吞吐量分别为{num(mw["throughput_rps"])}、{num(gw["throughput_rps"])}次/秒。72次正式测量共记录{audit["measurement_samples"]:,}次请求、{audit["measurement_errors"]:,}次错误。结合响应时间分布与资源监测，分析增加并发的吞吐收益和延迟变化。'
p=para('摘　要：'+abstract,indent=False);para('关键词：MySQL；MongoDB；Spring Data JPA；JMeter；Prometheus',indent=False)
p=para('Log Read and Write Performance of MySQL and MongoDB',indent=False);p.runs[0].bold=True;p.runs[0].font.size=Pt(12);para('CHIKIN WEN',indent=False)
mr=d('mysql','read',200);gr=d('mongo','read',200);mw=d('mysql','write',200);gw=d('mongo','write',200)
para(f'Abstract: This experiment compares Spring Data JPA/MySQL and Spring Data MongoDB/MongoDB using a shared log model and REST API. Four cloud servers are reused in two sequential rounds. Each database starts with 100,000 records. Read and write workloads use 1 to 200 concurrent threads, with three repetitions per level. JMeter measures latency, throughput and errors, while Prometheus collects resource metrics every five seconds. At 200 threads, read throughput is {mr["throughput_rps"]:.1f} requests/s for MySQL and {gr["throughput_rps"]:.1f} requests/s for MongoDB; write throughput is {mw["throughput_rps"]:.1f} and {gw["throughput_rps"]:.1f} requests/s, respectively. The analysis relates latency distributions to application, database and load-generator resource usage.',indent=False)
para('Key words: MySQL; MongoDB; Spring Data JPA; JMeter; Prometheus',indent=False)
head('1　问题描述');para('日志服务需要持续写入事件，并按日志级别和时间范围查询历史记录。本文比较关系型表与文档集合在同一Java日志业务中的读写表现，重点考察并发增加时吞吐量、响应时间分布及资源占用的变化。两条链路使用相同接口、字段、请求生成规则和JMeter断言，使对照结果对应实际应用访问过程。')
head('2　实验环境与方法');head('2.1　四机两轮部署',2)
para('实验采用四台Ubuntu 18.04主机。第一轮运行MySQL和JPA应用，第二轮停止MySQL并切换为MongoDB及对应应用。两轮复用相同的数据库机、应用机、内网路径和资源配置，Compiler的编译工作在压测开始前完成。')
table(['主机','CPU与可见内存','实验角色'],[['Compiler','2核，792 MiB','Java 17编译与JMeter压测'],['Node1','2核，1800 MiB','MySQL或MongoDB，分轮运行'],['Node2','2核，792 MiB','当前被测Spring应用'],['Manager','2核，1800 MiB','Prometheus监控']], '服务器配置与分工',[28,44,83])
table(['项目','实际配置'],[['应用','Spring Boot 3.3.13，Java 17.0.21，堆256 MiB'],['编译与压测','Java 17.0.7，Maven 3.9.16，JMeter 5.6.3'],['MySQL','8.4.13，InnoDB缓冲池256 MiB'],['MongoDB','7.0.16，WiredTiger缓存0.25 GiB'],['数据库资源','两轮数据库容器内存上限均为1 GiB'],['连接池','两条链路最大20个连接，最小5个'],['监控','Prometheus 3.7.3，node_exporter 1.10.2，5秒采样']], '软件与运行参数',[35,120])
head('2.2　日志模型与统一接口',2)
para('日志字段包括id、traceId、level、source、message、clientIp和createdAt。id采用26位ULID，createdAt统一保存UTC毫秒时间，message最长4096字符。MySQL以CHAR(26)保存主键、DATETIME(6)保存时间；MongoDB将id映射为字符串_id，以BSON Date保存时间。')
para('POST /api/logs执行单条写入并返回HTTP 201及保存的对象。GET /api/logs接收level、from、to、page、size，按左闭右开时间范围查询，返回content、page、size、totalElements和totalPages。两套实现均按createdAt和id降序排列，并建立级别、时间、主键联合索引。')
para('JPA实现使用EntityManager.persist写入、JpaRepository条件分页查询；MongoDB实现使用Spring Data MongoTemplate执行insert、count和find。两条读取链路均返回当前页与匹配总数。MongoTemplate默认写入_class类型元数据，HTTP业务字段保持统一。MySQL每次事务提交刷盘并关闭二进制日志，MongoDB采用单机WiredTiger及w=1、journal=true写入确认。')
head('3　实验设计');head('3.1　基准数据与请求',2)
para('生成器以20261111为随机种子创建10万条日志，时间均匀覆盖2026年11月1日UTC全天，包含五种级别和八个服务来源。两库导入同一批业务字段，导入后核对记录数。固定查询为INFO级别、UTC 06:00至07:00、第一页20条，匹配总数为2497条。写入请求使用250字符正文和固定业务时间，服务端生成ULID。')
head('3.2　先负载后压力的分析方法',2)
para('负载测试先考察1和10线程下的查询与写入表现；逐级压力测试随后比较1、10、25、50、100、200线程，结合吞吐平台、P95/P99增长、错误率与资源占用识别性能转折。JMeter提供外部HTTP指标，Prometheus提供主机和应用内部指标，两类指标共同用于上述测试。两章复用同一批阶梯并发测量，保留原运行时间顺序；正文按先负载、后压力组织分析。')
para('查询与写入分别采用1、10、25、50、100、200线程，每档重复3次，两种数据库共72次正式测量。每次运行前恢复10万条基准数据，随后记录10秒升压、30秒预热和120秒正式测量。正式窗口按请求开始时间截取；窗口结束附近的收尾请求单独保留，原始HTTP采样行可完整复核。预热写入计入本次数据库增长，下一次运行前恢复基准。写入测试将全程成功请求数与数据库记录增长量核对，查询测试核对记录总数保持不变。')
head('3.3　指标与监控',2)
para('JMeter使用非GUI模式，保存完整HTTP响应时间及成功状态，不扣除网络连接耗时。统计每次运行的吞吐量、错误率、平均值和P50/P95/P99；各档汇总采用3次测量的中位数，误差线展示最小值至最大值。吞吐量按正式窗口请求数除以120秒计算。Prometheus同步记录主机CPU、可用内存、磁盘读写、应用堆和GC指标，并监控压测机资源。')
image(R/'screenshots/01-prometheus-targets.jpg','Prometheus的应用与四台主机采集目标全部在线')
page();head('3.4　功能与索引验收',2)
para('两条实现分别通过14项HTTP检查，覆盖固定数据查询、分页互斥、空结果、负页码、页大小、非法级别、正文超长、UTC毫秒精度及时间区间边界。固定查询的主键顺序与生成器计算的预期值一致。MySQL的EXPLAIN和MongoDB的执行计划保存在evidence目录，用于核对联合索引的使用。')
para('接口图为补拍的Edge开发者工具Network原图，依次展示POST状态码、请求正文、保存结果与GET分页预览。本机请求客户端通过HTTP转发和SSH隧道连接Node2；接口验收的本地网络耗时与正式JMeter压测分别记录。两库各新增1条演示日志，固定查询仍匹配2497条。')
for b in ['mysql','mongo']:
 if b=='mongo':page();head('MongoDB接口验收',3)
 image(R/'screenshots'/f'{b}-api-network-report.jpg',f'{db_name(b)}的Edge Network读写接口验收原图裁切组合',145)
page();head('3.5　数据库记录与索引',2)
para('下图为Ghostty真实终端截图，展示实际日志及当前记录数。正式末次写入测试结束后，MySQL为765118条，MongoDB为766808条；Edge接口补拍各新增1条演示日志，因此截图总数分别为765119和766809条。MySQL宽表按列分为上下两块，行序保持一致。')
for b in ['mysql','mongo']:
 p=R/'screenshots'/f'{b}-records-ghostty-report.png'
 if p.exists():image(p,f'{db_name(b)}实际存储记录与补拍后总数（Ghostty原图裁切）',145)
page();head('联合索引与执行计划',3)
para('MySQL联合索引列为level、created_at、id，执行计划使用range访问和Using index condition，估计扫描2497行。MongoDB联合索引列为level、createdAt、_id，计划为LIMIT→FETCH→IXSCAN；执行统计显示返回20条、检查20个索引键和20个文档。图7左侧为索引与扫描阶段，右侧接续索引属性、边界和执行统计。')
for b in ['mysql','mongo']:
 p=R/'screenshots'/f'{b}-index-ghostty-report.png'
 if p.exists():image(p,f'{db_name(b)}联合索引和查询计划（Ghostty原图裁切组合）',145)
page();head('4　负载测试结果与分析')
para('本章先比较1和10线程下的基础负载表现。每档3次测量，表中列出中位数；各次吞吐量、平均值、P50/P95/P99和错误率见results/all-runs.csv。两类操作分别使用相同请求与数据库初始数据。')

def performance_table(op,levels,caption):
 rows=[]
 for t in levels:
  a=d('mysql',op,t);b=d('mongo',op,t)
  rows.append([t,f'{a["throughput_rps"]:.1f}',f'{a["p95_ms"]:.1f}',f'{a["p99_ms"]:.1f}',f'{b["throughput_rps"]:.1f}',f'{b["p95_ms"]:.1f}',f'{b["p99_ms"]:.1f}'])
 table(['线程','MySQL\n次/秒','P95\nms','P99\nms','MongoDB\n次/秒','P95\nms','P99\nms'],rows,caption,[15,29,20,20,31,20,20])

def jmeter_level(op,label,t):
 para(f'{t}线程下，MySQL的P50/P95/P99中位数为{num(d("mysql",op,t)["p50_ms"])}/{num(d("mysql",op,t)["p95_ms"])}/{num(d("mysql",op,t)["p99_ms"])} ms；MongoDB为{num(d("mongo",op,t)["p50_ms"])}/{num(d("mongo",op,t)["p95_ms"])}/{num(d("mongo",op,t)["p99_ms"])} ms。下图为该档第1次重复的JMeter报告页面裁切图，左侧为5秒窗口的响应时间趋势，右侧为完整正式窗口的百分位分布。')
 for b in ['mysql','mongo']:
  image(R/'screenshots'/f'jmeter-{b}-{op}-t{t}-r1-pair.jpg',f'{db_name(b)} {label}{t}线程的趋势与百分位分布')

for op,label in [('read','查询'),('write','写入')]:
 if op=='write':page()
 head(f'4.{1 if op=="read" else 2}　{label}负载测试',2)
 performance_table(op,[1,10],label+'基础负载性能')
 a=d('mysql',op,10);b=d('mongo',op,10)
 para(f'10线程时，MySQL吞吐量为{num(a["throughput_rps"])}次/秒、P95为{num(a["p95_ms"])} ms；MongoDB为{num(b["throughput_rps"])}次/秒、{num(b["p95_ms"])} ms。两库1与10线程各3次正式测量的错误率均为0%。')
 jmeter_level(op,label,1)
 para('基础负载下的曲线用于观察短时波动与响应时间分布；后续压力测试使用全部并发档位，比较增加线程后的吞吐收益与延迟代价。')

page();head('5　逐级压力测试结果与分析')
para('本章比较1至200线程的阶梯升压结果。判断性能转折时同时检查吞吐量、延迟和错误率：增加线程后吞吐量趋平或回落、P95/P99继续上升，表明额外并发主要增加了等待。全部档位均完成，正式请求错误数为0；以下结论对应已测范围内的吞吐平台与延迟退化，故障上限和过载恢复未纳入本次测量。')
for op,label in [('read','查询'),('write','写入')]:
 if op=='write':page()
 head(f'5.{1 if op=="read" else 2}　{label}阶梯升压',2)
 performance_table(op,[1,10,25,50,100,200],label+'逐级压力测试性能')
 image(OUT/'figures'/f'{op}-comparison.png',label+'吞吐量及P95随并发变化，误差线为3次测量范围')
 best={b:max([x for x in ag if x['backend']==b and x['operation']==op],key=lambda x:x['throughput_rps']) for b in ['mysql','mongo']}
 para('在已测档位中，'+'；'.join(f'{db_name(b)}最高中位吞吐量为{num(best[b]["throughput_rps"])}次/秒，对应{best[b]["threads"]}线程、P95为{num(best[b]["p95_ms"])} ms' for b in ['mysql','mongo'])+'。')
 for b in ['mysql','mongo']:
  peak=best[b];end=d(b,op,200);drop=100*(1-end['throughput_rps']/peak['throughput_rps']);ratio=end['p95_ms']/peak['p95_ms']
  para(f'{db_name(b)}从{peak["threads"]}线程增加到200线程，吞吐量较已测峰值下降{drop:.1f}%，P95由{num(peak["p95_ms"])} ms上升至{num(end["p95_ms"])} ms，约为{ratio:.1f}倍。此区间继续增加并发的主要代价是延迟增长。')
 para(compare(op))
 for t in selected[op][1:]:
  page();head(f'{label}{t}线程的JMeter曲线',3);jmeter_level(op,label,t)
  if t<200:para(f'该档用于展示{label}的性能转折附近状态。MySQL与MongoDB各自的已测峰值线程数见前表；两图采用相同并发，便于直接比较。')
  else:para(high(op)+'200线程为本次最高测试档位，三次测量均完成且错误率为0%。')
 page();head(f'{label}压力下的资源表现',3)
 image(OUT/'figures'/f'{op}-resources.png',f'{label}200线程第1次重复的主机CPU与可用内存',145)
 pieces=[]
 for b in ['mysql','mongo']:
  st=stats(b,op);cpu=st['host_cpu_percent'];mem=st['host_memory_available_mib'];pieces.append(f'{db_name(b)}为{cpu["compiler"]["mean"]:.1f}%/{cpu["application"]["mean"]:.1f}%/{cpu["database"]["mean"]:.1f}%（压测机最小可用内存{mem["compiler"]["min"]:.1f} MiB）')
 para('按压测机、应用机、数据库机顺序，平均CPU使用率为：'+'；'.join(pieces)+'。资源序列与延迟曲线使用同一正式窗口。')
 hot=[]
 for b in ['mysql','mongo']:
  resource=stats(b,op)['host_cpu_percent'];role=max(['compiler','application','database'],key=lambda k:resource[k]['mean']);name={'compiler':'压测机','application':'应用机','database':'数据库机'}[role]
  hot.append(f'{db_name(b)}的{name}（{resource[role]["mean"]:.1f}%）')
 para('CPU占用最高的环节分别为'+'、'.join(hot)+'。查询的高资源占用集中在数据库机，写入集中在应用机。该结果定位了当前链路的资源压力，具体等待原因还需结合数据库与应用剖析。' if op=='write' else 'CPU占用最高的环节分别为'+'、'.join(hot)+'。两库查询的数据库CPU均高于应用机和压测机，与吞吐平台及延迟增长同时出现。')
 if op=='read':
  image(R/'screenshots/prometheus-cpu-comparison.jpg','查询200线程正式窗口的Prometheus CPU页面，左MySQL，右MongoDB',155)

for op,label in [('read','查询'),('write','写入')]:
 page();head(f'5.{3 if op=="read" else 4}　{label}的JMeter原生汇总',2)
 para('下图展示200线程第1次重复的APDEX表、Requests Summary饼图和Statistics表，均裁切自JMeter原生报告页面。低负载和转折附近的同类原图同时保存在screenshots目录。APDEX阈值为T=500 ms、F=1500 ms；饼图的PASS表示HTTP请求与断言通过，响应时间分布由APDEX及百分位指标描述。')
 for b in ['mysql','mongo']:
  image(R/'screenshots'/f'jmeter-{b}-{op}-t200-r1-summary-report.jpg',f'{db_name(b)}{label}200线程第1次重复的APDEX、请求饼图与统计表')
 para('Statistics使用单次运行样本及其实际起止时刻计算吞吐量；正文对照表采用固定120秒窗口的每次请求数，再取3次中位数。两种统计口径对应的原始样本与重复编号均可在仓库中核对。')

page();head('6　总结')
para(f'本实验完成了同一日志模型和接口下的JPA/MySQL与Spring Data MongoDB/MongoDB对照实现，并在四台云主机上通过两轮部署完成72次正式测量。{high("read")}{high("write")}这些结果描述了本实验硬件、查询选择率、索引、连接池和写入确认设置下的应用链路表现。')
para('查询返回20条数据并计算2497条匹配记录的总数，写入采用单条持久化并等待确认；两类操作承担不同的数据库工作。并发增加后的性能变化应结合吞吐量、P95/P99和主机资源判断。本文保留重复测量范围、原始错误和资源序列，使读写差异及性能转折均可追溯到具体运行。')
table(['核验项目','结果'],[['正式测量','72次，24个实现与操作并发组合，各重复3次'],['正式请求数',f'{audit["measurement_samples"]:,}'],['正式错误数',f'{audit["measurement_errors"]:,}'],['记录数核对','全部运行均完成核对'],['原始数据','升压预热、正式窗口、收尾JTL无损压缩及SHA-256'],['程序与材料','https://github.com/Baakarshan/mysql-mongodb-log-lab4']], '实验完成与数据核验',[36,119])
head('参考文献',2)
for text in ['[1] Spring. Spring Data JPA Reference Documentation. https://docs.spring.io/spring-data/jpa/reference/.','[2] Spring. Spring Data MongoDB Reference Documentation. https://docs.spring.io/spring-data/mongodb/reference/.','[3] Apache Software Foundation. Apache JMeter User Manual: Generating Dashboard Report. https://jmeter.apache.org/usermanual/generating-dashboard.html.','[4] MongoDB. Write Concern. https://www.mongodb.com/docs/v7.0/reference/write-concern/.','[5] Oracle. MySQL 8.4 Reference Manual: InnoDB Startup Options and System Variables. https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html.']:
 p=para(text,indent=False);p.paragraph_format.line_spacing=1.1
 for run in p.runs:run.font.size=Pt(8.5)
# Explicit font families and clean title borders avoid inherited theme residue.
for rf in D.styles.element.iter(qn('w:rFonts')):
 for attr in list(rf.attrib):
  if 'theme' in attr.lower():del rf.attrib[attr]
 rf.set(qn('w:ascii'),'Times New Roman');rf.set(qn('w:hAnsi'),'Times New Roman');rf.set(qn('w:eastAsia'),rf.get(qn('w:eastAsia'),'Songti SC'))
for node in list(D.styles.element.iter(qn('w:pBdr'))):node.getparent().remove(node)
for p in D.paragraphs:
 for node in list(p._p.iter(qn('w:pBdr'))):node.getparent().remove(node)
# Match the supplied sample's separate title, abstract and body typography.
for name in ['Title','Heading 1','Heading 2','Heading 3']:
 D.styles[name]._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Heiti SC')
for p in D.paragraphs:
 text=p.text
 if text.startswith('摘　要：') or text.startswith('关键词：'):
  for run in p.runs:run._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Kaiti SC')
 if text.startswith('Abstract:') or text.startswith('Key words:'):
  p.paragraph_format.line_spacing=Pt(12)
  for run in p.runs:run.font.size=Pt(7.45)
 if text=='温子健':
  p.paragraph_format.space_after=Pt(16)
  for run in p.runs:run.font.size=Pt(12);run._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'STFangsong')
 if text=='Log Read and Write Performance of MySQL and MongoDB':
  for run in p.runs:run.font.size=Pt(10.45)
D.core_properties.author='温子健';D.core_properties.title='MySQL 与 MongoDB 日志读写性能对比';D.core_properties.subject='实验四';D.core_properties.keywords='MySQL MongoDB JPA JMeter Prometheus'
D.save(OUT/'实验四实验报告.docx');(OUT/'实验四实验报告.md').write_text('\n'.join(md));print('Created report:',len(D.paragraphs),'paragraphs,',fig,'figures,',tab,'tables')
