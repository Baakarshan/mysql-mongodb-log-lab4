package edu.lab4.mysql;

import edu.lab4.LogEntry;
import edu.lab4.LogPage;
import edu.lab4.LogStore;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** MySQL/JPA 链路，仅在 mysql profile 下装配，避免另一轮数据库参与运行。 */
@Service
@Profile("mysql")
public class MySqlLogStore implements LogStore {
  private final LogJpaRepository repo;
  private final EntityManager em;

  public MySqlLogStore(LogJpaRepository repo, EntityManager em) {
    this.repo = repo;
    this.em = em;
  }

  /** 使用 persist 写入新主键，事务在代理返回前提交。 数据库设置 innodb_flush_log_at_trx_commit=1，每次提交刷新日志。 */
  @Override
  @Transactional
  public LogEntry insert(LogEntry e) {
    em.persist(e);
    return e;
  }

  /** 在只读事务中执行分页查询，条件与 MongoDB 的 gte/lt 完全对应。 Spring Data 返回当前页与匹配总数，排序键与联合索引的后两列一致。 */
  @Override
  @Transactional(readOnly = true)
  public LogPage query(String level, Instant from, Instant to, int page, int size) {
    var result =
        repo.findAll(
            (root, q, cb) ->
                cb.and(
                    cb.equal(root.get("level"), level),
                    cb.greaterThanOrEqualTo(root.get("createdAt"), from),
                    cb.lessThan(root.get("createdAt"), to)),
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt", "id")));
    return new LogPage(
        result.getContent(), page, size, result.getTotalElements(), result.getTotalPages());
  }
}
