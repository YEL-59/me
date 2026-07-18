import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { createCrudServices } from '../../utils/createCrudServices';
import { createCrudRouter } from '../../utils/createCrudRouter';

export type TEducation = {
  year: string;
  place: string;
  title: string;
  detail: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  published?: boolean;
  isDeleted?: boolean;
};

const educationSchema = new Schema<TEducation>(
  {
    year: { type: String, required: true },
    place: { type: String, required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    location: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Education = model<TEducation>('Education', educationSchema);
export const EducationServices = createCrudServices(Education, 'Education');

const createSchema = z.object({
  body: z.object({
    year: z.string().min(1),
    place: z.string().min(1),
    title: z.string().min(1),
    detail: z.string().min(1),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortOrder: z.number().optional(),
    published: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

export const EducationRoutes = createCrudRouter({
  resourceName: 'Education',
  services: EducationServices,
  createSchema,
  updateSchema,
});
