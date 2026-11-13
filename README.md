# 实验四 MySQL 与 MongoDB 日志读写性能对比

作者：温子健。署名：郑本壹。课程实验，使用四台 Ubuntu 18.04 云主机，分两轮测试同一日志业务的 JPA/MySQL 与 Spring Data MongoDB/MongoDB 实现。

已完成72次正式测量，共 **20,576,002次请求，0次错误**。两套实现各通过14项接口检查，全部运行的数据库记录数核对通过。

[PDF实验报告](report/实验四实验报告.pdf) · [Word实验报告](report/实验四实验报告.docx) · [全部测量结果](results/all-runs.csv) · [资源统计](results/resources.csv)

以下为200线程档3次测量的中位数，完整档位及重复结果见 `results/`。

| 实现 | 操作 | 吞吐量 次/秒 | P95 ms |
|---|---|---:|---:|
| MongoDB / Spring Data | 查询 | 1119.7 | 280.0 |
| MongoDB / Spring Data | 写入 | 4142.7 | 95.0 |
| MySQL / JPA | 查询 | 1258.0 | 305.0 |
| MySQL / JPA | 写入 | 4608.5 | 123.0 |

## 目录

- `src/`：公共日志模型、REST API、JPA 与 MongoDB 持久化实现。
- `database/`：MySQL 表结构和 MongoDB 联合索引。
- `scripts/`：确定性数据生成、部署、重置、接口验收、压测、统计和报告脚本。
- `jmeter/logs.jmx`：共用读写测试计划，通过参数切换操作和目标。
- `results/runs/`：各次测量的完整原始 JTL 无损压缩、窗口分组、校验值、统计与监控序列。
- `evidence/`：环境、版本、查询计划、接口检查和预试验记录。
- `screenshots/`：实际页面截图。
- `report/`：PDF 与可编辑 Word 报告。

## 四机两轮

| 主机 | 配置 | 任务 |
|---|---|---|
| Compiler | 2核，系统可见792 MiB | Java 17、Maven 编译；JMeter 5.6.3 压测 |
| Node1 | 2核，系统可见1800 MiB | 第一轮 MySQL 8.4.13，第二轮 MongoDB 7.0.16 |
| Node2 | 2核，系统可见792 MiB | 第一轮 mysql profile，第二轮 mongo profile |
| Manager | 2核，系统可见1800 MiB | Prometheus 3.7.3，5秒采样 |

四台主机均安装 node_exporter 1.10.2。编译和压测分时运行，同一时刻只启动一种数据库与对应应用。

## API

`POST /api/logs`，成功返回 HTTP 201 和日志对象，服务端生成26位 ULID。

```json
{"traceId":"demo-1","level":"INFO","source":"course","message":"实验日志","clientIp":"127.0.0.1","createdAt":"2026-11-01T06:30:00.123Z"}
```

`GET /api/logs?level=INFO&from=2026-11-01T06:00:00Z&to=2026-11-01T07:00:00Z&page=0&size=20`

返回 `content、page、size、totalElements、totalPages`。时间范围为 `[from,to)`，按 `createdAt DESC,id DESC` 排序；MongoDB 中 `id` 映射为 `_id`。页码从0开始，size为1至100。时间统一为UTC毫秒精度，message最长4096字符。非法输入返回400。

## 代码规范与中文注释

Java采用Google Java Style，固定google-java-format 1.24.0，由Spotless在Maven validate阶段检查。`mvn spotless:apply`整理格式，`mvn verify`检查并构建。业务字段、ULID、时间边界、分页、事务与写入确认均有中文注释。[代码说明](docs/代码规范与实验实现.md)记录阅读顺序与验证方法。

报告先展示基础负载测试，再展示逐级压力测试；两章使用相同阶梯并发测量，保留原始时间顺序。正文已按档位纳入24张JMeter趋势与百分位截图。[排版说明](report/排版说明.md)列出对照样例的字体与字号。

## 与课堂实现的对应

老师代码位于 [spring-fundamentals](https://gitee.com/mingqcn/spring-fundamentals) 的 `6.SpringData_Mongo/order`，核对版本为 `854d0e09`。本实验使用 `MongoRepository.insert` 和条件分页查询，日志模型及接口按实验四要求实现。[实现对照](docs/课堂讲解与实验实现.md)说明订单主键读取、日志条件分页和部署方式的差异。

MongoDB访问方式修订后，读写36组正式测量全部重跑。MySQL和公共方法指令、依赖及配置核对一致，保留原36组测量。代码版本、部署JAR及源文件校验值见 `evidence/repository-revision.json`。

## 构建与部署

前提：Docker、Java 17、Maven、Python 3.12（本机分析）、JMeter 5.6.3。本机分析与控制脚本使用 `python3 -m pip install -r requirements.txt` 安装依赖；服务器的数据生成与接口验收脚本使用 Python 标准库。实际运行的版本、镜像摘要和查询计划见 `evidence/`。

1. 将项目放到各机 `/opt/lab4`。Compiler 执行 `mvn -s scripts/maven-settings.xml -B package`，把 `target/log-benchmark-1.0.0.jar` 复制到 Node2 的 `/opt/lab4/app.jar`。
2. Node1 执行 `python3 scripts/generate-data.py /opt/lab4/fixtures`，生成相同的10万条种子日志。生成器的随机种子为20261111，时间覆盖2026年11月1日UTC全天。
3. 在 Node1 创建权限为600的 `/opt/lab4/db.env`，填写 `DB_USER=lab4` 和自行设置的 `DB_PASSWORD`。Node2 的 `/opt/lab4/app.env` 填写相同凭据、`DB_HOST` 和 `SPRING_PROFILES_ACTIVE=mysql`。配置示例见 `.env.example`。
4. Node1 执行 `bash scripts/deploy.sh mysql`。数据库就绪后，执行 `source /opt/lab4/db.env`，再执行 `docker exec -i -e MYSQL_PWD="$DB_PASSWORD" lab4-mysql mysql -uroot < database/mysql.sql` 和 `bash scripts/reset-db.sh mysql`。
5. Node2 执行 `bash scripts/deploy.sh app`。每台主机部署 node_exporter，Manager 使用 `scripts/prometheus.yml` 部署 Prometheus；端口分别为9100、19090，应用端口为18080。
6. 第一轮完成后停止 MySQL、移除应用容器；Node1 执行 `bash scripts/deploy.sh mongo`、`bash scripts/reset-db.sh mongo`，将 Node2 profile 改为mongo，再启动应用。数据库之间复用相同主机与存储设备。

项目中的内网地址对应本次实验，复现时替换为实际地址。数据库 cache预算均为256 MiB、容器内存上限均为1 GiB；应用堆256 MiB、容器上限560 MiB。MySQL采用 InnoDB、每次事务提交刷盘、关闭二进制日志；MongoDB采用单机WiredTiger，`w=1,journal=true`。

## 测试与复核

Compiler 执行 `python3 scripts/smoke.py` 验证初始化查询、分页、字段校验和时间边界。共用JMX通过 `-Joperation=read|write` 选择操作。

`bash scripts/run-one.sh read 10 /opt/lab4/results/example` 会记录10秒升压、30秒预热及120秒正式测量。`python3 scripts/summarize-run.py /opt/lab4/results/example` 将原始行分为 `warmup.jtl.gz` 和 `measurement.jtl.gz`，正式结果排除升压与预热。JMeter设置中的 `JMETER_HOME` 可覆盖安装位置；本次沿用服务器已有的 `/opt/lab3/tools/apache-jmeter-5.6.3`。

完整流程使用 `scripts/experiment.py`，运行前通过环境变量 `LAB_SSH_PASSWORD` 提供SSH口令；可通过 `COMPILER_HOST、DATABASE_HOST、APPLICATION_HOST、MONITOR_HOST、SSH_USER` 指定主机。脚本先测MySQL，再切换MongoDB；每次运行前重置10万条日志。并发档位为1、10、25、50、100、200，每档读写各重复3次，总计72次正式测量。

单独重跑已部署的MongoDB链路，可执行以下命令；脚本输出到独立目录，完成后核验36组结果：

```bash
export LAB_SSH_PASSWORD='填写实验服务器口令'
python3 scripts/rerun-backend.py mongo work/repository-rerun
```

每次运行的 `all.jtl.gz` 是原始完整JTL的无损压缩，`original.json` 保存解压后原文件与压缩文件的SHA-256。升压预热、正式120秒和收尾请求另存为分组JTL。

每次运行的 `summary.json` 记录请求数、吞吐量、错误率、平均值、P50/P95/P99、原始文件SHA-256和数据库记录数核对。吞吐量按正式120秒计算；百分位采用排序后线性插值。`monitoring.json` 保存 Prometheus query_range 原始响应，图表使用相同正式测量窗口。

```bash
# 查看原始JTL，保留原文件
 gzip -dc results/runs/mysql-read-t1-r1/measurement.jtl.gz | head
# JMeter HTML报告生成示例，建议在本机生成，避免与服务器压测争用资源
 gzip -dc results/runs/mysql-read-t1-r1/measurement.jtl.gz > /tmp/run.jtl
 jmeter -g /tmp/run.jtl -q scripts/jmeter.properties -Jjmeter.reportgenerator.statistic_window=2000000 -o /tmp/run-html
```

所有数值以本次真实测量为准。仓库不保存服务器口令和数据库运行凭据。

## 从结果重新生成图表

```bash
python3 scripts/audit.py --complete
python3 scripts/analyze.py
python3 scripts/generate-html.py --jmeter /path/to/apache-jmeter-5.6.3/bin/jmeter
python3 scripts/prepare-screenshots.py
python3 scripts/prepare-native-screenshots.py
python3 scripts/prepare-ghostty.py
python3 scripts/build-report.py
```

`analyze.py` 从测量JTL和监控序列生成论文图表。`generate-html.py` 将原始毫秒时间戳转换为上海时区日期的临时展示副本，输出至忽略目录 `work/html/`；原始JTL保持不变。JMeter百分位统计窗口设为200万条，大于单次正式测量的采样数。报告中的自绘百分位使用完整正式窗口数据计算。

本次报告修订采用英文署名 CHIKIN WEN，报告文件名统一为“实验四实验报告”。已补拍两库的Edge Network接口图和12组JMeter原生汇总页；正文新增读写200线程的APDEX、请求饼图及Statistics截图。图4—7已替换为作者提供的5张Ghostty真实终端原图，原图、裁切坐标与校验值见 `screenshots/ghostty-manifest.json`。[截图复现命令](docs/Ghostty截图操作.md)。
