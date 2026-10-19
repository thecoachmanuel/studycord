export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'StudyCord';
export const PANEL_URL = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
export const API_BASE = `${PANEL_URL}/Api`;

export const COLORS = {
  light: {
    primary: '#ef5388',
    background: '#ffffff',
    pageBackground: '#f3f7fa',
    primaryText: '#45536d',
    canvas: 'rgba(0, 0, 0, 0.8)',
    shadow: 'rgba(239, 83, 136, 0.25)',
  },
  dark: {
    primary: '#f279a2',
    background: '#294261',
    pageBackground: '#233354',
    primaryText: '#fefefe',
    canvas: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(242, 121, 162, 0.25)',
  },
  common: {
    correct: '#5DB760',
    wrong: '#FF6169',
    timer: '#FF6169',
    pending: '#FFA726',
    addCoin: '#5DB760',
  },
};

export const ROUTES = {
  home: '/',
  splash: '/splash',
  introSlider: '/intro-slider',
  login: '/login',
  signUp: '/sign-up',
  otp: '/otp',
  selectProfile: '/profile/edit',
  quiz: '/quiz',
  result: '/result',
  reviewAnswers: '/review-answers',
  category: '/category',
  subCategory: '/sub-category',
  levels: '/levels',
  selfChallenge: '/self-challenge',
  selfChallengeQuestions: '/self-challenge/questions',
  contest: '/contest',
  contestLeaderboard: '/contest/leaderboard',
  funAndLearn: '/fun-and-learn',
  guessTheWord: '/guess-the-word',
  multiMatch: '/multi-match',
  battleFindOpponent: '/battle/find-opponent',
  battleQuiz: '/battle/quiz',
  groupBattle: '/battle/group',
  randomBattle: '/battle/random',
  exams: '/exam',
  exam: '/exam/quiz',
  bookmark: '/bookmark',
  badges: '/badges',
  rewards: '/rewards',
  coinStore: '/coin-store',
  wallet: '/wallet',
  coinHistory: '/coin-history',
  notifications: '/notifications',
  referAndEarn: '/refer-and-earn',
  settings: '/settings',
  aboutApp: '/about',
};

export const SOUNDS = {
  click: '/assets/config/sounds/click.mp3',
  right: '/assets/config/sounds/right.mp3',
  wrong: '/assets/config/sounds/wrong.mp3',
};

export const EXAM_RULES = [
  'I will not copy and give this exam with honesty',
  'If you lock your phone or switch windows the exam will complete automatically',
  'If you minimize application or open other applications and don\'t return within 5 seconds the exam completes automatically',
  'Screen recording is strictly prohibited',
  'Violations will be reported to the examiner immediately',
];

export const PREDEFINED_MESSAGES = [
  'Hello..!!',
  'How are you..?',
  'Fine..!!',
  'Have a nice day..',
  'Well played',
  'What a performance..!!',
  'Thanks..',
  'Welcome..',
  'Good luck!',
  'Good night',
  'Hurry Up',
  'Dudeeee',
];

