import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - Export all data as JSON
export async function GET() {
  try {
    const [dailyLogs, books, movies, goals] = await Promise.all([
      prisma.dailyLog.findMany({ orderBy: { date: 'asc' } }),
      prisma.book.findMany({ orderBy: { dateFinished: 'asc' } }),
      prisma.movie.findMany({ orderBy: { dateWatched: 'asc' } }),
      prisma.oneTimeGoal.findMany({ orderBy: { id: 'asc' } }),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: {
        dailyLogs,
        books,
        movies,
        goals,
      },
    };

    return NextResponse.json(backup);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}

// POST - Import data from JSON backup
export async function POST(request: NextRequest) {
  try {
    const backup = await request.json();
    const { dailyLogs, books, movies, goals } = backup.data;

    // Clear existing data
    await Promise.all([
      prisma.dailyLog.deleteMany(),
      prisma.book.deleteMany(),
      prisma.movie.deleteMany(),
      prisma.oneTimeGoal.deleteMany(),
    ]);

    // Import new data
    if (dailyLogs?.length) {
      await prisma.dailyLog.createMany({
        data: dailyLogs.map((log: any) => ({
          ...log,
          createdAt: new Date(log.createdAt),
          updatedAt: new Date(log.updatedAt),
        })),
      });
    }

    if (books?.length) {
      await prisma.book.createMany({
        data: books.map((book: any) => ({
          ...book,
          createdAt: new Date(book.createdAt),
          updatedAt: new Date(book.updatedAt),
        })),
      });
    }

    if (movies?.length) {
      await prisma.movie.createMany({
        data: movies.map((movie: any) => ({
          ...movie,
          createdAt: new Date(movie.createdAt),
          updatedAt: new Date(movie.updatedAt),
        })),
      });
    }

    if (goals?.length) {
      await prisma.oneTimeGoal.createMany({
        data: goals.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt),
        })),
      });
    }

    return NextResponse.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
  }
}
