import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: TUser) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(409, 'User already exists with this email');
  }

  const result = await User.create(payload);
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await User.find({ isDeleted: { $ne: true } });
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findOne({ _id: id, isDeleted: { $ne: true } });

  if (!result) {
    throw new AppError(404, 'User not found');
  }

  return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    payload,
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(404, 'User not found');
  }

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(404, 'User not found');
  }

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
