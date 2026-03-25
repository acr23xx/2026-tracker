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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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

  const target = 50;
  const progress = Math.min(100, (movies.length / target) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🎬</span> Movies Watched
          </h2>
          <p className="text-slate-400">
            Bingo Goal: Watch 50 movies
          </p>
        </div>

        <Button
          onClick={openAddDialog}
          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-900/30"
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
              {editingMovie ? 'Update the movie details' : 'Log a movie you\'ve watched'}
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
              <p className="text-xs text-slate-500">
                All movies count towards the bingo goal
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
      <Card className="border-2 border-rose-700/50 bg-rose-950/30">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-rose-200">
                {movies.length} / {target} movies
              </span>
              <span className="text-2xl">{movies.length >= target ? '✅' : '🎥'}</span>
            </div>
            <Progress value={progress} className="h-3" />
            {movies.length >= target && (
              <p className="text-sm text-green-400 font-medium">🎉 Bingo square complete!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Movies List */}
      {sortedMovies.length === 0 ? (
        <Card className="border-dashed border-white/[0.08]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Film className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-lg font-medium text-slate-400">No movies logged yet</p>
            <p className="text-sm text-slate-500">Add your first movie to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {sortedMovies.map((movie) => (
            <Card key={movie.id} className="group transition-all hover:shadow-md hover:shadow-black/20">
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-900/50 text-2xl">
                  🎬
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{movie.title}</h3>
                  <p className="text-sm text-slate-400">
                    Released: {movie.releaseYear} • Watched: {format(new Date(movie.dateWatched), 'MMM d, yyyy')}
                  </p>
                  {movie.notes && (
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2">{movie.notes}</p>
                  )}
                </div>
                <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(movie)}
                    className="text-slate-400 hover:text-white hover:bg-white/[0.06] h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(movie.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8 w-8 sm:h-10 sm:w-10"
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
