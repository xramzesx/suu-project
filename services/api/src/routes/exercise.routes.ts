import express from 'express';
import * as exerciseController from '../controllers/exercise.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/all', authenticateToken, exerciseController.getAllExercises);
router.get('/types', authenticateToken, exerciseController.getAllExersiceTypes);
router.get('/:id', authenticateToken, exerciseController.getExerciseDetails);

export = router;
