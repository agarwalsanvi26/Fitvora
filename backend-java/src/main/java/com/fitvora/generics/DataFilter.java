package com.fitvora.generics;

/**
 * Functional Interface for generic entity filtering.
 * Demonstrates Java 8+ Lambdas, Functional Interfaces, and Generics.
 *
 * @param <T> Target object type
 */
@FunctionalInterface
public interface DataFilter<T> {
    boolean test(T item);

    default DataFilter<T> and(DataFilter<T> other) {
        return item -> this.test(item) && other.test(item);
    }

    default DataFilter<T> or(DataFilter<T> other) {
        return item -> this.test(item) || other.test(item);
    }
}
