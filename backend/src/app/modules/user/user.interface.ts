import { Model } from 'mongoose';

export type TUser = {
  name: string;
  email: string;
  age: number;
  role: 'user' | 'admin';
  isDeleted?: boolean;
};

export type UserModel = Model<TUser>;
