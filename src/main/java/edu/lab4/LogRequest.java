package edu.lab4;
import java.time.Instant;
import jakarta.validation.constraints.*;
public record LogRequest(
 @Size(max=64) String traceId,
 @NotNull @Pattern(regexp="TRACE|DEBUG|INFO|WARN|ERROR") String level,
 @NotBlank @Size(max=128) String source,
 @NotBlank @Size(max=4096) String message,
 @Size(max=45) String clientIp,
 @NotNull Instant createdAt) {}
