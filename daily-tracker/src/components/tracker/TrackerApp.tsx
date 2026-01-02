'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Navigation, TabType } from './Navigation';
import { DailyCheckIn } from './DailyCheckIn';
import { QuickStats } from './QuickStats';
import { WeeklyView } from './WeeklyView';
import { MonthlyView } from './MonthlyView';
import { StatsCharts } from './StatsCharts';
import { SettingsPanel } from './SettingsPanel';
import { useTrackerStore } from '@/lib/store';
import { formatDisplayDate, getGreeting } from '@/lib/helpers';

// Hook to handle hydration mismatch
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function TrackerApp() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const mounted = useHydrated();
  const { settings, getStreak } = useTrackerStore();

  useEffect(() => {
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const goToPreviousDay = () => {
    const date = parseISO(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(format(date, 'yyyy-MM-dd'));
  };

  const goToNextDay = () => {
    const date = parseISO(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(format(date, 'yyyy-MM-dd'));
  };

  const goToToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setActiveTab('today');
  };

  const streak = mounted ? getStreak() : 0;
  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4" />
          <div className="h-4 w-24 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Daily Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                {getGreeting()}{settings.name ? `, ${settings.name}` : ''}
              </p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2 bg-orange-500/10 text-orange-600 px-3 py-1.5 rounded-full">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-semibold">{streak} day streak</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-4">
        {activeTab === 'today' && (
          <div className="space-y-4">
            {/* Date Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">{formatDisplayDate(selectedDate)}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={parseISO(selectedDate)}
                    onSelect={(date) => date && setSelectedDate(format(date, 'yyyy-MM-dd'))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={goToNextDay}
                disabled={selectedDate >= format(new Date(), 'yyyy-MM-dd')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {!isToday && (
              <Button 
                variant="link" 
                onClick={goToToday}
                className="w-full text-xs"
              >
                Go to Today
              </Button>
            )}

            {/* Quick Stats */}
            <QuickStats date={selectedDate} />

            {/* Daily Check-in */}
            <DailyCheckIn date={selectedDate} />
          </div>
        )}

        {activeTab === 'week' && (
          <WeeklyView onDateSelect={handleDateSelect} />
        )}

        {activeTab === 'month' && (
          <MonthlyView onDateSelect={handleDateSelect} />
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Trends & Insights</h2>
            <p className="text-sm text-muted-foreground">
              Last 14 days of tracking data
            </p>
            <StatsCharts />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Settings</h2>
            <SettingsPanel />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
