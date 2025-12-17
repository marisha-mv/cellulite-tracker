import { Router } from 'express';
import { HabitController } from '../controllers/habitController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all habit check-ins with optional date range
router.get('/', HabitController.getHabitCheckIns);

// Get habit statistics
router.get('/stats', HabitController.getHabitStats);

// Get habit check-in for a specific date
router.get('/:date', HabitController.getHabitCheckIn);

// Create or update habit check-in
router.post('/', HabitController.createOrUpdateHabitCheckIn);

export default router;
