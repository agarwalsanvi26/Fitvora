export type UserRole = 'USER' | 'ADMIN' | 'TRAINER';

export type FitnessGoal =
  | 'Weight Loss'
  | 'Muscle Gain'
  | 'Strength'
  | 'Endurance'
  | 'Flexibility'
  | 'General Fitness';

export type ActivityLevel =
  | 'Sedentary'
  | 'Lightly Active'
  | 'Moderately Active'
  | 'Very Active';

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Abs'
  | 'Cardio'
  | 'Full Body'
  | 'Mobility';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type FitnessLevel = Difficulty;

export type MealType = 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // in cm
  weight: number; // in kg
  goal: FitnessGoal;
  fitnessLevel?: FitnessLevel;
  activityLevel: ActivityLevel;
  avatarUrl?: string;
  targetWeight?: number;
  dailyCalorieTarget?: number;
  dailyWaterTarget?: number; // in liters, e.g. 2.5
  streakDays?: number;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  difficulty: Difficulty;
  sets: number;
  reps: number | string;
  restTime: number; // in seconds
  instructions: string;
  safetyTips: string;
  imageUrl: string;
  equipment?: string;
}

export interface Workout {
  id: string;
  name: string;
  category: MuscleGroup;
  difficulty: Difficulty;
  description: string;
  durationMinutes: number;
  exerciseIds: string[];
  imageUrl?: string;
}

export interface ScheduledWorkoutItem {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  title: string;
  category: MuscleGroup | 'Recovery' | 'Rest';
  durationMinutes: number;
  completed: boolean;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: string;
  }[];
}

export interface MealItem {
  id: string;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  servingSize?: string;
}

export interface ProgressRecord {
  id: string;
  date: string;
  weight: number;
  waist: number;
  waistCm?: number;
  chest: number;
  hip: number;
  hipsCm?: number;
  bodyFat: number;
  bodyFatPercentage?: number;
  steps: number;
  workoutMinutes: number;
  caloriesBurned?: number;
  notes?: string;
}

export interface WaterLog {
  id: string;
  date: string;
  amountLiters: number;
}

export interface Goal {
  id: string;
  title: string;
  category: 'Weight' | 'Workout' | 'Water' | 'Steps';
  targetValue: number;
  currentValue: number;
  unit: string;
}

export interface ChallengeTask {
  day: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  title?: string;
  description: string;
  durationDays: number;
  totalDays?: number;
  currentDay?: number;
  goal: string;
  badgeName: string;
  badgeIcon: string; // emoji or icon ref
  joined?: boolean;
  daysCompleted?: number;
  dailyTasks?: ChallengeTask[];
}

export interface Program {
  id: string;
  title: string;
  category: string;
  level: Difficulty;
  durationWeeks: number;
  description: string;
  imageUrl: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  specialties?: string[];
  credentials?: string;
  experienceYears: number;
  certification: string;
  bio: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  reviewsCount?: number;
  hourlyRate: number;
  availability: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  trainerId: string;
  trainerName: string;
  date: string;
  time: string;
  sessionType: '1-on-1 Fitness' | 'Nutrition Consultation' | 'Form Assessment' | 'Mobility & Recovery';
  message: string;
  status: AppointmentStatus;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  content: string;
  summary: string;
  imageUrl: string;
  author: string;
  readTime: string;
  readTimeMinutes?: number;
  publishedDate?: string;
  createdAt: string;
}

export type BlogArticle = BlogPost;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'workout' | 'hydration' | 'challenge' | 'appointment' | 'system';
}

export interface ContactFeedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Reviewed' | 'Resolved';
}
