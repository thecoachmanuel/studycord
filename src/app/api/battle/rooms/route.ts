import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const lobby = searchParams.get('lobby');

    if (code) {
      const room = await dbRepository.findOne('battle_rooms', { code: String(code).trim() });
      if (!room) {
        return NextResponse.json({ success: false, message: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, room });
    }

    if (lobby) {
      const openRooms = await dbRepository.find('battle_rooms', { status: 'waiting' });
      return NextResponse.json({ success: true, rooms: openRooms });
    }

    const allRooms = await dbRepository.find('battle_rooms');
    return NextResponse.json({ success: true, rooms: allRooms });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, code, roomData, user: playerUser, entryCoins = 20, category = 'All Categories' } = body;

    // Create Room
    if (action === 'create') {
      const roomCode = code || String(Math.floor(100000 + Math.random() * 900000));
      const host = {
        id: playerUser?.userId || playerUser?.id || 'host-1',
        name: playerUser?.name || 'You (Host)',
        avatar: playerUser?.profileUrl || playerUser?.profile || '/assets/config/profile/1.svg',
        isHost: true,
        ready: true,
        score: 0,
      };

      // Query active users from MongoDB to seed potential competitors in lobby
      const allDbUsers = await dbRepository.find('users');
      const competitors = allDbUsers
        .filter((u: any) => u.email !== playerUser?.email && u.name !== playerUser?.name)
        .slice(0, 3)
        .map((u: any, idx: number) => ({
          id: String(u.id || idx + 2),
          name: u.name,
          avatar: u.profile || `/assets/config/profile/${(idx % 8) + 2}.svg`,
          isHost: false,
          ready: true,
          score: 0,
        }));

      const newRoom = {
        id: `room-${Date.now()}`,
        code: roomCode,
        hostId: host.id,
        hostName: host.name,
        category,
        entryCoins: Number(entryCoins),
        status: 'waiting',
        maxPlayers: 4,
        players: [host, ...competitors],
        createdAt: new Date().toISOString(),
      };

      await dbRepository.insertOne('battle_rooms', newRoom);
      return NextResponse.json({ success: true, room: newRoom });
    }

    // Join Room
    if (action === 'join') {
      if (!code) {
        return NextResponse.json({ success: false, message: 'Room code is required' }, { status: 400 });
      }

      const room = await dbRepository.findOne('battle_rooms', { code: String(code).trim() });
      if (!room) {
        return NextResponse.json({ success: false, message: 'Invalid room code. Please check and try again.' }, { status: 404 });
      }

      const existingPlayer = room.players?.find((p: any) => p.id === (playerUser?.userId || playerUser?.id));
      if (!existingPlayer) {
        if ((room.players?.length || 0) >= 4) {
          return NextResponse.json({ success: false, message: 'Room is already full (4/4 players).' }, { status: 400 });
        }

        const newPlayer = {
          id: playerUser?.userId || playerUser?.id || `user-${Date.now()}`,
          name: playerUser?.name || 'Contender',
          avatar: playerUser?.profileUrl || playerUser?.profile || '/assets/config/profile/2.svg',
          isHost: false,
          ready: true,
          score: 0,
        };

        const updatedPlayers = [...(room.players || []), newPlayer];
        await dbRepository.updateOne('battle_rooms', { code: String(code).trim() }, { players: updatedPlayers });
        room.players = updatedPlayers;
      }

      return NextResponse.json({ success: true, room });
    }

    // Start Room
    if (action === 'start') {
      if (!code) {
        return NextResponse.json({ success: false, message: 'Room code is required' }, { status: 400 });
      }
      await dbRepository.updateOne('battle_rooms', { code: String(code).trim() }, { status: 'active' });
      return NextResponse.json({ success: true, message: 'Battle room started' });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
