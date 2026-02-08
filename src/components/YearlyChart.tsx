/**
 * YearlyChart Component
 * 
 * Bar chart showing monthly completion percentages for a year
 * X-axis: Months (Jan-Dec)
 * Y-axis: Average completion percentage (0-100)
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHabitStore } from '@/store/habitStore';
import { analyticsService } from '@/services/analyticsService';
import { getCurrentYear, getTodayString } from '@/utils/dateUtils';

export const YearlyChart = () => {
  const { habits, completions } = useHabitStore();
  const year = getCurrentYear();
  const today = getTodayString();

  const chartData = useMemo(
    () => analyticsService.generateYearlyChartData(habits, completions, year, today),
    [habits, completions, year, today]
  );

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {year} - Monthly Averages
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Avg Completion']}
          />
          <Bar
            dataKey="value"
            fill="#0ea5e9"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
