import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('user_id');
    const email = searchParams.get('email');

    const notifications = await dbRepository.find('notifications');
    let filtered = notifications;

    if (userId || email) {
      filtered = notifications.filter((n: any) =>
        (!n.user_id && !n.user_email) || // Global notifications
        (userId && String(n.user_id) === String(userId)) ||
        (email && n.user_email?.toLowerCase() === email.toLowerCase())
      );
    }

    // Newest notifications first
    filtered.sort((a: any, b: any) => {
      const parseDate = (d: any, id: any) => {
        const parsed = new Date(d).getTime();
        if (!isNaN(parsed)) return parsed;
        const numId = Number(id);
        if (!isNaN(numId) && numId > 1000000000) return numId;
        return 1000;
      };
      return parseDate(b.date, b.id) - parseDate(a.date, a.id);
    });

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, type = '1' } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, message: 'Title and message are required' }, { status: 400 });
    }

    const newNotification = {
      id: String(Date.now()),
      title,
      message,
      type: String(type),
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    const result = await dbRepository.insertOne('notifications', newNotification);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Notification ID required' }, { status: 400 });
    }
    const success = await dbRepository.deleteOne('notifications', { id: String(id) });
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
