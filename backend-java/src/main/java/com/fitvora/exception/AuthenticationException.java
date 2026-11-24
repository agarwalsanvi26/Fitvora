package com.fitvora.exception;

public class AuthenticationException extends FitvoraException {
    public AuthenticationException(String message) {
        super("ERR_AUTHENTICATION_FAILED", message);
    }
}
