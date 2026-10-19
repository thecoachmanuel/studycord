'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Crown, Flame, ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { QImage } from '../common/QImage';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';
import { LeaderboardEntry } from '../../types';

interface Competitor {
  id: string;
  name: string;
  profile: string;
  allTimeScore: number;
  monthScore: number;
  dailyScore: number;
}

// 49 high-fidelity global & diverse competitors across All-Time, Monthly, and Daily
const COMPETITORS: Competitor[] = [
  { id: 'u1', name: 'Alexander Wright', profile: '/assets/config/profile/3.svg', allTimeScore: 5820, monthScore: 1980, dailyScore: 300 },
  { id: 'u2', name: 'Sophia Chen', profile: '/assets/config/profile/7.svg', allTimeScore: 4940, monthScore: 2150, dailyScore: 270 },
  { id: 'u3', name: 'Marcus Sterling', profile: '/assets/config/profile/2.svg', allTimeScore: 3860, monthScore: 1620, dailyScore: 240 },
  { id: 'u4', name: 'Elena Rostova', profile: '/assets/config/profile/4.svg', allTimeScore: 2980, monthScore: 1750, dailyScore: 410 },
  { id: 'u5', name: 'David Kim', profile: '/assets/config/profile/5.svg', allTimeScore: 2750, monthScore: 1480, dailyScore: 350 },
  { id: 'u6', name: 'Chloe Dubois', profile: '/assets/config/profile/6.svg', allTimeScore: 2580, monthScore: 1350, dailyScore: 210 },
  { id: 'u7', name: 'Liam Johnson', profile: '/assets/config/profile/8.svg', allTimeScore: 2380, monthScore: 1220, dailyScore: 190 },
  { id: 'u8', name: 'Olumide Adeleke', profile: '/assets/config/profile/1.svg', allTimeScore: 2240, monthScore: 1140, dailyScore: 175 },
  { id: 'u9', name: 'Aaliyah Khan', profile: '/assets/config/profile/9.svg', allTimeScore: 2120, monthScore: 920, dailyScore: 135 },
  { id: 'u10', name: 'Noah Miller', profile: '/assets/config/profile/10.svg', allTimeScore: 2010, monthScore: 980, dailyScore: 145 },
  { id: 'u11', name: 'Aisha Bello', profile: '/assets/config/profile/6.svg', allTimeScore: 1920, monthScore: 1060, dailyScore: 160 },
  { id: 'u12', name: 'Lucas Silva', profile: '/assets/config/profile/2.svg', allTimeScore: 1840, monthScore: 860, dailyScore: 125 },
  { id: 'u13', name: 'Chukwudi Eze', profile: '/assets/config/profile/3.svg', allTimeScore: 1760, monthScore: 810, dailyScore: 115 },
  { id: 'u14', name: 'Isabella Santos', profile: '/assets/config/profile/7.svg', allTimeScore: 1690, monthScore: 760, dailyScore: 108 },
  { id: 'u15', name: 'Matteo Rossi', profile: '/assets/config/profile/5.svg', allTimeScore: 1620, monthScore: 720, dailyScore: 100 },
  { id: 'u16', name: 'Fatima Ibrahim', profile: '/assets/config/profile/4.svg', allTimeScore: 1560, monthScore: 680, dailyScore: 94 },
  { id: 'u17', name: 'Kenji Sato', profile: '/assets/config/profile/8.svg', allTimeScore: 1500, monthScore: 640, dailyScore: 88 },
  { id: 'u18', name: 'Zainab Al-Mansoor', profile: '/assets/config/profile/9.svg', allTimeScore: 1440, monthScore: 600, dailyScore: 82 },
  { id: 'u19', name: 'Priya Sharma', profile: '/assets/config/profile/10.svg', allTimeScore: 1380, monthScore: 560, dailyScore: 76 },
  { id: 'u20', name: 'Emeka Okafor', profile: '/assets/config/profile/1.svg', allTimeScore: 1320, monthScore: 530, dailyScore: 70 },
  { id: 'u21', name: 'Grace Hopper', profile: '/assets/config/profile/4.svg', allTimeScore: 1270, monthScore: 500, dailyScore: 66 },
  { id: 'u22', name: 'Daniel O\'Connor', profile: '/assets/config/profile/2.svg', allTimeScore: 1220, monthScore: 470, dailyScore: 62 },
  { id: 'u23', name: 'Yuki Tanaka', profile: '/assets/config/profile/6.svg', allTimeScore: 1170, monthScore: 440, dailyScore: 58 },
  { id: 'u24', name: 'Tariq Hassan', profile: '/assets/config/profile/3.svg', allTimeScore: 1120, monthScore: 420, dailyScore: 54 },
  { id: 'u25', name: 'Camila Rodriguez', profile: '/assets/config/profile/7.svg', allTimeScore: 1080, monthScore: 400, dailyScore: 50 },
  { id: 'u26', name: 'Benjamin Hayes', profile: '/assets/config/profile/5.svg', allTimeScore: 1040, monthScore: 380, dailyScore: 47 },
  { id: 'u27', name: 'Blessing Okonjo', profile: '/assets/config/profile/1.svg', allTimeScore: 1000, monthScore: 360, dailyScore: 44 },
  { id: 'u28', name: 'Ethan Vance', profile: '/assets/config/profile/8.svg', allTimeScore: 960, monthScore: 340, dailyScore: 41 },
  { id: 'u29', name: 'Amara Nwosu', profile: '/assets/config/profile/9.svg', allTimeScore: 920, monthScore: 320, dailyScore: 38 },
  { id: 'u30', name: 'Hiroshi Mori', profile: '/assets/config/profile/10.svg', allTimeScore: 880, monthScore: 300, dailyScore: 35 },
  { id: 'u31', name: 'Fatima Zahra', profile: '/assets/config/profile/4.svg', allTimeScore: 850, monthScore: 285, dailyScore: 32 },
  { id: 'u32', name: 'Samuel Adebayo', profile: '/assets/config/profile/2.svg', allTimeScore: 820, monthScore: 270, dailyScore: 30 },
  { id: 'u33', name: 'Charlotte Davies', profile: '/assets/config/profile/6.svg', allTimeScore: 790, monthScore: 255, dailyScore: 28 },
  { id: 'u34', name: 'Kemi Adeleke', profile: '/assets/config/profile/7.svg', allTimeScore: 760, monthScore: 240, dailyScore: 26 },
  { id: 'u35', name: 'Leo Martinez', profile: '/assets/config/profile/3.svg', allTimeScore: 730, monthScore: 225, dailyScore: 24 },
  { id: 'u36', name: 'Mia Andersen', profile: '/assets/config/profile/8.svg', allTimeScore: 700, monthScore: 210, dailyScore: 22 },
  { id: 'u37', name: 'Adeola Badmus', profile: '/assets/config/profile/1.svg', allTimeScore: 670, monthScore: 195, dailyScore: 20 },
  { id: 'u38', name: 'Sven Lindqvist', profile: '/assets/config/profile/5.svg', allTimeScore: 640, monthScore: 180, dailyScore: 19 },
  { id: 'u39', name: 'Ngozi Okolie', profile: '/assets/config/profile/9.svg', allTimeScore: 610, monthScore: 170, dailyScore: 18 },
  { id: 'u40', name: 'Johan Berg', profile: '/assets/config/profile/10.svg', allTimeScore: 580, monthScore: 160, dailyScore: 17 },
  { id: 'u41', name: 'Zara Patel', profile: '/assets/config/profile/4.svg', allTimeScore: 550, monthScore: 150, dailyScore: 16 },
  { id: 'u42', name: 'Tunde Bakare', profile: '/assets/config/profile/2.svg', allTimeScore: 520, monthScore: 140, dailyScore: 15 },
  { id: 'u43', name: 'Viktor Novak', profile: '/assets/config/profile/3.svg', allTimeScore: 490, monthScore: 130, dailyScore: 14 },
  { id: 'u44', name: 'Folake Sowore', profile: '/assets/config/profile/6.svg', allTimeScore: 460, monthScore: 120, dailyScore: 13 },
  { id: 'u45', name: 'Oscar Wilde', profile: '/assets/config/profile/5.svg', allTimeScore: 430, monthScore: 110, dailyScore: 12 },
  { id: 'u46', name: 'Chioma Nnamdi', profile: '/assets/config/profile/7.svg', allTimeScore: 400, monthScore: 100, dailyScore: 11 },
  { id: 'u47', name: 'Gabriel Santos', profile: '/assets/config/profile/8.svg', allTimeScore: 370, monthScore: 90, dailyScore: 10 },
  { id: 'u48', name: 'Amina Mohammed', profile: '/assets/config/profile/1.svg', allTimeScore: 340, monthScore: 80, dailyScore: 9 },
  { id: 'u49', name: 'Chinedu Obi', profile: '/assets/config/profile/9.svg', allTimeScore: 310, monthScore: 70, dailyScore: 8 },
];

export interface LeaderboardTabProps {
  onTabChange?: (tab: 'home' | 'leaderboard' | 'quizZone' | 'playZone' | 'profile') => void;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ onTabChange }) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, isGuest } = useAuth();
  const { score } = useUserDetails();
  const [activeTab, setActiveTab] = useState<'allTime' | 'month' | 'daily'>('allTime');

  const currentUserId = user?.userId || '101';
  const currentUserName = isGuest ? tr('guest') : (user?.name || 'Tawaab');
  const currentUserProfile = user?.profileUrl || '/assets/config/profile/1.svg';

  // Compute live user scores across all periods reactively from userDetails score
  const userScores = useMemo(() => {
    const rawScore = Number(score) || 0;
    if (rawScore >= 2450) {
      const added = rawScore - 2450;
      return {
        allTime: rawScore,
        month: 1650 + added,
        daily: 320 + added,
      };
    }
    return {
      allTime: rawScore,
      month: Math.round(rawScore * 0.7),
      daily: Math.round(rawScore * 0.2),
    };
  }, [score]);

  // Combine 49 competitors + user, sort descending by score, assign dynamic ranks 1 to 50
  const currentList: LeaderboardEntry[] = useMemo(() => {
    const userScoreForTab =
      activeTab === 'allTime' ? userScores.allTime : activeTab === 'month' ? userScores.month : userScores.daily;

    const competitorItems = COMPETITORS.map((c) => ({
      userId: c.id,
      name: c.name,
      profile: c.profile,
      numericScore: activeTab === 'allTime' ? c.allTimeScore : activeTab === 'month' ? c.monthScore : c.dailyScore,
    }));

    const userEntry = {
      userId: currentUserId,
      name: currentUserName,
      profile: currentUserProfile,
      numericScore: userScoreForTab,
    };

    const combined = [...competitorItems, userEntry].sort((a, b) => b.numericScore - a.numericScore);

    return combined.slice(0, 50).map((item, index) => ({
      user_rank: String(index + 1),
      userId: item.userId,
      name: item.name,
      score: item.numericScore.toLocaleString(),
      profile: item.profile,
    }));
  }, [activeTab, userScores, currentUserId, currentUserName, currentUserProfile]);

  const top3 = currentList.slice(0, 3);
  const remaining = currentList.slice(3);

  const currentUserItem = currentList.find((i) => i.userId === currentUserId) || {
    user_rank: '50+',
    name: currentUserName,
    score: (activeTab === 'allTime' ? userScores.allTime : activeTab === 'month' ? userScores.month : userScores.daily).toLocaleString(),
    profile: currentUserProfile,
  };

  const handlePlayQuiz = () => {
    soundManager.playClick();
    if (onTabChange) {
      onTabChange('quizZone');
    } else {
      router.push('/?tab=quizZone');
    }
  };

  const handleTabSwitch = (t: 'allTime' | 'month' | 'daily') => {
    soundManager.playClick();
    soundManager.vibrate(25);
    setActiveTab(t);
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';
  const primaryBg = isDark ? 'bg-[#f279a2]' : 'bg-[#ef5388]';

  return (
    <div className="w-full flex flex-col min-h-screen pb-6">
      {/* ============================================================== */}
      {/* 1. STICKY TOP HEADER (Unified for Mobile & Desktop)            */}
      {/* Stays pinned at top: 0 while podium & 50 rankings scroll below */}
      {/* ============================================================== */}
      <div className={`sticky top-0 z-30 w-full ${surfaceBg}/95 backdrop-blur-md -mt-2 lg:-mt-4 pt-3.5 lg:pt-4 pb-3 px-3 sm:px-4 lg:px-6 rounded-b-[16px] shadow-[0_4px_20px_rgba(35,51,84,0.12)] border-b border-x ${cardBorder} transition-colors mb-5`}>
        {/* Mobile View (< 1024px) */}
        <div className="lg:hidden space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ef5388] to-[#f279a2] flex items-center justify-center text-white shadow-sm">
                <Trophy className="w-4 h-4" />
              </div>
              <h1 className={`text-lg font-black tracking-tight ${textColor}`}>
                {tr('leaderboardLbl')}
              </h1>
            </div>
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-extrabold uppercase tracking-wide">
                50 Contenders
              </span>
            </div>
          </div>

          {/* Time Filter Pills */}
          <div className="flex bg-black/5 dark:bg-white/10 p-1 rounded-full">
            {(['allTime', 'month', 'daily'] as const).map((t) => {
              const isSelected = activeTab === t;
              const label = t === 'allTime' ? tr('allTimeLbl') : t === 'month' ? tr('monthLbl') : tr('dailyLbl');
              return (
                <button
                  key={t}
                  onClick={() => handleTabSwitch(t)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${
                    isSelected
                      ? `${primaryBg} text-white shadow-sm`
                      : 'text-slate-500 dark:text-slate-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop View (>= 1024px) */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#ef5388] to-[#f279a2] flex items-center justify-center text-white shadow-md shadow-[#ef5388]/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className={`text-xl font-black tracking-tight ${textColor}`}>
                  {tr('leaderboardLbl')}
                </h1>
                <span className="flex items-center space-x-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>Top 50 Global Season</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Live dynamic ranking: Play quizzes to earn points and climb higher towards Rank #1
              </p>
            </div>
          </div>

          {/* Desktop Filter Pills */}
          <div className={`flex items-center bg-black/5 dark:bg-white/10 p-1.5 rounded-full border ${cardBorder} shadow-sm`}>
            {(['allTime', 'month', 'daily'] as const).map((t) => {
              const isSelected = activeTab === t;
              const label = t === 'allTime' ? tr('allTimeLbl') : t === 'month' ? tr('monthLbl') : tr('dailyLbl');
              return (
                <button
                  key={t}
                  onClick={() => handleTabSwitch(t)}
                  className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${
                    isSelected
                      ? `${primaryBg} text-white shadow-sm`
                      : 'text-slate-500 dark:text-slate-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP USER STANDING BANNER (Only on desktop >= 1024px)    */}
      {/* ============================================================== */}
      <div className={`hidden lg:flex items-center justify-between p-4 mb-6 rounded-2xl ${surfaceBg} border ${cardBorder} shadow-sm`}>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ef5388] p-0.5 shadow-sm">
              <QImage imageUrl={currentUserItem.profile} width={50} height={50} circular alt="My Avatar" />
            </div>
            <span className="absolute -bottom-1 -right-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-[#ef5388] text-white shadow-sm">
              #{currentUserItem.user_rank}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`font-bold text-base ${textColor}`}>
                {currentUserItem.name} <span className="text-xs font-normal text-slate-400">(You)</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Active Contender
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Standing: <span className="font-bold text-[#ef5388] dark:text-[#f279a2]">#{currentUserItem.user_rank}</span> with{' '}
              <span className="font-bold">{currentUserItem.score} Points</span>
            </p>
          </div>
        </div>

        <button
          onClick={handlePlayQuiz}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#ef5388] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Play Quiz to Climb Ranks</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. TOP 3 PODIUM SECTION (Responsive Desktop & Mobile)          */}
      {/* ============================================================== */}
      <div className={`w-full ${surfaceBg} rounded-2xl border ${cardBorder} shadow-sm p-4 sm:p-6 mb-6`}>
        <div className="text-center mb-4 hidden lg:block">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-center space-x-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Top 3 Champions</span>
          </span>
        </div>

        <div className="flex items-end justify-center space-x-3 sm:space-x-8 max-w-2xl mx-auto pt-4 pb-2">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="flex flex-col items-center flex-1 max-w-[130px] sm:max-w-[150px]">
              <div className="relative mb-2">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 ${top3[1].userId === currentUserId ? 'border-[#ef5388] ring-4 ring-[#ef5388]/30' : 'border-slate-300'} p-0.5 shadow-md overflow-hidden bg-white`}>
                  <QImage imageUrl={top3[1].profile} width={76} height={76} circular alt={top3[1].name} />
                </div>
                <div className="absolute -bottom-3 inset-x-0 mx-auto flex items-center justify-center">
                  <QImage imageUrl="/assets/images/rank_2.svg" width={28} height={34} alt="Rank 2" />
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-3 max-w-full">
                <span className={`text-xs sm:text-sm font-bold truncate text-center ${textColor}`}>
                  {top3[1].name}
                </span>
                {top3[1].userId === currentUserId && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#ef5388] text-white shrink-0">
                    You
                  </span>
                )}
              </div>
              <span className="text-xs font-extrabold text-[#ef5388] dark:text-[#f279a2]">
                {top3[1].score} {tr('pts')}
              </span>
              {/* Podium Pedestal */}
              <div className="w-full h-12 sm:h-16 mt-2 rounded-t-xl bg-gradient-to-t from-slate-300/40 to-slate-200/20 dark:from-slate-700/60 dark:to-slate-700/20 border-t border-slate-300/40 flex items-center justify-center font-black text-slate-400 text-sm">
                2nd
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Elevated Champion) */}
          {top3[0] && (
            <div className="flex flex-col items-center flex-1 max-w-[150px] sm:max-w-[170px] -translate-y-3 sm:-translate-y-4">
              <div className="relative mb-2">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${top3[0].userId === currentUserId ? 'border-[#ef5388] ring-4 ring-[#ef5388]/40' : 'border-amber-400 ring-4 ring-amber-400/20'} p-0.5 shadow-xl overflow-hidden bg-white`}>
                  <QImage imageUrl={top3[0].profile} width={92} height={92} circular alt={top3[0].name} />
                </div>
                <div className="absolute -bottom-3.5 inset-x-0 mx-auto flex items-center justify-center">
                  <QImage imageUrl="/assets/images/rank_1.svg" width={32} height={40} alt="Rank 1" />
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-3.5 max-w-full">
                <span className={`text-sm sm:text-base font-extrabold truncate text-center ${textColor}`}>
                  {top3[0].name}
                </span>
                {top3[0].userId === currentUserId && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#ef5388] text-white shrink-0">
                    You
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-black text-[#ef5388] dark:text-[#f279a2]">
                {top3[0].score} {tr('pts')}
              </span>
              {/* Podium Pedestal */}
              <div className="w-full h-16 sm:h-24 mt-2 rounded-t-xl bg-gradient-to-t from-amber-400/40 to-amber-300/20 dark:from-amber-500/40 dark:to-amber-500/10 border-t border-amber-400/50 flex flex-col items-center justify-center font-black text-amber-500 text-base shadow-sm">
                <span>1st</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hidden sm:inline">
                  Champion
                </span>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="flex flex-col items-center flex-1 max-w-[130px] sm:max-w-[150px]">
              <div className="relative mb-2">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 ${top3[2].userId === currentUserId ? 'border-[#ef5388] ring-4 ring-[#ef5388]/30' : 'border-amber-700/60'} p-0.5 shadow-md overflow-hidden bg-white`}>
                  <QImage imageUrl={top3[2].profile} width={76} height={76} circular alt={top3[2].name} />
                </div>
                <div className="absolute -bottom-3 inset-x-0 mx-auto flex items-center justify-center">
                  <QImage imageUrl="/assets/images/rank_3.svg" width={28} height={34} alt="Rank 3" />
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-3 max-w-full">
                <span className={`text-xs sm:text-sm font-bold truncate text-center ${textColor}`}>
                  {top3[2].name}
                </span>
                {top3[2].userId === currentUserId && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#ef5388] text-white shrink-0">
                    You
                  </span>
                )}
              </div>
              <span className="text-xs font-extrabold text-[#ef5388] dark:text-[#f279a2]">
                {top3[2].score} {tr('pts')}
              </span>
              {/* Podium Pedestal */}
              <div className="w-full h-9 sm:h-12 mt-2 rounded-t-xl bg-gradient-to-t from-amber-700/30 to-amber-700/10 dark:from-amber-900/40 dark:to-amber-900/10 border-t border-amber-700/30 flex items-center justify-center font-black text-amber-700 dark:text-amber-500 text-sm">
                3rd
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. RANKS 4 TO 50 LIST                                          */}
      {/* ============================================================== */}
      <div className="w-full space-y-2 pb-24 lg:pb-8">
        <div className="hidden lg:grid grid-cols-12 px-5 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span className="col-span-1 text-center"># Rank</span>
          <span className="col-span-6">Participant</span>
          <span className="col-span-3 text-center">Tier Status</span>
          <span className="col-span-2 text-right">Points</span>
        </div>

        {remaining.map((item) => {
          const isCurrentUser = item.userId === currentUserId;
          const rankNum = parseInt(item.user_rank, 10);
          const tierLabel = rankNum <= 10 ? 'Master' : rankNum <= 25 ? 'Diamond' : 'Gold';
          const tierColor =
            rankNum <= 10
              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
              : rankNum <= 25
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';

          return (
            <div
              key={item.userId}
              className={`w-full ${surfaceBg} rounded-xl p-3 sm:p-3.5 flex items-center justify-between shadow-sm border transition-all ${
                isCurrentUser
                  ? 'border-[#ef5388] ring-1 ring-[#ef5388]/30 shadow-md bg-[#ef5388]/5 dark:bg-[#ef5388]/10'
                  : `${cardBorder} hover:shadow-md hover:border-black/10 dark:hover:border-white/10`
              }`}
            >
              {/* Rank Number + Avatar + Name */}
              <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                <span className={`w-8 text-center font-black text-sm shrink-0 ${isCurrentUser ? 'text-[#ef5388] dark:text-[#f279a2]' : 'text-slate-400'}`}>
                  #{item.user_rank}
                </span>
                <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border ${isCurrentUser ? 'border-[#ef5388]' : 'border-slate-200 dark:border-slate-700'} flex items-center justify-center bg-white dark:bg-slate-800`}>
                  <QImage imageUrl={item.profile} width={38} height={38} circular alt={item.name} />
                </div>
                <div className="truncate">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-sm truncate ${textColor}`}>
                      {item.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#ef5388] text-white shrink-0">
                        You
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status on Desktop */}
              <div className="hidden lg:flex items-center justify-center w-48">
                <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${tierColor}`}>
                  {tierLabel} Tier
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center space-x-1 shrink-0">
                <span className="font-black text-sm text-[#ef5388] dark:text-[#f279a2]">
                  {item.score}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {tr('pts')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 5. PINNED "MY RANK" WIDGET                                     */}
      {/* Mobile: Centered above bottom nav at bottom-[82px]             */}
      {/* Desktop: Pinned on the bottom-right, away from the left sidebar */}
      {/* ============================================================== */}
      {/* Mobile Bar (< 1024px) */}
      <div className={`lg:hidden fixed bottom-[82px] left-0 right-0 max-w-md mx-auto px-4 py-2.5 ${surfaceBg} border-t border-black/10 dark:border-white/10 shadow-lg flex items-center justify-between z-20 transition-colors`}>
        <div className="flex items-center space-x-3">
          <span className="font-extrabold text-sm text-[#ef5388] dark:text-[#f279a2] px-2 py-0.5 rounded bg-[#ef5388]/10">
            #{currentUserItem.user_rank}
          </span>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300">
            <QImage imageUrl={currentUserItem.profile} width={32} height={32} circular alt="My Avatar" />
          </div>
          <span className={`font-bold text-sm ${textColor}`}>
            {tr('myRank')}
          </span>
        </div>
        <span className="font-extrabold text-sm text-[#ef5388] dark:text-[#f279a2]">
          {currentUserItem.score} {tr('pts')}
        </span>
      </div>

      {/* Desktop Floating Card: strictly on the bottom-right, never reaching left sidebar */}
      <div className={`hidden lg:flex fixed bottom-6 right-8 z-40 items-center space-x-4 p-3.5 px-5 rounded-2xl ${surfaceBg} border ${cardBorder} shadow-2xl backdrop-blur-md`}>
        <div className="relative">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#ef5388] p-0.5">
            <QImage imageUrl={currentUserItem.profile} width={38} height={38} circular alt="My Avatar" />
          </div>
          <span className="absolute -bottom-1 -right-1 text-[10px] font-black px-1.5 py-0.2 rounded-full bg-[#ef5388] text-white">
            #{currentUserItem.user_rank}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Your Standing
          </span>
          <div className="flex items-center space-x-1.5">
            <span className={`font-black text-sm ${textColor}`}>
              {currentUserItem.name}
            </span>
            <span className="font-extrabold text-xs text-[#ef5388] dark:text-[#f279a2] bg-[#ef5388]/10 px-2 py-0.5 rounded-full">
              {currentUserItem.score} pts
            </span>
          </div>
        </div>
        <button
          onClick={handlePlayQuiz}
          className="ml-2 px-3.5 py-2 rounded-xl bg-[#ef5388] text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          Play
        </button>
      </div>
    </div>
  );
};
