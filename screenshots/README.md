# 实验截图

截图来自 Edge 中实际打开的 JMeter、Prometheus 和实验记录页面。

| 文件 | 内容与来源 |
|---|---|
| `01-prometheus-targets.jpg` | Prometheus Targets，四台主机与应用共五个在线目标 |
| `mysql-api.jpg`、`mongo-api.jpg` | `evidence/*-smoke.json` 的真实接口请求与响应记录页面 |
| `*-deployment.jpg` | `evidence/*-deployment.json` 中保存的实际主机与容器状态 |
| `*-index.jpg` | `evidence/*-database.txt` 中实际数据库版本、索引和执行计划 |
| `jmeter-<运行编号>-time.jpg` | 对应运行正式JTL生成的 JMeter Over Time 页面原图 |
| `jmeter-<运行编号>-percentile.jpg` | 对应运行正式JTL生成的 JMeter Response Times 页面原图 |
| `*-read-t200-r1-prometheus-cpu.jpg` | 对应查询运行正式120秒窗口的主机CPU曲线 |
| `*-read-t200-r1-prometheus-memory.jpg` | 同一正式窗口的主机可用内存曲线，单位MiB |

`jmeter-manifest.json` 记录原图与运行编号、图表种类的对应关系。`rect` 是页面DOM区域；`screenshotRect` 是经原图核对的实际像素裁切区域。`*-panel.jpg` 和 `*-comparison.jpg` 由保存的原图裁切、组合，正文使用组合图，原图保留全部页面上下文。`*-api-report.jpg` 是对应接口长截图的正文裁切版。

实验记录页面由 `scripts/evidence-pages.py` 直接读取保存的命令与HTTP响应记录生成。页面内容可与同名JSON、TXT逐项核对。JMeter页面显示上海时区时间，Prometheus页面显示UTC时间；运行编号的 `summary.json` 使用UTC epoch毫秒时间戳。
