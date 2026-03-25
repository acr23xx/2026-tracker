// Types for the 2026 Bingo Tracker

export interface DailyLog {
  id?: string;
  date: string; // ISO date string YYYY-MM-DD
  checkedIn: boolean;
  
  // Health & Fitness
  weight: number | null;
  wakeBefore9am: boolean;
  laFitness: boolean;
  closedAllRings: boolean;
  intermittentFast: boolean;
  
  // Screen & Substances
  screenTime: number | null;
  caffeine: number | null;
  alcoholUsed: boolean;
  weedUsed: boolean;
  fastFood: boolean;
  
  // Phone-free & Activities
  phoneFreeEvening: boolean;
  pickleball: boolean;
  golf: boolean;
  liveEvent: boolean;
  
  notes: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  dateFinished: string;
  notes: string;
}

export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  dateWatched: string;
  notes: string;
}

export interface OneTimeGoal {
  id: string;
  title: string;
  completed: boolean;
  dateCompleted?: string | null;
}

export interface WeeklySummary {
  weekStart: string;
  daysInWeek: number;
  checkIns: number;
  phoneFreeEvenings: number;
  isPhoneFreeWeek: boolean;
  avgScreenTime: number;
  isScreenUnder4Week: boolean;
}

export interface MonthlySummary {
  monthStart: string;
  month: string;
  daysInMonth: number;
  checkIns: number;
  weedDays: number;
  isWeedFreeMonth: boolean;
  alcoholDays: number;
  isAlcoholFreeMonth: boolean;
  fastFoodDays: number;
  isFastFoodFreeMonth: boolean;
}

export interface BingoSquare {
  id: string;
  category: string;
  title: string;
  progress: number;
  target: number;
  done: boolean;
  measurement: string;
}

// Daily log field labels
export const DAILY_LOG_FIELDS = {
  weight: { label: '⚖️ Weight (lbs)', type: 'number' as const },
  wakeBefore9am: { label: '🌅 Wake <9am', type: 'boolean' as const },
  laFitness: { label: '🏋️ LA Fitness', type: 'boolean' as const },
  closedAllRings: { label: '⌚ Closed All Rings', type: 'boolean' as const },
  intermittentFast: { label: '🍽️ Intermittent Fast', type: 'boolean' as const },
  screenTime: { label: '📱 Screen Time (hrs)', type: 'number' as const },
  caffeine: { label: '☕ Caffeine (mg)', type: 'number' as const },
  alcoholUsed: { label: '🍺 Alcohol Used', type: 'boolean' as const },
  weedUsed: { label: '🌿 Weed Used', type: 'boolean' as const },
  fastFood: { label: '🍔 Fast Food', type: 'boolean' as const },
  phoneFreeEvening: { label: '📵 Phone-free Evening', type: 'boolean' as const },
  pickleball: { label: '🏓 Pickleball', type: 'boolean' as const },
  golf: { label: '⛳ Golf', type: 'boolean' as const },
  liveEvent: { label: '🎤 Live Event', type: 'boolean' as const },
} as const;

export type DailyLogField = keyof typeof DAILY_LOG_FIELDS;
