package com.fitvora.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fitvora.generics.ApiResponse;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Set;

/**
 * Servlet Filter for Session Authentication and CORS headers.
 * Rejects unauthenticated requests to protected API endpoints with HTTP 401.
 */
@WebFilter("/*")
public class AuthenticationFilter implements Filter {

    public static final String SESSION_USER_ID = "authenticatedUserId";
    public static final String SESSION_USER_ROLE = "authenticatedUserRole";
    public static final String SESSION_USER_EMAIL = "authenticatedUserEmail";

    private static final Set<String> PUBLIC_API_ROUTES = Set.of(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/logout",
        "/api/health"
    );

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        mapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Restrict CORS origin to configured frontend origin instead of wildcard '*'
        String allowedOrigin = System.getenv("FITVORA_ALLOWED_ORIGIN");
        String requestOrigin = httpRequest.getHeader("Origin");
        if (allowedOrigin != null && !allowedOrigin.isBlank() && allowedOrigin.equals(requestOrigin)) {
            httpResponse.setHeader("Access-Control-Allow-Origin", allowedOrigin);
            httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpResponse.setHeader("Vary", "Origin");
        }
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        httpResponse.setCharacterEncoding("UTF-8");

        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String contextPath = httpRequest.getContextPath() != null ? httpRequest.getContextPath() : "";
        String uri = httpRequest.getRequestURI();
        String route = uri.startsWith(contextPath) ? uri.substring(contextPath.length()) : uri;

        // Reject path-traversal attempts
        if (route.contains("..")) {
            writeUnauthorized(httpResponse, HttpServletResponse.SC_BAD_REQUEST, "ERR_INVALID_PATH", "Invalid request path");
            return;
        }

        // Allow exact public auth/health endpoints and non-API static resources
        if (PUBLIC_API_ROUTES.contains(route) || !route.startsWith("/api/")) {
            chain.doFilter(request, response);
            return;
        }

        // Enforce authenticated HTTP session for all protected /api/* routes
        HttpSession session = httpRequest.getSession(false);
        if (session == null
                || session.getAttribute(SESSION_USER_ID) == null
                || session.getAttribute(SESSION_USER_ROLE) == null) {
            writeUnauthorized(
                httpResponse,
                HttpServletResponse.SC_UNAUTHORIZED,
                "ERR_UNAUTHORIZED",
                "Authentication required. Please sign in to access this resource."
            );
            return;
        }

        chain.doFilter(request, response);
    }

    private void writeUnauthorized(HttpServletResponse resp, int status, String code, String message) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.getWriter().write(mapper.writeValueAsString(ApiResponse.error(code, message)));
    }

    @Override
    public void destroy() {
    }
}
