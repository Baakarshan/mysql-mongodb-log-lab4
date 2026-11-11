package edu.lab4.mongo;

import edu.lab4.LogEntry;
import edu.lab4.LogPage;
import edu.lab4.LogStore;
import java.time.Instant;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/** MongoDB 链路，仅在 mongo profile 下装配，通过 MongoTemplate 显式执行查询。 */
@Service
@Profile("mongo")
public class MongoLogStore implements LogStore {
  private final MongoTemplate mongo;

  public MongoLogStore(MongoTemplate mongo) {
    this.mongo = mongo;
  }

  /**
   * 插入单条文档。连接配置采用 w=1、journal=true，调用等待主节点及日志写入确认。 MongoTemplate 默认保留 _class 元数据，HTTP
   * 仍只返回公共日志模型中的字段。
   */
  @Override
  public LogEntry insert(LogEntry e) {
    return mongo.insert(e);
  }

  /** 按与 JPA 相同的左闭右开时间区间、降序排序和零起始页码查询。 */
  @Override
  public LogPage query(String level, Instant from, Instant to, int page, int size) {
    var criteria = Criteria.where("level").is(level).and("createdAt").gte(from).lt(to);
    // 总数查询使用未分页条件，不能把 skip 或 limit 带入 count。
    long count = mongo.count(new Query(criteria), LogEntry.class);
    // 以 long 计算偏移量，id 由映射层转换为数据库中的 _id。
    var query =
        new Query(criteria)
            .with(Sort.by(Sort.Direction.DESC, "createdAt", "id"))
            .skip((long) page * size)
            .limit(size);
    return new LogPage(
        mongo.find(query, LogEntry.class), page, size, count, (count + size - 1) / size);
  }
}
