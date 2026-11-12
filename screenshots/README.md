# 实验截图

截图来自JMeter与Prometheus原生页面、Edge开发者工具Network和作者提供的Ghostty终端原图。

| 文件 | 内容 |
|---|---|
| `01-prometheus-targets.jpg` | 应用与四台主机共五个在线采集目标 |
| `jmeter-<运行编号>-time.jpg` | 正式测量的响应时间趋势 |
| `jmeter-<运行编号>-percentile.jpg` | 正式测量的响应时间百分位 |
| `jmeter-*-summary-native.*` | 原生Dashboard的APDEX、请求饼图和Statistics表 |
| `*-read-t200-r1-prometheus-cpu.jpg` | 查询200线程第1次重复正式窗口的主机CPU |
| `*-read-t200-r1-prometheus-memory.jpg` | 同一正式窗口的主机可用内存，单位MiB |
| `*-api-*-native.png` | Network的POST Headers、Payload、Response及GET Headers、Response、Preview |
| `*-ghostty-native.png` | 数据库日志记录、记录数、联合索引和执行计划 |

MongoDB的JMeter及Prometheus图对应2026年11月12日Repository实现重跑，MySQL图对应保留的原36组测量。JMeter显示上海时区，Prometheus显示UTC；每次运行的 `summary.json` 保存UTC epoch毫秒时间戳。

`jmeter-manifest.json` 记录运行编号、曲线种类和裁切区域，`jmeter-summary-manifest.json` 记录汇总页来源及原图SHA-256。报告中的 `*-pair.jpg` 和 `*-summary-report.jpg` 由这些原图裁切组合，完整原图保留页面上下文。`scripts/prepare-screenshots.py` 和 `scripts/prepare-native-screenshots.py` 可重新生成。

接口请求由本机客户端经HTTP转发、SSH隧道连接Node2，Network中显示127.0.0.1:18081。四次演示请求及响应保存在 `evidence/interface-recapture.json`，每库新增1条演示日志。正式性能测试由Compiler通过内网直连Node2。

MongoDB记录原图拍摄于2026年11月12日13:13:26 UTC（北京时间21:13:26），显示776260条记录；其余Ghostty原图拍摄于11月11日。`ghostty-manifest.json` 保存原图校验值、裁切坐标与组合顺序，`scripts/prepare-ghostty.py` 可重新生成报告图片。Repository重跑后的记录数另见 `evidence/mongo-records-recapture.txt`。
