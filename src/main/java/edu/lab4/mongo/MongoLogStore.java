package edu.lab4.mongo;

import edu.lab4.LogEntry;
import edu.lab4.LogPage;
import edu.lab4.LogStore;
import java.time.Instant;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

/** MongoDB 链路，仅在 mongo profile 下装配，通过 Spring Data Repository 完成持久化。 */
@Service
@Profile("mongo")
public class MongoLogStore implements LogStore {
  private final LogMongoRepository repo;

  public MongoLogStore(LogMongoRepository repo) {
    this.repo = repo;
  }

  /**
   * 插入单条新文档。使用 insert 避免把新日志写入变为按主键更新；w=1、journal=true 等待数据库及日志写入确认。 Spring Data 默认保留 _class
   * 元数据，HTTP 仍只返回公共日志模型中的字段。
   */
  @Override
  public LogEntry insert(LogEntry e) {
    return repo.insert(e);
  }

  /** 按与 JPA 相同的左闭右开时间区间、降序排序和零起始页码查询。 */
  @Override
  public LogPage query(String level, Instant from, Instant to, int page, int size) {
    // Repository 统一执行条件分页；id 由映射层转换为数据库中的 _id。
    var result =
        repo.findInTimeRange(
            level,
            from,
            to,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt", "id")));
    return new LogPage(
        result.getContent(), page, size, result.getTotalElements(), result.getTotalPages());
  }
}
