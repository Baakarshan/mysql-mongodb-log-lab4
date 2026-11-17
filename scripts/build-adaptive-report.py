"""Build the report from observed progressive measurements and native screenshots."""
from pathlib import Path
import argparse,json,statistics,datetime
from docx import Document
from docx.shared import Mm,Pt,RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.text import WD_ALIGN_PARAGRAPH
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
 if path.name.endswith('-native-pair.png'):width=112
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
   for pp in c.paragraphs:
    pp.paragraph_format.first_line_indent=Pt(0);pp.paragraph_format.space_after=Pt(3)
    for rr in pp.runs:rr.font.size=Pt(7.5);rr.bold=ri==0
   borders=OxmlElement('w:tcBorders')
   for side in ['top','left','bottom','right','insideH','insideV']:
    edge=OxmlElement('w:'+side);edge.set(qn('w:val'),'single');edge.set(qn('w:sz'),'4');edge.set(qn('w:color'),'D9D9D9');borders.append(edge)
   c._tc.get_or_add_tcPr().append(borders)
 md.append('| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,row))+' |' for row in rows)+'\n')
def fmt(v):return '—' if v is None else f'{v:,.1f}'
def label(b):return 'MySQL' if b=='mysql' else 'MongoDB'
def highest(b,o):return max((s for s in runs if s['backend']==b and s['operation']==o),key=lambda s:(s['threads'],s['start_ms']))
N=sum(s['samples'] for s in runs);E=sum(s['errors'] for s in runs)
para('MySQL 与 MongoDB 日志读写性能对比','Title');para('温子健')
para(f'摘　要：本文使用相同日志模型与REST接口，比较Spring Data JPA/MySQL和Spring Data MongoDB/MongoDB链路。四台服务器分两轮复用，每次测量恢复10万条初始数据。JMeter采用有限循环与吞吐量定时器，从低并发逐级增加负载，依据响应时间、吞吐量、错误和压测机资源决定后续档位，并复测突降与边界。共完成{len(runs)}次测量，正式窗口记录{N:,}次请求、{E:,}次错误。结合Hits Per Second、延迟分布及Prometheus数据，分析稳定负载范围、饱和后的排队与失效条件。')
para('关键词：MySQL；MongoDB；Spring Data；渐进加压；JMeter；Prometheus')
para('Log Read and Write Performance of MySQL and MongoDB');para('CHIKIN WEN')
para(f'Abstract: This experiment compares JPA/MySQL and Spring Data MongoDB using the same log model and REST API. Four servers are reused in two sequential rounds. Finite JMeter loops and throughput pacing provide controlled workloads. Concurrency increases according to observed latency, throughput, errors and generator resources. Drops and failure boundaries are retested. The experiment includes {len(runs)} runs and {N:,} measured requests, with {E:,} errors. Request-rate traces and Prometheus metrics support the analysis of stable load, saturation and failures.')
para('Key words: MySQL; MongoDB; Spring Data; progressive load; JMeter; Prometheus')
head('1　问题描述');para('日志服务持续写入事件，并按级别及时间区间查询。实验首先观察稳定负载下的响应时间和资源使用，再逐级提高并发寻找吞吐平台、明显退化与失败。遇到吞吐突降时，复测相邻档并检查应用、数据库和压测机，区分真实系统行为、配置故障和压测端限制。')
head('2　环境与实现');table(['主机','配置','角色'],[['Compiler','2核，792 MiB','Java 17、JMeter 5.6.3'],['Node1','2核，1800 MiB','MySQL 8.4.13 / MongoDB 7.0.16'],['Node2','2核，792 MiB','Spring Boot 3.3.13，堆256 MiB'],['Manager','2核，1800 MiB','Prometheus 3.7.3；高并发补测发压']], '四机两轮环境')
para('两库在Node1先后运行，数据库缓存预算约256 MiB、容器内存上限1 GiB；应用最大连接数20。MySQL每次事务提交刷盘并关闭二进制日志，MongoDB采用单机WiredTiger与w=1、journal=true。压测期间暂停同机RBAC服务，保留数据，测量后恢复原副本数。两轮使用同一个修正仓储扫描范围后的JAR。Compiler达到资源限制后，使用Manager补测高并发；应用、数据库与JMX保持一致，Prometheus维持5秒采样。Manager初用256 MiB发压堆，2916线程JMeter堆耗尽后扩为512 MiB；两库按相同发压机与堆上限比较，每次运行记录配置。')
para('公共字段为id、traceId、level、source、message、clientIp、createdAt。服务端生成26位ULID，UTC时间统一到毫秒，正文上限4096字符。POST /api/logs返回201；GET按level与[from,to)分页，按createdAt和id降序，返回当前页与总数。MySQL与MongoDB分别建立级别、时间、主键联合索引。')
head('3　测试方法');para('同一生成器以固定随机种子产生10万条日志。读取固定INFO级别、2026年11月1日UTC 06:00至07:00、第一页20条，匹配2497条；写入采用固定长度正文。每次测量前重置数据，避免不同起始规模影响对照。')
para('JMeter采用最多600次有限循环，每档升压5秒、预热5秒、正式测量25秒；退出宽限30秒。原生吞吐量定时器按当前线程组计算目标速率，并由各线程分别控制节奏，初始目标到达率为线程数×10次/秒。正式窗口按请求开始时间截取，完整JTL保留升压、预热和收尾请求。原始时间戳为Unix毫秒，原生HTML与截图显示北京时间。循环上限保证测试有界，请求节奏由定时器控制；饱和后实际速率与目标速率的偏离作为结果记录。')
para('从8线程开始探索。未接近饱和时下一档约加倍；实际吞吐落后目标或延迟升高时改用较小增幅。吞吐较前档下降超过20%时复测原档和前档。错误率达到10%或P95达到3500 ms时复测确认；进程或健康检查失败单独记录。压测机CPU接近饱和、可用内存低于32 MiB或JMeter异常时停止该轮，单独标注发生在压测端的限制。')
para('探索、确认和诊断按运行目的分别汇总；恢复后短窗口与持续预热的结果分别呈现。基础负载分析使用低并发且请求节奏稳定的档位；压力分析延续同一探索过程，观察吞吐平台、排队、失败及恢复。Hits Per Second按1秒展示，正式窗口内5秒分箱计算变异系数。25秒窗口用于快速定位边界，关键档复测用于判断是否重现。')
head('3.1　接口与部署验收',2)
for b in ['mysql','mongo']:
 smoke=json.loads((R/'evidence'/f'{b}-smoke.json').read_text());para(f'{label(b)}链路通过{len(smoke["checks"])}次HTTP检查，覆盖分页、排序、空结果、非法字段、超长正文和毫秒时间边界，初始化查询匹配{smoke["seed_query_count"]}条。')
for filename,title in [('prometheus-targets.png','Prometheus采集目标'),('mysql-api.png','MySQL接口结果'),('mongo-api.png','MongoDB接口结果'),('mysql-api-post.png','MySQL单条写入返回对象'),('mongo-api-post.png','MongoDB单条写入返回对象')]:image(R/'screenshots'/filename,title)
para('接口截图在压测完成后采集，两库分别新增1条演示日志，独立记录于interface-recapture.json。性能计数使用各档结束时的数据库快照。')
head('4　稳定负载表现');para('低并发阶段的目标为每线程每秒10次请求。比较实际吞吐与目标值，并用5秒HPS分箱的变异系数判断节奏稳定性。毫秒级响应时间的逐秒均值有小幅跳动，需联系纵轴刻度与百分位分布判断。')
for op,title in [('read','查询'),('write','写入')]:
 head(('4.1　' if op=='read' else '4.2　')+title+'负载',2)
 rows=[]
 for b in ['mysql','mongo']:
  ss=sorted([s for s in ag if s['backend']==b and s['operation']==op and s['generator_role']=='compiler' and s['phase']=='exploration'],key=lambda s:s['threads'])
  for s in ss[:2]:rows.append([label(b),s['threads'],fmt(s['throughput_rps']),fmt(s['p95_ms']),f'{s["error_rate"]:.1%}',f'{s["hps_cv_5s"]:.1%}'])
 table(['实现','线程','次/秒','P95 ms','错误率','HPS变异系数'],rows,title+'低负载测量')
 for b in ['mysql','mongo']:
  name=selected[f'{b}-{op}'][0];image(R/'screenshots'/f'{name}-native-pair.png',name+'的响应时间趋势与百分位')
page();head('5　逐级压力与异常排查')
for op,title in [('read','查询'),('write','写入')]:
 if op=='write':page()
 head(('5.1　' if op=='read' else '5.2　')+title+'逐级加压',2)
 rows=[]
 for s in [s for s in ag if s['operation']==op and s['phase']=='exploration']:rows.append([label(s['backend']),('C' if s['generator_role']=='compiler' else 'M')+'/'+str(s['generator_heap_mib'])+('*' if s.get('limited_runs') else ''),s['threads'],s['repeats'],fmt(s['successful_rps']),fmt(s['p95_ms']),f'{s["error_rate"]:.1%}'])
 table(['实现','发压机','线程','次数','成功次/秒','P95 ms','错误率'],rows,title+'探索档实测，重复探索取中位数')
 para('发压机C为Compiler，M为Manager，斜线后为JMeter堆上限MiB。*表示该组包含发压端受限运行，用于异常排查。两库比较采用相同发压机、相同堆上限且资源未受限的运行。')
 image(O/'figures'/f'{op}-progressive.png',title+'随并发变化的吞吐量、延迟和错误率')
 for b in ['mysql','mongo']:
  s=highest(b,op)
  states=[]
  if s['generator_limit']:states.append('发压端受限')
  if s['error_rate']>=.1:states.append('大量请求失败')
  elif s['severe_degradation']:states.append('响应明显变慢')
  state='、'.join(states) or '最高已测档位'
  para(f'{label(b)}{title}在{s["threads"]}线程时，成功吞吐量为{fmt(s["successful_rps"])}次/秒，P95为{fmt(s["p95_ms"])} ms，错误率{s["error_rate"]:.1%}；该档标记为{state}。应用测后健康检查为{"UP" if s["healthy_after"] else "失败"}。')
  name=s['name'];image(O/'figures'/f'{name}-observed.png',name+'的请求速率、响应趋势与百分位');image(O/'figures'/f'{name}-resources.png',name+'的主机CPU与可用内存')
  for n in selected[f'{b}-{op}'][1:]:image(R/'screenshots'/f'{n}-native-pair.png',n+'的响应时间趋势与百分位')
head('5.3　异常复测与定位',2)
para('切换到MySQL时，公共模型同时包含JPA和MongoDB映射，JPA默认扫描将MongoRepository误识别为JPA仓储，产生findInTimeRange属性解析错误并导致启动失败。通过mysql profile下显式限定JpaRepository扫描包修复，两轮重新构建和验收。该问题属于启动配置故障。')
drops=[s for s in runs if s['purpose']!='exploration']
if drops:
 table(['运行','目的','次/秒','P95 ms','错误率'],[[s['name'],s['purpose'],fmt(s['successful_rps']),fmt(s['p95_ms']),f'{s["error_rate"]:.1%}'] for s in drops], '确认与诊断运行，逐次列出')
else:para('本轮探索未触发相邻档成功吞吐量下降超过20%的复测条件。逐秒请求速率、5秒分箱、应用日志及CPU序列均保留，瞬时波动结合其发生时间和资源状态解释。')
para('Compiler的高线程运行出现内存耗尽时，吞吐量骤降而应用健康检查仍返回UP。复测相邻档后，将这些运行标记为发压端限制，并使用Manager补测；Manager在2916线程、256 MiB发压堆下出现Java heap space，扩为512 MiB后继续验证；JTL原始值全部保留。压力下的实际Hits Per Second随排队及资源饱和而波动，低负载的稳定性由定时器和实测序列验证。')
para('发压进程退出码124表示超过计划35秒与30秒退出宽限。此类运行保留正式窗口，但标记发压端限制；结合CPU、内存、JMeter日志和应用健康判断停止原因。Manager同时运行Prometheus，CPU统计包含监控开销。')
para('监控未返回样本时，资源图保留缺口。错误请求按原始responseCode统计。客户端超时或发压进程被终止时，部分写入已提交而完成样本尚未记录，因此同时列出成功响应数和实际记录增长，保留差额作为排查证据。完整运行数据、窗口划分和校验值见results/runs，各次结果见all-runs.csv。')
differences=[s for s in runs if s.get('write_count_difference')]
if differences:table(['运行','JTL成功数','数据库增长','差额','退出码'],[[s['name'],s['all_success'],s['records_after']-s['records_before'],s['write_count_difference'],s['generator_exit_code']] for s in differences], '写入计数差异核对')
failed=[s for s in runs if s['error_rate']>=.1 and not s['generator_limit']]
if failed:
 table(['运行','成功次/秒','错误率','错误类型'],[[s['name'],fmt(s['successful_rps']),f'{s["error_rate"]:.2%}', '；'.join({'ConnectTimeoutException':'连接超时','SocketTimeoutException':'读取超时','SocketException':'套接字异常'}.get(k.rsplit(': ',1)[-1].rsplit('.',1)[-1],k)+': '+str(v) for k,v in s['response_codes'].items())] for s in failed], '服务请求失败的类型与次数')
para('本轮停止高压发压后仍保留排队和主机内存占用。遇到持续退化时重启应用，恢复后重做低负载检查。人工恢复期间中断的一次运行另存evidence/operator-recovery-interruption，其JTL与日志保留，性能表排除该次干预。应用机可用内存一度降至约28 MiB，Docker恢复命令退出2；结束实验Java进程释放资源后继续验证。')
for filename,title in [('mongo-read-t2916-r3-prometheus-cpu.png','MongoDB查询失效时窗的主机CPU'),('mongo-read-t2916-r3-prometheus-memory.png','MongoDB查询失效时窗的可用内存')]:image(R/'screenshots'/filename,title)
head('5.4　JMeter原生结果',2)
for b in ['mysql','mongo']:
 for op in ['read','write']:
  name=highest(b,op)['name'];image(R/'screenshots'/f'{name}-dashboard-report.png',name+'的APDEX、请求饼图与Statistics')
head('6　总结')
for op,title in [('read','查询'),('write','写入')]:
 chosen=None
 for generator,heap in [('monitor',512),('monitor',256),('compiler',256)]:
  sets=[]
  for b in ['mysql','mongo']:
   sets.append(set(s['threads'] for s in runs if s['operation']==op and s['backend']==b and s['generator_role']==generator and s['generator_heap_mib']==heap and s['phase']=='exploration' and not s['generator_limit']))
  if sets[0]&sets[1]:chosen=(generator,heap,max(sets[0]&sets[1]));break
 if chosen:
  generator,heap,t=chosen;values={}
  for b in ['mysql','mongo']:
   ss=[s for s in runs if s['backend']==b and s['operation']==op and s['threads']==t and s['generator_role']==generator and s['generator_heap_mib']==heap and s['phase']=='exploration' and not s['generator_limit']]
   values[b]=(statistics.median(s['successful_rps'] for s in ss),statistics.median(s['p95_ms'] for s in ss),statistics.median(s['error_rate'] for s in ss))
  gen='Manager' if generator=='monitor' else 'Compiler'
  para(f'采用{gen}、{heap} MiB发压堆的共同已测{t}线程{title}探索档，MySQL成功吞吐为{fmt(values["mysql"][0])}次/秒、P95为{fmt(values["mysql"][1])} ms、错误率{values["mysql"][2]:.1%}；MongoDB分别为{fmt(values["mongo"][0])}次/秒、{fmt(values["mongo"][1])} ms和{values["mongo"][2]:.1%}。')
para(f'实验以有限循环和请求节奏控制完成{len(runs)}次逐级探索与复测，正式窗口共{N:,}次请求、{E:,}次错误。固定线程上限、线程耗尽、服务超时和进程退出分别记录；稳定负载、吞吐平台及失效判断由实测指标支持。两库比较应同时考虑成功吞吐量、P95/P99和压测机资源。')
para('重启后短预热的确认运行与持续运行的探索档存在差异，确认表逐次保留这些结果。单档25秒数据用于定位转折，性能比较结合相邻档、确认结果与资源状态。写入高档多次接近发压机CPU上限，因此本轮写入边界首先反映发压能力。')
para('查询接口承担条件过滤、20条文档/记录读取和匹配总数计算，写入等待持久化确认。结论对应本实验的数据规模、热点查询、索引、连接池和写入设置。原始JTL与监控序列可追溯到每个运行名。')
head('参考文献',2)
for t in ['[1] Spring. Spring Data JPA Reference Documentation. https://docs.spring.io/spring-data/jpa/reference/.','[2] Spring. Spring Data MongoDB Reference Documentation. https://docs.spring.io/spring-data/mongodb/reference/.','[3] Apache JMeter. Component Reference: Constant Throughput Timer. https://jmeter.apache.org/usermanual/component_reference.html.','[4] MongoDB. Write Concern. https://www.mongodb.com/docs/v7.0/reference/write-concern/.']:para(t)
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
