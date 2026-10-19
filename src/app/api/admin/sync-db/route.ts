import { NextResponse } from 'next/server';
import { getDb, initialMemoryStore, isMongoConnected } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'Could not connect to MongoDB Atlas. Using memory store.',
        connected: false,
      }, { status: 503 });
    }

    const summary: Record<string, number> = {};
    for (const [colName, docs] of Object.entries(initialMemoryStore)) {
      if (!Array.isArray(docs)) continue;
      const count = await db.collection(colName).countDocuments();
      summary[colName] = count;
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB Atlas connected and operational',
      database: db.databaseName,
      connected: isMongoConnected(),
      collections: summary,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'Could not connect to MongoDB Atlas.',
        connected: false,
      }, { status: 503 });
    }

    const seeded: Record<string, number> = {};
    for (const [colName, docs] of Object.entries(initialMemoryStore)) {
      if (!Array.isArray(docs) || docs.length === 0) continue;
      const currentCount = await db.collection(colName).countDocuments();
      if (currentCount === 0) {
        await db.collection(colName).insertMany(docs);
        seeded[colName] = docs.length;
      } else {
        seeded[colName] = currentCount;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Synchronized all collections with MongoDB Atlas successfully',
      database: db.databaseName,
      data: seeded,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
