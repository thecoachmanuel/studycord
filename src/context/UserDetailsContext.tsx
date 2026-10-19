'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Badge, Question } from '../types';
import { MOCK_BADGES, MOCK_TRANSACTIONS } from '../lib/api';
import { evaluateBadgesEarned, unlockNextLevel, getUnlockedLevel, ECONOMY_RULES } from '../lib/quizEngine';
import { useAuth } from './AuthContext';

interface UserDetailsContextType {
  coins: number;
  score: number;
  rank: number;
  addCoins: (amount: number, reason?: string) => void;
  deductCoins: (amount: number, reason?: string) => boolean;
  addScore: (points: number) => void;
  bookmarks: Question[];
  toggleBookmark: (question: Question) => void;
  isBookmarked: (questionId: string) => boolean;
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;
  claimBadgeReward: (badgeId: string) => void;
  recordQuizCompletion: (stats: {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    coins: number;
    categoryId?: string;
    subId?: string;
    level?: number;
    timePerQuestionAvg?: number;
  }) => { passed: boolean; nextLevelUnlocked?: number; newBadges: string[] };
  recordBattleResult: (won: boolean, isDraw?: boolean) => { coinsWon: number; commissionPaid: number };
  recordTransaction: (
    amount: number,
    title: string,
    type: 'credit' | 'debit',
    account?: 'coin' | 'money',
    status?: 'completed' | 'pending' | 'approved' | 'rejected'
  ) => void;
}

const UserDetailsContext = createContext<UserDetailsContextType>({
  coins: 680,
  score: 2450,
  rank: 4,
  addCoins: () => {},
  deductCoins: () => false,
  addScore: () => {},
  bookmarks: [],
  toggleBookmark: () => {},
  isBookmarked: () => false,
  badges: [],
  unlockBadge: () => {},
  claimBadgeReward: () => {},
  recordQuizCompletion: () => ({ passed: false, newBadges: [] }),
  recordBattleResult: () => ({ coinsWon: 0, commissionPaid: 0 }),
  recordTransaction: () => {},
});

export const UserDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [coins, setCoins] = useState<number>(680);
  const [score, setScore] = useState<number>(2450);
  const [rank, setRank] = useState<number>(4);
  const [bookmarks, setBookmarks] = useState<Question[]>([]);
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [battleWins, setBattleWins] = useState<number>(1);
  const [dailyStreak, setDailyStreak] = useState<number>(1);
  const [quizzesCompleted, setQuizzesCompleted] = useState<number>(5);

  const recordTransaction = (
    amount: number,
    title: string,
    type: 'credit' | 'debit',
    account: 'coin' | 'money' = 'coin',
    status: 'completed' | 'pending' | 'approved' | 'rejected' = 'completed'
  ) => {
    if (typeof window === 'undefined') return;
    try {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const currency = account === 'coin' ? 'COIN' : 'NGN';
      const formattedAmount =
        account === 'coin'
          ? `${type === 'credit' ? '+' : '-'}${amount} Coins`
          : `${type === 'credit' ? '+' : '-'}₦${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      const newTx = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date: dateStr,
        title: title || (account === 'coin' ? (type === 'credit' ? 'Coin Reward' : 'Coin Deduction') : (type === 'credit' ? 'Money Credit' : 'Money Debit')),
        coins: account === 'coin' ? `${type === 'credit' ? '+' : '-'}${amount}` : '0',
        amount: formattedAmount,
        numericAmount: amount,
        type,
        account,
        currency,
        status,
      };
      const saved = localStorage.getItem('app_transactions');
      const existing = saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
      const updated = [newTx, ...existing];
      localStorage.setItem('app_transactions', JSON.stringify(updated.slice(0, 150)));
    } catch (e) {
      console.error('Error saving transaction', e);
    }
  };

  // Sync with auth user & local storage
  // Recalculate rank based on total score aligning with 50 leaderboard contenders
  const calculateRank = (currentScore: number): number => {
    if (currentScore > 5820) return 1;
    if (currentScore > 4940) return 2;
    if (currentScore > 3860) return 3;
    if (currentScore > 2980) return 4;
    if (currentScore > 2750) return 5;
    if (currentScore > 2580) return 6;
    if (currentScore >= 2450) return 7;
    if (currentScore > 2380) return 8;
    if (currentScore > 2240) return 9;
    if (currentScore > 2120) return 10;
    if (currentScore > 2010) return 11;
    if (currentScore > 1920) return 12;
    if (currentScore > 1840) return 13;
    if (currentScore > 1760) return 14;
    if (currentScore > 1690) return 15;
    if (currentScore > 1560) return 16;
    if (currentScore > 1380) return 20;
    if (currentScore > 1000) return 28;
    if (currentScore > 700) return 36;
    if (currentScore > 400) return 46;
    return 50;
  };

  // Sync with auth user & local storage
  useEffect(() => {
    if (user) {
      let currentCoins = parseInt(user.coins || '680', 10);
      let currentScore = parseInt(user.allTimeScore || '2450', 10);
      let currentRank = parseInt(user.allTimeRank || '4', 10);

      // Check if there is a pending guest score to credit now that the user signed in
      const pendingStr = typeof window !== 'undefined' ? localStorage.getItem('pending_guest_score') : null;
      if (pendingStr) {
        try {
          const pending = JSON.parse(pendingStr);
          localStorage.removeItem('pending_guest_score');
          if (pending && (Number(pending.score) > 0 || Number(pending.coins) > 0)) {
            const addedCoins = Number(pending.coins || 0);
            const addedScore = Number(pending.score || 0);
            currentCoins += addedCoins;
            currentScore += addedScore;
            currentRank = calculateRank(currentScore);

            updateUser({
              coins: String(currentCoins),
              allTimeScore: String(currentScore),
              allTimeRank: String(currentRank),
            });

            if (pending.categoryId && pending.level) {
              unlockNextLevel(pending.categoryId, pending.subId || 'default', pending.level);
            }
          }
        } catch {}
      }

      setCoins(currentCoins);
      setScore(currentScore);
      setRank(currentRank);
    }
    const savedBookmarks = localStorage.getItem('app_bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch {
        setBookmarks([]);
      }
    }
    const savedWins = localStorage.getItem('app_battle_wins');
    if (savedWins) setBattleWins(parseInt(savedWins, 10) || 1);

    const savedBadges = localStorage.getItem('app_user_badges');
    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch {
        setBadges(MOCK_BADGES);
      }
    }
  }, [user]);

  const addCoins = (amount: number, reason: string = 'Coin Reward') => {
    if (amount <= 0) return;
    const next = coins + amount;
    setCoins(next);
    updateUser({ coins: String(next) });
    recordTransaction(amount, reason, 'credit');
  };

  const deductCoins = (amount: number, reason: string = 'Coin Deduction'): boolean => {
    if (amount <= 0) return true;
    if (coins < amount) return false;
    const next = coins - amount;
    setCoins(next);
    updateUser({ coins: String(next) });
    recordTransaction(amount, reason, 'debit');
    return true;
  };

  const addScore = (points: number) => {
    const nextScore = score + points;
    const nextRank = calculateRank(nextScore);
    setScore(nextScore);
    setRank(nextRank);
    updateUser({ allTimeScore: String(nextScore), allTimeRank: String(nextRank) });
  };

  const toggleBookmark = (question: Question) => {
    setBookmarks((prev) => {
      const exists = prev.some((q) => q.id === question.id);
      const updated = exists ? prev.filter((q) => q.id !== question.id) : [...prev, question];
      localStorage.setItem('app_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (questionId: string) => {
    return bookmarks.some((q) => q.id === questionId);
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const updated = prev.map((b) => (b.id === badgeId && b.status === 'locked' ? { ...b, status: 'unlocked' as const } : b));
      localStorage.setItem('app_user_badges', JSON.stringify(updated));
      return updated;
    });
  };

  const claimBadgeReward = (badgeId: string) => {
    const target = badges.find((b) => b.id === badgeId);
    if (target && target.status === 'unlocked') {
      addCoins(target.reward, `Badge Reward: ${target.title}`);
      setBadges((prev) => {
        const updated = prev.map((b) => (b.id === badgeId ? { ...b, status: 'rewardUnlocked' as const } : b));
        localStorage.setItem('app_user_badges', JSON.stringify(updated));
        return updated;
      });
    }
  };

  /**
   * Evaluates badges and unlocks any achieved milestones automatically
   */
  const checkBadgeMilestones = useCallback((highestLvl: number = 1, rapidAchieved: boolean = false) => {
    const earnedIds = evaluateBadgesEarned({
      score,
      coins,
      quizzesCompleted,
      battleWins,
      dailyStreak,
      highestLevel: highestLvl,
      rapidAccuracyAchieved: rapidAchieved,
    });

    const newUnlocks: string[] = [];
    setBadges((prev) => {
      let changed = false;
      const updated = prev.map((b) => {
        if (earnedIds.includes(b.id) && b.status === 'locked') {
          changed = true;
          newUnlocks.push(b.title);
          return { ...b, status: 'unlocked' as const };
        }
        return b;
      });
      if (changed) {
        localStorage.setItem('app_user_badges', JSON.stringify(updated));
      }
      return updated;
    });

    return newUnlocks;
  }, [score, coins, quizzesCompleted, battleWins, dailyStreak]);

  /**
   * Called on quiz completion: updates score, coins, checks level pass, and unlocks next level
   */
  const recordQuizCompletion = (stats: {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    coins: number;
    categoryId?: string;
    subId?: string;
    level?: number;
    timePerQuestionAvg?: number;
  }) => {
    const passThreshold = 0.6; // 60% passing requirement
    const percentage = stats.totalQuestions > 0 ? stats.correctAnswers / stats.totalQuestions : 0;
    const passed = percentage >= passThreshold;

    addScore(stats.score);
    if (stats.coins > 0) {
      addCoins(stats.coins, 'Quiz Completion Reward');
    }
    setQuizzesCompleted((c) => c + 1);

    try {
      const today = new Date().toDateString();
      const todayKey = `daily_quizzes_played_${today}`;
      const played = parseInt(localStorage.getItem(todayKey) || '0', 10) || 0;
      localStorage.setItem(todayKey, String(played + 1));
    } catch {}

    let nextLevelUnlocked: number | undefined;
    if (passed && stats.categoryId && stats.level) {
      nextLevelUnlocked = unlockNextLevel(stats.categoryId, stats.subId || 'default', stats.level);
    }

    const rapid = Boolean(stats.timePerQuestionAvg && stats.timePerQuestionAvg < 12 && percentage >= 0.8);
    const newBadges = checkBadgeMilestones(nextLevelUnlocked || 1, rapid);

    return { passed, nextLevelUnlocked, newBadges };
  };

  /**
   * Battle Result: Deducts wager, awards payout, and retains house commission for admin
   */
  const recordBattleResult = (won: boolean, isDraw: boolean = false) => {
    if (won) {
      // Winner gets 35 coins (out of 40 pot; admin retains 5 coins = 12.5% house commission)
      const prize = ECONOMY_RULES.BATTLE_1V1_WIN_REWARD;
      addCoins(prize, '1v1 Battle Victory Reward');
      addScore(50);
      setBattleWins((w) => {
        const next = w + 1;
        localStorage.setItem('app_battle_wins', String(next));
        return next;
      });
      checkBadgeMilestones(1, false);
      return { coinsWon: prize, commissionPaid: 5 };
    } else if (isDraw) {
      // Draw refund of 18 coins (4 coins retained by house)
      const refund = ECONOMY_RULES.BATTLE_1V1_DRAW_REFUND;
      addCoins(refund, '1v1 Battle Draw Refund');
      addScore(15);
      return { coinsWon: refund, commissionPaid: 4 };
    } else {
      // Loss: player pays entry fee, 0 returned
      addScore(5);
      return { coinsWon: 0, commissionPaid: 20 };
    }
  };

  return (
    <UserDetailsContext.Provider
      value={{
        coins,
        score,
        rank,
        addCoins,
        deductCoins,
        addScore,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        badges,
        unlockBadge,
        claimBadgeReward,
        recordQuizCompletion,
        recordBattleResult,
        recordTransaction,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = () => useContext(UserDetailsContext);
