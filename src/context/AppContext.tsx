import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Exercise,
  Workout,
  ScheduledWorkoutItem,
  MealItem,
  ProgressRecord,
  Goal,
  Challenge,
  Program,
  Trainer,
  Appointment,
  BlogPost,
  NotificationItem,
  ContactFeedback,
  AppointmentStatus,
  FitnessGoal,
  FitnessLevel
} from '../types';
import {
  INITIAL_EXERCISES,
  INITIAL_WORKOUTS,
  INITIAL_SCHEDULED_PLAN,
  INITIAL_MEALS,
  INITIAL_PROGRESS_HISTORY,
  INITIAL_GOALS,
  INITIAL_CHALLENGES,
  INITIAL_TRAINERS,
  INITIAL_PROGRAMS,
  INITIAL_APPOINTMENTS,
  INITIAL_BLOG_POSTS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

interface AuthResult {
  ok: boolean;
  user?: User;
  error?: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  weightKg?: number;
  heightCm?: number;
  goal?: FitnessGoal;
  fitnessLevel?: FitnessLevel;
}

interface AppContextType {
  currentUser: User | null;
  authToken: string | null;
  usersList: User[];
  exercises: Exercise[];
  workouts: Workout[];
  programs: Program[];
  scheduledPlan: ScheduledWorkoutItem[];
  meals: MealItem[];
  progressHistory: ProgressRecord[];
  waterIntakeToday: number;
  goals: Goal[];
  challenges: Challenge[];
  trainers: Trainer[];
  appointments: Appointment[];
  blogPosts: BlogPost[];
  notifications: NotificationItem[];
  feedbacks: ContactFeedback[];

  // Real Backend Auth
  loginWithCredentials: (email: string, password: string) => Promise<AuthResult>;
  registerAccount: (payload: RegisterPayload) => Promise<AuthResult>;
  claimAdminAccount: (payload: { name: string; email: string; password: string }) => Promise<AuthResult>;
  logoutUser: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  // Workouts & Exercises
  toggleWorkoutComplete: (id: string) => void;
  addExerciseToDay: (day: string, exercise: Exercise) => void;
  removeExerciseFromDay: (day: string, exerciseIndex: number) => void;
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (id: string, exercise: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;

  // Diet & Nutrition
  addMeal: (meal: Omit<MealItem, 'id'>) => void;
  updateMeal: (id: string, meal: Partial<MealItem>) => void;
  deleteMeal: (id: string) => void;

  // Progress & Hydration
  addProgressRecord: (record: Omit<ProgressRecord, 'id' | 'date'>) => void;
  addWater: (amount: number) => void;
  resetWater: () => void;
  resetWaterToday: () => void;

  // Goals & Challenges
  updateGoal: (id: string, currentValue: number) => void;
  joinChallenge: (id: string) => void;
  incrementChallengeDay: (id: string) => void;
  toggleChallengeDay: (challengeId: string, day: number) => void;

  // Trainers & Appointments
  bookAppointment: (booking: Omit<Appointment, 'id' | 'userId' | 'userName' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addTrainer: (trainer: Omit<Trainer, 'id'>) => void;
  updateTrainer: (id: string, trainer: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;

  // Blog & Communications
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  deleteBlogPost: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  submitContactFeedback: (feedback: Omit<ContactFeedback, 'id' | 'createdAt' | 'status'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapBackendUserToFrontend(raw: any): User {
  const role: UserRole =
    raw?.role === 'ADMIN' || raw?.role === 'TRAINER' ? raw.role : 'USER';
  return {
    id: String(raw?.id || `usr_${Date.now()}`),
    name: String(raw?.name || 'Member'),
    email: String(raw?.email || ''),
    role,
    age: Number(raw?.age || 28),
    gender: raw?.gender === 'Male' || raw?.gender === 'Other' ? raw.gender : 'Female',
    height: Number(raw?.heightCm ?? raw?.height ?? 172),
    weight: Number(raw?.weightKg ?? raw?.weight ?? 65.5),
    targetWeight: Number(raw?.targetWeightKg ?? raw?.targetWeight ?? 60),
    goal: (raw?.goal as FitnessGoal) || 'General Fitness',
    fitnessLevel: (raw?.fitnessLevel as FitnessLevel) || 'Intermediate',
    activityLevel: raw?.activityLevel || 'Moderately Active',
    dailyCalorieTarget: Number(raw?.dailyCalorieTarget ?? 2150),
    dailyWaterTarget: Number(raw?.dailyWaterTargetLiters ?? raw?.dailyWaterTarget ?? 2.5),
    streakDays: Number(raw?.streakDays ?? 0),
    createdAt: String(raw?.createdAt || new Date().toISOString().split('T')[0])
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication session strictly kept in React memory (never persisted to localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);

  // Clear any legacy localStorage auth keys on mount
  useEffect(() => {
    try {
      localStorage.removeItem('fitvora_current_user');
      localStorage.removeItem('fitvora_users');
    } catch {
      // ignore storage access issues
    }
  }, []);

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('fitvora_exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('fitvora_workouts');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });

  const [scheduledPlan, setScheduledPlan] = useState<ScheduledWorkoutItem[]>(() => {
    const saved = localStorage.getItem('fitvora_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_PLAN;
  });

  const [meals, setMeals] = useState<MealItem[]>(() => {
    const saved = localStorage.getItem('fitvora_meals');
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [progressHistory, setProgressHistory] = useState<ProgressRecord[]>(() => {
    const saved = localStorage.getItem('fitvora_progress');
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS_HISTORY;
  });

  const [waterIntakeToday, setWaterIntakeToday] = useState<number>(() => {
    const saved = localStorage.getItem('fitvora_water_today');
    return saved ? parseFloat(saved) : 1.8;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('fitvora_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('fitvora_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [programs] = useState<Program[]>(() => INITIAL_PROGRAMS);

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const saved = localStorage.getItem('fitvora_trainers');
    return saved ? JSON.parse(saved) : INITIAL_TRAINERS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('fitvora_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('fitvora_blog');
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('fitvora_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [feedbacks, setFeedbacks] = useState<ContactFeedback[]>(() => {
    const saved = localStorage.getItem('fitvora_feedbacks');
    return saved ? JSON.parse(saved) : [
      {
        id: 'fb_1',
        name: 'Samantha Grey',
        email: 'sam@example.com',
        subject: 'Corporate Wellness Partnership',
        message: 'Interested in onboarding our team into the FITVORA platform.',
        createdAt: '2026-09-18',
        status: 'Unread'
      }
    ];
  });

  // Sync non-auth workspace preferences to localStorage
  useEffect(() => {
    localStorage.setItem('fitvora_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('fitvora_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fitvora_schedule', JSON.stringify(scheduledPlan));
  }, [scheduledPlan]);

  useEffect(() => {
    localStorage.setItem('fitvora_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('fitvora_progress', JSON.stringify(progressHistory));
  }, [progressHistory]);

  useEffect(() => {
    localStorage.setItem('fitvora_water_today', waterIntakeToday.toString());
  }, [waterIntakeToday]);

  useEffect(() => {
    localStorage.setItem('fitvora_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fitvora_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('fitvora_trainers', JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem('fitvora_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('fitvora_blog', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('fitvora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('fitvora_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Real backend authentication calls
  const loginWithCredentials = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.token) {
        return { ok: false, error: json.message || 'Invalid email or password.' };
      }
      const user = mapBackendUserToFrontend(json.data.user);
      setAuthToken(json.data.token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch {
      return { ok: false, error: 'Unable to reach authentication server.' };
    }
  };

  const registerAccount = async (payload: RegisterPayload): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          weightKg: payload.weightKg,
          heightCm: payload.heightCm
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.token) {
        return { ok: false, error: json.message || 'Could not create account.' };
      }
      const user = mapBackendUserToFrontend({
        ...json.data.user,
        goal: payload.goal || 'General Fitness',
        fitnessLevel: payload.fitnessLevel || 'Intermediate'
      });
      setAuthToken(json.data.token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch {
      return { ok: false, error: 'Unable to reach registration server.' };
    }
  };

  const claimAdminAccount = async (payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/claim-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.token) {
        return { ok: false, error: json.message || 'Unable to initialize administrator account.' };
      }
      const user = mapBackendUserToFrontend(json.data.user);
      setAuthToken(json.data.token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch {
      return { ok: false, error: 'Unable to reach authentication server.' };
    }
  };

  const logoutUser = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setAuthToken(null);
    setCurrentUser(null);
    setUsersList([]);
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsersList(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  const deleteUser = (id: string) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      logoutUser();
    }
  };

  const toggleUserStatus = (_id: string) => {
    // Handled server-side for authorized admins
  };

  // Workout Schedule
  const toggleWorkoutComplete = (id: string) => {
    setScheduledPlan(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addExerciseToDay = (day: string, exercise: Exercise) => {
    setScheduledPlan(prev =>
      prev.map(item => {
        if (item.dayOfWeek.toLowerCase() === day.toLowerCase()) {
          return {
            ...item,
            exercises: [
              ...item.exercises,
              {
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                sets: exercise.sets,
                reps: `${exercise.reps} reps`
              }
            ]
          };
        }
        return item;
      })
    );
  };

  const removeExerciseFromDay = (day: string, exerciseIndex: number) => {
    setScheduledPlan(prev =>
      prev.map(item => {
        if (item.dayOfWeek.toLowerCase() === day.toLowerCase()) {
          const updated = [...item.exercises];
          updated.splice(exerciseIndex, 1);
          return { ...item, exercises: updated };
        }
        return item;
      })
    );
  };

  // Exercise CRUD
  const addExercise = (ex: Omit<Exercise, 'id'>) => {
    const newEx: Exercise = { ...ex, id: `ex_${Date.now()}` };
    setExercises(prev => [newEx, ...prev]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  // Workout CRUD
  const addWorkout = (wo: Omit<Workout, 'id'>) => {
    const newWo: Workout = { ...wo, id: `wo_${Date.now()}` };
    setWorkouts(prev => [newWo, ...prev]);
  };

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    setWorkouts(prev => prev.map(w => (w.id === id ? { ...w, ...updates } : w)));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  // Meals CRUD
  const addMeal = (m: Omit<MealItem, 'id'>) => {
    const newMeal: MealItem = { ...m, id: `meal_${Date.now()}` };
    setMeals(prev => [newMeal, ...prev]);
  };

  const updateMeal = (id: string, updates: Partial<MealItem>) => {
    setMeals(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  // Progress & Hydration
  const addProgressRecord = (record: Omit<ProgressRecord, 'id' | 'date'>) => {
    const newRec: ProgressRecord = {
      ...record,
      id: `prog_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setProgressHistory(prev => [...prev, newRec]);
    if (record.weight && currentUser) {
      updateCurrentUser({ weight: record.weight });
    }
  };

  const addWater = (amount: number) => {
    setWaterIntakeToday(prev => Math.min(6, Math.max(0, +(prev + amount).toFixed(2))));
  };

  const resetWaterToday = () => {
    setWaterIntakeToday(0);
  };

  // Goals & Challenges
  const updateGoal = (id: string, currentValue: number) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, currentValue } : g)));
  };

  const joinChallenge = (id: string) => {
    setChallenges(prev =>
      prev.map(c => (c.id === id ? { ...c, joined: true, daysCompleted: c.daysCompleted || 1 } : c))
    );
  };

  const incrementChallengeDay = (id: string) => {
    setChallenges(prev =>
      prev.map(c => {
        if (c.id === id && c.joined) {
          const next = Math.min(c.durationDays, (c.daysCompleted || 0) + 1);
          return { ...c, daysCompleted: next };
        }
        return c;
      })
    );
  };

  const toggleChallengeDay = (challengeId: string, dayNum: number) => {
    setChallenges(prev =>
      prev.map(c => {
        if (c.id === challengeId && c.dailyTasks) {
          const updatedTasks = c.dailyTasks.map(t =>
            t.day === dayNum ? { ...t, completed: !t.completed } : t
          );
          const completedCount = updatedTasks.filter(t => t.completed).length;
          return {
            ...c,
            dailyTasks: updatedTasks,
            daysCompleted: completedCount
          };
        }
        return c;
      })
    );
  };

  // Appointments & Trainers
  const bookAppointment = (booking: Omit<Appointment, 'id' | 'userId' | 'userName' | 'status'>) => {
    const newApt: Appointment = {
      ...booking,
      id: `apt_${Date.now()}`,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Member',
      status: 'Pending'
    };
    setAppointments(prev => [newApt, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Session Request Received',
      message: `Your session with ${booking.trainerName} on ${booking.date} at ${booking.time} is awaiting confirmation.`,
      read: false,
      createdAt: 'Just now',
      type: 'appointment'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
  };

  const addTrainer = (trn: Omit<Trainer, 'id'>) => {
    const newTrn: Trainer = { ...trn, id: `trn_${Date.now()}` };
    setTrainers(prev => [newTrn, ...prev]);
  };

  const updateTrainer = (id: string, updates: Partial<Trainer>) => {
    setTrainers(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTrainer = (id: string) => {
    setTrainers(prev => prev.filter(t => t.id !== id));
  };

  // Blog & Communication
  const addBlogPost = (post: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `blog_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(b => b.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const submitContactFeedback = (fb: Omit<ContactFeedback, 'id' | 'createdAt' | 'status'>) => {
    const newFb: ContactFeedback = {
      ...fb,
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Unread'
    };
    setFeedbacks(prev => [newFb, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authToken,
        usersList,
        exercises,
        workouts,
        programs,
        scheduledPlan,
        meals,
        progressHistory,
        waterIntakeToday,
        goals,
        challenges,
        trainers,
        appointments,
        blogPosts,
        notifications,
        feedbacks,
        loginWithCredentials,
        registerAccount,
        claimAdminAccount,
        logoutUser,
        updateCurrentUser,
        deleteUser,
        toggleUserStatus,
        toggleWorkoutComplete,
        addExerciseToDay,
        removeExerciseFromDay,
        addExercise,
        updateExercise,
        deleteExercise,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addMeal,
        updateMeal,
        deleteMeal,
        addProgressRecord,
        addWater,
        resetWater: resetWaterToday,
        resetWaterToday,
        updateGoal,
        joinChallenge,
        incrementChallengeDay,
        toggleChallengeDay,
        bookAppointment,
        updateAppointmentStatus,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        addBlogPost,
        deleteBlogPost,
        markNotificationRead,
        clearAllNotifications,
        submitContactFeedback
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
