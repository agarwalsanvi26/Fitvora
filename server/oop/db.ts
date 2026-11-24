/**
 * Real SQLite-Backed Database Layer (via Node 22 built-in node:sqlite)
 * Provides real JDBC-style PreparedStatement execution, ConnectionPool,
 * and ACID TransactionManager with BEGIN IMMEDIATE / COMMIT / ROLLBACK.
 */

import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import path from 'node:path';
import { AbstractEntity } from './models.ts';
import type { GenericDao } from './generics.ts';
import { PaginatedResult } from './generics.ts';
import { DatabaseException, EntityNotFoundException } from './exceptions.ts';

export class PreparedStatement {
  private db: DatabaseSync;
  private sql: string;

  constructor(db: DatabaseSync, sql: string) {
    this.db = db;
    this.sql = sql;
  }

  public executeQuery<T = Record<string, unknown>>(...params: SQLInputValue[]): T[] {
    try {
      const stmt = this.db.prepare(this.sql);
      return stmt.all(...params) as unknown as T[];
    } catch (err: any) {
      throw new DatabaseException(`SQL query failed: ${err.message || err}`, this.sql, err);
    }
  }

  public executeGet<T = Record<string, unknown>>(...params: SQLInputValue[]): T | null {
    try {
      const stmt = this.db.prepare(this.sql);
      const row = stmt.get(...params);
      return (row as unknown as T) ?? null;
    } catch (err: any) {
      throw new DatabaseException(`SQL lookup failed: ${err.message || err}`, this.sql, err);
    }
  }

  public executeUpdate(...params: SQLInputValue[]): { changes: number; lastInsertRowid: number | bigint } {
    try {
      const stmt = this.db.prepare(this.sql);
      const res = stmt.run(...params);
      return { changes: Number(res.changes), lastInsertRowid: res.lastInsertRowid };
    } catch (err: any) {
      throw new DatabaseException(`SQL update failed: ${err.message || err}`, this.sql, err);
    }
  }
}

/**
 * Real Database Connection backed by node:sqlite DatabaseSync
 */
export class JdbcConnection {
  private id: string;
  private db: DatabaseSync;
  private autoCommit = true;
  private inTransaction = false;
  private isClosedState = false;

  constructor(id: string, db: DatabaseSync) {
    this.id = id;
    this.db = db;
  }

  public getId(): string {
    return this.id;
  }

  public prepareStatement(sql: string): PreparedStatement {
    if (this.isClosedState) {
      throw new DatabaseException('Cannot prepare statement on a closed connection');
    }
    return new PreparedStatement(this.db, sql);
  }

  public ping(): boolean {
    if (this.isClosedState) return false;
    const row = this.db.prepare('SELECT 1 AS ok').get() as { ok?: number } | undefined;
    return row?.ok === 1;
  }

  public setAutoCommit(autoCommit: boolean): void {
    if (this.isClosedState) {
      throw new DatabaseException('Cannot modify autoCommit on a closed connection');
    }
    if (!autoCommit && this.autoCommit) {
      this.db.exec('BEGIN IMMEDIATE');
      this.inTransaction = true;
    } else if (autoCommit && !this.autoCommit && this.inTransaction) {
      this.db.exec('COMMIT');
      this.inTransaction = false;
    }
    this.autoCommit = autoCommit;
  }

  public getAutoCommit(): boolean {
    return this.autoCommit;
  }

  public isInTransaction(): boolean {
    return this.inTransaction;
  }

  public commit(): void {
    if (this.isClosedState) {
      throw new DatabaseException('Cannot commit on a closed connection');
    }
    if (this.inTransaction) {
      this.db.exec('COMMIT');
      this.inTransaction = false;
    }
  }

  public rollback(): void {
    if (this.isClosedState) {
      throw new DatabaseException('Cannot rollback on a closed connection');
    }
    if (this.inTransaction) {
      this.db.exec('ROLLBACK');
      this.inTransaction = false;
    }
  }

  public close(): void {
    if (!this.isClosedState) {
      try {
        if (this.inTransaction) {
          this.db.exec('ROLLBACK');
          this.inTransaction = false;
        }
        this.db.close();
      } catch {
        // ignore close cleanup
      }
      this.isClosedState = true;
    }
  }

  public isClosed(): boolean {
    return this.isClosedState;
  }
}

/**
 * Database Connection Factory configuring SQLite connection & relational schema.
 */
export class DatabaseConnectionFactory {
  private static schemaInitialized = false;

  public static getDatabasePath(): string {
    const configured = process.env.FITVORA_SQLITE_PATH;
    if (configured && configured.trim().length > 0) {
      return configured.trim();
    }
    return path.resolve(process.cwd(), 'fitvora.db');
  }

  public static getDriverClass(): string {
    return 'node:sqlite (DatabaseSync)';
  }

  public static createConnection(id: number): JdbcConnection {
    const dbPath = this.getDatabasePath();
    const db = new DatabaseSync(dbPath, { timeout: 5000 });
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec('PRAGMA busy_timeout = 5000;');

    if (!this.schemaInitialized) {
      db.exec('PRAGMA journal_mode = WAL;');
      this.initializeSchema(db);
      this.schemaInitialized = true;
    }

    return new JdbcConnection(`conn_${id}`, db);
  }

  private static initializeSchema(db: DatabaseSync): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL DEFAULT '',
        role TEXT NOT NULL CHECK(role IN ('USER', 'TRAINER', 'ADMIN')) DEFAULT 'USER',
        active INTEGER NOT NULL DEFAULT 1,
        height_cm REAL DEFAULT 175,
        weight_kg REAL DEFAULT 70,
        target_weight_kg REAL DEFAULT 65,
        fitness_goal TEXT DEFAULT 'GENERAL_FITNESS',
        daily_calorie_target INTEGER DEFAULT 2150,
        daily_water_target_liters REAL DEFAULT 2.5,
        streak_days INTEGER DEFAULT 0,
        specialization TEXT,
        hourly_rate REAL,
        department TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        duration_minutes INTEGER NOT NULL,
        difficulty_level TEXT NOT NULL,
        muscle_group TEXT NOT NULL,
        workout_type TEXT NOT NULL CHECK(workout_type IN ('STRENGTH', 'CARDIO', 'MOBILITY')),
        total_sets INTEGER,
        volume_load_kg REAL,
        rpe_target REAL,
        heart_rate_zone INTEGER,
        average_heart_rate_bpm INTEGER,
        target_joints TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        athlete_id TEXT NOT NULL,
        trainer_id TEXT NOT NULL,
        session_time TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL DEFAULT 60,
        status TEXT NOT NULL CHECK(status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (athlete_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_appointments_trainer_time ON appointments(trainer_id, session_time);
    `);

    const now = new Date().toISOString();
    const userCountRow = db.prepare('SELECT COUNT(*) AS cnt FROM users').get() as { cnt?: number } | undefined;
    if (Number(userCountRow?.cnt ?? 0) === 0) {
      const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users
        (id, name, email, password_hash, role, active, height_cm, weight_kg, target_weight_kg, fitness_goal, daily_calorie_target, daily_water_target_liters, streak_days, specialization, hourly_rate, department, created_at, updated_at, version)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `);
      insertUser.run(
        'usr_1', 'Elena Vance', 'elena.vance@example.com', '', 'USER', 1,
        172, 65.5, 60, 'WEIGHT_LOSS', 2150, 2.5, 12, null, null, null, now, now
      );
      insertUser.run(
        'trn_1', 'Marcus Sterling', 'marcus.sterling@example.com', '', 'TRAINER', 1,
        180, 82, 82, 'STRENGTH', 2600, 3.0, 20, 'Strength & Hypertrophy', 85, null, now, now
      );
    }

    const workoutCountRow = db.prepare('SELECT COUNT(*) AS cnt FROM workouts').get() as { cnt?: number } | undefined;
    if (Number(workoutCountRow?.cnt ?? 0) === 0) {
      const insertWorkout = db.prepare(`
        INSERT OR IGNORE INTO workouts
        (id, title, description, duration_minutes, difficulty_level, muscle_group, workout_type, total_sets, volume_load_kg, rpe_target, heart_rate_zone, average_heart_rate_bpm, target_joints, created_at, updated_at, version)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `);
      insertWorkout.run(
        'wkt_1', 'Upper Body Power & Hypertrophy', 'Progressive overload resistance protocol',
        50, 'INTERMEDIATE', 'CHEST', 'STRENGTH', 16, 4500, 8.5, null, null, null, now, now
      );
      insertWorkout.run(
        'wkt_2', 'Zone 2 Aerobic Base Conditioning', 'Endurance and steady-state cardio',
        45, 'INTERMEDIATE', 'FULL_BODY', 'CARDIO', null, null, null, 3, 142, null, now, now
      );
      insertWorkout.run(
        'wkt_3', 'Spine & Hip Restorative Flow', 'Restorative mobility and recovery session',
        30, 'BEGINNER', 'FULL_BODY', 'MOBILITY', null, null, null, null, null, JSON.stringify(['Thoracic Spine', 'Hip Flexors', 'Ankles']), now, now
      );
    }
  }
}

/**
 * Thread-Safe Connection Pool Singleton backed by real SQLite connections.
 */
export class ConnectionPool {
  private static instance: ConnectionPool | null = null;
  private readonly maxPoolSize = 10;
  private availableConnections: JdbcConnection[] = [];
  private activeConnectionsCount = 0;
  private totalCreated = 0;

  private constructor() {
    for (let i = 1; i <= 3; i++) {
      this.availableConnections.push(DatabaseConnectionFactory.createConnection(i));
      this.totalCreated++;
    }
  }

  public static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool();
    }
    return ConnectionPool.instance;
  }

  public async getConnection(timeoutMs = 3000): Promise<JdbcConnection> {
    const startTime = Date.now();

    while (this.availableConnections.length === 0) {
      if (this.totalCreated < this.maxPoolSize) {
        this.totalCreated++;
        const newConn = DatabaseConnectionFactory.createConnection(this.totalCreated);
        this.activeConnectionsCount++;
        return newConn;
      }

      if (Date.now() - startTime > timeoutMs) {
        throw new DatabaseException(`Connection pool timeout exhausted (${timeoutMs}ms). Max pool size of ${this.maxPoolSize} reached.`);
      }

      await new Promise(resolve => setTimeout(resolve, 25));
    }

    let conn = this.availableConnections.pop()!;
    if (conn.isClosed()) {
      conn = DatabaseConnectionFactory.createConnection(++this.totalCreated);
    }
    this.activeConnectionsCount++;
    return conn;
  }

  public releaseConnection(conn: JdbcConnection | null): void {
    if (!conn) return;
    try {
      if (conn.isInTransaction()) {
        conn.rollback();
      }
      if (!conn.getAutoCommit()) {
        conn.setAutoCommit(true);
      }
    } catch {
      // ignore cleanup
    }
    this.activeConnectionsCount = Math.max(0, this.activeConnectionsCount - 1);
    if (!conn.isClosed()) {
      this.availableConnections.push(conn);
    }
  }

  public verifyDatabaseHealth(): { connected: boolean; engine: string; path: string } {
    const conn = this.availableConnections[0];
    try {
      const ok = conn ? conn.ping() : DatabaseConnectionFactory.createConnection(0).ping();
      return {
        connected: ok,
        engine: DatabaseConnectionFactory.getDriverClass(),
        path: path.basename(DatabaseConnectionFactory.getDatabasePath())
      };
    } catch {
      return {
        connected: false,
        engine: DatabaseConnectionFactory.getDriverClass(),
        path: path.basename(DatabaseConnectionFactory.getDatabasePath())
      };
    }
  }

  public getPoolStats() {
    return {
      available: this.availableConnections.length,
      active: this.activeConnectionsCount,
      total: this.totalCreated,
      maxPoolSize: this.maxPoolSize,
      engine: DatabaseConnectionFactory.getDriverClass()
    };
  }
}

/**
 * ACID Transaction Manager with serialized write-transaction queue for SQLite.
 */
export class TransactionManager {
  private static txQueue: Promise<unknown> = Promise.resolve();

  public static executeInTransaction<T>(
    callback: (conn: JdbcConnection) => Promise<T>
  ): Promise<T> {
    const run = async (): Promise<T> => {
      const pool = ConnectionPool.getInstance();
      const conn = await pool.getConnection();

      try {
        conn.setAutoCommit(false); // Real SQL: BEGIN IMMEDIATE
        const result = await callback(conn);
        conn.commit(); // Real SQL: COMMIT
        return result;
      } catch (err: any) {
        try {
          conn.rollback(); // Real SQL: ROLLBACK
        } catch {
          // ignore rollback errors
        }
        throw new DatabaseException(`Transaction rolled back: ${err.message || err}`, err.sqlQuery, err);
      } finally {
        try {
          if (!conn.getAutoCommit()) {
            conn.setAutoCommit(true);
          }
        } catch {
          // ignore
        }
        pool.releaseConnection(conn);
      }
    };

    const next = this.txQueue.then(run, run);
    this.txQueue = next.catch(() => undefined);
    return next;
  }
}

/**
 * Abstract Base DAO backed by SQLite ConnectionPool & PreparedStatements.
 */
export abstract class BaseDao<T extends AbstractEntity, ID extends string> implements GenericDao<T, ID> {
  protected abstract readonly tableName: string;

  protected abstract mapRow(row: Record<string, unknown>): T;
  protected abstract insertEntity(conn: JdbcConnection, entity: T): void;
  protected abstract updateEntity(conn: JdbcConnection, entity: T): void;

  protected async withConnection<R>(fn: (conn: JdbcConnection) => Promise<R> | R): Promise<R> {
    const pool = ConnectionPool.getInstance();
    const conn = await pool.getConnection();
    try {
      return await fn(conn);
    } finally {
      pool.releaseConnection(conn);
    }
  }

  public async save(entity: T): Promise<T> {
    return TransactionManager.executeInTransaction(async (conn) => {
      if (!entity.getId()) {
        entity.setId(`id_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
      }
      entity.setCreatedAt(new Date());
      entity.setUpdatedAt(new Date());
      this.insertEntity(conn, entity);
      return entity;
    });
  }

  public async findById(id: ID): Promise<T | null> {
    return this.withConnection((conn) => {
      const row = conn
        .prepareStatement(`SELECT * FROM ${this.tableName} WHERE id = ?`)
        .executeGet(id);
      return row ? this.mapRow(row) : null;
    });
  }

  public async getById(id: ID): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new EntityNotFoundException(this.tableName, id);
    }
    return entity;
  }

  public async findAll(): Promise<T[]> {
    return this.withConnection((conn) => {
      const rows = conn
        .prepareStatement(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`)
        .executeQuery();
      return rows.map(r => this.mapRow(r));
    });
  }

  public async findPaginated(page = 1, pageSize = 10): Promise<PaginatedResult<T>> {
    const safePage = Math.max(1, page);
    const safeSize = Math.min(100, Math.max(1, pageSize));
    const offset = (safePage - 1) * safeSize;

    return this.withConnection((conn) => {
      const countRow = conn
        .prepareStatement(`SELECT COUNT(*) AS cnt FROM ${this.tableName}`)
        .executeGet<{ cnt: number }>();
      const totalCount = Number(countRow?.cnt ?? 0);
      const rows = conn
        .prepareStatement(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
        .executeQuery(safeSize, offset);
      const items = rows.map(r => this.mapRow(r));
      return new PaginatedResult<T>(items, totalCount, safePage, safeSize);
    });
  }

  public async update(entity: T): Promise<T> {
    return TransactionManager.executeInTransaction(async (conn) => {
      const id = entity.getId();
      if (!id) {
        throw new EntityNotFoundException(this.tableName, 'undefined');
      }
      const exists = conn
        .prepareStatement(`SELECT 1 AS found FROM ${this.tableName} WHERE id = ?`)
        .executeGet(id);
      if (!exists) {
        throw new EntityNotFoundException(this.tableName, id);
      }
      entity.incrementVersion();
      this.updateEntity(conn, entity);
      return entity;
    });
  }

  public async deleteById(id: ID): Promise<boolean> {
    return TransactionManager.executeInTransaction(async (conn) => {
      const result = conn
        .prepareStatement(`DELETE FROM ${this.tableName} WHERE id = ?`)
        .executeUpdate(id);
      return result.changes > 0;
    });
  }

  public async existsById(id: ID): Promise<boolean> {
    return this.withConnection((conn) => {
      const row = conn
        .prepareStatement(`SELECT 1 AS found FROM ${this.tableName} WHERE id = ? LIMIT 1`)
        .executeGet(id);
      return Boolean(row);
    });
  }

  public async count(): Promise<number> {
    return this.withConnection((conn) => {
      const row = conn
        .prepareStatement(`SELECT COUNT(*) AS cnt FROM ${this.tableName}`)
        .executeGet<{ cnt: number }>();
      return Number(row?.cnt ?? 0);
    });
  }
}
