package edu.lab4;

import java.util.List;

/**
 * 统一分页响应，content 为当前页，totalElements 为相同条件下的匹配总数。
 *
 * <p>page 从 0 开始；空结果时 content 为空列表，totalElements 和 totalPages 均为 0。
 */
public record LogPage(
    List<LogEntry> content, int page, int size, long totalElements, long totalPages) {}
