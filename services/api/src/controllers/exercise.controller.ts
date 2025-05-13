import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as ExerciseService from '../services/exercise.service';
import ApiError from '../error/ApiError';
import { ReturnUser } from './user.controller';

const DEFAULT_RECOMMENDATIONS_LIMIT = 10;

async function getAllExercises(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const userId = Number((req.user as ReturnUser).userId) || -1;
  const { selectedExercises, limit } = req.query;

  try {
    const parsedSelectedExercises = JSON.parse(
      (selectedExercises as string) ?? '[]',
    );
    const parsedLimit = parseInt(
      (limit as string) ?? DEFAULT_RECOMMENDATIONS_LIMIT,
    );

    const exercises = await ExerciseService.getAllExercises();
    const recommended = await ExerciseService.getRecommendedExercises(
      userId,
      parsedSelectedExercises,
      !isNaN(parsedLimit) ? parsedLimit : DEFAULT_RECOMMENDATIONS_LIMIT,
    );

    const response = {
      exercises: exercises,
      recommended: recommended,
    };

    res.status(201).send(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function getExerciseDetails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const exerciseId = Number(req.params.id) || -1;
    if (!exerciseId || exerciseId <= 0) {
      throw new ApiError(400, 'Invalid exercise id');
    }

    const exercises = await ExerciseService.getExerciseDetails(exerciseId);
    res.status(201).send(exercises);
  } catch (error) {
    next(error);
  }
}

async function getAllExersiceTypes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const exerciseTypes = await ExerciseService.getAllExersiceTypes();
    res.status(201).send(exerciseTypes);
  } catch (error) {
    next(error);
  }
}

export { getAllExercises, getExerciseDetails, getAllExersiceTypes };
