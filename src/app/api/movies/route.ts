import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all movies
export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { dateWatched: 'desc' },
    });
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

// POST create a movie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const movie = await prisma.movie.create({
      data: body,
    });
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}

