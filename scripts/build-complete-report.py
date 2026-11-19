"""用通过逐档核验的四类原始数据生成完整实验报告。"""
from pathlib import Path
import json,datetime,sys,statistics
from docx import Document
from docx.shared import Mm,Pt,RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
R=Path(sys.argv[1]);O=R/'report';O.mkdir(exist_ok=True)
runs=json.loads((R/'results/all-runs.json').read_text());keys=['mysql-read','mysql-write','mongo-read','mongo-write'];names={'mysql-read':'MySQL 读取','mysql-write':'MySQL 写入','mongo-read':'MongoDB 读取','mongo-write':'MongoDB 写入'}
groups={k:[x for x in runs if x['backend']+'-'+x['operation']==k] for k in keys};assert all(groups.values()),'四类数据尚未齐全'
turns={k:json.loads((R/'evidence'/(k+'-turning-point.json')).read_text()) for k in keys};by={s['name']:s for s in runs}
assert all(t['confirmed_normal'] and t['confirmed_stress'] for t in turns.values()),'转折尚未完成复核'
D=Document();sec=D.sections[0];sec.page_width=Mm(184);sec.page_height=Mm(260);sec.top_margin=Mm(18);sec.bottom_margin=Mm(16);sec.left_margin=sec.right_margin=Mm(14.5)
for n in ['Normal','Title','Heading 1','Heading 2','Caption']:
 st=D.styles[n];st.font.name='Times New Roman';st.font.color.rgb=RGBColor(0,0,0);st._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'SimSun');st.paragraph_format.space_after=Pt(5);st.paragraph_format.first_line_indent=Pt(0 if n!='Normal' else 18)
for st in D.styles:
 for b in list(st.element.findall('.//'+qn('w:pBdr'))):b.getparent().remove(b)
D.styles['Normal'].font.size=Pt(9);D.styles['Normal'].paragraph_format.line_spacing=Pt(14.1)
D.styles['Title'].font.size=Pt(14)
D.styles['Title']._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'SimHei')
for n in ['Heading 1','Heading 2']:D.styles[n].font.size=Pt(10.5);D.styles[n].font.bold=True;D.styles[n].paragraph_format.keep_with_next=True
D.styles['Caption'].font.size=Pt(8);D.styles['Caption'].font.italic=False
f=OxmlElement('w:fldSimple');f.set(qn('w:instr'),'PAGE');sec.footer.paragraphs[0]._p.append(f);sec.footer.paragraphs[0].alignment=1
for st in D.styles:
 for fonts in st.element.findall('.//'+qn('w:rFonts')):
  for attr in list(fonts.attrib):
   if attr.endswith('Theme'):del fonts.attrib[attr]
for name in ['Heading 1','Heading 2']:
 D.styles[name]._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'SimHei')
md=[];fig=tab=0;pending_page=False
def apply_page(q):
 global pending_page
 if pending_page:q.paragraph_format.page_break_before=True;pending_page=False

def p(text,style=None):
 md.append(text+'\n');q=D.add_paragraph(text,style);apply_page(q)
 if text in ['温子健','CHIKIN WEN'] or text.startswith(('摘　要：','关键词：','Log Read and Write Performance','Abstract:','Key words:')):
  q.paragraph_format.first_line_indent=Pt(0)
  for run in q.runs:
   if text.startswith(('摘　要：','关键词：')):run._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'KaiTi')
   if text.startswith(('Abstract:','Key words:')):run.font.size=Pt(7.5);q.paragraph_format.line_spacing=Pt(10.5)
   if text.startswith('Log Read and Write Performance'):run.font.bold=True;run.font.size=Pt(10.5)
 return q
def h(text,level=1):
 md.append('#'*(level+1)+' '+text+'\n');q=D.add_heading(text,level);apply_page(q);return q
def page():
 global pending_page
 pending_page=True
def table(headers,rows,title,widths=None):
 global tab
 tab+=1;q=p(f'表{tab}　{title}','Caption');q.paragraph_format.keep_with_next=True
 t=D.add_table(rows=1,cols=len(headers));t.style='Table Grid';t.autofit=False
 borders=OxmlElement('w:tblBorders')
 for edge in ['top','left','bottom','right','insideH','insideV']:
  el=OxmlElement('w:'+edge);el.set(qn('w:val'),'single');el.set(qn('w:sz'),'4');el.set(qn('w:color'),'D9D9D9');borders.append(el)
 t._tbl.tblPr.append(borders)
 widths=widths or [155/len(headers)]*len(headers)
 for col,w in zip(t.columns,widths):col.width=Mm(w)
 for c,v in zip(t.rows[0].cells,headers):c.text=str(v)
 for values in rows:
  for c,v in zip(t.add_row().cells,values):c.text=str(v)
 for i,row in enumerate(t.rows):
  row._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
  if i==0:row._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
  for c,w in zip(row.cells,widths):
   c.width=Mm(w);c.vertical_alignment=1
   if i==0:
    shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'E8EEF4');c._tc.get_or_add_tcPr().append(shade)
   for q in c.paragraphs:
    q.paragraph_format.first_line_indent=Pt(0);q.paragraph_format.space_after=Pt(3);q.paragraph_format.line_spacing=Pt(10.5)
    if len(rows)<=5:q.paragraph_format.keep_with_next=i<len(rows)
    for rr in q.runs:rr.font.size=Pt(7.5);rr.bold=i==0
 md.append('| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,x))+' |' for x in rows)+'\n')
def image(file,caption,width=148):
 global fig
 path=R/'screenshots'/file;assert path.exists(),path
 fig+=1;q=D.add_paragraph();apply_page(q);q.paragraph_format.first_line_indent=Pt(0);q.paragraph_format.keep_with_next=True;q.paragraph_format.line_spacing=1;q.paragraph_format.space_after=Pt(0);q.alignment=1;q.add_run().add_picture(str(path),width=Mm(width));q=p(f'图{fig}　{caption}','Caption');q.alignment=1;q.paragraph_format.line_spacing=Pt(10);md.append(f'![图{fig} {caption}](../screenshots/{file})\n')
def val(s,key,role):
 z=s.get(role+'_'+key);return f'{z["mean"]:.2f}' if z else '缺测'
def timefmt(ms):return datetime.datetime.fromtimestamp(ms/1000,datetime.timezone.utc).strftime('%H:%M:%S')
labels={'exploration':'逐级','refinement':'细分','normal_confirmation':'正常复核','stress_confirmation':'压力复核','recovery':'恢复','heap192_exploration':'逐级','heap192_refinement':'细分','heap192_stable_confirmation':'正常复核','heap192_stress_confirmation':'压力复核','heap192_recovery':'恢复'}
def purpose_name(s,t):
 if s['name']==t['normal_confirmation']:return '正常复核'
 if s['name']==t['stress_confirmation']:return '压力复核'
 if 'confirmation' in s['purpose']:return '候选复核'
 return labels.get(s['purpose'],s['purpose'])
N=sum(s['samples'] for s in runs)
bounds='；'.join(f'{names[k]}{turns[k]["last_normal_candidate_rps"]}—{turns[k]["first_stress_candidate_rps"]}次/秒' for k in keys)
p('MySQL 与 MongoDB 日志读写性能对比','Title');p('温子健')
p(f'摘　要：本文以相同日志业务比较Spring Data JPA/MySQL与Spring Data MongoDB/MongoDB的读取和写入性能。四台服务器分两轮复用，每档恢复相同的10万条日志，采用开放式等间隔到达计划，以平均HTTP响应时间为主指标逐级升压。Prometheus每1秒采集、每2秒计算，结合主机CPU、内存与应用等待分析响应转折。四类转折复核区间为：{bounds}。共核验{len(runs)}次正式运行、{N:,}次请求。')
p('关键词：MySQL；MongoDB；负载测试；压力测试；平均响应时间；JMeter；Prometheus')
p('Log Read and Write Performance of MySQL and MongoDB');p('CHIKIN WEN')
p(f'Abstract: This experiment compares log reads and writes through Spring Data JPA/MySQL and Spring Data MongoDB/MongoDB. Four servers are reused in two database rounds. Each run restores the same 100,000 logs and uses evenly spaced open arrivals. Mean HTTP response time is the primary metric. Prometheus scrapes every second and evaluates rules every two seconds. Progressive loads and boundary checks relate response degradation to CPU, memory and application queues. The four categories contain {len(runs)} verified runs and {N:,} measured requests. Results are compared at common request rates and interpreted with the corresponding resource observations.')
p('Key words: MySQL; MongoDB; load testing; stress testing; mean response time; JMeter; Prometheus')
h('1 问题描述')
p('日志服务接收单条事件，并按级别与时间范围分页查询。实验分别测量MySQL读取、MySQL写入、MongoDB读取和MongoDB写入。先增加正常负载，观察平均响应与资源变化；当平均响应大幅上升时，细分相邻档位并进入压力分析，检查CPU、内存、连接与线程等待。')
h('2 实验环境与方法')
table(['主机','实测配置','工作分工'],[['Compiler','2核 792 MiB','构建与辅助发送'],['Node1','2核 1800 MiB','第一轮MySQL 第二轮MongoDB'],['Node2','2核 792 MiB','当前被测应用'],['Manager','2核 1800 MiB','主要发送与Prometheus']], '四台服务器两轮复用',[24,36,95])
p('版本为Java 17、Spring Boot 3.3.13、MySQL 8.4.13、MongoDB 7.0.16、JMeter 5.6.3、Prometheus 3.7.3。读取应用堆192 MiB，写入应用堆128 MiB，Tomcat最大工作线程40，两库连接池上限20。写入连接上限256、接受队列256，读取保留默认连接上限8192。数据库缓存约256 MiB，实验数据库容器上限1 GiB。MySQL事务提交刷盘并关闭binlog，MongoDB使用w=1、journal=true。每个运行目录保存实际配置与版本证据。')
p('两台发送机按约4:1分担请求，在内网访问应用与监控。压测期间暂停共用资源的四项RBAC服务；测试后恢复原副本数。编译和发压分时执行。数据库与应用分别部署，可区分两台主机的资源占用。')
p('两库写入转折的补测返回各自数据库环境，参数保持一致；分开的同库时段在HPS与资源截图中组合展示，各自保留时间轴。')
p('Compiler发压时停止Docker以释放内存，该机CPU、内存和JMeter线程由每秒/proc记录核验；应用机与数据库机的Prometheus采集持续运行。')
h('3 实验设计')
p('公共字段为id、traceId、level、source、message、clientIp、createdAt。服务端生成26位ULID，UTC时间精确到毫秒，正文最长4096字符。POST /api/logs返回201及保存对象；GET按level、from、to、page、size查询，时间范围左闭右开，页码从0开始，按createdAt、id降序。两库建立level、createdAt、id联合索引。代码按Google Java Style排版，中文注释说明公共语义与关键实现。')
p('固定随机种子生成10万条初始日志，每档重置。查询固定INFO级别、2026年11月1日UTC 06:00至07:00、第一页20条，共匹配2497条。写入使用一致的请求字段与正文规则。接口核验覆盖状态码、排序、分页、空结果、非法级别、超长正文及毫秒时间边界。')
p('逐级探索保持应用连续运行；细分与端点复核前重启应用，先执行320次/秒的55秒调理，再重置数据并按目标速率预热30秒。调理数据独立保存，不计入正式性能表。')
p('JMeter使用开放式等间隔到达，每台5个线程组，每个逻辑线程只发送一次请求。启动前等待5秒，随后持续发送55秒，前30秒预热，第30至50秒为正式窗口；总线程数N=计划速率×55，同时活跃线程数另行记录。下一请求按计划时刻启动，独立于前一请求的完成时刻。')
p('请求使用Java HTTP采样器并关闭客户端重试。读取响应超时2秒，新写入测试响应超时500毫秒，读取连接超时2秒、写入连接超时200毫秒；各实现同一操作的配置一致。HTTP耗时包含连接和读取阶段，失败样本同样进入平均值，同时列出错误率和成功请求均值。早期写入出现Tomcat连接缓冲区耗尽堆的故障，连接上限从默认8192改为256；修正后的两库写入从低档重测，使用128 MiB堆与200毫秒连接超时。')
p('每档核验实际样本总数、逻辑线程唯一性、完整秒Hits Per Second和发送端退出状态。正式20秒内逐秒HPS偏离均值、首尾各5秒均值之差、平均发送率偏离计划均须不超过10%；发送机检查内存余量、线程创建错误和任务配额命中。发送不合格的运行保留在排查目录，并安排重测。预热初段存在调度初始化波动，原始计数完整保留；正式平台用于性能比较。')
p('平均响应超过50毫秒、错误率超过1%或应用失去健康状态时进入压力排查。该条件用于选取细分档位；转折结合相邻档、独立复核和资源状态判断。Prometheus每1秒采集、规则每2秒计算，查询步长2秒。CPU为非空闲时间比例，内存为1−MemAvailable/MemTotal。原生截图只显示应用机和数据库机，蓝色为应用机，橙色为数据库机。JMeter展示UTC+8，Prometheus展示UTC。各档之间的空白包括重置、预热和重启；连接不同运行的折线不表示间隙期间持续发压。')
page();h('3.1 接口与监控核验',2)
image('mysql-api.png','MySQL分页读取接口');image('mysql-api-post.png','MySQL单条写入接口')
page();image('mongo-api.png','MongoDB分页读取接口');image('mongo-api-post.png','MongoDB单条写入接口')
p('接口页面对应相同模型和请求语义，独立接口核验JSON保存字段、状态码和边界检查。性能部分使用本轮正式窗口的JTL与监控。')
page();image('prometheus-targets-current.png','Prometheus应用与主机采集状态');p('应用、数据库机、应用机及Manager采集为UP。Compiler发压期间停止Docker，其Exporter随之停止，该机发送资源采用每秒/proc记录。')
page();h('4 负载测试结果')
p('四类测试分别列出实际运行记录。表中HPS按JTL请求开始时刻逐秒计数，平均响应使用完整HTTP耗时；相同时间窗提取CPU和内存均值。编号在每类内部从1开始，与原生JMeter图例和截图标注对应。资源图箭头按正式窗口中点标明编号和请求速率；线程总数按N=速率×55对应。Stacked高度为两台主机各自百分比之和，单机占用看区域厚度与非堆叠曲线。')
for ki,k in enumerate(keys,1):
 if ki>1:page()
 h(f'4.{ki} {names[k]}',2);ss=groups[k];t=turns[k];lo=by[t['normal_confirmation']];hi=by[t['stress_confirmation']]
 table(['编号','用途','请求/s','线程N','均值ms','P95 ms','错误率','HPS范围'],[[i,purpose_name(s,t),s['target_rps'],s['threads'],f'{s["mean_ms"]:.2f}',f'{s["p95_ms"]:.2f}',f'{s["error_rate"]:.2%}',f'{s["hps_min"]}–{s["hps_max"]}'] for i,s in enumerate(ss,1)],names[k]+'逐级与复核结果',[9,18,17,22,20,20,18,31])
 p(f'正常复核为{lo["target_rps"]}次/秒，平均响应{lo["mean_ms"]:.2f}毫秒；压力复核为{hi["target_rps"]}次/秒，平均响应{hi["mean_ms"]:.2f}毫秒、错误率{hi["error_rate"]:.2%}。复核区间为{t["last_normal_candidate_rps"]}至{t["first_stress_candidate_rps"]}次/秒。'+(f'压力复核成功请求平均响应{hi["successful_mean_ms"]:.2f}毫秒。' if hi['successful_mean_ms'] is not None else '压力复核正式窗口内全部请求失败，均值表示失败返回耗时。'))
 table(['编号','正式窗口UTC','应用CPU%','数据库CPU%','应用内存%','数据库内存%'],[[i,timefmt(s['measurement_start_ms'])+'–'+timefmt(s['measurement_end_ms']),val(s,'cpu_percent','application'),val(s,'cpu_percent','database'),val(s,'memory_percent','application'),val(s,'memory_percent','database')] for i,s in enumerate(ss,1) if s['name'] in [t['normal_confirmation'],t['stress_confirmation']]],names[k]+'正常与压力复核的同窗资源均值',[9,46,25,25,25,25])
 page();image(k+'-hps.jpg',names[k]+'各档Hits Per Second')
 if k.endswith('write'):page()
 image(k+'-response.jpg',names[k]+'各档平均响应时间');image(k+'-percentiles.jpg',names[k]+'响应时间百分位')

 page();image(k+'-cpu.jpg',names[k]+'应用机与数据库机CPU');image(k+'-memory.jpg',names[k]+'应用机与数据库机内存')
 page();image(k+'-cpu-stacked.jpg',names[k]+'CPU堆叠');image(k+'-memory-stacked.jpg',names[k]+'内存堆叠')

 page();image(k+'-dashboard.jpg',names[k]+'原生统计表与请求成功失败饼图')
page();h('5 压力转折与原因分析')
h('5.1 MySQL 读取',2)
p('转折位于1200–1225次/秒：平均响应由11.13升至75.97毫秒。压力档数据库CPU为90.43%，连接池等待请求平均12.8个；应用CPU为62.08%，数据库内存为53.12%。因此，主要瓶颈是数据库处理能力及连接等待。应用机最低可用内存为81.4 MiB，未发生OOM，内存余量较小。')
h('5.2 MySQL 写入',2)
p('转折位于3960–3990次/秒：平均响应由27.71升至42.94毫秒，错误率由0.76%升至1.35%；3990次/秒首次测试均值为61.68毫秒。两档应用CPU均在95%以上，数据库CPU约66%，应用机最低可用内存为103.1 MiB，未发生OOM。因此，主要瓶颈是应用CPU；继续升至4025次/秒时，应用CPU达98.85%，错误率达49.57%，进一步印证这一判断。')
h('5.3 MongoDB 读取',2)
p('转折位于1190–1225次/秒：平均响应由8.09升至109.02毫秒。数据库CPU由94.97%升至98.24%，逐核最高100%；应用CPU仅50.86%，数据库内存为36.97%，应用机最低可用内存为162.2 MiB。因此，主要瓶颈是数据库CPU，内存仍有余量。')
h('5.4 MongoDB 写入',2)
p('转折复核区间为3775–3840次/秒：平均响应由17.27升至98.30毫秒，错误率由0.46%升至7.75%。压力档应用CPU为70.34%、数据库CPU为53.11%，应用机最低可用内存为156.2 MiB，CPU和内存均未耗尽。3900次/秒预热线程快照显示，40个工作线程中25个等待连接、13个等待数据库返回，证据指向连接与持久化响应等待。3810次/秒两次表现不同，因此以区间描述转折。')
page();h('6 总结')
table(['类别','正常次/秒','正常均值ms','压力次/秒','压力均值ms','压力错误率'],[[names[k],turns[k]['last_normal_candidate_rps'],f"{by[turns[k]['normal_confirmation']]['mean_ms']:.2f}",turns[k]['first_stress_candidate_rps'],f"{by[turns[k]['stress_confirmation']]['mean_ms']:.2f}",f"{by[turns[k]['stress_confirmation']]['error_rate']:.2%}"] for k in keys], '四类性能转折复核',[27,24,29,24,29,22])
for op,title in [('read','读取'),('write','写入')]:
 m={s['target_rps']:s for s in groups['mysql-'+op] if not s['severe_degradation'] and not s['errors']};g={s['target_rps']:s for s in groups['mongo-'+op] if not s['severe_degradation'] and not s['errors']};common=sorted(set(m)&set(g))
 if common:
  n=common[-1];p(f'在共同正常{title}速率{n}次/秒下，MySQL平均响应{m[n]["mean_ms"]:.2f}毫秒，MongoDB为{g[n]["mean_ms"]:.2f}毫秒。转折位置结合各类CPU、等待与内存证据解释。')
p(f'本实验完成四类逐级测试，共{len(runs)}次正式运行、{N:,}条正式样本。各类原始JTL、预热数据、逐秒HPS、监控数据、配置、日志和原生图表均按运行名关联。结果采用逐档探索及边界独立复核，重复运行分别展示。')
h('参考文献')
for text in ['[1] 课程实验四 Mongo的读写性能测试 实验说明。','[2] 教师示例代码 https://gitee.com/mingqcn/spring-fundamentals。','[3] Apache JMeter 5.6.3 User Manual https://jmeter.apache.org/usermanual/。','[4] Prometheus Querying and Recording Rules https://prometheus.io/docs/。','[5] Spring Data JPA and Spring Data MongoDB Reference Documentation https://spring.io/projects/spring-data。','[6] MySQL 8.4 Reference Manual https://dev.mysql.com/doc/refman/8.4/en/。','[7] MongoDB 7.0 Manual https://www.mongodb.com/docs/v7.0/。']:p(text)
D.core_properties.author='温子健 / CHIKIN WEN';D.core_properties.title='MySQL 与 MongoDB 日志读写性能对比';D.save(O/'实验四实验报告.docx');(O/'实验四实验报告.md').write_text('\n'.join(md));print('Report built',len(runs),N)
