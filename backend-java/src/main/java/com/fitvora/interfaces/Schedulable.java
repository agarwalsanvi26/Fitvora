package com.fitvora.interfaces;

import java.time.LocalDateTime;

/**
 * Interface for calendar and session items requiring conflict detection and duration checks.
 */
public interface Schedulable {
    LocalDateTime getScheduledTime();
    int getDurationMinutes();
    boolean conflictsWith(Schedulable other);
}
