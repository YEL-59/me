import { Model, Document } from 'mongoose';
import AppError from '../errors/AppError';

type SoftDeleteDoc = { isDeleted?: boolean };

export const createCrudServices = <T extends SoftDeleteDoc>(
  ModelRef: Model<T>,
  resourceName: string,
) => {
  const create = async (payload: Partial<T>) => {
    return ModelRef.create(payload);
  };

  const getAll = async (filter: Record<string, unknown> = {}) => {
    return ModelRef.find({ isDeleted: { $ne: true }, ...filter }).sort({
      sortOrder: 1,
      createdAt: -1,
    });
  };

  const getOne = async (id: string) => {
    const result = await ModelRef.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });
    if (!result) throw new AppError(404, `${resourceName} not found`);
    return result;
  };

  const update = async (id: string, payload: Partial<T>) => {
    const result = await ModelRef.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      payload,
      { new: true, runValidators: true },
    );
    if (!result) throw new AppError(404, `${resourceName} not found`);
    return result;
  };

  const remove = async (id: string) => {
    const result = await ModelRef.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { isDeleted: true } as Partial<T>,
      { new: true },
    );
    if (!result) throw new AppError(404, `${resourceName} not found`);
    return result;
  };

  return { create, getAll, getOne, update, remove };
};

export type CrudDocument = Document & SoftDeleteDoc;
