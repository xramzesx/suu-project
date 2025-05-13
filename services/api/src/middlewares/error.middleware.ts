import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import ApiError from '../error/ApiError';

const errorHandler: ErrorRequestHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
  });
};

export default errorHandler;
