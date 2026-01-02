import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET a single goal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const goal = await prisma.oneTimeGoal.findUnique({
      where: { id },
    });
    
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 });
  }
}

// PUT update a goal (toggle complete)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const goal = await prisma.oneTimeGoal.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

// DELETE a goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await prisma.oneTimeGoal.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}

