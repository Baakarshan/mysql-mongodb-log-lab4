package edu.lab4;

import java.time.Instant;

/** 两条数据库链路共用的持久化契约，保证控制器与数据库实现解耦。 */
public interface LogStore {
  /** 保存单条日志；调用返回时，对应数据库的事务或写入确认已完成。 */
  LogEntry insert(LogEntry e);

  /**
   * 按日志级别和 UTC 时间范围查询，时间区间为 {@code [from, to)}。
   *
   * <p>页码从 0 开始，按 createdAt、id 降序排列，返回当前页及匹配记录总数。
   */
  LogPage query(String level, Instant from, Instant to, int page, int size);
}
