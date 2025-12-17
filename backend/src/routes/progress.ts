import { Router } from 'express';
import { ProgressController } from '../controllers/progressController';
import { authenticateToken } from '../middleware/auth';
import { uploadProgressPhotos } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all progress entries
router.get('/', ProgressController.getAllProgress);

// Get specific week's progress
router.get('/:weekNumber', ProgressController.getWeeklyProgress);

// Create new progress entry with photos
router.post('/', uploadProgressPhotos, ProgressController.createWeeklyProgress);

// Update progress entry (can update photos or just data)
router.put('/:id', uploadProgressPhotos, ProgressController.updateWeeklyProgress);

// Delete progress entry
router.delete('/:id', ProgressController.deleteWeeklyProgress);

export default router;
