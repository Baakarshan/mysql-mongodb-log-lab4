package edu.lab4.mysql;

import edu.lab4.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * JPA 仓储：JpaSpecificationExecutor 组合级别与时间条件，JpaRepository 提供分页与总数。 联合索引由 database/mysql.sql
 * 创建，应用启动时只校验表结构。
 */
public interface LogJpaRepository
    extends JpaRepository<LogEntry, String>, JpaSpecificationExecutor<LogEntry> {}
