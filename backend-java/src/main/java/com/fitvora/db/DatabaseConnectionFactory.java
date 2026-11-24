package com.fitvora.db;

import com.fitvora.exception.DatabaseException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * JDBC Database Connection Factory.
 * Loads database connection URL and credentials from secure configuration
 * (environment variables or JVM system properties) rather than embedding
 * hardcoded development credentials.
 */
public class DatabaseConnectionFactory {
    private static final String DEFAULT_DRIVER = "com.mysql.cj.jdbc.Driver";

    private static volatile String driverClass;
    private static volatile String jdbcUrl;
    private static volatile String username;
    private static volatile String password;

    static {
        reloadFromEnvironment();
    }

    private DatabaseConnectionFactory() {
        // Prevent instantiation
    }

    public static synchronized void reloadFromEnvironment() {
        driverClass = readConfig("FITVORA_DB_DRIVER", "fitvora.db.driver", DEFAULT_DRIVER);
        jdbcUrl = readConfig("FITVORA_DB_URL", "fitvora.db.url", null);
        username = readConfig("FITVORA_DB_USER", "fitvora.db.user", null);
        password = readConfig("FITVORA_DB_PASSWORD", "fitvora.db.password", null);

        try {
            Class.forName(driverClass);
        } catch (ClassNotFoundException e) {
            System.err.println("WARN: JDBC Driver not found on classpath: " + e.getMessage());
        }
    }

    private static String readConfig(String envKey, String propKey, String fallback) {
        String envVal = System.getenv(envKey);
        if (envVal != null && !envVal.trim().isEmpty()) {
            return envVal.trim();
        }
        String propVal = System.getProperty(propKey);
        if (propVal != null && !propVal.trim().isEmpty()) {
            return propVal.trim();
        }
        return fallback;
    }

    /**
     * Programmatic configuration hook for dependency injection or test harnesses.
     */
    public static synchronized void configure(String url, String user, String pass) {
        jdbcUrl = url;
        username = user;
        password = pass;
    }

    /**
     * Direct factory method to obtain a new raw JDBC Connection.
     * Fails closed if database configuration is missing.
     *
     * @return open java.sql.Connection
     * @throws DatabaseException if configuration is missing or connection fails
     */
    public static Connection createConnection() throws DatabaseException {
        if (jdbcUrl == null || jdbcUrl.isBlank() || username == null || username.isBlank() || password == null || password.isBlank()) {
            throw new DatabaseException(
                "Database credentials are not configured. Supply FITVORA_DB_URL, FITVORA_DB_USER, and FITVORA_DB_PASSWORD via environment or system properties.",
                "ERR_DB_CONFIG_MISSING",
                0,
                null
            );
        }

        try {
            Properties props = new Properties();
            props.setProperty("user", username);
            props.setProperty("password", password);
            props.setProperty("characterEncoding", "UTF-8");
            return DriverManager.getConnection(jdbcUrl, props);
        } catch (SQLException e) {
            throw new DatabaseException("Failed to open JDBC connection", e.getSQLState(), e.getErrorCode(), e);
        }
    }

    public static String getJdbcUrl() {
        return jdbcUrl;
    }
}
