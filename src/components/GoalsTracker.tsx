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
        <p className="text-muted-foreground">
          These count as bingo squares when completed
        </p>
      </div>
      
      {/* Progress Card */}
      <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 dark:border-teal-800">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-teal-900 dark:text-teal-100">
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
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Loading goals...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {oneTimeGoals.map((goal) => (
            <Card 
              key={goal.id} 
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                goal.completed 
                  ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30' 
                  : 'hover:border-teal-300 hover:bg-teal-50/50 dark:hover:border-teal-700'
              )}
              onClick={() => toggleGoalComplete(goal.id)}
            >
              <CardContent className="flex items-center gap-4 pt-6">
                <button className="transition-transform hover:scale-110">
                  {goal.completed ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <Circle className="h-8 w-8 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={cn(
                    'font-medium text-lg',
                    goal.completed && 'line-through text-muted-foreground'
                  )}>
                    {goal.title}
                  </p>
                  {goal.completed && goal.dateCompleted && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      ✓ Completed on {format(new Date(goal.dateCompleted), 'MMMM d, yyyy')}
                    </p>
                  )}
                </div>
                {goal.completed && (
                  <Trophy className="h-6 w-6 text-amber-500" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Info Card */}
      <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💡</span> How One-Time Goals Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Each goal counts as a <strong>bingo square</strong> on your board</p>
          <p>• Click a goal to mark it complete (or undo)</p>
          <p>• Completing goals helps you get <strong>BINGO</strong> (5 in a row)!</p>
        </CardContent>
      </Card>
    </div>
  );
}
