'use client';

import { Moon, Zap, Target, Sparkles, Flame, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTrackerStore } from '@/lib/store';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  progress?: number;
}

function StatCard({ icon, label, value, subValue, color, progress }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={cn('p-2 rounded-lg', color)}>
            {icon}
          </div>
          {progress !== undefined && (
            <span className="text-xs text-muted-foreground">{progress}%</span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-2 w-full bg-muted rounded-full h-1.5">
            <div
              className={cn('h-full rounded-full transition-all', color.replace('bg-', 'bg-').replace('/10', ''))}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickStatsProps {
  date?: string;
  className?: string;
}

export function QuickStats({ date, className }: QuickStatsProps) {
  const { getEntry, habits, settings, getStreak } = useTrackerStore();
  
  const today = date || format(new Date(), 'yyyy-MM-dd');
  const entry = getEntry(today);
  const streak = getStreak();
  
  const activeHabits = habits.filter((h) => !h.archived);
  const completedHabits = entry ? Object.values(entry.habits).filter(Boolean).length : 0;
  const habitProgress = activeHabits.length > 0 
    ? Math.round((completedHabits / activeHabits.length) * 100) 
    : 0;

  const sleepProgress = entry 
    ? Math.round((entry.sleepHours / settings.goals.sleepHours) * 100) 
    : 0;

  const waterProgress = entry 
    ? Math.round((entry.waterGlasses / settings.goals.waterGlasses) * 100) 
    : 0;

  const avgMood = entry 
    ? Math.round(((entry.morningMood + entry.eveningMood) / 2) * 10) / 10 
    : 0;

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      <StatCard
        icon={<Moon className="h-4 w-4 text-violet-500" />}
        label="Sleep"
        value={entry?.sleepHours || 0}
        subValue={`Goal: ${settings.goals.sleepHours}h`}
        color="bg-violet-500/10"
        progress={sleepProgress}
      />
      <StatCard
        icon={<Zap className="h-4 w-4 text-amber-500" />}
        label="Avg Mood"
        value={avgMood || '-'}
        subValue="out of 5"
        color="bg-amber-500/10"
      />
      <StatCard
        icon={<Target className="h-4 w-4 text-blue-500" />}
        label="Productivity"
        value={entry?.productivityScore || '-'}
        subValue="out of 5"
        color="bg-blue-500/10"
      />
      <StatCard
        icon={<Sparkles className="h-4 w-4 text-purple-500" />}
        label="Habits"
        value={`${completedHabits}/${activeHabits.length}`}
        subValue="completed"
        color="bg-purple-500/10"
        progress={habitProgress}
      />
      <StatCard
        icon={<Flame className="h-4 w-4 text-orange-500" />}
        label="Streak"
        value={streak}
        subValue="days"
        color="bg-orange-500/10"
      />
      <StatCard
        icon={<Droplets className="h-4 w-4 text-cyan-500" />}
        label="Water"
        value={entry?.waterGlasses || 0}
        subValue={`Goal: ${settings.goals.waterGlasses}`}
        color="bg-cyan-500/10"
        progress={waterProgress}
      />
    </div>
  );
}
