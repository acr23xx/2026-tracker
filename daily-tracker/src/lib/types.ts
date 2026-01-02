// Core types for the daily tracker app

export interface DailyEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string;
  updatedAt: string;

  // Sleep tracking
  sleepHours: number;
  sleepQuality: number; // 1-5 scale
  bedTime?: string;
  wakeTime?: string;

  // Mood & Energy
  morningMood: number; // 1-5 scale
  eveningMood: number; // 1-5 scale
  energyLevel: number; // 1-5 scale
  stressLevel: number; // 1-5 scale

  // Health & Fitness
  exercised: boolean;
  exerciseMinutes: number;
  exerciseType?: string;
  steps: number;
  waterGlasses: number;
  mealsCount: number;
  healthyEating: number; // 1-5 scale

  // Productivity
  productivityScore: number; // 1-5 scale
  focusHours: number;
  tasksCompleted: number;
  tasksPlanned: number;

  // Habits (boolean checklist)
  habits: {
    [habitId: string]: boolean;
  };

  // Personal
  gratitude: string[];
  highlights: string;
  challenges: string;
  notes: string;

  // Custom metrics (user-defined)
  customMetrics: {
    [metricId: string]: number | boolean | string;
  };
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays?: number[]; // 0-6 for weekly (Sun-Sat)
  createdAt: string;
  archived: boolean;
}

export interface CustomMetric {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'rating' | 'text';
  icon: string;
  unit?: string;
  min?: number;
  max?: number;
  createdAt: string;
  archived: boolean;
}

export interface UserSettings {
  name: string;
  theme: 'light' | 'dark' | 'system';
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  reminderTime?: string;
  enabledCategories: {
    sleep: boolean;
    mood: boolean;
    fitness: boolean;
    productivity: boolean;
    habits: boolean;
    gratitude: boolean;
    notes: boolean;
  };
  goals: {
    sleepHours: number;
    waterGlasses: number;
    exerciseMinutes: number;
    steps: number;
    focusHours: number;
  };
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  avgSleepHours: number;
  avgSleepQuality: number;
  avgMood: number;
  avgEnergy: number;
  avgStress: number;
  totalExerciseMinutes: number;
  exerciseDays: number;
  avgWaterGlasses: number;
  avgProductivity: number;
  totalFocusHours: number;
  tasksCompletionRate: number;
  habitCompletionRates: { [habitId: string]: number };
  daysLogged: number;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  avgSleepHours: number;
  avgSleepQuality: number;
  avgMood: number;
  avgEnergy: number;
  avgStress: number;
  totalExerciseMinutes: number;
  exerciseDays: number;
  avgWaterGlasses: number;
  avgProductivity: number;
  totalFocusHours: number;
  tasksCompletionRate: number;
  habitCompletionRates: { [habitId: string]: number };
  daysLogged: number;
  totalDays: number;
}

// Default values
export const defaultDailyEntry: Omit<DailyEntry, 'id' | 'date' | 'createdAt' | 'updatedAt'> = {
  sleepHours: 0,
  sleepQuality: 3,
  bedTime: '',
  wakeTime: '',
  morningMood: 3,
  eveningMood: 3,
  energyLevel: 3,
  stressLevel: 3,
  exercised: false,
  exerciseMinutes: 0,
  exerciseType: '',
  steps: 0,
  waterGlasses: 0,
  mealsCount: 3,
  healthyEating: 3,
  productivityScore: 3,
  focusHours: 0,
  tasksCompleted: 0,
  tasksPlanned: 0,
  habits: {},
  gratitude: [],
  highlights: '',
  challenges: '',
  notes: '',
  customMetrics: {},
};

export const defaultSettings: UserSettings = {
  name: '',
  theme: 'system',
  weekStartsOn: 0,
  enabledCategories: {
    sleep: true,
    mood: true,
    fitness: true,
    productivity: true,
    habits: true,
    gratitude: true,
    notes: true,
  },
  goals: {
    sleepHours: 8,
    waterGlasses: 8,
    exerciseMinutes: 30,
    steps: 10000,
    focusHours: 4,
  },
};

export const defaultHabits: Habit[] = [
  { id: 'meditation', name: 'Meditation', icon: '🧘', color: 'purple', frequency: 'daily', createdAt: new Date().toISOString(), archived: false },
  { id: 'reading', name: 'Reading', icon: '📚', color: 'blue', frequency: 'daily', createdAt: new Date().toISOString(), archived: false },
  { id: 'journaling', name: 'Journaling', icon: '📝', color: 'amber', frequency: 'daily', createdAt: new Date().toISOString(), archived: false },
  { id: 'vitamins', name: 'Vitamins', icon: '💊', color: 'green', frequency: 'daily', createdAt: new Date().toISOString(), archived: false },
  { id: 'skincare', name: 'Skincare', icon: '✨', color: 'pink', frequency: 'daily', createdAt: new Date().toISOString(), archived: false },
  { id: 'no-alcohol', name: 'No Alcohol', icon: '🚫', color: 'red', frequency: 'daily', createdAt: new Date().toISOString(), archived: false },
];
