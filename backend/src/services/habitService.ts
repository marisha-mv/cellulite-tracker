import { prisma } from '../server';
import { HabitCheckInData } from '../types';
import { startOfDay, subDays } from 'date-fns';

export class HabitService {
  static async getHabitCheckIn(userId: string, date: Date) {
    const startOfDate = startOfDay(date);

    const habitCheckIn = await prisma.habitCheckIn.findUnique({
      where: {
        userId_date: {
          userId,
          date: startOfDate,
        },
      },
    });

    return habitCheckIn;
  }

  static async createOrUpdateHabitCheckIn(userId: string, data: HabitCheckInData) {
    const startOfDate = startOfDay(data.date);

    const habitCheckIn = await prisma.habitCheckIn.upsert({
      where: {
        userId_date: {
          userId,
          date: startOfDate,
        },
      },
      update: {
        ...data,
        date: startOfDate,
      },
      create: {
        userId,
        ...data,
        date: startOfDate,
      },
    });

    return habitCheckIn;
  }

  static async getHabitCheckIns(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startOfDay(startDate),
        lte: startOfDay(endDate),
      };
    }

    const habitCheckIns = await prisma.habitCheckIn.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return habitCheckIns;
  }

  static async getHabitStats(userId: string) {
    // Get all habit check-ins for the user
    const allCheckIns = await prisma.habitCheckIn.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (allCheckIns.length === 0) {
      return {
        totalDays: 0,
        completedDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
      };
    }

    // Calculate total completion for each day
    const completedDays = allCheckIns.filter((checkIn) => {
      const completionCount = this.calculateDayCompletion(checkIn);
      return completionCount >= 12; // At least 12 out of 17 habits (70%)
    }).length;

    // Calculate current streak
    const currentStreak = this.calculateCurrentStreak(allCheckIns);

    // Calculate longest streak
    const longestStreak = this.calculateLongestStreak(allCheckIns);

    // Calculate completion rate
    const completionRate = (completedDays / allCheckIns.length) * 100;

    return {
      totalDays: allCheckIns.length,
      completedDays,
      currentStreak,
      longestStreak,
      completionRate: Math.round(completionRate),
    };
  }

  static calculateDayCompletion(checkIn: any): number {
    let count = 0;

    // Boolean habits
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
    ];

    booleanHabits.forEach((habit) => {
      if (checkIn[habit]) count++;
    });

    // Trackable habits (steps and water)
    if (checkIn.stepsCount && checkIn.stepsCount >= 10000) count++;
    if (checkIn.dailyHydration && checkIn.dailyHydration >= 2.5) count++;

    return count;
  }

  static calculateCurrentStreak(checkIns: any[]): number {
    if (checkIns.length === 0) return 0;

    let streak = 0;
    const today = startOfDay(new Date());

    // Sort by date descending
    const sortedCheckIns = [...checkIns].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Check if there's a check-in for today or yesterday
    const latestDate = new Date(sortedCheckIns[0].date);
    const daysSinceLatest = Math.floor(
      (today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If more than 1 day since last check-in, streak is broken
    if (daysSinceLatest > 1) return 0;

    // Calculate streak
    for (let i = 0; i < sortedCheckIns.length; i++) {
      const checkIn = sortedCheckIns[i];
      const completionCount = this.calculateDayCompletion(checkIn);

      if (completionCount >= 12) {
        // At least 70% completion
        streak++;

        // Check if next day is consecutive
        if (i < sortedCheckIns.length - 1) {
          const currentDate = new Date(checkIn.date);
          const nextDate = new Date(sortedCheckIns[i + 1].date);
          const daysDiff = Math.floor(
            (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff > 1) break; // Streak broken
        }
      } else {
        break; // Day not completed enough
      }
    }

    return streak;
  }

  static calculateLongestStreak(checkIns: any[]): number {
    if (checkIns.length === 0) return 0;

    let longestStreak = 0;
    let currentStreak = 0;

    // Sort by date ascending
    const sortedCheckIns = [...checkIns].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 0; i < sortedCheckIns.length; i++) {
      const checkIn = sortedCheckIns[i];
      const completionCount = this.calculateDayCompletion(checkIn);

      if (completionCount >= 12) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);

        // Check if next day is consecutive
        if (i < sortedCheckIns.length - 1) {
          const currentDate = new Date(checkIn.date);
          const nextDate = new Date(sortedCheckIns[i + 1].date);
          const daysDiff = Math.floor(
            (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff > 1) currentStreak = 0; // Reset streak
        }
      } else {
        currentStreak = 0;
      }
    }

    return longestStreak;
  }
}
