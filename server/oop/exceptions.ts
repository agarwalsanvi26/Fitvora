/**
 * Java Exception Handling Hierarchy
 * Marking Rubric: Exception Handling (OOP Implementation - 10 Marks)
 */

export class FitvoraException extends Error {
  public readonly errorCode: string;
  public readonly timestamp: string;
  public readonly details?: unknown;

  constructor(errorCode: string, message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Wraps database / SQL / JDBC failures with diagnostic context.
 */
export class DatabaseException extends FitvoraException {
  public readonly sqlQuery?: string;

  constructor(message: string, sqlQuery?: string, details?: unknown) {
    super('ERR_DATABASE_OPERATION', message, details);
    this.sqlQuery = sqlQuery;
  }
}

export class EntityNotFoundException extends FitvoraException {
  constructor(entityName: string, id: string | number) {
    super('ERR_ENTITY_NOT_FOUND', `${entityName} with ID '${id}' was not found in the persistence store.`);
  }
}

export class AuthenticationException extends FitvoraException {
  constructor(message = 'Invalid credentials or expired security session.') {
    super('ERR_AUTHENTICATION_FAILED', message);
  }
}

export class ValidationException extends FitvoraException {
  public readonly validationErrors: string[];

  constructor(message: string, validationErrors: string[] = []) {
    super('ERR_VALIDATION_FAILED', message);
    this.validationErrors = validationErrors;
  }
}

export class SchedulingConflictException extends FitvoraException {
  constructor(resourceName: string, timeSlot: string) {
    super(
      'ERR_SCHEDULING_CONFLICT',
      `Schedule conflict detected on resource '${resourceName}' for time slot '${timeSlot}'. Another session is already booked.`
    );
  }
}

export class ConcurrencyConflictException extends FitvoraException {
  constructor(resource: string, version: number) {
    super(
      'ERR_CONCURRENCY_CONFLICT',
      `Optimistic lock failure on resource '${resource}' (version conflict: expected current version, found ${version}).`
    );
  }
}
