import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET() {
  try {
    const questions = await dbRepository.find('questions');
    const pairs = questions.filter((q: any) => q.category === '11' || q.category === 'multiMatch');
    return NextResponse.json({ success: true, count: pairs.length, data: pairs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leftItem, rightItem, level = '1' } = body;

    if (!leftItem || !rightItem) {
      return NextResponse.json(
        { success: false, message: 'Both left and right matching items are required' },
        { status: 400 }
      );
    }

    const newPair = {
      id: `mm-pair-${Date.now()}`,
      category: '11',
      subcategory: '1101',
      level: String(level),
      question: `Match: ${leftItem.trim()}`,
      question_type: '1',
      optiona: rightItem.trim(),
      optionb: '',
      optionc: '',
      optiond: '',
      answer: 'a',
      note: `Matching pair: ${leftItem.trim()} -> ${rightItem.trim()}`,
      created_at: new Date().toISOString(),
    };

    const result = await dbRepository.insertOne('questions', newPair);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, leftItem, rightItem } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Match pair ID is required' }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (leftItem) updates.question = `Match: ${leftItem.trim()}`;
    if (rightItem) updates.optiona = rightItem.trim();

    const updated = await dbRepository.updateOne('questions', { id: String(id) }, updates);
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
      return NextResponse.json({ success: false, message: 'Match pair ID is required' }, { status: 400 });
    }

    await dbRepository.deleteOne('questions', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Match pair deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
