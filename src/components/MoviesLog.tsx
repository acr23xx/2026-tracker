'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Film, Pencil } from 'lucide-react';
import { useTrackerStore } from '@/lib/store';
import { Movie } from '@/lib/types';
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

export function MoviesLog() {
  const { movies, addMovie, updateMovie, deleteMovie } = useTrackerStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    releaseYear: 2026,
    dateWatched: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });
  
  const openAddDialog = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      releaseYear: 2026,
      dateWatched: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    });
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      releaseYear: movie.releaseYear,
      dateWatched: movie.dateWatched,
      notes: movie.notes,
    });
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    
    if (editingMovie) {
      await updateMovie(editingMovie.id, formData);
    } else {
      await addMovie(formData);
    }
    
    setIsDialogOpen(false);
    setEditingMovie(null);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(id);
    }
  };
  
  const sortedMovies = [...movies].sort(
    (a, b) => new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime()
  );
  
  const movies2026 = movies.filter(m => m.releaseYear === 2026);
  const target = 50;
  const progress = Math.min(100, (movies2026.length / target) * 100);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🎬</span> Movies Watched
          </h2>
          <p className="text-muted-foreground">
            Bingo Goal: Watch 50 movies released in 2026
          </p>
        </div>
        
        <Button 
          onClick={openAddDialog}
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Movie
        </Button>
      </div>
      
      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingMovie ? 'Edit Movie' : 'Add a New Movie'}</DialogTitle>
            <DialogDescription>
              {editingMovie ? 'Update the movie details' : 'Log a movie you\'ve watched (2026 releases count towards bingo!)'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter movie title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) || 2026 })}
                placeholder="2026"
              />
              <p className="text-xs text-muted-foreground">
                Only 2026 movies count towards the bingo goal
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date Watched</Label>
              <Input
                id="date"
                type="date"
                value={formData.dateWatched}
                onChange={(e) => setFormData({ ...formData, dateWatched: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Your thoughts on the movie..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
              {editingMovie ? 'Save Changes' : 'Add Movie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Progress Card */}
      <Card className="border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 dark:border-rose-800">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-semibold text-rose-900 dark:text-rose-100">
                  {movies2026.length} / {target} movies (2026)
                </span>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Total movies: {movies.length}
                </p>
              </div>
              <span className="text-2xl">{movies2026.length >= target ? '✅' : '🎥'}</span>
            </div>
            <Progress value={progress} className="h-3" />
            {movies2026.length >= target && (
              <p className="text-sm text-green-600 font-medium">🎉 Bingo square complete!</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Movies List */}
      {sortedMovies.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Film className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No movies logged yet</p>
            <p className="text-sm text-muted-foreground">Add your first movie to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedMovies.map((movie) => (
            <Card key={movie.id} className="group transition-all hover:shadow-md">
              <CardContent className="flex items-start gap-4 pt-6">
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg text-2xl',
                  movie.releaseYear === 2026 
                    ? 'bg-rose-100 dark:bg-rose-900' 
                    : 'bg-gray-100 dark:bg-gray-800'
                )}>
                  🎬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{movie.title}</h3>
                    {movie.releaseYear === 2026 && (
                      <Badge className="bg-rose-500 text-xs">2026</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Released: {movie.releaseYear} • Watched: {format(new Date(movie.dateWatched), 'MMM d, yyyy')}
                  </p>
                  {movie.notes && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{movie.notes}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(movie)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(movie.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
