import { prisma } from '../server';
import { WorkoutSessionData } from '../types';
import { startOfDay } from 'date-fns';

export class WorkoutService {
  static async getWorkoutSession(userId: string, date: Date) {
    const startOfDate = startOfDay(date);

    const workoutSession = await prisma.workoutSession.findUnique({
      where: {
        userId_date: {
          userId,
          date: startOfDate,
        },
      },
      include: {
        exercises: true,
      },
    });

    return workoutSession;
  }

  static async getWorkoutSessions(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startOfDay(startDate),
        lte: startOfDay(endDate),
      };
    }

    const workoutSessions = await prisma.workoutSession.findMany({
      where,
      include: {
        exercises: true,
      },
      orderBy: { date: 'desc' },
    });

    return workoutSessions;
  }

  static async getWorkoutsByWeek(userId: string, weekNumber: number) {
    const workoutSessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        weekNumber,
      },
      include: {
        exercises: true,
      },
      orderBy: { date: 'asc' },
    });

    return workoutSessions;
  }

  static async createWorkoutSession(userId: string, data: WorkoutSessionData) {
    const startOfDate = startOfDay(data.date);

    // Create workout session with exercises
    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId,
        date: startOfDate,
        weekNumber: data.weekNumber,
        workoutNumber: data.workoutNumber,
        notes: data.notes,
        duration: data.duration,
        completed: data.completed || false,
        exercises: {
          create: data.exercises.map((exercise) => ({
            exerciseName: exercise.exerciseName,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            completed: exercise.completed || false,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return workoutSession;
  }

  static async updateWorkoutSession(
    workoutId: string,
    userId: string,
    data: Partial<WorkoutSessionData>
  ) {
    // Verify ownership
    const workout = await prisma.workoutSession.findUnique({
      where: { id: workoutId },
    });

    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found or unauthorized');
    }

    // Delete existing exercises
    await prisma.workoutExercise.deleteMany({
      where: { workoutId },
    });

    // Update workout with new exercises
    const updatedWorkout = await prisma.workoutSession.update({
      where: { id: workoutId },
      data: {
        weekNumber: data.weekNumber,
        workoutNumber: data.workoutNumber,
        notes: data.notes,
        duration: data.duration,
        completed: data.completed,
        exercises: data.exercises
          ? {
              create: data.exercises.map((exercise) => ({
                exerciseName: exercise.exerciseName,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight,
                completed: exercise.completed || false,
              })),
            }
          : undefined,
      },
      include: {
        exercises: true,
      },
    });

    return updatedWorkout;
  }

  static async deleteWorkoutSession(workoutId: string, userId: string) {
    // Verify ownership
    const workout = await prisma.workoutSession.findUnique({
      where: { id: workoutId },
    });

    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found or unauthorized');
    }

    // Delete workout (exercises will be deleted due to cascade)
    await prisma.workoutSession.delete({
      where: { id: workoutId },
    });
  }

  static async getWorkoutCompletion(userId: string) {
    // Get current week number (simple calculation)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const currentWeek = Math.ceil(diff / oneWeek);

    // Get workouts for current week
    const thisWeekWorkouts = await prisma.workoutSession.findMany({
      where: {
        userId,
        weekNumber: currentWeek,
      },
    });

    // Get total workouts
    const totalWorkouts = await prisma.workoutSession.count({
      where: { userId },
    });

    return {
      currentWeek,
      workoutsThisWeek: thisWeekWorkouts.length,
      targetPerWeek: 2,
      totalWorkouts,
    };
  }
}
