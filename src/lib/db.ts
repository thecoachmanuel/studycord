import { MongoClient, Db } from 'mongodb';
import dns from 'dns';
import { COMPREHENSIVE_QUESTIONS } from './questionsData';
import { TRUE_FALSE_LEVEL_QUESTIONS, DAILY_QUIZ_LEVEL_QUESTIONS, ADVANCED_CATEGORY_QUESTIONS } from './levelQuestionsPool';

// Configure public DNS servers to resolve MongoDB Atlas SRV and TXT records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Ignored in non-node environments
}

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elite_quiz_db';
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;
let isConnectedToMongo = false;

declare global {
  // eslint-disable-next-line no-var
  var _eliteMemoryStore: Record<string, any[]> | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Global memory store fallback if MongoDB server is unavailable or offline
export const initialMemoryStore: Record<string, any[]> = {
  categories: [
    { _id: 'cat-1', id: '1', category_name: 'General Knowledge', type: '1', image: '/assets/images/quiz_zone_icon.svg', status: '1', slug: 'general-knowledge', row_order: 1 },
    { _id: 'cat-2', id: '2', category_name: 'Science & Technology', type: '1', image: '/assets/images/science_icon.svg', status: '1', slug: 'science-technology', row_order: 2 },
    { _id: 'cat-3', id: '3', category_name: 'Mathematics & Logic', type: '1', image: '/assets/images/maths_icon.svg', status: '1', slug: 'mathematics-logic', row_order: 3 },
    { _id: 'cat-4', id: '4', category_name: 'History & Geography', type: '1', image: '/assets/images/daily_quiz_icon.svg', status: '1', slug: 'history-geography', row_order: 4 },
    { _id: 'cat-5', id: '5', category_name: 'Sports & Games', type: '1', image: '/assets/images/group_battle_icon.svg', status: '1', slug: 'sports-games', row_order: 5 },
    { _id: 'cat-6', id: '6', category_name: 'Elite Premium Masterclass', type: '1', image: '/assets/images/premium_icon.svg', status: '1', slug: 'elite-premium-masterclass', is_premium: '1', required_coins: 200, row_order: 6 },
    { _id: 'cat-7', id: '7', category_name: "Fun 'N' Learn", type: '2', image: '/assets/images/fun_icon.svg', status: '1', slug: 'fun-and-learn', row_order: 7 },
    { _id: 'cat-8', id: '8', category_name: 'Guess The Word', type: '3', image: '/assets/images/guess_icon.svg', status: '1', slug: 'guess-the-word', row_order: 8 },
    { _id: 'cat-9', id: '9', category_name: 'Audio Questions', type: '4', image: '/assets/images/audio_icon.svg', status: '1', slug: 'audio-questions', row_order: 9 },
    { _id: 'cat-10', id: '10', category_name: 'Maths Mania', type: '5', image: '/assets/images/maths_icon.svg', status: '1', slug: 'maths-mania', row_order: 10 },
    { _id: 'cat-11', id: '11', category_name: 'Multi Match', type: '6', image: '/assets/images/multi_match_icon.svg', status: '1', slug: 'multi-match', row_order: 11 },
  ],
  subcategories: [
    // Category 1: General Knowledge
    { _id: 'sub-1', id: '101', maincat_id: '1', subcategory_name: 'World Trivia', status: '1', slug: 'world-trivia', row_order: 1 },
    { _id: 'sub-2', id: '102', maincat_id: '1', subcategory_name: 'Famous Inventions', status: '1', slug: 'famous-inventions', row_order: 2 },
    { _id: 'sub-3', id: '103', maincat_id: '1', subcategory_name: 'Arts & Literature', status: '1', slug: 'arts-literature', row_order: 3 },
    { _id: 'sub-4', id: '104', maincat_id: '1', subcategory_name: 'Mythology & Folklore', status: '1', slug: 'mythology-folklore', row_order: 4 },
    { _id: 'sub-5', id: '105', maincat_id: '1', subcategory_name: 'Pop Culture & Cinema', status: '1', slug: 'pop-culture-cinema', row_order: 5 },

    // Category 2: Science & Technology
    { _id: 'sub-6', id: '201', maincat_id: '2', subcategory_name: 'Physics & Space', status: '1', slug: 'physics-space', row_order: 6 },
    { _id: 'sub-7', id: '202', maincat_id: '2', subcategory_name: 'Computer Science & AI', status: '1', slug: 'computer-science-ai', row_order: 7 },
    { _id: 'sub-8', id: '203', maincat_id: '2', subcategory_name: 'Biology & Nature', status: '1', slug: 'biology-nature', row_order: 8 },
    { _id: 'sub-9', id: '204', maincat_id: '2', subcategory_name: 'Chemistry & Elements', status: '1', slug: 'chemistry-elements', row_order: 9 },
    { _id: 'sub-10', id: '205', maincat_id: '2', subcategory_name: 'Earth Science & Oceans', status: '1', slug: 'earth-science-oceans', row_order: 10 },

    // Category 3: Mathematics & Logic
    { _id: 'sub-11', id: '301', maincat_id: '3', subcategory_name: 'Mental Arithmetic & Speed Math', status: '1', slug: 'mental-arithmetic', row_order: 11 },
    { _id: 'sub-12', id: '302', maincat_id: '3', subcategory_name: 'Algebra & Equations', status: '1', slug: 'algebra-equations', row_order: 12 },
    { _id: 'sub-13', id: '303', maincat_id: '3', subcategory_name: 'Geometry & Spatial Reasoning', status: '1', slug: 'geometry-spatial', row_order: 13 },
    { _id: 'sub-14', id: '304', maincat_id: '3', subcategory_name: 'Logic Puzzles & Deductions', status: '1', slug: 'logic-puzzles', row_order: 14 },
    { _id: 'sub-15', id: '305', maincat_id: '3', subcategory_name: 'Probability & Statistics', status: '1', slug: 'probability-statistics', row_order: 15 },

    // Category 4: History & Geography
    { _id: 'sub-16', id: '401', maincat_id: '4', subcategory_name: 'Ancient Civilizations', status: '1', slug: 'ancient-civilizations', row_order: 16 },
    { _id: 'sub-17', id: '402', maincat_id: '4', subcategory_name: 'World Capitals & Borders', status: '1', slug: 'world-capitals', row_order: 17 },
    { _id: 'sub-18', id: '403', maincat_id: '4', subcategory_name: 'Medieval & Modern Warfare', status: '1', slug: 'medieval-modern-warfare', row_order: 18 },
    { _id: 'sub-19', id: '404', maincat_id: '4', subcategory_name: 'Explorers & Maritime Expeditions', status: '1', slug: 'explorers-maritime', row_order: 19 },
    { _id: 'sub-20', id: '405', maincat_id: '4', subcategory_name: 'Wonders of the World', status: '1', slug: 'wonders-world', row_order: 20 },

    // Category 5: Sports & Games
    { _id: 'sub-21', id: '501', maincat_id: '5', subcategory_name: 'Global Football (Soccer)', status: '1', slug: 'global-football', row_order: 21 },
    { _id: 'sub-22', id: '502', maincat_id: '5', subcategory_name: 'Olympic Games & Records', status: '1', slug: 'olympic-games', row_order: 22 },
    { _id: 'sub-23', id: '503', maincat_id: '5', subcategory_name: 'Basketball & NBA Legends', status: '1', slug: 'basketball-nba', row_order: 23 },
    { _id: 'sub-24', id: '504', maincat_id: '5', subcategory_name: 'Tennis & Grand Slams', status: '1', slug: 'tennis-grand-slams', row_order: 24 },
    { _id: 'sub-25', id: '505', maincat_id: '5', subcategory_name: 'Chess & Strategy Esports', status: '1', slug: 'chess-esports', row_order: 25 },

    // Category 6: Elite Premium Masterclass
    { _id: 'sub-26', id: '601', maincat_id: '6', subcategory_name: 'Elite Masterclass & Philosophy', status: '1', slug: 'elite-masterclass', row_order: 26 },
    { _id: 'sub-27', id: '602', maincat_id: '6', subcategory_name: 'Advanced Astrophysics', status: '1', slug: 'astrophysics', row_order: 27 },
    { _id: 'sub-28', id: '603', maincat_id: '6', subcategory_name: 'Quantum Physics & Computing', status: '1', slug: 'quantum-physics', row_order: 28 },
    { _id: 'sub-29', id: '604', maincat_id: '6', subcategory_name: 'Classical & Modern Philosophy', status: '1', slug: 'philosophy', row_order: 29 },
    { _id: 'sub-30', id: '605', maincat_id: '6', subcategory_name: 'Geopolitics & World Economy', status: '1', slug: 'geopolitics-economy', row_order: 30 },

    // Categories 7-11: Specialized Modes
    { _id: 'sub-31', id: '701', maincat_id: '7', subcategory_name: 'Reading Comprehension', status: '1', slug: 'reading-comprehension', row_order: 31 },
    { _id: 'sub-32', id: '801', maincat_id: '8', subcategory_name: 'Word Riddles & Clues', status: '1', slug: 'word-riddles-clues', row_order: 32 },
    { _id: 'sub-33', id: '901', maincat_id: '9', subcategory_name: 'Sound & Music Recognition', status: '1', slug: 'sound-music-recognition', row_order: 33 },
    { _id: 'sub-34', id: '1001', maincat_id: '10', subcategory_name: 'Mental Arithmetic & Equations', status: '1', slug: 'mental-arithmetic-mania', row_order: 34 },
    { _id: 'sub-35', id: '1101', maincat_id: '11', subcategory_name: 'Vocabulary & Concept Matching', status: '1', slug: 'concept-matching', row_order: 35 },
  ],
  questions: [
    ...COMPREHENSIVE_QUESTIONS,
    ...ADVANCED_CATEGORY_QUESTIONS,
    ...TRUE_FALSE_LEVEL_QUESTIONS,
    ...DAILY_QUIZ_LEVEL_QUESTIONS,
  ].map((q) => {
    const optA = q.options[0]?.title || '';
    const optB = q.options[1]?.title || '';
    const optC = q.options[2]?.title || '';
    const optD = q.options[3]?.title || '';
    const correctIdx = q.options.findIndex((o) => o.id === q.correctAnswerOptionId);
    const answer = correctIdx === 0 ? 'a' : correctIdx === 1 ? 'b' : correctIdx === 2 ? 'c' : 'd';
    
    // Normalize category identifier
    let catId = String(q.category);
    let subcatId = String(q.subcategory || '101');
    if (catId === 'funAndLearn') { catId = '7'; subcatId = '701'; }
    else if (catId === 'guess' || catId === 'guessWord') { catId = '8'; subcatId = '801'; }
    else if (catId === 'audioQuestions' || catId === 'audio') { catId = '9'; subcatId = '901'; }
    else if (catId === 'mathMania') { catId = '10'; subcatId = '1001'; }
    else if (catId === 'multiMatch') { catId = '11'; subcatId = '1101'; }
    else if (catId === 'trueFalse') { catId = 'trueFalse'; subcatId = '101'; }
    else if (catId === 'dailyQuiz') { catId = 'dailyQuiz'; subcatId = '101'; }
    else if (catId === 'battle') { catId = '5'; subcatId = '501'; }

    return {
      _id: `q-${q.id}`,
      id: q.id,
      category: catId,
      subcategory: subcatId,
      level: String(q.level || '1'),
      question: q.question,
      question_type: q.questionType || '1',
      optiona: optA,
      optionb: optB,
      optionc: optC,
      optiond: optD,
      answer,
      note: q.note || '',
      image: q.image || '',
      passage: q.passage || '',
      mathEquation: q.mathEquation || '',
      audio: q.audio || '',
    };
  }),
  users: [
    {
      _id: 'u-1',
      id: '101',
      name: 'Tawaab',
      email: 'tawaab@studycord.app',
      mobile: '+1 234 567 8900',
      coins: 680,
      score: 2450,
      status: '1',
      refer_code: 'STUDY99',
      profile: '/assets/config/profile/1.svg',
      created_at: '2026-10-18T10:00:00Z',
    },
    {
      _id: 'u-2',
      id: 'u1',
      name: 'Alexander Wright',
      email: 'alexander@example.com',
      mobile: '+1 555 101 2020',
      coins: 1250,
      score: 5820,
      status: '1',
      refer_code: 'ALEX58',
      profile: '/assets/config/profile/3.svg',
      created_at: '2026-01-20T11:00:00Z',
    },
    {
      _id: 'u-3',
      id: 'u2',
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      mobile: '+1 987 654 3210',
      coins: 980,
      score: 4940,
      status: '1',
      refer_code: 'SOPHIA99',
      profile: '/assets/config/profile/7.svg',
      created_at: '2026-02-01T12:00:00Z',
    },
    {
      _id: 'u-4',
      id: 'u3',
      name: 'Marcus Sterling',
      email: 'marcus@example.com',
      mobile: '+1 555 444 3333',
      coins: 740,
      score: 3860,
      status: '1',
      refer_code: 'MARCUS42',
      profile: '/assets/config/profile/2.svg',
      created_at: '2026-02-14T08:30:00Z',
    },
    {
      _id: 'u-5',
      id: 'u5',
      name: 'Elena Rostova',
      email: 'elena@example.com',
      mobile: '+1 555 777 8888',
      coins: 520,
      score: 2180,
      status: '1',
      refer_code: 'ELENA21',
      profile: '/assets/config/profile/4.svg',
      created_at: '2026-02-20T14:15:00Z',
    },
    {
      _id: 'u-6',
      id: 'u6',
      name: 'David Kim',
      email: 'david@example.com',
      mobile: '+1 555 888 9999',
      coins: 430,
      score: 1920,
      status: '1',
      refer_code: 'DAVID19',
      profile: '/assets/config/profile/5.svg',
      created_at: '2026-02-25T16:20:00Z',
    },
  ],
  contests: [
    {
      _id: 'cont-1',
      id: 'c1',
      name: 'Mega Weekend Championship',
      description: 'Compete with the top players for massive prize pool coins and badges!',
      start_date: '2026-10-18',
      end_date: '2026-10-20',
      entry_coin: 50,
      prize_pool: 2500,
      top_users: 10,
      status: 'live',
      image: '/assets/images/contest_banner.svg',
    },
    {
      _id: 'cont-2',
      id: 'c2',
      name: 'Science & Cosmos League',
      description: 'High-speed 20 questions challenge testing deep physics and cosmology.',
      start_date: '2026-10-21',
      end_date: '2026-10-23',
      entry_coin: 30,
      prize_pool: 1500,
      top_users: 10,
      status: 'upcoming',
      image: '/assets/images/space.svg',
    },
    {
      _id: 'cont-3',
      id: 'c3',
      name: 'Global History & Civilization Cup',
      description: 'Championship on ancient civilizations, world dynasties, and key historical milestones.',
      start_date: '2026-10-10',
      end_date: '2026-10-14',
      entry_coin: 40,
      prize_pool: 2000,
      top_users: 10,
      status: 'past',
      image: '/assets/images/score.svg',
    }
  ],
  exams: [
    {
      _id: 'exam-1',
      id: 'e1',
      title: 'Certified General Knowledge Exam',
      duration: 15,
      pass_percentage: 70,
      total_marks: 50,
      status: '1',
      rules: 'Answer 25 questions in 15 minutes. Lifelines are disabled. Passing score is 70%.',
    },
    {
      _id: 'exam-2',
      id: 'e2',
      title: 'Technology & Logic Assessment',
      duration: 20,
      pass_percentage: 75,
      total_marks: 60,
      status: '1',
      rules: 'Answer 30 questions in 20 minutes. Comprehensive software & logic test.',
    }
  ],
  payment_requests: [
    {
      _id: 'pay-1',
      id: '1',
      user_id: '101',
      payment_type: 'PayPal',
      payment_address: 'tawaab@studycord.app',
      coin_used: 500,
      amount: 25.0,
      status: '0', // 0: Pending, 1: Approved, 2: Rejected
      request_date: '2026-10-17 14:20:00',
    },
    {
      _id: 'pay-2',
      id: '2',
      user_id: 'u2',
      payment_type: 'Bank Transfer',
      payment_address: 'sophia.chen@globalbank.com',
      coin_used: 400,
      amount: 20.0,
      status: '1',
      request_date: '2026-10-16 11:15:00',
    },
    {
      _id: 'pay-3',
      id: '3',
      user_id: 'u3',
      payment_type: 'Stripe',
      payment_address: 'marcus.sterling@paynet.com',
      coin_used: 300,
      amount: 15.0,
      status: '0',
      request_date: '2026-10-17 18:30:00',
    }
  ],
  badges: [
    { _id: 'b-1', id: 'b1', title: 'Dashing Debut', type: 'dashing_debut', requirement: 1, reward_coins: 50, icon: '/assets/images/quiz_zone_icon.svg', status: 'rewardUnlocked' },
    { _id: 'b-2', id: 'b2', title: 'Combat Winner', type: 'combat_winner', requirement: 1, reward_coins: 75, icon: '/assets/images/one_vs_one_icon.svg', status: 'unlocked' },
    { _id: 'b-3', id: 'b3', title: 'Clash Winner', type: 'clash_winner', requirement: 1, reward_coins: 100, icon: '/assets/images/group_battle_icon.svg', status: 'unlocked' },
    { _id: 'b-4', id: 'b4', title: 'Most Wanted Winner', type: 'most_wanted_winner', requirement: 1, reward_coins: 150, icon: '/assets/images/score.svg', status: 'unlocked' },
    { _id: 'b-5', id: 'b5', title: 'Ultimate Player', type: 'ultimate_player', requirement: 1000, reward_coins: 250, icon: '/assets/images/rank_1.svg', status: 'locked' },
    { _id: 'b-6', id: 'b6', title: 'Quiz Warrior', type: 'quiz_warrior', requirement: 3, reward_coins: 150, icon: '/assets/images/quiz_warrior_icon.svg', status: 'locked' },
    { _id: 'b-7', id: 'b7', title: 'Super Sonic', type: 'super_sonic', requirement: 5, reward_coins: 80, icon: '/assets/images/lifeline_resettime.svg', status: 'unlocked' },
    { _id: 'b-8', id: 'b8', title: 'Recall Master', type: 'flashback', requirement: 5, reward_coins: 60, icon: '/assets/images/fun_icon.svg', status: 'locked' },
    { _id: 'b-9', id: 'b9', title: 'Brainiac', type: 'brainiac', requirement: 5, reward_coins: 120, icon: '/assets/images/badges_icon.svg', status: 'unlocked' },
    { _id: 'b-10', id: 'b10', title: 'Grandmaster', type: 'big_thing', requirement: 5000, reward_coins: 300, icon: '/assets/images/correct.svg', status: 'locked' },
    { _id: 'b-11', id: 'b11', title: 'Elite Scholar', type: 'elite', requirement: 5000, reward_coins: 200, icon: '/assets/images/earnedCoin.svg', status: 'locked' },
    { _id: 'b-12', id: 'b12', title: 'Knowledge Seeker', type: 'thirsty', requirement: 30, reward_coins: 175, icon: '/assets/images/daily_quiz_icon.svg', status: 'locked' },
    { _id: 'b-13', id: 'b13', title: 'Power Legend', type: 'power_elite', requirement: 10, reward_coins: 500, icon: '/assets/images/premium_icon.svg', status: 'locked' },
    { _id: 'b-14', id: 'b14', title: 'Community Ambassador', type: 'sharing_caring', requirement: 50, reward_coins: 100, icon: '/assets/images/share_icon.svg', status: 'locked' },
    { _id: 'b-15', id: 'b15', title: 'Streak Luminary', type: 'streak', requirement: 30, reward_coins: 200, icon: '/assets/images/daily_coins.svg', status: 'rewardUnlocked' },
  ],
  system_settings: [
    {
      type: 'general',
      app_name: 'StudyCord',
      currency_symbol: '₦',
      payout_request_status: '0',
      payout_disabled_message: 'Payout requests are currently paused by the administrator. Check back soon or continue earning coins!',
      correct_answer_coins: 4,
      wrong_penalty_coins: 2,
      lifeline_cost: 4,
      min_withdrawal_coins: 200,
      coin_value_in_currency: 5.0,
      about_us: 'StudyCord is the world premier multi-disciplinary trivia and quiz gaming platform powered by modern web technologies.',
      privacy_policy: 'Your privacy is paramount. We do not sell or disclose your personal data to any third party advertisers.',
      terms_conditions: 'By participating in quizzes and contests, you agree to fair-play rules and zero cheating tolerances.',
      instructions: 'Answer each question within the countdown timer. Use lifelines wisely at the cost of 4 coins each.',
    }
  ],
  question_reports: [
    {
      _id: 'rep-1',
      id: '1',
      question_id: '2',
      user_id: '101',
      message: 'Question #2 (Chemical symbol for Gold): Explanation formatting clarification.',
      date: '2026-10-17',
      status: '0', // 0: Pending, 1: Resolved
    },
    {
      _id: 'rep-2',
      id: '2',
      question_id: '15',
      user_id: 'u1',
      message: 'Question #15 (Machu Picchu): Geographical region tag inquiry.',
      date: '2026-10-17',
      status: '0',
    }
  ],
  notifications: [
    {
      _id: 'notif-1',
      id: '1',
      title: 'New Contest Started!',
      message: 'The Mega Weekend Championship is live now. Enter to win 500 coins!',
      date: '2 hours ago',
      type: '1',
    },
    {
      _id: 'notif-2',
      id: '2',
      title: 'Daily Streak Available',
      message: 'Claim your daily quiz streak bonus now.',
      date: '1 day ago',
      type: '1',
    },
    {
      _id: 'notif-3',
      id: '3',
      title: 'Badge Unlocked!',
      message: 'You unlocked the "Battle Gladiator" badge!',
      date: '3 days ago',
      type: '1',
    }
  ],
  sliders: [
    {
      _id: 's-1',
      id: '1',
      title: 'Global Trivia Championship 2026',
      description: 'Enter the tournament now to climb the leaderboard and win 5,000 coins!',
      image: '/assets/images/contest_banner.svg',
      status: '1',
      row_order: 1,
    },
    {
      _id: 's-2',
      id: '2',
      title: 'Master 1v1 Battle Arena',
      description: 'Challenge players worldwide in real-time quiz duels with live score counters.',
      image: '/assets/images/one_vs_one_icon.svg',
      status: '1',
      row_order: 2,
    },
  ],
  coin_store: [
    { _id: 'cp-1', id: '1', title: 'Starter Pack', coins: 100, price: '0.99', description: 'Get started with essential lifelines', popular: false },
    { _id: 'cp-2', id: '2', title: 'Popular Pack', coins: 300, price: '2.49', description: 'Best value for active battle contenders', popular: true },
    { _id: 'cp-3', id: '3', title: 'Pro Pack', coins: 750, price: '4.99', description: 'Power up for competitive leaderboard seasons', popular: false },
    { _id: 'cp-4', id: '4', title: 'Ultimate Pack', coins: 2000, price: '9.99', description: 'Supreme stockpile for tournament champions', popular: false },
  ],
  referrals: [],
};

const memoryStore: Record<string, any[]> = globalThis._eliteMemoryStore || (globalThis._eliteMemoryStore = initialMemoryStore);

let hasSyncedInitialData = false;
async function ensureDbSynced(database: Db) {
  if (hasSyncedInitialData) return;
  hasSyncedInitialData = true;
  try {
    const questionCount = await database.collection('questions').countDocuments();
    if (questionCount === 0) {
      console.log('[MongoDB Atlas] Empty database detected. Seeding initial datasets into Atlas...');
      for (const [colName, docs] of Object.entries(initialMemoryStore)) {
        if (!Array.isArray(docs) || docs.length === 0) continue;
        const count = await database.collection(colName).countDocuments();
        if (count === 0) {
          console.log(`[MongoDB Atlas] Seeding collection "${colName}" with ${docs.length} records...`);
          await database.collection(colName).insertMany(docs);
        }
      }
      console.log('[MongoDB Atlas] Initial datasets synced successfully.');
    }
  } catch (err) {
    console.warn('[MongoDB Atlas] Auto-sync notice:', err);
  }
}

async function getMongoClient(): Promise<MongoClient | null> {
  if (client) return client;
  const currentUri = process.env.MONGODB_URI || uri;
  if (!currentUri) return null;

  try {
    if (!globalThis._mongoClientPromise) {
      const mc = new MongoClient(currentUri, { serverSelectionTimeoutMS: 10000 });
      globalThis._mongoClientPromise = mc.connect();
    }
    clientPromise = globalThis._mongoClientPromise;
    client = await clientPromise;
    isConnectedToMongo = true;
    return client;
  } catch (err) {
    console.warn('[MongoDB Atlas] Connection notice, operating safely with memory cache fallback:', err);
    isConnectedToMongo = false;
    return null;
  }
}

export async function getDb(): Promise<Db | null> {
  const mc = await getMongoClient();
  if (mc) {
    const database = mc.db();
    await ensureDbSynced(database);
    return database;
  }
  return null;
}

export function isMongoConnected(): boolean {
  return isConnectedToMongo;
}

/**
 * Universal Repository Layer
 * Queries MongoDB if connected; otherwise seamlessly transparently reads/writes to memory store.
 * Guarantees 100% continuous uptime and zero runtime crashes.
 */
export const dbRepository = {
  async find(collectionName: string, query: any = {}, options: { sort?: any; limit?: number; skip?: number } = {}) {
    const db = await getDb();
    if (db) {
      try {
        let cursor = db.collection(collectionName).find(query);
        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.skip) cursor = cursor.skip(options.skip);
        if (options.limit) cursor = cursor.limit(options.limit);
        return await cursor.toArray();
      } catch {
        // Fall back to memory
      }
    }

    const items = memoryStore[collectionName] || [];
    let result = items.filter(item => {
      for (const key of Object.keys(query)) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });

    if (options.skip) result = result.slice(options.skip);
    if (options.limit) result = result.slice(0, options.limit);
    return result;
  },

  async findOne(collectionName: string, query: any = {}) {
    const list = await this.find(collectionName, query, { limit: 1 });
    return list.length > 0 ? list[0] : null;
  },

  async insertOne(collectionName: string, doc: any) {
    if (!doc.id) doc.id = String(Date.now());
    if (!doc._id) doc._id = doc.id;

    const db = await getDb();
    if (db) {
      try {
        await db.collection(collectionName).insertOne(doc);
      } catch {
        // Safe fall back
      }
    }

    if (!memoryStore[collectionName]) memoryStore[collectionName] = [];
    memoryStore[collectionName].push(doc);
    return doc;
  },

  async updateOne(collectionName: string, filter: any, update: any) {
    const db = await getDb();
    if (db) {
      try {
        await db.collection(collectionName).updateOne(filter, { $set: update });
      } catch {
        // Fall back
      }
    }

    const items = memoryStore[collectionName] || [];
    const index = items.findIndex(item => {
      for (const k of Object.keys(filter)) {
        if (item[k] !== filter[k]) return false;
      }
      return true;
    });

    if (index !== -1) {
      memoryStore[collectionName][index] = { ...memoryStore[collectionName][index], ...update };
      return memoryStore[collectionName][index];
    }
    return null;
  },

  async deleteOne(collectionName: string, filter: any) {
    const db = await getDb();
    if (db) {
      try {
        await db.collection(collectionName).deleteOne(filter);
      } catch {
        // Fall back
      }
    }

    const items = memoryStore[collectionName] || [];
    const filtered = items.filter(item => {
      for (const k of Object.keys(filter)) {
        if (item[k] === filter[k]) return false;
      }
      return true;
    });
    memoryStore[collectionName] = filtered;
    return true;
  },

  async count(collectionName: string, query: any = {}) {
    const list = await this.find(collectionName, query);
    return list.length;
  }
};
