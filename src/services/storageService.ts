/**
 * StorageService - Abstraction layer for data persistence
 * V1: Uses localStorage
 * V2: Can be swapped with IndexedDB or backend API
 * 
 * Design principles:
 * - Type-safe operations
 * - Error handling for quota exceeded
 * - Never throw, always return defaults
 * - Abstracted for future migration
 */

import { Habit, CompletionRecord, AppState, StorageKey } from '@/types';

class StorageService {
  /**
   * Generic get method with type safety
   */
  private get<T>(key: StorageKey, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return defaultValue;
    }
  }

  /**
   * Generic set method with error handling
   */
  private set<T>(key: StorageKey, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
      // Handle quota exceeded or other errors
      return false;
    }
  }

  // ========== HABITS ==========

  /**
   * Get all habits
   */
  getHabits(): Habit[] {
    const habits = this.get<Habit[]>(StorageKey.HABITS, []);
    // Migrate old habits to have daysOfWeek, isOneTime, and specificDates fields
    return habits.map(h => ({
      ...h,
      daysOfWeek: h.daysOfWeek || [],
      isOneTime: h.isOneTime || false,
      specificDates: h.specificDates || [],
    }));
  }

  /**
   * Save all habits
   */
  saveHabits(habits: Habit[]): boolean {
    return this.set(StorageKey.HABITS, habits);
  }

  /**
   * Add a new habit
   */
  addHabit(habit: Habit): boolean {
    const habits = this.getHabits();
    habits.push(habit);
    return this.saveHabits(habits);
  }

  /**
   * Update an existing habit
   */
  updateHabit(habitId: string, updates: Partial<Habit>): boolean {
    const habits = this.getHabits();
    const index = habits.findIndex(h => h.id === habitId);
    if (index === -1) return false;
    
    habits[index] = { ...habits[index], ...updates };
    return this.saveHabits(habits);
  }

  /**
   * Delete a habit (soft delete - mark as inactive)
   */
  deleteHabit(habitId: string): boolean {
    return this.updateHabit(habitId, { active: false });
  }

  // ========== COMPLETIONS ==========

  /**
   * Get all completion records
   */
  getCompletions(): CompletionRecord[] {
    return this.get<CompletionRecord[]>(StorageKey.COMPLETIONS, []);
  }

  /**
   * Save all completion records
   */
  saveCompletions(completions: CompletionRecord[]): boolean {
    return this.set(StorageKey.COMPLETIONS, completions);
  }

  /**
   * Get completion for specific habit on specific date
   */
  getCompletion(habitId: string, date: string): CompletionRecord | undefined {
    const completions = this.getCompletions();
    return completions.find(c => c.habitId === habitId && c.date === date);
  }

  /**
   * Set completion status for a habit on a specific date
   * Upserts: creates if doesn't exist, updates if exists
   */
  setCompletion(habitId: string, date: string, completed: boolean): boolean {
    const completions = this.getCompletions();
    const existingIndex = completions.findIndex(
      c => c.habitId === habitId && c.date === date
    );

    if (existingIndex >= 0) {
      completions[existingIndex].completed = completed;
    } else {
      completions.push({ habitId, date, completed });
    }

    return this.saveCompletions(completions);
  }

  /**
   * Get all completions for a specific date
   */
  getCompletionsByDate(date: string): CompletionRecord[] {
    const completions = this.getCompletions();
    return completions.filter(c => c.date === date);
  }

  /**
   * Get all completions for a specific habit
   */
  getCompletionsByHabit(habitId: string): CompletionRecord[] {
    const completions = this.getCompletions();
    return completions.filter(c => c.habitId === habitId);
  }

  // ========== APP STATE ==========

  /**
   * Get app state (for daily reset logic)
   */
  getAppState(): AppState {
    return this.get<AppState>(StorageKey.APP_STATE, {
      lastActiveDate: '',
      initialized: false,
    });
  }

  /**
   * Save app state
   */
  saveAppState(state: AppState): boolean {
    return this.set(StorageKey.APP_STATE, state);
  }

  /**
   * Update last active date (called on every app load)
   */
  updateLastActiveDate(date: string): boolean {
    const state = this.getAppState();
    return this.saveAppState({
      ...state,
      lastActiveDate: date,
      initialized: true,
    });
  }

  // ========== UTILITY ==========

  /**
   * Clear all data (for testing or reset)
   */
  clearAll(): void {
    localStorage.removeItem(StorageKey.HABITS);
    localStorage.removeItem(StorageKey.COMPLETIONS);
    localStorage.removeItem(StorageKey.APP_STATE);
  }

  /**
   * Export all data (for backup or migration)
   */
  exportData(): string {
    return JSON.stringify({
      habits: this.getHabits(),
      completions: this.getCompletions(),
      appState: this.getAppState(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Import data (for restore or migration)
   */
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      this.saveHabits(data.habits || []);
      this.saveCompletions(data.completions || []);
      this.saveAppState(data.appState || { lastActiveDate: '', initialized: false });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
