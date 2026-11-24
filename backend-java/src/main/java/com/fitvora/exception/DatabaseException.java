package com.fitvora.exception;

/**
 * Exception thrown when JDBC or SQL operations fail.
 * Wraps java.sql.SQLException with contextual database diagnostics.
 */
public class DatabaseException extends FitvoraException {
    private final String sqlState;
    private final int vendorCode;

    public DatabaseException(String message, Throwable cause) {
        super("ERR_DATABASE_OPERATION", message, cause);
        this.sqlState = null;
        this.vendorCode = 0;
    }

    public DatabaseException(String message, String sqlState, int vendorCode, Throwable cause) {
        super("ERR_DATABASE_SQL", message, cause);
        this.sqlState = sqlState;
        this.vendorCode = vendorCode;
    }

    public String getSqlState() {
        return sqlState;
    }

    public int getVendorCode() {
        return vendorCode;
    }
}
