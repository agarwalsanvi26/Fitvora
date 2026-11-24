package com.fitvora.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fitvora.dao.UserDao;
import com.fitvora.dao.UserDaoImpl;
import com.fitvora.enums.FitnessGoal;
import com.fitvora.enums.UserRole;
import com.fitvora.exception.DatabaseException;
import com.fitvora.generics.ApiResponse;
import com.fitvora.model.AthleteUser;
import com.fitvora.model.User;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

/**
 * Authentication Servlet handling login, registration, logout, and active session inspection.
 */
@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {
    private final UserDao userDao = new UserDaoImpl();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void init() throws ServletException {
        mapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String pathInfo = req.getPathInfo();

        if (!"/me".equals(pathInfo)) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_NOT_FOUND", "Endpoint not found")));
            return;
        }

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute(AuthenticationFilter.SESSION_USER_ID) == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_UNAUTHORIZED", "Not signed in")));
            return;
        }

        Long userId = (Long) session.getAttribute(AuthenticationFilter.SESSION_USER_ID);
        try {
            Optional<User> userOpt = userDao.findById(userId);
            if (userOpt.isEmpty()) {
                session.invalidate();
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_UNAUTHORIZED", "Session user not found")));
                return;
            }
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success(UserServlet.toSafeUserDto(userOpt.get()))));
        } catch (DatabaseException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getErrorCode(), e.getMessage())));
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String pathInfo = req.getPathInfo();

        try {
            if ("/login".equals(pathInfo)) {
                Map<String, Object> body = mapper.readValue(req.getInputStream(), Map.class);
                String email = body.get("email") != null ? body.get("email").toString().trim() : "";
                String password = body.get("password") != null ? body.get("password").toString() : "";

                if (email.isEmpty() || password.isEmpty()) {
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_VALIDATION", "Email and password are required")));
                    return;
                }

                Optional<User> userOpt = userDao.findByEmail(email);
                if (userOpt.isEmpty() || !userOpt.get().isActive() || !BCrypt.checkpw(password, userOpt.get().getPasswordHash())) {
                    resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_INVALID_CREDENTIALS", "Invalid email or password")));
                    return;
                }

                User user = userOpt.get();
                HttpSession oldSession = req.getSession(false);
                if (oldSession != null) {
                    oldSession.invalidate();
                }
                HttpSession session = req.getSession(true);
                session.setAttribute(AuthenticationFilter.SESSION_USER_ID, user.getId());
                session.setAttribute(AuthenticationFilter.SESSION_USER_ROLE, user.getRole());
                session.setAttribute(AuthenticationFilter.SESSION_USER_EMAIL, user.getEmail());

                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success("Signed in successfully", UserServlet.toSafeUserDto(user))));
                return;
            }

            if ("/register".equals(pathInfo)) {
                Map<String, Object> body = mapper.readValue(req.getInputStream(), Map.class);
                String name = body.get("name") != null ? body.get("name").toString().trim() : "";
                String email = body.get("email") != null ? body.get("email").toString().trim().toLowerCase() : "";
                String password = body.get("password") != null ? body.get("password").toString() : "";

                if (name.isEmpty() || email.isEmpty() || password.length() < 8) {
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_VALIDATION", "Name, email, and a password of at least 8 characters are required")));
                    return;
                }

                if (userDao.findByEmail(email).isPresent()) {
                    resp.setStatus(HttpServletResponse.SC_CONFLICT);
                    resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_EMAIL_EXISTS", "An account with this email already exists")));
                    return;
                }

                AthleteUser athlete = new AthleteUser();
                athlete.setName(name);
                athlete.setEmail(email);
                athlete.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt(12)));
                // Least-privilege default role regardless of client payload
                athlete.setRole(UserRole.USER);
                athlete.setActive(true);
                athlete.setFitnessGoal(FitnessGoal.GENERAL_FITNESS);

                User saved = userDao.save(athlete);
                HttpSession session = req.getSession(true);
                session.setAttribute(AuthenticationFilter.SESSION_USER_ID, saved.getId());
                session.setAttribute(AuthenticationFilter.SESSION_USER_ROLE, saved.getRole());
                session.setAttribute(AuthenticationFilter.SESSION_USER_EMAIL, saved.getEmail());

                resp.setStatus(HttpServletResponse.SC_CREATED);
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success("Account registered successfully", UserServlet.toSafeUserDto(saved))));
                return;
            }

            if ("/logout".equals(pathInfo)) {
                HttpSession session = req.getSession(false);
                if (session != null) {
                    session.invalidate();
                }
                resp.getWriter().write(mapper.writeValueAsString(ApiResponse.success("Signed out successfully", null)));
                return;
            }

            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error("ERR_NOT_FOUND", "Auth endpoint not found")));
        } catch (DatabaseException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(e.getErrorCode(), e.getMessage())));
        }
    }
}
