/**
 * Utility functions for date manipulation
 * Uses local timezone consistently to avoid timezone bugs
 * All dates stored in YYYY-MM-DD format
 */

import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';

/**
 * Generate a UUID v4 string (works in all browsers)
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for browsers that don't support crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Convert Date object to YYYY-MM-DD string
 */
export const formatDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parse YYYY-MM-DD string to Date object
 */
export const parseDateString = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00');
};

/**
 * Get all days in a specific month
 * @returns Array of YYYY-MM-DD strings
 */
export const getDaysInMonth = (year: number, month: number): string[] => {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return eachDayOfInterval({ start, end }).map(formatDateString);
};

/**
 * Get all months in a specific year
 * @returns Array of month numbers (1-12)
 */
export const getMonthsInYear = (year: number): number[] => {
  const start = startOfYear(new Date(year, 0));
  const end = endOfYear(new Date(year, 0));
  return eachMonthOfInterval({ start, end }).map(date => date.getMonth() + 1);
};

/**
 * Get current month and year
 */
export const getCurrentMonthYear = (): { month: number; year: number } => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
};

/**
 * Get current year
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Format date for display (e.g., "February 8, 2026")
 */
export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

/**
 * Get day of month number (1-31)
 */
export const getDayOfMonth = (dateStr: string): number => {
  return parseDateString(dateStr).getDate();
};

/**
 * Get month name from number (1-12)
 */
export const getMonthName = (month: number): string => {
  return format(new Date(2000, month - 1), 'MMMM');
};
