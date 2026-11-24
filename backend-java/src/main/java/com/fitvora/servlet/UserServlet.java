package com.fitvora.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fitvora.dao.UserDao;
import com.fitvora.dao.UserDaoImpl;
import com.fitvora.enums.UserRole;
import com.fitvora.exception.DatabaseException;
import com.fitvora.generics.ApiResponse;
import com.fitvora.model.AdminUser;
import com.fitvora.model.AthleteUser;
import com.fitvora.model.TrainerUser;
import com.fitvora.model.User;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * RESTful User Controller Servlet.
 * Enforces role-based authorization (ADMIN for directory listing / creation,
 * self-or-ADMIN for individual profile access/update) and strips sensitive
 * credential fields via explicit response DTO projection.
 */
@WebServlet("/api/users/*")
public class UserServlet extends HttpServlet {
    private final UserDao userDao = new UserDaoImpl();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void init() throws ServletException {
        mapper.registerModule(new JavaTimeModule());
    }

    /**
     * Explicit response-level DTO projection excluding passwordHash and internal secrets.
     */
    public static Map<String, Object> toSafeUserDto(User user) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", user.getId());
        dto.put("name", user.getName());
        dto.put("email", user.getEmail());
        dto.put("role", user.getRole());
        dto.put("active", user.isActive());
        dto.put("createdAt", user.getCreatedAt());

        if (user instanceof AthleteUser) {
            AthleteUser a = (AthleteUser) user;
            dto.put("heightCm", a.getHeightCm());
            dto.put("currentWeightKg", a.getCurrentWeightKg());
            dto.put("targetWeightKg", a.getTargetWeightKg());
            dto.put("fitnessGoal", a.getFitnessGoal());
            dto.put("dailyWaterTargetLiters", a.getDailyWaterTargetLiters());
            dto.put("streakDays", a.getStreakDays());
            dto.put("bmi", a.calculateBmi());
        } else if (user instanceof TrainerUser) {
            TrainerUser t = (TrainerUser) user;
            dto.put("certification", t.getCertification());
            dto.put("specialization", t.getSpecialization());
            dto.put("experienceYears", t.getExperienceYears());
            dto.put("hourlyRate", t.getHourlyRate());
            dto.put("rating", t.getRating());
        } else if (user instanceof AdminUser) {
            AdminUser ad = (AdminUser) user;
            dto.put("department", ad.getDepartment());
        }

        return dto;
    }

    private boolean isAuthenticated(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session == null
                || session.getAttribute(AuthenticationFilter.SESSION_USER_ID) == null
                || session.getAttribute(AuthenticationFilter.SESSION_USER_ROLE) == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_UNAUTHORIZED", "Authentication required")));
            return false;
        }
        return true;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        if (!isAuthenticated(req, resp)) {
            return;
        }

        HttpSession session = req.getSession(false);
        Long authUserId = (Long) session.getAttribute(AuthenticationFilter.SESSION_USER_ID);
        UserRole authRole = (UserRole) session.getAttribute(AuthenticationFilter.SESSION_USER_ROLE);
        String pathInfo = req.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                // Only ADMIN may list all users
                if (authRole != UserRole.ADMIN) {
                    resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_FORBIDDEN", "Administrator privileges required to list users")));
                    return;
                }

                List<Map<String, Object>> safeUsers = userDao.findAll().stream()
                        .map(UserServlet::toSafeUserDto)
                        .collect(Collectors.toList());
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success(safeUsers)));
            } else {
                String idStr = pathInfo.substring(1);
                Long id = Long.parseLong(idStr);

                // Enforce self-or-ADMIN authorization
                if (authRole != UserRole.ADMIN && !id.equals(authUserId)) {
                    resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_FORBIDDEN", "You are not authorized to access this user profile")));
                    return;
                }

                Optional<User> userOpt = userDao.findById(id);
                if (userOpt.isPresent()) {
                    resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success(toSafeUserDto(userOpt.get()))));
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_NOT_FOUND", "User not found with ID: " + id)));
                }
            }
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_INVALID_ID", "Invalid user ID format")));
        } catch (DatabaseException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getErrorCode(), e.getMessage())));
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        if (!isAuthenticated(req, resp)) {
            return;
        }

        HttpSession session = req.getSession(false);
        UserRole authRole = (UserRole) session.getAttribute(AuthenticationFilter.SESSION_USER_ROLE);
        if (authRole != UserRole.ADMIN) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_FORBIDDEN", "Only administrators can create users directly. Use /api/auth/register for signup.")));
            return;
        }

        try {
            Map<String, Object> body = mapper.readValue(req.getInputStream(), Map.class);
            String name = body.get("name") != null ? body.get("name").toString().trim() : "";
            String email = body.get("email") != null ? body.get("email").toString().trim().toLowerCase() : "";
            String password = body.get("password") != null ? body.get("password").toString() : "";

            if (name.isEmpty() || email.isEmpty() || password.length() < 8) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_VALIDATION", "Name, email, and password (min 8 chars) are mandatory")));
                return;
            }

            AthleteUser newAthlete = new AthleteUser();
            newAthlete.setName(name);
            newAthlete.setEmail(email);
            newAthlete.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt(12)));
            newAthlete.setRole(UserRole.USER);

            User saved = userDao.save(newAthlete);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success("User created successfully", toSafeUserDto(saved))));
        } catch (DatabaseException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getErrorCode(), e.getMessage())));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        if (!isAuthenticated(req, resp)) {
            return;
        }

        HttpSession session = req.getSession(false);
        Long authUserId = (Long) session.getAttribute(AuthenticationFilter.SESSION_USER_ID);
        UserRole authRole = (UserRole) session.getAttribute(AuthenticationFilter.SESSION_USER_ROLE);

        try {
            AthleteUser updates = mapper.readValue(req.getInputStream(), AthleteUser.class);
            if (updates.getId() == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("User ID required for update")));
                return;
            }

            if (authRole != UserRole.ADMIN && !updates.getId().equals(authUserId)) {
                resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_FORBIDDEN", "You can only update your own profile")));
                return;
            }

            Optional<User> existingOpt = userDao.findById(updates.getId());
            if (existingOpt.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_NOT_FOUND", "User not found")));
                return;
            }

            User existing = existingOpt.get();
            if (updates.getName() != null && !updates.getName().isBlank()) {
                existing.setName(updates.getName().trim());
            }
            if (updates.getEmail() != null && !updates.getEmail().isBlank()) {
                existing.setEmail(updates.getEmail().trim().toLowerCase());
            }
            if (authRole == UserRole.ADMIN) {
                existing.setActive(updates.isActive());
            }

            User updated = userDao.update(existing);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success("Profile updated", toSafeUserDto(updated))));
        } catch (DatabaseException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getErrorCode(), e.getMessage())));
        }
    }
}
