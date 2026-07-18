import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import AppError from '../errors/AppError';

const dashboardAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const key = req.headers['x-dashboard-key'];

  if (!config.dashboard_secret || key !== config.dashboard_secret) {
    throw new AppError(401, 'Unauthorized dashboard access');
  }

  next();
};

export default dashboardAuth;
