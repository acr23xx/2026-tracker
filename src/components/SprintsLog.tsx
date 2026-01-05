'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Target, Trophy, Pencil } from 'lucide-react';
import { useTrackerStore } from '@/lib/store';
import { Sprint } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function SprintsLog() {
  const { sprints, addSprint, updateSprint, deleteSprint } = useTrackerStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    points: 0,
    notes: '',
  });
  
  const openAddDialog = () => {
    setEditingSprint(null);
    setFormData({
      name: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      points: 0,
      notes: '',
    });
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setFormData({
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      points: sprint.points,
      notes: sprint.notes,
    });
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    
    if (editingSprint) {
      await updateSprint(editingSprint.id, formData);
    } else {
      await addSprint(formData);
    }
    
    setIsDialogOpen(false);
    setEditingSprint(null);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sprint?')) {
      await deleteSprint(id);
    }
  };
  
  const handlePointsChange = async (id: string, points: number) => {
    await updateSprint(id, { points });
  };
  
  const sortedSprints = [...sprints].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  const sprintsWith10Points = sprints.filter(s => s.points >= 10).length;
  const target = 10;
  const progress = Math.min(100, (sprintsWith10Points / target) * 100);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🏃</span> Sprints
          </h2>
          <p className="text-muted-foreground">
            Bingo Goal: Get 10+ points in a sprint 10 times
          </p>
        </div>
        
        <Button 
          onClick={openAddDialog}
          className="bg-linear-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Sprint
        </Button>
      </div>
      
      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSprint ? 'Edit Sprint' : 'Create a New Sprint'}</DialogTitle>
            <DialogDescription>
              {editingSprint ? 'Update the sprint details' : 'Track a work sprint. Earn 10+ points to count towards your bingo goal!'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sprint Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sprint 1 - January"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Points Earned</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                You can update this later as the sprint progresses
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Sprint goals, reflections..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
              {editingSprint ? 'Save Changes' : 'Create Sprint'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Progress Card */}
      <Card className="border-2 border-slate-200 bg-linear-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 dark:border-slate-800">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {sprintsWith10Points} / {target} sprints with 10+ points
              </span>
              <span className="text-2xl">{sprintsWith10Points >= target ? '✅' : '🎯'}</span>
            </div>
            <Progress value={progress} className="h-3" />
            {sprintsWith10Points >= target && (
              <p className="text-sm text-green-600 font-medium">🎉 Bingo square complete!</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Sprints List */}
      {sortedSprints.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No sprints yet</p>
            <p className="text-sm text-muted-foreground">Create your first sprint to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedSprints.map((sprint) => (
            <Card key={sprint.id} className={cn(
              'group transition-all hover:shadow-md',
              sprint.points >= 10 && 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
            )}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-lg text-xl font-bold',
                      sprint.points >= 10 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    )}>
                      {sprint.points}
                      <span className="text-xs ml-0.5">pts</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{sprint.name}</h3>
                        {sprint.points >= 10 && (
                          <Badge className="bg-green-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            10+ pts
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(sprint.startDate), 'MMM d')} - {format(new Date(sprint.endDate), 'MMM d, yyyy')}
                      </p>
                      {sprint.notes && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{sprint.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={sprint.points}
                      onChange={(e) => handlePointsChange(sprint.id, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(sprint)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sprint.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
