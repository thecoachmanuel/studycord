import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const maincat_id = searchParams.get('maincat_id') || searchParams.get('category');
    const query: any = {};
    if (maincat_id) query.maincat_id = maincat_id;

    const subcategories = await dbRepository.find('subcategories', query);
    const allQuestions = await dbRepository.find('questions');

    const data = subcategories.map((sub: any) => {
      const subQuestions = allQuestions.filter(
        (q: any) => String(q.subcategory) === String(sub.id)
      );
      const levels = subQuestions
        .map((q: any) => parseInt(q.level, 10))
        .filter((n: number) => !isNaN(n) && n > 0);
      const maxLvl = levels.length > 0 ? Math.max(...levels) : Math.max(1, Math.ceil(subQuestions.length / 5));
      return {
        ...sub,
        maxLevel: String(maxLvl || sub.maxLevel || '1'),
        questionCount: subQuestions.length,
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
    const { maincat_id, subcategory_name, status = '1' } = body;

    if (!maincat_id || !subcategory_name) {
      return NextResponse.json({ success: false, message: 'maincat_id and subcategory_name are required' }, { status: 400 });
    }

    const slug = subcategory_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSubcategory = {
      id: String(Date.now()),
      maincat_id: String(maincat_id),
      subcategory_name,
      status: String(status),
      slug,
      row_order: (await dbRepository.count('subcategories')) + 1,
    };

    const result = await dbRepository.insertOne('subcategories', newSubcategory);
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
      return NextResponse.json({ success: false, message: 'Subcategory ID is required' }, { status: 400 });
    }

    const updated = await dbRepository.updateOne('subcategories', { id: String(id) }, updates);
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
      return NextResponse.json({ success: false, message: 'Subcategory ID is required' }, { status: 400 });
    }

    await dbRepository.deleteOne('subcategories', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
