export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  mobile: string;
  profileUrl: string;
  allTimeScore: string;
  allTimeRank: string;
  coins: string;
  referCode?: string;
  appLanguage?: string;
  status?: string;
}

export interface Category {
  id: string;
  categoryName: string;
  image?: string;
  hasSubcategories: boolean;
  hasLevels: boolean;
  maxLevel: string;
  requiredCoins?: number;
  isPremium?: boolean;
  hasUnlocked?: boolean;
  isPlayed?: boolean;
  hasQuestions?: boolean;
  noOfQuestions?: string;
}

export interface Subcategory {
  id: string;
  maincatId: string;
  subcategoryName: string;
  status: string;
  maxLevel: string;
  isPremium?: boolean;
  hasUnlocked?: boolean;
  requiredCoins?: number;
}

export interface AnswerOption {
  id: string;
  title: string;
}

export interface Question {
  id: string;
  category: string;
  subcategory: string;
  level?: string;
  languageId: string;
  image?: string;
  audio?: string;
  mathEquation?: string;
  passage?: string;
  question: string;
  questionType: '1' | '2'; // 1 = multiple choice, 2 = true/false
  options: AnswerOption[];
  correctAnswerOptionId: string;
  note?: string;
  submittedAnswerId?: string;
}

export interface GuessTheWordQuestion {
  id: string;
  languageId: string;
  image?: string;
  question: string;
  answer: string;
  options: string[];
  submittedAnswer?: string;
}

export interface Contest {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  image?: string;
  entryFee: number;
  topUsers?: Array<{ rank: string; name: string; score: string; profile: string }>;
  status?: 'live' | 'past' | 'upcoming';
  category?: string;
  prizePool?: number;
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  totalMarks: number;
  examStatus: string;
  rules?: string[];
}

export interface Badge {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  status: 'locked' | 'unlocked' | 'rewardUnlocked';
  reward: number;
}

export interface LeaderboardEntry {
  user_rank: string;
  userId: string;
  name: string;
  score: string;
  profile: string;
  coins?: string;
}

export interface SystemConfig {
  appName: string;
  panelUrl: string;
  isContestEnabled: boolean;
  isDailyQuizEnabled: boolean;
  isFunNLearnEnabled: boolean;
  isGuessTheWordEnabled: boolean;
  isAudioQuizEnabled: boolean;
  isMathQuizEnabled: boolean;
  isTrueFalseQuizEnabled: boolean;
  isMultiMatchQuizEnabled: boolean;
  isSelfChallengeEnabled: boolean;
  isExamEnabled: boolean;
  isPaymentRequestEnabled: boolean;
  isCoinStoreEnabled: boolean;
  isLanguageModeEnabled: boolean;
  isAdsEnable: boolean;
  isDailyAdsEnabled: boolean;
  refereeEarnCoin: string;
  referrerEarnCoin: string;
  appUrl: string;
  reviewAnswersDeductCoins: number;
  fiftyFiftyLifelineCoins: number;
  audiencePollLifelineCoins: number;
  resetTimeLifelineCoins: number;
  skipLifelineCoins: number;
}
