import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { method: string } }
) {
  const method = params.method.toLowerCase();
  
  let body: any = {};
  const contentType = req.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      formData.forEach((val, key) => {
        body[key] = val;
      });
    }
  } catch {
    body = {};
  }

  // Also read query params for GET/POST hybrid queries
  const url = new URL(req.url);
  url.searchParams.forEach((val, key) => {
    if (body[key] === undefined) body[key] = val;
  });

  switch (method) {
    case 'get_categories': {
      const type = body.type || '1';
      const categories = await dbRepository.find('categories', { type: String(type) });
      return NextResponse.json({
        error: false,
        message: 'Categories fetched successfully',
        data: categories.map((c: any) => ({
          id: c.id,
          category_name: c.category_name,
          image: c.image,
          row_order: c.row_order || '1',
          no_of_subcategories: '2',
          maxlevel: '10',
          status: c.status || '1',
        })),
      });
    }

    case 'get_subcategory_by_maincategory': {
      const maincat_id = body.category || body.maincat_id;
      const query: any = {};
      if (maincat_id) query.maincat_id = String(maincat_id);
      const subs = await dbRepository.find('subcategories', query);
      return NextResponse.json({
        error: false,
        message: 'Subcategories fetched successfully',
        data: subs.map((s: any) => ({
          id: s.id,
          maincat_id: s.maincat_id,
          subcategory_name: s.subcategory_name,
          status: s.status || '1',
          row_order: s.row_order || '1',
          maxlevel: '5',
        })),
      });
    }

    case 'get_questions':
    case 'get_questions_by_level': {
      const query: any = {};
      if (body.category) query.category = String(body.category);
      if (body.subcategory) query.subcategory = String(body.subcategory);
      if (body.level) query.level = String(body.level);

      const questions = await dbRepository.find('questions', query);
      return NextResponse.json({
        error: false,
        message: 'Questions retrieved successfully',
        data: questions.map((q: any) => ({
          id: q.id,
          category: q.category,
          subcategory: q.subcategory,
          level: q.level,
          question: q.question,
          question_type: q.question_type || '1',
          optiona: q.optiona || '',
          optionb: q.optionb || '',
          optionc: q.optionc || '',
          optiond: q.optiond || '',
          answer: q.answer || 'a',
          note: q.note || '',
        })),
      });
    }

    case 'get_questions_by_type': {
      const type = body.type || '1'; // 1: normal, 2: true/false
      const limit = Number(body.limit) || 10;
      const questions = await dbRepository.find('questions', { question_type: String(type) }, { limit });
      return NextResponse.json({
        error: false,
        message: 'Questions retrieved',
        data: questions,
      });
    }

    case 'get_daily_quiz': {
      const questions = await dbRepository.find('questions', {}, { limit: 10 });
      return NextResponse.json({
        error: false,
        message: 'Daily quiz questions retrieved',
        data: questions,
      });
    }

    case 'report_question': {
      const question_id = body.question_id;
      const message = body.message;
      if (!question_id || !message) {
        return NextResponse.json({ error: true, message: 'question_id and message required' }, { status: 400 });
      }
      await dbRepository.insertOne('question_reports', {
        question_id: String(question_id),
        message,
        user_id: body.user_id || '101',
        date: new Date().toISOString().split('T')[0],
        status: '0',
      });
      return NextResponse.json({ error: false, message: 'Report submitted successfully' });
    }

    case 'get_settings':
    case 'get_system_configurations': {
      const settings = (await dbRepository.findOne('system_settings', { type: 'general' })) || {};
      return NextResponse.json({
        error: false,
        data: {
          app_name: settings.app_name || 'Elite Quiz',
          currency_symbol: settings.currency_symbol || '$',
          correct_answer_coins: settings.correct_answer_coins || '4',
          wrong_penalty_coins: settings.wrong_penalty_coins || '2',
          lifeline_cost: settings.lifeline_cost || '4',
          min_withdrawal_coins: settings.min_withdrawal_coins || '200',
          about_us: settings.about_us || '',
          privacy_policy: settings.privacy_policy || '',
          terms_conditions: settings.terms_conditions || '',
          instructions: settings.instructions || '',
        },
      });
    }

    case 'get_user_badges': {
      const badges = await dbRepository.find('badges');
      return NextResponse.json({
        error: false,
        data: badges,
      });
    }

    case 'get_contest': {
      const contests = await dbRepository.find('contests');
      return NextResponse.json({
        error: false,
        data: contests,
      });
    }

    case 'get_exam_module': {
      const exams = await dbRepository.find('exams');
      return NextResponse.json({
        error: false,
        data: exams,
      });
    }

    case 'set_payment_request': {
      const { user_id = '101', payment_type, payment_address, coin_used } = body;
      const amount = Number(coin_used) * 0.05;
      const res = await dbRepository.insertOne('payment_requests', {
        user_id: String(user_id),
        payment_type,
        payment_address,
        coin_used: Number(coin_used),
        amount,
        status: '0',
        request_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });
      return NextResponse.json({ error: false, message: 'Payment request logged', data: res });
    }

    case 'get_payment_request': {
      const payments = await dbRepository.find('payment_requests');
      return NextResponse.json({ error: false, data: payments });
    }

    case 'user_signup': {
      const { name = 'Elite Player', email = 'user@elitequiz.com', mobile = '' } = body;
      let user = await dbRepository.findOne('users', { email });
      if (!user) {
        user = await dbRepository.insertOne('users', {
          name,
          email,
          mobile,
          coins: 100,
          score: 0,
          status: '1',
          refer_code: 'EQ' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          profile: '/assets/config/profile/1.svg',
          created_at: new Date().toISOString(),
        });
      }
      return NextResponse.json({ error: false, message: 'User logged in', data: user });
    }

    case 'get_daily_leaderboard':
    case 'get_monthly_leaderboard':
    case 'get_globle_leaderboard': {
      const users = await dbRepository.find('users');
      const sorted = users
        .sort((a: any, b: any) => Number(b.score || 0) - Number(a.score || 0))
        .map((u: any, idx: number) => ({
          user_rank: String(idx + 1),
          userId: u.id,
          name: u.name,
          score: String(u.score || 0),
          profile: u.profile || '/assets/config/profile/1.svg',
        }));
      return NextResponse.json({ error: false, data: sorted });
    }

    case 'get_notifications': {
      const notifs = await dbRepository.find('notifications');
      return NextResponse.json({ error: false, data: notifs });
    }

    default: {
      return NextResponse.json({
        error: false,
        message: `Method ${params.method} handled`,
        data: [],
      });
    }
  }
}

export async function GET(
  req: Request,
  { params }: { params: { method: string } }
) {
  return POST(req, { params });
}
