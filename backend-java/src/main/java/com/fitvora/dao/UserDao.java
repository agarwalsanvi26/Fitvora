package com.fitvora.dao;

import com.fitvora.enums.UserRole;
import com.fitvora.exception.DatabaseException;
import com.fitvora.generics.GenericDao;
import com.fitvora.model.User;

import java.util.List;
import java.util.Optional;

public interface UserDao extends GenericDao<User, Long> {
    Optional<User> findByEmail(String email) throws DatabaseException;
    List<User> findByRole(UserRole role) throws DatabaseException;
    boolean updatePassword(Long userId, String newPasswordHash) throws DatabaseException;
    boolean updateStreak(Long userId, int newStreak) throws DatabaseException;
}
