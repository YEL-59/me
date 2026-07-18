import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { createCrudServices } from '../../utils/createCrudServices';
import { createCrudRouter } from '../../utils/createCrudRouter';

export type TFileItem = {
  name: string;
  type: 'doc' | 'folder' | 'pdf' | 'ats';
  href: string;
  downloadUrl?: string;
  description?: string;
  sortOrder?: number;
  published?: boolean;
  isDeleted?: boolean;
};

const fileItemSchema = new Schema<TFileItem>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['doc', 'folder', 'pdf', 'ats'],
      required: true,
    },
    href: { type: String, required: true },
    downloadUrl: { type: String },
    description: { type: String },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const FileItem = model<TFileItem>('FileItem', fileItemSchema);
export const FileItemServices = createCrudServices(FileItem, 'FileItem');

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.enum(['doc', 'folder', 'pdf', 'ats']),
    href: z.string().min(1),
    downloadUrl: z.string().optional(),
    description: z.string().optional(),
    sortOrder: z.number().optional(),
    published: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

export const FileItemRoutes = createCrudRouter({
  resourceName: 'FileItem',
  services: FileItemServices,
  createSchema,
  updateSchema,
});
