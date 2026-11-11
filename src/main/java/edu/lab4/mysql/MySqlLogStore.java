package edu.lab4.mysql;
import edu.lab4.*;
import java.time.Instant;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.*;
@Service @Profile("mysql")
public class MySqlLogStore implements LogStore {
 private final LogJpaRepository repo; private final EntityManager em;
 public MySqlLogStore(LogJpaRepository repo, EntityManager em) {this.repo=repo;this.em=em;}
 @Transactional public LogEntry insert(LogEntry e) {em.persist(e);return e;}
 @Transactional(readOnly=true) public LogPage query(String level,Instant from,Instant to,int page,int size) {
  var result=repo.findAll((root,q,cb)->cb.and(cb.equal(root.get("level"),level),cb.greaterThanOrEqualTo(root.get("createdAt"),from),cb.lessThan(root.get("createdAt"),to)),PageRequest.of(page,size,Sort.by(Sort.Direction.DESC,"createdAt","id")));
  return new LogPage(result.getContent(),page,size,result.getTotalElements(),result.getTotalPages());
 }
}
