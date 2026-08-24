import { Request, Response, Router } from 'express';
import dashboardAuth from '../../middlewares/dashboardAuth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const router = Router();

router.get(
  '/verify',
  dashboardAuth,
  catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dashboard passcode verified successfully',
      data: { valid: true },
    });
  }),
);

router.post(
  '/verify',
  dashboardAuth,
  catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dashboard passcode verified successfully',
      data: { valid: true },
    });
  }),
);

export const AuthRoutes = router;
