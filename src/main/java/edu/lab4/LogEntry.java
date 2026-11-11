package edu.lab4;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * 公共日志模型，同时映射 MySQL 的 logs 表与 MongoDB 的 logs 集合。
 *
 * <p>字段通过 Jackson 输出为相同的 JSON。MongoDB 将 id 映射为 _id；JPA 使用 CHAR(26) 存储同一业务主键。createdAt
 * 在控制器中截断为毫秒，使两库时间精度一致。
 */
@Entity
@Table(name = "logs")
@Document(collection = "logs")
public class LogEntry {
  /** 26 位 ULID，既作为业务主键，也用于相同事件时间下的稳定排序。 */
  @jakarta.persistence.Id
  @org.springframework.data.annotation.Id
  @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR)
  @Column(length = 26)
  public String id;

  /** 可选的调用链标识，用于将同一次业务调用产生的日志关联起来。 */
  @Column(length = 64)
  public String traceId;

  /** TRACE、DEBUG、INFO、WARN 或 ERROR，查询联合索引的首列。 */
  @Column(length = 10, nullable = false)
  public String level;

  /** 日志所属服务或模块。 */
  @Column(length = 128, nullable = false)
  public String source;

  /** 日志正文；长度上限由 LogRequest 的统一校验约束保证。 */
  @Column(length = 4096, nullable = false)
  public String message;

  /** 可选的客户端地址，45 字符可容纳 IPv6 文本。 */
  @Column(length = 45)
  public String clientIp;

  /** 日志产生时间，以 UTC 保存，接口与测试统一使用毫秒精度。 */
  @Column(nullable = false)
  public Instant createdAt;

  public LogEntry() {}
}
