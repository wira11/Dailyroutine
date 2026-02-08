/**
 * DailyResetService - Handles bulletproof daily reset logic
 * 
 * CRITICAL REQUIREMENTS:
 * - Never wipe historical data
 * - Handle timezone changes gracefully
 * - Handle app not opened for multiple days
 * - Handle browser refresh without issues
 * - Deterministic behavior (no race conditions)
 * 
 * Reset logic:
 * 1. Check if today !== lastActiveDate
 * 2. If different, ensure today's completions are initialized as unchecked
 * 3. Update lastActiveDate to today
 * 4. Preserve all historical completion data
 */

import { storageService } from './storageService';
import { getTodayString } from '@/utils/dateUtils';

export class DailyResetService {
  /**
   * Check if a reset is needed and perform it
   * Should be called on every app load
   * Returns true if reset was performed
   */
  checkAndPerformReset(): boolean {
    const today = getTodayString();
    const appState = storageService.getAppState();

    // First time initialization
    if (!appState.initialized) {
      storageService.updateLastActiveDate(today);
      return true;
    }

    // Check if date has changed
    if (appState.lastActiveDate !== today) {
      this.performReset(today);
      return true;
    }

    return false;
  }

  /**
   * Perform the daily reset
   * - Update lastActiveDate to today
   * - Ensure today's habits are initialized (defaults to unchecked)
   * - NEVER delete historical data
   */
  private performReset(today: string): void {
    // Update app state with new date
    storageService.updateLastActiveDate(today);

    // Initialize today's completions if not already present
    // This ensures habits default to unchecked
    const habits = storageService.getHabits();
    const activeHabits = habits.filter(h => h.active);
    const todayCompletions = storageService.getCompletionsByDate(today);

    // For each active habit, ensure there's a completion record for today
    activeHabits.forEach(habit => {
      const hasRecord = todayCompletions.some(c => c.habitId === habit.id);
      if (!hasRecord) {
        // Initialize as unchecked (false)
        storageService.setCompletion(habit.id, today, false);
      }
    });
  }

  /**
   * Get days since last active
   * Useful for showing "You've been away for X days" message
   */
  getDaysSinceLastActive(): number {
    const today = getTodayString();
    const appState = storageService.getAppState();

    if (!appState.initialized || !appState.lastActiveDate) {
      return 0;
    }

    const lastDate = new Date(appState.lastActiveDate);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  /**
   * Force initialize today
   * Useful for manual reset or testing
   */
  forceInitializeToday(): void {
    const today = getTodayString();
    this.performReset(today);
  }
}

// Export singleton instance
export const dailyResetService = new DailyResetService();
