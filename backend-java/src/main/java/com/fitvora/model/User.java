package com.fitvora.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fitvora.enums.UserRole;
import com.fitvora.interfaces.Authenticatable;

/**
 * Abstract User class forming the foundation of Role-based polymorphism.
 * Demonstrates OOP Inheritance and Interface Implementation.
 */
public abstract class User extends AbstractEntity implements Authenticatable {
    protected String name;
    protected String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    protected String passwordHash;
    protected UserRole role;
    protected boolean active;

    public User() {
        super();
        this.active = true;
    }

    public User(Long id, String name, String email, String passwordHash, UserRole role) {
        super(id);
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.active = true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    @JsonIgnore
    public String getPasswordHash() {
        return passwordHash;
    }

    @JsonIgnore
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    @Override
    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    /**
     * Polymorphic method yielding role-specific profile summaries.
     */
    public abstract String getProfileSummary();

    @Override
    public boolean hasPermission(String permission) {
        if (role == UserRole.ADMIN) return true;
        if (role == UserRole.TRAINER && permission.startsWith("WORKOUT_")) return true;
        return permission.startsWith("USER_READ");
    }
}
