'use client';

import { format } from 'date-fns';
import { Circle, CheckCircle2, Trophy } from 'lucide-react';
import { useTrackerStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function GoalsTracker() {
  const { oneTimeGoals, toggleGoalComplete } = useTrackerStore();

  const completedGoals = oneTimeGoals.filter((g) => g.completed).length;
  const totalGoals = oneTimeGoals.length;
  const progress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">🎯</span> One-Time Goals
        </h2>
        <p className="text-slate-400">
          These count as bingo squares when completed
        </p>
      </div>

      {/* Progress Card */}
      <Card className="border-2 border-teal-700/50 bg-teal-950/30">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-teal-200">
                {completedGoals} / {totalGoals} goals completed
              </span>
              <span className="text-2xl">{completedGoals === totalGoals && totalGoals > 0 ? '🏆' : '🎯'}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      {oneTimeGoals.length === 0 ? (
        <Card className="border-dashed border-white/[0.08]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-lg font-medium text-slate-400">Loading goals...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {oneTimeGoals.map((goal) => (
            <Card
              key={goal.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md hover:shadow-black/20',
                goal.completed
                  ? 'border-green-600/40 bg-green-950/20'
                  : 'hover:border-teal-500/40 hover:bg-teal-950/10'
              )}
              onClick={() => toggleGoalComplete(goal.id)}
            >
              <CardContent className="flex items-center gap-4 pt-6">
                <button className="transition-transform hover:scale-110">
                  {goal.completed ? (
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  ) : (
                    <Circle className="h-8 w-8 text-slate-500" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={cn(
                    'font-medium text-lg',
                    goal.completed && 'line-through text-slate-500'
                  )}>
                    {goal.title}
                  </p>
                  {goal.completed && goal.dateCompleted && (
                    <p className="text-sm text-green-400 mt-1">
                      ✓ Completed on {format(new Date(goal.dateCompleted), 'MMMM d, yyyy')}
                    </p>
                  )}
                </div>
                {goal.completed && (
                  <Trophy className="h-6 w-6 text-blue-400" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-950/30 border-blue-700/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💡</span> How One-Time Goals Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>• Each goal counts as a <strong className="text-slate-200">bingo square</strong> on your board</p>
          <p>• Click a goal to mark it complete (or undo)</p>
          <p>• Completing goals helps you get <strong className="text-slate-200">BINGO</strong> (5 in a row)!</p>
        </CardContent>
      </Card>
    </div>
  );
}
