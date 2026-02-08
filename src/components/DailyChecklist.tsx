/**
 * DailyChecklist Component
 * 
 * Main daily habit tracking interface with:
 * - Today's date and progress ring
 * - Checkboxes for each habit
 * - Time badges next to habit names
 * - Drag and drop reordering
 */

import { useMemo, useState } from 'react';
import { useHabitStore } from '@/store/habitStore';
import { getTodayString, formatDateString } from '@/utils/dateUtils';
import { addDays, subDays } from 'date-fns';
import { ProgressRing } from './ProgressRing';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableHabitItemProps {
  habitId: string;
  habitName: string;
  habitTime?: string;
  isChecked: boolean;
  onToggle: () => void;
}

const SortableHabitItem = ({ habitId, habitName, habitTime, isChecked, onToggle }: SortableHabitItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: habitId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200 group"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-primary-500 px-1 transition-colors duration-200"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <circle cx="7" cy="5" r="1.5" />
          <circle cx="13" cy="5" r="1.5" />
          <circle cx="7" cy="10" r="1.5" />
          <circle cx="13" cy="10" r="1.5" />
          <circle cx="7" cy="15" r="1.5" />
          <circle cx="13" cy="15" r="1.5" />
        </svg>
      </div>

      {/* Checkbox */}
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="w-6 h-6 text-primary-500 rounded-lg focus:ring-2 focus:ring-primary-400 cursor-pointer transition-transform duration-200 hover:scale-110"
        />
        {isChecked && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-6 h-6 text-primary-500 animate-[checkmark_0.3s_ease-in-out]" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Habit Name and Time */}
      <div className="flex-1 flex items-center gap-2">
        <label className={`cursor-pointer select-none text-lg transition-all duration-300 ${isChecked ? 'text-gray-400 line-through scale-95' : 'text-gray-800 group-hover:text-primary-600'}`}>
          {habitName}
        </label>
        {habitTime && (
          <span className="text-sm text-white font-medium bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1 rounded-full shadow-sm">
            {habitTime}
          </span>
        )}
      </div>
    </div>
  );
};

export const DailyChecklist = () => {
  const { habits, completions, toggleCompletion, reorderHabits } = useHabitStore();
  const todayString = getTodayString();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedDateString = formatDateString(selectedDate);
  
  // Get completions for selected date
  const dateCompletions = useMemo(() => {
    return completions
      .filter(c => c.date === selectedDateString)
      .reduce((acc, c) => ({ ...acc, [c.habitId]: c.completed }), {} as Record<string, boolean>);
  }, [completions, selectedDateString]);

  // Get active habits sorted by order, filtered by selected day
  const sortedHabits = useMemo(() => {
    const dayOfWeek = selectedDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    return habits
      .filter(h => h.active)
      .filter(h => {
        // Priority 1: If specificDates is set and not empty, only show on those exact dates
        if (h.specificDates && h.specificDates.length > 0) {
          return h.specificDates.includes(selectedDateString);
        }
        
        // Priority 2: If daysOfWeek is set and not empty, show on those days
        if (h.daysOfWeek && h.daysOfWeek.length > 0) {
          return h.daysOfWeek.includes(dayOfWeek);
        }
        
        // Priority 3: If both are empty, show on all days
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [habits, selectedDate, selectedDateString]);

  // Calculate progress
  const completedCount = sortedHabits.filter(h => dateCompletions[h.id]).length;
  const totalCount = sortedHabits.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Date navigation
  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());
  const isToday = selectedDateString === todayString;

  // Set up drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedHabits.findIndex(h => h.id === active.id);
      const newIndex = sortedHabits.findIndex(h => h.id === over.id);

      const reorderedHabits = arrayMove(sortedHabits, oldIndex, newIndex);
      
      // Update order field for all habits
      const habitsWithNewOrder = reorderedHabits.map((habit, index) => ({
        ...habit,
        order: index,
      }));

      reorderHabits(habitsWithNewOrder);
    }
  };

  const handleToggle = (habitId: string) => {
    toggleCompletion(habitId, selectedDateString);
  };

  // Format selected date
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Helper to get relative date label
  const getDateLabel = () => {
    if (isToday) return 'Today';
    const tomorrow = formatDateString(addDays(new Date(), 1));
    const yesterday = formatDateString(subDays(new Date(), 1));
    if (selectedDateString === tomorrow) return 'Tomorrow';
    if (selectedDateString === yesterday) return 'Yesterday';
    return dateFormatter.format(selectedDate);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header with date and progress */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-[fadeIn_0.5s_ease-in]">
          Daily Routine
        </h1>
        
        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={goToPreviousDay}
            className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200 hover:scale-110"
            aria-label="Previous day"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="min-w-[200px] text-center">
            <p className="text-gray-600 font-medium">
              {getDateLabel()}
            </p>
            {!isToday && (
              <p className="text-sm text-gray-400">
                {dateFormatter.format(selectedDate)}
              </p>
            )}
          </div>
          
          <button
            onClick={goToNextDay}
            className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200 hover:scale-110"
            aria-label="Next day"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Today Button (if not on today) */}
        {!isToday && (
          <button
            onClick={goToToday}
            className="mb-4 px-5 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-medium"
          >
            Go to Today
          </button>
        )}
        
        <ProgressRing percentage={progressPercentage} />
        <p className="mt-4 text-gray-600">
          {completedCount} of {totalCount} habits completed
        </p>
      </div>

      {/* Habit Checklist */}
      {sortedHabits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No habits yet</p>
          <p className="text-sm text-gray-500">
            Go to "Manage Habits" to add your first habit
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedHabits.map(h => h.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sortedHabits.map(habit => (
                <SortableHabitItem
                  key={habit.id}
                  habitId={habit.id}
                  habitName={habit.name}
                  habitTime={habit.time}
                  isChecked={!!dateCompletions[habit.id]}
                  onToggle={() => handleToggle(habit.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
