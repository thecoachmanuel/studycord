import { API_BASE } from './constants';
import { Category, Subcategory, Question, Contest, Exam, Badge, LeaderboardEntry, UserProfile } from '../types';
import { COMPREHENSIVE_QUESTIONS } from './questionsData';
import { getShuffledQuestions, formatQuestionText } from './quizEngine';
import { getComprehensionByLevel, getAllComprehensionQuestions } from './comprehensionData';
import { TRUE_FALSE_LEVEL_QUESTIONS, DAILY_QUIZ_LEVEL_QUESTIONS, ADVANCED_CATEGORY_QUESTIONS } from './levelQuestionsPool';

// Default mock data mirroring elite quiz app backend
export const DEFAULT_USER: UserProfile = {
  userId: '101',
  name: 'Tawaab',
  email: 'tawaab@studycord.app',
  mobile: '+1 234 567 8900',
  profileUrl: '/assets/config/profile/1.svg',
  allTimeScore: '2450',
  allTimeRank: '4',
  coins: '680',
  referCode: 'STUDY99',
  appLanguage: 'en',
  status: '1',
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    categoryName: 'General Knowledge',
    image: '/assets/images/quiz_zone_icon.svg',
    hasSubcategories: true,
    hasLevels: true,
    maxLevel: '10',
    noOfQuestions: '200',
  },
  {
    id: '2',
    categoryName: 'Science & Technology',
    image: '/assets/images/science_icon.svg',
    hasSubcategories: true,
    hasLevels: true,
    maxLevel: '10',
    noOfQuestions: '200',
  },
  {
    id: '3',
    categoryName: 'Mathematics & Logic',
    image: '/assets/images/maths_icon.svg',
    hasSubcategories: true,
    hasLevels: true,
    maxLevel: '10',
    noOfQuestions: '200',
  },
  {
    id: '4',
    categoryName: 'History & Geography',
    image: '/assets/images/daily_quiz_icon.svg',
    hasSubcategories: true,
    hasLevels: true,
    maxLevel: '10',
    noOfQuestions: '200',
  },
  {
    id: '5',
    categoryName: 'Sports & Games',
    image: '/assets/images/group_battle_icon.svg',
    hasSubcategories: true,
    hasLevels: true,
    maxLevel: '10',
    noOfQuestions: '200',
  },
  {
    id: '6',
    categoryName: 'Elite Premium Masterclass',
    image: '/assets/images/premium_icon.svg',
    hasSubcategories: true,
    hasLevels: true,
    maxLevel: '10',
    isPremium: true,
    hasUnlocked: false,
    requiredCoins: 200,
    noOfQuestions: '200',
  },
];

export const MOCK_SUBCATEGORIES: Record<string, Subcategory[]> = {
  '1': [
    { id: '101', maincatId: '1', subcategoryName: 'World Trivia', status: '1', maxLevel: '10' },
    { id: '102', maincatId: '1', subcategoryName: 'Famous Inventions', status: '1', maxLevel: '10' },
    { id: '103', maincatId: '1', subcategoryName: 'Arts & Literature', status: '1', maxLevel: '10' },
    { id: '104', maincatId: '1', subcategoryName: 'Mythology & Folklore', status: '1', maxLevel: '10' },
    { id: '105', maincatId: '1', subcategoryName: 'Pop Culture & Cinema', status: '1', maxLevel: '10' },
  ],
  '2': [
    { id: '201', maincatId: '2', subcategoryName: 'Physics & Space', status: '1', maxLevel: '10' },
    { id: '202', maincatId: '2', subcategoryName: 'Computer Science & AI', status: '1', maxLevel: '10' },
    { id: '203', maincatId: '2', subcategoryName: 'Biology & Nature', status: '1', maxLevel: '10' },
    { id: '204', maincatId: '2', subcategoryName: 'Chemistry & Elements', status: '1', maxLevel: '10' },
    { id: '205', maincatId: '2', subcategoryName: 'Earth Science & Oceans', status: '1', maxLevel: '10' },
  ],
  '3': [
    { id: '301', maincatId: '3', subcategoryName: 'Mental Arithmetic & Speed Math', status: '1', maxLevel: '10' },
    { id: '302', maincatId: '3', subcategoryName: 'Algebra & Equations', status: '1', maxLevel: '10' },
    { id: '303', maincatId: '3', subcategoryName: 'Geometry & Spatial Reasoning', status: '1', maxLevel: '10' },
    { id: '304', maincatId: '3', subcategoryName: 'Logic Puzzles & Deductions', status: '1', maxLevel: '10' },
    { id: '305', maincatId: '3', subcategoryName: 'Probability & Statistics', status: '1', maxLevel: '10' },
  ],
  '4': [
    { id: '401', maincatId: '4', subcategoryName: 'Ancient Civilizations', status: '1', maxLevel: '10' },
    { id: '402', maincatId: '4', subcategoryName: 'World Capitals & Borders', status: '1', maxLevel: '10' },
    { id: '403', maincatId: '4', subcategoryName: 'Medieval & Modern Warfare', status: '1', maxLevel: '10' },
    { id: '404', maincatId: '4', subcategoryName: 'Explorers & Maritime Expeditions', status: '1', maxLevel: '10' },
    { id: '405', maincatId: '4', subcategoryName: 'Wonders of the World', status: '1', maxLevel: '10' },
  ],
  '5': [
    { id: '501', maincatId: '5', subcategoryName: 'Global Football (Soccer)', status: '1', maxLevel: '10' },
    { id: '502', maincatId: '5', subcategoryName: 'Olympic Games & Records', status: '1', maxLevel: '10' },
    { id: '503', maincatId: '5', subcategoryName: 'Basketball & NBA Legends', status: '1', maxLevel: '10' },
    { id: '504', maincatId: '5', subcategoryName: 'Tennis & Grand Slams', status: '1', maxLevel: '10' },
    { id: '505', maincatId: '5', subcategoryName: 'Chess & Strategy Esports', status: '1', maxLevel: '10' },
  ],
  '6': [
    { id: '601', maincatId: '6', subcategoryName: 'Elite Masterclass & Philosophy', status: '1', maxLevel: '10' },
    { id: '602', maincatId: '6', subcategoryName: 'Advanced Astrophysics', status: '1', maxLevel: '10' },
    { id: '603', maincatId: '6', subcategoryName: 'Quantum Physics & Computing', status: '1', maxLevel: '10' },
    { id: '604', maincatId: '6', subcategoryName: 'Classical & Modern Philosophy', status: '1', maxLevel: '10' },
    { id: '605', maincatId: '6', subcategoryName: 'Geopolitics & World Economy', status: '1', maxLevel: '10' },
  ],
};

export const MOCK_QUESTIONS: Question[] = [];

// 1. True & False Questions (Full 10 Levels of Rich Verification Challenges)
export const MOCK_TRUE_FALSE_QUESTIONS: Question[] = TRUE_FALSE_LEVEL_QUESTIONS;

// 2. Audio Quiz Questions (With audio sound clips & waveform player)
export const MOCK_AUDIO_QUESTIONS: Question[] = [
  {
    id: 'aud1',
    category: 'audio',
    subcategory: 'audio',
    languageId: 'en',
    audio: '/assets/config/sounds/click.mp3',
    question: 'Listen to the audio sample: Which musical instrument is playing this acoustic rhythm?',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'Spanish Flamenco Guitar' },
      { id: 'opt2', title: 'Classical Grand Piano' },
      { id: 'opt3', title: 'Concert Cello' },
      { id: 'opt4', title: 'Alto Saxophone' },
    ],
    correctAnswerOptionId: 'opt1',
    note: 'The nylon-string acoustic timber and percussive strumming are characteristic of the Spanish guitar.',
  },
  {
    id: 'aud2',
    category: 'audio',
    subcategory: 'audio',
    languageId: 'en',
    audio: '/assets/config/sounds/right.mp3',
    question: 'Listen to the harmonic frequency: Which musical scale interval is sounded in this chime?',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'Major Third Interval (C to E)' },
      { id: 'opt2', title: 'Diminished Fifth' },
      { id: 'opt3', title: 'Minor Second' },
      { id: 'opt4', title: 'Octave Leap' },
    ],
    correctAnswerOptionId: 'opt1',
    note: 'The uplifting two-tone chime sounds a resonant ascending major third interval in C major.',
  },
  {
    id: 'aud3',
    category: 'audio',
    subcategory: 'audio',
    languageId: 'en',
    audio: '/assets/config/sounds/wrong.mp3',
    question: 'Listen to the sound cue: What waveform modulation generates this warning buzzer sound?',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'Sawtooth wave descending ramp' },
      { id: 'opt2', title: 'Pure high-frequency sine tone' },
      { id: 'opt3', title: 'White noise burst' },
      { id: 'opt4', title: 'Frequency modulation bell' },
    ],
    correctAnswerOptionId: 'opt1',
    note: 'The raspy, buzzing warning sound is synthesized using a descending sawtooth oscillator.',
  },
  {
    id: 'aud4',
    category: 'audio',
    subcategory: 'audio',
    languageId: 'en',
    audio: '/assets/config/sounds/right.mp3',
    question: 'Listen to the chime sound: Which natural bird song melody does this tone mimic?',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'Eurasian Blue Tit' },
      { id: 'opt2', title: 'Nightingale Call' },
      { id: 'opt3', title: 'Morning Song Thrush' },
      { id: 'opt4', title: 'Canary Warble' },
    ],
    correctAnswerOptionId: 'opt2',
    note: 'Nightingales are renowned for their high-clarity ascending whistling notes.',
  },
];

// 3. Math Mania Questions (Equations, Algebra, Calculations)
export const MOCK_MATH_QUESTIONS: Question[] = [
  {
    id: 'm1',
    category: 'math',
    subcategory: 'math',
    languageId: 'en',
    mathEquation: '15 × 14 - 85 = ?',
    question: 'Evaluate the arithmetic expression:',
    questionType: '1',
    options: [
      { id: 'opt1', title: '115' },
      { id: 'opt2', title: '125' },
      { id: 'opt3', title: '135' },
      { id: 'opt4', title: '145' },
    ],
    correctAnswerOptionId: 'opt2',
    note: '15 × 14 = 210. Then 210 - 85 = 125.',
  },
  {
    id: 'm2',
    category: 'math',
    subcategory: 'math',
    languageId: 'en',
    mathEquation: 'Solve for x:  4x + 19 = 55',
    question: 'Find the value of x in the linear algebraic equation:',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'x = 7' },
      { id: 'opt2', title: 'x = 8' },
      { id: 'opt3', title: 'x = 9' },
      { id: 'opt4', title: 'x = 11' },
    ],
    correctAnswerOptionId: 'opt3',
    note: 'Subtract 19 from both sides: 4x = 36. Divide by 4: x = 9.',
  },
  {
    id: 'm3',
    category: 'math',
    subcategory: 'math',
    languageId: 'en',
    mathEquation: '√324 + √169 = ?',
    question: 'Calculate the sum of the square roots:',
    questionType: '1',
    options: [
      { id: 'opt1', title: '29' },
      { id: 'opt2', title: '31' },
      { id: 'opt3', title: '33' },
      { id: 'opt4', title: '35' },
    ],
    correctAnswerOptionId: 'opt2',
    note: '√324 = 18 and √169 = 13. 18 + 13 = 31.',
  },
  {
    id: 'm4',
    category: 'math',
    subcategory: 'math',
    languageId: 'en',
    mathEquation: '25% of 480 + 15% of 200 = ?',
    question: 'Calculate the total percentage sum:',
    questionType: '1',
    options: [
      { id: 'opt1', title: '135' },
      { id: 'opt2', title: '140' },
      { id: 'opt3', title: '150' },
      { id: 'opt4', title: '160' },
    ],
    correctAnswerOptionId: 'opt3',
    note: '25% of 480 = 120. 15% of 200 = 30. 120 + 30 = 150.',
  },
  {
    id: 'm5',
    category: 'math',
    subcategory: 'math',
    languageId: 'en',
    mathEquation: 'In a right triangle: a = 9, b = 12. Find hypotenuse c:',
    question: 'Apply the Pythagorean Theorem (a² + b² = c²):',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'c = 14' },
      { id: 'opt2', title: 'c = 15' },
      { id: 'opt3', title: 'c = 16' },
      { id: 'opt4', title: 'c = 18' },
    ],
    correctAnswerOptionId: 'opt2',
    note: '9² + 12² = 81 + 144 = 225. √225 = 15.',
  },
];

// 4. Daily Quiz (Full 10 Levels of Streak Challenges)
export const MOCK_DAILY_QUESTIONS: Question[] = DAILY_QUIZ_LEVEL_QUESTIONS;

// 5. Fun & Learn Reading Comprehension Questions
export const MOCK_FUN_AND_LEARN_QUESTIONS: Question[] = [
  {
    id: 'fnl1',
    category: 'fun',
    subcategory: 'fun',
    languageId: 'en',
    passage: 'The Great Barrier Reef is the world\'s largest coral reef system composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometres over an area of approximately 344,400 square kilometres. Located in the Coral Sea off Queensland, Australia, it was selected as a World Heritage Site in 1981.',
    question: 'Where is the Great Barrier Reef geographically situated according to the passage?',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'Tasman Sea off Sydney, Australia' },
      { id: 'opt2', title: 'Coral Sea off Queensland, Australia' },
      { id: 'opt3', title: 'Indian Ocean off Perth, Australia' },
      { id: 'opt4', title: 'Timor Sea off Darwin, Australia' },
    ],
    correctAnswerOptionId: 'opt2',
    note: 'The reef is located in the Coral Sea, off the northeastern coast of Queensland, Australia.',
  },
  {
    id: 'fnl2',
    category: 'fun',
    subcategory: 'fun',
    languageId: 'en',
    passage: 'This reef structure is composed of and built by billions of tiny organisms, known as coral polyps. It supports a wide diversity of life and was selected as a World Heritage Site in 1981.',
    question: 'In what year was the Great Barrier Reef designated as a UNESCO World Heritage Site?',
    questionType: '1',
    options: [
      { id: 'opt1', title: '1975' },
      { id: 'opt2', title: '1981' },
      { id: 'opt3', title: '1989' },
      { id: 'opt4', title: '1995' },
    ],
    correctAnswerOptionId: 'opt2',
    note: 'The Great Barrier Reef was inscribed as a World Heritage Site in 1981.',
  },
  {
    id: 'fnl3',
    category: 'fun',
    subcategory: 'fun',
    languageId: 'en',
    passage: 'This reef structure is composed of and built by billions of tiny organisms, known as coral polyps.',
    question: 'What microscopic organisms are responsible for physically constructing the coral reef?',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'Marine Plankton' },
      { id: 'opt2', title: 'Coral Polyps' },
      { id: 'opt3', title: 'Kelp Organisms' },
      { id: 'opt4', title: 'Sea Sponges' },
    ],
    correctAnswerOptionId: 'opt2',
    note: 'Coral polyps secrete calcium carbonate to form the hard skeletal structures that compose reefs.',
  },
  {
    id: 'fnl4',
    category: 'fun',
    subcategory: 'fun',
    languageId: 'en',
    passage: 'However, climate change and ocean acidification pose severe threats to its ecosystem.',
    question: 'What primary environmental challenges threaten the reef ecosystem according to the passage?',
    questionType: '1',
    options: [
      { id: 'opt1', title: 'Deep sea oil exploration' },
      { id: 'opt2', title: 'Climate change and ocean acidification' },
      { id: 'opt3', title: 'Industrial plastic manufacturing' },
      { id: 'opt4', title: 'Commercial whaling' },
    ],
    correctAnswerOptionId: 'opt2',
    note: 'Rising sea temperatures and increasing ocean acidity lead to widespread coral bleaching.',
  },
];

/**
 * Returns distinct, specialized questions based on quiz mode, category, level, and subcategory.
 * Features strict domain isolation and automated anti-repetition shuffling across all categories.
 */
export function getQuestionsForQuizType(
  quizType?: string,
  categoryId?: string,
  count: number = 5,
  level?: string | number,
  excludeIds: string[] = [],
  subcategoryId?: string
): Question[] {
  const allCategoryPool = [...COMPREHENSIVE_QUESTIONS, ...ADVANCED_CATEGORY_QUESTIONS];
  let pool = [...allCategoryPool];

  if (quizType === 'trueAndFalse') {
    pool = [...TRUE_FALSE_LEVEL_QUESTIONS];
    if (level) {
      const lvlFiltered = pool.filter((q) => String(q.level) === String(level));
      if (lvlFiltered.length > 0) pool = lvlFiltered;
    }
  } else if (quizType === 'audioQuestions') {
    pool = allCategoryPool.filter((q) => Boolean(q.audio) || q.category === 'audioQuestions' || q.category === 'audio');
    if (pool.length === 0) pool = MOCK_AUDIO_QUESTIONS;
    if (level) {
      const lvlFiltered = pool.filter((q) => String(q.level) === String(level));
      if (lvlFiltered.length > 0) pool = lvlFiltered;
    }
  } else if (quizType === 'mathMania') {
    pool = allCategoryPool.filter((q) => q.category === 'mathMania' || (Boolean(q.mathEquation) && String(q.category) === '3'));
    if (pool.length === 0) pool = MOCK_MATH_QUESTIONS;
    if (level) {
      const lvlFiltered = pool.filter((q) => String(q.level) === String(level));
      if (lvlFiltered.length > 0) pool = lvlFiltered;
    }
  } else if (quizType === 'dailyQuiz') {
    pool = [...DAILY_QUIZ_LEVEL_QUESTIONS];
    if (level) {
      const lvlFiltered = pool.filter((q) => String(q.level) === String(level));
      if (lvlFiltered.length > 0) pool = lvlFiltered;
    }
  } else if (quizType === 'funAndLearn') {
    if (level) {
      pool = getComprehensionByLevel(level).questions;
    } else {
      pool = getAllComprehensionQuestions();
    }
  } else if (quizType === 'oneVsOneBattle' || quizType === 'groupPlay') {
    // Battle draws strictly from fast-paced, balanced trivia (no reading passages, no complex math equations, no audio)
    pool = allCategoryPool.filter(
      (q) => q.category === 'battle' || (q.questionType === '1' && !q.passage && !q.mathEquation && !q.audio && q.category !== '8' && q.category !== '11' && q.category !== 'mathMania' && q.category !== '3')
    );
  } else if (categoryId) {
    let catFiltered: Question[];
    if (String(categoryId) === '3') {
      // Mathematics & Logic: STRICT ISOLATION, ONLY math equations & formulas
      catFiltered = allCategoryPool.filter(
        (q) => String(q.category) === '3' || q.category === 'mathMania' || Boolean(q.mathEquation)
      );
    } else {
      catFiltered = allCategoryPool.filter((q) => String(q.category) === String(categoryId));
    }

    // Subcategory strict isolation
    if (subcategoryId) {
      const subFiltered = catFiltered.filter((q) => String(q.subcategory) === String(subcategoryId));
      if (subFiltered.length > 0) {
        catFiltered = subFiltered;
      }
    }

    if (catFiltered.length > 0) {
      if (level) {
        const lvlFiltered = catFiltered.filter((q) => String(q.level) === String(level));
        pool = lvlFiltered.length > 0 ? lvlFiltered : catFiltered;
      } else {
        pool = catFiltered;
      }
    }
  } else if (level) {
    const lvlFiltered = allCategoryPool.filter(
      (q) => String(q.level) === String(level) && q.questionType === '1' && !q.passage && !q.mathEquation && !q.audio
    );
    if (lvlFiltered.length > 0) pool = lvlFiltered;
  }

  // Apply anti-repetition Fisher-Yates shuffling to both questions and options
  return getShuffledQuestions(pool, count, excludeIds);
}


/**
 * Transforms a raw question object from the database/API into the standard client Question interface.
 * Also sanitizes the question text to remove unwanted bracket tags or question numbering.
 */
export function transformDbQuestionToQuestion(dbQ: any): Question {
  const isTf = String(dbQ.question_type) === '2';
  let options = [];
  if (isTf) {
    options = [
      { id: 'opt1', title: 'True' },
      { id: 'opt2', title: 'False' },
    ];
  } else {
    if (dbQ.optiona) options.push({ id: 'opt1', title: dbQ.optiona });
    if (dbQ.optionb) options.push({ id: 'opt2', title: dbQ.optionb });
    if (dbQ.optionc) options.push({ id: 'opt3', title: dbQ.optionc });
    if (dbQ.optiond) options.push({ id: 'opt4', title: dbQ.optiond });
  }

  let correctAnswerOptionId = 'opt1';
  const ans = String(dbQ.answer || '').toLowerCase().trim();
  if (isTf) {
    if (ans === 'b' || ans === 'opt2' || ans === 'false') {
      correctAnswerOptionId = 'opt2';
    } else {
      correctAnswerOptionId = 'opt1';
    }
  } else {
    if (ans === 'b' || ans === 'opt2') correctAnswerOptionId = 'opt2';
    else if (ans === 'c' || ans === 'opt3') correctAnswerOptionId = 'opt3';
    else if (ans === 'd' || ans === 'opt4') correctAnswerOptionId = 'opt4';
    else correctAnswerOptionId = 'opt1';
  }

  return {
    id: String(dbQ.id || dbQ._id),
    category: String(dbQ.category || ''),
    subcategory: String(dbQ.subcategory || ''),
    level: dbQ.level ? String(dbQ.level) : '1',
    languageId: dbQ.language_id || 'en',
    image: dbQ.image || undefined,
    audio: dbQ.audio || undefined,
    mathEquation: dbQ.mathEquation || dbQ.math_equation || undefined,
    passage: dbQ.passage || undefined,
    question: formatQuestionText(dbQ.question || ''),
    questionType: isTf ? '2' : '1',
    options,
    correctAnswerOptionId,
    note: dbQ.note || undefined,
  };
}

/**
 * Dynamically fetches questions from the backend API (/api/questions) to guarantee that all
 * quiz modes, categories, subcategories, levels, and admin changes load directly from the backend.
 */
export async function fetchQuestionsFromBackend(params: {
  quizType?: string;
  categoryId?: string;
  subcategoryId?: string;
  level?: string | number;
  count?: number;
  excludeIds?: string[];
}): Promise<Question[]> {
  const { quizType, categoryId, subcategoryId, level, count = 5, excludeIds = [] } = params;

  try {
    const searchParams = new URLSearchParams();
    if (quizType) searchParams.set('quizType', quizType);
    if (categoryId) searchParams.set('category', categoryId);
    if (subcategoryId) searchParams.set('subcategory', subcategoryId);
    if (level) searchParams.set('level', String(level));

    const res = await fetch(`/api/questions?${searchParams.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const mappedQuestions = data.data.map(transformDbQuestionToQuestion);
        return getShuffledQuestions(mappedQuestions, count, excludeIds);
      }
    }
  } catch (err) {
    console.warn('Questions fetch from backend failed, falling back to local dataset:', err);
  }

  // Graceful fallback if backend is momentarily unreachable
  return getQuestionsForQuizType(quizType, categoryId, count, level, excludeIds, subcategoryId);
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { user_rank: '1', userId: 'u1', name: 'Alexander Wright', score: '5,820', profile: '/assets/config/profile/3.svg' },
  { user_rank: '2', userId: 'u2', name: 'Sophia Chen', score: '4,940', profile: '/assets/config/profile/7.svg' },
  { user_rank: '3', userId: 'u3', name: 'Marcus Sterling', score: '3,860', profile: '/assets/config/profile/2.svg' },
  { user_rank: '4', userId: '101', name: 'Tawaab', score: '2,450', profile: '/assets/config/profile/1.svg' },
  { user_rank: '5', userId: 'u5', name: 'Elena Rostova', score: '2,180', profile: '/assets/config/profile/4.svg' },
  { user_rank: '6', userId: 'u6', name: 'David Kim', score: '1,920', profile: '/assets/config/profile/5.svg' },
  { user_rank: '7', userId: 'u7', name: 'Chloe Dubois', score: '1,650', profile: '/assets/config/profile/6.svg' },
  { user_rank: '8', userId: 'u8', name: 'Liam Johnson', score: '1,420', profile: '/assets/config/profile/8.svg' },
  { user_rank: '9', userId: 'u9', name: 'Aaliyah Khan', score: '1,100', profile: '/assets/config/profile/9.svg' },
  { user_rank: '10', userId: 'u10', name: 'Noah Miller', score: '980', profile: '/assets/config/profile/10.svg' },
];

export const MOCK_CONTESTS: Contest[] = [
  {
    id: 'c1',
    name: 'Mega Weekend Championship',
    description: 'Compete with the top players for massive prize pool coins and badges!',
    startDate: '2026-10-18',
    endDate: '2026-10-20',
    entryFee: 50,
    status: 'live',
  },
  {
    id: 'c2',
    name: 'Science & Cosmos League',
    description: 'High-speed 20 questions challenge testing deep physics and cosmology.',
    startDate: '2026-10-21',
    endDate: '2026-10-23',
    entryFee: 30,
    status: 'upcoming',
  },
  {
    id: 'c3',
    name: 'Global History & Civilization Cup',
    description: 'Championship on ancient civilizations, world dynasties, and key historical milestones.',
    startDate: '2026-10-10',
    endDate: '2026-10-14',
    entryFee: 40,
    status: 'past',
  },
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'e1',
    title: 'Certified General Knowledge Exam',
    date: '2026-10-17',
    duration: 15,
    totalMarks: 50,
    examStatus: '1',
  },
  {
    id: 'e2',
    title: 'Technology & Logic Assessment',
    date: '2026-10-22',
    duration: 20,
    totalMarks: 60,
    examStatus: '1',
  },
];

export const MOCK_BADGES: Badge[] = [
  { id: 'b1', type: 'dashing_debut', title: 'Dashing Debut', description: 'Play first quiz zone game', icon: '/assets/images/quiz_zone_icon.svg', status: 'rewardUnlocked', reward: 50 },
  { id: 'b2', type: 'combat_winner', title: 'Combat Winner', description: 'Won random battle. If both users completed the battle then the badge unlocks.', icon: '/assets/images/one_vs_one_icon.svg', status: 'unlocked', reward: 75 },
  { id: 'b3', type: 'clash_winner', title: 'Clash Winner', description: 'Won group battle against online opponents.', icon: '/assets/images/group_battle_icon.svg', status: 'unlocked', reward: 100 },
  { id: 'b4', type: 'most_wanted_winner', title: 'Most Wanted Winner', description: 'Won contest championship.', icon: '/assets/images/score.svg', status: 'unlocked', reward: 150 },
  { id: 'b5', type: 'ultimate_player', title: 'Ultimate Player', description: 'Highest point gainer on global leaderboard.', icon: '/assets/images/rank_1.svg', status: 'locked', reward: 250 },
  { id: 'b6', type: 'quiz_warrior', title: 'Quiz Warrior', description: 'Won back-to-back three random battles.', icon: '/assets/images/quiz_warrior_icon.svg', status: 'locked', reward: 150 },
  { id: 'b7', type: 'super_sonic', title: 'Super Sonic', description: 'Fastest puzzle solver. Answer at least 5 questions under speed record.', icon: '/assets/images/lifeline_resettime.svg', status: 'unlocked', reward: 80 },
  { id: 'b8', type: 'recall_master', title: 'Recall Master', description: 'Average time to solve fun & learn quiz questions.', icon: '/assets/images/fun_icon.svg', status: 'locked', reward: 60 },
  { id: 'b9', type: 'brainiac', title: 'Brainiac', description: 'Completed 100% quiz without using any lifelines.', icon: '/assets/images/badges_icon.svg', status: 'unlocked', reward: 120 },
  { id: 'b10', type: 'grandmaster', title: 'Grandmaster', description: 'Answer over 5,000 correct questions.', icon: '/assets/images/correct.svg', status: 'locked', reward: 300 },
  { id: 'b11', type: 'elite', title: 'Elite Scholar', description: 'Earn over 5,000 total coins in your wallet.', icon: '/assets/images/earnedCoin.svg', status: 'locked', reward: 200 },
  { id: 'b12', type: 'knowledge_seeker', title: 'Knowledge Seeker', description: 'Play daily quiz continuously for 30 days.', icon: '/assets/images/daily_quiz_icon.svg', status: 'locked', reward: 175 },
  { id: 'b13', type: 'power_elite', title: 'Power Legend', description: 'Achieved more than 10 total badges.', icon: '/assets/images/premium_icon.svg', status: 'locked', reward: 500 },
  { id: 'b14', type: 'community_ambassador', title: 'Community Ambassador', description: 'Share application to more than 50 friends.', icon: '/assets/images/share_icon.svg', status: 'locked', reward: 100 },
  { id: 'b15', type: 'streak_luminary', title: 'Streak Luminary', description: 'Maintain quiz streak continuously for 30 days.', icon: '/assets/images/daily_coins.svg', status: 'rewardUnlocked', reward: 200 },
];

export const MOCK_COIN_PACKAGES = [
  { id: 'cp1', coins: 100, price: '₦500', amountNaira: 500, desc: 'Starter Pack', icon: '/assets/images/coin.svg' },
  { id: 'cp2', coins: 300, price: '₦1,200', amountNaira: 1200, desc: 'Popular Pack', icon: '/assets/images/coin.svg', popular: true },
  { id: 'cp3', coins: 750, price: '₦2,500', amountNaira: 2500, desc: 'Pro Pack', icon: '/assets/images/earnedCoin.svg' },
  { id: 'cp4', coins: 2000, price: '₦5,000', amountNaira: 5000, desc: 'Ultimate Pack', icon: '/assets/images/daily_coins.svg' },
];

export const MOCK_TRANSACTIONS = [
  // Coin Account Entries (Credits and Debits)
  { id: 'tx-c1', date: '2026-10-18', title: 'Daily Scratch Card Bonus', amount: '+50 Coins', coins: '+50', numericAmount: 50, type: 'credit', account: 'coin', currency: 'COIN' },
  { id: 'tx-c2', date: '2026-10-18', title: 'Audience Poll Lifeline', amount: '-4 Coins', coins: '-4', numericAmount: 4, type: 'debit', account: 'coin', currency: 'COIN' },
  { id: 'tx-c3', date: '2026-10-17', title: 'Quiz Zone Level 3 Win', amount: '+40 Coins', coins: '+40', numericAmount: 40, type: 'credit', account: 'coin', currency: 'COIN' },
  { id: 'tx-c4', date: '2026-10-16', title: '1v1 Battle Victory Reward', amount: '+35 Coins', coins: '+35', numericAmount: 35, type: 'credit', account: 'coin', currency: 'COIN' },
  { id: 'tx-c5', date: '2026-10-15', title: 'Contest Entry Fee (Cosmos League)', amount: '-30 Coins', coins: '-30', numericAmount: 30, type: 'debit', account: 'coin', currency: 'COIN' },
  { id: 'tx-c6', date: '2026-10-14', title: 'Referral Bonus (Friend Joined)', amount: '+100 Coins', coins: '+100', numericAmount: 100, type: 'credit', account: 'coin', currency: 'COIN' },
  { id: 'tx-c7', date: '2026-10-12', title: 'Review Answers Lifeline', amount: '-10 Coins', coins: '-10', numericAmount: 10, type: 'debit', account: 'coin', currency: 'COIN' },

  // Money Account Entries (Credits and Debits in ₦ NGN)
  { id: 'tx-m1', date: '2026-10-18', title: 'Bank Transfer Cashout Request', amount: '-₦1,000.00', coins: '-200', numericAmount: 1000, type: 'debit', account: 'money', currency: 'NGN', status: 'pending' },
  { id: 'tx-m2', date: '2026-10-16', title: 'Coin Store Pack Purchased (Paystack)', amount: '-₦2,500.00', coins: '+500', numericAmount: 2500, type: 'debit', account: 'money', currency: 'NGN', status: 'completed' },
  { id: 'tx-m3', date: '2026-10-14', title: 'Cashout Payout Disbursed', amount: '+₦2,000.00', coins: '-400', numericAmount: 2000, type: 'credit', account: 'money', currency: 'NGN', status: 'completed' },
  { id: 'tx-m4', date: '2026-10-10', title: 'Mega Tournament Cash Prize', amount: '+₦5,000.00', coins: '0', numericAmount: 5000, type: 'credit', account: 'money', currency: 'NGN', status: 'completed' },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'New Contest Started!', message: 'The Mega Weekend Championship is live now. Enter to win 500 coins!', date: '2 hours ago' },
  { id: 'n2', title: 'Daily Reward Available', message: 'Claim your daily quiz streak bonus now.', date: '1 day ago' },
  { id: 'n3', title: 'Badge Unlocked!', message: 'You unlocked the "Battle Gladiator" badge!', date: '3 days ago' },
];

// Api Service with graceful remote request + fallback
export class ApiService {
  static async post(endpoint: string, data: Record<string, any> = {}): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Remote API unavailable or CORS restricted in browser dev mode
    }
    return null;
  }
}

/**
 * Helper to identify special arcade quiz modes (Fun & Learn, Guess Word, Audio, Math Mania, Multi Match)
 */
export function isSpecialQuizModeCategory(cat: { id?: string; categoryName?: string; category_name?: string; type?: string }): boolean {
  const id = String(cat.id || '');
  const name = String(cat.categoryName || cat.category_name || '').toLowerCase();
  const type = String(cat.type || '');

  if (['2', '3', '4', '5', '6'].includes(type)) return true;
  if (['7', '8', '9', '10', '11'].includes(id)) return true;
  if (
    name.includes('fun') ||
    name.includes('guess') ||
    name.includes('audio') ||
    name.includes('mania') ||
    name.includes('multi match') ||
    name.includes('multimatch')
  ) {
    return true;
  }
  return false;
}

/**
 * Global Frontend-Backend Synchronization Utility
 */
export async function syncFrontendWithAdminBackend(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const [catRes, subRes, qRes, contRes] = await Promise.all([
      fetch('/api/categories?type=1').then((r) => r.json()).catch(() => null),
      fetch('/api/subcategories').then((r) => r.json()).catch(() => null),
      fetch('/api/questions').then((r) => r.json()).catch(() => null),
      fetch('/api/contests').then((r) => r.json()).catch(() => null),
    ]);

    if (catRes && catRes.success && Array.isArray(catRes.data) && catRes.data.length > 0) {
      const liveCats: Category[] = catRes.data
        .filter((c: any) => !isSpecialQuizModeCategory(c))
        .map((c: any) => ({
          id: String(c.id),
          categoryName: c.category_name,
          image: c.image || '/assets/images/quiz_zone_icon.svg',
          hasSubcategories: true,
          hasLevels: true,
          maxLevel: String(c.maxLevel || '10'),
          noOfQuestions: String(c.noOfQuestions || '200'),
          isPremium: c.is_premium === '1',
          requiredCoins: c.required_coins || 200,
        }));
      MOCK_CATEGORIES.length = 0;
      MOCK_CATEGORIES.push(...liveCats);
    }

    if (subRes && subRes.success && Array.isArray(subRes.data) && subRes.data.length > 0) {
      subRes.data.forEach((s: any) => {
        const maincat = String(s.maincat_id || s.maincatId || '1');
        if (!MOCK_SUBCATEGORIES[maincat]) {
          MOCK_SUBCATEGORIES[maincat] = [];
        }
        const exists = MOCK_SUBCATEGORIES[maincat].some((e) => String(e.id) === String(s.id));
        if (!exists) {
          MOCK_SUBCATEGORIES[maincat].push({
            id: String(s.id),
            maincatId: maincat,
            subcategoryName: s.subcategory_name || s.subcategoryName,
            status: String(s.status || '1'),
            maxLevel: String(s.maxLevel || '10'),
          });
        }
      });
    }

    if (qRes && qRes.success && Array.isArray(qRes.data) && qRes.data.length > 0) {
      const liveQs: Question[] = qRes.data.map((q: any) => ({
        id: String(q.id),
        category: String(q.category || '1'),
        subcategory: String(q.subcategory || '101'),
        level: String(q.level || '1'),
        languageId: 'en',
        question: q.question,
        questionType: String(q.question_type || '1'),
        options: [
          { id: 'opt1', title: q.optiona || '' },
          { id: 'opt2', title: q.optionb || '' },
          ...(q.optionc ? [{ id: 'opt3', title: q.optionc }] : []),
          ...(q.optiond ? [{ id: 'opt4', title: q.optiond }] : []),
        ],
        correctAnswerOptionId: q.answer === 'a' ? 'opt1' : q.answer === 'b' ? 'opt2' : q.answer === 'c' ? 'opt3' : 'opt4',
        note: q.note || '',
        image: q.image || undefined,
        passage: q.passage || undefined,
        mathEquation: q.mathEquation || undefined,
        audio: q.audio || undefined,
      }));
      MOCK_QUESTIONS.length = 0;
      MOCK_QUESTIONS.push(...liveQs);
      COMPREHENSIVE_QUESTIONS.length = 0;
      COMPREHENSIVE_QUESTIONS.push(...liveQs);
    }

    if (contRes && contRes.success && Array.isArray(contRes.data) && contRes.data.length > 0) {
      const liveContests: Contest[] = contRes.data.map((c: any) => ({
        id: String(c.id),
        name: c.name,
        description: c.description || '',
        startDate: c.start_date,
        endDate: c.end_date,
        entryFee: Number(c.entry_coin || 10),
        status: (c.status === 'live' || c.status === '1') ? 'live' : 'upcoming',
      }));
      MOCK_CONTESTS.length = 0;
      MOCK_CONTESTS.push(...liveContests);
    }
  } catch {
    // Graceful offline fallback
  }
}


