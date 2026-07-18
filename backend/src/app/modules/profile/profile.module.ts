import { Request, Response, Router } from 'express';
import { Schema, model } from 'mongoose';
import { z } from 'zod';
import AppError from '../../errors/AppError';
import dashboardAuth from '../../middlewares/dashboardAuth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

export type TProfile = {
  displayName: string;
  shortName: string;
  handle: string;
  role: string;
  avatarUrl: string;
  avatarInitial: string;
  email: string;
  phone?: string;
  website?: string;
  collectionLabel?: string;
  availabilityStatus?: string;
  yearsExperience?: string;
  seoTitle?: string;
  seoDescription?: string;
  bioParagraphs?: string[];
  locationArea?: string;
  locationCity?: string;
  lat?: number;
  lng?: number;
  greeting?: string;
  vaultOriginTitle?: string;
  vaultOriginDetail?: string;
  vaultCurrentTitle?: string;
  vaultCurrentDetail?: string;
  codeCardStack?: string[];
};

const profileSchema = new Schema<TProfile>(
  {
    displayName: { type: String, required: true },
    shortName: { type: String, required: true },
    handle: { type: String, required: true },
    role: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    avatarInitial: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    collectionLabel: { type: String },
    availabilityStatus: { type: String },
    yearsExperience: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    bioParagraphs: { type: [String], default: [] },
    locationArea: { type: String },
    locationCity: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    greeting: { type: String },
    vaultOriginTitle: { type: String },
    vaultOriginDetail: { type: String },
    vaultCurrentTitle: { type: String },
    vaultCurrentDetail: { type: String },
    codeCardStack: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Profile = model<TProfile>('Profile', profileSchema);

const upsertSchema = z.object({
  body: z.object({
    displayName: z.string().min(1),
    shortName: z.string().min(1),
    handle: z.string().min(1),
    role: z.string().min(1),
    avatarUrl: z.string().min(1),
    avatarInitial: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    website: z.string().optional(),
    collectionLabel: z.string().optional(),
    availabilityStatus: z.string().optional(),
    yearsExperience: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    bioParagraphs: z.array(z.string()).optional(),
    locationArea: z.string().optional(),
    locationCity: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    greeting: z.string().optional(),
    vaultOriginTitle: z.string().optional(),
    vaultOriginDetail: z.string().optional(),
    vaultCurrentTitle: z.string().optional(),
    vaultCurrentDetail: z.string().optional(),
    codeCardStack: z.array(z.string()).optional(),
  }),
});

const router = Router();

router.get(
  '/',
  catchAsync(async (_req: Request, res: Response) => {
    const result = await Profile.findOne();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Profile retrieved successfully',
      data: result,
    });
  }),
);

router.put(
  '/',
  dashboardAuth,
  validateRequest(upsertSchema),
  catchAsync(async (req: Request, res: Response) => {
    const existing = await Profile.findOne();
    const result = existing
      ? await Profile.findByIdAndUpdate(existing._id, req.body, {
          new: true,
          runValidators: true,
        })
      : await Profile.create(req.body);

    if (!result) throw new AppError(500, 'Failed to upsert profile');

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Profile saved successfully',
      data: result,
    });
  }),
);

export const ProfileRoutes = router;
