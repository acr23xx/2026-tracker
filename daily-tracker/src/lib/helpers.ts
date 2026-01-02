import { format, parseISO, isToday, isYesterday, isTomorrow, differenceInDays } from 'date-fns';

// Format date for display
export function formatDisplayDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isTomorrow(date)) return 'Tomorrow';

  const diffDays = differenceInDays(new Date(), date);
  if (diffDays > 0 && diffDays < 7) {
    return format(date, 'EEEE'); // Day name
  }

  return format(date, 'MMM d, yyyy');
}

// Get rating emoji
export function getRatingEmoji(rating: number): string {
  const emojis = ['😢', '😕', '😐', '🙂', '😄'];
  return emojis[Math.max(0, Math.min(4, rating - 1))] || '😐';
}

// Get rating color
export function getRatingColor(rating: number): string {
  const colors = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-lime-500',
    'text-green-500',
  ];
  return colors[Math.max(0, Math.min(4, rating - 1))] || 'text-gray-500';
}

// Get rating bg color
export function getRatingBgColor(rating: number): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
  ];
  return colors[Math.max(0, Math.min(4, rating - 1))] || 'bg-gray-500';
}

// Get progress color based on percentage
export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-lime-500';
  if (percentage >= 40) return 'bg-yellow-500';
  if (percentage >= 20) return 'bg-orange-500';
  return 'bg-red-500';
}

// Calculate percentage with goal
export function calculateProgress(value: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

// Format hours to readable string
export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Format minutes to readable string
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Get greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Mood labels
export const moodLabels = ['Very Bad', 'Bad', 'Okay', 'Good', 'Great'];
export const energyLabels = ['Exhausted', 'Tired', 'Moderate', 'Energized', 'Very Energized'];
export const stressLabels = ['Very Stressed', 'Stressed', 'Moderate', 'Relaxed', 'Very Relaxed'];
export const sleepQualityLabels = ['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'];
export const productivityLabels = ['Unproductive', 'Below Average', 'Average', 'Productive', 'Very Productive'];
export const healthyEatingLabels = ['Very Unhealthy', 'Unhealthy', 'Moderate', 'Healthy', 'Very Healthy'];

// Get label for a rating
export function getRatingLabel(rating: number, type: 'mood' | 'energy' | 'stress' | 'sleep' | 'productivity' | 'eating'): string {
  const labels: { [key: string]: string[] } = {
    mood: moodLabels,
    energy: energyLabels,
    stress: stressLabels,
    sleep: sleepQualityLabels,
    productivity: productivityLabels,
    eating: healthyEatingLabels,
  };
  return labels[type]?.[rating - 1] || '';
}

// Chart colors
export const chartColors = {
  sleep: '#8b5cf6',
  mood: '#f59e0b',
  energy: '#10b981',
  stress: '#ef4444',
  productivity: '#3b82f6',
  exercise: '#ec4899',
  water: '#06b6d4',
  habits: '#8b5cf6',
};

// Get week day abbreviations
export function getWeekDays(startOnMonday: boolean = false): string[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (startOnMonday) {
    return [...days.slice(1), days[0]];
  }
  return days;
}

// Exercise type suggestions
export const exerciseTypes = [
  'Running',
  'Walking',
  'Cycling',
  'Swimming',
  'Gym/Weights',
  'Yoga',
  'HIIT',
  'Sports',
  'Dancing',
  'Hiking',
  'Stretching',
  'Other',
];
