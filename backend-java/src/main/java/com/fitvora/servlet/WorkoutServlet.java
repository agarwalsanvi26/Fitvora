package com.fitvora.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fitvora.concurrency.WorkerThreadPoolManager;
import com.fitvora.dao.WorkoutDao;
import com.fitvora.dao.WorkoutDaoImpl;
import com.fitvora.enums.DifficultyLevel;
import com.fitvora.enums.MuscleGroup;
import com.fitvora.exception.DatabaseException;
import com.fitvora.generics.ApiResponse;
import com.fitvora.model.AbstractWorkout;
import com.fitvora.model.CardioWorkout;
import com.fitvora.model.MobilityWorkout;
import com.fitvora.model.StrengthWorkout;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * RESTful Workout Controller Servlet.
 * Demonstrates:
 * 1. Polymorphic calculation via CalorieCalculable interface
 * 2. Servlet request handling and query param parsing
 * 3. Thread-safe atomic metric increment
 */
@WebServlet("/api/workouts/*")
public class WorkoutServlet extends HttpServlet {
    private final WorkoutDao workoutDao = new WorkoutDaoImpl();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void init() throws ServletException {
        mapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String pathInfo = req.getPathInfo();

        try {
            // Polymorphic simulation endpoint: /api/workouts/estimate-calories
            if ("/estimate-calories".equals(pathInfo)) {
                String type = req.getParameter("type");
                double weight = Double.parseDouble(req.getParameter("weight") != null ? req.getParameter("weight") : "70");
                int duration = Integer.parseInt(req.getParameter("duration") != null ? req.getParameter("duration") : "45");

                AbstractWorkout workout;
                if ("CARDIO".equalsIgnoreCase(type)) {
                    workout = new CardioWorkout(1L, "Aerobic Burn", "Run", duration, DifficultyLevel.INTERMEDIATE, 3, 10.5);
                } else if ("MOBILITY".equalsIgnoreCase(type)) {
                    workout = new MobilityWorkout(2L, "Restorative Flow", "Joint reset", duration, DifficultyLevel.BEGINNER, "Spine");
                } else {
                    workout = new StrengthWorkout(3L, "Hypertrophy Push", "Chest & Triceps", duration, DifficultyLevel.INTERMEDIATE, MuscleGroup.CHEST, 16, 4500, 8.5);
                }

                double calories = workout.calculateCaloriesBurned(weight);

                Map<String, Object> payload = new HashMap<>();
                payload.put("workoutType", type != null ? type.toUpperCase() : "STRENGTH");
                payload.put("athleteWeightKg", weight);
                payload.put("durationMinutes", duration);
                payload.put("calculatedCaloriesBurned", calories);
                payload.put("protocol", workout.getWorkoutProtocol());

                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success(payload)));
                return;
            }

            // List workouts or filter by muscle
            String muscleParam = req.getParameter("muscle");
            List<AbstractWorkout> list;
            if (muscleParam != null) {
                list = workoutDao.findByMuscleGroup(MuscleGroup.valueOf(muscleParam.toUpperCase()));
            } else {
                list = workoutDao.findAll();
            }

            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success(list)));
        } catch (DatabaseException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getErrorCode(), e.getMessage())));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_REQUEST_PROCESSING", e.getMessage())));
        }
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

        try {
            // Track total completed workouts using thread-safe counter
            WorkerThreadPoolManager.incrementWorkouts();

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success("Workout logged successfully", null)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }
}
