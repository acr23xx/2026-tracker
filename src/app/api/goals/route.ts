import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const DEFAULT_GOALS = [
  { id: 'tv-app', title: 'Create TV show tracking app' },
  { id: 'office-walls', title: 'Hang stuff on office walls' },
  { id: 'dentist', title: 'Go to the Dentist' },
  { id: 'doctor', title: 'Go to the Doctor' },
  { id: 'clothes', title: 'Get rid of clothes that do not fit or do not wear' },
  { id: 'dynasty-algo', title: 'Create a dynasty salary algorithm' },
];

// GET all goals (creates defaults if none exist)
export async function GET() {
  try {
    let goals = await prisma.oneTimeGoal.findMany({
      orderBy: { id: 'asc' },
    });
    
    // Initialize default goals if none exist
    if (goals.length === 0) {
      await prisma.oneTimeGoal.createMany({
        data: DEFAULT_GOALS.map(g => ({
          id: g.id,
          title: g.title,
          completed: false,
        })),
      });
      goals = await prisma.oneTimeGoal.findMany({
        orderBy: { id: 'asc' },
      });
    }
    
    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

// POST create a new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const goal = await prisma.oneTimeGoal.create({
      data: body,
    });
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

