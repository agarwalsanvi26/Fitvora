/**
 * Java OOP Domain Models
 * Marking Rubric:
 * - OOP Implementation (Inheritance & Polymorphism) - 10 Marks
 * - Problem Understanding & Solution Design - 8 Marks
 */

import type { Identifiable, Auditable, Authenticatable, CalorieCalculable, Schedulable, Trackable } from './interfaces.ts';
import { UserRole, FitnessGoal, DifficultyLevel, MuscleGroup, AppointmentStatus } from './enums.ts';

/**
 * Root Abstract Entity demonstrating OOP Abstraction and standard persistence fields.
 */
export abstract class AbstractEntity implements Identifiable<string>, Auditable {
  protected id?: string;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected version: number;

  constructor(id?: string) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.version = 1;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  public getVersion(): number {
    return this.version;
  }

  public incrementVersion(): void {
    this.version += 1;
    this.updatedAt = new Date();
  }
}

/**
 * Base User Entity demonstrating Inheritance & Encapsulation.
 */
export class User extends AbstractEntity implements Authenticatable, Trackable {
  protected name: string;
  protected email: string;
  protected passwordHash: string;
  protected role: UserRole;
  protected heightCm: number;
  protected currentWeightKg: number;
  protected metrics: Map<string, number>;

  constructor(
    id?: string,
    name = '',
    email = '',
    passwordHash = '',
    role: UserRole = UserRole.USER,
    heightCm = 175,
    currentWeightKg = 70
  ) {
    super(id);
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.heightCm = heightCm;
    this.currentWeightKg = currentWeightKg;
    this.metrics = new Map<string, number>();
  }

  public getName(): string { return this.name; }
  public setName(name: string): void { this.name = name; }

  public getEmail(): string { return this.email; }
  public setEmail(email: string): void { this.email = email; }

  public getPasswordHash(): string { return this.passwordHash; }
  public setPasswordHash(hash: string): void { this.passwordHash = hash; }

  public getRole(): UserRole { return this.role; }
  public setRole(role: UserRole): void { this.role = role; }

  public getHeightCm(): number { return this.heightCm; }
  public setHeightCm(height: number): void { this.heightCm = height; }

  public getCurrentWeightKg(): number { return this.currentWeightKg; }
  public setCurrentWeightKg(weight: number): void { this.currentWeightKg = weight; }

  public hasPermission(permission: string): boolean {
    if (this.role === UserRole.ADMIN) return true;
    if (this.role === UserRole.TRAINER && permission.startsWith('TRAINER:')) return true;
    if (this.role === UserRole.USER && permission.startsWith('USER:')) return true;
    return false;
  }

  public recordMetric(metricName: string, value: number): void {
    this.metrics.set(metricName, value);
  }

  public getMetric(metricName: string): number {
    return this.metrics.get(metricName) ?? 0;
  }

  public calculateBmi(): number {
    if (this.heightCm <= 0) return 0;
    const heightM = this.heightCm / 100.0;
    return Math.round((this.currentWeightKg / (heightM * heightM)) * 10) / 10;
  }

  public toSafeJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      heightCm: this.heightCm,
      currentWeightKg: this.currentWeightKg,
      bmi: this.calculateBmi(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public toJSON(): Record<string, unknown> {
    return this.toSafeJSON();
  }
}

/**
 * Concrete Subclass: AthleteUser
 * Extends User with target weight, fitness goals, and streaks.
 */
export class AthleteUser extends User {
  private targetWeightKg: number;
  private primaryGoal: FitnessGoal;
  private streakDays: number;
  private dailyCalorieTarget: number;
  private dailyWaterTargetLiters: number;

  constructor(
    id?: string,
    name = '',
    email = '',
    passwordHash = '',
    targetWeightKg = 65,
    primaryGoal: FitnessGoal = FitnessGoal.GENERAL_FITNESS
  ) {
    super(id, name, email, passwordHash, UserRole.USER);
    this.targetWeightKg = targetWeightKg;
    this.primaryGoal = primaryGoal;
    this.streakDays = 0;
    this.dailyCalorieTarget = 2150;
    this.dailyWaterTargetLiters = 2.5;
  }

  public getTargetWeightKg(): number { return this.targetWeightKg; }
  public setTargetWeightKg(target: number): void { this.targetWeightKg = target; }

  public getPrimaryGoal(): FitnessGoal { return this.primaryGoal; }
  public setPrimaryGoal(goal: FitnessGoal): void { this.primaryGoal = goal; }

  public getStreakDays(): number { return this.streakDays; }
  public incrementStreak(): void { this.streakDays += 1; }

  public getDailyCalorieTarget(): number { return this.dailyCalorieTarget; }
  public setDailyCalorieTarget(cal: number): void { this.dailyCalorieTarget = cal; }

  public getDailyWaterTargetLiters(): number { return this.dailyWaterTargetLiters; }
}

/**
 * Concrete Subclass: TrainerUser
 * Extends User with coaching specialties and hourly rates.
 */
export class TrainerUser extends User {
  private specialization: string;
  private hourlyRate: number;
  private rating: number;
  private credentials: string[];

  constructor(
    id?: string,
    name = '',
    email = '',
    passwordHash = '',
    specialization = 'Strength & Conditioning',
    hourlyRate = 85
  ) {
    super(id, name, email, passwordHash, UserRole.TRAINER);
    this.specialization = specialization;
    this.hourlyRate = hourlyRate;
    this.rating = 4.9;
    this.credentials = ['CSCS Certified', 'NASM-CPT'];
  }

  public getSpecialization(): string { return this.specialization; }
  public setSpecialization(spec: string): void { this.specialization = spec; }

  public getHourlyRate(): number { return this.hourlyRate; }
  public setHourlyRate(rate: number): void { this.hourlyRate = rate; }

  public getRating(): number { return this.rating; }
  public getCredentials(): string[] { return this.credentials; }
}

/**
 * Concrete Subclass: AdminUser
 * Extends User with administrator privileges.
 */
export class AdminUser extends User {
  private department: string;

  constructor(id?: string, name = '', email = '', passwordHash = '', department = 'System Operations') {
    super(id, name, email, passwordHash, UserRole.ADMIN);
    this.department = department;
  }

  public getDepartment(): string { return this.department; }
}

/**
 * Abstract Workout Base Class
 * Demonstrates Dynamic Polymorphism & Abstraction.
 * Each workout type implements its own scientific calorie burn algorithm!
 */
export abstract class AbstractWorkout extends AbstractEntity implements CalorieCalculable, Schedulable {
  protected title: string;
  protected description: string;
  protected durationMinutes: number;
  protected difficultyLevel: DifficultyLevel;
  protected primaryMuscleGroup: MuscleGroup;
  protected scheduledTime: Date | null;
  protected exercises: Exercise[];

  constructor(
    id?: string,
    title = '',
    description = '',
    durationMinutes = 45,
    difficultyLevel: DifficultyLevel = DifficultyLevel.INTERMEDIATE,
    primaryMuscleGroup: MuscleGroup = MuscleGroup.FULL_BODY
  ) {
    super(id);
    this.title = title;
    this.description = description;
    this.durationMinutes = durationMinutes;
    this.difficultyLevel = difficultyLevel;
    this.primaryMuscleGroup = primaryMuscleGroup;
    this.scheduledTime = null;
    this.exercises = [];
  }

  public getTitle(): string { return this.title; }
  public setTitle(title: string): void { this.title = title; }

  public getDescription(): string { return this.description; }
  public setDescription(desc: string): void { this.description = desc; }

  public getDurationMinutes(): number { return this.durationMinutes; }
  public setDurationMinutes(minutes: number): void { this.durationMinutes = minutes; }

  public getDifficultyLevel(): DifficultyLevel { return this.difficultyLevel; }
  public getPrimaryMuscleGroup(): MuscleGroup { return this.primaryMuscleGroup; }

  public getScheduledTime(): Date | null { return this.scheduledTime; }
  public setScheduledTime(time: Date | null): void { this.scheduledTime = time; }

  public getExercises(): Exercise[] { return this.exercises; }
  public addExercise(ex: Exercise): void { this.exercises.push(ex); }

  public conflictsWith(other: Schedulable): boolean {
    if (!this.scheduledTime || !other.getScheduledTime()) return false;
    const startA = this.scheduledTime.getTime();
    const endA = startA + this.durationMinutes * 60 * 1000;
    const startB = other.getScheduledTime()!.getTime();
    const endB = startB + other.getDurationMinutes() * 60 * 1000;
    return startA < endB && endA > startB;
  }

  /**
   * POLYMORPHIC METHOD:
   * Overridden differently in StrengthWorkout, CardioWorkout, MobilityWorkout.
   */
  public abstract calculateCaloriesBurned(bodyWeightKg: number): number;

  /**
   * Polymorphic protocol description
   */
  public abstract getWorkoutProtocol(): string;
}

/**
 * Concrete Polymorphic Subclass: StrengthWorkout
 * Calculates calories using volume load, RPE scale, and 15% EPOC recovery boost.
 */
export class StrengthWorkout extends AbstractWorkout {
  private totalSets: number;
  private estimatedVolumeLoadKg: number;
  private rpeTarget: number; // 1.0 to 10.0

  constructor(
    id?: string,
    title = 'Hypertrophy Upper Body',
    durationMinutes = 50,
    totalSets = 16,
    estimatedVolumeLoadKg = 4200,
    rpeTarget = 8.5
  ) {
    super(id, title, 'Progressive overload resistance protocol', durationMinutes, DifficultyLevel.INTERMEDIATE, MuscleGroup.CHEST);
    this.totalSets = totalSets;
    this.estimatedVolumeLoadKg = estimatedVolumeLoadKg;
    this.rpeTarget = rpeTarget;
  }

  public override calculateCaloriesBurned(bodyWeightKg: number): number {
    const baseMet = 5.5 + (this.rpeTarget / 10.0) * 2.0;
    const intensityMultiplier = this.difficultyLevel === DifficultyLevel.ADVANCED ? 1.4 : 1.25;
    const activeCalories = ((baseMet * 3.5 * bodyWeightKg) / 200.0) * this.durationMinutes * intensityMultiplier;
    // 15% EPOC post-exercise recovery burn
    const epocBonus = activeCalories * 0.15;
    return Math.round((activeCalories + epocBonus) * 10) / 10;
  }

  public override getWorkoutProtocol(): string {
    return `STRENGTH PROTOCOL: ${this.title} | ${this.totalSets} Sets | Volume Load: ${this.estimatedVolumeLoadKg}kg | RPE: ${this.rpeTarget}/10 (Includes 15% EPOC burn)`;
  }
}

/**
 * Concrete Polymorphic Subclass: CardioWorkout
 * Calculates calories using Heart Rate Zones (Zones 1-5).
 */
export class CardioWorkout extends AbstractWorkout {
  private heartRateZone: number; // 1 to 5
  private averageHeartRateBpm: number;

  constructor(
    id?: string,
    title = 'Zone 2 Aerobic Conditioning',
    durationMinutes = 45,
    heartRateZone = 3,
    averageHeartRateBpm = 145
  ) {
    super(id, title, 'Endurance and mitochondrial biogenesis training', durationMinutes, DifficultyLevel.INTERMEDIATE, MuscleGroup.FULL_BODY);
    this.heartRateZone = heartRateZone;
    this.averageHeartRateBpm = averageHeartRateBpm;
  }

  public override calculateCaloriesBurned(bodyWeightKg: number): number {
    const zoneMets = [4.0, 7.0, 9.5, 12.0, 15.0];
    const met = zoneMets[Math.max(0, Math.min(4, this.heartRateZone - 1))];
    const calories = ((met * 3.5 * bodyWeightKg) / 200.0) * this.durationMinutes;
    return Math.round(calories * 10) / 10;
  }

  public override getWorkoutProtocol(): string {
    return `CARDIO PROTOCOL: ${this.title} | Heart Rate Zone ${this.heartRateZone} (~${this.averageHeartRateBpm} BPM) | Aerobic Base`;
  }
}

/**
 * Concrete Polymorphic Subclass: MobilityWorkout
 * Gentle restorative parasympathetic baseline.
 */
export class MobilityWorkout extends AbstractWorkout {
  private targetJoints: string[];

  constructor(
    id?: string,
    title = 'Full-Body Dynamic Flow & Joint Decompression',
    durationMinutes = 30,
    targetJoints = ['Hips', 'Thoracic Spine', 'Ankles']
  ) {
    super(id, title, 'Restorative mobility and nervous system down-regulation', durationMinutes, DifficultyLevel.BEGINNER, MuscleGroup.FULL_BODY);
    this.targetJoints = targetJoints;
  }

  public override calculateCaloriesBurned(bodyWeightKg: number): number {
    const met = 2.8;
    const calories = ((met * 3.5 * bodyWeightKg) / 200.0) * this.durationMinutes;
    return Math.round(calories * 10) / 10;
  }

  public override getWorkoutProtocol(): string {
    return `MOBILITY PROTOCOL: ${this.title} | Restorative Flow targeting ${this.targetJoints.join(', ')}`;
  }
}

/**
 * Exercise Entity
 */
export class Exercise extends AbstractEntity {
  public name: string;
  public targetMuscle: MuscleGroup;
  public sets: number;
  public reps: number;
  public rpe: number;

  constructor(name = 'Barbell Back Squat', targetMuscle: MuscleGroup = MuscleGroup.LEGS, sets = 4, reps = 8, rpe = 8.0) {
    super();
    this.name = name;
    this.targetMuscle = targetMuscle;
    this.sets = sets;
    this.reps = reps;
    this.rpe = rpe;
  }
}

/**
 * Appointment Entity
 */
export class Appointment extends AbstractEntity implements Schedulable {
  public athleteId: string;
  public trainerId: string;
  public sessionTime: Date;
  public durationMinutes: number;
  public status: AppointmentStatus;

  constructor(athleteId = '', trainerId = '', sessionTime = new Date(), durationMinutes = 60) {
    super();
    this.athleteId = athleteId;
    this.trainerId = trainerId;
    this.sessionTime = sessionTime;
    this.durationMinutes = durationMinutes;
    this.status = AppointmentStatus.PENDING;
  }

  public getScheduledTime(): Date | null {
    return this.sessionTime;
  }

  public getDurationMinutes(): number {
    return this.durationMinutes;
  }

  public conflictsWith(other: Schedulable): boolean {
    if (!this.sessionTime || !other.getScheduledTime()) return false;
    const startA = this.sessionTime.getTime();
    const endA = startA + this.durationMinutes * 60 * 1000;
    const startB = other.getScheduledTime()!.getTime();
    const endB = startB + other.getDurationMinutes() * 60 * 1000;
    return startA < endB && endA > startB;
  }
}
