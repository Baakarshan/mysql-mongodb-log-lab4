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
def high(op):
 m=d('mysql',op,200);g=d('mongo',op,200)
 return f'200线程时，MySQL的吞吐量为{num(m["throughput_rps"])}次/秒、P95为{num(m["p95_ms"])} ms；MongoDB的吞吐量为{num(g["throughput_rps"])}次/秒、P95为{num(g["p95_ms"])} ms。'
def stats(b,op):
 p=R/'results/runs'/f'{b}-{op}-t200-r1';s=json.loads((p/'summary.json').read_text());data=json.loads((p/'monitoring.json').read_text());start=s['measurement_start_ms']/1000;end=s['measurement_end_ms']/1000;out={}
 for key in ['host_cpu_percent','host_memory_available_mib']:
  out[key]={}
  for series in data[key]['data']['result']:
   role=series['metric'].get('role');v=[float(y) for x,y in series['values'] if start<=float(x)<end]
   if role and v:out[key][role]={'mean':statistics.mean(v),'min':min(v),'max':max(v)}
 return out
D=Document();sec=D.sections[0];sec.page_width=Mm(184.03);sec.page_height=Mm(260.03);sec.top_margin=Mm(20);sec.bottom_margin=Mm(16);sec.left_margin=Mm(14.5);sec.right_margin=Mm(14.5);sec.header_distance=Mm(9);sec.footer_distance=Mm(8)
for name in ['Normal','Body Text','Title','Subtitle','Heading 1','Heading 2','Heading 3','Caption']:
 st=D.styles[name];st.font.name='Times New Roman';st.font.color.rgb=RGBColor(0,0,0);st._element.get_or_add_rPr().rFonts.set(qn('w:eastAsia'),'Songti SC');st.paragraph_format.space_after=Pt(5)
normal=D.styles['Normal'];normal.font.size=Pt(10.5);normal.paragraph_format.line_spacing=1.3;normal.paragraph_format.first_line_indent=Pt(21)
for name,size in [('Heading 1',12),('Heading 2',11),('Heading 3',10.5)]:
 st=D.styles[name];st.font.size=Pt(size);st.font.bold=True;st.paragraph_format.first_line_indent=Pt(0);st.paragraph_format.space_before=Pt(9);st.paragraph_format.space_after=Pt(5);st.paragraph_format.keep_with_next=True
D.styles['Title'].font.size=Pt(16);D.styles['Title'].font.bold=False;D.styles['Title'].paragraph_format.first_line_indent=Pt(0);D.styles['Title'].paragraph_format.space_after=Pt(9)
D.styles['Caption'].font.size=Pt(9);D.styles['Caption'].font.bold=False;D.styles['Caption'].paragraph_format.first_line_indent=Pt(0);D.styles['Caption'].paragraph_format.line_spacing=1.1;D.styles['Caption'].paragraph_format.space_after=Pt(7)
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
def head(text,level=1):D.add_heading(text,level);md.append('#'*level+' '+text+'\n')
def page():D.add_page_break()
def image(path,caption,width=155):
 global fig
 p=D.add_paragraph();p.paragraph_format.first_line_indent=Pt(0);p.paragraph_format.keep_with_next=True;p.paragraph_format.space_after=Pt(2);p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.add_run().add_picture(str(path),width=Mm(width));fig+=1
 p=D.add_paragraph(f'图{fig}　{caption}','Caption');p.alignment=WD_ALIGN_PARAGRAPH.CENTER;md.append(f'![图{fig} {caption}]({path.relative_to(OUT) if path.is_relative_to(OUT) else "../"+str(path.relative_to(R))})\n')
def table(headers,rows,caption,widths=None):
 global tab
 tab+=1;p=para(f'表{tab}　{caption}','Caption',False);p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.keep_with_next=True
 t=D.add_table(rows=1,cols=len(headers));t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.autofit=False
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
    p.paragraph_format.first_line_indent=Pt(0);p.paragraph_format.space_after=Pt(3);p.paragraph_format.space_before=Pt(3);p.paragraph_format.line_spacing=1.05
    for run in p.runs:run.font.size=Pt(9);run.bold=ri==0;run.font.color.rgb=RGBColor(0,0,0)
   tcPr=c._tc.get_or_add_tcPr();borders=OxmlElement('w:tcBorders')
   for side in ['top','bottom','left','right']:
    edge=OxmlElement('w:'+side);edge.set(qn('w:val'),'single' if (ri==0 and side in ['top','bottom']) or (ri==len(t.rows)-1 and side=='bottom') else 'nil');edge.set(qn('w:sz'),'6');borders.append(edge)
   tcPr.append(borders)
  np=OxmlElement('w:cantSplit');row._tr.get_or_add_trPr().append(np)
 md.append('| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,row))+' |' for row in rows)+'\n')
# Opening page follows the supplied single-column journal-style course sample.
para('MySQL 与 MongoDB 日志读写性能对比','Title',False);para('温子健',indent=False)
abstract=f'本文基于同一日志模型和REST接口，对Spring Data JPA/MySQL与Spring Data MongoDB/MongoDB两条读写链路开展对照测试。实验使用四台云主机，按先MySQL、后MongoDB的顺序复用数据库机和应用机，预置10万条日志，在1至200线程下分别执行查询与单条写入，每档重复3次。JMeter记录响应时间、吞吐量和错误率，Prometheus每5秒采集资源指标。{high("read")}{high("write")}全部正式测量共记录{audit["measurement_samples"]:,}次请求、{audit["measurement_errors"]:,}次错误。'
p=para('摘　要：'+abstract,indent=False);para('关键词：MySQL；MongoDB；Spring Data JPA；JMeter；Prometheus',indent=False)
p=para('Log Read and Write Performance of MySQL and MongoDB',indent=False);p.runs[0].bold=True;p.runs[0].font.size=Pt(12);para('WEN Zi-Jian',indent=False)
mr=d('mysql','read',200);gr=d('mongo','read',200);mw=d('mysql','write',200);gw=d('mongo','write',200)
para(f'Abstract: This experiment compares Spring Data JPA/MySQL and Spring Data MongoDB/MongoDB using a shared log model and REST API. Four cloud servers are reused in two sequential rounds. Each database starts with 100,000 records. Read and write workloads use 1 to 200 concurrent threads, with three repetitions per level. JMeter measures latency, throughput and errors, while Prometheus collects resource metrics every five seconds. At 200 threads, read throughput is {mr["throughput_rps"]:.1f} requests/s for MySQL and {gr["throughput_rps"]:.1f} requests/s for MongoDB; write throughput is {mw["throughput_rps"]:.1f} and {gw["throughput_rps"]:.1f} requests/s, respectively. The analysis relates latency distributions to application, database and load-generator resource usage.',indent=False)
para('Key words: MySQL; MongoDB; Spring Data JPA; JMeter; Prometheus',indent=False)
head('1　问题描述');para('日志服务需要持续写入事件，并按日志级别和时间范围查询历史记录。本文比较关系型表与文档集合在同一Java日志业务中的读写表现，重点考察并发增加时吞吐量、响应时间分布及资源占用的变化。两条链路使用相同接口、字段、请求生成规则和JMeter断言，使对照结果对应实际应用访问过程。')
page();head('2　实验环境与实现');head('2.1　四机两轮部署',2)
para('实验采用四台Ubuntu 18.04主机。第一轮运行MySQL和JPA应用，第二轮停止MySQL并切换为MongoDB及对应应用。两轮复用相同的数据库机、应用机、内网路径和资源配置，Compiler的编译工作在压测开始前完成。')
table(['主机','CPU与可见内存','实验角色'],[['Compiler','2核，792 MiB','Java 17编译与JMeter压测'],['Node1','2核，1800 MiB','MySQL或MongoDB，分轮运行'],['Node2','2核，792 MiB','当前被测Spring应用'],['Manager','2核，1800 MiB','Prometheus监控']], '服务器配置与分工',[28,44,83])
table(['项目','实际配置'],[['应用','Spring Boot 3.3.13，Java 17.0.21，堆256 MiB'],['编译与压测','Java 17.0.7，Maven 3.9.16，JMeter 5.6.3'],['MySQL','8.4.13，InnoDB缓冲池256 MiB'],['MongoDB','7.0.16，WiredTiger缓存0.25 GiB'],['数据库资源','两轮数据库容器内存上限均为1 GiB'],['连接池','两条链路最大20个连接，最小5个'],['监控','Prometheus 3.7.3，node_exporter 1.10.2，5秒采样']], '软件与运行参数',[35,120])
head('2.2　日志模型与统一接口',2)
para('日志字段包括id、traceId、level、source、message、clientIp和createdAt。id采用26位ULID，createdAt统一保存UTC毫秒时间，message最长4096字符。MySQL以CHAR(26)保存主键、DATETIME(6)保存时间；MongoDB将id映射为字符串_id，以BSON Date保存时间。')
para('POST /api/logs执行单条写入并返回HTTP 201及保存的对象。GET /api/logs接收level、from、to、page、size，按左闭右开时间范围查询，返回content、page、size、totalElements和totalPages。两套实现均按createdAt和id降序排列，并建立级别、时间、主键联合索引。')
para('JPA实现使用EntityManager.persist写入、JpaRepository条件分页查询；MongoDB实现使用Spring Data MongoTemplate执行insert、count和find。两条读取链路均返回当前页与匹配总数。MySQL每次事务提交刷盘并关闭二进制日志，MongoDB采用单机WiredTiger及w=1、journal=true写入确认。')
page();head('3　实验设计');head('3.1　基准数据与请求',2)
para('生成器以20261111为随机种子创建10万条日志，时间均匀覆盖2026年11月1日UTC全天，包含五种级别和八个服务来源。两库导入同一批业务字段，导入后核对记录数。固定查询为INFO级别、UTC 06:00至07:00、第一页20条，匹配总数为2497条。写入请求使用250字符正文和固定业务时间，服务端生成ULID。')
head('3.2　升压与重复测量',2)
para('查询与写入分别采用1、10、25、50、100、200线程，每档重复3次，两种数据库共72次正式测量。每次运行前恢复10万条基准数据，随后记录10秒升压、30秒预热和120秒正式测量。正式窗口按请求开始时间截取；窗口结束附近的收尾请求单独保留，原始HTTP采样行可完整复核。预热写入计入本次数据库增长，下一次运行前恢复基准。写入测试将全程成功请求数与数据库记录增长量核对，查询测试核对记录总数保持不变。')
head('3.3　指标与监控',2)
para('JMeter使用非GUI模式，保存完整HTTP响应时间及成功状态，不扣除网络连接耗时。统计每次运行的吞吐量、错误率、平均值和P50/P95/P99；各档汇总采用3次测量的中位数，误差线展示最小值至最大值。吞吐量按正式窗口请求数除以120秒计算。Prometheus同步记录主机CPU、可用内存、磁盘读写、应用堆和GC指标，并监控压测机资源。')
image(R/'screenshots/01-prometheus-targets.jpg','Prometheus的应用与四台主机采集目标全部在线')
page();head('3.4　功能与索引验收',2)
para('两条实现分别通过14项HTTP检查，覆盖固定数据查询、分页互斥、空结果、负页码、页大小、非法级别、正文超长、UTC毫秒精度及时间区间边界。固定查询的主键顺序与生成器计算的预期值一致。MySQL的EXPLAIN和MongoDB的执行计划保存在evidence目录，用于核对联合索引的使用。')
for b in ['mysql','mongo']:
 p=R/'screenshots'/f'{b}-api-report.jpg'
 if p.exists():image(p,f'{b.upper()}实际POST与GET接口响应记录',145)
page();head('4　实验结果与分析')
for op,label in [('read','查询'),('write','写入')]:
 if op=='write':page()
 head(f'4.{1 if op=="read" else 2}　{label}负载测试',2)
 para(f'表中吞吐量和延迟均为同档3次测量的中位数，完整平均值、P50/P95/P99和各次结果保存在results/aggregate.csv与all-runs.csv。{high(op)}')
 rows=[]
 for t in [1,10,25,50,100,200]:
  a=d('mysql',op,t);b=d('mongo',op,t);rows.append([t,f'{a["throughput_rps"]:.1f}',f'{a["p95_ms"]:.1f}',f'{a["p99_ms"]:.1f}',f'{b["throughput_rps"]:.1f}',f'{b["p95_ms"]:.1f}',f'{b["p99_ms"]:.1f}'])
 table(['线程','MySQL\n次/秒','P95\nms','P99\nms','MongoDB\n次/秒','P95\nms','P99\nms'],rows,label+'性能汇总',[15,29,20,20,31,20,20])
 errs={b:sum(s['errors'] for s in [json.loads(p.read_text()) for p in (R/'results/runs').glob(f'{b}-{op}-*/summary.json')]) for b in ['mysql','mongo']}
 para(f'本组MySQL正式请求错误数为{errs["mysql"]:,}，MongoDB为{errs["mongo"]:,}。'+('两种实现各档的3次测量错误率均为0%。' if sum(errs.values())==0 else '各档错误率见完整统计表。')+'图中的误差线体现重复测量的波动，吞吐量曲线与P95曲线共同反映并发增加后的收益和延迟代价。')
 image(OUT/'figures'/f'{op}-comparison.png',label+'吞吐量及P95随并发变化，误差线为3次测量范围')
 best={b:max([x for x in ag if x['backend']==b and x['operation']==op],key=lambda x:x['throughput_rps']) for b in ['mysql','mongo']}
 para('在已测档位中，'+ '；'.join(f'{b.upper()}的最高中位吞吐量为{num(best[b]["throughput_rps"])}次/秒，对应{best[b]["threads"]}线程、P95为{num(best[b]["p95_ms"])} ms' for b in ['mysql','mongo'])+'。')
 page();head(label+'响应时间曲线',3)
 levels=selected[op]
 for i,t in enumerate(levels):
  if i==2:page();head(label+'高并发与资源占用',3)
  para(f'{t}线程下，MySQL的P50/P95/P99为{num(d("mysql",op,t)["p50_ms"])}/{num(d("mysql",op,t)["p95_ms"])}/{num(d("mysql",op,t)["p99_ms"])} ms，MongoDB为{num(d("mongo",op,t)["p50_ms"])}/{num(d("mongo",op,t)["p95_ms"])}/{num(d("mongo",op,t)["p99_ms"])} ms。趋势图按5秒窗口计算均值，百分位曲线使用该次正式窗口内全部响应时间。')
  image(OUT/'figures'/f'{op}-t{t}-curves.png',f'{label}{t}线程第1次重复的响应时间趋势与百分位分布')
 image(OUT/'figures'/f'{op}-resources.png',f'{label}200线程第1次重复的主机CPU与可用内存')
 pieces=[]
 for b in ['mysql','mongo']:
  st=stats(b,op);cpu=st['host_cpu_percent'];mem=st['host_memory_available_mib'];pieces.append(f'{b.upper()}阶段，压测机、应用机和数据库机的平均CPU使用率分别为{cpu["compiler"]["mean"]:.1f}%、{cpu["application"]["mean"]:.1f}%和{cpu["database"]["mean"]:.1f}%，压测机最小可用内存为{mem["compiler"]["min"]:.1f} MiB')
 para('；'.join(pieces)+'。上述资源序列与延迟曲线采用同一正式窗口，用于定位各运行环节的资源压力。')
 for b in ['mysql','mongo']:
  resource=stats(b,op)['host_cpu_percent'];role=max(['compiler','application','database'],key=lambda k:resource[k]['mean']);name={'compiler':'压测机','application':'应用机','database':'数据库机'}[role]
  if resource[role]['mean']>=80:
   para(f'{b.upper()}阶段，{name}的平均CPU使用率达到{resource[role]["mean"]:.1f}%，是本次监测中CPU使用率最高的测试环节。结合吞吐量与P95曲线，可以识别增加并发后的资源压力及延迟变化。')

page();head('4.3　JMeter原始报告页面',2)
para('下图直接截取JMeter HTML报告的响应时间趋势和百分位页面，报告输入为第1次重复的正式JTL。完整截图与各次原始测量文件一同保存，可按运行编号对应到统计表和监控时间窗。')
for op,label in [('read','查询'),('write','写入')]:
 p=R/'screenshots'/f'{op}-jmeter-comparison.jpg'
 if p.exists():image(p,f'{label}最高并发下两种实现的JMeter曲线',145)
page();head('5　总结')
para(f'本实验完成了同一日志模型和接口下的JPA/MySQL与Spring Data MongoDB/MongoDB对照实现，并在四台云主机上通过两轮部署完成72次正式测量。{high("read")}{high("write")}这些结果描述了本实验硬件、查询选择率、索引、连接池和写入确认设置下的应用链路表现。')
para('查询返回20条数据并计算2497条匹配记录的总数，写入采用单条持久化并等待确认；两类操作承担不同的数据库工作。并发增加后的性能变化应结合吞吐量、P95/P99和主机资源判断。本文保留重复测量范围、原始错误和资源序列，使读写差异及性能转折均可追溯到具体运行。')
table(['核验项目','结果'],[['正式测量','72次，24个实现与操作并发组合，各重复3次'],['正式请求数',f'{audit["measurement_samples"]:,}'],['正式错误数',f'{audit["measurement_errors"]:,}'],['记录数核对','全部运行均完成核对'],['原始数据','升压预热、正式窗口、收尾JTL无损压缩及SHA-256'],['程序与材料','https://github.com/Baakarshan/mysql-mongodb-log-lab4']], '实验完成与数据核验',[36,119])
head('参考文献',2)
for text in ['[1] Spring. Spring Data JPA Reference Documentation. https://docs.spring.io/spring-data/jpa/reference/.','[2] Spring. Spring Data MongoDB Reference Documentation. https://docs.spring.io/spring-data/mongodb/reference/.','[3] Apache Software Foundation. Apache JMeter User Manual: Generating Dashboard Report. https://jmeter.apache.org/usermanual/generating-dashboard.html.','[4] MongoDB. Write Concern. https://www.mongodb.com/docs/v7.0/reference/write-concern/.','[5] Oracle. MySQL 8.4 Reference Manual: InnoDB Startup Options and System Variables. https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html.']:
 p=para(text,indent=False);p.paragraph_format.line_spacing=1.1
 for run in p.runs:run.font.size=Pt(8.5)
D.core_properties.author='温子健';D.core_properties.title='MySQL 与 MongoDB 日志读写性能对比';D.core_properties.subject='实验四';D.core_properties.keywords='MySQL MongoDB JPA JMeter Prometheus'
D.save(OUT/'实验四实验报告-温子健.docx');(OUT/'实验四实验报告-温子健.md').write_text('\n'.join(md));print('Created report:',len(D.paragraphs),'paragraphs,',fig,'figures,',tab,'tables')
