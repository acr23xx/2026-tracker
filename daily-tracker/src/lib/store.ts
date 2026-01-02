'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getDaysInMonth } from 'date-fns';
import {
  DailyEntry,
  Habit,
  CustomMetric,
  UserSettings,
  WeeklySummary,
  MonthlySummary,
  defaultDailyEntry,
  defaultSettings,
  defaultHabits,
} from './types';

interface TrackerStore {
  // Data
  entries: DailyEntry[];
  habits: Habit[];
  customMetrics: CustomMetric[];
  settings: UserSettings;

  // Actions - Entries
  getEntry: (date: string) => DailyEntry | undefined;
  getOrCreateEntry: (date: string) => DailyEntry;
  updateEntry: (date: string, updates: Partial<DailyEntry>) => void;
  deleteEntry: (date: string) => void;

  // Actions - Habits
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (date: string, habitId: string) => void;

  // Actions - Custom Metrics
  addCustomMetric: (metric: Omit<CustomMetric, 'id' | 'createdAt' | 'archived'>) => void;
  updateCustomMetric: (id: string, updates: Partial<CustomMetric>) => void;
  deleteCustomMetric: (id: string) => void;

  // Actions - Settings
  updateSettings: (updates: Partial<UserSettings>) => void;

  // Computed - Summaries
  getWeeklySummary: (date: string) => WeeklySummary;
  getMonthlySummary: (month: string) => MonthlySummary;
  getStreak: (habitId?: string) => number;
  getEntriesForRange: (startDate: string, endDate: string) => DailyEntry[];
}

export const useTrackerStore = create<TrackerStore>()(
  persist(
    (set, get) => ({
      entries: [],
      habits: defaultHabits,
      customMetrics: [],
      settings: defaultSettings,

      // Get entry for a specific date
      getEntry: (date: string) => {
        return get().entries.find((e) => e.date === date);
      },

      // Get or create entry for a date
      getOrCreateEntry: (date: string) => {
        const existing = get().entries.find((e) => e.date === date);
        if (existing) return existing;

        const now = new Date().toISOString();
        const newEntry: DailyEntry = {
          ...defaultDailyEntry,
          id: uuidv4(),
          date,
          createdAt: now,
          updatedAt: now,
          habits: {},
        };

        set((state) => ({
          entries: [...state.entries, newEntry],
        }));

        return newEntry;
      },

      // Update an entry
      updateEntry: (date: string, updates: Partial<DailyEntry>) => {
        set((state) => {
          const existingIndex = state.entries.findIndex((e) => e.date === date);

          if (existingIndex === -1) {
            // Create new entry with updates
            const now = new Date().toISOString();
            const newEntry: DailyEntry = {
              ...defaultDailyEntry,
              id: uuidv4(),
              date,
              createdAt: now,
              updatedAt: now,
              habits: {},
              ...updates,
            };
            return { entries: [...state.entries, newEntry] };
          }

          // Update existing entry
          const updatedEntries = [...state.entries];
          updatedEntries[existingIndex] = {
            ...updatedEntries[existingIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return { entries: updatedEntries };
        });
      },

      // Delete an entry
      deleteEntry: (date: string) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.date !== date),
        }));
      },

      // Add a new habit
      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          archived: false,
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      // Update a habit
      updateHabit: (id: string, updates: Partial<Habit>) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
      },

      // Delete a habit
      deleteHabit: (id: string) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },

      // Toggle habit completion for a date
      toggleHabit: (date: string, habitId: string) => {
        const entry = get().getOrCreateEntry(date);
        const currentValue = entry.habits[habitId] || false;
        get().updateEntry(date, {
          habits: {
            ...entry.habits,
            [habitId]: !currentValue,
          },
        });
      },

      // Add custom metric
      addCustomMetric: (metric) => {
        const newMetric: CustomMetric = {
          ...metric,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          archived: false,
        };
        set((state) => ({
          customMetrics: [...state.customMetrics, newMetric],
        }));
      },

      // Update custom metric
      updateCustomMetric: (id: string, updates: Partial<CustomMetric>) => {
        set((state) => ({
          customMetrics: state.customMetrics.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },

      // Delete custom metric
      deleteCustomMetric: (id: string) => {
        set((state) => ({
          customMetrics: state.customMetrics.filter((m) => m.id !== id),
        }));
      },

      // Update settings
      updateSettings: (updates: Partial<UserSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // Get entries for a date range
      getEntriesForRange: (startDate: string, endDate: string) => {
        return get().entries.filter((e) => e.date >= startDate && e.date <= endDate);
      },

      // Get weekly summary
      getWeeklySummary: (date: string) => {
        const { settings, entries, habits } = get();
        const dateObj = parseISO(date);
        const weekStart = startOfWeek(dateObj, { weekStartsOn: settings.weekStartsOn });
        const weekEnd = endOfWeek(dateObj, { weekStartsOn: settings.weekStartsOn });

        const startStr = format(weekStart, 'yyyy-MM-dd');
        const endStr = format(weekEnd, 'yyyy-MM-dd');

        const weekEntries = entries.filter((e) => e.date >= startStr && e.date <= endStr);

        const daysLogged = weekEntries.length;

        if (daysLogged === 0) {
          return {
            weekStart: startStr,
            weekEnd: endStr,
            avgSleepHours: 0,
            avgSleepQuality: 0,
            avgMood: 0,
            avgEnergy: 0,
            avgStress: 0,
            totalExerciseMinutes: 0,
            exerciseDays: 0,
            avgWaterGlasses: 0,
            avgProductivity: 0,
            totalFocusHours: 0,
            tasksCompletionRate: 0,
            habitCompletionRates: {},
            daysLogged: 0,
          };
        }

        const sum = weekEntries.reduce(
          (acc, e) => ({
            sleepHours: acc.sleepHours + e.sleepHours,
            sleepQuality: acc.sleepQuality + e.sleepQuality,
            mood: acc.mood + (e.morningMood + e.eveningMood) / 2,
            energy: acc.energy + e.energyLevel,
            stress: acc.stress + e.stressLevel,
            exerciseMinutes: acc.exerciseMinutes + e.exerciseMinutes,
            exerciseDays: acc.exerciseDays + (e.exercised ? 1 : 0),
            waterGlasses: acc.waterGlasses + e.waterGlasses,
            productivity: acc.productivity + e.productivityScore,
            focusHours: acc.focusHours + e.focusHours,
            tasksCompleted: acc.tasksCompleted + e.tasksCompleted,
            tasksPlanned: acc.tasksPlanned + e.tasksPlanned,
          }),
          {
            sleepHours: 0,
            sleepQuality: 0,
            mood: 0,
            energy: 0,
            stress: 0,
            exerciseMinutes: 0,
            exerciseDays: 0,
            waterGlasses: 0,
            productivity: 0,
            focusHours: 0,
            tasksCompleted: 0,
            tasksPlanned: 0,
          }
        );

        // Calculate habit completion rates
        const habitCompletionRates: { [habitId: string]: number } = {};
        habits
          .filter((h) => !h.archived)
          .forEach((habit) => {
            const completed = weekEntries.filter((e) => e.habits[habit.id]).length;
            habitCompletionRates[habit.id] = daysLogged > 0 ? (completed / daysLogged) * 100 : 0;
          });

        return {
          weekStart: startStr,
          weekEnd: endStr,
          avgSleepHours: sum.sleepHours / daysLogged,
          avgSleepQuality: sum.sleepQuality / daysLogged,
          avgMood: sum.mood / daysLogged,
          avgEnergy: sum.energy / daysLogged,
          avgStress: sum.stress / daysLogged,
          totalExerciseMinutes: sum.exerciseMinutes,
          exerciseDays: sum.exerciseDays,
          avgWaterGlasses: sum.waterGlasses / daysLogged,
          avgProductivity: sum.productivity / daysLogged,
          totalFocusHours: sum.focusHours,
          tasksCompletionRate: sum.tasksPlanned > 0 ? (sum.tasksCompleted / sum.tasksPlanned) * 100 : 0,
          habitCompletionRates,
          daysLogged,
        };
      },

      // Get monthly summary
      getMonthlySummary: (month: string) => {
        const { entries, habits } = get();
        const [year, monthNum] = month.split('-').map(Number);
        const monthStart = startOfMonth(new Date(year, monthNum - 1));
        const monthEnd = endOfMonth(new Date(year, monthNum - 1));

        const startStr = format(monthStart, 'yyyy-MM-dd');
        const endStr = format(monthEnd, 'yyyy-MM-dd');

        const monthEntries = entries.filter((e) => e.date >= startStr && e.date <= endStr);

        const daysLogged = monthEntries.length;
        const totalDays = getDaysInMonth(new Date(year, monthNum - 1));

        if (daysLogged === 0) {
          return {
            month,
            avgSleepHours: 0,
            avgSleepQuality: 0,
            avgMood: 0,
            avgEnergy: 0,
            avgStress: 0,
            totalExerciseMinutes: 0,
            exerciseDays: 0,
            avgWaterGlasses: 0,
            avgProductivity: 0,
            totalFocusHours: 0,
            tasksCompletionRate: 0,
            habitCompletionRates: {},
            daysLogged: 0,
            totalDays,
          };
        }

        const sum = monthEntries.reduce(
          (acc, e) => ({
            sleepHours: acc.sleepHours + e.sleepHours,
            sleepQuality: acc.sleepQuality + e.sleepQuality,
            mood: acc.mood + (e.morningMood + e.eveningMood) / 2,
            energy: acc.energy + e.energyLevel,
            stress: acc.stress + e.stressLevel,
            exerciseMinutes: acc.exerciseMinutes + e.exerciseMinutes,
            exerciseDays: acc.exerciseDays + (e.exercised ? 1 : 0),
            waterGlasses: acc.waterGlasses + e.waterGlasses,
            productivity: acc.productivity + e.productivityScore,
            focusHours: acc.focusHours + e.focusHours,
            tasksCompleted: acc.tasksCompleted + e.tasksCompleted,
            tasksPlanned: acc.tasksPlanned + e.tasksPlanned,
          }),
          {
            sleepHours: 0,
            sleepQuality: 0,
            mood: 0,
            energy: 0,
            stress: 0,
            exerciseMinutes: 0,
            exerciseDays: 0,
            waterGlasses: 0,
            productivity: 0,
            focusHours: 0,
            tasksCompleted: 0,
            tasksPlanned: 0,
          }
        );

        // Calculate habit completion rates
        const habitCompletionRates: { [habitId: string]: number } = {};
        habits
          .filter((h) => !h.archived)
          .forEach((habit) => {
            const completed = monthEntries.filter((e) => e.habits[habit.id]).length;
            habitCompletionRates[habit.id] = daysLogged > 0 ? (completed / daysLogged) * 100 : 0;
          });

        return {
          month,
          avgSleepHours: sum.sleepHours / daysLogged,
          avgSleepQuality: sum.sleepQuality / daysLogged,
          avgMood: sum.mood / daysLogged,
          avgEnergy: sum.energy / daysLogged,
          avgStress: sum.stress / daysLogged,
          totalExerciseMinutes: sum.exerciseMinutes,
          exerciseDays: sum.exerciseDays,
          avgWaterGlasses: sum.waterGlasses / daysLogged,
          avgProductivity: sum.productivity / daysLogged,
          totalFocusHours: sum.focusHours,
          tasksCompletionRate: sum.tasksPlanned > 0 ? (sum.tasksCompleted / sum.tasksPlanned) * 100 : 0,
          habitCompletionRates,
          daysLogged,
          totalDays,
        };
      },

      // Get current streak (consecutive days logged or habit completed)
      getStreak: (habitId?: string) => {
        const { entries } = get();
        if (entries.length === 0) return 0;

        // Sort entries by date descending
        const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

        let streak = 0;
        const today = format(new Date(), 'yyyy-MM-dd');
        let currentDate = today;

        for (let i = 0; i < 365; i++) {
          const entry = sortedEntries.find((e) => e.date === currentDate);

          if (!entry) {
            // If today has no entry, check yesterday
            if (i === 0) {
              const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
              currentDate = yesterday;
              continue;
            }
            break;
          }

          if (habitId) {
            // Check specific habit
            if (entry.habits[habitId]) {
              streak++;
            } else {
              break;
            }
          } else {
            // General logging streak
            streak++;
          }

          // Move to previous day
          const prevDate = new Date(currentDate);
          prevDate.setDate(prevDate.getDate() - 1);
          currentDate = format(prevDate, 'yyyy-MM-dd');
        }

        return streak;
      },
    }),
    {
      name: 'daily-tracker-storage',
      version: 1,
    }
  )
);
