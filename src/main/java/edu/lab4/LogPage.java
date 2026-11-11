package edu.lab4;
import java.util.List;
public record LogPage(List<LogEntry> content, int page, int size, long totalElements, long totalPages) {}
