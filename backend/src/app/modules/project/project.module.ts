import { Request, Response, Router } from 'express';
import { Schema, model } from 'mongoose';
import { z } from 'zod';
import config from '../../../config';
import AppError from '../../errors/AppError';
import dashboardAuth from '../../middlewares/dashboardAuth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SiteSettings } from '../siteSettings/siteSettings.module';

export type TProject = {
  slug: string;
  title: string;
  year: string;
  startDate?: string;
  endDate?: string;
  description: string;
  highlights: string[];
  stack: string[];
  href?: string;
  github?: string;
  status: 'live' | 'nda' | 'archived';
  accent: string;
  emoji: string;
  category: 'ai' | 'dashboard' | 'portfolio' | 'tool' | 'platform';
  featured?: boolean;
  sortOrder?: number;
  published?: boolean;
  isDeleted?: boolean;
};

const projectSchema = new Schema<TProject>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    stack: { type: [String], default: [] },
    href: { type: String },
    github: { type: String },
    status: {
      type: String,
      enum: ['live', 'nda', 'archived'],
      required: true,
    },
    accent: { type: String, required: true },
    emoji: { type: String, required: true },
    category: {
      type: String,
      enum: ['ai', 'dashboard', 'portfolio', 'tool', 'platform'],
      required: true,
    },
    featured: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Project = model<TProject>('Project', projectSchema);

/** Public shape: hide sensitive columns until password unlock */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toPublicProject = (doc: any) => {
  const obj = (
    typeof doc?.toObject === 'function' ? doc.toObject() : { ...doc }
  ) as Record<string, unknown>;

  const hasLockedDetails = Boolean(
    obj.github || obj.href || obj.startDate || obj.endDate,
  );

  delete obj.github;
  delete obj.href;
  delete obj.startDate;
  delete obj.endDate;

  return {
    ...obj,
    hasRepo: hasLockedDetails,
    repoLocked: hasLockedDetails,
    detailsLocked: true,
  };
};

const createSchema = z.object({
  body: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    year: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().min(1),
    highlights: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    href: z.string().optional(),
    github: z.string().optional(),
    status: z.enum(['live', 'nda', 'archived']),
    accent: z.string().min(1),
    emoji: z.string().min(1),
    category: z.enum(['ai', 'dashboard', 'portfolio', 'tool', 'platform']),
    featured: z.boolean().optional(),
    sortOrder: z.number().optional(),
    published: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

const unlockSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required'),
  }),
});

/** Password comes only from Dashboard → Site Settings → repoUnlockPassword */
async function getRepoUnlockPassword(): Promise<string | undefined> {
  const settings = await SiteSettings.findOne().lean();
  const fromDashboard = settings?.repoUnlockPassword?.trim();
  if (fromDashboard) return fromDashboard;
  // Optional env fallback if Site Settings not seeded yet
  return config.repo_unlock_password?.trim() || undefined;
}

async function getRepoUnlockTtlSeconds(): Promise<number> {
  const settings = await SiteSettings.findOne().lean();
  const ttl = settings?.repoUnlockTtlSeconds;
  if (typeof ttl === 'number' && ttl >= 10) return ttl;
  return 60;
}

const router = Router();

router.get(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    const result = await Project.find({
      isDeleted: { $ne: true },
    }).sort({ sortOrder: 1, createdAt: -1 });

    const isDashboard =
      req.headers['x-dashboard-key'] === config.dashboard_secret;

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Projects retrieved successfully',
      data: isDashboard ? result : result.map((p) => toPublicProject(p)),
    });
  }),
);

/** Unlock start/end/live/repo fields — must be before /:id */
router.post(
  '/unlock-repos',
  validateRequest(unlockSchema),
  catchAsync(async (req: Request, res: Response) => {
    const expected = await getRepoUnlockPassword();
    if (!expected) {
      throw new AppError(
        500,
        'Repo unlock password not set. Add repoUnlockPassword in Dashboard → Site Settings',
      );
    }

    if (req.body.password !== expected) {
      throw new AppError(401, 'Incorrect password');
    }

    const lockAfterSeconds = await getRepoUnlockTtlSeconds();

    const projects = await Project.find({
      isDeleted: { $ne: true },
    }).select('_id slug title startDate endDate href github');

    const details = projects.map((p) => ({
      _id: String(p._id),
      slug: p.slug,
      title: p.title,
      startDate: p.startDate ?? null,
      endDate: p.endDate ?? null,
      href: p.href ?? null,
      github: p.github ?? null,
    }));

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Project details unlocked',
      data: { unlocked: true, details, lockAfterSeconds },
    });
  }),
);

router.get(
  '/:id',
  catchAsync(async (req: Request, res: Response) => {
    const result = await Project.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    });
    if (!result) throw new AppError(404, 'Project not found');

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Project retrieved successfully',
      data: toPublicProject(result),
    });
  }),
);

router.post(
  '/',
  dashboardAuth,
  validateRequest(createSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await Project.create(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Project created successfully',
      data: result,
    });
  }),
);

router.patch(
  '/:id',
  dashboardAuth,
  validateRequest(updateSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await Project.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true },
    );
    if (!result) throw new AppError(404, 'Project not found');

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Project updated successfully',
      data: result,
    });
  }),
);

router.delete(
  '/:id',
  dashboardAuth,
  catchAsync(async (req: Request, res: Response) => {
    const result = await Project.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true },
    );
    if (!result) throw new AppError(404, 'Project not found');

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Project deleted successfully',
      data: result,
    });
  }),
);

export const ProjectRoutes = router;
