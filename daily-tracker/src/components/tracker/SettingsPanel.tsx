'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTrackerStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const habitIcons = ['🧘', '📚', '📝', '💊', '✨', '🚫', '💪', '🏃', '💧', '🥗', '😴', '🎯', '🧠', '💻', '🎨', '🎵', '🌱', '☀️'];

interface SettingsPanelProps {
  className?: string;
}

export function SettingsPanel({ className }: SettingsPanelProps) {
  const { settings, updateSettings, habits, addHabit, deleteHabit } = useTrackerStore();
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('🎯');
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({
        name: newHabitName.trim(),
        icon: newHabitIcon,
        color: 'blue',
        frequency: 'daily',
      });
      setNewHabitName('');
      setNewHabitIcon('🎯');
      setIsAddingHabit(false);
    }
  };

  const activeHabits = habits.filter((h) => !h.archived);

  return (
    <div className={cn('space-y-6 pb-20', className)}>
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>Personalize your tracker</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input
              placeholder="Enter your name"
              value={settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(v) => updateSettings({ theme: v as 'light' | 'dark' | 'system' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Week Starts On</Label>
            <Select
              value={settings.weekStartsOn.toString()}
              onValueChange={(v) => updateSettings({ weekStartsOn: parseInt(v) as 0 | 1 })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Goals Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Goals</CardTitle>
          <CardDescription>Set your targets for tracking progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sleep (hours)</Label>
              <Input
                type="number"
                min={4}
                max={12}
                value={settings.goals.sleepHours}
                onChange={(e) => updateSettings({ 
                  goals: { ...settings.goals, sleepHours: parseFloat(e.target.value) || 8 }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Water (glasses)</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={settings.goals.waterGlasses}
                onChange={(e) => updateSettings({ 
                  goals: { ...settings.goals, waterGlasses: parseInt(e.target.value) || 8 }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Exercise (min)</Label>
              <Input
                type="number"
                min={10}
                max={180}
                step={5}
                value={settings.goals.exerciseMinutes}
                onChange={(e) => updateSettings({ 
                  goals: { ...settings.goals, exerciseMinutes: parseInt(e.target.value) || 30 }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Steps</Label>
              <Input
                type="number"
                min={1000}
                max={30000}
                step={1000}
                value={settings.goals.steps}
                onChange={(e) => updateSettings({ 
                  goals: { ...settings.goals, steps: parseInt(e.target.value) || 10000 }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Focus (hours)</Label>
              <Input
                type="number"
                min={1}
                max={12}
                step={0.5}
                value={settings.goals.focusHours}
                onChange={(e) => updateSettings({ 
                  goals: { ...settings.goals, focusHours: parseFloat(e.target.value) || 4 }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tracking Categories</CardTitle>
          <CardDescription>Enable or disable tracking sections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.enabledCategories).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="capitalize">{key}</Label>
              <Switch
                checked={enabled}
                onCheckedChange={(v) => updateSettings({
                  enabledCategories: { ...settings.enabledCategories, [key]: v }
                })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Habits Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Habits</CardTitle>
          <CardDescription>Manage your daily habits to track</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeHabits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{habit.icon}</span>
                <span className="font-medium">{habit.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteHabit(habit.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {isAddingHabit ? (
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Habit Name</Label>
                <Input
                  placeholder="e.g., Meditation"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {habitIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewHabitIcon(icon)}
                      className={cn(
                        'w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all',
                        newHabitIcon === icon
                          ? 'bg-primary/20 ring-2 ring-primary'
                          : 'bg-muted hover:bg-muted/80'
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddHabit} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Habit
                </Button>
                <Button variant="outline" onClick={() => setIsAddingHabit(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsAddingHabit(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data</CardTitle>
          <CardDescription>Export or import your tracking data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your data is stored locally on your device. Make sure to export regularly for backup.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const data = localStorage.getItem('daily-tracker-storage');
                if (data) {
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `daily-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }
              }}
            >
              Export Data
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      try {
                        const data = e.target?.result as string;
                        localStorage.setItem('daily-tracker-storage', data);
                        window.location.reload();
                      } catch {
                        alert('Invalid backup file');
                      }
                    };
                    reader.readAsText(file);
                  }
                };
                input.click();
              }}
            >
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
