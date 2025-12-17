import { Response } from 'express';
import { ProgressService } from '../services/progressService';
import { AuthRequest, ProgressPhotoData } from '../types';

export class ProgressController {
  static async getWeeklyProgress(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { weekNumber } = req.params;
      const progress = await ProgressService.getWeeklyProgress(
        req.userId,
        parseInt(weekNumber)
      );

      if (!progress) {
        return res.status(404).json({ error: 'Progress not found' });
      }

      res.status(200).json({ progress });
    } catch (error) {
      console.error('Get weekly progress error:', error);
      res.status(500).json({ error: 'Failed to get progress' });
    }
  }

  static async getAllProgress(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const progress = await ProgressService.getAllProgress(req.userId);

      res.status(200).json({ progress });
    } catch (error) {
      console.error('Get all progress error:', error);
      res.status(500).json({ error: 'Failed to get progress' });
    }
  }

  static async createWeeklyProgress(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const files = req.files as {
        frontPhoto?: Express.Multer.File[];
        backPhoto?: Express.Multer.File[];
        sidePhoto?: Express.Multer.File[];
      };

      // Validate that all 3 photos are provided
      if (!files?.frontPhoto || !files?.backPhoto || !files?.sidePhoto) {
        return res.status(400).json({
          error: 'All three photos (front, back, side) are required',
        });
      }

      const data: ProgressPhotoData = {
        weekNumber: parseInt(req.body.weekNumber),
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        notes: req.body.notes,
      };

      const photos = {
        frontPhoto: files.frontPhoto[0].filename,
        backPhoto: files.backPhoto[0].filename,
        sidePhoto: files.sidePhoto[0].filename,
      };

      const progress = await ProgressService.createWeeklyProgress(
        req.userId,
        data,
        photos
      );

      res.status(201).json({
        message: 'Progress photos uploaded successfully',
        progress,
      });
    } catch (error) {
      console.error('Create progress error:', error);
      res.status(500).json({ error: 'Failed to upload progress photos' });
    }
  }

  static async updateWeeklyProgress(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      const files = req.files as {
        frontPhoto?: Express.Multer.File[];
        backPhoto?: Express.Multer.File[];
        sidePhoto?: Express.Multer.File[];
      };

      const data: Partial<ProgressPhotoData> = {
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        notes: req.body.notes,
      };

      const photos = files
        ? {
            frontPhoto: files.frontPhoto?.[0]?.filename,
            backPhoto: files.backPhoto?.[0]?.filename,
            sidePhoto: files.sidePhoto?.[0]?.filename,
          }
        : undefined;

      const progress = await ProgressService.updateWeeklyProgress(
        id,
        req.userId,
        data,
        photos
      );

      res.status(200).json({
        message: 'Progress updated successfully',
        progress,
      });
    } catch (error: any) {
      if (error.message === 'Progress not found or unauthorized') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Update progress error:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  }

  static async deleteWeeklyProgress(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      await ProgressService.deleteWeeklyProgress(id, req.userId);

      res.status(200).json({ message: 'Progress deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Progress not found or unauthorized') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Delete progress error:', error);
      res.status(500).json({ error: 'Failed to delete progress' });
    }
  }
}
