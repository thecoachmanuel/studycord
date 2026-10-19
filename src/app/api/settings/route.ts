import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

const DEFAULT_SETTINGS = {
  type: 'general',
  app_name: 'StudyCord',
  currency_symbol: '₦',
  currency_code: 'NGN',
  payout_request_status: '0', // '0' = Disabled by default (grayed out & unclickable), '1' = Enabled
  payout_disabled_message: 'Payout requests are currently paused by the administrator. Check back soon or continue earning coins!',
  paystack_status: '1',
  paystack_public_key: 'pk_test_d3a8120b0a88fb0379df8f237889e49c7198e3b1',
  paystack_secret_key: 'sk_test_638bfb287964dc08b9812903db3018e6c7104b90',
  daily_reward_coins: 50,
  daily_streak_coins: 25,
  correct_answer_coins: 4,
  wrong_penalty_coins: 2,
  lifeline_cost: 4,
  min_withdrawal_coins: 200,
  coin_value_in_currency: 0.05,
  about_us: 'StudyCord is an interactive, modern quiz gaming platform featuring real-time multiplayer battles, competitive tournaments, learning modules, and trivia across dozens of categories. Built to entertain, educate, and reward quiz enthusiasts worldwide.',
  contact_us: 'Have questions, need technical assistance, or want to partner with us? Contact our team directly at support@studycord.app or phone +234 800 123 4567.',
  privacy_policy: 'Your privacy is paramount. We do not sell or disclose your personal data to third parties. Performance statistics, leaderboard entries, and quiz progress are securely stored and utilized solely for game operation and multiplayer matchmaking.',
  terms_conditions: 'By participating in quizzes and contests, you agree to comply with our community fair play rules. Account sharing, exploitation of lifelines, automated scripts, or fraudulent coin redemption requests will result in immediate coin forfeiture and permanent suspension.',
  instructions: 'Answer each question within the countdown timer. Use lifelines wisely at the cost of 4 coins each.',
};

export async function GET() {
  try {
    let settings = await dbRepository.findOne('system_settings', { type: 'general' });
    if (!settings) {
      settings = DEFAULT_SETTINGS;
      await dbRepository.insertOne('system_settings', settings);
    } else {
      const needsNaira = settings.currency_symbol === '$' || !settings.currency_symbol;
      settings = {
        ...DEFAULT_SETTINGS,
        ...settings,
        ...(needsNaira ? { currency_symbol: '₦', currency_code: 'NGN' } : {}),
      };
      await dbRepository.updateOne('system_settings', { type: 'general' }, settings);
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let existing = await dbRepository.findOne('system_settings', { type: 'general' });
    if (existing) {
      await dbRepository.updateOne('system_settings', { type: 'general' }, body);
    } else {
      await dbRepository.insertOne('system_settings', { ...DEFAULT_SETTINGS, ...body });
    }
    const updated = await dbRepository.findOne('system_settings', { type: 'general' });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
