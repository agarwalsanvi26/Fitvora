package com.fitvora.db;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * JDBC Utilities for clean resource cleanup.
 */
public final class JdbcUtils {

    private JdbcUtils() {
    }

    public static void closeQuietly(AutoCloseable resource) {
        if (resource != null) {
            try {
                resource.close();
            } catch (Exception ignored) {
            }
        }
    }

    public static void closeAll(ResultSet rs, Statement stmt, Connection conn) {
        closeQuietly(rs);
        closeQuietly(stmt);
        if (conn != null) {
            ConnectionPool.getInstance().releaseConnection(conn);
        }
    }
}
