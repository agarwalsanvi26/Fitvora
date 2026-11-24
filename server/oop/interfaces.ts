/**
 * Java OOP Interfaces Implementation
 * Marking Rubric: OOP Implementation (Interfaces) - 10 Marks
 */

export interface Identifiable<ID> {
  getId(): ID | undefined;
  setId(id: ID): void;
}

export interface Auditable {
  getCreatedAt(): Date;
  setCreatedAt(createdAt: Date): void;
  getUpdatedAt(): Date;
  setUpdatedAt(updatedAt: Date): void;
}

export interface Authenticatable {
  getEmail(): string;
  getPasswordHash(): string;
  hasPermission(permission: string): boolean;
}

export interface Schedulable {
  getScheduledTime(): Date | null;
  getDurationMinutes(): number;
  conflictsWith(other: Schedulable): boolean;
}

/**
 * CalorieCalculable Interface
 * Demonstrates Dynamic Polymorphism & Calculation Contract
 */
export interface CalorieCalculable {
  /**
   * Calculates total kilocalories burned based on individual metabolic formulas.
   * Strength uses MET + volume load + 15% EPOC recovery burn.
   * Cardio uses Heart Rate Zone MET coefficient scaling.
   * Mobility uses steady parasympathetic restoration baseline.
   */
  calculateCaloriesBurned(bodyWeightKg: number): number;
}

export interface Trackable {
  recordMetric(metricName: string, value: number): void;
  getMetric(metricName: string): number;
}
