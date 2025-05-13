import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as WorkoutService from '../services/workout.service';
import ApiError from '../error/ApiError';
import { ReturnUser } from './user.controller';

async function getAllWorkouts(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || -1;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.size) || 10;
    const skip = (page - 1) * pageSize;
    const tags = req.query.tagIds?.toString();

    let tagIds = null;
    if (tags !== undefined) {
      tagIds = tags.split(',').map((item) => Number(item));
    }

    const allWorkoutsPaginated = await WorkoutService.getAllWorkouts(
      skip,
      page,
      pageSize,
      tagIds,
      userId,
    );

    res.status(201).send(allWorkoutsPaginated);
  } catch (error) {
    next(error);
  }
}

async function getWorkoutDetails(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || -1;
    const workoutId = Number(req.params.id) || -1;
    if (Number.isNaN(workoutId) || workoutId <= 0) {
      throw new ApiError(400, 'Invalid workout id');
    }

    const workoutWithTagName = await WorkoutService.getWorkoutDetails(
      workoutId,
      userId,
    );
    if (!workoutWithTagName) {
      throw new ApiError(404, 'Workout not found');
    }

    res.status(201).send(workoutWithTagName);
  } catch (error) {
    next(error);
  }
}

async function createWorkout(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, description, isPrivate, workoutLevelId, tagIds, exercises } =
      req.body;

    if (
      name === undefined ||
      description === undefined ||
      isPrivate === undefined ||
      workoutLevelId === undefined ||
      tagIds === undefined ||
      exercises === undefined
    ) {
      throw new ApiError(400, 'Missing required fields');
    }

    const newWorkout = await WorkoutService.createWorkout(
      Number(req.user),
      name,
      description,
      isPrivate,
      workoutLevelId,
      tagIds,
      exercises,
    );
    if (!newWorkout) {
      throw new ApiError(500, 'Failed to create workout');
    }

    res.status(201).send(newWorkout);
  } catch (error) {
    next(error);
  }
}

async function getAllWorkoutTags(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const workoutTags = await WorkoutService.getAllWorkoutTags();
    res.status(201).send({
      workoutTags: workoutTags,
    });
  } catch (error) {
    next(error);
  }
}

async function getWorkoutDifficulties(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const difficulties = await WorkoutService.getWorkoutDifficulties();
    res.status(201).send(difficulties);
  } catch (error) {
    next(error);
  }
}

export {
  getAllWorkouts,
  getWorkoutDetails,
  createWorkout,
  getAllWorkoutTags,
  getWorkoutDifficulties,
};
