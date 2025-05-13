import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from '../error/ApiError';

interface AuthRequest extends Request {
  user?: string | JwtPayload | undefined;
}

const accessTokenBlacklist: string[] = [];

function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.header('Authorization');
  const token = authToken && authToken.split(' ')[1];
  if (!token) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (accessTokenBlacklist.includes(token)) {
    throw new ApiError(403, 'Forbidden');
  }

  try {
    const accesTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accesTokenSecret) {
      throw new ApiError(500, 'Internal server error');
    }

    jwt.verify(token, accesTokenSecret, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
}

function blackListToken(token: string) {
  accessTokenBlacklist.push(token);
}

export { authenticateToken, blackListToken };
export type { AuthRequest };
