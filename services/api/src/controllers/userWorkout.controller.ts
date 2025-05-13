import { NextFunction, Response } from 'express';
import * as UserWorkoutService from '../services/userWorkout.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import ApiError from '../error/ApiError';
import { ReturnUser } from './user.controller';

async function addWorkoutToUserAccount(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;
    const workoutId = Number(req.body.workoutId);

    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    if (Number.isNaN(workoutId) || workoutId <= 0) {
      throw new ApiError(400, 'Invalid workout id');
    }

    await UserWorkoutService.addWorkoutToUserAccount(userId, workoutId);

    res.status(201).send({ message: 'Workout added to user account' });
  } catch (error) {
    next(error);
  }
}

async function getAllUserWorkouts(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || -1;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.size) || 10;
    const skip = (page - 1) * pageSize;
    const tags = req.query.tagIds?.toString();

    let tagIds = null;
    if (tags !== undefined) {
      tagIds = tags.split(',').map((item) => Number(item));
    }

    const workouts = await UserWorkoutService.getAllUserWorkouts(
      userId,
      skip,
      page,
      pageSize,
      tagIds,
    );
    res.status(200).send(workouts);
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
    const workoutTags = await UserWorkoutService.getAllWorkoutTags();
    res.status(201).send({
      workoutTags: workoutTags,
    });
  } catch (error) {
    next(error);
  }
}

export { addWorkoutToUserAccount, getAllUserWorkouts, getAllWorkoutTags };
