package com.fitvora.interfaces;

import java.time.LocalDateTime;

/**
 * Interface enforcing entity lifecycle audit timestamps.
 */
public interface Auditable {
    LocalDateTime getCreatedAt();
    void setCreatedAt(LocalDateTime createdAt);

    LocalDateTime getUpdatedAt();
    void setUpdatedAt(LocalDateTime updatedAt);
}
