package com.fitvora.exception;

import java.util.Collections;
import java.util.List;

public class ValidationException extends FitvoraException {
    private final List<String> validationErrors;

    public ValidationException(String message) {
        this(message, Collections.singletonList(message));
    }

    public ValidationException(String message, List<String> validationErrors) {
        super("ERR_VALIDATION_FAILED", message);
        this.validationErrors = validationErrors;
    }

    public List<String> getValidationErrors() {
        return validationErrors;
    }
}
