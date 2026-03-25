import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const DEFAULT_GOALS = [
  { id: 'tv-app', title: 'Create TV show tracking app' },
  { id: 'office-walls', title: 'Hang stuff on office walls' },
  { id: 'dentist', title: 'Go to the Dentist' },
  { id: 'doctor', title: 'Go to the Doctor' },
  { id: 'clothes', title: 'Get rid of clothes that do not fit or do not wear' },
  { id: 'construction-takeoffs', title: 'Create construction takeoffs site' },
  { id: 'savings-jan', title: '$300 to savings - January' },
  { id: 'savings-feb', title: '$300 to savings - February' },
  { id: 'savings-mar', title: '$300 to savings - March' },
  { id: 'savings-apr', title: '$300 to savings - April' },
  { id: 'savings-may', title: '$300 to savings - May' },
  { id: 'savings-jun', title: '$300 to savings - June' },
  { id: 'savings-jul', title: '$300 to savings - July' },
  { id: 'savings-aug', title: '$300 to savings - August' },
  { id: 'savings-sep', title: '$300 to savings - September' },
  { id: 'savings-oct', title: '$300 to savings - October' },
  { id: 'savings-nov', title: '$300 to savings - November' },
  { id: 'savings-dec', title: '$300 to savings - December' },
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
    } else {
      // Migrate dynasty-algo → construction-takeoffs if needed
      const hasDynasty = goals.find(g => g.id === 'dynasty-algo');
      const hasConstruction = goals.find(g => g.id === 'construction-takeoffs');
      if (hasDynasty && !hasConstruction) {
        await prisma.oneTimeGoal.update({
          where: { id: 'dynasty-algo' },
          data: { id: 'construction-takeoffs', title: 'Create construction takeoffs site' },
        });
      }

      // Add any missing goals (e.g. savings months)
      const existingIds = new Set(goals.map(g => g.id));
      const missingGoals = DEFAULT_GOALS.filter(g => !existingIds.has(g.id) && g.id !== 'dynasty-algo');
      if (missingGoals.length > 0) {
        await prisma.oneTimeGoal.createMany({
          data: missingGoals.map(g => ({
            id: g.id,
            title: g.title,
            completed: false,
          })),
        });
      }

      if (hasDynasty || missingGoals.length > 0) {
        goals = await prisma.oneTimeGoal.findMany({
          orderBy: { id: 'asc' },
        });
      }
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
