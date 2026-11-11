package edu.lab4;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.security.SecureRandom;
import java.math.BigInteger;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/logs")
public class LogController {
 private final LogStore store;
 private static final SecureRandom RANDOM=new SecureRandom();
 private static final char[] ALPHABET="0123456789ABCDEFGHJKMNPQRSTVWXYZ".toCharArray();
 public LogController(LogStore store) {this.store=store;}
 static String ulid() {
  byte[] bytes=new byte[16];RANDOM.nextBytes(bytes);long t=System.currentTimeMillis();
  for(int i=5;i>=0;i--){bytes[i]=(byte)t;t>>>=8;}
  BigInteger n=new BigInteger(1,bytes);char[] out=new char[26];
  for(int i=25;i>=0;i--){out[i]=ALPHABET[n.intValue()&31];n=n.shiftRight(5);}return new String(out);
 }
 @PostMapping @ResponseStatus(HttpStatus.CREATED)
 public LogEntry create(@Valid @RequestBody LogRequest r) {
  LogEntry e=new LogEntry();e.id=ulid();e.traceId=r.traceId();e.level=r.level();e.source=r.source();
  e.message=r.message();e.clientIp=r.clientIp();e.createdAt=r.createdAt().truncatedTo(ChronoUnit.MILLIS);
  return store.insert(e);
 }
 @GetMapping public LogPage query(@RequestParam String level,@RequestParam Instant from,@RequestParam Instant to,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size) {
  if(!level.matches("TRACE|DEBUG|INFO|WARN|ERROR")||!from.isBefore(to)||page<0||size<1||size>100)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid query parameters");
  return store.query(level,from.truncatedTo(ChronoUnit.MILLIS),to.truncatedTo(ChronoUnit.MILLIS),page,size);
 }
}
