import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('elite_admin_token');

  if (token && token.value === 'admin_authenticated_session_key_2026') {
    return NextResponse.json({
      authenticated: true,
      admin: {
        email: process.env.ADMIN_EMAIL || 'admin@elitequiz.com',
        role: 'superadmin',
        name: 'Portal Administrator',
      }
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
