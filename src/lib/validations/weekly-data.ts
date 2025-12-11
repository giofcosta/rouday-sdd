import { z } from 'zod';

// Days of the week enum
export const dayOfWeekSchema = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);

// Update day points schema
export const updateDayPointsSchema = z.object({
  day: dayOfWeekSchema,
  value: z.number().int('Value must be a whole number').min(0, 'Value cannot be negative'),
});

// Increment/Decrement schema
export const incrementDecrementSchema = z.object({
  day: dayOfWeekSchema,
});

// Weekly data schema (for validation)
export const weeklyDataSchema = z.object({
  routine_id: z.string().uuid('Invalid routine ID'),
  week_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  monday: z.number().int().min(0).default(0),
  tuesday: z.number().int().min(0).default(0),
  wednesday: z.number().int().min(0).default(0),
  thursday: z.number().int().min(0).default(0),
  friday: z.number().int().min(0).default(0),
  saturday: z.number().int().min(0).default(0),
  sunday: z.number().int().min(0).default(0),
});

// Type exports
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>;
export type UpdateDayPointsInput = z.infer<typeof updateDayPointsSchema>;
export type IncrementDecrementInput = z.infer<typeof incrementDecrementSchema>;
export type WeeklyDataInput = z.infer<typeof weeklyDataSchema>;
