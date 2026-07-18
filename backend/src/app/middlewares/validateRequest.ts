import { ZodObject, ZodRawShape } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: ZodObject<ZodRawShape>) => {
  return catchAsync(async (req, _res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  });
};

export default validateRequest;
