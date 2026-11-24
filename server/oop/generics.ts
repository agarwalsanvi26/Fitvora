/**
 * Java Generics and Collections Implementation
 * Marking Rubric: Collections & Generics - 6 Marks
 */

import { AbstractEntity } from './models.ts';

/**
 * Generic DAO Contract with type-bounded parameter:
 * <T extends AbstractEntity, ID>
 */
export interface GenericDao<T extends AbstractEntity, ID> {
  save(entity: T): Promise<T>;
  findById(id: ID): Promise<T | null>;
  getById(id: ID): Promise<T>;
  findAll(): Promise<T[]>;
  findPaginated(page: number, pageSize: number): Promise<PaginatedResult<T>>;
  update(entity: T): Promise<T>;
  deleteById(id: ID): Promise<boolean>;
  existsById(id: ID): Promise<boolean>;
  count(): Promise<number>;
}

/**
 * Generic Paginated Result Container
 */
export class PaginatedResult<T> {
  public readonly items: T[];
  public readonly totalCount: number;
  public readonly page: number;
  public readonly pageSize: number;
  public readonly totalPages: number;
  public readonly hasNext: boolean;
  public readonly hasPrevious: boolean;

  constructor(items: T[], totalCount: number, page: number, pageSize: number) {
    this.items = items;
    this.totalCount = totalCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalCount / Math.max(1, pageSize));
    this.hasNext = page < this.totalPages;
    this.hasPrevious = page > 1;
  }
}

/**
 * Standard Generic API Response Envelope
 */
export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message?: string;
  public readonly data?: T;
  public readonly errorCode?: string;
  public readonly timestamp: string;

  private constructor(success: boolean, message?: string, data?: T, errorCode?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
  }

  public static ok<T>(data: T, message = 'Operation completed successfully'): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  public static error<T>(message: string, errorCode = 'ERR_INTERNAL_SERVER'): ApiResponse<T> {
    return new ApiResponse<T>(false, message, undefined, errorCode);
  }
}

/**
 * Functional Generic Predicate DataFilter with boolean combinators
 */
export class DataFilter<T> {
  private predicate: (item: T) => boolean;

  constructor(predicate: (item: T) => boolean) {
    this.predicate = predicate;
  }

  public test(item: T): boolean {
    return this.predicate(item);
  }

  public and(other: DataFilter<T>): DataFilter<T> {
    return new DataFilter<T>(item => this.predicate(item) && other.test(item));
  }

  public or(other: DataFilter<T>): DataFilter<T> {
    return new DataFilter<T>(item => this.predicate(item) || other.test(item));
  }

  public not(): DataFilter<T> {
    return new DataFilter<T>(item => !this.predicate(item));
  }
}
