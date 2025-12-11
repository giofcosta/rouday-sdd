import { z } from 'zod';

// Settings schema with cross-field validation
export const settingsSchema = z
  .object({
    available_days: z
      .number()
      .int('Available days must be a whole number')
      .min(1, 'Available days must be at least 1')
      .max(7, 'Available days cannot exceed 7'),
    work_days: z
      .number()
      .int('Work days must be a whole number')
      .min(1, 'Work days must be at least 1')
      .max(7, 'Work days cannot exceed 7'),
    work_hours_day: z
      .number()
      .int('Work hours must be a whole number')
      .min(1, 'Work hours must be at least 1')
      .max(24, 'Work hours cannot exceed 24'),
    timezone: z.string().min(1, 'Timezone is required'),
  })
  .refine((data) => data.work_days <= data.available_days, {
    message: 'Work days cannot exceed available days',
    path: ['work_days'],
  });

// Partial settings schema for updates
export const updateSettingsSchema = z
  .object({
    available_days: z
      .number()
      .int('Available days must be a whole number')
      .min(1, 'Available days must be at least 1')
      .max(7, 'Available days cannot exceed 7')
      .optional(),
    work_days: z
      .number()
      .int('Work days must be a whole number')
      .min(1, 'Work days must be at least 1')
      .max(7, 'Work days cannot exceed 7')
      .optional(),
    work_hours_day: z
      .number()
      .int('Work hours must be a whole number')
      .min(1, 'Work hours must be at least 1')
      .max(24, 'Work hours cannot exceed 24')
      .optional(),
    timezone: z.string().min(1, 'Timezone is required').optional(),
  })
  .refine(
    (data) => {
      // Only validate if both are provided
      if (data.work_days !== undefined && data.available_days !== undefined) {
        return data.work_days <= data.available_days;
      }
      return true;
    },
    {
      message: 'Work days cannot exceed available days',
      path: ['work_days'],
    }
  );

// Type exports
export type SettingsInput = z.infer<typeof settingsSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
