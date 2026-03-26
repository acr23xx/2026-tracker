'use client';

import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon } from 'lucide-react';
import { useTrackerStore } from '@/lib/store';
import { DAILY_LOG_FIELDS, DailyLogField } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DailyCheckIn() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { getDailyLog, updateDailyLog, checkIn } = useTrackerStore();
  const dailyLog = getDailyLog(dateStr);

  const booleanFields: DailyLogField[] = [
    'wakeBefore9am', 'laFitness', 'closedAllRings', 'intermittentFast',
    'alcoholUsed', 'weedUsed', 'fastFood',
    'phoneFreeEvening', 'pickleball', 'golf', 'liveEvent'
  ];

  const numberFields: DailyLogField[] = ['weight', 'screenTime', 'caffeine', 'savingsTransfer'];

  const completedBooleans = booleanFields.filter((key) => {
    const negativeHabits = ['alcoholUsed', 'weedUsed', 'fastFood'];
    if (negativeHabits.includes(key)) {
      return !dailyLog[key as keyof typeof dailyLog];
    }
    return dailyLog[key as keyof typeof dailyLog];
  }).length;

  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

  const handleBooleanChange = (field: DailyLogField) => {
    const currentValue = dailyLog[field as keyof typeof dailyLog] as boolean;
    updateDailyLog(dateStr, { [field]: !currentValue });
  };

  const handleNumberChange = (field: DailyLogField, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    updateDailyLog(dateStr, { [field]: numValue });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="hover:bg-white/[0.06] h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'flex-1 sm:flex-none sm:min-w-[220px] justify-center font-semibold text-sm sm:text-base',
                  isToday && 'border-blue-500/50 bg-blue-950/30'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="sm:hidden">{format(selectedDate, 'EEE, MMM d')}</span>
                <span className="hidden sm:inline">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="hover:bg-white/[0.06] h-10 w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isToday && (
            <Badge className="bg-blue-600 text-white border-0">Today</Badge>
          )}
          {dailyLog.checkedIn && (
            <Badge className="bg-emerald-600 text-white border-0">✓ Checked In</Badge>
          )}
        </div>
      </div>

      {/* Number Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span> Metrics
          </CardTitle>
          <CardDescription>
            Log your daily numbers
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
            {numberFields.map((field) => {
              const fieldInfo = DAILY_LOG_FIELDS[field];
              const value = dailyLog[field as keyof typeof dailyLog] as number | null;
              return (
                <div key={field} className="space-y-1 sm:space-y-2">
                  <Label htmlFor={field} className="text-xs sm:text-sm">{fieldInfo.label}</Label>
                  <Input
                    id={field}
                    type="number"
                    inputMode="decimal"
                    step={field === 'weight' ? '0.1' : '1'}
                    placeholder={field === 'weight' ? '175' : field === 'screenTime' ? '4' : field === 'savingsTransfer' ? '0' : '100'}
                    value={value === null ? '' : value}
                    onChange={(e) => handleNumberChange(field, e.target.value)}
                    className="text-base sm:text-lg h-11 sm:h-10"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Positive Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✅</span> Daily Activities
          </CardTitle>
          <CardDescription>
            Check off what you accomplished today
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="grid gap-2 sm:gap-3 grid-cols-2 lg:grid-cols-3">
            {booleanFields
              .filter(f => !['alcoholUsed', 'weedUsed', 'fastFood'].includes(f))
              .map((field) => {
                const fieldInfo = DAILY_LOG_FIELDS[field];
                const checked = dailyLog[field as keyof typeof dailyLog] as boolean;
                return (
                  <div
                    key={field}
                    className={cn(
                      'flex items-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-all cursor-pointer active:scale-[0.98]',
                      checked
                        ? 'border-green-600/50 bg-green-950/30'
                        : 'border-white/[0.08] hover:border-blue-500/40 hover:bg-blue-950/20'
                    )}
                    onClick={() => handleBooleanChange(field)}
                  >
                    <Checkbox
                      id={field}
                      checked={checked}
                      onCheckedChange={() => handleBooleanChange(field)}
                      className="h-5 w-5 shrink-0"
                    />
                    <Label
                      htmlFor={field}
                      className={cn(
                        'flex-1 cursor-pointer text-xs sm:text-sm font-medium leading-tight',
                        checked ? 'text-green-400' : 'text-slate-300'
                      )}
                    >
                      {fieldInfo.label}
                    </Label>
                    {checked && (
                      <Check className="h-4 w-4 text-green-400 shrink-0 hidden sm:block" />
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Negative Habits */}
      <Card className="border-red-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🚫</span> Things to Avoid
          </CardTitle>
          <CardDescription>
            Check if you slipped up today (leave unchecked for a win!)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="grid gap-2 sm:gap-3 grid-cols-3">
            {['alcoholUsed', 'weedUsed', 'fastFood'].map((field) => {
              const fieldInfo = DAILY_LOG_FIELDS[field as DailyLogField];
              const checked = dailyLog[field as keyof typeof dailyLog] as boolean;
              return (
                <div
                  key={field}
                  className={cn(
                    'flex flex-col sm:flex-row items-center gap-1 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-all cursor-pointer active:scale-[0.98] text-center sm:text-left',
                    checked
                      ? 'border-red-700/50 bg-red-950/30'
                      : 'border-green-700/40 bg-green-950/20'
                  )}
                  onClick={() => handleBooleanChange(field as DailyLogField)}
                >
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={() => handleBooleanChange(field as DailyLogField)}
                    className="h-5 w-5 shrink-0"
                  />
                  <Label
                    htmlFor={field}
                    className={cn(
                      'cursor-pointer text-xs sm:text-sm font-medium leading-tight',
                      checked ? 'text-red-400' : 'text-green-400'
                    )}
                  >
                    {fieldInfo.label}
                  </Label>
                  {!checked && (
                    <span className="text-green-400 text-[10px] sm:text-xs font-medium hidden sm:inline">Clean! ✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📝</span> Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How was your day? Any wins or challenges?"
            value={dailyLog.notes}
            onChange={(e) => updateDailyLog(dateStr, { notes: e.target.value })}
            className="min-h-[80px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Check-in Button */}
      <div className="flex flex-col items-center gap-3">
        {!dailyLog.checkedIn ? (
          <Button
            size="lg"
            onClick={() => checkIn(dateStr)}
            className="min-w-[200px] text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-900/30"
          >
            Complete Check-in
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-green-400">
              <Check className="h-5 w-5" />
              <span className="font-semibold">Day Checked In ✓</span>
            </div>
            <p className="text-center text-sm text-slate-400">
              ✨ This day is locked in! Your data counts towards weekly and monthly goals.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateDailyLog(dateStr, { checkedIn: false })}
              className="mt-2 text-blue-400 border-blue-500/30 hover:bg-blue-950/30"
            >
              Undo Check-in (Edit Mode)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
