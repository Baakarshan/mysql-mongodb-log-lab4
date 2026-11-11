package edu.lab4;
import java.time.Instant;
import jakarta.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
@Entity @Table(name="logs") @Document(collection="logs")
public class LogEntry {
 @jakarta.persistence.Id @org.springframework.data.annotation.Id @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR) @Column(length=26) public String id;
 @Column(length=64) public String traceId;
 @Column(length=10,nullable=false) public String level;
 @Column(length=128,nullable=false) public String source;
 @Column(length=4096,nullable=false) public String message;
 @Column(length=45) public String clientIp;
 @Column(nullable=false) public Instant createdAt;
 public LogEntry() {}
}
