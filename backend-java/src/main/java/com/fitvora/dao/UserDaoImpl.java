package com.fitvora.dao;

import com.fitvora.db.JdbcUtils;
import com.fitvora.enums.FitnessGoal;
import com.fitvora.enums.UserRole;
import com.fitvora.exception.DatabaseException;
import com.fitvora.model.AdminUser;
import com.fitvora.model.AthleteUser;
import com.fitvora.model.TrainerUser;
import com.fitvora.model.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Concrete JDBC implementation for UserDao.
 * Demonstrates:
 * 1. Polymorphic database mapping (instantiates AthleteUser, TrainerUser, AdminUser based on role)
 * 2. PreparedStatement generation and executeUpdate
 * 3. Handling auto-generated keys via Statement.RETURN_GENERATED_KEYS
 */
public class UserDaoImpl extends BaseDao<User, Long> implements UserDao {

    @Override
    protected String getTableName() {
        return "users";
    }

    @Override
    protected String getPrimaryKeyColumnName() {
        return "id";
    }

    @Override
    protected User mapRowToEntity(ResultSet rs) throws SQLException {
        String roleStr = rs.getString("role");
        UserRole role = UserRole.valueOf(roleStr);
        Long id = rs.getLong("id");
        String name = rs.getString("name");
        String email = rs.getString("email");
        String passwordHash = rs.getString("password_hash");
        boolean active = rs.getBoolean("active");
        Timestamp createdAt = rs.getTimestamp("created_at");

        User user;
        switch (role) {
            case TRAINER:
                TrainerUser trainer = new TrainerUser();
                trainer.setCertification(rs.getString("certification"));
                trainer.setSpecialization(rs.getString("specialization"));
                trainer.setExperienceYears(rs.getInt("experience_years"));
                trainer.setHourlyRate(rs.getDouble("hourly_rate"));
                trainer.setRating(rs.getDouble("rating"));
                user = trainer;
                break;
            case ADMIN:
                AdminUser admin = new AdminUser();
                admin.setDepartment(rs.getString("department"));
                user = admin;
                break;
            case USER:
            default:
                AthleteUser athlete = new AthleteUser();
                athlete.setHeightCm(rs.getDouble("height_cm"));
                athlete.setCurrentWeightKg(rs.getDouble("weight_kg"));
                athlete.setTargetWeightKg(rs.getDouble("target_weight_kg"));
                String goalStr = rs.getString("fitness_goal");
                if (goalStr != null) {
                    try {
                        athlete.setFitnessGoal(FitnessGoal.valueOf(goalStr));
                    } catch (IllegalArgumentException ignored) {}
                }
                athlete.setDailyWaterTargetLiters(rs.getDouble("daily_water_target_liters"));
                athlete.setStreakDays(rs.getInt("streak_days"));
                user = athlete;
                break;
        }

        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setRole(role);
        user.setActive(active);
        if (createdAt != null) {
            user.setCreatedAt(createdAt.toLocalDateTime());
        }
        return user;
    }

    @Override
    public User save(User user) throws DatabaseException {
        String sql = "INSERT INTO users (name, email, password_hash, role, active, height_cm, weight_kg, " +
                "target_weight_kg, fitness_goal, daily_water_target_liters, streak_days, certification, specialization, " +
                "experience_years, hourly_rate, department, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPasswordHash());
            ps.setString(4, user.getRole().name());
            ps.setBoolean(5, user.isActive());

            if (user instanceof AthleteUser) {
                AthleteUser a = (AthleteUser) user;
                ps.setDouble(6, a.getHeightCm());
                ps.setDouble(7, a.getCurrentWeightKg());
                ps.setDouble(8, a.getTargetWeightKg());
                ps.setString(9, a.getFitnessGoal() != null ? a.getFitnessGoal().name() : null);
                ps.setDouble(10, a.getDailyWaterTargetLiters());
                ps.setInt(11, a.getStreakDays());
                ps.setNull(12, Types.VARCHAR);
                ps.setNull(13, Types.VARCHAR);
                ps.setNull(14, Types.INTEGER);
                ps.setNull(15, Types.DECIMAL);
                ps.setNull(16, Types.VARCHAR);
            } else if (user instanceof TrainerUser) {
                TrainerUser t = (TrainerUser) user;
                ps.setNull(6, Types.DECIMAL);
                ps.setNull(7, Types.DECIMAL);
                ps.setNull(8, Types.DECIMAL);
                ps.setNull(9, Types.VARCHAR);
                ps.setNull(10, Types.DECIMAL);
                ps.setInt(11, 0);
                ps.setString(12, t.getCertification());
                ps.setString(13, t.getSpecialization());
                ps.setInt(14, t.getExperienceYears());
                ps.setDouble(15, t.getHourlyRate());
                ps.setNull(16, Types.VARCHAR);
            } else if (user instanceof AdminUser) {
                AdminUser ad = (AdminUser) user;
                ps.setNull(6, Types.DECIMAL);
                ps.setNull(7, Types.DECIMAL);
                ps.setNull(8, Types.DECIMAL);
                ps.setNull(9, Types.VARCHAR);
                ps.setNull(10, Types.DECIMAL);
                ps.setInt(11, 0);
                ps.setNull(12, Types.VARCHAR);
                ps.setNull(13, Types.VARCHAR);
                ps.setNull(14, Types.INTEGER);
                ps.setNull(15, Types.DECIMAL);
                ps.setString(16, ad.getDepartment());
            }

            int affectedRows = ps.executeUpdate();
            if (affectedRows == 0) {
                throw new DatabaseException("Creating user failed, no rows affected.", null);
            }

            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                user.setId(rs.getLong(1));
            }
            return user;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to insert user: " + user.getEmail(), e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public User update(User user) throws DatabaseException {
        String sql = "UPDATE users SET name = ?, email = ?, active = ?, updated_at = NOW() WHERE id = ?";
        Connection conn = getConnection();
        PreparedStatement ps = null;

        try {
            ps = conn.prepareStatement(sql);
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setBoolean(3, user.isActive());
            ps.setLong(4, user.getId());

            ps.executeUpdate();
            return user;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to update user ID: " + user.getId(), e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(null, ps, conn);
        }
    }

    @Override
    public Optional<User> findByEmail(String email) throws DatabaseException {
        String sql = "SELECT * FROM users WHERE email = ?";
        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            ps = conn.prepareStatement(sql);
            ps.setString(1, email);
            rs = ps.executeQuery();

            if (rs.next()) {
                return Optional.of(mapRowToEntity(rs));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new DatabaseException("Failed finding user by email: " + email, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public List<User> findByRole(UserRole role) throws DatabaseException {
        String sql = "SELECT * FROM users WHERE role = ? AND active = true";
        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<User> list = new ArrayList<>();

        try {
            ps = conn.prepareStatement(sql);
            ps.setString(1, role.name());
            rs = ps.executeQuery();

            while (rs.next()) {
                list.add(mapRowToEntity(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Failed finding users by role: " + role, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public boolean updatePassword(Long userId, String newPasswordHash) throws DatabaseException {
        String sql = "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?";
        Connection conn = getConnection();
        PreparedStatement ps = null;

        try {
            ps = conn.prepareStatement(sql);
            ps.setString(1, newPasswordHash);
            ps.setLong(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Failed updating password for user ID: " + userId, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(null, ps, conn);
        }
    }

    @Override
    public boolean updateStreak(Long userId, int newStreak) throws DatabaseException {
        String sql = "UPDATE users SET streak_days = ?, updated_at = NOW() WHERE id = ?";
        Connection conn = getConnection();
        PreparedStatement ps = null;

        try {
            ps = conn.prepareStatement(sql);
            ps.setInt(1, newStreak);
            ps.setLong(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Failed updating streak for user ID: " + userId, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(null, ps, conn);
        }
    }
}
