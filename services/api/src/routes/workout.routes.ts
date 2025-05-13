import express from 'express';
import * as workoutController from '../controllers/workout.controller';
import * as userWorkoutLogController from '../controllers/userWorkoutLog.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', authenticateToken, workoutController.getAllWorkouts);
router.get('/:id', authenticateToken, workoutController.getWorkoutDetails);
router.post('/create', authenticateToken, workoutController.createWorkout);
router.get('/tag/all', authenticateToken, workoutController.getAllWorkoutTags);
router.get(
  '/difficulty/all',
  authenticateToken,
  workoutController.getWorkoutDifficulties,
);

router.post(
  '/live-training/save',
  authenticateToken,
  userWorkoutLogController.createWorkoutLog,
);

export = router;
