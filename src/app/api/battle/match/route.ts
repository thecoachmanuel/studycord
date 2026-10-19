import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user: playerUser } = body;

    // Fetch active users from MongoDB Atlas
    const users = await dbRepository.find('users');
    const availableOpponents = users.filter(
      (u: any) => u.email !== playerUser?.email && u.name !== playerUser?.name
    );

    let matchedOpponent;
    if (availableOpponents.length > 0) {
      // Pick a random user from database
      const randomIdx = Math.floor(Math.random() * availableOpponents.length);
      const chosen = availableOpponents[randomIdx];
      matchedOpponent = {
        id: String(chosen.id || chosen._id),
        name: chosen.name,
        profile: chosen.profile || `/assets/config/profile/${(randomIdx % 10) + 1}.svg`,
        score: String(chosen.score || Math.floor(Math.random() * 2000) + 1500),
      };
    } else {
      matchedOpponent = {
        id: 'opp-default',
        name: 'Sarah Connor',
        profile: '/assets/config/profile/6.svg',
        score: '3,120',
      };
    }

    return NextResponse.json({
      success: true,
      opponent: matchedOpponent,
      matchId: `match-${Date.now()}`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      opponent: {
        id: 'opp-default',
        name: 'Sarah Connor',
        profile: '/assets/config/profile/6.svg',
        score: '3,120',
      },
      message: error.message,
    });
  }
}
