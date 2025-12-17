import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface HabitCheckInData {
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

export interface WorkoutExerciseData {
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  completed?: boolean;
}

export interface WorkoutSessionData {
  date: Date;
  weekNumber: number;
  workoutNumber: number;
  exercises: WorkoutExerciseData[];
  notes?: string;
  duration?: number;
  completed?: boolean;
}

export interface ProgressPhotoData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  notes?: string;
}
