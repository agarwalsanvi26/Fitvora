package com.fitvora.generics;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Generic container for paginated data.
 * Demonstrates Generics, Collections, and Java Streams API.
 *
 * @param <T> element type
 */
public class PaginatedResult<T> implements Serializable {
    private final List<T> content;
    private final int currentPage;
    private final int pageSize;
    private final long totalElements;
    private final int totalPages;

    public PaginatedResult(List<T> content, int currentPage, int pageSize, long totalElements) {
        this.content = content != null ? Collections.unmodifiableList(new ArrayList<>(content)) : Collections.emptyList();
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = pageSize > 0 ? (int) Math.ceil((double) totalElements / pageSize) : 0;
    }

    public List<T> getContent() {
        return content;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public boolean hasNext() {
        return currentPage < totalPages - 1;
    }

    public boolean hasPrevious() {
        return currentPage > 0;
    }

    /**
     * Functional transformation of paginated elements using Java Streams.
     */
    public <R> PaginatedResult<R> map(Function<? super T, ? extends R> converter) {
        List<R> transformed = this.content.stream()
                .map(converter)
                .collect(Collectors.toList());
        return new PaginatedResult<>(transformed, this.currentPage, this.pageSize, this.totalElements);
    }
}
