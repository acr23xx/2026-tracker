import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all daily logs or by date
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  
  try {
    if (date) {
      const log = await prisma.dailyLog.findUnique({
        where: { date },
      });
      return NextResponse.json(log);
    }
    
    const logs = await prisma.dailyLog.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch daily logs' }, { status: 500 });
  }
}

// POST create or update daily log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, ...data } = body;
    
    const log = await prisma.dailyLog.upsert({
      where: { date },
      update: data,
      create: { date, ...data },
    });
    
    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save daily log' }, { status: 500 });
  }
}

// DELETE a daily log
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  
  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }
  
  try {
    await prisma.dailyLog.delete({
      where: { date },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete daily log' }, { status: 500 });
  }
}

