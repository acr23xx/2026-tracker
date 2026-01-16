'use client';

import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval, startOfMonth } from 'date-fns';
import { useTrackerStore } from '@/lib/store';
import type { BingoSquare } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  Health: 'bg-green-500',
  Habits: 'bg-purple-500',
  Fitness: 'bg-blue-500',
  Food: 'bg-orange-500',
  Work: 'bg-slate-500',
  Media: 'bg-pink-500',
  Projects: 'bg-cyan-500',
  Tech: 'bg-indigo-500',
  Home: 'bg-amber-500',
  Wildcard: 'bg-yellow-400',
  Fun: 'bg-rose-500',
  Relationship: 'bg-red-500',
};

const CATEGORY_BG: Record<string, string> = {
  Health: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
  Habits: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
  Fitness: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  Food: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
  Work: 'bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800',
  Media: 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800',
  Projects: 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800',
  Tech: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800',
  Home: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
  Wildcard: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
  Fun: 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800',
  Relationship: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
};

export function Dashboard() {
  const { 
    dailyLogs, 
    getBingoSquares, 
    getCurrentStreak, 
    getWeeklySummary, 
    getMonthlySummary,
    getMinWeight,
    books,
    movies,
    sprints,
  } = useTrackerStore();
  
  const today = new Date();
  const bingoSquares = getBingoSquares();
  const currentStreak = getCurrentStreak();
  const weeklySummary = getWeeklySummary(today);
  const monthlySummary = getMonthlySummary(today);
  const minWeight = getMinWeight();
  
  const completedSquares = bingoSquares.filter(s => s.done).length;
  const totalSquares = bingoSquares.length;
  
  // Check for bingo lines
  const checkBingo = useMemo(() => {
    const grid: BingoSquare[][] = [];
    for (let i = 0; i < 5; i++) {
      grid.push(bingoSquares.slice(i * 5, (i + 1) * 5));
    }
    
    let bingos = 0;
    
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (grid[i].every(s => s.done)) bingos++;
    }
    
    // Check columns
    for (let j = 0; j < 5; j++) {
      if (grid.every(row => row[j].done)) bingos++;
    }
    
    // Check diagonals
    if ([0, 1, 2, 3, 4].every(i => grid[i][i].done)) bingos++;
    if ([0, 1, 2, 3, 4].every(i => grid[i][4 - i].done)) bingos++;
    
    return bingos;
  }, [bingoSquares]);
  
  // Last 7 days check-in data
  const last7Days = useMemo(() => {
    return eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    }).map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = dailyLogs[dateStr];
      return {
        date: format(day, 'EEE'),
        fullDate: dateStr,
        checkedIn: log?.checkedIn ? 1 : 0,
      };
    });
  }, [dailyLogs, today]);
  
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-linear-to-br from-amber-500 to-orange-500 dark:from-amber-700/80 dark:to-orange-700/80 text-white border-0">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 dark:text-amber-200/80 text-xs sm:text-sm font-medium">Current Streak</p>
                <p className="text-2xl sm:text-4xl font-bold">{currentStreak}</p>
                <p className="text-amber-100 dark:text-amber-200/80 text-xs sm:text-sm">days</p>
              </div>
              <span className="text-3xl sm:text-5xl">🔥</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-linear-to-br from-green-500 to-emerald-500 dark:from-green-700/80 dark:to-emerald-700/80 text-white border-0">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 dark:text-green-200/80 text-xs sm:text-sm font-medium">Bingo Squares</p>
                <p className="text-2xl sm:text-4xl font-bold">{completedSquares}/{totalSquares}</p>
                <p className="text-green-100 dark:text-green-200/80 text-xs sm:text-sm">completed</p>
              </div>
              <span className="text-3xl sm:text-5xl">✅</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-linear-to-br from-purple-500 to-pink-500 dark:from-purple-700/80 dark:to-pink-700/80 text-white border-0">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 dark:text-purple-200/80 text-xs sm:text-sm font-medium">Bingo Lines</p>
                <p className="text-2xl sm:text-4xl font-bold">{checkBingo}</p>
                <p className="text-purple-100 dark:text-purple-200/80 text-xs sm:text-sm">achieved</p>
              </div>
              <span className="text-3xl sm:text-5xl">🎯</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-linear-to-br from-blue-500 to-indigo-500 dark:from-blue-700/80 dark:to-indigo-700/80 text-white border-0">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 dark:text-blue-200/80 text-xs sm:text-sm font-medium">Min Weight</p>
                <p className="text-2xl sm:text-4xl font-bold">{minWeight || '---'}</p>
                <p className="text-blue-100 dark:text-blue-200/80 text-xs sm:text-sm">lbs</p>
              </div>
              <span className="text-3xl sm:text-5xl">⚖️</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly & Monthly Summary */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">📅 This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Check-ins</span>
              <Badge variant={weeklySummary.checkIns === 7 ? 'default' : 'secondary'}>
                {weeklySummary.checkIns}/{weeklySummary.daysInWeek}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Phone-free Evenings</span>
              <Badge variant={weeklySummary.isPhoneFreeWeek ? 'default' : 'secondary'}>
                {weeklySummary.phoneFreeEvenings} {weeklySummary.isPhoneFreeWeek && '✓'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg Screen Time</span>
              <Badge variant={weeklySummary.isScreenUnder4Week ? 'default' : 'secondary'}>
                {weeklySummary.avgScreenTime.toFixed(1)}h {weeklySummary.isScreenUnder4Week && '✓'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">📆 {monthlySummary.month}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Check-ins</span>
              <Badge variant={monthlySummary.checkIns === monthlySummary.daysInMonth ? 'default' : 'secondary'}>
                {monthlySummary.checkIns}/{monthlySummary.daysInMonth}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Weed this month</span>
              <Badge variant={monthlySummary.weedDays === 0 ? 'default' : 'outline'} className={monthlySummary.weedDays === 0 ? 'bg-green-500' : ''}>
                {monthlySummary.weedDays === 0 ? '✓ Clean!' : `${monthlySummary.weedDays} days`}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Alcohol this month</span>
              <Badge variant={monthlySummary.alcoholDays === 0 ? 'default' : 'outline'} className={monthlySummary.alcoholDays === 0 ? 'bg-green-500' : ''}>
                {monthlySummary.alcoholDays === 0 ? '✓ Clean!' : `${monthlySummary.alcoholDays} days`}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Fast food this month</span>
              <Badge variant={monthlySummary.fastFoodDays === 0 ? 'default' : 'outline'} className={monthlySummary.fastFoodDays === 0 ? 'bg-green-500' : ''}>
                {monthlySummary.fastFoodDays === 0 ? '✓ Clean!' : `${monthlySummary.fastFoodDays} days`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Last 7 Days Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 120 }}>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={last7Days}>
                <XAxis dataKey="date" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <Bar dataKey="checkedIn" radius={[4, 4, 0, 0]}>
                  {last7Days.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.checkedIn ? '#10b981' : '#e5e7eb'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Bingo Board */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span className="text-xl sm:text-2xl">🎯</span> 2026 Bingo Board
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Complete rows, columns, or diagonals for BINGO!
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {bingoSquares.map((square, index) => {
              const progress = square.target === 1 
                ? (square.done ? 100 : 0)
                : Math.min(100, (square.progress / square.target) * 100);
              
              return (
                <div
                  key={square.id}
                  className={cn(
                    'relative aspect-square rounded-md sm:rounded-lg border sm:border-2 p-1 sm:p-2 flex flex-col justify-between transition-all',
                    square.done 
                      ? 'bg-green-100 border-green-500 dark:bg-green-900/50 dark:border-green-500' 
                      : CATEGORY_BG[square.category] || 'bg-gray-100 border-gray-200'
                  )}
                >
                  {/* Category badge - hidden on very small screens */}
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      'hidden xs:inline text-[6px] sm:text-[8px] font-bold px-0.5 sm:px-1 py-0.5 rounded text-white truncate max-w-[90%]',
                      CATEGORY_COLORS[square.category] || 'bg-gray-500'
                    )}>
                      {square.category}
                    </span>
                    {square.done && <span className="text-[10px] sm:text-sm absolute top-0.5 right-0.5 sm:top-1 sm:right-1">✅</span>}
                  </div>
                  
                  {/* Title */}
                  <p className="text-[7px] sm:text-[9px] font-medium leading-tight line-clamp-2 sm:line-clamp-3 text-center px-0.5">
                    {square.title}
                  </p>
                  
                  {/* Progress */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="h-0.5 sm:h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          'h-full transition-all',
                          square.done ? 'bg-green-500' : 'bg-amber-500'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[6px] sm:text-[8px] text-center text-muted-foreground">
                      {square.target === 1 
                        ? (square.done ? '✓' : '—')
                        : `${square.progress}/${square.target}`
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900 text-2xl">
                📚
              </div>
              <div>
                <p className="text-2xl font-bold">{books.length}</p>
                <p className="text-sm text-muted-foreground">books read (goal: 5)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900 text-2xl">
                🎬
              </div>
              <div>
                <p className="text-2xl font-bold">{movies.length}</p>
                <p className="text-sm text-muted-foreground">movies watched (goal: 50)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 text-2xl">
                🏃
              </div>
              <div>
                <p className="text-2xl font-bold">{sprints.filter(s => s.points >= 10).length}</p>
                <p className="text-sm text-muted-foreground">10pt sprints (goal: 10)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
