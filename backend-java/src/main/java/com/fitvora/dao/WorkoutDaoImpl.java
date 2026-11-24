package com.fitvora.dao;

import com.fitvora.db.JdbcUtils;
import com.fitvora.enums.DifficultyLevel;
import com.fitvora.enums.MuscleGroup;
import com.fitvora.exception.DatabaseException;
import com.fitvora.model.AbstractWorkout;
import com.fitvora.model.CardioWorkout;
import com.fitvora.model.MobilityWorkout;
import com.fitvora.model.StrengthWorkout;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Concrete JDBC implementation for WorkoutDao.
 * Demonstrates:
 * 1. Polymorphic entity persistence using discriminator column ('workout_type')
 * 2. JDBC Batch operations (PreparedStatement addBatch / executeBatch)
 * 3. Handling timestamps and enums
 */
public class WorkoutDaoImpl extends BaseDao<AbstractWorkout, Long> implements WorkoutDao {

    @Override
    protected String getTableName() {
        return "workouts";
    }

    @Override
    protected String getPrimaryKeyColumnName() {
        return "id";
    }

    @Override
    protected AbstractWorkout mapRowToEntity(ResultSet rs) throws SQLException {
        String type = rs.getString("workout_type");
        Long id = rs.getLong("id");
        String title = rs.getString("title");
        String description = rs.getString("description");
        int duration = rs.getInt("duration_minutes");
        DifficultyLevel diff = DifficultyLevel.valueOf(rs.getString("difficulty_level"));
        MuscleGroup muscle = MuscleGroup.valueOf(rs.getString("muscle_group"));
        Timestamp sched = rs.getTimestamp("scheduled_time");

        AbstractWorkout workout;
        if ("STRENGTH".equalsIgnoreCase(type)) {
            StrengthWorkout sw = new StrengthWorkout();
            sw.setTotalSets(rs.getInt("total_sets"));
            sw.setEstimatedVolumeLoadKg(rs.getDouble("volume_load_kg"));
            sw.setRpeTarget(rs.getDouble("rpe_target"));
            workout = sw;
        } else if ("CARDIO".equalsIgnoreCase(type)) {
            CardioWorkout cw = new CardioWorkout();
            cw.setTargetHeartRateZone(rs.getInt("heart_rate_zone"));
            cw.setAverageSpeedKph(rs.getDouble("average_speed_kph"));
            cw.setElevationGainMeters(rs.getDouble("elevation_gain_meters"));
            workout = cw;
        } else {
            MobilityWorkout mw = new MobilityWorkout();
            mw.setFocusJointChain(rs.getString("focus_joint_chain"));
            mw.setIncludesBreathwork(rs.getBoolean("includes_breathwork"));
            workout = mw;
        }

        workout.setId(id);
        workout.setTitle(title);
        workout.setDescription(description);
        workout.setDurationMinutes(duration);
        workout.setDifficultyLevel(diff);
        workout.setPrimaryMuscleGroup(muscle);
        if (sched != null) {
            workout.setScheduledTime(sched.toLocalDateTime());
        }
        return workout;
    }

    @Override
    public AbstractWorkout save(AbstractWorkout workout) throws DatabaseException {
        String sql = "INSERT INTO workouts (title, description, duration_minutes, difficulty_level, muscle_group, " +
                "workout_type, total_sets, volume_load_kg, rpe_target, heart_rate_zone, average_speed_kph, " +
                "elevation_gain_meters, focus_joint_chain, includes_breathwork, scheduled_time, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, workout.getTitle());
            ps.setString(2, workout.getDescription());
            ps.setInt(3, workout.getDurationMinutes());
            ps.setString(4, workout.getDifficultyLevel().name());
            ps.setString(5, workout.getPrimaryMuscleGroup().name());

            if (workout instanceof StrengthWorkout) {
                StrengthWorkout s = (StrengthWorkout) workout;
                ps.setString(6, "STRENGTH");
                ps.setInt(7, s.getTotalSets());
                ps.setDouble(8, s.getEstimatedVolumeLoadKg());
                ps.setDouble(9, s.getRpeTarget());
                ps.setNull(10, Types.INTEGER);
                ps.setNull(11, Types.DECIMAL);
                ps.setNull(12, Types.DECIMAL);
                ps.setNull(13, Types.VARCHAR);
                ps.setNull(14, Types.BOOLEAN);
            } else if (workout instanceof CardioWorkout) {
                CardioWorkout c = (CardioWorkout) workout;
                ps.setString(6, "CARDIO");
                ps.setNull(7, Types.INTEGER);
                ps.setNull(8, Types.DECIMAL);
                ps.setNull(9, Types.DECIMAL);
                ps.setInt(10, c.getTargetHeartRateZone());
                ps.setDouble(11, c.getAverageSpeedKph());
                ps.setDouble(12, c.getElevationGainMeters());
                ps.setNull(13, Types.VARCHAR);
                ps.setNull(14, Types.BOOLEAN);
            } else if (workout instanceof MobilityWorkout) {
                MobilityWorkout m = (MobilityWorkout) workout;
                ps.setString(6, "MOBILITY");
                ps.setNull(7, Types.INTEGER);
                ps.setNull(8, Types.DECIMAL);
                ps.setNull(9, Types.DECIMAL);
                ps.setNull(10, Types.INTEGER);
                ps.setNull(11, Types.DECIMAL);
                ps.setNull(12, Types.DECIMAL);
                ps.setString(13, m.getFocusJointChain());
                ps.setBoolean(14, m.isIncludesBreathwork());
            }

            if (workout.getScheduledTime() != null) {
                ps.setTimestamp(15, Timestamp.valueOf(workout.getScheduledTime()));
            } else {
                ps.setNull(15, Types.TIMESTAMP);
            }

            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                workout.setId(rs.getLong(1));
            }
            return workout;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to save workout: " + workout.getTitle(), e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public AbstractWorkout update(AbstractWorkout workout) throws DatabaseException {
        String sql = "UPDATE workouts SET title = ?, description = ?, duration_minutes = ?, updated_at = NOW() WHERE id = ?";
        Connection conn = getConnection();
        PreparedStatement ps = null;

        try {
            ps = conn.prepareStatement(sql);
            ps.setString(1, workout.getTitle());
            ps.setString(2, workout.getDescription());
            ps.setInt(3, workout.getDurationMinutes());
            ps.setLong(4, workout.getId());
            ps.executeUpdate();
            return workout;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to update workout ID: " + workout.getId(), e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(null, ps, conn);
        }
    }

    @Override
    public List<AbstractWorkout> findByMuscleGroup(MuscleGroup muscleGroup) throws DatabaseException {
        String sql = "SELECT * FROM workouts WHERE muscle_group = ?";
        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<AbstractWorkout> list = new ArrayList<>();

        try {
            ps = conn.prepareStatement(sql);
            ps.setString(1, muscleGroup.name());
            rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapRowToEntity(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Failed finding workouts by muscle: " + muscleGroup, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public List<AbstractWorkout> findByAthleteId(Long athleteId) throws DatabaseException {
        String sql = "SELECT w.* FROM workouts w JOIN athlete_workouts aw ON w.id = aw.workout_id WHERE aw.athlete_id = ?";
        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<AbstractWorkout> list = new ArrayList<>();

        try {
            ps = conn.prepareStatement(sql);
            ps.setLong(1, athleteId);
            rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapRowToEntity(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Failed finding workouts for athlete: " + athleteId, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public void assignExercisesToWorkout(Long workoutId, List<Long> exerciseIds) throws DatabaseException {
        String sql = "INSERT INTO workout_exercises (workout_id, exercise_id, order_index) VALUES (?, ?, ?)";
        Connection conn = getConnection();
        PreparedStatement ps = null;

        try {
            conn.setAutoCommit(false); // Transaction begins
            ps = conn.prepareStatement(sql);

            int order = 1;
            for (Long exId : exerciseIds) {
                ps.setLong(1, workoutId);
                ps.setLong(2, exId);
                ps.setInt(3, order++);
                ps.addBatch(); // JDBC Batch operation
            }

            ps.executeBatch();
            conn.commit();
        } catch (SQLException e) {
            try {
                conn.rollback();
            } catch (SQLException ignored) {}
            throw new DatabaseException("Batch assign exercises failed for workout: " + workoutId, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(null, ps, conn);
        }
    }
}
