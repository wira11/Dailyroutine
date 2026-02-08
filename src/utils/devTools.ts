/**
 * Utility functions for development and testing
 */

import { storageService } from '@/services/storageService';

/**
 * Clear all app data
 * Useful for resetting during development
 */
export const clearAllData = () => {
  storageService.clearAll();
  console.log('✅ All data cleared');
};

/**
 * Export current data to JSON
 * Returns a downloadable JSON string
 */
export const exportDataToJSON = (): string => {
  return storageService.exportData();
};

/**
 * Download data as a JSON file
 */
export const downloadData = () => {
  const data = exportDataToJSON();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  console.log('✅ Data downloaded');
};

/**
 * Import data from JSON string
 */
export const importDataFromJSON = (jsonString: string): boolean => {
  const success = storageService.importData(jsonString);
  if (success) {
    console.log('✅ Data imported successfully');
  } else {
    console.log('❌ Data import failed');
  }
  return success;
};

/**
 * Get storage usage info
 */
export const getStorageInfo = () => {
  const habits = storageService.getHabits();
  const completions = storageService.getCompletions();
  const appState = storageService.getAppState();

  const info = {
    habits: {
      count: habits.length,
      active: habits.filter(h => h.active).length,
      inactive: habits.filter(h => !h.active).length,
      size: new Blob([JSON.stringify(habits)]).size,
    },
    completions: {
      count: completions.length,
      size: new Blob([JSON.stringify(completions)]).size,
    },
    appState: {
      initialized: appState.initialized,
      lastActiveDate: appState.lastActiveDate,
      size: new Blob([JSON.stringify(appState)]).size,
    },
    total: {
      size: new Blob([
        JSON.stringify(habits),
        JSON.stringify(completions),
        JSON.stringify(appState),
      ]).size,
    },
  };

  console.table(info);
  return info;
};

// Expose to window for console access in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).devTools = {
    clearAllData,
    exportData: exportDataToJSON,
    downloadData,
    importData: importDataFromJSON,
    getStorageInfo,
  };
  console.log('🛠 Dev tools available: window.devTools');
}
