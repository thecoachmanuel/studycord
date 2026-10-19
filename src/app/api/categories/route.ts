import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const query: any = {};
    if (type) query.type = type;

    const categories = await dbRepository.find('categories', query);
    const allQuestions = await dbRepository.find('questions');

    const data = categories.map((cat: any) => {
      const catQuestions = allQuestions.filter(
        (q: any) => String(q.category) === String(cat.id)
      );
      const levels = catQuestions
        .map((q: any) => parseInt(q.level, 10))
        .filter((n: number) => !isNaN(n) && n > 0);
      const maxLvl = levels.length > 0 ? Math.max(...levels) : Math.max(1, Math.ceil(catQuestions.length / 5));
      return {
        ...cat,
        maxLevel: String(maxLvl || cat.maxLevel || '1'),
        questionCount: catQuestions.length,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category_name, type = '1', image = '', status = '1' } = body;

    if (!category_name) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    const slug = category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory = {
      id: String(Date.now()),
      category_name,
      type: String(type),
      image: image || '/assets/images/science.svg',
      status: String(status),
      slug,
      row_order: (await dbRepository.count('categories')) + 1,
    };

    const result = await dbRepository.insertOne('categories', newCategory);
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
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }

    const updated = await dbRepository.updateOne('categories', { id: String(id) }, updates);
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
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }

    await dbRepository.deleteOne('categories', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
