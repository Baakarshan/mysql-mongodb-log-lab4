# Ghostty 数据库截图

## 当前补拍：MongoDB 记录

MongoRepository 重跑已完成。在 Ghostty 执行以下命令并截图，保留 UTC 时间、总记录数和两条日志；总记录数应为 776260，演示记录数为 1。当前 MongoDB 正在运行，可直接读取。内容较长可分两张截图。

```bash
ssh -t root@119.3.221.88 'bash /opt/lab4/scripts/ghostty-evidence.sh mongo-records'
```

## 11月11日首次截图操作记录

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

记录截图会显示当前总数和补拍接口产生的演示记录数。MySQL正式末次运行后为765118条，MongoDB为766808条；本次Edge补拍各增加1条，因此首次截图的总数为765119、766809。11月12日MongoRepository重跑末次写入后为776259条，接口演示增加1条后为776260条。每次正式测量的记录核验见对应运行目录。

作者已提供新版MongoDB记录图（2026年11月12日13:13:26 UTC），显示776260条记录。交付保留5张Ghostty原图，其中MongoDB执行计划分为上下两张。文件映射、原图SHA256及正文裁切坐标保存在 `screenshots/ghostty-manifest.json`，对应正文图4—7。截图后已恢复MongoDB与应用，健康检查为UP。
