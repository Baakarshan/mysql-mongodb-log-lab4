"""Write the public entry point using audited progressive results."""
import argparse
import json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);a=p.parse_args();r=a.bundle
s=json.loads((r/'results/audit.json').read_text())
t=f'''# 实验四 MySQL 与 MongoDB 日志读写性能对比

作者：温子健 / CHIKIN WEN。

使用同一日志模型和HTTP接口，比较Spring Data JPA/MySQL与Spring Data MongoDB/MongoDB。四台服务器分两轮复用；每档恢复相同的10万条初始日志，再按观测逐级提高并发。当前结果为本轮重新测量，已替换此前固定档位数据。

[PDF报告](report/实验四实验报告.pdf) · [Word报告](report/实验四实验报告.docx) · [逐次结果](results/all-runs.csv) · [分组中位数](results/aggregate.csv) · [核验结果](results/audit.json) · [跟做稿](docs/实验四复现跟做稿.md)

完成{s['runs']}次探索及复测，正式窗口共{s['measurement_samples']:,}次请求、{s['measurement_errors']:,}次错误。两套实现各通过14项接口验收。gzip原始JTL、窗口划分、SHA-256与Prometheus原始响应均按运行名保存。

## 环境

| 主机 | 配置 | 任务 |
|---|---|---|
| Compiler | 2核，792 MiB | Java 17、Maven 3.9.16编译；JMeter 5.6.3初始探索 |
| Node1 | 2核，1800 MiB | MySQL 8.4.13与MongoDB 7.0.16分轮运行 |
| Node2 | 2核，792 MiB | Spring Boot 3.3.13，堆256 MiB，连接池20 |
| Manager | 2核，1800 MiB | Prometheus 3.7.3，5秒采样；高并发补测发压 |

Compiler在高线程运行中达到内存或CPU限制，随后使用Manager补测。Manager的256 MiB发压堆在高线程处耗尽后扩至512 MiB；两库按相同设置补测。按发压主机及堆上限分别汇总；两库在相同发压主机和共同档位比较。RBAC服务在测量期间暂停，完成后恢复原副本数，记录见evidence。

## 方法与结果读取

JMeter采用每线程最多600次有限循环，吞吐量定时器控制节奏，目标为线程数×10次/秒。每档5秒升压、5秒预热、25秒正式窗口。未饱和时约加倍递增；吞吐落后目标或延迟上升时缩小增幅。吞吐下降超过20%时复测前一档及当前档；明显退化、错误和恢复分别记录。发压端资源耗尽单独分类。

负载部分观察稳定到达率、响应时间及内部资源；压力部分继续加并发，观察吞吐平台、排队和失败。固定循环次数本身不能保证HPS稳定；实际逐秒HPS、5秒分箱及变异系数保存在summary.json。原始波动保留。

运行目录名如mysql-read-t384-r2，表示实现、操作、线程数、重复编号。summary.json记录发压主机、目标/实际速率、P50/P95/P99、错误、记录数及资源分类。config.json记录JMX哈希及运行参数；all.jtl.gz保留完整原始行，measurement.jtl.gz为固定25秒窗口。

JMeter原生HTML位于results/html。可在仓库根目录执行 `python3 -m http.server 18765 --bind 127.0.0.1`，再用Edge打开 http://127.0.0.1:18765/results/html/ 。Dashboard含APDEX、请求饼图与Statistics；Charts含趋势和百分位。JMeter吞吐率按样本起止跨度计算，CSV按固定25秒计算，数值可有小幅差异。

## API与代码

POST /api/logs单条写入，返回201及保存对象。GET /api/logs按level、from、to、page、size查询，时间范围[from,to)，页码从0开始，按createdAt、id降序，返回content、page、size、totalElements、totalPages。

字段为id、traceId、level、source、message、clientIp、createdAt；服务端生成26位ULID，UTC时间精确到毫秒，正文最长4096字符。两库建立级别、时间、主键联合索引。固定INFO、UTC 06:00至07:00查询匹配2497条，每页20条，并计算匹配总数。

Java遵循Google Java Style，Spotless锁定google-java-format 1.24.0。`mvn verify`检查并构建，`mvn spotless:apply`整理格式。MySQL与MongoDB分别限定仓储扫描包，公共业务接口一致。老师Repository示例的对应关系见[课堂实现对照](docs/课堂讲解与实验实现.md)。

## 运行

安装Java 17、Maven、Docker、JMeter 5.6.3以及requirements.txt依赖。各服务器项目目录为/opt/lab4，配置通过环境变量与.env.example填写。生成、部署、重置和监控脚本分别为generate-data.py、deploy.sh、reset-db.sh、deploy-monitoring.sh；完整输入顺序见跟做稿。

应用堆256 MiB，数据库缓存预算约256 MiB、容器上限1 GiB。MySQL每次提交刷盘并关闭binlog；MongoDB单机WiredTiger，w=1、journal=true。实际版本、索引和设置见evidence。

本机通过LAB_SSH_PASSWORD提供SSH口令，可用COMPILER_HOST、DATABASE_HOST、APPLICATION_HOST、MONITOR_HOST、SSH_USER覆盖地址：

```bash
python scripts/adaptive-experiment.py mysql --prepare --output work/rerun --start 8
python scripts/adaptive-experiment.py mongo --prepare --output work/rerun --start 8
# 发压机资源不足时，在已安装相同工具的Manager补测
python scripts/adaptive-experiment.py mongo --output work/rerun --generator monitor --generator-heap 512 --operation read --start 384 --max-threads 7200
python scripts/diagnose-adaptive.py work/rerun
python scripts/verify-adaptive.py work/rerun
python scripts/analyze-adaptive.py work/rerun
python scripts/generate-adaptive-html.py work/rerun --jmeter /实际路径/apache-jmeter-5.6.3/bin/jmeter
```

每档前重置实验数据；同一时刻运行一个发压任务。原始文件校验和、正式行数、失败数、HPS计数与数据库增长由verify-adaptive.py复核。

## 目录

- src、database：两套持久化实现、统一接口、表结构和索引。
- jmeter/adaptive-logs.jmx：两库共用的有限循环与节奏控制计划。
- scripts：部署、逐级探索、异常分类、核验、HTML和报告构建。
- results：本轮JTL、监控、汇总与原生HTML。
- evidence：构建、部署、接口、实际配置、诊断和恢复记录。
- screenshots：实际Edge、JMeter、Prometheus页面。
- report：PDF、Word、Markdown及分析图；正文不放终端截图。
'''
(r/'README.md').write_text(t)
