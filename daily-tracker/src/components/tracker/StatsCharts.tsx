'use client';

import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrackerStore } from '@/lib/store';
import { chartColors } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface StatsChartsProps {
  className?: string;
}

export function StatsCharts({ className }: StatsChartsProps) {
  const { entries } = useTrackerStore();

  // Get last 14 days of data
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = entries.find((e) => e.date === dateStr);
      
      data.push({
        date: format(date, 'MMM d'),
        fullDate: dateStr,
        sleep: entry?.sleepHours || null,
        mood: entry ? (entry.morningMood + entry.eveningMood) / 2 : null,
        energy: entry?.energyLevel || null,
        stress: entry?.stressLevel || null,
        productivity: entry?.productivityScore || null,
        exercise: entry?.exerciseMinutes || 0,
        water: entry?.waterGlasses || 0,
        focus: entry?.focusHours || 0,
      });
    }
    return data;
  }, [entries]);

  const hasData = entries.length > 0;

  if (!hasData) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Start logging your days to see trends and insights here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="productivity">Work</TabsTrigger>
        </TabsList>

        <TabsContent value="mood" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Mood & Energy Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[1, 5]} 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke={chartColors.mood}
                      strokeWidth={2}
                      dot={{ fill: chartColors.mood, strokeWidth: 0 }}
                      connectNulls
                      name="Mood"
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke={chartColors.energy}
                      strokeWidth={2}
                      dot={{ fill: chartColors.energy, strokeWidth: 0 }}
                      connectNulls
                      name="Energy"
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke={chartColors.stress}
                      strokeWidth={2}
                      dot={{ fill: chartColors.stress, strokeWidth: 0 }}
                      connectNulls
                      name="Stress"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.mood }} />
                  <span className="text-xs text-muted-foreground">Mood</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.energy }} />
                  <span className="text-xs text-muted-foreground">Energy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.stress }} />
                  <span className="text-xs text-muted-foreground">Stress</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sleep Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[0, 12]} 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      unit="h"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [`${value}h`, 'Sleep']}
                    />
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.sleep} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColors.sleep} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="sleep"
                      stroke={chartColors.sleep}
                      strokeWidth={2}
                      fill="url(#sleepGradient)"
                      connectNulls
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fitness" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Exercise & Hydration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      unit="m"
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="exercise"
                      fill={chartColors.exercise}
                      radius={[4, 4, 0, 0]}
                      name="Exercise (min)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="water"
                      fill={chartColors.water}
                      radius={[4, 4, 0, 0]}
                      name="Water (glasses)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.exercise }} />
                  <span className="text-xs text-muted-foreground">Exercise (min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.water }} />
                  <span className="text-xs text-muted-foreground">Water (glasses)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Productivity & Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      domain={[1, 5]} 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      unit="h"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="productivity"
                      stroke={chartColors.productivity}
                      strokeWidth={2}
                      dot={{ fill: chartColors.productivity, strokeWidth: 0 }}
                      connectNulls
                      name="Productivity Score"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="focus"
                      fill={chartColors.habits}
                      radius={[4, 4, 0, 0]}
                      name="Focus Hours"
                      opacity={0.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.productivity }} />
                  <span className="text-xs text-muted-foreground">Productivity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.habits }} />
                  <span className="text-xs text-muted-foreground">Focus Hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
