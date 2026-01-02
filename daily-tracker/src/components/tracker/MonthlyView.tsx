'use client';

import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  addMonths, 
  subMonths, 
  eachDayOfInterval, 
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Moon, Zap, Target, Dumbbell, Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTrackerStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { getRatingBgColor, formatHours, formatMinutes } from '@/lib/helpers';

interface MonthlyViewProps {
  onDateSelect: (date: string) => void;
  className?: string;
}

export function MonthlyView({ onDateSelect, className }: MonthlyViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { settings, entries, getMonthlySummary } = useTrackerStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: settings.weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: settings.weekStartsOn });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const currentMonth = format(currentDate, 'yyyy-MM');
  const monthSummary = getMonthlySummary(currentMonth);
  
  // Get previous month summary for comparison
  const prevMonthDate = subMonths(currentDate, 1);
  const prevMonthSummary = getMonthlySummary(format(prevMonthDate, 'yyyy-MM'));

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToThisMonth = () => setCurrentDate(new Date());

  const getEntryForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return entries.find((e) => e.date === dateStr);
  };

  const weekDays = settings.weekStartsOn === 1 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h3 className="font-semibold text-lg">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          {!isSameMonth(currentDate, new Date()) && (
            <Button variant="link" size="sm" onClick={goToThisMonth} className="text-xs">
              Go to this month
            </Button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-3">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const entry = getEntryForDay(day);
              const dateStr = format(day, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(day, currentDate);
              const hasEntry = !!entry && (entry.sleepHours > 0 || entry.morningMood > 1);
              const avgMood = entry ? Math.round((entry.morningMood + entry.eveningMood) / 2) : 0;

              return (
                <button
                  key={dateStr}
                  onClick={() => onDateSelect(dateStr)}
                  disabled={!isCurrentMonth}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all',
                    !isCurrentMonth && 'opacity-30',
                    isCurrentMonth && 'hover:bg-muted/50',
                    isToday(day) && 'ring-2 ring-primary',
                    hasEntry && isCurrentMonth && getRatingBgColor(avgMood).replace('bg-', 'bg-') + '/20'
                  )}
                >
                  <span className={cn(
                    'font-medium',
                    isToday(day) && 'text-primary'
                  )}>
                    {format(day, 'd')}
                  </span>
                  {hasEntry && isCurrentMonth && (
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full mt-0.5',
                      getRatingBgColor(avgMood)
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Month Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            Month Summary
            <Badge variant="outline">
              {monthSummary.daysLogged}/{monthSummary.totalDays} days
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthSummary.daysLogged > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Sleep */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Moon className="h-4 w-4 text-violet-500" />
                  <span>Avg Sleep</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{formatHours(monthSummary.avgSleepHours)}</span>
                  {prevMonthSummary.daysLogged > 0 && (
                    <TrendIndicator 
                      current={monthSummary.avgSleepHours} 
                      previous={prevMonthSummary.avgSleepHours} 
                    />
                  )}
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Avg Mood</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{monthSummary.avgMood.toFixed(1)}</span>
                  {prevMonthSummary.daysLogged > 0 && (
                    <TrendIndicator 
                      current={monthSummary.avgMood} 
                      previous={prevMonthSummary.avgMood} 
                    />
                  )}
                </div>
              </div>

              {/* Productivity */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span>Avg Productivity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{monthSummary.avgProductivity.toFixed(1)}</span>
                  {prevMonthSummary.daysLogged > 0 && (
                    <TrendIndicator 
                      current={monthSummary.avgProductivity} 
                      previous={prevMonthSummary.avgProductivity} 
                    />
                  )}
                </div>
              </div>

              {/* Exercise */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Dumbbell className="h-4 w-4 text-emerald-500" />
                  <span>Exercise Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{monthSummary.exerciseDays}</span>
                  <span className="text-sm text-muted-foreground">
                    ({formatMinutes(monthSummary.totalExerciseMinutes)})
                  </span>
                </div>
              </div>

              {/* Energy */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>Avg Energy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{monthSummary.avgEnergy.toFixed(1)}</span>
                  {prevMonthSummary.daysLogged > 0 && (
                    <TrendIndicator 
                      current={monthSummary.avgEnergy} 
                      previous={prevMonthSummary.avgEnergy} 
                    />
                  )}
                </div>
              </div>

              {/* Stress */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-base">🧘</span>
                  <span>Avg Stress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{monthSummary.avgStress.toFixed(1)}</span>
                  {prevMonthSummary.daysLogged > 0 && (
                    <TrendIndicator 
                      current={monthSummary.avgStress} 
                      previous={prevMonthSummary.avgStress}
                      inverse 
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No data logged for this month yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TrendIndicator({ current, previous, inverse = false }: { current: number; previous: number; inverse?: boolean }) {
  if (previous === 0) return null;
  
  const diff = ((current - previous) / previous) * 100;
  const isPositive = inverse ? diff < -5 : diff > 5;
  
  if (Math.abs(diff) <= 5) {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
  
  return isPositive ? (
    <TrendingUp className="h-4 w-4 text-green-500" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-500" />
  );
}
