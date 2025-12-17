import { Response } from 'express';
import { HabitService } from '../services/habitService';
import { AuthRequest, HabitCheckInData } from '../types';

export class HabitController {
  static async getHabitCheckIn(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { date } = req.params;
      const checkInDate = date ? new Date(date) : new Date();

      const habitCheckIn = await HabitService.getHabitCheckIn(
        req.userId,
        checkInDate
      );

      if (!habitCheckIn) {
        return res.status(404).json({ error: 'Habit check-in not found' });
      }

      res.status(200).json({ habitCheckIn });
    } catch (error) {
      console.error('Get habit check-in error:', error);
      res.status(500).json({ error: 'Failed to get habit check-in' });
    }
  }

  static async getHabitCheckIns(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { startDate, endDate } = req.query;

      const habitCheckIns = await HabitService.getHabitCheckIns(
        req.userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.status(200).json({ habitCheckIns });
    } catch (error) {
      console.error('Get habit check-ins error:', error);
      res.status(500).json({ error: 'Failed to get habit check-ins' });
    }
  }

  static async createOrUpdateHabitCheckIn(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const data: HabitCheckInData = {
        date: req.body.date ? new Date(req.body.date) : new Date(),
        legsUpWall: req.body.legsUpWall,
        dryBrushing: req.body.dryBrushing,
        contrastShower: req.body.contrastShower,
        morningHydration: req.body.morningHydration,
        hourlyMovement: req.body.hourlyMovement,
        stepsCount: req.body.stepsCount,
        dailyHydration: req.body.dailyHydration,
        gluteExercises: req.body.gluteExercises,
        toePickups: req.body.toePickups,
        oilMassage: req.body.oilMassage,
        magnesiumApp: req.body.magnesiumApp,
        legsElevated: req.body.legsElevated,
        collagenIntake: req.body.collagenIntake,
        proteinMeals: req.body.proteinMeals,
        lowSugar: req.body.lowSugar,
        avoidSeedOils: req.body.avoidSeedOils,
        notes: req.body.notes,
      };

      const habitCheckIn = await HabitService.createOrUpdateHabitCheckIn(
        req.userId,
        data
      );

      res.status(200).json({
        message: 'Habit check-in saved successfully',
        habitCheckIn,
      });
    } catch (error) {
      console.error('Create/update habit check-in error:', error);
      res.status(500).json({ error: 'Failed to save habit check-in' });
    }
  }

  static async getHabitStats(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const stats = await HabitService.getHabitStats(req.userId);

      res.status(200).json({ stats });
    } catch (error) {
      console.error('Get habit stats error:', error);
      res.status(500).json({ error: 'Failed to get habit statistics' });
    }
  }
}
