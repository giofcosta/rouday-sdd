// Re-export database types
export * from './database';

import type { Routine, WeeklyData } from './database';

// Days of the week type
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

// Derived types for client-side use
export interface RoutineWithWeeklyData extends Routine {
  weekly_data: WeeklyData | null;
  // Calculated fields
  apw: number; // AP × WD (Week Target)
  wr: number; // Sum of DOW values (Week Results)
}

export interface DashboardStats {
  totalAP: number; // Sum of all daily averages
  totalAPW: number; // Sum of all week targets
  totalWR: number; // Sum of all week results
  offHoursDaily: number; // 24 - WHD
  availableWorkHoursWeek: number; // WHD × WD
  hoursLeft: number; // SUM(AP) - SUM(APW)
  medianWorkPerDay: number; // SUM(APW) / AD
}

// Input types for API operations
export interface CreateRoutineInput {
  name: string;
  daily_average: number;
  comments?: string | null;
}

export interface UpdateRoutineInput {
  name?: string;
  daily_average?: number;
  comments?: string | null;
}

export interface UpdateDayPointsInput {
  day: DayOfWeek;
  value: number;
}

export interface IncrementDecrementInput {
  day: DayOfWeek;
}

export interface UpdateSettingsInput {
  available_days?: number;
  work_days?: number;
  work_hours_day?: number;
  timezone?: string;
}

// Contact form input
export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// User type from Supabase Auth
export interface User {
  id: string;
  email: string;
  created_at: string;
}
