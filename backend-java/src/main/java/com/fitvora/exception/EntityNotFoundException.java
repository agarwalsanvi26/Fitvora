package com.fitvora.exception;

public class EntityNotFoundException extends FitvoraException {
    public EntityNotFoundException(String entityName, Object id) {
        super("ERR_ENTITY_NOT_FOUND", entityName + " with ID '" + id + "' was not found in database.");
    }
}
