/**
 * Analytics Component
 * 
 * Container for all analytics visualizations:
 * - Monthly line chart (daily percentages)
 * - Yearly bar chart (monthly averages)
 */

import { MonthlyChart } from './MonthlyChart';
import { YearlyChart } from './YearlyChart';

export const Analytics = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h2>
      
      <div className="space-y-6">
        <MonthlyChart />
        <YearlyChart />
      </div>
    </div>
  );
};
