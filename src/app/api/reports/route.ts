import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET() {
  try {
    const reports = await dbRepository.find('question_reports');
    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question_id, message, user_id = '101' } = body;

    if (!question_id || !message) {
      return NextResponse.json({ success: false, message: 'Question ID and message required' }, { status: 400 });
    }

    const newReport = {
      id: String(Date.now()),
      question_id: String(question_id),
      user_id: String(user_id),
      message,
      date: new Date().toISOString().split('T')[0],
      status: '0', // 0: Pending, 1: Resolved
    };

    const result = await dbRepository.insertOne('question_reports', newReport);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || status === undefined) {
      return NextResponse.json({ success: false, message: 'Report ID and status required' }, { status: 400 });
    }

    const updated = await dbRepository.updateOne('question_reports', { id: String(id) }, { status: String(status) });
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
      return NextResponse.json({ success: false, message: 'Report ID is required' }, { status: 400 });
    }
    await dbRepository.deleteOne('question_reports', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Report deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
