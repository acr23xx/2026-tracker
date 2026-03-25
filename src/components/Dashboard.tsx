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
  Media: 'bg-pink-500',
  Projects: 'bg-cyan-500',
  Tech: 'bg-indigo-500',
  Home: 'bg-amber-500',
  Wildcard: 'bg-yellow-500',
  Fun: 'bg-rose-500',
  Finance: 'bg-emerald-500',
  TBD: 'bg-gray-500',
};

const CATEGORY_BG: Record<string, string> = {
  Health: 'bg-green-900/30 border-green-500/40',
  Habits: 'bg-purple-900/30 border-purple-500/40',
  Fitness: 'bg-blue-900/30 border-blue-500/40',
  Food: 'bg-orange-900/30 border-orange-500/40',
  Media: 'bg-pink-900/30 border-pink-500/40',
  Projects: 'bg-cyan-900/30 border-cyan-500/40',
  Tech: 'bg-indigo-900/30 border-indigo-500/40',
  Home: 'bg-amber-900/30 border-amber-500/40',
  Wildcard: 'bg-yellow-900/30 border-yellow-500/40',
  Fun: 'bg-rose-900/30 border-rose-500/40',
  Finance: 'bg-emerald-900/30 border-emerald-500/40',
  TBD: 'bg-gray-700/30 border-gray-500/40',
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
  } = useTrackerStore();

  const today = new Date();
  const bingoSquares = getBingoSquares();
  const currentStreak = getCurrentStreak();
  const weeklySummary = getWeeklySummary(today);
  const monthlySummary = getMonthlySummary(today);
  const minWeight = getMinWeight();

  const completedSquares = bingoSquares.filter(s => s.done).length;
  const totalSquares = bingoSquares.length;

  const checkBingo = useMemo(() => {
    const grid: BingoSquare[][] = [];
    for (let i = 0; i < 5; i++) {
      grid.push(bingoSquares.slice(i * 5, (i + 1) * 5));
    }

    let bingos = 0;
    for (let i = 0; i < 5; i++) {
      if (grid[i].every(s => s.done)) bingos++;
    }
    for (let j = 0; j < 5; j++) {
      if (grid.every(row => row[j].done)) bingos++;
    }
    if ([0, 1, 2, 3, 4].every(i => grid[i][i].done)) bingos++;
    if ([0, 1, 2, 3, 4].every(i => grid[i][4 - i].done)) bingos++;

    return bingos;
  }, [bingoSquares]);

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
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/30">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-xs sm:text-sm font-medium">Current Streak</p>
                <p className="text-2xl sm:text-4xl font-bold">{currentStreak}</p>
                <p className="text-blue-200 text-xs sm:text-sm">days</p>
              </div>
              <span className="text-3xl sm:text-5xl">🔥</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-green-700 text-white border-0 shadow-lg shadow-emerald-900/30">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-xs sm:text-sm font-medium">Bingo Squares</p>
                <p className="text-2xl sm:text-4xl font-bold">{completedSquares}/{totalSquares}</p>
                <p className="text-emerald-200 text-xs sm:text-sm">completed</p>
              </div>
              <span className="text-3xl sm:text-5xl">✅</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-violet-700 text-white border-0 shadow-lg shadow-purple-900/30">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs sm:text-sm font-medium">Bingo Lines</p>
                <p className="text-2xl sm:text-4xl font-bold">{checkBingo}</p>
                <p className="text-purple-200 text-xs sm:text-sm">achieved</p>
              </div>
              <span className="text-3xl sm:text-5xl">🎯</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky-600 to-cyan-700 text-white border-0 shadow-lg shadow-sky-900/30">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-200 text-xs sm:text-sm font-medium">Min Weight</p>
                <p className="text-2xl sm:text-4xl font-bold">{minWeight || '---'}</p>
                <p className="text-sky-200 text-xs sm:text-sm">lbs</p>
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
              <span className="text-sm text-slate-300">Check-ins</span>
              <Badge variant={weeklySummary.checkIns === 7 ? 'default' : 'secondary'}>
                {weeklySummary.checkIns}/{weeklySummary.daysInWeek}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Phone-free Evenings</span>
              <Badge variant={weeklySummary.isPhoneFreeWeek ? 'default' : 'secondary'}>
                {weeklySummary.phoneFreeEvenings} {weeklySummary.isPhoneFreeWeek && '✓'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Avg Screen Time</span>
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
              <span className="text-sm text-slate-300">Check-ins</span>
              <Badge variant={monthlySummary.checkIns === monthlySummary.daysInMonth ? 'default' : 'secondary'}>
                {monthlySummary.checkIns}/{monthlySummary.daysInMonth}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Weed this month</span>
              <Badge variant={monthlySummary.weedDays === 0 ? 'default' : 'outline'} className={monthlySummary.weedDays === 0 ? 'bg-emerald-600 text-white border-0' : ''}>
                {monthlySummary.weedDays === 0 ? '✓ Clean!' : `${monthlySummary.weedDays} days`}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Alcohol this month</span>
              <Badge variant={monthlySummary.alcoholDays === 0 ? 'default' : 'outline'} className={monthlySummary.alcoholDays === 0 ? 'bg-emerald-600 text-white border-0' : ''}>
                {monthlySummary.alcoholDays === 0 ? '✓ Clean!' : `${monthlySummary.alcoholDays} days`}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Fast food this month</span>
              <Badge variant={monthlySummary.fastFoodDays === 0 ? 'default' : 'outline'} className={monthlySummary.fastFoodDays === 0 ? 'bg-emerald-600 text-white border-0' : ''}>
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
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Bar dataKey="checkedIn" radius={[4, 4, 0, 0]}>
                  {last7Days.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.checkedIn ? '#3b82f6' : '#1e293b'}
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
          <CardDescription>
            Complete rows, columns, or diagonals for BINGO!
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {bingoSquares.map((square) => {
              const progress = square.target === 1
                ? (square.done ? 100 : 0)
                : Math.min(100, (square.progress / square.target) * 100);

              return (
                <div
                  key={square.id}
                  className={cn(
                    'relative aspect-square rounded-lg border-2 p-1.5 sm:p-2 flex flex-col justify-between transition-all',
                    square.done
                      ? 'bg-green-900/40 border-green-400/60 shadow-sm shadow-green-500/10'
                      : cn(CATEGORY_BG[square.category] || 'bg-gray-700/30 border-gray-500/40', 'hover:border-white/30')
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      'text-[5px] sm:text-[8px] font-bold px-0.5 sm:px-1 py-0.5 rounded text-white truncate max-w-[90%]',
                      CATEGORY_COLORS[square.category] || 'bg-gray-500'
                    )}>
                      {square.category}
                    </span>
                    {square.done && <span className="text-[10px] sm:text-sm absolute top-0.5 right-0.5 sm:top-1 sm:right-1">✅</span>}
                  </div>

                  <p className="text-[7px] sm:text-[9px] font-medium leading-tight line-clamp-2 sm:line-clamp-3 text-center px-0.5 text-white/90">
                    {square.title}
                  </p>

                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="h-1 sm:h-1.5 bg-white/15 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          square.done ? 'bg-green-400' : 'bg-blue-400'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[6px] sm:text-[8px] text-center text-slate-300">
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
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-900/50 text-2xl">
                📚
              </div>
              <div>
                <p className="text-2xl font-bold">{books.length}</p>
                <p className="text-sm text-slate-400">books read (goal: 2)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-900/50 text-2xl">
                🎬
              </div>
              <div>
                <p className="text-2xl font-bold">{movies.length}</p>
                <p className="text-sm text-slate-400">movies watched (goal: 50)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
