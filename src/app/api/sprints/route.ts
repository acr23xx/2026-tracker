import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all sprints
export async function GET() {
  try {
    const sprints = await prisma.sprint.findMany({
      orderBy: { startDate: 'desc' },
    });
    return NextResponse.json(sprints);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 });
  }
}

// POST create a sprint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sprint = await prisma.sprint.create({
      data: body,
    });
    return NextResponse.json(sprint);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sprint' }, { status: 500 });
  }
}

