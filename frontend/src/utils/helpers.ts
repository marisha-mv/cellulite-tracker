import { HabitCheckIn } from '../types';
import { WATER_GOAL, STEPS_GOAL } from './constants';

export const calculateCompletionPercentage = (checkIn: HabitCheckIn | null): number => {
  if (!checkIn) return 0;

  let completedCount = 0;
  const totalHabits = 17;

  // Boolean habits (15 total)
  const booleanHabits = [
    'legsUpWall',
    'dryBrushing',
    'contrastShower',
    'morningHydration',
    'hourlyMovement',
    'gluteExercises',
    'toePickups',
    'oilMassage',
    'magnesiumApp',
    'legsElevated',
    'collagenIntake',
    'proteinMeals',
    'lowSugar',
    'avoidSeedOils',
  ] as const;

  booleanHabits.forEach((habit) => {
    if (checkIn[habit]) completedCount++;
  });

  // Trackable habits (2 total)
  if (checkIn.stepsCount && checkIn.stepsCount >= STEPS_GOAL) completedCount++;
  if (checkIn.dailyHydration && checkIn.dailyHydration >= WATER_GOAL) completedCount++;

  return Math.round((completedCount / totalHabits) * 100);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-success';
  if (percentage >= 50) return 'text-primary';
  return 'text-neutral-400';
};

export const getProgressBarColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-success';
  if (percentage >= 50) return 'bg-primary';
  return 'bg-neutral-300';
};
