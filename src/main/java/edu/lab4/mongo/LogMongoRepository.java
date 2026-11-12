package edu.lab4.mongo;

import edu.lab4.LogEntry;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/** MongoDB 仓储：用查询注解声明级别和左闭右开时间范围，分页由 Spring Data 执行。 */
public interface LogMongoRepository extends MongoRepository<LogEntry, String> {
  /** 返回当前页及匹配总数，排序和页大小由调用方统一传入。 */
  @Query("{'level': ?0, 'createdAt': {'$gte': ?1, '$lt': ?2}}")
  Page<LogEntry> findInTimeRange(String level, Instant from, Instant to, Pageable pageable);
}
