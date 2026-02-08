/**
 * Main App Component
 * 
 * Features:
 * - Tab-based navigation (Today / Analytics / Manage)
 * - Daily reset check on mount and focus
 * - Responsive layout
 * - Clean, minimal UI
 */

import { useEffect, useState } from 'react';
import { useHabitStore } from '@/store/habitStore';
import { DailyChecklist } from '@/components/DailyChecklist';
import { Analytics } from '@/components/Analytics';
import { HabitManager } from '@/components/HabitManager';

// Load dev tools in development mode
if (import.meta.env.DEV) {
  import('@/utils/devTools');
}

type Tab = 'today' | 'analytics' | 'manage';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const { loadData, checkDailyReset, isLoading } = useHabitStore();

  // Initialize app
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check for daily reset when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      checkDailyReset();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkDailyReset]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-purple-600 shadow-lg sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Wira Daily Routine</h1>
                <p className="text-sm text-white/80">Track your habits, transform your life</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-white/90">
              <div className="text-center">
                <div className="text-2xl font-bold">{new Date().getDate()}</div>
                <div className="text-xs uppercase">{new Date().toLocaleDateString('en-US', { month: 'short' })}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-[92px] z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('today')}
              className={`py-4 px-6 font-medium text-sm transition-all duration-200 relative group ${
                activeTab === 'today'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Today
              </div>
              {activeTab === 'today' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 font-medium text-sm transition-all duration-200 relative group ${
                activeTab === 'analytics'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </div>
              {activeTab === 'analytics' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-4 px-6 font-medium text-sm transition-all duration-200 relative group ${
                activeTab === 'manage'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage
              </div>
              {activeTab === 'manage' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-t-full" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8">
        {activeTab === 'today' && <DailyChecklist />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'manage' && <HabitManager />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Daily Routine Tracker. All rights reserved.</p>
          <p className="mt-1 text-gray-400 text-sm">Built for clarity and self-awareness 🌟</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
