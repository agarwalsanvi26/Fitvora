package com.fitvora.model;

import com.fitvora.enums.UserRole;

/**
 * Concrete Admin class with platform governance permissions.
 */
public class AdminUser extends User {
    private String department;
    private int privilegeLevel;

    public AdminUser() {
        super();
        this.role = UserRole.ADMIN;
        this.privilegeLevel = 10;
        this.department = "System Operations";
    }

    public AdminUser(Long id, String name, String email, String passwordHash, String department) {
        super(id, name, email, passwordHash, UserRole.ADMIN);
        this.department = department;
        this.privilegeLevel = 10;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getPrivilegeLevel() {
        return privilegeLevel;
    }

    public void setPrivilegeLevel(int privilegeLevel) {
        this.privilegeLevel = privilegeLevel;
    }

    @Override
    public String getProfileSummary() {
        return String.format("Administrator %s | Dept: %s | Security Tier: %d",
                name, department, privilegeLevel);
    }
}
