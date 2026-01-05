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
    console.error('Failed to fetch movies:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch movies', details: message }, { status: 500 });
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
    console.error('Failed to create movie:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create movie', details: message }, { status: 500 });
  }
}

