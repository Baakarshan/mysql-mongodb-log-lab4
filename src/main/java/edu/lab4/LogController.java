package edu.lab4;

import jakarta.validation.Valid;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** 日志 REST 接口。公共参数校验、主键生成与时间处理在此完成，两套存储实现共用此入口。 */
@RestController
@RequestMapping("/api/logs")
public class LogController {
  private static final SecureRandom RANDOM = new SecureRandom();
  private static final char[] ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ".toCharArray();

  private final LogStore store;

  public LogController(LogStore store) {
    this.store = store;
  }

  /**
   * 生成 26 位 Crockford Base32 ULID：前 48 位为毫秒时间，后 80 位为随机数。
   *
   * <p>同一毫秒内的随机部分用于区分请求；查询另以 id 作为同时间记录的排序键。
   */
  static String ulid() {
    byte[] bytes = new byte[16];
    RANDOM.nextBytes(bytes);
    long t = System.currentTimeMillis();
    // 以大端顺序写入 6 字节时间戳，保留其余 10 字节随机数。
    for (int i = 5; i >= 0; i--) {
      bytes[i] = (byte) t;
      t >>>= 8;
    }
    // 每次取低 5 位编码为一个字符，倒序填满固定长度结果。
    BigInteger n = new BigInteger(1, bytes);
    char[] out = new char[26];
    for (int i = 25; i >= 0; i--) {
      out[i] = ALPHABET[n.intValue() & 31];
      n = n.shiftRight(5);
    }
    return new String(out);
  }

  /** 校验请求后保存单条日志，按接口约定返回 HTTP 201 和完整业务字段。 */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public LogEntry create(@Valid @RequestBody LogRequest r) {
    // 先统一截断时间精度，再交由当前 profile 对应的数据库完成持久化。
    LogEntry e = new LogEntry();
    e.id = ulid();
    e.traceId = r.traceId();
    e.level = r.level();
    e.source = r.source();
    e.message = r.message();
    e.clientIp = r.clientIp();
    e.createdAt = r.createdAt().truncatedTo(ChronoUnit.MILLIS);
    return store.insert(e);
  }

  /**
   * 验证查询区间和分页参数，执行按级别及事件时间过滤的分页查询。
   *
   * <p>HTTP 响应时间包含网络、应用、数据库查询及序列化的完整过程。
   */
  @GetMapping
  public LogPage query(
      @RequestParam String level,
      @RequestParam Instant from,
      @RequestParam Instant to,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    // 只接受五种级别、非空正向时间区间及 1 至 100 的页大小。
    if (!level.matches("TRACE|DEBUG|INFO|WARN|ERROR")
        || !from.isBefore(to)
        || page < 0
        || size < 1
        || size > 100) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid query parameters");
    }
    return store.query(
        level, from.truncatedTo(ChronoUnit.MILLIS), to.truncatedTo(ChronoUnit.MILLIS), page, size);
  }
}
