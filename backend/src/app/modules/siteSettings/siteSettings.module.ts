import { Request, Response, Router } from 'express';
import { Schema, model } from 'mongoose';
import { z } from 'zod';
import config from '../../../config';
import AppError from '../../errors/AppError';
import dashboardAuth from '../../middlewares/dashboardAuth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

export type TSiteSettings = {
  footerLinks: { label: string; href: string }[];
  brandValues: string[];
  marqueeTrackA: string[];
  marqueeTrackB: string[];
  availabilityBadge: string;
  ambientTagline?: string;
  copyrightText: string;
  githubUsername: string;
  timezone: string;
  vaultMasterPasscode: string;
  /** Password visitors enter to reveal project GitHub/repo links */
  repoUnlockPassword?: string;
  /** Seconds until project details auto-lock after unlock (default 60) */
  repoUnlockTtlSeconds?: number;
  vaultHelpSteps: { icon: string; label: string; text: string }[];
  mapInviteLine?: string;
  mapFooterLine?: string;
};

const siteSettingsSchema = new Schema<TSiteSettings>(
  {
    footerLinks: {
      type: [{ label: String, href: String }],
      default: [],
    },
    brandValues: { type: [String], default: [] },
    marqueeTrackA: { type: [String], default: [] },
    marqueeTrackB: { type: [String], default: [] },
    availabilityBadge: { type: String, required: true },
    ambientTagline: { type: String },
    copyrightText: { type: String, required: true },
    githubUsername: { type: String, required: true },
    timezone: { type: String, required: true },
    vaultMasterPasscode: { type: String, required: true },
    repoUnlockPassword: { type: String },
    repoUnlockTtlSeconds: { type: Number, default: 60 },
    vaultHelpSteps: {
      type: [{ icon: String, label: String, text: String }],
      default: [],
    },
    mapInviteLine: { type: String },
    mapFooterLine: { type: String },
  },
  { timestamps: true },
);

export const SiteSettings = model<TSiteSettings>(
  'SiteSettings',
  siteSettingsSchema,
);

const upsertSchema = z.object({
  body: z.object({
    footerLinks: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    brandValues: z.array(z.string()).default([]),
    marqueeTrackA: z.array(z.string()).default([]),
    marqueeTrackB: z.array(z.string()).default([]),
    availabilityBadge: z.string().min(1),
    ambientTagline: z.string().optional(),
    copyrightText: z.string().min(1),
    githubUsername: z.string().min(1),
    timezone: z.string().min(1),
    vaultMasterPasscode: z.string().min(1),
    repoUnlockPassword: z.string().optional(),
    repoUnlockTtlSeconds: z.number().int().min(10).max(86400).optional(),
    vaultHelpSteps: z
      .array(
        z.object({
          icon: z.string(),
          label: z.string(),
          text: z.string(),
        }),
      )
      .default([]),
    mapInviteLine: z.string().optional(),
    mapFooterLine: z.string().optional(),
  }),
});

const router = Router();

router.get(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    const result = await SiteSettings.findOne();
    const isDashboard = req.headers['x-dashboard-key'] === config.dashboard_secret;

    let data = result;
    if (result && !isDashboard) {
      const obj = result.toObject();
      delete (obj as { repoUnlockPassword?: string }).repoUnlockPassword;
      delete (obj as { vaultMasterPasscode?: string }).vaultMasterPasscode;
      data = obj as typeof result;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Site settings retrieved successfully',
      data,
    });
  }),
);

router.put(
  '/',
  dashboardAuth,
  validateRequest(upsertSchema),
  catchAsync(async (req: Request, res: Response) => {
    const existing = await SiteSettings.findOne();
    const result = existing
      ? await SiteSettings.findByIdAndUpdate(existing._id, req.body, {
          new: true,
          runValidators: true,
        })
      : await SiteSettings.create(req.body);

    if (!result) throw new AppError(500, 'Failed to upsert site settings');

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Site settings saved successfully',
      data: result,
    });
  }),
);

export const SiteSettingsRoutes = router;
