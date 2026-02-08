/**
 * Global state management using Zustand
 * 
 * Zustand chosen for:
 * - Simpler than Redux
 * - Better TypeScript support than Context
 * - No Provider wrapper needed
 * - Easy to scale
 * 
 * State includes:
 * - Habits list
 * - Completions map
 * - Loading states
 * - Actions for CRUD operations
 */

import { create } from 'zustand';
import { Habit, CompletionRecord } from '@/types';
import { storageService } from '@/services/storageService';
import { dailyResetService } from '@/services/dailyResetService';
import { getTodayString, generateUUID } from '@/utils/dateUtils';

interface HabitStore {
  // State
  habits: Habit[];
  completions: CompletionRecord[];
  isLoading: boolean;
  lastResetCheck: string;

  // Actions - Habits
  loadData: () => void;
  addHabit: (name: string, time?: string, daysOfWeek?: number[], isOneTime?: boolean, specificDates?: string[]) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  reorderHabits: (habits: Habit[]) => void;

  // Actions - Completions
  toggleCompletion: (habitId: string, date: string) => void;
  setCompletion: (habitId: string, date: string, completed: boolean) => void;

  // Actions - Utility
  checkDailyReset: () => void;
  refreshData: () => void;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  // Initial state
  habits: [],
  completions: [],
  isLoading: true,
  lastResetCheck: '',

  // Load all data from storage
  loadData: () => {
    set({ isLoading: true });
    
    // Perform daily reset check
    dailyResetService.checkAndPerformReset();
    
    // Load data
    const habits = storageService.getHabits();
    const completions = storageService.getCompletions();
    
    set({
      habits,
      completions,
      isLoading: false,
      lastResetCheck: getTodayString(),
    });
  },

  // Add a new habit
  addHabit: (name: string, time?: string, daysOfWeek: number[] = [], isOneTime: boolean = false, specificDates: string[] = []) => {
    const habits = get().habits;
    const maxOrder = habits.reduce((max, h) => Math.max(max, h.order || 0), 0);
    
    const newHabit: Habit = {
      id: generateUUID(),
      name: name.trim(),
      active: true,
      createdAt: new Date().toISOString(),
      time: time,
      order: maxOrder + 1,
      daysOfWeek,
      isOneTime,
      specificDates,
    };

    storageService.addHabit(newHabit);
    
    // Initialize today's completion as unchecked
    const today = getTodayString();
    storageService.setCompletion(newHabit.id, today, false);
    
    // Update state
    set(state => ({
      habits: [...state.habits, newHabit],
      completions: [
        ...state.completions,
        { habitId: newHabit.id, date: today, completed: false },
      ],
    }));
  },

  // Update habit
  updateHabit: (id: string, updates: Partial<Habit>) => {
    storageService.updateHabit(id, updates);
    
    set(state => ({
      habits: state.habits.map(h =>
        h.id === id ? { ...h, ...updates } : h
      ),
    }));
  },

  // Delete habit (soft delete - mark inactive)
  deleteHabit: (id: string) => {
    get().updateHabit(id, { active: false });
  },

  // Toggle completion status
  toggleCompletion: (habitId: string, date: string) => {
    const { completions, habits } = get();
    const current = completions.find(c => c.habitId === habitId && c.date === date);
    const newStatus = !current?.completed;
    
    get().setCompletion(habitId, date, newStatus);
    
    // If this is a one-time task and it's being marked as completed, auto-archive it
    if (newStatus) {
      const habit = habits.find(h => h.id === habitId);
      if (habit?.isOneTime) {
        get().updateHabit(habitId, { active: false });
      }
    }
  },

  // Set completion status
  setCompletion: (habitId: string, date: string, completed: boolean) => {
    storageService.setCompletion(habitId, date, completed);
    
    set(state => {
      const existingIndex = state.completions.findIndex(
        c => c.habitId === habitId && c.date === date
      );

      let newCompletions: CompletionRecord[];
      
      if (existingIndex >= 0) {
        // Update existing
        newCompletions = [...state.completions];
        newCompletions[existingIndex] = { habitId, date, completed };
      } else {
        // Add new
        newCompletions = [...state.completions, { habitId, date, completed }];
      }

      return { completions: newCompletions };
    });
  },

  // Check if daily reset is needed
  checkDailyReset: () => {
    const today = getTodayString();
    const { lastResetCheck } = get();
    
    if (lastResetCheck !== today) {
      const resetPerformed = dailyResetService.checkAndPerformReset();
      if (resetPerformed) {
        get().refreshData();
      }
    }
  },

  // Refresh data from storage
  refreshData: () => {
    const habits = storageService.getHabits();
    const completions = storageService.getCompletions();
    
    set({
      habits,
      completions,
      lastResetCheck: getTodayString(),
    });
  },
  // Reorder habits
  reorderHabits: (habits: Habit[]) => {
    storageService.saveHabits(habits);
    set({ habits });
  },}));
