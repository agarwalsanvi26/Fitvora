package com.fitvora.exception;

/**
 * Root domain exception for FITVORA.
 * Demonstrates Java Exception Handling hierarchy, error codes, and message encapsulation.
 */
public class FitvoraException extends Exception {
    private final String errorCode;
    private final long timestamp;

    public FitvoraException(String message) {
        this("ERR_GENERAL", message);
    }

    public FitvoraException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.timestamp = System.currentTimeMillis();
    }

    public FitvoraException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.timestamp = System.currentTimeMillis();
    }

    public String getErrorCode() {
        return errorCode;
    }

    public long getTimestamp() {
        return timestamp;
    }
}
