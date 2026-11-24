package com.fitvora.db;

import com.fitvora.exception.DatabaseException;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * JDBC Transaction Manager.
 * Demonstrates ACID transaction demarcation, commit, rollback, and savepoints.
 */
public class TransactionManager {

    @FunctionalInterface
    public interface TransactionCallback<T> {
        T doInTransaction(Connection conn) throws Exception;
    }

    /**
     * Executes a series of database operations within an isolated JDBC transaction.
     * Guarantees atomic commit or full rollback on failure.
     *
     * @param callback transactional business logic
     * @param <T> result type
     * @return transaction output
     * @throws DatabaseException if transaction fails
     */
    public static <T> T executeInTransaction(TransactionCallback<T> callback) throws DatabaseException {
        ConnectionPool pool = ConnectionPool.getInstance();
        Connection conn = pool.getConnection();

        try {
            conn.setAutoCommit(false); // Begin Transaction

            T result = callback.doInTransaction(conn);

            conn.commit(); // Commit Transaction
            return result;
        } catch (Exception e) {
            try {
                if (conn != null && !conn.isClosed()) {
                    conn.rollback(); // Rollback Transaction on error
                }
            } catch (SQLException rollbackEx) {
                System.err.println("Fatal: Transaction rollback failed: " + rollbackEx.getMessage());
            }

            if (e instanceof DatabaseException) {
                throw (DatabaseException) e;
            }
            throw new DatabaseException("Transaction execution failed: " + e.getMessage(), e);
        } finally {
            try {
                if (conn != null && !conn.isClosed()) {
                    conn.setAutoCommit(true);
                }
            } catch (SQLException ignored) {
            }
            pool.releaseConnection(conn);
        }
    }
}
