# 实验四 MySQL 与 MongoDB 日志读写性能对比

作者：温子健 / CHIKIN WEN。

相同日志模型与HTTP接口，比较Spring Data JPA/MySQL和Spring Data MongoDB/MongoDB。四台服务器分两轮复用，Manager使用原生JMeter发压。主指标为平均响应时间（Average ms），同时记录错误率、成功吞吐和P95。

[PDF报告](report/实验四实验报告.pdf) · [Word报告](report/实验四实验报告.docx) · [逐次结果](results/all-runs.csv) · [原始数据页面](results/html/index.html) · [核验结果](results/audit.json) · [跟做稿](docs/实验四复现跟做稿.md)

本轮保留47次探索和诊断，正式窗口记录617,360次请求。逐次状态、均值与发送均匀性见CSV和核验结果。

## 机器与实现

| 主机 | 配置 | 任务 |
|---|---|---|
| Compiler | 2核，792 MiB | Java 17、Maven构建 |
| Node1 | 2核，约1800 MiB | MySQL 8.4.13 / MongoDB 7.0.16，分轮运行 |
| Node2 | 2核，792 MiB | Spring Boot 3.3.13，应用堆256 MiB |
| Manager | 2核，约1800 MiB | JMeter 5.6.3，Prometheus 3.7.3，每5秒采样 |

数据库缓存约256 MiB，数据库容器上限1 GiB，应用容器上限560 MiB。基础连接池20。原配置Tomcat最大工作线程200，内存诊断改为40，两库使用相同修正参数。MySQL每次事务提交刷盘，关闭binlog；MongoDB单机w=1、journal=true。测量期间暂停四项RBAC服务，完成后恢复原副本数，记录见evidence。

POST /api/logs返回201及保存对象。GET /api/logs按level、from、to、page、size查询，时间区间[from,to)，页码从0开始，按createdAt、id降序；两库统一返回content、page、size、totalElements、totalPages。字段为id、traceId、level、source、message、clientIp、createdAt；服务端生成26位ULID，UTC时间精确到毫秒，正文最多4096字符。两库建立level、createdAt、id联合索引。

Java按Google Java Style排版，Spotless锁定google-java-format 1.24.0；中文注释说明字段与查询语义。`mvn verify`检查并构建，`mvn spotless:apply`整理格式。

## 负载与压力

每个JMeter线程只执行一次HTTP请求。5个相同线程组平分总线程数，均以35秒Ramp-up启动，循环次数1，启用delayedStart。每档增加总线程数，实际请求启动率由原生JTL时间戳核验；单次线程本身不保证均匀发送。

每档恢复10万条固定种子日志。前10秒预热，中间20秒测量，最后5秒继续发送以避开结束边界。统计20个完整秒的HPS；最大/最小达到2、存在零启动秒、请求数缺失或发压器失败的运行，标记为发送条件不合格。总线程数与同时活跃线程数分别保存。

读写分别从2800个总线程（计划80次/秒）起步。响应仍快且无错时逐级增加；平均响应明显上升或错误增加时，细分相邻档位、复测转折并检查CPU、逐核CPU、内存、磁盘、GC、连接池和线程状态。连接池20与40作单参数对照，结束后恢复20并检查低负载。CPU未满时继续核对其他资源，不据此直接判定代码问题。

正式平均值包含窗口内全部HTTP样本，成功样本平均值单独保存。失败耗时与错误率共同解释。CSV吞吐量使用固定20秒分母，原生JMeter报告使用样本起止跨度。客户端超时后仍提交的写入，通过完整JTL与数据库记录增长核对。

运行名如`mysql-read-n25200-r1`，表示实现、操作、总线程数与重复编号。每次保存all、warmup、measurement、cooldown四份JTL gzip、监控、应用日志、内核日志、配置与校验值。测试采用短档位逐级定位转折，所有复测逐次列出。

## 查看原始HTML

```bash
python3 -m http.server 18765 --bind 127.0.0.1
```

Edge打开 http://127.0.0.1:18765/results/html/ 。入口链接逐次JSON、CSV、核验结果和原生JMeter页面。Dashboard包括请求饼图和Statistics表；Over Time、Throughput、Response Times展示响应趋势、HPS与百分位。展示副本转换为北京时间并按原因合并传输错误消息，原始gzip保持原样，转换及源文件哈希见dashboard-source.json。

## 复现

准备Java 17、Maven、Docker、Python和JMeter 5.6.3，环境变量模板见.env.example。服务器目录/opt/lab4。先部署数据库和应用、生成种子数据、执行接口检查，再运行测试。

```bash
python3 -m pip install paramiko matplotlib python-docx
# 通过环境设置LAB_SSH_PASSWORD，服务器地址可用下列变量覆盖
python3 scripts/thread-campaign.py --output work/rerun
python3 scripts/thread-memory-diagnosis.py --output work/rerun
python3 scripts/enrich-thread-network.py work/rerun
python3 scripts/analyze-threads.py work/rerun
python3 scripts/prepare-thread-assets.py work/rerun
python3 scripts/generate-adaptive-html.py work/rerun --jmeter /实际路径/apache-jmeter-5.6.3/bin/jmeter
```

通过COMPILER_HOST、DATABASE_HOST、APPLICATION_HOST、MONITOR_HOST、SSH_USER覆盖连接地址。每档重置实验库，同一时刻运行一个发压任务。campaign保存RBAC原副本数并在结束时恢复。初始化部署、页面查看顺序与输入命令见跟做稿。

## 目录

- src、database：两套实现、公共HTTP接口、表结构和索引。
- jmeter/single-shot-logs.jmx：本轮实际执行的每线程一次请求计划。
- scripts：部署、逐级测试、原生HTML、核验和报告构建。
- results：当前原始JTL、监控、汇总与原生HTML。
- evidence：部署、接口、配置、诊断与恢复记录。
- screenshots：真实Edge、JMeter、Prometheus页面及正文配图。
- report：PDF、Word、Markdown与分析图。
