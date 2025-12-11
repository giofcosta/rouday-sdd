import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Get the start of the week (Monday) for a given date
 * Returns date in ISO format (YYYY-MM-DD)
 */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  // Adjust to Monday (day 0 = Sunday, so we need to handle it)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

/**
 * Check if a date is in a new week compared to another date
 */
export function isNewWeek(currentDate: Date, previousWeekStart: string): boolean {
  const currentWeekStart = getWeekStart(currentDate);
  return currentWeekStart !== previousWeekStart;
}

/**
 * Get the day name from a date
 */
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
}

/**
 * Calculate the sum of daily values in weekly data
 */
export function calculateWeekResults(weeklyData: {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}): number {
  return (
    weeklyData.monday +
    weeklyData.tuesday +
    weeklyData.wednesday +
    weeklyData.thursday +
    weeklyData.friday +
    weeklyData.saturday +
    weeklyData.sunday
  );
}

/**
 * Calculate APW (Available Points per Week)
 */
export function calculateAPW(dailyAverage: number, workDays: number): number {
  return dailyAverage * workDays;
}

/**
 * Delay helper for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
