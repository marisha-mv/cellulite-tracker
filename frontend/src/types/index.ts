export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface HabitCheckIn {
  id: string;
  userId: string;
  date: string;
  legsUpWall: boolean;
  dryBrushing: boolean;
  contrastShower: boolean;
  morningHydration: boolean;
  hourlyMovement: boolean;
  stepsCount?: number;
  dailyHydration?: number;
  gluteExercises: boolean;
  toePickups: boolean;
  oilMassage: boolean;
  magnesiumApp: boolean;
  legsElevated: boolean;
  collagenIntake: boolean;
  proteinMeals: boolean;
  lowSugar: boolean;
  avoidSeedOils: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCheckInInput {
  date: Date;
  legsUpWall?: boolean;
  dryBrushing?: boolean;
  contrastShower?: boolean;
  morningHydration?: boolean;
  hourlyMovement?: boolean;
  stepsCount?: number;
  dailyHydration?: number;
  gluteExercises?: boolean;
  toePickups?: boolean;
  oilMassage?: boolean;
  magnesiumApp?: boolean;
  legsElevated?: boolean;
  collagenIntake?: boolean;
  proteinMeals?: boolean;
  lowSugar?: boolean;
  avoidSeedOils?: boolean;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string;
  weekNumber: number;
  workoutNumber: number;
  exercises: WorkoutExercise[];
  notes?: string;
  duration?: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSessionInput {
  date: Date;
  weekNumber: number;
  workoutNumber: number;
  exercises: {
    exerciseName: string;
    sets: number;
    reps: number;
    weight?: number;
    completed?: boolean;
  }[];
  notes?: string;
  duration?: number;
  completed?: boolean;
}

export interface WeeklyProgress {
  id: string;
  userId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  frontPhoto: string;
  backPhoto: string;
  sidePhoto: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitStats {
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

export interface WorkoutStats {
  totalWorkouts: number;
  currentWeek: number;
  workoutsThisWeek: number;
  targetPerWeek: number;
}
