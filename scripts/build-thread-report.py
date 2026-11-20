"""Build the report from observed progressive measurements and native screenshots."""
from pathlib import Path
import argparse,json,statistics,datetime,re
from docx import Document
from docx.shared import Mm,Pt,RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();R=a.bundle;O=R/'report';O.mkdir(exist_ok=True)
runs=json.loads((R/'results/all-runs.json').read_text());ag=json.loads((R/'results/aggregate.json').read_text());selected=json.loads((R/'results/selected-runs.json').read_text())
D=Document();sec=D.sections[0];sec.page_width=Mm(184.03);sec.page_height=Mm(260.03);sec.top_margin=Mm(23);sec.bottom_margin=Mm(16);sec.left_margin=Mm(14.5);sec.right_margin=Mm(14.5)
for name in ['Normal','Title','Heading 1','Heading 2','Heading 3','Caption']:
 st=D.styles[name];st.font.name='Times New Roman';st.font.color.rgb=RGBColor(0,0,0);st._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Songti SC');st.paragraph_format.space_after=Pt(5)
D.styles['Normal'].font.size=Pt(9);D.styles['Normal'].paragraph_format.line_spacing=Pt(14.1);D.styles['Normal'].paragraph_format.first_line_indent=Pt(18)
D.styles['Title'].font.size=Pt(14);D.styles['Title'].paragraph_format.first_line_indent=Pt(0)
for n in ['Heading 1','Heading 2','Heading 3']:
 st=D.styles[n];st.font.size=Pt(10.5 if n=='Heading 1' else 9);st.font.bold=True;st._element.rPr.rFonts.set(qn('w:eastAsia'),'Heiti SC');st.paragraph_format.first_line_indent=Pt(0);st.paragraph_format.keep_with_next=True
D.styles['Caption'].font.size=Pt(8);D.styles['Caption'].font.bold=False;D.styles['Caption'].font.italic=False;D.styles['Caption'].paragraph_format.first_line_indent=Pt(0)
sec.different_first_page_header_footer=True
sec.header.paragraphs[0].text='MySQL 与 MongoDB 日志读写性能对比    JavaEE 实验报告 2026年11月'
for ft in [sec.footer,sec.first_page_footer]:
 x=ft.paragraphs[0];x.alignment=WD_ALIGN_PARAGRAPH.CENTER;fld=OxmlElement('w:fldSimple');fld.set(qn('w:instr'),'PAGE');x._p.append(fld)
md=[];fig=tab=0

def para(t,style=None):
 md.append(t+'\n');return D.add_paragraph(t,style)
def head(t,l=1):md.append('#'*l+' '+t+'\n');return D.add_heading(t,l)
def page():D.add_page_break()
def image(path,caption,width=151):
 global fig
 if not path.exists():raise FileNotFoundError(path)
 if path.name.endswith('-thread-progression.png'):width=140
 fig+=1;x=D.add_paragraph();x.paragraph_format.line_spacing=1.0;x.paragraph_format.space_after=Pt(0);x.paragraph_format.first_line_indent=Pt(0);x.paragraph_format.keep_with_next=True;x.alignment=WD_ALIGN_PARAGRAPH.CENTER;x.add_run().add_picture(str(path),width=Mm(width));x=D.add_paragraph(f'图{fig}　{caption}','Caption');x.alignment=WD_ALIGN_PARAGRAPH.CENTER;x.paragraph_format.line_spacing=Pt(10);x.paragraph_format.space_after=Pt(3);md.append(f'![图{fig} {caption}]({path.relative_to(O) if path.is_relative_to(O) else "../"+str(path.relative_to(R))})\n')
def table(headers,rows,caption):
 global tab
 tab+=1;cp=para(f'表{tab}　{caption}','Caption');cp.paragraph_format.keep_with_next=True;t=D.add_table(rows=1,cols=len(headers));t.autofit=True
 for c,x in zip(t.rows[0].cells,headers):c.text=str(x)
 for row in rows:
  for c,x in zip(t.add_row().cells,row):c.text=str(x)
 for ri,row in enumerate(t.rows):
  row._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
  if ri==0:row._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
  for c in row.cells:
   c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
   if ri==0:
    shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'F2F2F2');c._tc.get_or_add_tcPr().append(shade)
   for pp in c.paragraphs:
    pp.paragraph_format.first_line_indent=Pt(0);pp.paragraph_format.space_after=Pt(3)
    pp.paragraph_format.keep_with_next=(ri<len(t.rows)-1 if len(t.rows)<=12 else ri<3)
    for rr in pp.runs:rr.font.size=Pt(7.5);rr.bold=ri==0
   borders=OxmlElement('w:tcBorders')
   for side in ['top','left','bottom','right','insideH','insideV']:
    edge=OxmlElement('w:'+side);edge.set(qn('w:val'),'single');edge.set(qn('w:sz'),'4');edge.set(qn('w:color'),'D9D9D9');borders.append(edge)
   c._tc.get_or_add_tcPr().append(borders)
 if headers[0] in ['运行','关联运行']:
  widths=[55]+[100/(len(headers)-1)]*(len(headers)-1)
 elif headers[0]=='主机':widths=[24,35,96]
 else:widths=[155/len(headers)]*len(headers)
 t.autofit=False
 for col,w in zip(t.columns,widths):col.width=Mm(w)
 for row in t.rows:
  for c,w in zip(row.cells,widths):c.width=Mm(w)
 md.append('| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,row))+' |' for row in rows)+'\n')
def fmt(v):return '—' if v is None else f'{v:,.1f}'
def label(b):return 'MySQL' if b=='mysql' else 'MongoDB'
def highest(b,o):return max((s for s in runs if s['backend']==b and s['operation']==o and s['purpose']=='exploration'),key=lambda s:s['target_rps'])
N=sum(s['samples'] for s in runs);E=sum(s['errors'] for s in runs)
lookup={s['name']:s for s in runs}
def metrics(s,key,role=None):
 m=json.loads((R/'results/runs'/s['name']/'monitoring.json').read_text())
 return [float(v) for x in m.get(key,{}).get('data',{}).get('result',[]) if role is None or x['metric'].get('role')==role for t,v in x.get('values',[]) if s['measurement_start_ms']/1000<=t<s['measurement_end_ms']/1000 and v not in ['NaN','+Inf','-Inf']]
def metric(s,key,role=None,mode='max'):
 v=metrics(s,key,role)
 return (min(v) if mode=='min' else max(v)) if v else None
purpose={'exploration':'逐级负载','boundary_refinement':'转折细分','boundary_confirmation':'转折复测','pool40_diagnosis':'连接池40对照','recovery_confirmation':'恢复确认','tomcat40_diagnosis':'Tomcat40对照','arrival_confirmation':'发送平台复测'}
common_results={}
for operation in ['read','write']:
 by_backend={b:{s['threads']:s for s in runs if s['backend']==b and s['operation']==operation and s['purpose']=='exploration' and s['classification']=='load' and s['errors']==0} for b in ['mysql','mongo']}
 common=sorted(set(by_backend['mysql'])&set(by_backend['mongo']))
 if common:common_results[operation]=(common[-1],by_backend['mysql'][common[-1]],by_backend['mongo'][common[-1]])
abstract_result=''
english_result=''
for operation,title in [('read','查询'),('write','写入')]:
 if operation in common_results:
  n,m,g=common_results[operation];abstract_result+=f'两库共同正常{title}档位{n}线程下，平均响应分别为{m["mean_ms"]:.2f}与{g["mean_ms"]:.2f} ms。';english_result+=f'At the common normal {operation} load of {n:,} threads, mean response times were {m["mean_ms"]:.2f} ms for MySQL and {g["mean_ms"]:.2f} ms for MongoDB. '
thread_result='';english_thread_result=''
original_mysql=next((s for s in runs if s['backend']=='mysql' and s['operation']=='read' and s['purpose']=='exploration' and s['target_rps']==1080 and not s['generator_limit']),None)
corrected_mysql=next((s for s in runs if s['backend']=='mysql' and s['operation']=='read' and s['purpose']=='tomcat40_diagnosis' and s['target_rps']==1080 and not s['generator_limit']),None)
if original_mysql and corrected_mysql:
 thread_result=f'工作线程上限从200改为40后，同为1080次/秒的MySQL查询错误率由{original_mysql["error_rate"]:.0%}变为{corrected_mysql["error_rate"]:.0%}，成功请求平均响应{corrected_mysql["successful_mean_ms"]:.2f} ms。'
 english_thread_result=f'At 1,080 requests/s, the MySQL query error rate changed from {original_mysql["error_rate"]:.0%} with 200 maximum workers to {corrected_mysql["error_rate"]:.0%} with 40 workers, with a successful mean response of {corrected_mysql["successful_mean_ms"]:.2f} ms. '
para('MySQL 与 MongoDB 日志读写性能对比','Title');para('温子健')
para(f'摘　要：本文以平均响应时间为主指标，比较Spring Data JPA/MySQL与Spring Data MongoDB/MongoDB的日志读写性能。四台服务器分两轮复用，Manager使用JMeter发压，每个线程只执行一次HTTP请求，按固定速率均匀启动单次请求线程，发送55秒，逐级增加线程总数。每档恢复10万条初始数据，以中间20秒的完整秒计数检查发送均匀性。平均响应时间明显上升后，细分相邻档位并检查CPU、内存、磁盘、GC、连接池等待与线程状态。{abstract_result}共完成{len(runs)}次运行，正式窗口记录{N:,}次请求。{thread_result}')
para('关键词：MySQL；MongoDB；平均响应时间；负载测试；JMeter；Prometheus')
para('Log Read and Write Performance of MySQL and MongoDB');para('CHIKIN WEN')
para(f'Abstract: This experiment compares JPA/MySQL and Spring Data MongoDB using mean HTTP response time as the primary metric. Four servers are reused in two rounds. JMeter on Manager uses evenly spaced arrivals over 55 seconds, and each thread sends one request. Total thread counts increase progressively. Each run resets 100,000 logs and measures the middle 20 seconds. Per-second starts verify traffic uniformity. A marked rise in mean response time triggers finer testing and inspection of CPU, memory, disk activity, GC, connection-pool waits and thread states. {english_result}The {len(runs)} runs contain {N:,} measured requests. {english_thread_result}')
para('Key words: MySQL; MongoDB; mean response time; load testing; JMeter; Prometheus')
head('1　问题描述')
para('日志服务写入单条事件，并按级别与时间分页查询。实验首先逐级增加线程数，观察平均响应时间与资源占用的变化；响应明显变慢后进入压力分析，检查资源饱和、排队与配置的关系。吞吐量、错误率和响应时间分位数作为辅助指标。')
head('2　实验环境与实现')
table(['主机','配置','任务'],[['Compiler','2核，792 MiB','Java 17、Maven构建'],['Node1','2核，1800 MiB','MySQL 8.4.13 / MongoDB 7.0.16'],['Node2','2核，792 MiB','Spring Boot 3.3.13，堆256 MiB'],['Manager','2核，1800 MiB','JMeter 5.6.3发压、Prometheus 3.7.3']], '四台机器分两轮复用')
para('第一轮运行MySQL与JPA实现，第二轮运行MongoDB与Spring Data MongoDB实现。数据库和应用各占一台机器，Manager全程发压并采集监控，Compiler负责构建。两轮使用同一应用JAR。数据库缓存约256 MiB、容器上限1 GiB；应用堆256 MiB、容器上限560 MiB，基础连接池20。MySQL每次提交刷盘并关闭binlog；MongoDB单机w=1、journal=true。压测期间暂停共用资源的四项RBAC服务，结束后恢复原副本数。')
para('公共字段为id、traceId、level、source、message、clientIp、createdAt；服务端生成26位ULID，UTC时间精确到毫秒，正文最多4096字符。POST返回201与保存对象；GET使用[from,to)时间范围、从0开始分页，按createdAt、id降序，返回当前页和匹配总数。两库建立level、createdAt、id联合索引。Java代码按Google Java Style排版，中文注释说明查询与字段语义。')
head('3　实验设计')
head('3.1　每线程一次请求与均匀启动',2)
para('JMeter 5.6.3使用5个内置Open Model Thread Group平分发送速率，采用even_arrivals等间隔到达计划，持续发送55秒，随后留8秒等待请求完成。每个逻辑线程执行一次HTTP请求，下一请求的计划启动时刻独立于前一请求的响应。每档逐级提高计划速率，线程总数为速率乘55；同时活跃线程数另外记录。运行前生成仅含当前读或写采样器的JMX，使用状态码断言；接口字段语义由独立接口检查验证。')
para('每档恢复10万条固定种子日志，前30秒预热，正式窗口取时钟起点后30至50秒，随后5秒继续发送。时钟起点对齐整秒，正式JTL完整保留20秒。HPS平台的核验同时检查三项：任一秒偏离窗口均值不超过10%，前后各5秒均值之差不超过窗口均值的10%，窗口均值偏离计划速率不超过10%。这是本实验采用的发送质量标准；全部逐秒计数与判定原因随JTL保存。发送不合格的运行退出性能比较，保留用于发压排查并安排重测。')
para('报告为每条读写链路列出逐档Hits Per Second曲线，虚线表示计划速率，阴影为计划值上下10%的范围；曲线使用原始JTL计数，核验图纵轴从0开始；原生截图保留JMeter的自动纵轴，题注列出实际逐秒范围。选定档位另列原生JMeter的Hits Per Second截图，与响应趋势、百分位和Statistics对应。JMeter展示北京时间，Prometheus展示UTC，运行记录使用Unix毫秒时间关联。')
para('每个逻辑线程执行一个HTTP采样器，连接超时2秒、响应超时5秒，关闭HTTP客户端重试。原生JTL保留实际请求时间、完整响应耗时、状态码、错误和线程名；正式JTL按请求启动时刻划窗。平均响应时间为正式窗口全部HTTP样本耗时的算术平均值；失败样本耗时和成功样本均值分别保存，错误率随均值一起解释。吞吐量使用正式窗口请求数除以20秒。')
para('查询固定INFO级别、2026年11月1日UTC 06:00至07:00、第一页20条，种子数据匹配2497条；写入使用相同字段与固定正文规则。两轮保持机器、请求、启动时间、超时和采样周期一致。JMeter堆384 MiB、线程栈256 KiB。')
head('3.2　逐级增加与转折排查',2)
para('从4400个线程、计划80次/秒开始，在相同启动时间内提高线程总数。响应仍快且无错时继续增加；平均响应超过基线10倍且达到50毫秒，或错误率超过1%时，进入转折排查。该判据用于选择细分与诊断档，最终转折结合整条均值曲线、错误和资源判断。转折附近增加中间档并复测发送失败的高档。预热阶段失效的运行保留中断证据；应用工作线程上限从200改为40后，两库再从低档逐级提高速率，连接池保持20。')
para('Prometheus每5秒采集主机与应用指标。Manager主机CPU包含JMeter和Prometheus，发压JVM的CPU、RSS与线程数另外按秒记录。检查整机及逐核CPU、负载均值、I/O等待、磁盘忙碌、可用内存、JVM堆、GC、活跃线程和文件描述符；MySQL另外检查Hikari活跃连接及等待。诊断档采集应用线程栈与数据库状态。CPU未满时，按这些证据检查资源等待和参数；CPU均值与某个资源是否饱和分别判断。')
para('发送修正前，对47次原始JTL逐档复核，22次未通过平台标准。普通线程组的Ramp-up存在后段加快启动现象。改用内置等间隔开放式计划，并精简每线程需要克隆的测试树；预试验在计划1620次/秒时，正式窗口各秒为1610至1630次，前后5秒均值一致。两库读写使用修正后的相同计划重新测量，旧版筛查清单保存在证据目录。')
head('3.3　接口与部署核验',2)
for b in ['mysql','mongo']:
 smoke=json.loads((R/'evidence'/f'{b}-smoke.json').read_text());para(f'{label(b)}通过{len(smoke["checks"])}项接口检查，覆盖状态码、字段、排序、分页、空结果、非法级别、超长正文和毫秒时间边界。')
for name,title in [('prometheus-targets.png','Prometheus采集目标'),('mysql-api.png','MySQL查询结果'),('mysql-api-post.png','MySQL写入结果'),('mongo-api.png','MongoDB查询结果'),('mongo-api-post.png','MongoDB写入结果')]:image(R/'screenshots'/name,title)
head('4　负载测试')
para('本节展示逐级探索中的正常负载和首次响应转折。图中叉号表示发送条件不合格，折线连接均匀发送的档位。主表先列平均响应时间，再列实际发送率、错误率与HPS范围；资源表用于观察随线程数增加的内部变化。每次运行独立恢复数据，正式窗口均为20秒。')
for op,title in [('read','查询'),('write','写入')]:
 head(('4.1　' if op=='read' else '4.2　')+title+'负载',2)
 ss=sorted([s for s in runs if s['operation']==op and s['purpose']=='exploration' and not s['generator_limit']],key=lambda s:(s['backend']!='mysql',s['target_rps'],s['start_ms']))
 table(['实现','线程总数','平均ms','实际HPS','错误率','HPS最小–最大','最大/最小'],[[label(s['backend']),s['threads'],f'{s["mean_ms"]:.2f}',fmt(s['throughput_rps']),f'{s["error_rate"]:.1%}',f'{s["hps_min"]}–{s["hps_max"]}',f'{s["hps_max_min_ratio"]:.3f}' if s['hps_max_min_ratio'] else '零秒分箱'] for s in ss],title+'逐级负载结果')
 image(O/'figures'/f'{op}-thread-progression.png',title+'线程数与平均响应时间、成功吞吐及错误率')
 for b in ['mysql','mongo']:
  image(O/'figures'/f'{b}-{op}-cpu-hps.png',label(b)+title+'的主机CPU与逐秒请求启动数')
  for hps_figure in sorted((O/'figures').glob(f'{b}-{op}-all-hps-*.png')):
   image(hps_figure,label(b)+title+'逐档Hits Per Second平台核验')
  bs=[s for s in ss if s['backend']==b];valid=[s for s in bs if not s['generator_limit']];normal=[s for s in valid if s['classification']=='load']
  if normal:
   last=normal[-1];para(f'{label(b)}{title}首次逐级探索中，{last["threads"]}线程档平均响应时间为{last["mean_ms"]:.2f} ms，实际启动{last["throughput_rps"]:.2f}次/秒，错误率{last["error_rate"]:.2%}，完整秒HPS为{last["hps_min"]}至{last["hps_max"]}。')
  for name in selected[f'{b}-{op}'][:2]:
   image(R/'screenshots'/f'{name}-hps-report.png',name+f'（工作线程{lookup[name].get("tomcat_max_threads",200)}）的Hits Per Second（每秒{lookup[name]["hps_min"]}–{lookup[name]["hps_max"]}次）')
   image(R/'screenshots'/f'{name}-native-pair.png',name+f'（工作线程{lookup[name].get("tomcat_max_threads",200)}）的响应趋势与百分位')
head('5　压力与转折分析')
for op,title in [('read','查询'),('write','写入')]:
 head(('5.1　' if op=='read' else '5.2　')+title+'转折与参数对照',2)
 ss=[s for s in runs if s['operation']==op and s['purpose']!='exploration']
 if ss:table(['实现','线程数','连接池','目的','平均ms','错误率','发送核验'],[[label(s['backend']),s['threads'],s['pool_size'],purpose.get(s['purpose'],s['purpose']),f'{s["mean_ms"]:.2f}',f'{s["error_rate"]:.1%}','失败' if s['generator_limit'] else '通过'] for s in ss],title+'细分、复测与恢复')
 for b in ['mysql','mongo']:
  bs=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration'];turn=next((s for s in bs if s['classification']=='stress'),None)
  if turn:
   prev=[s for s in bs if s['start_ms']<turn['start_ms']];prior=prev[-1] if prev else None
   para(f'{label(b)}{title}在{turn["threads"]}线程档平均响应达到{turn["mean_ms"]:.2f} ms'+(f'，前一档为{prior["mean_ms"]:.2f} ms' if prior else '')+f'；错误率{turn["error_rate"]:.2%}。应用与数据库CPU均值分别为{fmt(turn["cpu_percent"].get("application"))}%、{fmt(turn["cpu_percent"].get("database"))}%，应用机最少可用内存{fmt(metric(turn,"host_memory_available_mib","application","min"))} MiB。')
   if turn['errors']:
    error_names={'ConnectTimeoutException':'连接超时','SocketTimeoutException':'读取超时','HttpHostConnectException':'连接失败'}
    descriptions=[]
    for code,count in turn['response_codes'].items():
     short=next((v for k,v in error_names.items() if k in code),code)
     descriptions.append(f'{short}{count}次')
    para('该档失败记录为'+'、'.join(descriptions)+'。'+('正式窗口没有成功请求，平均值表示失败返回耗时。' if turn['successful_mean_ms'] is None else f'成功请求平均响应为{turn["successful_mean_ms"]:.2f} ms，全部样本均值同时包含失败返回耗时。'))
  limited=[s for s in bs if s['generator_limit']]
  for s in limited:para(f'{label(b)}{title}的{s["threads"]}线程档不满足发送条件：实际记录{s["all_http_samples"]}个HTTP请求，配置{s["threads"]}线程，完整秒HPS范围{s["hps_min"]}至{s["hps_max"]}。复测及两端日志按运行名列出。')
  checks=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose'] in ['boundary_confirmation','pool40_diagnosis','tomcat40_diagnosis']]
  if checks:table(['计划HPS','连接/工作线程','平均ms','应用/数据库CPU%','数据库逐核峰值%','数据库I/O等待%','连接等待峰值'],[[s['target_rps'],f"{s['pool_size']}/{s.get('tomcat_max_threads',200)}",f'{s["mean_ms"]:.2f}',fmt(s['cpu_percent'].get('application'))+'/'+fmt(s['cpu_percent'].get('database')),fmt(metric(s,'host_cpu_per_core','database')),fmt(metric(s,'host_iowait_percent','database')),fmt(metric(s,'hikari_pending')) if b=='mysql' else '见线程栈'] for s in checks],label(b)+title+'资源与连接池等待')
  names=selected[f'{b}-{op}'];name=names[2] if len(names)>2 else names[-1]
  if len(names)>2:
   image(R/'screenshots'/f'{name}-hps-report.png',name+f'（工作线程{lookup[name].get("tomcat_max_threads",200)}）的Hits Per Second（完整秒{lookup[name]["hps_min"]}–{lookup[name]["hps_max"]}次）')
   image(R/'screenshots'/f'{name}-native-pair.png',name+f'（工作线程{lookup[name].get("tomcat_max_threads",200)}）的响应趋势与百分位')
  image(R/'screenshots'/f'{name}-dashboard-report.png',name+f'（工作线程{lookup[name].get("tomcat_max_threads",200)}）的平均响应统计与请求饼图')
for b in ['mysql','mongo']:
 image(O/'figures'/f'{b}-read-diagnosis-timeline.png',label(b)+'查询逐次运行的响应退化、成功吞吐下降与恢复')
para('逐次运行图按真实执行顺序展示响应、成功吞吐及恢复。叉号标记发送不合格的运行，下行数字为计划每秒启动数。')
head('5.3　应用线程参数对照',2)
fixed=[s for s in runs if s['purpose']=='tomcat40_diagnosis']
if fixed:
 para('应用机内存为792 MiB。原配置Tomcat最大工作线程200，诊断将其改为40，保持连接池20、JVM堆256 MiB。两库使用同一等间隔发送计划，对照80、720、1080次/秒，并在发送稳定时继续提高速率；查询在转折附近细分档位，出现明显退化或发送失败时停止该链路。')
 table(['实现/操作','计划HPS','平均ms','错误率','HPS范围','平台核验','测后健康'],[[label(s['backend'])+'/'+('查询' if s['operation']=='read' else '写入'),s['target_rps'],f'{s["mean_ms"]:.2f}',f'{s["error_rate"]:.1%}',f'{s["hps_min"]}–{s["hps_max"]}','通过' if s['hps_quality']['passed'] else '失败','UP' if s['healthy_after'] else '未响应'] for s in fixed],'Tomcat工作线程上限40的对照结果')
 for b in ['mysql','mongo']:
  old=next((s for s in runs if s['backend']==b and s['operation']=='read' and s['purpose']=='exploration' and (s['generator_limit'] or s['severe_degradation'])),None)
  new=next((s for s in fixed if old and s['backend']==b and s['operation']=='read' and s['target_rps']==old['target_rps'] and not s['generator_limit']),None)
  if new:
   before=f'原配置HPS通过核验，错误率{old["error_rate"]:.1%}' if not old['generator_limit'] else f'原配置HPS为{old["hps_min"]}至{old["hps_max"]}，未通过发送核验'
   para(f'{label(b)}查询同为{new["target_rps"]}次/秒时，{before}；工作线程上限40时，HPS为{new["hps_min"]}至{new["hps_max"]}，错误率{new["error_rate"]:.1%}，成功请求平均响应{fmt(new["successful_mean_ms"])} ms。原配置失效时的内核与应用日志列于故障记录。')
 for op,title in [('read','查询'),('write','写入')]:
  image(O/'figures'/f'{op}-tomcat40-progression.png',title+'在Tomcat工作线程上限40时的逐级响应与错误率')
 for key,names in selected.items():
  if len(names)>3:
   name=names[3];image(R/'screenshots'/f'{name}-hps-report.png',name+f'的Hits Per Second（每秒{lookup[name]["hps_min"]}–{lookup[name]["hps_max"]}次）')
   image(R/'screenshots'/f'{name}-native-pair.png',name+f'（工作线程{lookup[name].get("tomcat_max_threads",200)}）的响应趋势与百分位')
pool_checks=[s for s in runs if s['purpose']=='pool40_diagnosis' and s['target_rps']==1200]
if pool_checks:
 para('查询在1200次/秒出现响应转折后，固定Tomcat最大工作线程40，将数据库连接池从20改为40，对照相同查询与发送速率。随后恢复连接池20，以80次/秒检查服务恢复。每档重新初始化10万条记录并执行相同预热。')
 comparison=[]
 for b in ['mysql','mongo']:
  baseline=next((s for s in fixed if s['backend']==b and s['operation']=='read' and s['target_rps']==1200),None)
  changed=next((s for s in pool_checks if s['backend']==b),None)
  for s in [baseline,changed]:
   if s:comparison.append([label(b),s['pool_size'],f'{s["mean_ms"]:.2f}',f'{s["error_rate"]:.2%}',f'{s["hps_min"]}–{s["hps_max"]}',fmt(s['cpu_percent'].get('database')),fmt(metric(s,'hikari_pending')) if b=='mysql' else '—','失败' if s['generator_limit'] else '通过'])
  if baseline and changed and not baseline['generator_limit'] and not changed['generator_limit']:
   para(f'{label(b)}在连接池20与40时，平均响应分别为{baseline["mean_ms"]:.2f}与{changed["mean_ms"]:.2f} ms，错误率为{baseline["error_rate"]:.2%}与{changed["error_rate"]:.2%}，数据库CPU均值为{fmt(baseline["cpu_percent"].get("database"))}%与{fmt(changed["cpu_percent"].get("database"))}%。'+('连接等待峰值为'+fmt(metric(baseline,'hikari_pending'))+'与'+fmt(metric(changed,'hikari_pending'))+'。' if b=='mysql' else '')+('扩大连接池后响应仍超过50毫秒，连接数增加未消除该档转折。' if changed['mean_ms']>50 else '扩大连接池后该档平均响应低于50毫秒，连接池参数影响了原转折表现。'))
 table(['实现','连接池','平均ms','错误率','HPS范围','数据库CPU%','连接等待峰值','发送核验'],comparison,'1200次/秒查询的连接池20与40对照')
 para('参数对照采用独立重启与相同预热；平均响应与逐次资源记录一起解释，发送平台失败的结果单列。')
head('5.4　资源与故障证据',2)
para('1200次/秒的连接池40对照在两库均于预热阶段中断。压测端记录pthread_create失败（EAGAIN）及无法启动本地线程，正式窗口样本为零。因此连接池20与40在该速率下的性能差异尚无有效对照数据。恢复连接池20后，80次/秒查询分别为MySQL 6.37 ms、MongoDB 5.34 ms，均零错误且每秒80次。')
aborted_path=R/'results/aborted-runs.json'
if aborted_path.exists():
 aborted=json.loads(aborted_path.read_text())
 if aborted:
  table(['运行','计划HPS','已发请求','正式样本','JMeter退出码'],[[s['name'],s['target_rps'],s['http_samples'],s['formal_samples'],s['exit_code']] for s in aborted],'预热阶段中断的复测记录')
  para('这些运行在正式窗口开始前中断，保留完整JTL、JMX、压测端日志和可取得的服务端日志。早期容器移除后无法补取的应用日志标记为缺失。表中正式样本数为零，平均响应和吞吐比较使用其余完成正式窗口且发送合格的档位。')
for b in ['mysql','mongo']:
 for op,title in [('read','查询'),('write','写入')]:
  for hps_figure in sorted((O/'figures').glob(f'{b}-{op}-failed-hps-*.png')):
   image(hps_figure,label(b)+title+'发送不合格档的复测与排查记录')
para('平均响应上升后，主机CPU均值用于描述总体忙碌程度，逐核CPU、I/O等待和连接池等待用于定位局部限制。本轮先将Tomcat工作线程上限200改为40，连接池保持20，再于1200次/秒对照连接池20与40；各档经过相同预热，结果结合线程与数据库状态解释。每档监控原始序列、诊断快照、应用日志与内核日志按运行名保存。')
turns=[s for s in runs if s['classification']=='stress' and not s['generator_limit']]
if turns:
 table(['实现/操作','应用CPU%','数据库CPU%','可用内存MiB','应用发送MiB/s','TCP重传/s'],[[label(s['backend'])+'/'+s['operation']+'/'+str(s['target_rps'])+'('+str(s.get('tomcat_max_threads',200))+'/'+str(s['pool_size'])+')',fmt(s['cpu_percent'].get('application')),fmt(s['cpu_percent'].get('database')),fmt(metric(s,'host_memory_available_mib','application','min')),(fmt(metric(s,'network_transmit_bytes_per_second','application')/1024/1024) if metric(s,'network_transmit_bytes_per_second','application') is not None else '—'),fmt(metric(s,'tcp_retransmits_per_second','monitor'))] for s in turns],'发送合格的响应转折资源记录')
 para('网络吞吐、TCP重传、应用线程、可用内存与连接等待按同一正式窗口核对。主机CPU均值描述总体忙碌程度，局部资源与等待指标用于分析响应变慢的原因。')
for name,title in [('thread-prometheus-cpu-report.png','原配置查询失效附近的主机CPU'),('thread-prometheus-memory-report.png','原配置查询失效附近的主机可用内存'),('thread-prometheus-corrected-cpu-report.png','工作线程40时查询转折附近的主机CPU'),('thread-prometheus-hikari-report.png','工作线程40时MySQL查询的连接占用与等待'),('thread-prometheus-mongo-cpu-report.png','工作线程40时MongoDB查询在1080与1200次/秒的主机CPU')]:image(R/'screenshots'/name,title)
faults=[]
for s in runs:
 d=R/'results/runs'/s['name'];kernel=(d/'kernel.log').read_text();log=(d/'application.log').read_text()
 causes=[]
 if 'Out of memory: Kill process' in kernel or 'oom-kill' in kernel:causes.append('内核OOM记录')
 if 'Native memory allocation' in log or 'failed to map' in log:causes.append('JVM本地内存分配失败')
 if '/usr/lib/go-' in log and 'fatal error: out of memory' in log:causes.append('Docker日志采集进程内存失败')
 if causes:
  timing='采集阶段' if '/usr/lib/go-' in log else '见原日志'
  killed=next((line for line in kernel.splitlines() if 'Killed process' in line and '(java)' in line),None)
  if killed:
   at=datetime.datetime.fromisoformat(killed.split()[0]).timestamp()*1000
   timing=f'窗口后{(at-s["measurement_end_ms"])/1000:.0f}秒' if at>=s['measurement_end_ms'] else '正式窗口内' if at>=s['measurement_start_ms'] else '预热期'
  faults.append([s['name'],'、'.join(causes),timing,f'{s["error_rate"]:.1%}'])
if faults:
 table(['运行','日志证据','故障时序','错误率'],faults,'退化运行的故障记录')
 para('内核Killed process记录给出被终止的Java进程及时间，表中按正式窗口标注故障时序。应用失效期间，Actuator和主机采集也可能超时；缺失的CPU点按缺测处理。应用机内存耗尽时，数据库CPU下降与应用停止处理请求相对应。')
else:para('本轮保存的应用与内核日志未记录上述OOM或JVM本地内存分配失败事件；具体等待状态见诊断快照与线程栈。')
diffs=[s for s in runs if s['write_count_difference']]
if diffs:table(['运行','成功响应','记录增长','差额'],[[s['name'],s['all_success'],s['records_after']-100000,s['write_count_difference']] for s in diffs], '写入记录数核对')
else:para('全部写入运行的数据库记录增长与完整JTL成功响应数一致。')
para('若客户端超时后数据库仍完成提交，记录增长会大于成功响应数；逐次差额与原始请求一并保留。正式统计使用中间20秒，记录增长核对使用整档HTTP请求。JMeter原生吞吐量按样本起止跨度计算，汇总表按固定20秒计算，分母分别记录。')
head('5.5　两条链路的共同负载比较',2)
for op,title in [('read','查询'),('write','写入')]:
 corrected={b:{s['target_rps']:s for s in fixed if s['backend']==b and s['operation']==op and not s['generator_limit'] and s['errors']==0} for b in ['mysql','mongo']}
 shared=sorted(set(corrected['mysql'])&set(corrected['mongo']))
 if shared:
  table(['计划HPS','MySQL平均ms','MongoDB平均ms','MySQL实际HPS','MongoDB实际HPS'],[[rate,f'{corrected["mysql"][rate]["mean_ms"]:.2f}',f'{corrected["mongo"][rate]["mean_ms"]:.2f}',fmt(corrected['mysql'][rate]['throughput_rps']),fmt(corrected['mongo'][rate]['throughput_rps'])] for rate in shared],title+'在工作线程上限40时的共同合格负载')
for op,title in [('read','查询'),('write','写入')]:
 grouped={b:{s['threads']:s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration' and s['classification']=='load' and s['errors']==0} for b in ['mysql','mongo']}
 common=sorted(set(grouped['mysql'])&set(grouped['mongo']))
 if common:
  n=common[-1];m=grouped['mysql'][n];g=grouped['mongo'][n]
  para(f'两库共同完成且均匀发送、零错误的{title}最高共同档位为{n}线程。MySQL平均响应{m["mean_ms"]:.2f} ms，MongoDB为{g["mean_ms"]:.2f} ms；实际启动率分别为{m["throughput_rps"]:.2f}和{g["throughput_rps"]:.2f}次/秒。')
  table(['总线程数','MySQL平均ms','MongoDB平均ms','MySQL错误率','MongoDB错误率'],[[n,f'{grouped["mysql"][n]["mean_ms"]:.2f}',f'{grouped["mongo"][n]["mean_ms"]:.2f}',f'{grouped["mysql"][n]["error_rate"]:.1%}',f'{grouped["mongo"][n]["error_rate"]:.1%}'] for n in common],title+'共同正常负载档位')
para('读写分别比较相同线程档位与实际启动率。首次响应转折、重启后的复测和参数修正分别列出，数据库性能结论同时结合错误率与应用资源状态。写入在发送端先达到不均匀条件时，容量结论止于最后一个合格档位。')
head('6　总结')
for op,title in [('read','查询'),('write','写入')]:
 corrected={b:{s['target_rps']:s for s in fixed if s['backend']==b and s['operation']==op and not s['generator_limit'] and s['errors']==0} for b in ['mysql','mongo']}
 shared=sorted(set(corrected['mysql'])&set(corrected['mongo']))
 if shared:
  rate=shared[-1];m=corrected['mysql'][rate];g=corrected['mongo'][rate]
  para(f'工作线程上限40的{title}对照中，两库共同完成且零错误、发送均匀的最高共同档为{rate}次/秒。MySQL平均响应{m["mean_ms"]:.2f} ms，MongoDB为{g["mean_ms"]:.2f} ms。')
for op,title in [('read','查询'),('write','写入')]:
 for b in ['mysql','mongo']:
  ss=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration' and not s['generator_limit'] and s['classification']=='load']
  if ss:
   s=ss[-1];para(f'{label(b)}{title}首次逐级探索中的最高正常负载档为{s["threads"]}个单次请求线程，平均响应时间{s["mean_ms"]:.2f} ms，实际启动{s["throughput_rps"]:.2f}次/秒，错误率{s["error_rate"]:.2%}。')
para(f'实验以平均响应时间组织负载曲线，逐步增加线程总数，并用完整秒HPS检查发送均匀性。共保留{len(runs)}次运行、{N:,}次正式样本及{E:,}次错误。转折附近的细分、工作线程对照和资源采样分别保存，结论对应本轮固定数据、查询条件和机器配置。四项RBAC服务已恢复原副本数。')
head('参考文献')
for t in ['[1] Apache JMeter. User Manual: Open Model Thread Group. https://jmeter.apache.org/usermanual/component_reference.html#Open_Model_Thread_Group.','[2] Apache JMeter. Dashboard Reports. https://jmeter.apache.org/usermanual/generating-dashboard.html.','[3] Spring. Spring Data JPA Reference Documentation. https://docs.spring.io/spring-data/jpa/reference/.','[4] Spring. Spring Data MongoDB Reference Documentation. https://docs.spring.io/spring-data/mongodb/reference/.','[5] Prometheus. Querying basics. https://prometheus.io/docs/prometheus/latest/querying/basics/.']:para(t)
references=[pp for pp in D.paragraphs if re.match(r'^\[[1-5]\] ',pp.text)]
for i,pp in enumerate(references):
 pp.paragraph_format.first_line_indent=Pt(0);pp.paragraph_format.line_spacing=Pt(11);pp.paragraph_format.space_after=Pt(3);pp.paragraph_format.keep_with_next=i<len(references)-1
 for rr in pp.runs:rr.font.size=Pt(8)
# Preserve the sample's type roles in the rebuilt report.
for name in ['Title','Heading 1','Heading 2','Heading 3']:
 D.styles[name]._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Heiti SC')
for pp in D.paragraphs:
 if pp.text.startswith(('摘　要：','关键词：','Abstract:','Key words:')) or pp.text in ['温子健','CHIKIN WEN','Log Read and Write Performance of MySQL and MongoDB']:
  pp.paragraph_format.first_line_indent=Pt(0)
 if pp.text.startswith(('摘　要：','关键词：')):
  for rr in pp.runs:rr._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Kaiti SC')
 if pp.text.startswith(('Abstract:','Key words:')):
  pp.paragraph_format.line_spacing=Pt(12)
  for rr in pp.runs:rr.font.size=Pt(7.45)
 if pp.text=='温子健':
  for rr in pp.runs:rr.font.size=Pt(12);rr._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'STFangsong')
 if pp.text=='Log Read and Write Performance of MySQL and MongoDB':
  for rr in pp.runs:rr.font.size=Pt(10.45);rr.bold=True
for rf in D.styles.element.iter(qn('w:rFonts')):
 for attr in list(rf.attrib):
  if 'theme' in attr.lower():del rf.attrib[attr]
 rf.set(qn('w:ascii'),'Times New Roman');rf.set(qn('w:hAnsi'),'Times New Roman')
for node in list(D.styles.element.iter(qn('w:pBdr'))):node.getparent().remove(node)
D.core_properties.author='温子健';D.core_properties.title='MySQL 与 MongoDB 日志读写性能对比'
D.save(O/'实验四实验报告.docx');(O/'实验四实验报告.md').write_text('\n'.join(md));print('Built',len(runs),'runs',fig,'figures',tab,'tables')
