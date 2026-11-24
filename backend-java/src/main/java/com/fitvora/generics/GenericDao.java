package com.fitvora.generics;

import com.fitvora.exception.DatabaseException;
import com.fitvora.exception.EntityNotFoundException;
import com.fitvora.model.AbstractEntity;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * Generic Data Access Object Interface.
 * Demonstrates Generics, Type Bounds (T extends AbstractEntity), and the DAO pattern.
 *
 * @param <T>  The entity type bound by AbstractEntity
 * @param <ID> The entity primary key type bound by Serializable
 */
public interface GenericDao<T extends AbstractEntity, ID extends Serializable> {

    /**
     * Persist a new entity.
     * @param entity the entity instance
     * @return the persisted entity with generated primary key
     * @throws DatabaseException on SQL error
     */
    T save(T entity) throws DatabaseException;

    /**
     * Find entity by primary key.
     * @param id primary key
     * @return Optional containing entity if found
     * @throws DatabaseException on SQL error
     */
    Optional<T> findById(ID id) throws DatabaseException;

    /**
     * Retrieve entity or throw EntityNotFoundException.
     * @param id primary key
     * @return entity instance
     * @throws EntityNotFoundException if not found
     * @throws DatabaseException on SQL error
     */
    T getById(ID id) throws EntityNotFoundException, DatabaseException;

    /**
     * Retrieve all instances.
     * @return List of entities (Java Collections Framework)
     * @throws DatabaseException on SQL error
     */
    List<T> findAll() throws DatabaseException;

    /**
     * Retrieve paginated subset of entities.
     * @param page zero-based page index
     * @param pageSize page limit
     * @return PaginatedResult generic container
     * @throws DatabaseException on SQL error
     */
    PaginatedResult<T> findPaginated(int page, int pageSize) throws DatabaseException;

    /**
     * Update existing entity.
     * @param entity modified entity instance
     * @return updated entity
     * @throws DatabaseException on SQL error
     */
    T update(T entity) throws DatabaseException;

    /**
     * Delete entity by primary key.
     * @param id primary key
     * @return true if deleted, false if not present
     * @throws DatabaseException on SQL error
     */
    boolean deleteById(ID id) throws DatabaseException;

    /**
     * Check if entity exists by primary key.
     * @param id primary key
     * @return true if exists
     * @throws DatabaseException on SQL error
     */
    boolean existsById(ID id) throws DatabaseException;

    /**
     * Count total entities in table.
     * @return row count
     * @throws DatabaseException on SQL error
     */
    long count() throws DatabaseException;
}
