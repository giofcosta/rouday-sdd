import { z } from 'zod';

// Contact form schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim(),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be 2000 characters or less')
    .trim(),
});

// Type export
export type ContactFormInput = z.infer<typeof contactFormSchema>;
