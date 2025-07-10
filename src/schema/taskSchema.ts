import { z } from 'zod';

export const taskSchema = z.object({
  name: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F]+$/, 'Solo letras, números y espacios'),
  description: z.string().max(200, 'Máximo 200 caracteres').optional(),
  status: z.enum(['pending', 'inProgress', 'complete']),
});

export type TaskFormData = z.infer<typeof taskSchema>;
