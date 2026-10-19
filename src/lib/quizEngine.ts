import { Question, AnswerOption } from '../types';

/**
 * Fisher-Yates array shuffling algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Cleans and formats question text by removing any leading or trailing metadata brackets
 * such as [Question 175], [Category Level 2], [Q175], (Question #175), etc.
 */
export function formatQuestionText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^\[(?:Question\s*)?\d+\]\s*/i, '')
    .replace(/^\((?:Question\s*)?\d+\)\s*/i, '')
    .replace(/^\[[^\]]+\]\s*/, '')
    .replace(/\s*\(Question\s*#?\d+\)\s*$/i, '')
    .trim();
}

/**
 * Shuffles question options while dynamically updating correctAnswerOptionId
 * so that answers never stay on predictable letter keys.
 */
export function shuffleQuestionOptions(q: Question): Question {
  const correctOption = q.options.find((o) => o.id === q.correctAnswerOptionId);
  const shuffledOptions = shuffleArray(q.options);

  // Map to stable letter IDs 'opt1', 'opt2', 'opt3', 'opt4' with new randomized order
  const remappedOptions: AnswerOption[] = shuffledOptions.map((opt, idx) => ({
    id: `opt${idx + 1}`,
    title: opt.title,
  }));

  const newCorrectOption = remappedOptions.find((o) => o.title === correctOption?.title);

  return {
    ...q,
    question: formatQuestionText(q.question),
    options: remappedOptions,
    correctAnswerOptionId: newCorrectOption?.id || 'opt1',
  };
}

/**
 * Shuffles questions list and prioritizes unseen questions to prevent repetitions.
 */
export function getShuffledQuestions(
  pool: Question[],
  count: number = 10,
  recentAnsweredIds: string[] = []
): Question[] {
  if (!pool || pool.length === 0) return [];

  // Separate into unseen vs seen questions
  const unseen = pool.filter((q) => !recentAnsweredIds.includes(q.id));
  const seen = pool.filter((q) => recentAnsweredIds.includes(q.id));

  // Shuffle both sets
  const shuffledUnseen = shuffleArray(unseen);
  const shuffledSeen = shuffleArray(seen);

  // Prioritize unseen questions, backfilling with seen if necessary
  const combined = [...shuffledUnseen, ...shuffledSeen];
  const selected = combined.slice(0, count);

  // Shuffle options inside each selected question
  return selected.map(shuffleQuestionOptions);
}

/**
 * Difficulty Configuration by Level
 * Progressively tougher: shorter countdowns, higher point stakes
 */
export interface LevelConfig {
  level: number;
  durationSeconds: number;
  pointsPerCorrect: number;
  coinsReward: number;
  passPercentage: number;
  minCorrectToPass: number;
}

export function getLevelConfig(levelInput: number | string = 1, totalQuestions: number = 5): LevelConfig {
  const level = Math.max(1, parseInt(String(levelInput), 10) || 1);

  let durationSeconds = 30;
  let pointsPerCorrect = 10;
  let coinsReward = 2;
  const passPercentage = 60;

  switch (level) {
    case 1:
      durationSeconds = 30;
      pointsPerCorrect = 10;
      coinsReward = 1;
      break;
    case 2:
      durationSeconds = 28;
      pointsPerCorrect = 12;
      coinsReward = 1;
      break;
    case 3:
      durationSeconds = 25;
      pointsPerCorrect = 15;
      coinsReward = 2;
      break;
    case 4:
      durationSeconds = 22;
      pointsPerCorrect = 18;
      coinsReward = 2;
      break;
    case 5:
      durationSeconds = 20;
      pointsPerCorrect = 20;
      coinsReward = 3;
      break;
    case 6:
      durationSeconds = 18;
      pointsPerCorrect = 22;
      coinsReward = 3;
      break;
    case 7:
      durationSeconds = 16;
      pointsPerCorrect = 25;
      coinsReward = 4;
      break;
    case 8:
      durationSeconds = 15;
      pointsPerCorrect = 28;
      coinsReward = 4;
      break;
    case 9:
      durationSeconds = 14;
      pointsPerCorrect = 30;
      coinsReward = 5;
      break;
    case 10:
    default:
      durationSeconds = 12;
      pointsPerCorrect = 35;
      coinsReward = 6;
      break;
  }

  const minCorrectToPass = Math.ceil((passPercentage / 100) * totalQuestions);

  return {
    level,
    durationSeconds,
    pointsPerCorrect,
    coinsReward,
    passPercentage,
    minCorrectToPass,
  };
}

/**
 * Level Progression Storage Engine
 */
export function getUnlockedLevel(categoryId: string, subId: string = 'default'): number {
  if (typeof window === 'undefined') return 1;
  const key = `app_unlocked_level_${categoryId}_${subId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return 1;
  const val = parseInt(stored, 10);
  return isNaN(val) || val < 1 ? 1 : val;
}

export function unlockNextLevel(categoryId: string, subId: string = 'default', currentLevel: number): number {
  if (typeof window === 'undefined') return currentLevel + 1;
  const key = `app_unlocked_level_${categoryId}_${subId}`;
  const currentUnlocked = getUnlockedLevel(categoryId, subId);
  const nextLevel = Math.max(currentUnlocked, currentLevel + 1);
  localStorage.setItem(key, String(nextLevel));

  // Also record globally
  const globalKey = `app_highest_level_unlocked`;
  const highest = parseInt(localStorage.getItem(globalKey) || '1', 10);
  if (nextLevel > highest) {
    localStorage.setItem(globalKey, String(nextLevel));
  }

  return nextLevel;
}

/**
 * Economy Engine: Guarantees Admin Platform Commission Margin
 */
export const ECONOMY_RULES = {
  BATTLE_1V1_ENTRY: 20,
  BATTLE_1V1_WIN_REWARD: 35, // 5 coins commission (12.5% platform margin)
  BATTLE_1V1_DRAW_REFUND: 18, // 4 coins retained by house

  GROUP_BATTLE_ENTRY: 20, // 4 players = 80 coins pot
  GROUP_BATTLE_1ST_PRIZE: 45,
  GROUP_BATTLE_2ND_PRIZE: 20, // 15 coins commission (18.75% platform margin)

  LIFELINE_FIFTY_FIFTY_COST: 4,
  LIFELINE_AUDIENCE_POLL_COST: 4,
  LIFELINE_RESET_TIME_COST: 4,
  LIFELINE_SKIP_COST: 4,

  REVIEW_ANSWERS_COST: 5,
  LEVEL_RETRY_COST: 5, // Sizable cost to retake (prevents coin inflation and benefits admin)
  GUESS_WORD_HINT_COST: 5,
  PREMIUM_ZONE_UNLOCK_COST: 200,
};

/**
 * Automated Badge Milestones Checker
 */
export interface BadgeMetrics {
  score: number;
  coins: number;
  quizzesCompleted: number;
  battleWins: number;
  dailyStreak: number;
  highestLevel: number;
  rapidAccuracyAchieved?: boolean;
}

export function evaluateBadgesEarned(metrics: BadgeMetrics): string[] {
  const earned: string[] = [];

  // b1: Quiz Maestro (Score >= 500)
  if (metrics.score >= 500) earned.push('b1');

  // b2: Streak King (Streak >= 3)
  if (metrics.dailyStreak >= 3) earned.push('b2');

  // b3: Battle Gladiator (Battle Wins >= 3)
  if (metrics.battleWins >= 3) earned.push('b3');

  // b4: Flash Thinker (Speed & accuracy achieved)
  if (metrics.rapidAccuracyAchieved) earned.push('b4');

  // b5: Ultimate Scholar (Level 5 unlocked)
  if (metrics.highestLevel >= 5) earned.push('b5');

  // b6: Coin Tycoon (Coins >= 1000)
  if (metrics.coins >= 1000) earned.push('b6');

  return earned;
}
