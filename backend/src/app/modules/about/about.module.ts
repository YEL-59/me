import { Request, Response, Router } from 'express';
import { Schema, model } from 'mongoose';
import { z } from 'zod';
import AppError from '../../errors/AppError';
import dashboardAuth from '../../middlewares/dashboardAuth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

export type TAbout = {
  pageTitle: string;
  pageSubtitle: string;
  accent?: string;
  introParagraphs: string[];
  photoUrl: string;
  handleBadge?: string;
  funFacts: { emoji: string; label: string; value: string }[];
  philosophies: string[];
};

const aboutSchema = new Schema<TAbout>(
  {
    pageTitle: { type: String, required: true },
    pageSubtitle: { type: String, required: true },
    accent: { type: String },
    introParagraphs: { type: [String], default: [] },
    photoUrl: { type: String, required: true },
    handleBadge: { type: String },
    funFacts: {
      type: [{ emoji: String, label: String, value: String }],
      default: [],
    },
    philosophies: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const About = model<TAbout>('About', aboutSchema);

const upsertSchema = z.object({
  body: z.object({
    pageTitle: z.string().min(1),
    pageSubtitle: z.string().min(1),
    accent: z.string().optional(),
    introParagraphs: z.array(z.string()).default([]),
    photoUrl: z.string().min(1),
    handleBadge: z.string().optional(),
    funFacts: z
      .array(
        z.object({
          emoji: z.string(),
          label: z.string(),
          value: z.string(),
        }),
      )
      .default([]),
    philosophies: z.array(z.string()).default([]),
  }),
});

const router = Router();

router.get(
  '/',
  catchAsync(async (_req: Request, res: Response) => {
    const result = await About.findOne();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'About retrieved successfully',
      data: result,
    });
  }),
);

router.put(
  '/',
  dashboardAuth,
  validateRequest(upsertSchema),
  catchAsync(async (req: Request, res: Response) => {
    const existing = await About.findOne();
    const result = existing
      ? await About.findByIdAndUpdate(existing._id, req.body, {
          new: true,
          runValidators: true,
        })
      : await About.create(req.body);

    if (!result) throw new AppError(500, 'Failed to upsert about');

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'About saved successfully',
      data: result,
    });
  }),
);

export const AboutRoutes = router;
