import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as UserService from '../services/user.service';
import { NewUserDetails, ReturnUser } from '../types/user';
import ApiError from '../error/ApiError';
import { generateAuthenticationToken } from './auth.controller';

async function getAllUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.size) || 10;
    const skip = (page - 1) * pageSize;
    const currentUserId = (req.user as ReturnUser).userId ?? -1;

    const users = await UserService.getAllUsers(page, skip, pageSize, [
      currentUserId,
    ]);

    res.status(201).send(users);
  } catch (error) {
    next(error);
  }
}

async function getUserDetails(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number(req.params.id);
    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const user = await UserService.getUserDetails(userId);
    if (!user) {
      throw new ApiError(404, 'User with given id not found');
    }

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user as ReturnUser;
    if (!user) {
      throw new ApiError(401, 'User not authenticated'); // 401 because the user is not authenticated and user parameter is not set
    }
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

async function addUserHeight(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;
    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const { height } = req.body;
    if (!height) {
      throw new ApiError(400, 'Invalid height');
    }

    const result = await UserService.addUserHeight(userId, height);

    if (!result) {
      throw new ApiError(500, 'Failed to add height');
    }

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
}

async function getUserHeight(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;
    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const height = await UserService.getUserHeight(userId);
    if (!height) {
      throw new ApiError(500, 'Failed to add height');
    }

    res.status(201).send(height);
  } catch (error) {
    next(error);
  }
}

async function getGender(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;

    const gender = await UserService.getGender(userId);

    if (!gender) {
      throw new ApiError(500, 'Failed to obtain gender');
    }

    res.status(200).send(gender);
  } catch (error) {
    next(error);
  }
}

async function getStreak(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;

    const streak = await UserService.getStreak(userId);

    if (!streak) {
      throw new ApiError(500, 'Failed to calculate streak');
    }

    res.status(200).send({ streak });
  } catch (error) {
    next(error);
  }
}

async function updateUserProfileInfo(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;
    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const userDetails: NewUserDetails = req.body;
    if (
      !userDetails ||
      userDetails?.username === undefined ||
      userDetails?.email === undefined ||
      userDetails?.description === undefined
    ) {
      throw new ApiError(400, 'Invalid user details');
    }

    const newUserDetails = await UserService.updateUserProfileInfo(
      userId,
      userDetails,
    );

    const newAccessToken = generateAuthenticationToken(newUserDetails);
    if (!newAccessToken) {
      return null;
    }

    res.status(201).send({ ...newUserDetails, accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
}

export {
  getAllUsers,
  getUserDetails,
  getCurrentUser,
  addUserHeight,
  getUserHeight,
  getGender,
  getStreak,
  updateUserProfileInfo,
};
export type { ReturnUser };
