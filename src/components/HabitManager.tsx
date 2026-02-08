/**
 * HabitManager Component
 * 
 * Allows users to:
 * - View all habits (active and inactive)
 * - Add new habits with time
 * - Edit habit names and times
 * - Delete habits (soft delete - marks inactive)
 */

import { useState } from 'react';
import { useHabitStore } from '@/store/habitStore';

export const HabitManager = () => {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabitStore();
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTime, setNewHabitTime] = useState('');
  const [newHabitDays, setNewHabitDays] = useState<number[]>([]);
  const [newHabitIsOneTime, setNewHabitIsOneTime] = useState(false);
  const [newHabitSpecificDates, setNewHabitSpecificDates] = useState<string[]>([]);
  const [newDateInput, setNewDateInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingTime, setEditingTime] = useState('');
  const [editingDays, setEditingDays] = useState<number[]>([]);
  const [editingIsOneTime, setEditingIsOneTime] = useState(false);
  const [editingSpecificDates, setEditingSpecificDates] = useState<string[]>([]);
  const [editDateInput, setEditDateInput] = useState('');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Habit name:', newHabitName);
    console.log('Habit name trim:', newHabitName.trim());
    if (newHabitName.trim()) {
      console.log('Adding habit with specificDates:', newHabitSpecificDates);
      console.log('Adding habit with daysOfWeek:', newHabitDays);
      addHabit(newHabitName, newHabitTime || undefined, newHabitDays, newHabitIsOneTime, newHabitSpecificDates);
      setNewHabitName('');
      setNewHabitTime('');
      setNewHabitDays([]);
      setNewHabitIsOneTime(false);
      setNewHabitSpecificDates([]);
      setNewDateInput('');
    } else {
      console.log('Habit name is empty!');
    }
  };

  const addSpecificDate = (isNew: boolean) => {
    const dateInput = isNew ? newDateInput : editDateInput;
    if (!dateInput) return;
    
    if (isNew) {
      if (!newHabitSpecificDates.includes(dateInput)) {
        setNewHabitSpecificDates([...newHabitSpecificDates, dateInput].sort());
        // Clear days of week when adding specific dates
        setNewHabitDays([]);
      }
      setNewDateInput('');
    } else {
      if (!editingSpecificDates.includes(dateInput)) {
        setEditingSpecificDates([...editingSpecificDates, dateInput].sort());
        // Clear days of week when adding specific dates
        setEditingDays([]);
      }
      setEditDateInput('');
    }
  };

  const removeSpecificDate = (date: string, isNew: boolean) => {
    if (isNew) {
      setNewHabitSpecificDates(newHabitSpecificDates.filter(d => d !== date));
    } else {
      setEditingSpecificDates(editingSpecificDates.filter(d => d !== date));
    }
  };

  const toggleDay = (day: number, isNew: boolean) => {
    if (isNew) {
      // Clear specific dates when selecting days of week
      if (newHabitSpecificDates.length > 0) {
        setNewHabitSpecificDates([]);
      }
      setNewHabitDays(prev =>
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      );
    } else {
      // Clear specific dates when selecting days of week
      if (editingSpecificDates.length > 0) {
        setEditingSpecificDates([]);
      }
      setEditingDays(prev =>
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      );
    }
  };

  const handleStartEdit = (id: string, currentName: string, currentTime?: string, currentDays?: number[], currentIsOneTime?: boolean, currentSpecificDates?: string[]) => {
    setEditingId(id);
    setEditingName(currentName);
    setEditingTime(currentTime || '');
    setEditingDays(currentDays || []);
    setEditingIsOneTime(currentIsOneTime || false);
    setEditingSpecificDates(currentSpecificDates || []);
    setEditDateInput('');
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      updateHabit(id, { 
        name: editingName.trim(),
        time: editingTime || undefined,
        daysOfWeek: editingDays,
        isOneTime: editingIsOneTime,
        specificDates: editingSpecificDates,
      });
    }
    setEditingId(null);
    setEditingName('');
    setEditingTime('');
    setEditingDays([]);
    setEditingIsOneTime(false);
    setEditingSpecificDates([]);
    setEditDateInput('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingTime('');
    setEditingDays([]);
    setEditingIsOneTime(false);
    setEditingSpecificDates([]);
    setEditDateInput('');
  };

  const activeHabits = habits.filter(h => h.active);
  const inactiveHabits = habits.filter(h => !h.active);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-6">Manage Habits</h2>

      {/* Add New Habit */}
      <form onSubmit={handleAddHabit} className="mb-8">
        <div className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Habit name..."
              className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="time"
              value={newHabitTime}
              onChange={(e) => setNewHabitTime(e.target.value)}
              placeholder="Time (optional)"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Days of Week Selector */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Recurring on days of week:
              {newHabitSpecificDates.length > 0 && (
                <span className="ml-2 text-xs text-gray-400">(disabled - using specific dates)</span>
              )}
            </label>
            <div className="flex gap-2 flex-wrap">
              {daysOfWeek.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(index, true)}
                  disabled={newHabitSpecificDates.length > 0}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    newHabitDays.includes(index)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md scale-105'
                      : newHabitSpecificDates.length > 0
                      ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          
          {/* Specific Dates Selector */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Or schedule for specific dates:
              {newHabitDays.length > 0 && (
                <span className="ml-2 text-xs text-gray-400">(will clear days of week)</span>
              )}
            </label>
            <div className="flex gap-2 mb-2">
              <div className="flex-1 relative">
                <input
                  type="date"
                  value={newDateInput}
                  onChange={(e) => setNewDateInput(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base cursor-pointer"
                  placeholder="Click to select date"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={() => addSpecificDate(true)}
                disabled={!newDateInput}
                className={`px-6 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  newDateInput
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:scale-105 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Add Date
              </button>
            </div>
            {newHabitSpecificDates.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {newHabitSpecificDates.map(date => (
                  <span
                    key={date}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <button
                      type="button"
                      onClick={() => removeSpecificDate(date, true)}
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* One-time Task Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="newOneTime"
              checked={newHabitIsOneTime}
              onChange={(e) => setNewHabitIsOneTime(e.target.checked)}
              className="w-4 h-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
            />
            <label htmlFor="newOneTime" className="text-sm text-gray-700 cursor-pointer">
              One-time task (auto-archive after completion)
            </label>
          </div>
          
          <button
            type="submit"
            disabled={!newHabitName.trim()}
            className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              newHabitName.trim()
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Habit
          </button>
        </div>
      </form>

      {/* Active Habits */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Active Habits</h3>
        {activeHabits.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No active habits</p>
        ) : (
          <div className="space-y-2">
            {activeHabits.map(habit => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200"
              >
                {editingId === habit.id ? (
                  // Edit mode
                  <>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          autoFocus
                        />
                        <input
                          type="time"
                          value={editingTime}
                          onChange={(e) => setEditingTime(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {daysOfWeek.map((day, index) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(index, false)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              editingDays.includes(index)
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="date"
                          value={editDateInput}
                          onChange={(e) => setEditDateInput(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => addSpecificDate(false)}
                          className="px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 text-xs"
                        >
                          Add
                        </button>
                      </div>
                      {editingSpecificDates.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-2">
                          {editingSpecificDates.map(date => (
                            <span
                              key={date}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs"
                            >
                              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              <button
                                type="button"
                                onClick={() => removeSpecificDate(date, false)}
                                className="hover:text-purple-900"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="editOneTime"
                          checked={editingIsOneTime}
                          onChange={(e) => setEditingIsOneTime(e.target.checked)}
                          className="w-4 h-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                        />
                        <label htmlFor="editOneTime" className="text-xs text-gray-700 cursor-pointer">
                          One-time task
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => handleSaveEdit(habit.id)}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-800">{habit.name}</span>
                        {habit.time && (
                          <span className="text-sm text-white font-medium bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1 rounded-full shadow-sm">
                            {habit.time}
                          </span>
                        )}
                        {habit.isOneTime && (
                          <span className="text-xs text-white font-medium bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 rounded-full shadow-sm">
                            One-time
                          </span>
                        )}
                      </div>
                      {habit.daysOfWeek && habit.daysOfWeek.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {habit.daysOfWeek.sort((a, b) => a - b).map(dayIndex => (
                            <span key={dayIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {daysOfWeek[dayIndex]}
                            </span>
                          ))}
                        </div>
                      )}                      {habit.specificDates && habit.specificDates.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1">
                          {habit.specificDates.slice(0, 3).map(date => (
                            <span key={date} className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          ))}
                          {habit.specificDates.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-0.5">
                              +{habit.specificDates.length - 3} more
                            </span>
                          )}
                        </div>
                      )}                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(habit.id, habit.name, habit.time, habit.daysOfWeek, habit.isOneTime, habit.specificDates)}
                        className="px-3 py-1 text-primary-600 hover:bg-primary-50 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Habits (Archive) */}
      {inactiveHabits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Archived Habits</h3>
          <div className="space-y-2">
            {inactiveHabits.map(habit => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-gray-500 line-through">{habit.name}</span>
                <button
                  onClick={() => updateHabit(habit.id, { active: true })}
                  className="px-3 py-1 text-primary-600 hover:bg-primary-50 rounded text-sm"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
