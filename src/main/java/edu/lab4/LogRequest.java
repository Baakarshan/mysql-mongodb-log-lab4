package edu.lab4;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;

/**
 * 两套实现共用的写入请求。主键由服务端生成，客户端提供事件产生时间。
 *
 * <p>字段长度与 MySQL 表定义一致；MongoDB 使用同一组校验，保证请求约束相同。 traceId 和 clientIp 可为空，日志正文最长 4096 字符。
 */
public record LogRequest(
    @Size(max = 64) String traceId,
    @NotNull @Pattern(regexp = "TRACE|DEBUG|INFO|WARN|ERROR") String level,
    @NotBlank @Size(max = 128) String source,
    @NotBlank @Size(max = 4096) String message,
    @Size(max = 45) String clientIp,
    @NotNull Instant createdAt) {}
