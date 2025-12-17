import { Response } from 'express';
import { WorkoutService } from '../services/workoutService';
import { AuthRequest, WorkoutSessionData } from '../types';

export class WorkoutController {
  static async getWorkoutSession(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      const workout = await WorkoutService.getWorkoutSession(req.userId, new Date(id));

      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }

      res.status(200).json({ workout });
    } catch (error) {
      console.error('Get workout error:', error);
      res.status(500).json({ error: 'Failed to get workout' });
    }
  }

  static async getWorkoutSessions(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { startDate, endDate } = req.query;

      const workouts = await WorkoutService.getWorkoutSessions(
        req.userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.status(200).json({ workouts });
    } catch (error) {
      console.error('Get workouts error:', error);
      res.status(500).json({ error: 'Failed to get workouts' });
    }
  }

  static async getWorkoutsByWeek(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { weekNumber } = req.params;
      const workouts = await WorkoutService.getWorkoutsByWeek(
        req.userId,
        parseInt(weekNumber)
      );

      res.status(200).json({ workouts });
    } catch (error) {
      console.error('Get workouts by week error:', error);
      res.status(500).json({ error: 'Failed to get workouts' });
    }
  }

  static async createWorkoutSession(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const data: WorkoutSessionData = {
        date: req.body.date ? new Date(req.body.date) : new Date(),
        weekNumber: req.body.weekNumber,
        workoutNumber: req.body.workoutNumber,
        exercises: req.body.exercises,
        notes: req.body.notes,
        duration: req.body.duration,
        completed: req.body.completed,
      };

      // Validate required fields
      if (!data.weekNumber || !data.workoutNumber || !data.exercises) {
        return res.status(400).json({
          error: 'weekNumber, workoutNumber, and exercises are required',
        });
      }

      const workout = await WorkoutService.createWorkoutSession(req.userId, data);

      res.status(201).json({
        message: 'Workout created successfully',
        workout,
      });
    } catch (error) {
      console.error('Create workout error:', error);
      res.status(500).json({ error: 'Failed to create workout' });
    }
  }

  static async updateWorkoutSession(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      const data: Partial<WorkoutSessionData> = {
        weekNumber: req.body.weekNumber,
        workoutNumber: req.body.workoutNumber,
        exercises: req.body.exercises,
        notes: req.body.notes,
        duration: req.body.duration,
        completed: req.body.completed,
      };

      const workout = await WorkoutService.updateWorkoutSession(
        id,
        req.userId,
        data
      );

      res.status(200).json({
        message: 'Workout updated successfully',
        workout,
      });
    } catch (error: any) {
      if (error.message === 'Workout not found or unauthorized') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Update workout error:', error);
      res.status(500).json({ error: 'Failed to update workout' });
    }
  }

  static async deleteWorkoutSession(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      await WorkoutService.deleteWorkoutSession(id, req.userId);

      res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Workout not found or unauthorized') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Delete workout error:', error);
      res.status(500).json({ error: 'Failed to delete workout' });
    }
  }

  static async getWorkoutCompletion(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const completion = await WorkoutService.getWorkoutCompletion(req.userId);

      res.status(200).json({ completion });
    } catch (error) {
      console.error('Get workout completion error:', error);
      res.status(500).json({ error: 'Failed to get workout completion' });
    }
  }
}
