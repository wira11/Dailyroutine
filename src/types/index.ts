/**
 * Core data models for the habit tracking application
 * Designed for analytics-first architecture
 */

/**
 * Habit represents a trackable behavior/routine
 * V1: Only boolean habits (done/not done)
 */
export interface Habit {
  id: string;
  name: string;
  active: boolean;
  createdAt: string; // ISO 8601 format
  time?: string; // Optional time (HH:mm format, e.g., "07:00")
  order: number; // For drag and drop ordering
  daysOfWeek: number[]; // Days habit is active (0=Sunday, 1=Monday, ..., 6=Saturday). Empty array = all days
  isOneTime: boolean; // If true, auto-archives after first completion
  specificDates: string[]; // Specific dates in YYYY-MM-DD format. If not empty, only shows on these dates
}

/**
 * CompletionRecord tracks daily completion status
 * One record per habit per day
 * Date stored in YYYY-MM-DD format for consistent analytics
 */
export interface CompletionRecord {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

/**
 * AppState tracks application-level metadata
 * Critical for daily reset logic
 */
export interface AppState {
  lastActiveDate: string; // YYYY-MM-DD format
  initialized: boolean;
}

/**
 * Analytics result for a specific time period
 */
export interface AnalyticsData {
  completionPercentage: number;
  completedCount: number;
  totalCount: number;
  date?: string; // For daily analytics
  month?: number; // For monthly analytics (1-12)
  year?: number; // For yearly analytics
}

/**
 * Chart data point for visualizations
 */
export interface ChartDataPoint {
  label: string; // e.g., "Jan 1", "January", "2026"
  value: number; // Completion percentage
  date?: string; // YYYY-MM-DD for daily charts
}

/**
 * Storage keys enum for type-safe localStorage access
 */
export enum StorageKey {
  HABITS = 'habits',
  COMPLETIONS = 'completions',
  APP_STATE = 'appState',
}
