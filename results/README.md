# 实测数据

72次正式测量，每次120秒。两种实现、查询与写入、六个并发档位，每档重复三次。

- `audit.json`：完整性、正式请求数、错误数和记录数核对结果。
- `all-runs.csv`：每次测量的性能统计。
- `aggregate.csv`、`aggregate.json`：各档三次结果的中位数、最小值和最大值。
- `resources.csv`：各次正式窗口中四台主机的CPU、可用内存、磁盘读写统计。
- `selected-levels.json`：报告代表性曲线的并发档位。
- `runs/<实现>-<操作>-t<线程>-r<重复>/`：单次完整材料。

单次目录中，`all.jtl.gz` 是原始完整JTL的无损压缩，含时钟采样；`original.json` 保存原文件及gzip文件的SHA-256。`warmup.jtl.gz` 保存10秒升压与30秒预热的HTTP请求，`measurement.jtl.gz` 保存正式120秒窗口，`cooldown.jtl.gz` 保存窗口结束后的收尾HTTP请求。正式窗口按请求开始时间选择，HTTP响应耗时保留完整值。

`summary.json` 中的 `measurement_start_ms` 和 `measurement_end_ms` 使用UTC epoch毫秒时间。`backend、operation、threads、repeat、name` 将数据与截图、监控序列对应。所有运行共用仓库中的JMX、应用源代码和运行参数，配置见主README及报告第2、3节。

吞吐量单位为次/秒，响应时间单位为毫秒，错误率为0至1的比例。`monitoring.json` 保存Prometheus query_range原始响应，采样间隔为5秒；CPU指标采用30秒rate窗口。资源CSV按相同正式窗口汇总。

核验与重建：

```bash
python3 scripts/audit.py --complete
python3 scripts/analyze.py
python3 scripts/verify-delivery.py
```
