package edu.lab4.mongo;
import edu.lab4.*;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
@Service @Profile("mongo")
public class MongoLogStore implements LogStore {
 private final MongoTemplate mongo;
 public MongoLogStore(MongoTemplate mongo) {this.mongo=mongo;}
 public LogEntry insert(LogEntry e) {return mongo.insert(e);}
 public LogPage query(String level,Instant from,Instant to,int page,int size) {
  var criteria=Criteria.where("level").is(level).and("createdAt").gte(from).lt(to);
  long count=mongo.count(new Query(criteria),LogEntry.class);
  var query=new Query(criteria).with(Sort.by(Sort.Direction.DESC,"createdAt","id")).skip((long)page*size).limit(size);
  return new LogPage(mongo.find(query,LogEntry.class),page,size,count,(count+size-1)/size);
 }
}
