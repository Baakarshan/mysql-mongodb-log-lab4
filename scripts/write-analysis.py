"""按最终复核端点、原始错误及资源证据写入两类分析。"""
from pathlib import Path
import json,sys
R=Path(sys.argv[1]);by={x['name']:x for x in json.loads((R/'results/all-runs.json').read_text())};resp=json.loads((R/'evidence/write-response-audit.json').read_text())
for key in ['mysql-write','mongo-write']:
 t=json.loads((R/'evidence'/(key+'-turning-point.json')).read_text());a=json.loads((R/'evidence'/(key+'-analysis-evidence.json')).read_text());lo,hi=[by[t[k]] for k in ['normal_confirmation','stress_confirmation']]
 def metric(s,k,role='application',agg='mean'):return s[role+'_'+k][agg]
 l,h=a
 ps=[f"正常与压力复核的应用CPU均值分别为{metric(lo,'cpu_percent'):.2f}%和{metric(hi,'cpu_percent'):.2f}%，数据库CPU分别为{metric(lo,'cpu_percent','database'):.2f}%和{metric(hi,'cpu_percent','database'):.2f}%。两档主机指标各覆盖正式窗口的{hi['application_cpu_percent']['samples']}/{hi['application_cpu_percent']['expected_samples']}个查询点。"]
 if key=='mysql-write':
  ps += ['3990次/秒首次细分的平均响应为61.68毫秒，错误率2.88%，应用CPU为96.54%；4025次/秒进一步升至175.27毫秒、错误率49.57%，应用CPU为98.85%。数据库CPU同期仍低于应用机。响应退化与应用机CPU接近两核上限同步，当前配置下应用处理能力是主要约束。',f"压力复核应用机最低可用内存为{metric(hi,'available_mib',agg='min'):.1f} MiB，数据库最低可用内存为{metric(hi,'available_mib','database',agg='min'):.1f} MiB。内核OOM记录为{len(hi.get('oom_lines',[]))}条，结束后应用健康检查{'通过' if hi['healthy_after'] else '未通过'}。结合CPU和请求延迟判断，本次转折的直接证据集中在应用机计算压力。"]
 else:
  ps += ['3810次/秒首次细分平均响应18.13毫秒、错误率0.34%，独立复核变为94.88毫秒、错误率6.09%。该档在重复运行中出现两种表现，因此完整保留两次数据，采用较低正常端与重复压力端给出复核区间。', '应用CPU未满时继续排查等待。3900次/秒运行在预热阶段09:50:24 UTC取得的线程快照中，40个HTTP工作线程有25个等待MongoDB连接池许可、13个等待socket读取。实际连接池上限为20。该快照显示连接池与数据库返回等待参与响应退化；它对应预热阶段，正式窗口资源另外统计。', '4025次/秒正式窗口数据库I/O等待均值约25.4%。CPU图采用非空闲比例，包含I/O等待；其数值不能全部解释为执行计算。额外/proc磁盘采样中，3840次/秒首次压力档约1378次写I/O/秒、平均写等待约0.50毫秒；虚拟盘忙碌计数约0.18%。这些证据支持持久化响应等待参与退化，硬件磁盘极限仍未由本次指标确定。', f"压力复核应用机最低可用内存{metric(hi,'available_mib',agg='min'):.1f} MiB，内核OOM记录{len(hi.get('oom_lines',[]))}条；应用健康检查{'通过' if hi['healthy_after'] else '未通过'}。当前证据将写入转折定位在连接与持久化响应等待链路，内存仍有余量。"]
 err=resp[hi['name']]['error_messages'];ps.append('压力复核正式窗口的错误类型为：'+'；'.join(f'{k.replace("Non HTTP response message: ","")} {v}次' for k,v in err.items())+'。客户端超时后，服务器仍可能完成已接收的写入，记录增长与全部成功JTL的差额在逐次数据中单独保存。')
 (R/'evidence'/(key+'-analysis.json')).write_text(json.dumps({'paragraphs':ps},ensure_ascii=False,indent=2)+'\n')
 print(key,'analysis paragraphs',len(ps))
