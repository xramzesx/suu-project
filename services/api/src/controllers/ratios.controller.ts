import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as RatiosService from '../services/ratios.service';
import ApiError from '../error/ApiError';
import { ReturnUser } from '../types/user';

async function calculateBMI(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;

    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const BMI = await RatiosService.calculateBMI(userId);

    if (!BMI || BMI === -1) {
      throw new ApiError(500, 'Failed to obtain BMI');
    }

    res.status(201).send({ BMI });
  } catch (error) {
    next(error);
  }
}

async function calculateWHR(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;

    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const WHR = await RatiosService.calculateWHR(userId);

    if (!WHR || WHR === -1) {
      throw new ApiError(500, 'Failed to obtain WHR');
    }

    res.status(201).send({ WHR });
  } catch (error) {
    next(error);
  }
}

async function calculateWHtR(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;

    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const WHtR = await RatiosService.calculateWHtR(userId);

    if (!WHtR || WHtR === -1) {
      throw new ApiError(500, 'Failed to obtain WHtR');
    }

    res.status(201).send({ WHtR });
  } catch (error) {
    next(error);
  }
}

async function calculateBrocaIndex(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;

    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const BrocaIndex = await RatiosService.calculateBrocaIndex(userId);

    if (!BrocaIndex || BrocaIndex === -1) {
      throw new ApiError(500, 'Failed to obtain WHtR');
    }

    res.status(201).send({ BrocaIndex });
  } catch (error) {
    next(error);
  }
}

async function calculateLBM(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;

    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const LBM = await RatiosService.calculateLBM(userId);

    if (!LBM || LBM === -1) {
      throw new ApiError(500, 'Failed to obtain LBM');
    }

    res.status(201).send({ LBM });
  } catch (error) {
    next(error);
  }
}

async function calculateBMR(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || 1;

    if (!userId) {
      throw new ApiError(400, 'Invalid user id');
    }

    const BMR = await RatiosService.calculateBMR(userId);

    if (!BMR || BMR === -1) {
      throw new ApiError(500, 'Failed to obtain BMR');
    }

    res.status(201).send({ BMR });
  } catch (error) {
    next(error);
  }
}

export {
  calculateBMI,
  calculateWHR,
  calculateWHtR,
  calculateBrocaIndex,
  calculateLBM,
  calculateBMR,
};
