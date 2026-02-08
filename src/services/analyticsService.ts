/**
 * AnalyticsService - Core business logic for habit analytics
 * 
 * CRITICAL REQUIREMENTS:
 * - Deterministic calculations (same input = same output)
 * - Handle empty data gracefully
 * - Never show misleading statistics
 * - All percentages rounded to 2 decimal places
 * 
 * Calculation formulas:
 * - Daily %: (completed habits / total active habits) * 100
 * - Monthly %: Average of all daily % in that month
 * - Yearly %: Average of all monthly % in that year
 */

import { Habit, CompletionRecord, AnalyticsData, ChartDataPoint } from '@/types';
import { getDaysInMonth, getMonthsInYear, getDayOfMonth, getMonthName } from '@/utils/dateUtils';

export class AnalyticsService {
  /**
   * Calculate completion percentage for a specific day
   * Returns 0 if no active habits
   */
  calculateDailyCompletion(
    habits: Habit[],
    completions: CompletionRecord[],
    date: string
  ): AnalyticsData {
    // Only count active habits
    const activeHabits = habits.filter(h => h.active);
    const totalCount = activeHabits.length;

    if (totalCount === 0) {
      return {
        completionPercentage: 0,
        completedCount: 0,
        totalCount: 0,
        date,
      };
    }

    // Count completed habits for this date
    const dayCompletions = completions.filter(c => c.date === date);
    const completedCount = activeHabits.filter(habit => {
      const completion = dayCompletions.find(c => c.habitId === habit.id);
      return completion?.completed === true;
    }).length;

    const completionPercentage = Math.round((completedCount / totalCount) * 100 * 100) / 100;

    return {
      completionPercentage,
      completedCount,
      totalCount,
      date,
    };
  }

  /**
   * Calculate monthly completion percentage
   * Average of all daily completion percentages in the month
   * Only includes days that have been lived (not future days)
   */
  calculateMonthlyCompletion(
    habits: Habit[],
    completions: CompletionRecord[],
    year: number,
    month: number,
    todayString: string
  ): AnalyticsData {
    const daysInMonth = getDaysInMonth(year, month);
    
    // Only include days up to today
    const validDays = daysInMonth.filter(day => day <= todayString);

    if (validDays.length === 0) {
      return {
        completionPercentage: 0,
        completedCount: 0,
        totalCount: validDays.length,
        month,
        year,
      };
    }

    // Calculate daily completion for each valid day
    const dailyPercentages = validDays.map(day =>
      this.calculateDailyCompletion(habits, completions, day).completionPercentage
    );

    // Average of all daily percentages
    const sum = dailyPercentages.reduce((acc, val) => acc + val, 0);
    const averagePercentage = Math.round((sum / dailyPercentages.length) * 100) / 100;

    return {
      completionPercentage: averagePercentage,
      completedCount: Math.round(averagePercentage), // Approximation
      totalCount: validDays.length,
      month,
      year,
    };
  }

  /**
   * Calculate yearly completion percentage
   * Average of all monthly completion percentages in the year
   * Only includes months that have been lived (not future months)
   */
  calculateYearlyCompletion(
    habits: Habit[],
    completions: CompletionRecord[],
    year: number,
    todayString: string
  ): AnalyticsData {
    const todayDate = new Date(todayString);
    const currentYear = todayDate.getFullYear();
    const currentMonth = todayDate.getMonth() + 1;

    const monthsInYear = getMonthsInYear(year);
    
    // Only include months up to current month if this is current year
    const validMonths = year === currentYear
      ? monthsInYear.filter(m => m <= currentMonth)
      : monthsInYear;

    if (validMonths.length === 0) {
      return {
        completionPercentage: 0,
        completedCount: 0,
        totalCount: 0,
        year,
      };
    }

    // Calculate monthly completion for each valid month
    const monthlyPercentages = validMonths.map(month =>
      this.calculateMonthlyCompletion(habits, completions, year, month, todayString).completionPercentage
    );

    // Average of all monthly percentages
    const sum = monthlyPercentages.reduce((acc, val) => acc + val, 0);
    const averagePercentage = Math.round((sum / monthlyPercentages.length) * 100) / 100;

    return {
      completionPercentage: averagePercentage,
      completedCount: Math.round(averagePercentage), // Approximation
      totalCount: validMonths.length,
      year,
    };
  }

  /**
   * Generate chart data for monthly view (daily percentages)
   */
  generateMonthlyChartData(
    habits: Habit[],
    completions: CompletionRecord[],
    year: number,
    month: number,
    todayString: string
  ): ChartDataPoint[] {
    const daysInMonth = getDaysInMonth(year, month);
    
    return daysInMonth.map(day => {
      const dayNum = getDayOfMonth(day);
      const isFuture = day > todayString;
      
      const analytics = isFuture
        ? { completionPercentage: 0, completedCount: 0, totalCount: 0 }
        : this.calculateDailyCompletion(habits, completions, day);

      return {
        label: dayNum.toString(),
        value: analytics.completionPercentage,
        date: day,
      };
    });
  }

  /**
   * Generate chart data for yearly view (monthly percentages)
   */
  generateYearlyChartData(
    habits: Habit[],
    completions: CompletionRecord[],
    year: number,
    todayString: string
  ): ChartDataPoint[] {
    const months = getMonthsInYear(year);
    
    return months.map(month => {
      const analytics = this.calculateMonthlyCompletion(habits, completions, year, month, todayString);
      
      return {
        label: getMonthName(month).slice(0, 3), // Short month name
        value: analytics.completionPercentage,
      };
    });
  }

  /**
   * Get habit streak (consecutive days completed)
   * Counts backwards from today
   */
  getHabitStreak(habitId: string, completions: CompletionRecord[], todayString: string): number {
    let streak = 0;
    let currentDate = new Date(todayString);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const completion = completions.find(c => c.habitId === habitId && c.date === dateStr);
      
      if (!completion || !completion.completed) {
        break;
      }
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
