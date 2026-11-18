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
 if path.name.endswith('-native-pair.png'):width=118
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
    if len(t.rows)<=12:pp.paragraph_format.keep_with_next=ri<len(t.rows)-1
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
purpose={'exploration':'逐级负载','boundary_refinement':'转折细分','boundary_confirmation':'转折复测','pool40_diagnosis':'连接池40对照','recovery_confirmation':'恢复确认','tomcat40_diagnosis':'Tomcat40对照'}
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
para('MySQL 与 MongoDB 日志读写性能对比','Title');para('温子健')
para(f'摘　要：本文以平均响应时间为主指标，比较Spring Data JPA/MySQL与Spring Data MongoDB/MongoDB的日志读写性能。四台服务器分两轮复用，Manager使用JMeter发压，每个线程只执行一次HTTP请求，在固定35秒内逐个启动线程，逐级增加线程总数。每档恢复10万条初始数据，以中间20秒的完整秒计数检查发送均匀性。平均响应时间明显上升后，细分相邻档位并检查CPU、内存、磁盘、GC、连接池等待与线程状态。{abstract_result}共完成{len(runs)}次运行，正式窗口记录{N:,}次请求。逐次JTL、原生JMeter页面及Prometheus资源记录共同支持负载转折和参数对照分析。')
para('关键词：MySQL；MongoDB；平均响应时间；负载测试；JMeter；Prometheus')
para('Log Read and Write Performance of MySQL and MongoDB');para('CHIKIN WEN')
para(f'Abstract: This experiment compares JPA/MySQL and Spring Data MongoDB using mean HTTP response time as the primary metric. Four servers are reused in two rounds. JMeter on Manager starts each thread once within a fixed 35-second ramp, and each thread sends one request. Total thread counts increase progressively. Each run resets 100,000 logs and measures the middle 20 seconds. Per-second starts verify traffic uniformity. A marked rise in mean response time triggers finer testing and inspection of CPU, memory, disk activity, GC, connection-pool waits and thread states. {english_result}The {len(runs)} runs contain {N:,} measured requests. Native JMeter reports and Prometheus records support the load and parameter analysis.')
para('Key words: MySQL; MongoDB; mean response time; load testing; JMeter; Prometheus')
head('1　问题描述')
para('日志服务写入单条事件，并按级别与时间分页查询。实验首先逐级增加线程数，观察平均响应时间与资源占用的变化；响应明显变慢后进入压力分析，检查资源饱和、排队与配置的关系。吞吐量、错误率和响应时间分位数作为辅助指标。')
head('2　实验环境与实现')
table(['主机','配置','任务'],[['Compiler','2核，792 MiB','Java 17、Maven构建'],['Node1','2核，1800 MiB','MySQL 8.4.13 / MongoDB 7.0.16'],['Node2','2核，792 MiB','Spring Boot 3.3.13，堆256 MiB'],['Manager','2核，1800 MiB','JMeter 5.6.3发压、Prometheus 3.7.3']], '四台机器分两轮复用')
para('第一轮运行MySQL与JPA实现，第二轮运行MongoDB与Spring Data MongoDB实现。数据库和应用各占一台机器，Manager全程发压并采集监控，Compiler负责构建。两轮使用同一应用JAR。数据库缓存约256 MiB、容器上限1 GiB；应用堆256 MiB、容器上限560 MiB，基础连接池20。MySQL每次提交刷盘并关闭binlog；MongoDB单机w=1、journal=true。压测期间暂停共用资源的四项RBAC服务，结束后恢复原副本数。')
para('公共字段为id、traceId、level、source、message、clientIp、createdAt；服务端生成26位ULID，UTC时间精确到毫秒，正文最多4096字符。POST返回201与保存对象；GET使用[from,to)时间范围、从0开始分页，按createdAt、id降序，返回当前页和匹配总数。两库建立level、createdAt、id联合索引。Java代码按Google Java Style排版，中文注释说明查询与字段语义。')
head('3　实验设计')
head('3.1　每线程一次请求与均匀启动',2)
para('JMeter使用5个相同的普通线程组平分线程总数，各组的循环次数固定为1，调度器关闭，Ramp-up固定35秒，启用delayedStart以在需要时创建线程。每档只增加线程总数，读写分别测试。线程总数除以35给出计划平均启动率，实际启动数以JTL时间戳核对。线程总数表示整档累计启动的线程数量，同时活跃线程数由响应时间决定，两者分别记录。')
para('每档前恢复10万条固定种子日志，前10秒用于应用与JMeter预热，正式窗口取时钟起点后10至30秒；最后5秒保持发送，以避开结束边界。窗口内按相对起点切分20个完整秒。HPS最大/最小比达到2或出现零启动秒时，该档不满足发送均匀性要求；线程缺失、发压器异常或实际速率明显偏离计划也单列为发压限制。原生页面采用墙钟整秒分箱，图首尾的不足一秒分箱与完整秒核验值分别解释。JMeter页面展示北京时间，Prometheus页面展示UTC；逐次记录使用Unix毫秒时间对应两者。')
para('每个线程执行一个HTTP采样器，连接超时2秒、响应超时5秒，关闭HTTP客户端重试。原生JTL保留实际请求时间、完整响应耗时、状态码、错误和线程名；正式JTL按请求启动时刻划窗。平均响应时间为正式窗口全部HTTP样本耗时的算术平均值；失败样本耗时和成功样本均值分别保存，错误率随均值一起解释。吞吐量使用正式窗口请求数除以20秒。')
para('查询固定INFO级别、2026年11月1日UTC 06:00至07:00、第一页20条，种子数据匹配2497条；写入使用相同字段与固定正文规则。两轮保持机器、请求、启动时间、超时和采样周期一致。JMeter堆384 MiB、线程栈256 KiB。')
head('3.2　逐级增加与转折排查',2)
para('从2800个线程开始，在相同启动时间内提高线程总数。响应仍快且无错时继续增加；平均响应超过基线10倍且达到50毫秒，或错误率超过1%时，进入转折排查。该判据用于选择细分与诊断档，最终转折结合整条均值曲线、错误和资源判断。转折前后增加中间线程档，复测原转折档，再将连接池从20改为40作单参数对照，最后恢复连接池20并检查低负载。')
para('Prometheus每5秒采集主机与应用指标。Manager主机CPU包含JMeter和Prometheus，发压JVM的CPU、RSS与线程数另外按秒记录。检查整机及逐核CPU、负载均值、I/O等待、磁盘忙碌、可用内存、JVM堆、GC、活跃线程和文件描述符；MySQL另外检查Hikari活跃连接及等待。诊断档采集应用线程栈与数据库状态。CPU未满时，按这些证据检查资源等待和参数；CPU均值与某个资源是否饱和分别判断。')
para('预试验发现，未启用delayedStart时JMeter提前创建大量等待线程，5600线程档出现pthread_create EAGAIN，实际请求数量少于配置线程数。启用按需创建并将线程均分到5组后重新执行正式测试；预试验日志与参数修正保存在evidence/generator-preflight，正式结果按新的JMX重新采集。')
head('3.3　接口与部署核验',2)
for b in ['mysql','mongo']:
 smoke=json.loads((R/'evidence'/f'{b}-smoke.json').read_text());para(f'{label(b)}通过{len(smoke["checks"])}项接口检查，覆盖状态码、字段、排序、分页、空结果、非法级别、超长正文和毫秒时间边界。')
for name,title in [('prometheus-targets.png','Prometheus采集目标'),('mysql-api.png','MySQL查询结果'),('mysql-api-post.png','MySQL写入结果'),('mongo-api.png','MongoDB查询结果'),('mongo-api-post.png','MongoDB写入结果')]:image(R/'screenshots'/name,title)
head('4　负载测试')
para('本节展示逐级探索中的正常负载和首次响应转折。图中叉号表示发送条件不合格，折线连接均匀发送的档位。主表先列平均响应时间，再列实际发送率、错误率与HPS范围；资源表用于观察随线程数增加的内部变化。每次运行独立恢复数据，正式窗口均为20秒。')
for op,title in [('read','查询'),('write','写入')]:
 head(('4.1　' if op=='read' else '4.2　')+title+'负载',2)
 ss=[s for s in runs if s['operation']==op and s['purpose']=='exploration']
 table(['实现','线程总数','平均ms','实际HPS','错误率','HPS最小–最大','最大/最小'],[[label(s['backend']),s['threads'],f'{s["mean_ms"]:.2f}',fmt(s['throughput_rps']),f'{s["error_rate"]:.1%}',f'{s["hps_min"]}–{s["hps_max"]}',f'{s["hps_max_min_ratio"]:.3f}' if s['hps_max_min_ratio'] else '零秒分箱'] for s in ss],title+'逐级负载结果')
 image(O/'figures'/f'{op}-thread-progression.png',title+'线程数与平均响应时间、成功吞吐及错误率')
 for b in ['mysql','mongo']:
  image(O/'figures'/f'{b}-{op}-cpu-hps.png',label(b)+title+'的主机CPU与逐秒请求启动数')
  bs=[s for s in ss if s['backend']==b];valid=[s for s in bs if not s['generator_limit']];normal=[s for s in valid if s['classification']=='load']
  if normal:
   last=normal[-1];para(f'{label(b)}{title}首次逐级探索中，{last["threads"]}线程档平均响应时间为{last["mean_ms"]:.2f} ms，实际启动{last["throughput_rps"]:.2f}次/秒，错误率{last["error_rate"]:.2%}，完整秒HPS为{last["hps_min"]}至{last["hps_max"]}。')
  for name in selected[f'{b}-{op}'][:2]:image(R/'screenshots'/f'{name}-native-pair.png',name+'的响应趋势与百分位')
head('5　压力与转折分析')
for op,title in [('read','查询'),('write','写入')]:
 head(('5.1　' if op=='read' else '5.2　')+title+'转折与参数对照',2)
 ss=[s for s in runs if s['operation']==op and s['purpose']!='exploration']
 if ss:table(['实现','线程数','连接池','目的','平均ms','错误率'],[[label(s['backend']),s['threads'],s['pool_size'],purpose.get(s['purpose'],s['purpose']),f'{s["mean_ms"]:.2f}',f'{s["error_rate"]:.1%}'] for s in ss],title+'细分、复测与恢复')
 for b in ['mysql','mongo']:
  bs=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration'];turn=next((s for s in bs if s['classification']=='stress'),None)
  if turn:
   prev=[s for s in bs if s['start_ms']<turn['start_ms']];prior=prev[-1] if prev else None
   para(f'{label(b)}{title}在{turn["threads"]}线程档平均响应达到{turn["mean_ms"]:.2f} ms'+(f'，前一档为{prior["mean_ms"]:.2f} ms' if prior else '')+f'；错误率{turn["error_rate"]:.2%}。应用与数据库CPU均值分别为{fmt(turn["cpu_percent"].get("application"))}%、{fmt(turn["cpu_percent"].get("database"))}%，应用机最少可用内存{fmt(metric(turn,"host_memory_available_mib","application","min"))} MiB。')
  limited=[s for s in bs if s['generator_limit']]
  for s in limited:para(f'{label(b)}{title}的{s["threads"]}线程档不满足发送条件：实际记录{s["all_http_samples"]}个HTTP请求，配置{s["threads"]}线程，完整秒HPS范围{s["hps_min"]}至{s["hps_max"]}。该档保留用于排查发送条件，性能比较使用均匀发送的档位。该标记依据实际发送结果，故障来源再结合两端日志判断。')
  checks=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose'] in ['boundary_confirmation','pool40_diagnosis','tomcat40_diagnosis']]
  if checks:table(['连接池/工作线程','平均ms','应用CPU%','逐核CPU峰值%','I/O等待峰值%','连接等待峰值'],[[f"{s['pool_size']}/{s.get('tomcat_max_threads',200)}",f'{s["mean_ms"]:.2f}',fmt(s['cpu_percent'].get('application')),fmt(metric(s,'host_cpu_per_core','application')),fmt(metric(s,'host_iowait_percent','database')),fmt(metric(s,'hikari_pending')) if b=='mysql' else '见线程栈'] for s in checks],label(b)+title+'资源与连接池等待')
  names=selected[f'{b}-{op}'];name=names[2] if len(names)>2 else names[-1]
  if len(names)>2:image(R/'screenshots'/f'{name}-native-pair.png',name+'的响应趋势与百分位')
  image(R/'screenshots'/f'{name}-dashboard-report.png',name+'的平均响应统计与请求饼图')
for b in ['mysql','mongo']:
 image(O/'figures'/f'{b}-read-diagnosis-timeline.png',label(b)+'查询逐次运行的响应退化、成功吞吐下降与恢复')
para('逐次运行图保留转折后的故障复现：MySQL查询细分档的成功吞吐降至0，MongoDB查询细分档也降至0；两者低负载恢复后重新成功响应。叉号对应发送不均匀的故障运行，其作用是呈现下降和恢复过程，数据库容量比较使用前节合格档位。横轴按该实现查询运行的时间顺序排列，下行数字为计划每秒启动数。')
head('5.3　应用线程参数修正',2)
para('MySQL查询首次转折运行中，应用Java线程数由64增至223，RSS由约276 MiB增至373 MiB；正式窗口结束后约15秒，内核杀死Java进程。连接池等待采样为0，扩大连接池后的运行仍严重退化。随后将Tomcat最大工作线程由默认200改为40，连接池保持20、JVM堆保持256 MiB，两库采用同一修正参数，分别检查低负载及720、1080次/秒附近的表现。')
fixed=[s for s in runs if s['purpose']=='tomcat40_diagnosis']
if fixed:
 table(['实现/操作','线程总数','平均ms','错误率','HPS比','测后健康'],[[label(s['backend'])+'/'+('查询' if s['operation']=='read' else '写入'),s['threads'],f'{s["mean_ms"]:.2f}',f'{s["error_rate"]:.1%}',fmt(s['hps_max_min_ratio']),'UP' if s['healthy_after'] else '未响应'] for s in fixed],'Tomcat最大工作线程40的对照结果')
 para('对照通过限制应用端同时处理的工作线程，检查小内存主机的内存与排队变化。每次对照的实际发送均匀性仍单独核对；HPS不合格的运行用于诊断。')
for b in ['mysql','mongo']:
 original=next((s for s in runs if s['backend']==b and s['operation']=='read' and s['threads']==37800 and s['purpose']=='exploration'),None)
 revised=next((s for s in runs if s['backend']==b and s['operation']=='read' and s['threads']==37800 and s['purpose']=='tomcat40_diagnosis'),None)
 if original and revised:
  para(f'{label(b)}查询在37800线程档，原配置平均{original["mean_ms"]:.2f} ms、错误率{original["error_rate"]:.2%}；工作线程上限40的对照为{revised["mean_ms"]:.2f} ms、错误率{revised["error_rate"]:.2%}。对照结束后的健康检查为'+('UP。' if revised['healthy_after'] else '未响应。'))
para('线程上限40将应用工作线程数量约束在较小范围；正式窗口的Java总线程数、RSS、连接等待和网络数据用于检查这一变化。原配置探索与参数对照的前序压测历史不同，表中保留各次运行与测后健康状态。高负载下响应仍显著延长，较低工作线程上限改善了本次观察中的平均响应，持续过载仍需按压力状态处理。')
for key,names in selected.items():
 if len(names)>3:
  name=names[3];image(R/'screenshots'/f'{name}-native-pair.png',label(lookup[name]['backend'])+('查询' if lookup[name]['operation']=='read' else '写入')+'在线程上限40时的响应趋势与百分位')
head('5.4　资源与故障证据',2)
para('平均响应上升后，主机CPU均值用于描述总体忙碌程度，逐核CPU、I/O等待和连接池等待用于定位局部限制。连接池20与40的诊断档均经过应用重启和相同预热，逐次结果列出；短时对照中的差异结合线程与数据库状态解释。每档监控原始序列、诊断快照、应用日志与内核日志按运行名保存。')
turns=[s for s in runs if s['purpose']=='exploration' and s['classification']=='stress']
if turns:
 table(['实现/操作','应用CPU%','数据库CPU%','可用内存MiB','应用发送MiB/s','TCP重传/s'],[[label(s['backend'])+'/'+s['operation'],fmt(s['cpu_percent'].get('application')),fmt(s['cpu_percent'].get('database')),fmt(metric(s,'host_memory_available_mib','application','min')),fmt((metric(s,'network_transmit_bytes_per_second','application') or 0)/1024/1024),fmt(metric(s,'tcp_retransmits_per_second','monitor'))] for s in turns],'首次响应转折的资源记录')
 para('查询转折附近，应用发送流量约10 MiB/s，Manager同时出现TCP重传。网络吞吐、线程数增长与内存紧张共同保留为排查证据；主机CPU均值单独不足以确定退化来源。Tomcat工作线程对照用于检查并发处理数量与内存、响应的关系。')
for name,title in [('thread-prometheus-cpu.png','转折附近的主机CPU'),('thread-prometheus-memory.png','转折附近的主机可用内存')]:image(R/'screenshots'/name,title)
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
if faults:table(['运行','日志证据','故障时序','错误率'],faults,'退化运行的故障记录')
else:para('本轮保存的应用与内核日志未记录上述OOM或JVM本地内存分配失败事件；具体等待状态见诊断快照与线程栈。')
diffs=[s for s in runs if s['write_count_difference']]
if diffs:table(['运行','成功响应','记录增长','差额'],[[s['name'],s['all_success'],s['records_after']-100000,s['write_count_difference']] for s in diffs], '写入记录数核对')
else:para('全部写入运行的数据库记录增长与完整JTL成功响应数一致。')
para('若客户端超时后数据库仍完成提交，记录增长会大于成功响应数；逐次差额与原始请求一并保留。正式统计使用中间20秒，记录增长核对使用整档HTTP请求。JMeter原生吞吐量按样本起止跨度计算，汇总表按固定20秒计算，分母分别记录。')
head('5.5　两条链路的共同负载比较',2)
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
 for b in ['mysql','mongo']:
  ss=[s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration' and not s['generator_limit'] and s['classification']=='load']
  if ss:
   s=ss[-1];para(f'{label(b)}{title}首次逐级探索中的最高正常负载档为{s["threads"]}个单次请求线程，平均响应时间{s["mean_ms"]:.2f} ms，实际启动{s["throughput_rps"]:.2f}次/秒，错误率{s["error_rate"]:.2%}。')
para(f'实验以平均响应时间组织负载曲线，逐步增加线程总数，并用完整秒HPS检查发送均匀性。共保留{len(runs)}次运行、{N:,}次正式样本及{E:,}次错误。转折附近的细分、连接池对照和资源采样分别保存，结论对应本轮固定数据、查询条件和机器配置。四项RBAC服务已恢复原副本数。')
head('参考文献')
for t in ['[1] Apache JMeter. User Manual: Thread Group. https://jmeter.apache.org/usermanual/component_reference.html#Thread_Group.','[2] Apache JMeter. Dashboard Reports. https://jmeter.apache.org/usermanual/generating-dashboard.html.','[3] Spring. Spring Data JPA Reference Documentation. https://docs.spring.io/spring-data/jpa/reference/.','[4] Spring. Spring Data MongoDB Reference Documentation. https://docs.spring.io/spring-data/mongodb/reference/.','[5] Prometheus. Querying basics. https://prometheus.io/docs/prometheus/latest/querying/basics/.']:para(t)
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
