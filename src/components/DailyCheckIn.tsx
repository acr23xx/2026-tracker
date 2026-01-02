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
    'wakeBefore8am', 'laFitness', 'steps10k', 'intermittentFast',
    'alcoholUsed', 'weedUsed', 'fastFood',
    'phoneFreeEvening', 'phoneFreeDate', 'pickleball', 'golf', 'liveEvent'
  ];
  
  const numberFields: DailyLogField[] = ['weight', 'screenTime', 'caffeine'];
  
  const completedBooleans = booleanFields.filter((key) => {
    // For "negative" habits, NOT doing them is good
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
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          className="hover:bg-amber-100 dark:hover:bg-amber-900/30"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'min-w-[220px] justify-center font-semibold',
                  isToday && 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
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
          
          {isToday && (
            <Badge className="bg-amber-500 hover:bg-amber-600">Today</Badge>
          )}
          {dailyLog.checkedIn && (
            <Badge className="bg-green-500 hover:bg-green-600">✓ Checked In</Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="hover:bg-amber-100 dark:hover:bg-amber-900/30"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
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
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {numberFields.map((field) => {
              const fieldInfo = DAILY_LOG_FIELDS[field];
              const value = dailyLog[field as keyof typeof dailyLog] as number | null;
              return (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{fieldInfo.label}</Label>
                  <Input
                    id={field}
                    type="number"
                    step={field === 'weight' ? '0.1' : '1'}
                    placeholder={field === 'weight' ? '175' : field === 'screenTime' ? '4' : '100'}
                    value={value === null ? '' : value}
                    onChange={(e) => handleNumberChange(field, e.target.value)}
                    className="text-lg"
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
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {booleanFields
              .filter(f => !['alcoholUsed', 'weedUsed', 'fastFood'].includes(f))
              .map((field) => {
                const fieldInfo = DAILY_LOG_FIELDS[field];
                const checked = dailyLog[field as keyof typeof dailyLog] as boolean;
                return (
                  <div
                    key={field}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-4 transition-all cursor-pointer',
                      checked
                        ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
                        : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 dark:border-gray-700 dark:hover:border-amber-700'
                    )}
                    onClick={() => handleBooleanChange(field)}
                  >
                    <Checkbox
                      id={field}
                      checked={checked}
                      onCheckedChange={() => handleBooleanChange(field)}
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor={field}
                      className={cn(
                        'flex-1 cursor-pointer text-sm font-medium',
                        checked && 'text-green-700 dark:text-green-400'
                      )}
                    >
                      {fieldInfo.label}
                    </Label>
                    {checked && (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
      
      {/* Negative Habits (things to avoid) */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🚫</span> Things to Avoid
          </CardTitle>
          <CardDescription>
            Check if you slipped up today (leave unchecked for a win!)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {['alcoholUsed', 'weedUsed', 'fastFood'].map((field) => {
              const fieldInfo = DAILY_LOG_FIELDS[field as DailyLogField];
              const checked = dailyLog[field as keyof typeof dailyLog] as boolean;
              return (
                <div
                  key={field}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-4 transition-all cursor-pointer',
                    checked
                      ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30'
                      : 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                  )}
                  onClick={() => handleBooleanChange(field as DailyLogField)}
                >
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={() => handleBooleanChange(field as DailyLogField)}
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor={field}
                    className={cn(
                      'flex-1 cursor-pointer text-sm font-medium',
                      checked ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                    )}
                  >
                    {fieldInfo.label}
                  </Label>
                  {!checked && (
                    <span className="text-green-600 text-xs font-medium">Clean! ✓</span>
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
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => checkIn(dateStr)}
          disabled={dailyLog.checkedIn}
          className={cn(
            'min-w-[200px] text-lg font-semibold transition-all',
            dailyLog.checkedIn
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
          )}
        >
          {dailyLog.checkedIn ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Day Checked In ✓
            </>
          ) : (
            'Complete Check-in'
          )}
        </Button>
      </div>
      
      {dailyLog.checkedIn && (
        <p className="text-center text-sm text-green-600 dark:text-green-400">
          ✨ This day is locked in! Your data counts towards weekly and monthly goals.
        </p>
      )}
    </div>
  );
}
