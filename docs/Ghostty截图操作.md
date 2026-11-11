# Ghostty 数据库截图

四张原图分别用于 MySQL 记录、MongoDB 记录、MySQL 索引与执行计划、MongoDB 索引与执行计划。脚本已放在 Node1，命令读取现有数据，并按两轮部署方式切换已有数据库容器。

先在 Ghostty 执行，暂停应用：

```bash
ssh root@120.46.176.79 'docker stop lab4-app'
```

依次执行下面四条命令，每条输出后截图。建议窗口宽度至少180列、字体14～16；保留命令、UTC时间、完整结果，使用系统截图发送PNG原图。

MySQL 记录（当前图4）：

```bash
ssh -t root@119.3.221.88 'bash /opt/lab4/scripts/ghostty-evidence.sh mysql-records'
```

MySQL 索引与执行计划（当前图6）：

```bash
ssh -t root@119.3.221.88 'bash /opt/lab4/scripts/ghostty-evidence.sh mysql-index'
```

MongoDB 记录（当前图5）：

```bash
ssh -t root@119.3.221.88 'bash /opt/lab4/scripts/ghostty-evidence.sh mongo-records'
```

MongoDB 索引与执行计划（当前图7）：

```bash
ssh -t root@119.3.221.88 'bash /opt/lab4/scripts/ghostty-evidence.sh mongo-index'
```

完成后恢复应用：

```bash
ssh root@120.46.176.79 'docker start lab4-app'
```

记录截图会显示当前总数和补拍接口产生的演示记录数。MySQL正式末次运行后为765118条，MongoDB为766808条；本次Edge补拍各增加1条，因此当前总数应为765119、766809。原始正式测量及其记录核验保持原有数值。

把四张截图发回当前聊天，标明MySQL记录、MySQL索引、MongoDB记录、MongoDB索引。最终正文按内容更新图号。
