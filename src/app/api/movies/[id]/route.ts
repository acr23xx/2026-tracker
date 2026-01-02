import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET a single movie
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
    });
    
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}

// PUT update a movie
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const movie = await prisma.movie.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
  }
}

// DELETE a movie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await prisma.movie.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}

