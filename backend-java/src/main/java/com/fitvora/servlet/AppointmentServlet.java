package com.fitvora.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fitvora.concurrency.AppointmentSchedulerLock;
import com.fitvora.db.TransactionManager;
import com.fitvora.exception.DatabaseException;
import com.fitvora.exception.SchedulingConflictException;
import com.fitvora.generics.ApiResponse;
import com.fitvora.model.Appointment;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.fitvora.enums.UserRole;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

/**
 * Appointment Scheduling Servlet.
 * Demonstrates:
 * 1. Multithreading & Synchronization (Fair ReentrantLock against trainer ID)
 * 2. JDBC Transaction management (ACID commit/rollback)
 * 3. Race-condition prevention and custom exception handling
 */
@WebServlet("/api/appointments/*")
public class AppointmentServlet extends HttpServlet {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void init() throws ServletException {
        mapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute(AuthenticationFilter.SESSION_USER_ID) == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_UNAUTHORIZED", "Authentication required")));
            return;
        }

        Long authUserId = (Long) session.getAttribute(AuthenticationFilter.SESSION_USER_ID);
        UserRole authRole = (UserRole) session.getAttribute(AuthenticationFilter.SESSION_USER_ROLE);

        Appointment appointment = mapper.readValue(req.getInputStream(), Appointment.class);
        if (authRole != UserRole.ADMIN) {
            appointment.setAthleteId(authUserId);
        }
        Long trainerId = appointment.getTrainerId();

        if (trainerId == null || appointment.getAthleteId() == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("Trainer ID and Athlete ID are required")));
            return;
        }

        boolean lockAcquired = false;
        try {
            // Acquire exclusive lock for this trainer for up to 3 seconds to eliminate race conditions
            lockAcquired = AppointmentSchedulerLock.acquireTrainerLock(trainerId, 3000);
            if (!lockAcquired) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_SCHEDULE_BUSY", "Trainer calendar is currently locked by another concurrent booking.")));
                return;
            }

            // Execute reservation within an atomic JDBC transaction
            TransactionManager.executeInTransaction(conn -> {
                // Check for overlapping appointments
                String conflictSql = "SELECT id FROM appointments WHERE trainer_id = ? " +
                        "AND session_time = ? AND status != 'CANCELLED'";
                try (PreparedStatement checkPs = conn.prepareStatement(conflictSql)) {
                    checkPs.setLong(1, trainerId);
                    checkPs.setTimestamp(2, Timestamp.valueOf(appointment.getSessionTime()));
                    try (ResultSet rs = checkPs.executeQuery()) {
                        if (rs.next()) {
                            throw new SchedulingConflictException("Trainer #" + trainerId, appointment.getSessionTime().toString());
                        }
                    }
                }

                // Insert appointment
                String insertSql = "INSERT INTO appointments (athlete_id, trainer_id, session_time, " +
                        "duration_minutes, session_type, status, notes, created_at, updated_at) " +
                        "VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, NOW(), NOW())";
                try (PreparedStatement insertPs = conn.prepareStatement(insertSql)) {
                    insertPs.setLong(1, appointment.getAthleteId());
                    insertPs.setLong(2, trainerId);
                    insertPs.setTimestamp(3, Timestamp.valueOf(appointment.getSessionTime()));
                    insertPs.setInt(4, appointment.getDurationMinutes());
                    insertPs.setString(5, appointment.getSessionType());
                    insertPs.setString(6, appointment.getNotes());
                    insertPs.executeUpdate();
                }
                return true;
            });

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success("Appointment booked successfully without scheduling conflict", appointment)));
        } catch (SchedulingConflictException e) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getErrorCode(), e.getMessage())));
        } catch (DatabaseException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getErrorCode(), e.getMessage())));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("Booking interrupted")));
        } finally {
            if (lockAcquired) {
                AppointmentSchedulerLock.releaseTrainerLock(trainerId);
            }
        }
    }
}
