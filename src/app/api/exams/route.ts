import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET() {
  try {
    const exams = await dbRepository.find('exams');
    return NextResponse.json({ success: true, data: exams });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, duration = 15, pass_percentage = 70, total_marks = 100, rules = '' } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Exam title is required' }, { status: 400 });
    }

    const newExam = {
      id: String(Date.now()),
      title,
      duration: Number(duration),
      pass_percentage: Number(pass_percentage),
      total_marks: Number(total_marks),
      rules,
      status: '1',
    };

    const result = await dbRepository.insertOne('exams', newExam);
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
      return NextResponse.json({ success: false, message: 'Exam ID is required' }, { status: 400 });
    }

    const updated = await dbRepository.updateOne('exams', { id: String(id) }, updates);
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
      return NextResponse.json({ success: false, message: 'Exam ID is required' }, { status: 400 });
    }

    await dbRepository.deleteOne('exams', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
