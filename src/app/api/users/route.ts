import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    let users = await dbRepository.find('users');

    if (search) {
      const q = search.toLowerCase();
      users = users.filter((u: any) =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.mobile && u.mobile.includes(q))
      );
    }

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      mobile = '',
      coins = 100,
      score = 0,
      payout_eligible = false,
      status = '1',
      referCode = '',
      refer_code = '',
    } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await dbRepository.findOne('users', { email: cleanEmail });
    if (existing) {
      return NextResponse.json({ success: true, data: existing, message: 'User already exists' });
    }

    const inviteCode = (referCode || refer_code || '').trim().toUpperCase();
    let referrer: any = null;
    const WELCOME_OFFER_COINS = 250;
    const REFERRAL_BONUS_COINS = 50;
    let initialCoins = Number(coins ?? WELCOME_OFFER_COINS);
    if (initialCoins < WELCOME_OFFER_COINS) {
      initialCoins = WELCOME_OFFER_COINS;
    }

    if (inviteCode) {
      const allUsers = await dbRepository.find('users');
      referrer = allUsers.find(
        (u: any) => u.refer_code && u.refer_code.toUpperCase() === inviteCode
      );
      if (referrer) {
        // Referee receives additional 50 bonus coins on signup with referral
        initialCoins += REFERRAL_BONUS_COINS;
      }
    }

    const userReferCode = 'STUDY' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const newUser = {
      id: String(Date.now()),
      name: String(name).trim(),
      email: cleanEmail,
      mobile: mobile ? String(mobile).trim() : '',
      coins: initialCoins,
      score: Number(score ?? 0),
      status: String(status ?? '1'),
      payout_eligible: Boolean(payout_eligible),
      refer_code: userReferCode,
      referred_by: referrer ? String(referrer.id) : null,
      referred_by_code: referrer ? referrer.refer_code : null,
      referred_by_name: referrer ? referrer.name : null,
      referrals_count: 0,
      referral_coins_earned: 0,
      profile: body.profile || '/assets/config/profile/1.svg',
      created_at: new Date().toISOString(),
    };

    const result = await dbRepository.insertOne('users', newUser);

    // If invited by a valid referrer, reward the referrer & record logs + notifications
    if (referrer) {
      const newRefCoins = (Number(referrer.coins) || 0) + 100;
      const newRefCount = (Number(referrer.referrals_count) || 0) + 1;
      const newRefEarned = (Number(referrer.referral_coins_earned) || 0) + 100;

      await dbRepository.updateOne(
        'users',
        { id: referrer.id },
        {
          coins: newRefCoins,
          referrals_count: newRefCount,
          referral_coins_earned: newRefEarned,
        }
      );

      // Record in referrals collection for admin tracking
      await dbRepository.insertOne('referrals', {
        id: String(Date.now()) + '_ref',
        referrer_id: String(referrer.id),
        referrer_name: referrer.name,
        referrer_code: referrer.refer_code,
        referee_id: String(newUser.id),
        referee_name: newUser.name,
        referee_email: newUser.email,
        reward_coins: 100,
        referee_bonus_coins: REFERRAL_BONUS_COINS,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        created_at: new Date().toISOString(),
      });

      // Send referral notification to referrer
      await dbRepository.insertOne('notifications', {
        id: String(Date.now()) + '_notif_ref',
        user_id: String(referrer.id),
        user_email: referrer.email,
        title: 'Referral Reward Claimed! 🎉',
        message: `${newUser.name} just signed up using your invite code (${referrer.refer_code})! +100 Coins credited to your wallet.`,
        type: 'referral',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });

      // Send welcome bonus + referral notification to referee
      await dbRepository.insertOne('notifications', {
        id: String(Date.now() + 1) + '_notif_welcome',
        user_id: String(newUser.id),
        user_email: newUser.email,
        title: 'Welcome Offer & Referral Bonus! 🎁',
        message: `Welcome to StudyCord! You received 250 Welcome Offer coins + 50 referral bonus coins (total 300 coins) for signing up with ${referrer.name}'s invite code (${referrer.refer_code}). Enjoy playing!`,
        type: 'welcome',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });
    } else {
      // Send standard welcome offer notification to new user
      await dbRepository.insertOne('notifications', {
        id: String(Date.now() + 1) + '_notif_welcome',
        user_id: String(newUser.id),
        user_email: newUser.email,
        title: 'Welcome Gift: +250 Free Coins Credited! 🎁',
        message: `Welcome to StudyCord! We have added 250 free coins to your wallet to kickstart your quiz journey. Explore quiz categories, 1v1 battles, and tournaments!`,
        type: 'welcome',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
      user: newUser,
      bonusApplied: Boolean(referrer),
      welcomeCoins: initialCoins,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    let updated = await dbRepository.updateOne('users', { id: String(id) }, updates);
    if (!updated) {
      updated = await dbRepository.updateOne('users', { _id: String(id) }, updates);
    }
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
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }
    await dbRepository.deleteOne('users', { id: String(id) });
    await dbRepository.deleteOne('users', { _id: String(id) });
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
