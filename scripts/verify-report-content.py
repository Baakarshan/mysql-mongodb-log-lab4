"""复核最终报告涵盖四类、署名与图表，并排除撤回的过程描述。"""
from pathlib import Path
import sys,re,json
from docx import Document
R=Path(sys.argv[1]);d=Document(R/'report/实验四实验报告.docx');text='\n'.join(p.text for p in d.paragraphs)
for required in ['MySQL 读取','MySQL 写入','MongoDB 读取','MongoDB 写入','CHIKIN WEN','负载测试','压力','Hits Per Second','参考文献']:assert required in text,required
for forbidden in ['补拍','Ghostty原图','ghost 原图','临时实验报告']:assert forbidden not in text,forbidden
assert len(d.inline_shapes)>=30
figs=[p.text for p in d.paragraphs if re.match(r'^图\d+　',p.text)];assert [int(re.match(r'^图(\d+)',t).group(1)) for t in figs]==list(range(1,len(figs)+1))
print(json.dumps({'categories':4,'figures':len(figs),'tables':len(d.tables),'author':'温子健 / CHIKIN WEN','checks':'passed'},ensure_ascii=False))
