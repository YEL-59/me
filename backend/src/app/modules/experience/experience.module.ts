import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { createCrudServices } from '../../utils/createCrudServices';
import { createCrudRouter } from '../../utils/createCrudRouter';

export type TExperience = {
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate: string;
  yearLabel?: string;
  bullets?: string[];
  sortOrder?: number;
  published?: boolean;
  isDeleted?: boolean;
};

const experienceSchema = new Schema<TExperience>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    employmentType: { type: String },
    location: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    yearLabel: { type: String },
    bullets: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Experience = model<TExperience>('Experience', experienceSchema);
export const ExperienceServices = createCrudServices(Experience, 'Experience');

const createSchema = z.object({
  body: z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    employmentType: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    yearLabel: z.string().optional(),
    bullets: z.array(z.string()).optional(),
    sortOrder: z.number().optional(),
    published: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

export const ExperienceRoutes = createCrudRouter({
  resourceName: 'Experience',
  services: ExperienceServices,
  createSchema,
  updateSchema,
});
