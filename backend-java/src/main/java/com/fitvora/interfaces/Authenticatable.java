package com.fitvora.interfaces;

import com.fitvora.enums.UserRole;

/**
 * Interface defining authentication and role-based authorization contract.
 */
public interface Authenticatable {
    String getEmail();
    String getPasswordHash();
    UserRole getRole();
    boolean hasPermission(String permission);
}
