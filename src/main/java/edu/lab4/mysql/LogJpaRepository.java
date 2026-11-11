package edu.lab4.mysql;
import edu.lab4.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
public interface LogJpaRepository extends JpaRepository<LogEntry,String>, JpaSpecificationExecutor<LogEntry> {}
