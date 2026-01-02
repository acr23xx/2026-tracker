'use client';

import { useState } from 'react';
import {
  Moon,
  Sun,
  Dumbbell,
  Droplets,
  Target,
  Sparkles,
  MessageSquare,
  Clock,
  Footprints,
  Utensils,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RatingSelector } from './RatingSelector';
import { NumberInput } from './NumberInput';
import { HabitList } from './HabitList';
import { useTrackerStore } from '@/lib/store';
import { DailyEntry } from '@/lib/types';
import {
  moodLabels,
  energyLabels,
  stressLabels,
  sleepQualityLabels,
  productivityLabels,
  healthyEatingLabels,
  exerciseTypes,
  calculateProgress,
} from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface DailyCheckInProps {
  date: string;
  className?: string;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

function CollapsibleSection({ title, icon, children, defaultOpen = true, badge }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
      >
        <CardHeader className="flex flex-row items-center justify-between py-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {badge && (
              <Badge variant="secondary" className="ml-2">
                {badge}
              </Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </CardHeader>
      </button>
      {isOpen && <CardContent className="pt-0 pb-6">{children}</CardContent>}
    </Card>
  );
}

export function DailyCheckIn({ date, className }: DailyCheckInProps) {
  const { getOrCreateEntry, updateEntry, habits, settings } = useTrackerStore();
  const [gratitudeInput, setGratitudeInput] = useState('');

  // Get or create entry for the current date
  const entry = getOrCreateEntry(date);

  const updateField = <K extends keyof DailyEntry>(field: K, value: DailyEntry[K]) => {
    updateEntry(date, { [field]: value });
  };

  const handleToggleHabit = (habitId: string) => {
    const newHabits = {
      ...entry.habits,
      [habitId]: !entry.habits[habitId],
    };
    updateField('habits', newHabits);
  };

  const handleAddGratitude = () => {
    if (gratitudeInput.trim()) {
      const newGratitude = [...entry.gratitude, gratitudeInput.trim()];
      updateField('gratitude', newGratitude);
      setGratitudeInput('');
    }
  };

  const handleRemoveGratitude = (index: number) => {
    const newGratitude = entry.gratitude.filter((_, i) => i !== index);
    updateField('gratitude', newGratitude);
  };

  const completedHabits = Object.values(entry.habits).filter(Boolean).length;
  const totalHabits = habits.filter((h) => !h.archived).length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Sleep Section */}
      {settings.enabledCategories.sleep && (
        <CollapsibleSection
          title="Sleep"
          icon={<Moon className="h-5 w-5" />}
          badge={entry.sleepHours > 0 ? `${entry.sleepHours}h` : undefined}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Hours of Sleep</Label>
              <div className="flex items-center justify-center">
                <NumberInput
                  value={entry.sleepHours}
                  onChange={(v) => updateField('sleepHours', v)}
                  min={0}
                  max={24}
                  step={0.5}
                  unit="hrs"
                  size="lg"
                />
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-xs bg-muted rounded-full h-2">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      calculateProgress(entry.sleepHours, settings.goals.sleepHours) >= 100
                        ? 'bg-green-500'
                        : calculateProgress(entry.sleepHours, settings.goals.sleepHours) >= 75
                        ? 'bg-lime-500'
                        : 'bg-yellow-500'
                    )}
                    style={{ width: `${Math.min(100, calculateProgress(entry.sleepHours, settings.goals.sleepHours))}%` }}
                  />
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Goal: {settings.goals.sleepHours} hours
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Sleep Quality</Label>
              <RatingSelector
                value={entry.sleepQuality}
                onChange={(v) => updateField('sleepQuality', v)}
                labels={sleepQualityLabels}
                emojis={['😫', '😴', '😌', '😊', '🌟']}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Bed Time</Label>
                <Input
                  type="time"
                  value={entry.bedTime || ''}
                  onChange={(e) => updateField('bedTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Wake Time</Label>
                <Input
                  type="time"
                  value={entry.wakeTime || ''}
                  onChange={(e) => updateField('wakeTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Mood & Energy Section */}
      {settings.enabledCategories.mood && (
        <CollapsibleSection
          title="Mood & Energy"
          icon={<Sun className="h-5 w-5" />}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Morning Mood</Label>
              <RatingSelector
                value={entry.morningMood}
                onChange={(v) => updateField('morningMood', v)}
                labels={moodLabels}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Evening Mood</Label>
              <RatingSelector
                value={entry.eveningMood}
                onChange={(v) => updateField('eveningMood', v)}
                labels={moodLabels}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Energy Level</Label>
              <RatingSelector
                value={entry.energyLevel}
                onChange={(v) => updateField('energyLevel', v)}
                labels={energyLabels}
                emojis={['🔋', '🪫', '⚡', '💪', '🚀']}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Stress Level</Label>
              <RatingSelector
                value={entry.stressLevel}
                onChange={(v) => updateField('stressLevel', v)}
                labels={stressLabels}
                emojis={['😰', '😟', '😐', '😌', '🧘']}
              />
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Fitness Section */}
      {settings.enabledCategories.fitness && (
        <CollapsibleSection
          title="Health & Fitness"
          icon={<Dumbbell className="h-5 w-5" />}
          badge={entry.exercised ? '✓' : undefined}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Did you exercise?</Label>
              <Switch
                checked={entry.exercised}
                onCheckedChange={(v) => updateField('exercised', v)}
              />
            </div>

            {entry.exercised && (
              <>
                <div className="space-y-3">
                  <Label className="text-sm">Exercise Duration</Label>
                  <div className="flex justify-center">
                    <NumberInput
                      value={entry.exerciseMinutes}
                      onChange={(v) => updateField('exerciseMinutes', v)}
                      min={0}
                      max={300}
                      step={5}
                      unit="min"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Exercise Type</Label>
                  <Select
                    value={entry.exerciseType || ''}
                    onValueChange={(v) => updateField('exerciseType', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Footprints className="h-4 w-4" />
                Steps
              </Label>
              <div className="flex justify-center">
                <NumberInput
                  value={entry.steps}
                  onChange={(v) => updateField('steps', v)}
                  min={0}
                  max={100000}
                  step={500}
                />
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-xs bg-muted rounded-full h-2">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      calculateProgress(entry.steps, settings.goals.steps) >= 100
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    )}
                    style={{ width: `${Math.min(100, calculateProgress(entry.steps, settings.goals.steps))}%` }}
                  />
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Goal: {settings.goals.steps.toLocaleString()} steps
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Water (glasses)
              </Label>
              <div className="flex justify-center">
                <NumberInput
                  value={entry.waterGlasses}
                  onChange={(v) => updateField('waterGlasses', v)}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-xs bg-muted rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all"
                    style={{ width: `${Math.min(100, calculateProgress(entry.waterGlasses, settings.goals.waterGlasses))}%` }}
                  />
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Goal: {settings.goals.waterGlasses} glasses
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Healthy Eating
              </Label>
              <RatingSelector
                value={entry.healthyEating}
                onChange={(v) => updateField('healthyEating', v)}
                labels={healthyEatingLabels}
                emojis={['🍔', '🍕', '🥗', '🥑', '💚']}
              />
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Productivity Section */}
      {settings.enabledCategories.productivity && (
        <CollapsibleSection
          title="Productivity"
          icon={<Target className="h-5 w-5" />}
          badge={entry.tasksPlanned > 0 ? `${entry.tasksCompleted}/${entry.tasksPlanned}` : undefined}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Productivity Score</Label>
              <RatingSelector
                value={entry.productivityScore}
                onChange={(v) => updateField('productivityScore', v)}
                labels={productivityLabels}
                emojis={['😩', '😕', '🎯', '💪', '🔥']}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Focus Hours
              </Label>
              <div className="flex justify-center">
                <NumberInput
                  value={entry.focusHours}
                  onChange={(v) => updateField('focusHours', v)}
                  min={0}
                  max={16}
                  step={0.5}
                  unit="hrs"
                />
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-xs bg-muted rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.min(100, calculateProgress(entry.focusHours, settings.goals.focusHours))}%` }}
                  />
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Goal: {settings.goals.focusHours} hours
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Tasks Planned</Label>
                <div className="flex justify-center">
                  <NumberInput
                    value={entry.tasksPlanned}
                    onChange={(v) => updateField('tasksPlanned', v)}
                    min={0}
                    max={50}
                    step={1}
                    size="sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Tasks Completed</Label>
                <div className="flex justify-center">
                  <NumberInput
                    value={entry.tasksCompleted}
                    onChange={(v) => updateField('tasksCompleted', v)}
                    min={0}
                    max={entry.tasksPlanned || 50}
                    step={1}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Habits Section */}
      {settings.enabledCategories.habits && (
        <CollapsibleSection
          title="Daily Habits"
          icon={<Sparkles className="h-5 w-5" />}
          badge={totalHabits > 0 ? `${completedHabits}/${totalHabits}` : undefined}
        >
          <HabitList
            habits={habits}
            completedHabits={entry.habits}
            onToggle={handleToggleHabit}
          />
        </CollapsibleSection>
      )}

      {/* Gratitude Section */}
      {settings.enabledCategories.gratitude && (
        <CollapsibleSection
          title="Gratitude"
          icon={<span className="text-xl">🙏</span>}
          badge={entry.gratitude.length > 0 ? `${entry.gratitude.length}` : undefined}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="What are you grateful for today?"
                value={gratitudeInput}
                onChange={(e) => setGratitudeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGratitude()}
              />
              <Button type="button" onClick={handleAddGratitude} size="sm">
                Add
              </Button>
            </div>
            {entry.gratitude.length > 0 && (
              <ul className="space-y-2">
                {entry.gratitude.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGratitude(index)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Notes Section */}
      {settings.enabledCategories.notes && (
        <CollapsibleSection
          title="Notes & Reflections"
          icon={<MessageSquare className="h-5 w-5" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Today&apos;s Highlights</Label>
              <Textarea
                placeholder="What went well today?"
                value={entry.highlights}
                onChange={(e) => updateField('highlights', e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Challenges</Label>
              <Textarea
                placeholder="What challenges did you face?"
                value={entry.challenges}
                onChange={(e) => updateField('challenges', e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Additional Notes</Label>
              <Textarea
                placeholder="Any other thoughts..."
                value={entry.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
