import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET() {
  try {
    const contests = await dbRepository.find('contests');
    return NextResponse.json({ success: true, data: contests });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description = '', start_date, end_date, entry_coin = 10, prize_pool = 1000, top_users = 10 } = body;

    if (!name || !start_date || !end_date) {
      return NextResponse.json({ success: false, message: 'Name, start date, and end date are required' }, { status: 400 });
    }

    const newContest = {
      id: String(Date.now()),
      name,
      description,
      start_date,
      end_date,
      entry_coin: Number(entry_coin),
      prize_pool: Number(prize_pool),
      top_users: Number(top_users),
      status: '1',
      image: '/assets/images/contest_banner.svg',
    };

    const result = await dbRepository.insertOne('contests', newContest);
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
      return NextResponse.json({ success: false, message: 'Contest ID is required' }, { status: 400 });
    }

    const updated = await dbRepository.updateOne('contests', { id: String(id) }, updates);
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
      return NextResponse.json({ success: false, message: 'Contest ID is required' }, { status: 400 });
    }

    await dbRepository.deleteOne('contests', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Contest deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
