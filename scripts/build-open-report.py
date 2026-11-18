"""Build the report from observed progressive measurements and native screenshots."""
from pathlib import Path
import argparse,json,statistics,datetime
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
 if not path.exists():return
 if path.name.endswith('-native-pair.png'):width=118
 fig+=1;x=D.add_paragraph();x.paragraph_format.line_spacing=1.0;x.paragraph_format.first_line_indent=Pt(0);x.paragraph_format.keep_with_next=True;x.alignment=WD_ALIGN_PARAGRAPH.CENTER;x.add_run().add_picture(str(path),width=Mm(width));x=D.add_paragraph(f'图{fig}　{caption}','Caption');x.alignment=WD_ALIGN_PARAGRAPH.CENTER;md.append(f'![图{fig} {caption}]({path.relative_to(O) if path.is_relative_to(O) else "../"+str(path.relative_to(R))})\n')
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
para('MySQL 与 MongoDB 日志读写性能对比','Title');para('温子健')
para(f'摘　要：本文采用相同日志模型与REST接口，对比Spring Data JPA/MySQL和Spring Data MongoDB/MongoDB。四台服务器分两轮复用数据库与应用，全部负载由Manager发起。开放式调度按固定间隔启动请求，响应变慢时继续维持目标到达率，以实际启动数、发送数、完成数和在途数区分输入与处理能力。每档恢复10万条初始日志，预热10秒、测量25秒，依据延迟、成功吞吐与错误逐级提高请求率。共完成{len(runs)}次探索与复测，正式窗口记录{N:,}次请求、{E:,}次错误。逐秒数据、JMeter原生报告和Prometheus指标共同呈现稳定负载、排队、失效及恢复。')
para('关键词：MySQL；MongoDB；开放式负载；固定到达率；JMeter；Prometheus')
para('Log Read and Write Performance of MySQL and MongoDB');para('CHIKIN WEN')
para(f'Abstract: This experiment compares JPA/MySQL and Spring Data MongoDB using the same log model and REST API. Four servers are reused in two rounds, with all traffic generated by Manager. An open workload schedules requests at fixed intervals independently of response completion. Scheduled, started, transmitted and completed requests are counted separately. Each run resets 100,000 initial logs, warms up for 10 seconds and measures for 25 seconds. Arrival rates increase according to observed latency, successful throughput and errors. The {len(runs)} runs contain {N:,} measured requests and {E:,} errors. Per-second arrivals, native JMeter reports and Prometheus metrics support the analysis of stable load, queueing, failures and recovery.')
para('Key words: MySQL; MongoDB; open workload; fixed arrival rate; JMeter; Prometheus')
head('1　问题描述');para('日志服务连续写入事件，并按级别与时间分页查询。实验首先观察稳定到达率下的延迟与内部资源，再继续提高到达率，寻找排队、错误和失效。请求启动由独立时钟控制，避免响应变慢时输入速率随之降低。发生成功吞吐骤降时复测相邻档，结合应用、数据库和发压机状态排查。')
head('2　实验环境与实现')
table(['主机','配置','任务'],[['Compiler','2核，792 MiB','Java 17、Maven构建'],['Node1','2核，1800 MiB','MySQL 8.4.13 / MongoDB 7.0.16'],['Node2','2核，792 MiB','Spring Boot 3.3.13，应用堆256 MiB'],['Manager','2核，1800 MiB','固定到达率发压、Prometheus 3.7.3']], '四台机器分两轮复用')
para('两库在Node1先后运行，Node2每轮运行对应profile；Manager从低负载到高压全程承担发压，Compiler负责构建。数据库缓存预算约256 MiB、容器内存上限1 GiB，应用连接池20。MySQL每次事务提交刷盘并关闭binlog；MongoDB单机WiredTiger，w=1、journal=true。两轮使用同一个应用JAR，数据库与应用参数保持一致。压测期间暂停共用资源的四项RBAC服务，结束后恢复原副本数。')
para('Go 1.26.3编译Linux amd64发压器，GOMAXPROCS=2、Go软内存目标384 MiB；HTTP空闲连接复用，每主机连接数不设传输层上限，在途任务上限12000。Manager同时运行Prometheus，主机CPU包含监控开销；采样周期5秒。JMeter 5.6.3从实际HTTP样本生成原生HTML。')
para('应用容器内存上限560 MiB，主机无swap。256 MiB堆之外还需要元空间、线程栈、直接内存和JVM本地内存；主机内存耗尽与Java堆耗尽分别根据内核和JVM日志判断。')
para('公共字段为id、traceId、level、source、message、clientIp、createdAt，服务端生成26位ULID，UTC时间按毫秒处理，正文最多4096字符。POST返回201与保存对象；GET按level及[from,to)分页，按createdAt和id降序，返回当前页和匹配总数。两库分别建立级别、时间、主键联合索引。')
head('3　实验设计')
para('同一个固定随机种子生成10万条日志，分别导入两库。查询固定INFO级别、2026年11月1日UTC 06:00至07:00、第一页20条，匹配2497条；写入使用相同固定正文和字段规则。每档前恢复初始数据，35秒固定到达率发起阶段中前10秒预热、后25秒正式测量，之后等待已发请求完成或超时。单次HTTP总超时5秒、连接超时2秒，发压器不安排应用层重试。')
head('3.1　开放式负载与速率核验',2)
para('第n个请求计划时刻为测试起点加n除以目标速率。独立调度循环在该时刻启动HTTP任务，不等待前一请求完成。响应变慢时在途任务增加。计划到达、实际启动、写入socket、完成和漏发分别按秒计数；写入socket表示客户端已完成发送，服务端接受情况结合HTTP指标判断。')
para('调度落后100毫秒或在途数达到12000时记为漏发，不集中补发欠账。实际启动比例低于98%、正式窗口漏发超过1%、进程异常或主机可用内存低于32 MiB时标为发压端限制。发送比例下降时检查连接超时、端口耗尽与服务状态，区分调度能力和连接处理能力。图表保留逐秒原始计数，5秒分箱计算Hits Per Second变异系数。')
validation=json.loads((R/'evidence/load-generator.json').read_text());para('慢响应验证：'+validation['validation']+'。该检查确认后续请求的启动独立于前序响应。原始JTL附加scheduledTime和dispatchLagMicros；JMeter展示副本去掉附加列、将时间戳显示为北京时间，并给线程名添加统一分组前缀。含临时端口的传输错误消息按原因归类，逐条原文保留在gzip中；转换记录与源文件哈希见dashboard-source.json。JMeter按墙钟整秒分箱，首尾不足一秒的分箱会偏低；正式窗口内相对起点的完整秒计数单独核对。JTL的sentBytes记录请求正文长度，原生Network列用于逻辑正文量核对。')
head('3.2　逐级探索与异常复测',2)
para('读写分别从80次/秒开始。低延迟且无错时下一档约加倍；延迟上升后缩小为约1.5倍。成功吞吐较前档下降超过20%时复测前档与当前档。错误率达到10%、P95达到3500毫秒或健康检查失败时复测确认；到达发压端限制时停止该方向。结束后复测峰值和基线。严重退化后的下一次测试先重启应用，再重置数据和预热；确认结果逐次列出。')
head('3.3　接口验收与页面证据',2)
for b in ['mysql','mongo']:
 smoke=json.loads((R/'evidence'/f'{b}-smoke.json').read_text());para(f'{label(b)}通过{len(smoke["checks"])}项HTTP检查，包含状态码、分页、排序、空结果、非法级别、超长正文和毫秒时间边界；种子查询匹配{smoke["seed_query_count"]}条。')
para('接口页面展示同一应用JAR的真实请求与返回，采集时间见接口证据文件；本轮性能数据独立采集。')
for filename,title in [('prometheus-targets.png','Prometheus采集目标'),('mysql-api.png','MySQL查询返回'),('mongo-api.png','MongoDB查询返回'),('mysql-api-post.png','MySQL单条写入返回'),('mongo-api-post.png','MongoDB单条写入返回')]:image(R/'screenshots'/filename,title)
head('4　负载测试')
para('低到达率下先确认输入节奏稳定，再比较响应时间与内部资源。实际启动率按固定25秒分母计算；成功吞吐量按该窗口内启动且最终成功的请求计数。到达序列中的完成率按完成时刻统计，窗口边界上的在途请求会使它与启动率不同。实验自变量为每秒计划请求数，同时在途任务随响应时间变化。')
for op,title in [('read','查询'),('write','写入')]:
 head(('4.1　' if op=='read' else '4.2　')+title+'负载',2)
 low=[]
 for b in ['mysql','mongo']:
  ss=sorted([s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration'],key=lambda s:s['target_rps'])
  for s in ss[:2]:low.append([label(b),s['target_rps'],fmt(s['throughput_rps']),fmt(s['p95_ms']),f'{s["error_rate"]:.1%}',f'{s["hps_cv_5s"]:.2%}'])
 table(['实现','目标次/秒','启动次/秒','P95 ms','错误率','HPS变异系数'],low,title+'低负载结果')
 resource=[]
 for b in ['mysql','mongo']:
  ss=sorted([s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration' and not s['generator_limit'] and s['error_rate']==0 and s['p95_ms']<500],key=lambda s:s['target_rps'])
  for s in [ss[0],ss[-1]] if len(ss)>1 else ss:
   cpu=s['cpu_percent'];resource.append([label(b),s['target_rps'],fmt(cpu.get('application')),fmt(cpu.get('database')),fmt(cpu.get('monitor')),fmt(s['generator_min_available_mib'])])
 table(['实现','目标次/秒','应用CPU %','数据库CPU %','发压机CPU %','发压机可用MiB'],resource,title+'首次逐级探索中零错误档的资源变化')
 for b in ['mysql','mongo']:
  name=selected[f'{b}-{op}'][0];image(R/'screenshots'/f'{name}-native-pair.png',name+'的响应趋势与百分位')
  image(R/'screenshots'/f'{name}-hps-report.png',name+'的Hits Per Second')
head('5　压力测试与结果分析')
for op,title in [('read','查询'),('write','写入')]:
 head(('5.1　' if op=='read' else '5.2　')+title+'逐级加压',2)
 ss=[s for s in runs if s['operation']==op and s['purpose']=='exploration']
 table(['实现','目标次/秒','启动次/秒','成功次/秒','P95 ms','错误率','最大在途'],[[label(s['backend']),s['target_rps'],fmt(s['throughput_rps']),fmt(s['successful_rps']),fmt(s['p95_ms']),f'{s["error_rate"]:.1%}',s['max_inflight']] for s in ss],title+'探索过程')
 image(O/'figures'/f'{op}-open-progression.png',title+'到达率与成功吞吐、延迟、错误')
 for b in ['mysql','mongo']:
  s=highest(b,op);state='发压端受限' if s['generator_limit'] else '大量请求失败' if s['error_rate']>=.1 else '响应明显变慢' if s['severe_degradation'] else '最高已测档'
  para(f'{label(b)}{title}最高探索目标为{s["target_rps"]}次/秒，实际启动{fmt(s["throughput_rps"])}次/秒、成功{fmt(s["successful_rps"])}次/秒，P95为{fmt(s["p95_ms"])} ms，错误率{s["error_rate"]:.1%}，最大在途{s["max_inflight"]}。该次标记为{state}；测后健康检查为{"UP" if s["healthy_after"] else "失败"}。')
  image(O/'figures'/f'{s["name"]}-arrivals.png',s['name']+'的输入、发送、完成与响应分布',width=130)
  for name in selected[f'{b}-{op}'][1:]:image(R/'screenshots'/f'{name}-native-pair.png',name+'的响应趋势与百分位')
head('5.3　骤降与复测',2)
if (R/'evidence/failure-timeline.json').exists():
 timeline=json.loads((R/'evidence/failure-timeline.json').read_text())
 abnormal=[x for x in timeline if x['action']=='容器退出' and x.get('exit_code') in ['1','137']]
 representative=[]
 for prefix in ['mysql-read','mysql-write','mongo-read','mongo-write']:
  matches=[x for x in abnormal if (x['run'] or '').startswith(prefix)]
  representative.extend(matches[:2])
 rows=[[x['run'] or '恢复或切换',x['utc_bjt'],x.get('exit_code','')] for x in representative]
 if rows:table(['关联运行','北京时间','退出码'],rows,'应用异常退出记录（完整时序见evidence）')
 para('应用机内核记录了内存耗尽后终止Java进程，应用日志记录了本地内存映射失败。容器退出137表示收到SIGKILL，需结合内核OOM记录或恢复操作中的信号判断；退出1结合JVM日志分析，退出143对应停止或重启操作。故障时序与请求窗口逐一关联，原始日志保存在evidence。')

confirm=[s for s in runs if s['purpose']!='exploration']
purpose={'drop_previous_retest':'前档复测','drop_current_retest':'骤降档复测','failure_confirmation':'失效确认','peak_confirmation':'峰值确认','baseline_confirmation':'基线确认','manual_diagnosis':'诊断'}
table(['运行','目的','成功次/秒','P95 ms','错误率'],[[s['name'],purpose.get(s['purpose'],s['purpose']),fmt(s['successful_rps']),fmt(s['p95_ms']),f'{s["error_rate"]:.1%}'] for s in confirm], '确认与诊断结果')
para('排查首先核对启动速率、漏发和调度延迟，再检查发压机CPU与内存、HTTP错误类型、应用状态和数据库资源。连接超时与连接被对端重置表示请求处理链路发生失败；当调度仍跟上目标而发送数下降时，需联系连接处理状态解释。持续退化后的重启与预热单独记录，各次复测保留原始结果。')
for b in ['mysql','mongo']:
 ss=[s for s in runs if s['backend']==b and s['operation']=='read' and s['purpose']=='exploration']
 failed=next((s for s in sorted(ss,key=lambda s:s['start_ms']) if s['error_rate']>=.1),None)
 if failed:
  previous=max([s for s in ss if s['start_ms']<failed['start_ms']],key=lambda s:s['start_ms'])
  para(f'{label(b)}查询从{previous["target_rps"]}增至{failed["target_rps"]}次/秒时，成功吞吐从{fmt(previous["successful_rps"])}降至{fmt(failed["successful_rps"])}次/秒，P95从{fmt(previous["p95_ms"])}增至{fmt(failed["p95_ms"])} ms。骤降档发压机CPU均值为{fmt(failed["cpu_percent"].get("monitor"))}%，最少可用内存{fmt(failed["generator_min_available_mib"])} MiB，调度P99为{failed["dispatch_lag_p99_us"]} μs，漏发{failed["dropped_arrivals"]}次。请求启动保持目标值而成功响应下降，应用退出与超时记录解释了处理链路的失效。')
para('重启后直接恢复较高输入速率的复测也出现失败；10秒预热下的重启恢复结果与连续逐级升压结果差异明显。各次成功吞吐和错误并列展示，单次峰值与反复稳定通过的能力分别解释。数据库CPU下降与应用失败同时出现时，说明到达数据库的工作量减少，需结合应用状态判断吞吐骤降。')
para('故障时间进一步区分测量与采集阶段：MySQL查询1920次/秒运行中，内核在正式测量期间终止Java进程；MySQL写入5120次/秒的日志记录JVM无法映射41,512,960字节内存。MongoDB查询1280次/秒正式窗口为UTC 02:27:16.728至02:27:41.728，随后02:28:11的内核记录终止Java进程，日志采集命令本身也因主机内存不足而失败。MongoDB写入5120次/秒在预热阶段即出现内核OOM。测后OOM与测量中的延迟和超时按先后顺序分析，逐次关联见failure-diagnosis.json。')
para('MongoDB写入5120次/秒档的在途任务达到12000上限，正式窗口发生漏发和调度落后；该档同时记录应用失效与发压端限制。两库性能比较使用共同完成且发压端跟上目标的档位。Prometheus图中时间为UTC，JMeter图中时间为北京时间。')
for filename,title in [('open-prometheus-cpu.png','MongoDB查询失效与恢复期间的主机CPU'),('open-prometheus-memory.png','MongoDB查询失效与恢复期间的主机可用内存')]:image(R/'screenshots'/filename,title)
errors=[s for s in runs if s['error_rate']>=.1]
if errors:table(['运行','启动次/秒','发送次/秒','调度P99 μs','漏发','发压限制'],[[s['name'],fmt(s['throughput_rps']),fmt(s['on_wire_rps']),s['dispatch_lag_p99_us'],s['dropped_arrivals'],'是' if s['generator_limit'] else '否'] for s in errors], '错误档输入与发压资源核对')
diffs=[s for s in runs if s['write_count_difference']]
if diffs:table(['运行','成功响应','记录增长','差额'],[[s['name'],s['all_success'],s['records_after']-100000,s['write_count_difference']] for s in diffs], '写入计数核对')
else:para('全部写入运行的数据库记录增长与完整JTL成功响应数一致。')
para('高压运行出现数据库记录增长大于成功响应数，说明部分写入已提交但客户端未收到成功响应。差额使用整次运行的JTL与测后记录数核对，逐次保留。正式统计按实际启动时间划窗，原始请求、到达序列、监控和配置按运行名对应。')
head('5.4　JMeter原生统计',2)
for b in ['mysql','mongo']:
 for op in ['read','write']:
  name=selected[f'{b}-{op}'][-1];image(R/'screenshots'/f'{name}-dashboard-report.png',name+'的APDEX、请求饼图与Statistics')
head('6　总结')
for op,title in [('read','查询'),('write','写入')]:
 sets=[{s['target_rps'] for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration' and not s['generator_limit']} for b in ['mysql','mongo']]
 common=sets[0]&sets[1]
 stable_sets=[{s['target_rps'] for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration' and not s['generator_limit'] and s['error_rate']==0 and s['p95_ms']<500} for b in ['mysql','mongo']]
 stable=stable_sets[0]&stable_sets[1]
 if stable:
  r=max(stable);v={b:next(s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration' and s['target_rps']==r) for b in ['mysql','mongo']}
  para(f'首次逐级探索中共同零错误的{r}次/秒{title}档，MySQL的P95为{fmt(v["mysql"]["p95_ms"])} ms，MongoDB为{fmt(v["mongo"]["p95_ms"])} ms。')
 if common:
  rate=max(common);values={b:next(s for s in runs if s['backend']==b and s['operation']==op and s['purpose']=='exploration' and s['target_rps']==rate) for b in ['mysql','mongo']}
  para(f'共同已测{rate}次/秒的{title}探索档：MySQL成功{fmt(values["mysql"]["successful_rps"])}次/秒、P95为{fmt(values["mysql"]["p95_ms"])} ms、错误率{values["mysql"]["error_rate"]:.1%}；MongoDB分别为{fmt(values["mongo"]["successful_rps"])}次/秒、{fmt(values["mongo"]["p95_ms"])} ms和{values["mongo"]["error_rate"]:.1%}。')
valid=[s for s in runs if not s['generator_limit']]
para(f'本轮在同一Manager完成{len(runs)}次开放式负载测量，正式窗口共{N:,}次请求、{E:,}次错误。目标速率恒定且调度资源充足时，独立调度使请求持续启动，响应变慢表现为在途请求增加、延迟增长和超时。启动速率、发送速率与成功吞吐共同给出排队与失效证据。')
para('两库结论对应10万条种子日志、固定热点分页查询、联合索引、连接池20与已列持久化设置。单档25秒用于快速定位转折，峰值、骤降与基线另作确认，重启后短预热差异保留在复测表中。')
head('参考文献',2)
for t in ['[1] Spring. Spring Data JPA Reference Documentation. https://docs.spring.io/spring-data/jpa/reference/.','[2] Spring. Spring Data MongoDB Reference Documentation. https://docs.spring.io/spring-data/mongodb/reference/.','[3] Go. net/http package documentation. https://pkg.go.dev/net/http.','[4] Apache JMeter. Dashboard Report. https://jmeter.apache.org/usermanual/generating-dashboard.html.','[5] MongoDB. Write Concern. https://www.mongodb.com/docs/v7.0/reference/write-concern/.']:para(t)
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
D.save(O/'实验四实验报告.docx');(O/'实验四实验报告.md').write_text('\n'.join(md));print('Report',len(runs),'runs',fig,'figures',tab,'tables')
