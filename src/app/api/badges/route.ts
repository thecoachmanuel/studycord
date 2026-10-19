import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET() {
  try {
    const badges = await dbRepository.find('badges');
    return NextResponse.json({ success: true, data: badges });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, type = 'score', requirement = 100, reward_coins = 20, icon = 'dashing_debut', status = '1' } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Badge title is required' }, { status: 400 });
    }

    const newBadge = {
      id: String(Date.now()),
      title,
      type,
      requirement: Number(requirement),
      reward_coins: Number(reward_coins),
      icon,
      status: String(status),
    };

    const result = await dbRepository.insertOne('badges', newBadge);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Badge ID is required' }, { status: 400 });
    }

    const updated = await dbRepository.updateOne('badges', { id: String(id) }, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Badge ID is required' }, { status: 400 });
    }
    await dbRepository.deleteOne('badges', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Badge deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
