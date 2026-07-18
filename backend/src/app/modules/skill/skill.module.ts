import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { createCrudServices } from '../../utils/createCrudServices';
import { createCrudRouter } from '../../utils/createCrudRouter';

export type TSkill = {
  label: string;
  color: string;
  sortOrder?: number;
  published?: boolean;
  isDeleted?: boolean;
};

const skillSchema = new Schema<TSkill>(
  {
    label: { type: String, required: true, trim: true },
    color: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Skill = model<TSkill>('Skill', skillSchema);
export const SkillServices = createCrudServices(Skill, 'Skill');

const createSchema = z.object({
  body: z.object({
    label: z.string().min(1),
    color: z.string().min(1),
    sortOrder: z.number().optional(),
    published: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

export const SkillRoutes = createCrudRouter({
  resourceName: 'Skill',
  services: SkillServices,
  createSchema,
  updateSchema,
});
