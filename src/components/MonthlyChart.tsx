/**
 * MonthlyChart Component
 * 
 * Line chart showing daily completion percentages for a month
 * X-axis: Days of month (1-31)
 * Y-axis: Completion percentage (0-100)
 */

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHabitStore } from '@/store/habitStore';
import { analyticsService } from '@/services/analyticsService';
import { getCurrentMonthYear, getTodayString, getMonthName } from '@/utils/dateUtils';

export const MonthlyChart = () => {
  const { habits, completions } = useHabitStore();
  const { month, year } = getCurrentMonthYear();
  const today = getTodayString();

  const chartData = useMemo(
    () => analyticsService.generateMonthlyChartData(habits, completions, year, month, today),
    [habits, completions, year, month, today]
  );

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {getMonthName(month)} {year} - Daily Progress
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Completion']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
