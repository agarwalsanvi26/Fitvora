package com.fitvora.db;

import com.fitvora.exception.DatabaseException;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Thread-Safe High Performance JDBC Connection Pool.
 * Demonstrates:
 * 1. Multithreading & Synchronization (BlockingQueue, volatile, AtomicInteger, double-checked locking)
 * 2. JDBC lifecycle management and pool checkout/checkin
 */
public class ConnectionPool {
    private static volatile ConnectionPool instance;
    private static final int INITIAL_POOL_SIZE = 5;
    private static final int MAX_POOL_SIZE = 20;
    private static final long ACQUIRE_TIMEOUT_MS = 3000;

    private final BlockingQueue<Connection> pool;
    private final AtomicInteger activeConnectionsCount;
    private volatile boolean isShutdown = false;

    private ConnectionPool() {
        this.pool = new ArrayBlockingQueue<>(MAX_POOL_SIZE);
        this.activeConnectionsCount = new AtomicInteger(0);
        initializePool();
    }

    /**
     * Thread-Safe Singleton Accessor using Double-Checked Locking.
     */
    public static ConnectionPool getInstance() {
        if (instance == null) {
            synchronized (ConnectionPool.class) {
                if (instance == null) {
                    instance = new ConnectionPool();
                }
            }
        }
        return instance;
    }

    private void initializePool() {
        for (int i = 0; i < INITIAL_POOL_SIZE; i++) {
            try {
                Connection conn = DatabaseConnectionFactory.createConnection();
                pool.offer(conn);
                activeConnectionsCount.incrementAndGet();
            } catch (DatabaseException e) {
                System.err.println("Database connection pool bootstrap warning: " + e.getMessage());
                break;
            }
        }
    }

    /**
     * Borrow a JDBC Connection from the pool in a thread-safe manner.
     * @return open java.sql.Connection
     * @throws DatabaseException if timeout occurs or pool is exhausted
     */
    public Connection getConnection() throws DatabaseException {
        if (isShutdown) {
            throw new DatabaseException("ConnectionPool has been shut down.", null);
        }

        try {
            Connection conn = pool.poll(ACQUIRE_TIMEOUT_MS, TimeUnit.MILLISECONDS);
            if (conn == null) {
                // If pool is empty but we haven't reached max pool size, spawn a new connection
                if (activeConnectionsCount.get() < MAX_POOL_SIZE) {
                    conn = DatabaseConnectionFactory.createConnection();
                    activeConnectionsCount.incrementAndGet();
                } else {
                    throw new DatabaseException("Connection pool exhausted. Timeout after " + ACQUIRE_TIMEOUT_MS + "ms", null);
                }
            }

            // Verify connection validity
            if (conn.isClosed()) {
                conn = DatabaseConnectionFactory.createConnection();
            }

            return conn;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Interrupted while waiting for database connection", e);
        } catch (SQLException e) {
            throw new DatabaseException("Error validating pooled connection", e.getSQLState(), e.getErrorCode(), e);
        }
    }

    /**
     * Return a borrowed JDBC Connection back to the pool.
     * @param conn connection to release
     */
    public void releaseConnection(Connection conn) {
        if (conn == null) return;

        try {
            if (isShutdown || conn.isClosed()) {
                activeConnectionsCount.decrementAndGet();
                if (!conn.isClosed()) conn.close();
                return;
            }

            // Reset autocommit if modified
            if (!conn.getAutoCommit()) {
                conn.setAutoCommit(true);
            }

            boolean returned = pool.offer(conn);
            if (!returned) {
                // Pool capacity exceeded, close it
                conn.close();
                activeConnectionsCount.decrementAndGet();
            }
        } catch (SQLException e) {
            System.err.println("Error releasing connection to pool: " + e.getMessage());
        }
    }

    /**
     * Gracefully close all connections in the pool.
     */
    public synchronized void shutdown() {
        this.isShutdown = true;
        while (!pool.isEmpty()) {
            try {
                Connection conn = pool.poll();
                if (conn != null && !conn.isClosed()) {
                    conn.close();
                }
            } catch (SQLException ignored) {
            }
        }
        activeConnectionsCount.set(0);
    }

    public int getAvailableConnections() {
        return pool.size();
    }

    public int getActiveConnectionsCount() {
        return activeConnectionsCount.get();
    }
}
