'use client';

import { useState } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, X, Moon, Zap, Target, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTrackerStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { getRatingEmoji, formatHours, formatMinutes } from '@/lib/helpers';

interface WeeklyViewProps {
  onDateSelect: (date: string) => void;
  className?: string;
}

export function WeeklyView({ onDateSelect, className }: WeeklyViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { settings, entries, habits, getWeeklySummary } = useTrackerStore();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weekSummary = getWeeklySummary(format(currentDate, 'yyyy-MM-dd'));

  const activeHabits = habits.filter((h) => !h.archived);

  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToThisWeek = () => setCurrentDate(new Date());

  const getEntryForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return entries.find((e) => e.date === dateStr);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h3 className="font-semibold">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
          {!isSameDay(weekStart, startOfWeek(new Date(), { weekStartsOn: settings.weekStartsOn })) && (
            <Button variant="link" size="sm" onClick={goToThisWeek} className="text-xs">
              Go to this week
            </Button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={goToNextWeek}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const entry = getEntryForDay(day);
          const dateStr = format(day, 'yyyy-MM-dd');
          const completedHabits = entry ? Object.values(entry.habits).filter(Boolean).length : 0;
          const hasEntry = !!entry && (entry.sleepHours > 0 || completedHabits > 0 || entry.morningMood > 1);

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={cn(
                'flex flex-col items-center p-2 rounded-lg transition-all',
                isToday(day) && 'ring-2 ring-primary',
                hasEntry ? 'bg-primary/10' : 'bg-muted/30 hover:bg-muted/50'
              )}
            >
              <span className="text-xs text-muted-foreground">
                {format(day, 'EEE')}
              </span>
              <span className={cn(
                'text-lg font-semibold',
                isToday(day) && 'text-primary'
              )}>
                {format(day, 'd')}
              </span>
              {hasEntry ? (
                <div className="flex gap-0.5 mt-1">
                  <span className="text-sm">{getRatingEmoji(entry.morningMood)}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground mt-1">-</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Week Summary Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            Week Summary
            <Badge variant="outline">{weekSummary.daysLogged}/7 days</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weekSummary.daysLogged > 0 ? (
            <>
              {/* Sleep */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-violet-500" />
                    <span>Avg Sleep</span>
                  </div>
                  <span className="font-medium">{formatHours(weekSummary.avgSleepHours)}</span>
                </div>
                <Progress 
                  value={Math.min(100, (weekSummary.avgSleepHours / settings.goals.sleepHours) * 100)} 
                  className="h-2"
                />
              </div>

              {/* Mood */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Avg Mood</span>
                  </div>
                  <span className="font-medium">{weekSummary.avgMood.toFixed(1)}/5</span>
                </div>
                <Progress value={(weekSummary.avgMood / 5) * 100} className="h-2" />
              </div>

              {/* Productivity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>Avg Productivity</span>
                  </div>
                  <span className="font-medium">{weekSummary.avgProductivity.toFixed(1)}/5</span>
                </div>
                <Progress value={(weekSummary.avgProductivity / 5) * 100} className="h-2" />
              </div>

              {/* Exercise */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-emerald-500" />
                    <span>Exercise</span>
                  </div>
                  <span className="font-medium">
                    {weekSummary.exerciseDays} days · {formatMinutes(weekSummary.totalExerciseMinutes)}
                  </span>
                </div>
                <Progress value={(weekSummary.exerciseDays / 7) * 100} className="h-2" />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No data logged for this week yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Habit Grid */}
      {activeHabits.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Habit Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeHabits.map((habit) => {
                const completionRate = weekSummary.habitCompletionRates[habit.id] || 0;
                return (
                  <div key={habit.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{habit.icon}</span>
                        <span>{habit.name}</span>
                      </div>
                      <span className="font-medium">{Math.round(completionRate)}%</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((day) => {
                        const entry = getEntryForDay(day);
                        const completed = entry?.habits[habit.id] || false;
                        return (
                          <div
                            key={format(day, 'yyyy-MM-dd')}
                            className={cn(
                              'h-6 rounded flex items-center justify-center text-xs',
                              completed 
                                ? 'bg-green-500/20 text-green-600' 
                                : 'bg-muted/50 text-muted-foreground'
                            )}
                          >
                            {completed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
