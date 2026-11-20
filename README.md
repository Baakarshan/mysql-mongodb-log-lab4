# 实验四 MySQL 与 MongoDB 日志读写性能对比

作者：温子健 / CHIKIN WEN、郑本壹 / Benyi Zheng。

同一日志模型、相同HTTP接口和请求数据，比较Spring Data JPA/MySQL与Spring Data MongoDB/MongoDB的读取和写入。四台服务器分两轮复用，以平均HTTP响应时间为主指标，逐级提高均匀发送的负载并复核响应转折。

[完整PDF](report/实验四实验报告.pdf) · [Word](report/实验四实验报告.docx) · [四类原始结果](results/lab4-complete-20261119/index.html) · [逐次CSV](results/lab4-complete-20261119/results/all-runs.csv) · [核验结果](results/lab4-complete-20261119/results/audit.json)

## 提交材料直达

| 材料 | 直接链接 |
|---|---|
| Spring Data JPA / MySQL 实现 | [MySQL 实现源码](src/main/java/edu/lab4/mysql/) · [MySQL 配置](src/main/resources/application-mysql.yml) |
| Spring Data MongoDB 实现 | [MongoDB 实现源码](src/main/java/edu/lab4/mongo/) · [MongoDB 配置](src/main/resources/application-mongo.yml) |
| 数据库初始化脚本 | [MySQL 表与索引](database/mysql.sql) · [MongoDB 索引](database/mongo.js) · [生成相同初始数据](scripts/generate-data.py) · [重置并导入10万条日志](scripts/reset-db.sh) |
| JMeter JMX 文件 | [测试计划](jmeter/single-shot-logs.jmx) · [各次运行目录](results/lab4-complete-20261119/results/runs/)（每次运行保留实际使用的 run.jmx） |
| 运行说明 | [逐档复现](#逐档复现) · [完整复现跟做稿](docs/实验四复现跟做稿.md) · [环境变量示例](.env.example) · [部署脚本](scripts/deploy.sh) |
| JMeter 原始 JTL | [全部57次运行](results/lab4-complete-20261119/results/runs/) · [四类数据索引](results/lab4-complete-20261119/index.html) · [SHA-256 校验值](results/lab4-complete-20261119/SHA256SUMS) |
| 实验报告 | [PDF](report/实验四实验报告.pdf) · [Word](report/实验四实验报告.docx) · [Markdown](report/实验四实验报告.md) |

原始 JTL 以无损 gzip 保存，各次运行包含全部请求、预热、正式测量和收尾数据。HTML 页面下载仓库后按[查看原始页面](#查看原始页面)启动本地服务查看。

账号、密码和令牌通过环境变量或本机配置提供；公开材料已完成凭据扫描，`.env`、`*.env` 与私有工作目录由 `.gitignore` 排除。

## 四类测试

| 实现 | 操作 | 原生JMeter报告 |
|---|---|---|
| MySQL | 读取 | [Dashboard](results/lab4-complete-20261119/groups/mysql-read/results/html/mysql-read-comparison/index.html) |
| MySQL | 写入 | [Dashboard](results/lab4-complete-20261119/groups/mysql-write/results/html/mysql-write-comparison/index.html) |
| MongoDB | 读取 | [Dashboard](results/lab4-complete-20261119/groups/mongo-read/results/html/mongo-read-comparison/index.html) |
| MongoDB | 写入 | [Dashboard](results/lab4-complete-20261119/groups/mongo-write/results/html/mongo-write-comparison/index.html) |


本轮核验57次正式运行、1,985,668条正式请求；所有正式档位发送核验通过。

| 类别 | 正常复核 次/秒 | 均值 ms | 压力复核 次/秒 | 均值 ms | 压力错误率 |
|---|---:|---:|---:|---:|---:|
| MySQL读取 | 1200 | 11.13 | 1225 | 75.97 | 0.00% |
| MySQL写入 | 3960 | 27.71 | 3990 | 42.94 | 1.35% |
| MongoDB读取 | 1190 | 8.09 | 1225 | 109.02 | 0.00% |
| MongoDB写入 | 3775 | 17.27 | 3840 | 98.30 | 7.75% |

MongoDB写入3810次/秒的两次运行表现不同，完整保留；采用3775至3840次/秒作为复核区间。测试结束已恢复四项RBAC服务至1/1、Compiler Docker与共享MySQL，实验应用已停止。证据见[恢复核验](results/lab4-complete-20261119/evidence/final-restoration.json)。

## 环境

| 主机 | 配置 | 工作 |
|---|---|---|
| Compiler | 2核 792 MiB | 构建与辅助发送 |
| Node1 | 2核 1800 MiB | MySQL / MongoDB 分轮运行 |
| Node2 | 2核 792 MiB | 当前应用，读取堆192 MiB 写入堆128 MiB，Tomcat40 |
| Manager | 2核 1800 MiB | 主要发送与Prometheus |

Java17、Spring Boot3.3.13、MySQL8.4.13、MongoDB7.0.16、JMeter5.6.3、Prometheus3.7.3。两库连接池20，写入Tomcat连接上限256、接受队列256，缓存约256 MiB；MySQL事务提交刷盘且关闭binlog，MongoDB为w=1、journal=true。测试期间暂停四项RBAC服务，测试结束停止实验应用并恢复原副本数，实际恢复状态见results/lab4-complete-20261119/evidence/rbac-restoration.json。

## 方法

每档恢复相同的10万条日志。查询INFO级别、UTC2026-11-01 06:00至07:00、第一页20条，匹配2497条。POST单条写入，两库相同字段规则。GET采用[from,to)、从0开始分页，并按createdAt、id降序。正文最多4096字符，时间保存到毫秒。

两台发送机按约4:1分担速率，各5个Open Model Thread Group使用even_arrivals。Compiler发压时停止Docker释放内存，该机资源由每秒/proc记录核验。每个逻辑线程只发一次请求。启动前等待5秒，发送55秒，前30秒预热，正式窗口为第30至50秒。总逻辑线程数N=计划速率×55，同时活跃线程数单独记录。读取连接及响应超时2秒，写入连接超时200毫秒、响应超时500毫秒；同一操作两库保持一致。

正式20秒窗口逐秒HPS相对均值偏差、首尾各5秒均值之差、均值相对计划速率偏差均须不超过10%。同时检查请求总数、线程唯一性、JMeter退出状态、可用内存、线程创建错误和任务配额命中。预热初段计数保留在sender-audit.json。发送失败的运行单列排查并重测。

平均响应超过50毫秒、错误率超过1%或应用健康异常时，细分相邻档并独立复核。主机CPU、逐核CPU、内存、GC、连接池等待、线程栈与数据库状态用于解释转折。Prometheus每1秒采集、每2秒计算，查询步长2秒；报告包含应用机蓝色与数据库机橙色的Stacked和Unstacked资源图。

## 逐档复现

先按`.env.example`配置服务器、内网地址和数据库凭据，将构建产物、初始化数据和脚本放在各机`/opt/lab4`。暂停同机其他课程服务，确认应用、数据库、主机Exporter与Prometheus连通。SSH密码在本机环境变量`LAB_SSH_PASSWORD`提供。

首档加`--prepare`，后续档去掉该参数。同一类别逐级提高`--rate`，检查每档HPS和发送端资源，响应转折后细分、重启应用并复核两端，再切换下一类别。每档自带30秒预热与20秒正式窗口。

```bash
python3 scripts/certified-stage.py mysql read --rate 80 --output results/reproduction --prepare
python3 scripts/certified-stage.py mysql read --rate 320 --output results/reproduction
python3 scripts/certified-stage.py mysql write --rate 80 --output results/reproduction --prepare
python3 scripts/certified-stage.py mongo read --rate 80 --output results/reproduction --prepare
python3 scripts/certified-stage.py mongo write --rate 80 --output results/reproduction --prepare
```

发送核验失败的档位退出码为1，数据仍保存以供排查。结束后停止实验应用，启动原MySQL容器，并恢复先前暂停的课程服务。

## 查看原始页面

在仓库根目录运行：

```bash
python3 -m http.server 18772 --bind 127.0.0.1 --directory results/lab4-complete-20261119
```

Edge打开 http://127.0.0.1:18772/ 。入口提供四类筛选、原始JTL、监控JSON和四份原生JMeter报告。JMeter展示UTC+8，Prometheus展示UTC，原始数据用Unix毫秒关联。平均响应包含失败耗时，错误率同时展示；固定20秒吞吐与原生JMeter的样本跨度吞吐分开记录。

## 运行与代码

准备Java17、Maven、Docker、Python及JMeter5.6.3。环境配置见.env.example，凭据通过环境变量填写。`mvn verify`执行Google Java格式检查并构建；`mvn spotless:apply`整理格式。中文注释说明模型、查询和持久化语义。写入轮次在app.env设置`SERVER_TOMCAT_MAX_CONNECTIONS=256`、`SERVER_TOMCAT_ACCEPT_COUNT=256`，以`APP_HEAP_MIB=128 bash scripts/deploy.sh app`部署；读取使用默认192 MiB堆与连接设置。

- src、database：两套持久化实现、公共接口、表与索引。
- jmeter：每线程一次请求的JMX。
- scripts：部署、发送、1秒采集2秒计算、原始数据核验、原生HTML与报告构建。
- results/lab4-complete-20261119：当前四类实验数据，包含all、warmup、measurement、cooldown JTL的gzip及配置和监控。
- results/lab4-complete-20261119/screenshots：报告真实界面截图；original保留未标注图。
- report：完整PDF、Word和Markdown。

写入记录数结合全部JTL成功数核对；客户端超时后服务器仍可能提交，额外增长单独记录。gzip文件无损压缩，SHA256SUMS保存校验值。
