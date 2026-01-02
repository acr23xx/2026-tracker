'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Habit } from '@/lib/types';

interface HabitListProps {
  habits: Habit[];
  completedHabits: { [habitId: string]: boolean };
  onToggle: (habitId: string) => void;
  className?: string;
}

export function HabitList({ habits, completedHabits, onToggle, className }: HabitListProps) {
  const activeHabits = habits.filter((h) => !h.archived);

  if (activeHabits.length === 0) {
    return (
      <div className={cn('text-center text-muted-foreground py-4', className)}>
        No habits configured yet
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-3', className)}>
      {activeHabits.map((habit) => {
        const isCompleted = completedHabits[habit.id] || false;
        return (
          <button
            key={habit.id}
            type="button"
            onClick={() => onToggle(habit.id)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200',
              isCompleted
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border hover:border-primary/50 hover:bg-muted/50'
            )}
          >
            <span className="text-2xl">{habit.icon}</span>
            <div className="flex-1 text-left">
              <p className={cn('text-sm font-medium', isCompleted ? 'text-primary' : 'text-foreground')}>
                {habit.name}
              </p>
            </div>
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                isCompleted
                  ? 'bg-primary border-primary'
                  : 'border-muted-foreground/30'
              )}
            >
              {isCompleted && <Check className="w-4 h-4 text-primary-foreground" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
