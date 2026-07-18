import { Request, Response, Router } from 'express';
import { ZodObject, ZodRawShape } from 'zod';
import dashboardAuth from '../middlewares/dashboardAuth';
import validateRequest from '../middlewares/validateRequest';
import catchAsync from './catchAsync';
import sendResponse from './sendResponse';

type CrudServices = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (payload: any) => Promise<unknown>;
  getAll: () => Promise<unknown>;
  getOne: (id: string) => Promise<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string, payload: any) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
};

type CrudRouteOptions = {
  resourceName: string;
  services: CrudServices;
  createSchema: ZodObject<ZodRawShape>;
  updateSchema: ZodObject<ZodRawShape>;
};

export const createCrudRouter = ({
  resourceName,
  services,
  createSchema,
  updateSchema,
}: CrudRouteOptions) => {
  const router = Router();

  router.get(
    '/',
    catchAsync(async (_req: Request, res: Response) => {
      const result = await services.getAll();
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `${resourceName}s retrieved successfully`,
        data: result,
      });
    }),
  );

  router.get(
    '/:id',
    catchAsync(async (req: Request, res: Response) => {
      const result = await services.getOne(req.params.id as string);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `${resourceName} retrieved successfully`,
        data: result,
      });
    }),
  );

  router.post(
    '/',
    dashboardAuth,
    validateRequest(createSchema),
    catchAsync(async (req: Request, res: Response) => {
      const result = await services.create(req.body);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: `${resourceName} created successfully`,
        data: result,
      });
    }),
  );

  router.patch(
    '/:id',
    dashboardAuth,
    validateRequest(updateSchema),
    catchAsync(async (req: Request, res: Response) => {
      const result = await services.update(req.params.id as string, req.body);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `${resourceName} updated successfully`,
        data: result,
      });
    }),
  );

  router.delete(
    '/:id',
    dashboardAuth,
    catchAsync(async (req: Request, res: Response) => {
      const result = await services.remove(req.params.id as string);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `${resourceName} deleted successfully`,
        data: result,
      });
    }),
  );

  return router;
};
