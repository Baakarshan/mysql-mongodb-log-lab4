# 实验截图

截图包含JMeter与Prometheus原生页面、Edge开发者工具Network，以及旧版实验记录展示页面。各类来源见下表。

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

`jmeter-manifest.json` 记录原图与运行编号、图表种类的对应关系。`rect` 是页面DOM区域；`screenshotRect` 是经原图核对的实际像素裁切区域。`*-panel.jpg` 和 `*-comparison.jpg` 由保存的原图裁切、组合，正文按档位使用`*-pair.jpg`并排展示同一次运行的趋势与百分位图，原图保留全部页面上下文。`prometheus-cpu-comparison.jpg`并排展示两库查询200线程的Prometheus页面。`*-api-report.jpg` 是对应接口长截图的正文裁切版。

实验记录页面由 `scripts/evidence-pages.py` 直接读取保存的命令与HTTP响应记录生成。页面内容可与同名JSON、TXT逐项核对。JMeter页面显示上海时区时间，Prometheus页面显示UTC时间；运行编号的 `summary.json` 使用UTC epoch毫秒时间戳。


本次新增原生截图：

| 文件 | 内容与来源 |
|---|---|
| `*-api-*-native.png` | Edge DevTools Network独立窗口原图，每库包含POST Headers、Payload、Response及GET Headers、Response、Preview |
| `*-api-network-report.jpg` | 上述POST Headers、Payload、Response与GET Preview四块原图纵向裁切组合，替换正文图2、图3 |
| `jmeter-*-summary-native.png` | 12组原生Dashboard汇总页，含APDEX、Requests Summary及Statistics |
| `jmeter-*-summary-report.jpg` | 汇总页APDEX、饼图、Statistics区域的裁切组合 |

`jmeter-summary-manifest.json`保存12组运行、页面来源、原图校验值及裁切坐标。`*-api-network-crops.json`保存接口组合图的裁切坐标。原图内容保持不变，裁切去除空白区域，组合块之间留白。

接口补拍通过本机HTTP请求客户端、转发器及SSH隧道连接Node2，源地址显示为127.0.0.1:18081。请求客户端只负责发起真实请求；报告使用Network面板截图。四次请求与响应保存在`evidence/interface-recapture.json`，两库各增加1条演示日志。正式性能测试继续使用Compiler经内网直连Node2的原有JTL。

旧版`*-api.jpg`及对应`*-api-report.jpg`保留作历史材料，新版正文已使用Network原图。数据库图4—7当前沿用旧版展示，收到Ghostty终端原图后替换；操作见`docs/Ghostty截图操作.md`。
