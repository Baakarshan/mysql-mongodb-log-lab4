# 实验报告

作者：温子健 / CHIKIN WEN。

PDF与Word使用同一正文，按实验报告样例采用单栏、中英文题名与摘要、关键词、编号章节、图表题注和参考文献。负载表现、逐级压力与异常排查分别呈现。

运行数据见 ../results/all-runs.csv，原始JTL、配置、监控序列与校验值按运行名保存。原生JMeter截图保留完整页面，正文图的裁切位置见 ../screenshots/native-manifest.json。

构建：使用含python-docx的Python运行 `scripts/build-report.py`；使用文档渲染器导出PDF并逐页检查。
