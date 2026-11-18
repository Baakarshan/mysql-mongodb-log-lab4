# 实验四 MySQL 与 MongoDB 日志读写性能对比

作者：温子健 / CHIKIN WEN。

同一日志模型和HTTP接口，比较Spring Data JPA/MySQL与Spring Data MongoDB/MongoDB。四台服务器分两轮复用，Manager全程发压。请求按固定时间间隔启动，与前一请求的完成时间独立。

[PDF报告](report/实验四实验报告.pdf) · [Word报告](report/实验四实验报告.docx) · [逐次结果](results/all-runs.csv) · [分组中位数](results/aggregate.csv) · [核验结果](results/audit.json) · [跟做稿](docs/实验四复现跟做稿.md)

本轮完成42次探索和复测，正式窗口记录1,382,925次请求、1,014,413次错误。此前测量已从当前交付目录移除。每次运行保留原始JTL、逐秒到达计数、监控、实际配置和SHA-256；两套实现分别通过14项接口验收。

## 环境

| 主机 | 配置 | 任务 |
|---|---|---|
| Compiler | 2核，792 MiB | Java 17、Maven 3.9.16构建 |
| Node1 | 2核，约1800 MiB | MySQL 8.4.13与MongoDB 7.0.16分轮运行 |
| Node2 | 2核，792 MiB | Spring Boot 3.3.13，堆256 MiB，连接池20 |
| Manager | 2核，约1800 MiB | Go固定到达率发压，Prometheus 3.7.3，每5秒采样 |

Go 1.26.3编译发压器，GOMAXPROCS=2、软内存目标384 MiB、最多12000个在途请求。数据库缓存约256 MiB，数据库容器上限1 GiB，应用容器上限560 MiB。MySQL提交刷盘且关闭binlog；MongoDB单机，w=1、journal=true。实际版本与配置见evidence。RBAC服务在测量期间暂停，结束后恢复原副本数。

## 测量方法

读写分别从80次/秒开始，按观察提高请求率。低延迟且无错时约加倍；延迟上升后约1.5倍。成功吞吐下降超过20%时复测相邻两档；错误率达到10%、P95达到3500毫秒或健康检查失败时确认失效。严重退化后重启应用，再恢复10万条初始数据与预热。

每档固定速率发起35秒，前10秒预热、后25秒正式测量；随后等待在途请求结束。HTTP总超时5秒、连接超时2秒。正式窗口按实际启动时间划分。单档25秒用于快速定位转折，复测结果逐次保留。

逐秒区分计划到达、实际启动、写入socket、完成和漏发。实际启动比例低于98%、漏发超过1%、进程异常、可用内存低于32 MiB或客户端端口/文件描述符耗尽时标记发压端限制。调度落后100毫秒或在途达到12000时记为漏发。完成速率随服务处理能力波动；图表保留原始波动。应用退出、客户端超时和恢复记录见evidence。

运行名如mysql-read-rps1280-r1，依次表示实现、操作、计划每秒速率与重复编号。summary.json包含启动/发送/成功速率、分位数、错误、资源和记录数核对。all.jtl.gz保留全部请求，warmup.jtl.gz和measurement.jtl.gz分别保留预热与正式窗口。客户端超时后数据库已提交的写入差额逐次列出。

## 原生HTML与截图

JMeter 5.6.3读取Go发压器记录的实际HTTP样本，生成results/html下的原生报告。JMeter承担统计和展示，请求调度由tools/open-load完成。展示副本转换为北京时间、补充线程组前缀、按原因合并含临时端口的传输错误消息；样本数、耗时、状态和原始gzip保持可核对。dashboard-source.json记录转换和源文件哈希。

```bash
python3 -m http.server 18765 --bind 127.0.0.1
```

Edge打开 http://127.0.0.1:18765/results/html/ 。先看Dashboard的源文件、时间、APDEX、饼图与Statistics，再看Over Time、Throughput和Response Times。JMeter吞吐率使用样本起止跨度，CSV使用固定25秒分母。截图来自真实Edge、JMeter和Prometheus页面，正文图题直接说明指标。

## 接口与代码

POST /api/logs写入单条日志，返回201及保存对象。GET /api/logs按level、from、to、page、size查询，[from,to)时间范围，页码从0开始，按createdAt、id降序，统一返回content、page、size、totalElements、totalPages。

字段为id、traceId、level、source、message、clientIp、createdAt；服务端生成26位ULID，UTC时间精确到毫秒，正文最多4096字符。两库建立级别、时间和主键联合索引。固定INFO、UTC 06:00至07:00查询匹配2497条，每页20条并计算总数。

Java遵循Google Java Style，Spotless锁定google-java-format 1.24.0，中文注释说明字段和查询语义。mvn verify检查并构建，mvn spotless:apply整理格式。[课堂实现对照](docs/课堂讲解与实验实现.md)记录老师Repository示例与本项目的对应关系。

## 复现

Java 17、Maven、Docker用于应用和数据库；本机安装Python依赖、Go及JMeter 5.6.3。服务器项目目录为/opt/lab4，配置使用环境变量，模板见.env.example。具体机器分工与输入顺序见跟做稿。

```bash
mkdir -p work
(cd tools/open-load && GOOS=linux GOARCH=amd64 go build -trimpath -o ../../work/open-load .)
# 向Manager上传work/open-load及scripts/run-open.sh、scripts/smoke.py
# 设置LAB_SSH_PASSWORD，暂停共用资源的RBAC服务并保存原副本数
python scripts/open-experiment.py mysql --prepare --output work/rerun
python scripts/open-experiment.py mongo --prepare --output work/rerun
python scripts/reclassify-open.py work/rerun
python scripts/verify-open.py work/rerun
python scripts/analyze-open.py work/rerun
python scripts/generate-adaptive-html.py work/rerun --jmeter /实际路径/apache-jmeter-5.6.3/bin/jmeter
# 恢复RBAC原副本数并逐项确认
```

通过COMPILER_HOST、DATABASE_HOST、APPLICATION_HOST、MONITOR_HOST和SSH_USER覆盖服务器地址。每档会重置实验库；同一时刻只运行一个发压任务。

## 目录

- src、database：两套实现、统一接口、表结构和索引。
- tools/open-load：开放式发压器源码，无第三方Go依赖。
- scripts：部署、逐级探索、异常分类、核验、原生HTML和报告构建。
- jmeter：HTTP请求参考计划；本轮开放式调度使用Go程序。
- results：本轮原始JTL、监控、汇总和原生HTML。
- evidence：部署、接口、配置、故障诊断和恢复证据。
- screenshots：真实页面截图及正文裁切来源。
- report：PDF、Word、Markdown和分析图。
