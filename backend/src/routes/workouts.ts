import { Router } from 'express';
import { WorkoutController } from '../controllers/workoutController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all workout sessions
router.get('/', WorkoutController.getWorkoutSessions);

// Get workout completion stats
router.get('/completion', WorkoutController.getWorkoutCompletion);

// Get workouts by week number
router.get('/week/:weekNumber', WorkoutController.getWorkoutsByWeek);

// Get specific workout session
router.get('/:id', WorkoutController.getWorkoutSession);

// Create workout session
router.post('/', WorkoutController.createWorkoutSession);

// Update workout session
router.put('/:id', WorkoutController.updateWorkoutSession);

// Delete workout session
router.delete('/:id', WorkoutController.deleteWorkoutSession);

export default router;
