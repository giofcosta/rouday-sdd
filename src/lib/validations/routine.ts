import { z } from 'zod';

// Create routine schema
export const createRoutineSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim(),
  daily_average: z
    .number()
    .int('Daily average must be a whole number')
    .positive('Daily average must be greater than 0'),
  comments: z.string().max(1000, 'Comments must be 1000 characters or less').nullable().optional(),
});

// Update routine schema (all fields optional)
export const updateRoutineSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim()
    .optional(),
  daily_average: z
    .number()
    .int('Daily average must be a whole number')
    .positive('Daily average must be greater than 0')
    .optional(),
  comments: z.string().max(1000, 'Comments must be 1000 characters or less').nullable().optional(),
});

// Type exports
export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
