package com.fitvora.exception;

public class ConcurrencyConflictException extends FitvoraException {
    public ConcurrencyConflictException(String resource, long version) {
        super("ERR_CONCURRENCY_CONFLICT", "Optimistic lock failure on resource '" + resource + "' with version " + version);
    }
}
