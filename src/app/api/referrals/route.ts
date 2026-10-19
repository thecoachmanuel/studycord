import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const referrer_id = searchParams.get('referrer_id');
    const referee_id = searchParams.get('referee_id');
    const referrer_code = searchParams.get('referrer_code');

    let referrals = await dbRepository.find('referrals');

    if (referrer_id) {
      referrals = referrals.filter(
        (r: any) => String(r.referrer_id) === String(referrer_id)
      );
    }

    if (referrer_code) {
      referrals = referrals.filter(
        (r: any) => String(r.referrer_code || '').toUpperCase() === referrer_code.toUpperCase()
      );
    }

    if (referee_id) {
      referrals = referrals.filter(
        (r: any) => String(r.referee_id) === String(referee_id)
      );
    }

    // Sort newest first
    referrals.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || a.date || 0).getTime();
      const dateB = new Date(b.created_at || b.date || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, count: referrals.length, data: referrals });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
