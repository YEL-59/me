import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { createCrudServices } from '../../utils/createCrudServices';
import { createCrudRouter } from '../../utils/createCrudRouter';

export type TOpenSource = {
  slug: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  stack: string[];
  preview: 'button' | 'card' | 'navbar' | 'footer' | 'breadcrumb' | 'banner';
  accent: string;
  emoji: string;
  github?: string;
  sortOrder?: number;
  published?: boolean;
  isDeleted?: boolean;
};

const openSourceSchema = new Schema<TOpenSource>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    stack: { type: [String], default: [] },
    preview: {
      type: String,
      enum: ['button', 'card', 'navbar', 'footer', 'breadcrumb', 'banner'],
      required: true,
    },
    accent: { type: String, required: true },
    emoji: { type: String, required: true },
    github: { type: String },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const OpenSource = model<TOpenSource>('OpenSource', openSourceSchema);
export const OpenSourceServices = createCrudServices(OpenSource, 'OpenSource');

const createSchema = z.object({
  body: z.object({
    slug: z.string().min(1),
    name: z.string().min(1),
    category: z.string().min(1),
    description: z.string().min(1),
    features: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    preview: z.enum([
      'button',
      'card',
      'navbar',
      'footer',
      'breadcrumb',
      'banner',
    ]),
    accent: z.string().min(1),
    emoji: z.string().min(1),
    github: z.string().optional(),
    sortOrder: z.number().optional(),
    published: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

export const OpenSourceRoutes = createCrudRouter({
  resourceName: 'OpenSource',
  services: OpenSourceServices,
  createSchema,
  updateSchema,
});
