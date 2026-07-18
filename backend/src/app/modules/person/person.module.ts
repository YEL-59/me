import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { createCrudServices } from '../../utils/createCrudServices';
import { createCrudRouter } from '../../utils/createCrudRouter';

export type TPerson = {
  name: string;
  relation: string;
  imageUrl: string;
  bioParagraphs: string[];
  focusTags: string[];
  links: { label: string; href: string }[];
  sortOrder?: number;
  published?: boolean;
  isDeleted?: boolean;
};

const personSchema = new Schema<TPerson>(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    imageUrl: { type: String, required: true },
    bioParagraphs: { type: [String], default: [] },
    focusTags: { type: [String], default: [] },
    links: {
      type: [{ label: String, href: String }],
      default: [],
    },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Person = model<TPerson>('Person', personSchema);
export const PersonServices = createCrudServices(Person, 'Person');

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    relation: z.string().min(1),
    imageUrl: z.string().min(1),
    bioParagraphs: z.array(z.string()).default([]),
    focusTags: z.array(z.string()).default([]),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    sortOrder: z.number().optional(),
    published: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

export const PersonRoutes = createCrudRouter({
  resourceName: 'Person',
  services: PersonServices,
  createSchema,
  updateSchema,
});
