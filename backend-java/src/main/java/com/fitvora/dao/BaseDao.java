package com.fitvora.dao;

import com.fitvora.db.ConnectionPool;
import com.fitvora.db.JdbcUtils;
import com.fitvora.exception.DatabaseException;
import com.fitvora.exception.EntityNotFoundException;
import com.fitvora.generics.GenericDao;
import com.fitvora.generics.PaginatedResult;
import com.fitvora.model.AbstractEntity;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Abstract Base DAO providing standard JDBC implementation for GenericDao.
 * Demonstrates:
 * 1. Generics & Collections
 * 2. Classes for database operations (DAO pattern)
 * 3. PreparedStatements to prevent SQL Injection
 * 4. Try-with-resources and proper JDBC resource management
 *
 * @param <T>  Entity type bound to AbstractEntity
 * @param <ID> Primary key type bound to Serializable
 */
public abstract class BaseDao<T extends AbstractEntity, ID extends Serializable> implements GenericDao<T, ID> {

    protected abstract String getTableName();
    protected abstract String getPrimaryKeyColumnName();
    protected abstract T mapRowToEntity(ResultSet rs) throws SQLException;

    protected Connection getConnection() throws DatabaseException {
        return ConnectionPool.getInstance().getConnection();
    }

    protected void releaseConnection(Connection conn) {
        ConnectionPool.getInstance().releaseConnection(conn);
    }

    @Override
    public Optional<T> findById(ID id) throws DatabaseException {
        String sql = String.format("SELECT * FROM %s WHERE %s = ?", getTableName(), getPrimaryKeyColumnName());
        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            ps = conn.prepareStatement(sql);
            ps.setObject(1, id);
            rs = ps.executeQuery();

            if (rs.next()) {
                return Optional.of(mapRowToEntity(rs));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new DatabaseException("Failed finding " + getTableName() + " by ID: " + id, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public T getById(ID id) throws EntityNotFoundException, DatabaseException {
        return findById(id).orElseThrow(() -> new EntityNotFoundException(getTableName(), id));
    }

    @Override
    public List<T> findAll() throws DatabaseException {
        String sql = String.format("SELECT * FROM %s ORDER BY %s DESC", getTableName(), getPrimaryKeyColumnName());
        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<T> results = new ArrayList<>();

        try {
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                results.add(mapRowToEntity(rs));
            }
            return results;
        } catch (SQLException e) {
            throw new DatabaseException("Failed fetching all records from " + getTableName(), e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public PaginatedResult<T> findPaginated(int page, int pageSize) throws DatabaseException {
        int offset = Math.max(0, page * pageSize);
        String countSql = String.format("SELECT COUNT(*) FROM %s", getTableName());
        String selectSql = String.format("SELECT * FROM %s ORDER BY %s DESC LIMIT ? OFFSET ?", getTableName(), getPrimaryKeyColumnName());

        Connection conn = getConnection();
        PreparedStatement countPs = null;
        PreparedStatement selectPs = null;
        ResultSet countRs = null;
        ResultSet selectRs = null;
        List<T> results = new ArrayList<>();

        try {
            countPs = conn.prepareStatement(countSql);
            countRs = countPs.executeQuery();
            long totalElements = 0;
            if (countRs.next()) {
                totalElements = countRs.getLong(1);
            }

            selectPs = conn.prepareStatement(selectSql);
            selectPs.setInt(1, pageSize);
            selectPs.setInt(2, offset);
            selectRs = selectPs.executeQuery();

            while (selectRs.next()) {
                results.add(mapRowToEntity(selectRs));
            }

            return new PaginatedResult<>(results, page, pageSize, totalElements);
        } catch (SQLException e) {
            throw new DatabaseException("Pagination failed on " + getTableName(), e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeQuietly(countRs);
            JdbcUtils.closeQuietly(countPs);
            JdbcUtils.closeAll(selectRs, selectPs, conn);
        }
    }

    @Override
    public boolean deleteById(ID id) throws DatabaseException {
        String sql = String.format("DELETE FROM %s WHERE %s = ?", getTableName(), getPrimaryKeyColumnName());
        Connection conn = getConnection();
        PreparedStatement ps = null;

        try {
            ps = conn.prepareStatement(sql);
            ps.setObject(1, id);
            int rows = ps.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Failed deleting from " + getTableName() + " with ID: " + id, e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(null, ps, conn);
        }
    }

    @Override
    public boolean existsById(ID id) throws DatabaseException {
        String sql = String.format("SELECT 1 FROM %s WHERE %s = ? LIMIT 1", getTableName(), getPrimaryKeyColumnName());
        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            ps = conn.prepareStatement(sql);
            ps.setObject(1, id);
            rs = ps.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            throw new DatabaseException("Exists check failed on " + getTableName(), e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }

    @Override
    public long count() throws DatabaseException {
        String sql = String.format("SELECT COUNT(*) FROM %s", getTableName());
        Connection conn = getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getLong(1);
            }
            return 0;
        } catch (SQLException e) {
            throw new DatabaseException("Count failed on " + getTableName(), e.getSQLState(), e.getErrorCode(), e);
        } finally {
            JdbcUtils.closeAll(rs, ps, conn);
        }
    }
}
