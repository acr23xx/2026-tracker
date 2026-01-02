import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all books
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { dateFinished: 'desc' },
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST create a book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const book = await prisma.book.create({
      data: body,
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}

