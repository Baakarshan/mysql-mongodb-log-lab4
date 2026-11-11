# 实验报告

作者：温子健；英文署名：CHIKIN WEN。

- [PDF 报告](实验四实验报告.pdf)：20页，含28幅图和7张表。
- [可编辑 Word 报告](实验四实验报告.docx)：与PDF对应的正文、表格和截图。
- [正文 Markdown](实验四实验报告.md)：便于检索和版本比较。
- `figures/`：从原始测量和监控数据生成的分析图。

报告先写负载测试，再写逐级压力测试。采用单栏排版，含中英文标题、摘要、关键词、编号章节、图表题注和参考文献。正文中文字体设为宋体；本次PDF导出使用 Noto Serif CJK SC 字体映射，保留完整中文字符。标题黑体、作者仿宋、中文摘要楷体，字体字号对照见[排版说明](排版说明.md)。报告已逐页检查。

测量数据见 `../results/`，实际页面原图及裁切关系见 `../screenshots/`，环境和接口验收记录见 `../evidence/`。运行 `python3 scripts/build-report.py` 可重建Word和Markdown；PDF由Word导出。

本次修订已替换图2、图3为Edge Network原图，并补入JMeter原生饼图、APDEX与Statistics表格。图4—7已使用作者提供的Ghostty终端原图，包含两库实际记录、联合索引和执行计划。操作命令见[Ghostty截图操作](../docs/Ghostty截图操作.md)。
