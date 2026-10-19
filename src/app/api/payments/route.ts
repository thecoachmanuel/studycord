import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET() {
  try {
    const payments = await dbRepository.find('payment_requests');
    return NextResponse.json({ success: true, data: payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id = '101', payment_type, payment_address, coin_used, amount } = body;

    if (!payment_type || !payment_address || !coin_used) {
      return NextResponse.json({ success: false, message: 'Missing payment fields' }, { status: 400 });
    }

    const newPayment = {
      id: String(Date.now()),
      user_id: String(user_id),
      payment_type,
      payment_address,
      coin_used: Number(coin_used),
      amount: Number(amount) || Number(coin_used) * 0.05,
      status: '0', // 0: Pending, 1: Approved, 2: Rejected
      request_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    const result = await dbRepository.insertOne('payment_requests', newPayment);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body; // status: '1' (Approved) or '2' (Rejected)

    if (!id || status === undefined) {
      return NextResponse.json({ success: false, message: 'Payment ID and status required' }, { status: 400 });
    }

    const updated = await dbRepository.updateOne('payment_requests', { id: String(id) }, { status: String(status) });
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
      return NextResponse.json({ success: false, message: 'Payment ID is required' }, { status: 400 });
    }
    await dbRepository.deleteOne('payment_requests', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Payment deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
