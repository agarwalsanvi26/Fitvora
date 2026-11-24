package com.fitvora.exception;

public class SchedulingConflictException extends FitvoraException {
    public SchedulingConflictException(String resourceName, String timeSlot) {
        super("ERR_SCHEDULING_CONFLICT", "Schedule conflict detected for " + resourceName + " at slot: " + timeSlot);
    }
}
