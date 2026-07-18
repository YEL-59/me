import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import AppError from '../errors/AppError';

const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorSources: unknown = err;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errorSources = err.issues;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorSources,
    stack: config.node_env === 'development' ? (err as Error)?.stack : null,
  });
};

export default globalErrorHandler;
