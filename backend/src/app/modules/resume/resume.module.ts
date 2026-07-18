import { Request, Response, Router } from 'express';
import { Schema, model } from 'mongoose';
import { z } from 'zod';
import AppError from '../../errors/AppError';
import dashboardAuth from '../../middlewares/dashboardAuth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

export type TResume = {
  pageTitle: string;
  pageSubtitle: string;
  accent?: string;
  summary: string[];
  skillGroups: { group: string; items: string }[];
  codingProfiles: { label: string; href: string }[];
  pdfUrl?: string;
  texUrl?: string;
  latexRepoUrl?: string;
};

const resumeSchema = new Schema<TResume>(
  {
    pageTitle: { type: String, required: true },
    pageSubtitle: { type: String, required: true },
    accent: { type: String },
    summary: { type: [String], default: [] },
    skillGroups: {
      type: [{ group: String, items: String }],
      default: [],
    },
    codingProfiles: {
      type: [{ label: String, href: String }],
      default: [],
    },
    pdfUrl: { type: String },
    texUrl: { type: String },
    latexRepoUrl: { type: String },
  },
  { timestamps: true },
);

export const Resume = model<TResume>('Resume', resumeSchema);

const upsertSchema = z.object({
  body: z.object({
    pageTitle: z.string().min(1),
    pageSubtitle: z.string().min(1),
    accent: z.string().optional(),
    summary: z.array(z.string()).default([]),
    skillGroups: z
      .array(z.object({ group: z.string(), items: z.string() }))
      .default([]),
    codingProfiles: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    pdfUrl: z.string().optional(),
    texUrl: z.string().optional(),
    latexRepoUrl: z.string().optional(),
  }),
});

const router = Router();

router.get(
  '/',
  catchAsync(async (_req: Request, res: Response) => {
    const result = await Resume.findOne();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Resume retrieved successfully',
      data: result,
    });
  }),
);

router.put(
  '/',
  dashboardAuth,
  validateRequest(upsertSchema),
  catchAsync(async (req: Request, res: Response) => {
    const existing = await Resume.findOne();
    const result = existing
      ? await Resume.findByIdAndUpdate(existing._id, req.body, {
          new: true,
          runValidators: true,
        })
      : await Resume.create(req.body);

    if (!result) throw new AppError(500, 'Failed to upsert resume');

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Resume saved successfully',
      data: result,
    });
  }),
);

export const ResumeRoutes = router;
