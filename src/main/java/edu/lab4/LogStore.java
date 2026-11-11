package edu.lab4;
import java.time.Instant;
public interface LogStore {
 LogEntry insert(LogEntry e);
 LogPage query(String level, Instant from, Instant to, int page, int size);
}
