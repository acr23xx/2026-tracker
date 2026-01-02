import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET a single sprint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id },
    });
    
    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }
    
    return NextResponse.json(sprint);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sprint' }, { status: 500 });
  }
}

// PUT update a sprint
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const sprint = await prisma.sprint.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(sprint);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sprint' }, { status: 500 });
  }
}

// DELETE a sprint
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await prisma.sprint.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sprint' }, { status: 500 });
  }
}

