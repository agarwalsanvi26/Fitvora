import {
  User,
  Exercise,
  Workout,
  ScheduledWorkoutItem,
  MealItem,
  ProgressRecord,
  Goal,
  Challenge,
  Trainer,
  Appointment,
  BlogPost,
  NotificationItem
} from '../types';
import { STUDIO_MEDIA } from '../assets/media';

export const INITIAL_USER: User = {
  id: 'usr_001',
  name: 'Elena Vance',
  email: 'elena.vance@example.com',
  role: 'USER',
  age: 28,
  gender: 'Female',
  height: 172,
  weight: 65.5,
  targetWeight: 60.0,
  goal: 'Weight Loss',
  activityLevel: 'Moderately Active',
  dailyCalorieTarget: 2150,
  dailyWaterTarget: 2.5,
  streakDays: 12,
  createdAt: '2026-01-15'
};

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex_1',
    name: 'Push Ups',
    targetMuscle: 'Chest',
    difficulty: 'Beginner',
    sets: 3,
    reps: 12,
    restTime: 60,
    instructions: 'Place hands shoulder-width apart, lower chest until elbows are at 90 degrees, press through palms maintaining a rigid core.',
    safetyTips: 'Do not let your lower back sag. Keep glutes and abdominal muscles braced.',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    equipment: 'Bodyweight'
  },
  {
    id: 'ex_2',
    name: 'Barbell Back Squat',
    targetMuscle: 'Legs',
    difficulty: 'Intermediate',
    sets: 4,
    reps: 8,
    restTime: 90,
    instructions: 'Rest bar on upper traps, descend hips back and down until thighs are parallel to ground, drive through mid-foot.',
    safetyTips: 'Keep knees tracking over toes. Maintain a neutral spine without excessive forward lean.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    equipment: 'Barbell, Squat Rack'
  },
  {
    id: 'ex_3',
    name: 'Dumbbell Romanian Deadlift',
    targetMuscle: 'Legs',
    difficulty: 'Intermediate',
    sets: 3,
    reps: 10,
    restTime: 75,
    instructions: 'Hinge at the hips with soft knees, glide dumbbells along shins until a deep hamstring stretch is felt, squeeze glutes to return.',
    safetyTips: 'Never round your lumbar spine. Move with controlled tempo rather than rushing.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    equipment: 'Dumbbells'
  },
  {
    id: 'ex_4',
    name: 'Overhead Dumbbell Shoulder Press',
    targetMuscle: 'Shoulders',
    difficulty: 'Intermediate',
    sets: 3,
    reps: 10,
    restTime: 60,
    instructions: 'Press dumbbells vertically upward until arms are fully extended overhead without arching the lower back.',
    safetyTips: 'Avoid flaring elbows 90 degrees straight out; maintain a slight 30-degree forward scapular angle.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    equipment: 'Dumbbells'
  },
  {
    id: 'ex_5',
    name: 'Pull-Ups / Assisted Pull-Ups',
    targetMuscle: 'Back',
    difficulty: 'Advanced',
    sets: 3,
    reps: 8,
    restTime: 90,
    instructions: 'Grip bar with overhand grip wider than shoulders. Pull chest up towards bar by driving elbows downward.',
    safetyTips: 'Avoid swinging or kipping unless doing conditioned gymnastics. Control the descent.',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
    equipment: 'Pull-up Bar'
  },
  {
    id: 'ex_6',
    name: 'Incline Dumbbell Curl',
    targetMuscle: 'Arms',
    difficulty: 'Beginner',
    sets: 3,
    reps: 12,
    restTime: 45,
    instructions: 'Sit on an incline bench angled at 45-60 degrees. Curl weights upward supinating wrists at peak contraction.',
    safetyTips: 'Keep elbows stationary and do not swing your torso for momentum.',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    equipment: 'Dumbbells, Incline Bench'
  },
  {
    id: 'ex_7',
    name: 'Hanging Leg Raises',
    targetMuscle: 'Abs',
    difficulty: 'Intermediate',
    sets: 3,
    reps: 12,
    restTime: 60,
    instructions: 'Hang from overhead bar. Flex hips and curl pelvis upwards until legs reach horizontal or higher.',
    safetyTips: 'Initiate movement with abdominal contraction, not swinging hip flexors.',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
    equipment: 'Pull-up Bar'
  },
  {
    id: 'ex_8',
    name: 'HIIT Kettlebell Swings',
    targetMuscle: 'Cardio',
    difficulty: 'Intermediate',
    sets: 4,
    reps: 15,
    restTime: 45,
    instructions: 'Explosive hip hinge driving kettlebell to chest height using glutes and hamstrings rather than arm pull.',
    safetyTips: 'Horns of kettlebell should stay above knee height during backswing. Snap hips forward.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    equipment: 'Kettlebell'
  },
  {
    id: 'ex_9',
    name: 'Thoracic Bridge & World’s Greatest Stretch',
    targetMuscle: 'Mobility',
    difficulty: 'Beginner',
    sets: 2,
    reps: '8 each side',
    restTime: 30,
    instructions: 'Step into a deep lunge, place hand beside front foot, rotate torso reaching opposite arm toward ceiling.',
    safetyTips: 'Breathe deeply and rotate through upper spine without straining lower back.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    equipment: 'Yoga Mat'
  },
  {
    id: 'ex_10',
    name: 'Barbell Bent-Over Row',
    targetMuscle: 'Back',
    difficulty: 'Intermediate',
    sets: 4,
    reps: 10,
    restTime: 75,
    instructions: 'Bend forward at hips 45 degrees, pull barbell toward lower ribcage squeezing shoulder blades tightly together.',
    safetyTips: 'Brace your abdominal wall firmly and keep neck aligned with your spine.',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80',
    equipment: 'Barbell, Plates'
  }
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'wo_1',
    name: 'Upper Body Hypertrophy & Posture',
    category: 'Chest',
    difficulty: 'Intermediate',
    durationMinutes: 45,
    description: 'Target chest, back, and shoulders with structured compound lifts for functional strength and posture.',
    exerciseIds: ['ex_1', 'ex_4', 'ex_5', 'ex_10'],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wo_2',
    name: 'Lower Body Power & Kinetic Chain',
    category: 'Legs',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    description: 'Build robust quadriceps, hamstrings, and gluteal endurance through bilateral and unilateral loading.',
    exerciseIds: ['ex_2', 'ex_3'],
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wo_3',
    name: 'Core Stability & Metabolic Conditioning',
    category: 'Cardio',
    difficulty: 'Beginner',
    durationMinutes: 35,
    description: 'Dynamic kettlebell swings and high-tension core stability drills for cardiovascular endurance.',
    exerciseIds: ['ex_7', 'ex_8'],
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wo_4',
    name: 'Full Body Longevity & Mobility Flow',
    category: 'Mobility',
    difficulty: 'Beginner',
    durationMinutes: 30,
    description: 'Gentle spinal decompression, joint articulation, and nervous system down-regulation for recovery.',
    exerciseIds: ['ex_9'],
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wo_5',
    name: 'Functional Strength & Arm Sculpt',
    category: 'Arms',
    difficulty: 'Advanced',
    durationMinutes: 42,
    description: 'High-density supersets designed to sculpt triceps, biceps, and shoulders with peak tension.',
    exerciseIds: ['ex_1', 'ex_4', 'ex_6'],
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_SCHEDULED_PLAN: ScheduledWorkoutItem[] = [
  {
    id: 'plan_mon',
    dayOfWeek: 'Monday',
    title: 'Chest + Triceps Focus',
    category: 'Chest',
    durationMinutes: 45,
    completed: true,
    exercises: [
      { exerciseId: 'ex_1', exerciseName: 'Push Ups', sets: 3, reps: '12 reps' },
      { exerciseId: 'ex_4', exerciseName: 'Overhead Press', sets: 3, reps: '10 reps' }
    ]
  },
  {
    id: 'plan_tue',
    dayOfWeek: 'Tuesday',
    title: 'Back + Biceps Pull',
    category: 'Back',
    durationMinutes: 45,
    completed: true,
    exercises: [
      { exerciseId: 'ex_5', exerciseName: 'Pull-Ups', sets: 3, reps: '8 reps' },
      { exerciseId: 'ex_10', exerciseName: 'Barbell Row', sets: 4, reps: '10 reps' },
      { exerciseId: 'ex_6', exerciseName: 'Incline Curl', sets: 3, reps: '12 reps' }
    ]
  },
  {
    id: 'plan_wed',
    dayOfWeek: 'Wednesday',
    title: 'Recovery & Fascial Mobility',
    category: 'Recovery',
    durationMinutes: 30,
    completed: false,
    exercises: [
      { exerciseId: 'ex_9', exerciseName: 'Thoracic Bridge Stretch', sets: 2, reps: '8 each side' }
    ]
  },
  {
    id: 'plan_thu',
    dayOfWeek: 'Thursday',
    title: 'Legs & Posterior Chain',
    category: 'Legs',
    durationMinutes: 50,
    completed: false,
    exercises: [
      { exerciseId: 'ex_2', exerciseName: 'Barbell Back Squat', sets: 4, reps: '8 reps' },
      { exerciseId: 'ex_3', exerciseName: 'Romanian Deadlift', sets: 3, reps: '10 reps' }
    ]
  },
  {
    id: 'plan_fri',
    dayOfWeek: 'Friday',
    title: 'Shoulders + Deep Core',
    category: 'Shoulders',
    durationMinutes: 40,
    completed: false,
    exercises: [
      { exerciseId: 'ex_4', exerciseName: 'Overhead Press', sets: 3, reps: '10 reps' },
      { exerciseId: 'ex_7', exerciseName: 'Hanging Leg Raises', sets: 3, reps: '12 reps' }
    ]
  },
  {
    id: 'plan_sat',
    dayOfWeek: 'Saturday',
    title: 'Cardio & Kettlebell Intervals',
    category: 'Cardio',
    durationMinutes: 35,
    completed: false,
    exercises: [
      { exerciseId: 'ex_8', exerciseName: 'HIIT Kettlebell Swings', sets: 4, reps: '15 reps' }
    ]
  },
  {
    id: 'plan_sun',
    dayOfWeek: 'Sunday',
    title: 'Rest & Mindful Renewal',
    category: 'Rest',
    durationMinutes: 0,
    completed: false,
    exercises: []
  }
];

export const INITIAL_MEALS: MealItem[] = [
  {
    id: 'meal_1',
    name: 'Organic Rolled Oats with Blueberries & Chia',
    mealType: 'Breakfast',
    calories: 420,
    protein: 16,
    carbs: 64,
    fat: 9,
    servingSize: '1 bowl (80g dry oats)'
  },
  {
    id: 'meal_2',
    name: 'Pasture-Raised Poached Eggs on Sourdough',
    mealType: 'Breakfast',
    calories: 380,
    protein: 24,
    carbs: 32,
    fat: 15,
    servingSize: '2 eggs + 1 slice artisan bread'
  },
  {
    id: 'meal_3',
    name: 'Grilled Herb Chicken with Quinoa & Steamed Asparagus',
    mealType: 'Lunch',
    calories: 550,
    protein: 48,
    carbs: 45,
    fat: 12,
    servingSize: '1 plate (200g chicken, 100g quinoa)'
  },
  {
    id: 'meal_4',
    name: 'Mediterranean Chickpea & Avocado Power Bowl',
    mealType: 'Lunch',
    calories: 490,
    protein: 18,
    carbs: 58,
    fat: 20,
    servingSize: '1 large bowl'
  },
  {
    id: 'meal_5',
    name: 'Cold-Pressed Whey Isolate & Almond Butter Smoothie',
    mealType: 'Snack',
    calories: 280,
    protein: 28,
    carbs: 14,
    fat: 11,
    servingSize: '400 ml'
  },
  {
    id: 'meal_6',
    name: 'Greek Yogurt with Raw Honey & Roasted Walnuts',
    mealType: 'Snack',
    calories: 220,
    protein: 19,
    carbs: 18,
    fat: 8,
    servingSize: '150g'
  },
  {
    id: 'meal_7',
    name: 'Wild Alaskan Sockeye Salmon with Sweet Potato',
    mealType: 'Dinner',
    calories: 590,
    protein: 42,
    carbs: 48,
    fat: 22,
    servingSize: '1 fillet (180g) + 1 roasted sweet potato'
  },
  {
    id: 'meal_8',
    name: 'Seared Grass-Fed Sirloin with Roasted Broccolini',
    mealType: 'Dinner',
    calories: 520,
    protein: 46,
    carbs: 12,
    fat: 28,
    servingSize: '180g beef cut'
  },
  {
    id: 'meal_9',
    name: 'Crispy Turmeric Tofu with Jasmine Rice & Sesame Bok Choy',
    mealType: 'Dinner',
    calories: 460,
    protein: 24,
    carbs: 54,
    fat: 16,
    servingSize: '1 bowl'
  },
  {
    id: 'meal_10',
    name: 'Matcha Protein Energy Bites',
    mealType: 'Snack',
    calories: 160,
    protein: 8,
    carbs: 18,
    fat: 6,
    servingSize: '2 small balls'
  }
];

export const INITIAL_PROGRESS_HISTORY: ProgressRecord[] = [
  {
    id: 'prog_1',
    date: '2026-06-25',
    weight: 71.5,
    waist: 79,
    chest: 94,
    hip: 102,
    bodyFat: 26.2,
    steps: 7200,
    workoutMinutes: 30,
    caloriesBurned: 320
  },
  {
    id: 'prog_2',
    date: '2026-07-20',
    weight: 69.8,
    waist: 77,
    chest: 93,
    hip: 100,
    bodyFat: 24.8,
    steps: 8400,
    workoutMinutes: 35,
    caloriesBurned: 380
  },
  {
    id: 'prog_3',
    date: '2026-08-15',
    weight: 68.2,
    waist: 75,
    chest: 92,
    hip: 98,
    bodyFat: 23.6,
    steps: 9100,
    workoutMinutes: 40,
    caloriesBurned: 420
  },
  {
    id: 'prog_4',
    date: '2026-09-01',
    weight: 66.8,
    waist: 74,
    chest: 91,
    hip: 97,
    bodyFat: 22.9,
    steps: 9800,
    workoutMinutes: 45,
    caloriesBurned: 460
  },
  {
    id: 'prog_5',
    date: '2026-09-15',
    weight: 65.9,
    waist: 73,
    chest: 90,
    hip: 96,
    bodyFat: 22.5,
    steps: 10400,
    workoutMinutes: 42,
    caloriesBurned: 450
  },
  {
    id: 'prog_6',
    date: '2026-09-21',
    weight: 65.5,
    waist: 72.5,
    chest: 90,
    hip: 95.5,
    bodyFat: 22.4,
    steps: 10850,
    workoutMinutes: 42,
    caloriesBurned: 475
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_1',
    title: 'Target Weight',
    category: 'Weight',
    targetValue: 60.0,
    currentValue: 65.5,
    unit: 'kg'
  },
  {
    id: 'goal_2',
    title: 'Weekly Workouts',
    category: 'Workout',
    targetValue: 5,
    currentValue: 4,
    unit: 'sessions'
  },
  {
    id: 'goal_3',
    title: 'Daily Water Intake',
    category: 'Water',
    targetValue: 2.5,
    currentValue: 1.8,
    unit: 'liters'
  },
  {
    id: 'goal_4',
    title: 'Daily Step Goal',
    category: 'Steps',
    targetValue: 10000,
    currentValue: 8450,
    unit: 'steps'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal_3',
    name: '30-Day Consistency Transformation',
    title: '30-Day Total Body Transformation',
    description: 'Establish deep fitness habits with scheduled training, meal tracking, and sleep focus.',
    durationDays: 30,
    totalDays: 30,
    currentDay: 13,
    goal: '24 scheduled workouts completed',
    badgeName: 'Challenge Completed',
    badgeIcon: '🏆',
    joined: true,
    daysCompleted: 12,
    dailyTasks: [
      { day: 1, title: '20 Strict Pushups + 30m brisk walk', description: 'Activate chest, anterior delts, and establish baseline daily NEAT movement.', points: 50, completed: true },
      { day: 2, title: '30 Air Squats + Thoracic Mobility', description: 'Decompress hip flexors and fire glutes with deep range squats.', points: 50, completed: true },
      { day: 3, title: '3.0L Water + 10m Posture Stretch', description: 'Hydrate cellular pathways and reset forward head posture.', points: 40, completed: true },
      { day: 4, title: '35m Zone 2 Cardio Walk/Jog', description: 'Build mitochondrial density without joint impact.', points: 60, completed: true },
      { day: 5, title: '3-min Cumulative Plank + Core Flow', description: 'High-tension isometric core strength and pelvic neutrality.', points: 50, completed: true },
      { day: 6, title: '3x12 Dumbbell Romanian Deadlifts', description: 'Posterior chain loading with strict hip hinge mechanics.', points: 70, completed: true },
      { day: 7, title: 'Active Recovery Walk + 8h Sleep Audit', description: 'Reset central nervous system and replenish muscle glycogen.', points: 40, completed: true },
      { day: 8, title: '25 Diamond Pushups + Arm Burnout', description: 'Upper body hypertrophy and tricep mechanical stress.', points: 55, completed: true },
      { day: 9, title: '40 Kettlebell Swings + Mobility', description: 'Explosive hip extension and rotational core stability.', points: 65, completed: true },
      { day: 10, title: 'Hit Protein Target (130g+) + Log Meals', description: 'Dietary compliance to support tissue remodeling.', points: 50, completed: true },
      { day: 11, title: '50 Walking Lunges (25 each leg)', description: 'Unilateral leg strength, balance, and knee stabilization.', points: 60, completed: true },
      { day: 12, title: '15m Diaphragmatic Breathwork & Flow', description: 'Vagus nerve stimulation for parasympathetic recovery.', points: 40, completed: true },
      { day: 13, title: 'Full Body Compound Circuit (Today)', description: '3 rounds: 15 Squats, 12 Pushups, 10 Pull-downs, 30s Plank.', points: 80, completed: false },
      { day: 14, title: '45m Outdoor Trail Ruck or Walk', description: 'Low-impact cardiovascular output in natural light.', points: 70, completed: false },
      { day: 15, title: 'Midway Biometric & Photo Check-in', description: 'Measure waist, chest, weight, and celebrate 15 days of discipline.', points: 100, completed: false }
    ]
  },
  {
    id: 'chal_1',
    name: '7-Day Workout Kickstart',
    description: 'Complete at least 25 minutes of intentional training every day for 7 days.',
    durationDays: 7,
    goal: '7 logged sessions',
    badgeName: '7 Day Streak',
    badgeIcon: '🔥',
    joined: true,
    daysCompleted: 5
  },
  {
    id: 'chal_2',
    name: '10K Steps Daily March',
    description: 'Reach 10,000 steps each day for 14 continuous days to boost active recovery.',
    durationDays: 14,
    goal: '14 days of 10,000 steps',
    badgeName: 'Step Legend',
    badgeIcon: '👟',
    joined: true,
    daysCompleted: 9
  },
  {
    id: 'chal_4',
    name: 'Pure Hydration Master',
    description: 'Hit your daily water target of 2.5L or more for 21 consecutive days.',
    durationDays: 21,
    goal: '21 days of optimal hydration',
    badgeName: 'Hydration Hero',
    badgeIcon: '💧',
    joined: true,
    daysCompleted: 12
  }
];

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'trn_1',
    name: 'Marcus Sterling, CSCS',
    specialization: 'Hypertrophy & Functional Strength',
    specialties: ['Hypertrophy', 'Olympic Lifting', 'Biomechanics'],
    credentials: 'NSCA-CSCS, MSc Sports Science',
    experienceYears: 10,
    certification: 'NSCA-CSCS, Precision Nutrition L2',
    bio: 'Former collegiate strength coach focused on biomechanical alignment, safe heavy compound lifting, and metabolic conditioning.',
    imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    reviewCount: 142,
    reviewsCount: 142,
    hourlyRate: 85,
    availability: ['Mon 09:00', 'Mon 14:00', 'Wed 10:00', 'Thu 15:00', 'Sat 11:00']
  },
  {
    id: 'trn_2',
    name: 'Sora Tanaka, MS',
    specialization: 'Mobility, Yoga & Fascial Recovery',
    specialties: ['Mobility Flow', 'Spine Health', 'Breathwork'],
    credentials: 'E-RYT 500, FRC Specialist',
    experienceYears: 8,
    certification: 'E-RYT 500, FRC Mobility Specialist',
    bio: 'Integrating breathwork, functional range conditioning, and mindful flow to restore posture and joint longevity.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    rating: 4.98,
    reviewCount: 188,
    reviewsCount: 188,
    hourlyRate: 75,
    availability: ['Tue 08:00', 'Tue 16:00', 'Wed 09:00', 'Fri 10:00', 'Sun 09:00']
  },
  {
    id: 'trn_3',
    name: 'Dr. Julian Morales, DPT',
    specialization: 'Injury Prevention & Biomechanics',
    specialties: ['Doctor of PT', 'Injury Rehab', 'Joint Resilience'],
    credentials: 'DPT, Board Certified Clinical Orthopedic',
    experienceYears: 12,
    certification: 'Doctor of Physical Therapy, OCS',
    bio: 'Clinical specialist helping athletes and everyday professionals train around old injuries and build resilient tendons.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    rating: 4.99,
    reviewCount: 210,
    reviewsCount: 210,
    hourlyRate: 95,
    availability: ['Mon 11:00', 'Tue 14:00', 'Thu 11:00', 'Fri 15:00']
  },
  {
    id: 'trn_4',
    name: 'Chloe Laurent, RD',
    specialization: 'Clinical Sports Nutrition & Hormonal Health',
    specialties: ['Metabolic Coaching', 'Clinical Dietetics', 'Macro Audits'],
    credentials: 'Registered Dietitian, ISSN-SNS',
    experienceYears: 7,
    certification: 'Registered Dietitian (RD), ISSN-SNS',
    bio: 'Crafting non-restrictive, nutrient-dense nutrition frameworks that optimize metabolic efficiency and energy balance.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    reviewCount: 96,
    reviewsCount: 96,
    hourlyRate: 70,
    availability: ['Mon 13:00', 'Wed 13:00', 'Thu 09:00', 'Fri 13:00']
  }
];

export const INITIAL_PROGRAMS = [
  {
    id: 'prog_1',
    title: 'Functional Strength & Longevity',
    category: 'Strength',
    level: 'Intermediate' as const,
    durationWeeks: 12,
    description: 'Four structured sessions per week centered on compound lifts, steady progression, and healthy joints.',
    imageUrl: STUDIO_MEDIA.programStrength
  },
  {
    id: 'prog_2',
    title: 'Mobility & Restorative Flow',
    category: 'Mobility',
    level: 'Beginner' as const,
    durationWeeks: 6,
    description: 'Short daily routines for thoracic rotation, hip opening, and calm breathwork after desk-heavy days.',
    imageUrl: STUDIO_MEDIA.programMobility
  },
  {
    id: 'prog_3',
    title: 'Everyday Conditioning & Nutrition',
    category: 'Conditioning',
    level: 'Advanced' as const,
    durationWeeks: 8,
    description: 'Zone 2 aerobic work paired with repeatable intervals and practical protein-first meal habits.',
    imageUrl: STUDIO_MEDIA.programNutrition
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1',
    userId: 'usr_001',
    userName: 'Elena Vance',
    trainerId: 'trn_1',
    trainerName: 'Marcus Sterling, CSCS',
    date: '2026-09-24',
    time: '14:00',
    sessionType: '1-on-1 Fitness',
    message: 'Need feedback on my squat depth and barbell hip hinge mechanics.',
    status: 'Confirmed'
  },
  {
    id: 'apt_2',
    userId: 'usr_001',
    userName: 'Elena Vance',
    trainerId: 'trn_4',
    trainerName: 'Chloe Laurent, RD',
    date: '2026-09-28',
    time: '13:00',
    sessionType: 'Nutrition Consultation',
    message: 'Reviewing macro ratios to sustain energy during afternoon training sessions.',
    status: 'Pending'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog_1',
    title: 'The Science of Progressive Overload: Beyond Just Adding Weight',
    category: 'Strength & Science',
    author: 'Marcus Sterling, CSCS',
    readTime: '6 min read',
    createdAt: '2026-09-12',
    summary: 'Discover how adjusting range of motion, tempo, and rest intervals can trigger new adaptations without joint strain.',
    content: `Progressive overload is the fundamental law of muscle adaptation. While most lifters intuitively add 2.5kg to the barbell every week, that approach inevitably leads to plateaus or connective tissue fatigue.

True progressive overload encompasses five distinct variables:
1. Increased mechanical tension (adding modest load with strict technique).
2. Volume progression (adding a quality set over a mesocycle).
3. Range of motion extension (hitting true deep squats rather than quarter reps).
4. Eccentric tempo control (lowering under 3 seconds to maximize time under tension).
5. Metabolic density (reducing rest periods while sustaining total work output).

At FITVORA, we encourage you to log every parameter so your body adapts harmoniously.`,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'blog_2',
    title: 'Nutrient Timing Demystified: What Really Matters for Recovery',
    category: 'Nutrition & Fuel',
    author: 'Chloe Laurent, RD',
    readTime: '5 min read',
    createdAt: '2026-09-08',
    summary: 'Does the 30-minute anabolic window truly exist? A registered dietitian breaks down the clinical research.',
    content: `For decades, the fitness community obsessively guzzled protein shakes within 20 minutes of finishing a workout, fearing catabolism.

Modern nutritional biochemistry offers a much more liberating truth:
Total daily protein intake and overall caloric balance dictate over 85% of body composition outcomes. While post-workout nutrition remains valuable for replenishing muscle glycogen and stimulating muscle protein synthesis, the realistic window spans 2 to 3 hours around training.

Focus on consuming 1.6 to 2.2 grams of protein per kilogram of bodyweight, distributed across 3 to 4 meals containing 30g+ of high-leucine protein sources.`,
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'blog_3',
    title: 'Heart Rate Variability (HRV) and Nervous System Restoration',
    category: 'Wellness & Longevity',
    author: 'Sora Tanaka, MS',
    readTime: '7 min read',
    createdAt: '2026-09-02',
    summary: 'How listening to your autonomic nervous system prevents overtraining and elevates longevity.',
    content: `More is not always better; better is better. Heart Rate Variability (HRV) is the variance between consecutive heartbeats, serving as a non-invasive window into the balance between your sympathetic (fight or flight) and parasympathetic (rest and digest) nervous systems.

A high baseline HRV signifies a resilient, well-recovered organism ready for intensive athletic output. When HRV drops significantly below baseline, it is a physiological cue to prioritize restorative mobility, hydration, and sleep over maximal lifting.

Use FITVORA's Recovery workouts on low-readiness days to keep moving forward without burning out.`,
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=80'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Hydration Target Reminder',
    message: 'You are at 1.8L of your 2.5L water goal. Drink 250ml now to stay on pace!',
    read: false,
    createdAt: '25m ago',
    type: 'hydration'
  },
  {
    id: 'notif_2',
    title: 'Workout Scheduled Today',
    message: 'Chest + Triceps Focus is waiting for you in your workout planner.',
    read: false,
    createdAt: '2h ago',
    type: 'workout'
  },
  {
    id: 'notif_3',
    title: 'Trainer Session Confirmed',
    message: 'Your 1-on-1 session with Marcus Sterling is confirmed for Sep 24 at 14:00.',
    read: true,
    createdAt: '1d ago',
    type: 'appointment'
  },
  {
    id: 'notif_4',
    title: 'Challenge Milestone Reached',
    message: 'You have completed Day 5 of the 7-Day Workout Kickstart! Keep the streak alive.',
    read: true,
    createdAt: '2d ago',
    type: 'challenge'
  }
];

export const SUCCESS_STORIES = [
  {
    id: 'story_1',
    name: 'Marcus Henderson',
    goal: 'Fat Loss & Stamina',
    result: 'Lost 8.5 kg in 12 weeks',
    quote: 'FITVORA changed my relationship with fitness. The intelligent workout planner and clear calorie tracking made consistency effortless rather than exhausting.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 5
  },
  {
    id: 'story_2',
    name: 'Claire Jenkins',
    goal: 'Functional Strength & Mobility',
    result: 'Gained 3.2 kg lean muscle',
    quote: 'The holistic blend of strength programs and mobility routines eliminated my lower back discomfort while increasing my deadlift numbers.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    rating: 5
  },
  {
    id: 'story_3',
    name: 'Julian Chen',
    goal: 'Cardiovascular Longevity',
    result: 'Reduced resting HR by 14 bpm',
    quote: 'The AI Coach provided quick answers on nutrient timing and recovery days that kept me injury-free throughout my first half-marathon prep.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    rating: 5
  }
];

export const BLOG_ARTICLES = INITIAL_BLOG_POSTS.map(post => ({
  ...post,
  readTimeMinutes: parseInt(post.readTime) || 5,
  publishedDate: post.createdAt
}));

export const PROGRAMS = INITIAL_PROGRAMS;

