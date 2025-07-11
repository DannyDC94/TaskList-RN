import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F]+$/, 'Solo letras, números y espacios'),
  description: z.string().max(200, 'Máximo 200 caracteres').optional(),
  status: z.enum(['pending', 'inProgress', 'complete']),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F]+$/, 'Solo letras, números y espacios')
    .optional(),
  description: z.string().max(200, 'Máximo 200 caracteres').optional(),
  status: z.enum(['pending', 'inProgress', 'complete']).optional(),
});

export type TaskFormUpdate = z.infer<typeof taskUpdateSchema>;

// Schema for Api

export const firestoreTimestampSchema = z.object({
  _seconds: z.number().int().nonnegative(),
  _nanoseconds: z.number().int().min(0).max(999_999_999),
});

export const taskSchemaApiResponse = z.object({
  id: z.string(),
  title: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F]+$/, 'Solo letras, números y espacios'),
  description: z.string().max(200, 'Máximo 200 caracteres').optional(),
  status: z.enum(['pending', 'inProgress', 'complete']),
  createdAt: firestoreTimestampSchema,
});

export type TaskApiResponse = z.infer<typeof taskSchemaApiResponse>;
