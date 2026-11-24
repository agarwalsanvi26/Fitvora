/**
 * Java Enums with custom fields and business logic representations.
 * Compatible with Node.js native strip-types and standard TypeScript.
 */

export const UserRole = {
  USER: 'USER',
  TRAINER: 'TRAINER',
  ADMIN: 'ADMIN'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const FitnessGoal = {
  WEIGHT_LOSS: 'Weight Loss',
  MUSCLE_GAIN: 'Muscle Gain',
  STRENGTH: 'Strength',
  ENDURANCE: 'Endurance',
  FLEXIBILITY: 'Flexibility',
  GENERAL_FITNESS: 'General Fitness'
} as const;
export type FitnessGoal = (typeof FitnessGoal)[keyof typeof FitnessGoal];

export const DifficultyLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED'
} as const;
export type DifficultyLevel = (typeof DifficultyLevel)[keyof typeof DifficultyLevel];

export const MuscleGroup = {
  CHEST: 'CHEST',
  BACK: 'BACK',
  LEGS: 'LEGS',
  SHOULDERS: 'SHOULDERS',
  ARMS: 'ARMS',
  CORE: 'CORE',
  FULL_BODY: 'FULL_BODY'
} as const;
export type MuscleGroup = (typeof MuscleGroup)[keyof typeof MuscleGroup];

export const AppointmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;
export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];
