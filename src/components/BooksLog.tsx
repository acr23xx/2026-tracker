'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, BookOpen, Pencil } from 'lucide-react';
import { useTrackerStore } from '@/lib/store';
import { Book } from '@/lib/types';
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

export function BooksLog() {
  const { books, addBook, updateBook, deleteBook } = useTrackerStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    dateFinished: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  const openAddDialog = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      dateFinished: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      dateFinished: book.dateFinished,
      notes: book.notes,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    if (editingBook) {
      await updateBook(editingBook.id, formData);
    } else {
      await addBook(formData);
    }

    setIsDialogOpen(false);
    setEditingBook(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id);
    }
  };

  const sortedBooks = [...books].sort(
    (a, b) => new Date(b.dateFinished).getTime() - new Date(a.dateFinished).getTime()
  );

  const target = 2;
  const progress = Math.min(100, (books.length / target) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">📚</span> Books Read
          </h2>
          <p className="text-slate-400">
            Bingo Goal: Read 2 books
          </p>
        </div>

        <Button
          onClick={openAddDialog}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-900/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add a New Book'}</DialogTitle>
            <DialogDescription>
              {editingBook ? 'Update the book details' : 'Log a book you\'ve finished reading'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter book title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Enter author name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date Finished</Label>
              <Input
                id="date"
                type="date"
                value={formData.dateFinished}
                onChange={(e) => setFormData({ ...formData, dateFinished: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Your thoughts on the book..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
              {editingBook ? 'Save Changes' : 'Add Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Card */}
      <Card className="border-2 border-indigo-700/50 bg-indigo-950/30">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-indigo-200">
                {books.length} / {target} books
              </span>
              <span className="text-2xl">{books.length >= target ? '✅' : '📖'}</span>
            </div>
            <Progress value={progress} className="h-3" />
            {books.length >= target && (
              <p className="text-sm text-green-400 font-medium">🎉 Bingo square complete!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      {sortedBooks.length === 0 ? (
        <Card className="border-dashed border-white/[0.08]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-lg font-medium text-slate-400">No books logged yet</p>
            <p className="text-sm text-slate-500">Add your first book to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedBooks.map((book, index) => (
            <Card key={book.id} className="group transition-all hover:shadow-md hover:shadow-black/20">
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-900/50 text-xl font-bold text-indigo-300">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{book.title}</h3>
                  <p className="text-sm text-slate-400">{book.author || 'Unknown Author'}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Finished: {format(new Date(book.dateFinished), 'MMM d, yyyy')}
                  </p>
                  {book.notes && (
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2">{book.notes}</p>
                  )}
                </div>
                <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(book)}
                    className="text-slate-400 hover:text-white hover:bg-white/[0.06] h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(book.id)}
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
