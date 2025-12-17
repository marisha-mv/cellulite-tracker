import { prisma } from '../server';
import { ProgressPhotoData } from '../types';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export class ProgressService {
  static async getWeeklyProgress(userId: string, weekNumber: number) {
    const progress = await prisma.weeklyProgress.findUnique({
      where: {
        userId_weekNumber: {
          userId,
          weekNumber,
        },
      },
    });

    return progress;
  }

  static async getAllProgress(userId: string) {
    const progress = await prisma.weeklyProgress.findMany({
      where: { userId },
      orderBy: { weekNumber: 'desc' },
    });

    return progress;
  }

  static async createWeeklyProgress(
    userId: string,
    data: ProgressPhotoData,
    photos: {
      frontPhoto: string;
      backPhoto: string;
      sidePhoto: string;
    }
  ) {
    // Optimize images
    const optimizedPhotos = await this.optimizePhotos(photos);

    const progress = await prisma.weeklyProgress.create({
      data: {
        userId,
        weekNumber: data.weekNumber,
        startDate: data.startDate,
        endDate: data.endDate,
        frontPhoto: optimizedPhotos.frontPhoto,
        backPhoto: optimizedPhotos.backPhoto,
        sidePhoto: optimizedPhotos.sidePhoto,
        notes: data.notes,
      },
    });

    return progress;
  }

  static async updateWeeklyProgress(
    progressId: string,
    userId: string,
    data: Partial<ProgressPhotoData>,
    photos?: {
      frontPhoto?: string;
      backPhoto?: string;
      sidePhoto?: string;
    }
  ) {
    // Verify ownership
    const progress = await prisma.weeklyProgress.findUnique({
      where: { id: progressId },
    });

    if (!progress || progress.userId !== userId) {
      throw new Error('Progress not found or unauthorized');
    }

    let optimizedPhotos: any = {};
    if (photos) {
      // Delete old photos if new ones are provided
      if (photos.frontPhoto) {
        this.deletePhoto(progress.frontPhoto);
      }
      if (photos.backPhoto) {
        this.deletePhoto(progress.backPhoto);
      }
      if (photos.sidePhoto) {
        this.deletePhoto(progress.sidePhoto);
      }

      optimizedPhotos = await this.optimizePhotos(photos);
    }

    const updatedProgress = await prisma.weeklyProgress.update({
      where: { id: progressId },
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        ...optimizedPhotos,
      },
    });

    return updatedProgress;
  }

  static async deleteWeeklyProgress(progressId: string, userId: string) {
    // Verify ownership
    const progress = await prisma.weeklyProgress.findUnique({
      where: { id: progressId },
    });

    if (!progress || progress.userId !== userId) {
      throw new Error('Progress not found or unauthorized');
    }

    // Delete photos from filesystem
    this.deletePhoto(progress.frontPhoto);
    this.deletePhoto(progress.backPhoto);
    this.deletePhoto(progress.sidePhoto);

    // Delete from database
    await prisma.weeklyProgress.delete({
      where: { id: progressId },
    });
  }

  static async optimizePhotos(photos: {
    frontPhoto?: string;
    backPhoto?: string;
    sidePhoto?: string;
  }): Promise<any> {
    const optimized: any = {};

    for (const [key, photoPath] of Object.entries(photos)) {
      if (photoPath) {
        const fullPath = path.join(__dirname, '../../uploads', photoPath);
        const optimizedPath = path.join(
          __dirname,
          '../../uploads',
          `optimized_${photoPath}`
        );

        try {
          // Optimize image: resize to max 1200px width, compress
          await sharp(fullPath)
            .resize(1200, null, {
              withoutEnlargement: true,
              fit: 'inside',
            })
            .jpeg({ quality: 85 })
            .toFile(optimizedPath);

          // Delete original and use optimized
          fs.unlinkSync(fullPath);
          optimized[key] = `optimized_${photoPath}`;
        } catch (error) {
          console.error('Error optimizing image:', error);
          // If optimization fails, use original
          optimized[key] = photoPath;
        }
      }
    }

    return optimized;
  }

  static deletePhoto(photoPath: string) {
    try {
      const fullPath = path.join(__dirname, '../../uploads', photoPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }
}
