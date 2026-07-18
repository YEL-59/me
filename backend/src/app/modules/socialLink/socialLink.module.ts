import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { createCrudServices } from '../../utils/createCrudServices';
import { createCrudRouter } from '../../utils/createCrudRouter';

export type TSocialLink = {
  label: string;
  href: string;
  platform?: string;
  placement: 'footer' | 'about' | 'vault' | 'ats' | 'resume' | 'header';
  sortOrder?: number;
  published?: boolean;
  isDeleted?: boolean;
};

const socialLinkSchema = new Schema<TSocialLink>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    platform: { type: String },
    placement: {
      type: String,
      enum: ['footer', 'about', 'vault', 'ats', 'resume', 'header'],
      required: true,
    },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const SocialLink = model<TSocialLink>('SocialLink', socialLinkSchema);
export const SocialLinkServices = createCrudServices(SocialLink, 'SocialLink');

const createSchema = z.object({
  body: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
    platform: z.string().optional(),
    placement: z.enum([
      'footer',
      'about',
      'vault',
      'ats',
      'resume',
      'header',
    ]),
    sortOrder: z.number().optional(),
    published: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

export const SocialLinkRoutes = createCrudRouter({
  resourceName: 'SocialLink',
  services: SocialLinkServices,
  createSchema,
  updateSchema,
});
