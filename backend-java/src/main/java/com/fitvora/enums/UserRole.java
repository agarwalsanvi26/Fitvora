package com.fitvora.enums;

/**
 * Role-based access control enum with permission evaluation.
 */
public enum UserRole {
    USER("Standard Athlete", 1),
    TRAINER("Certified Performance Coach", 2),
    ADMIN("Platform Administrator", 3);

    private final String description;
    private final int accessTier;

    UserRole(String description, int accessTier) {
        this.description = description;
        this.accessTier = accessTier;
    }

    public String getDescription() {
        return description;
    }

    public int getAccessTier() {
        return accessTier;
    }

    public boolean canManageUsers() {
        return this == ADMIN;
    }

    public boolean canManageWorkouts() {
        return this == ADMIN || this == TRAINER;
    }
}
