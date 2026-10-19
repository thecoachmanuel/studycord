'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, ArrowRight } from 'lucide-react';
import { QImage } from '../common/QImage';
import { UserAchievements } from '../common/UserAchievements';
import { QuizGridCard } from '../common/QuizGridCard';
import { useAuth } from '../../context/AuthContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { useTheme } from '../../context/ThemeContext';
import { tr } from '../../lib/translations';
import { MOCK_CONTESTS, MOCK_CATEGORIES, isSpecialQuizModeCategory } from '../../lib/api';
import { Category } from '../../types';
import { soundManager } from '../../lib/sound';
import { StudyCordLogo } from '../common/StudyCordLogo';

interface HomeTabProps {
  onTabChange?: (tab: 'home' | 'leaderboard' | 'quizZone' | 'playZone' | 'profile') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onTabChange }) => {
  const router = useRouter();
  const { user, isGuest, requireAuth } = useAuth();
  const { coins, score, rank } = useUserDetails();
  const { isDark } = useTheme();

  const [categories, setCategories] = useState<Category[]>(() =>
    MOCK_CATEGORIES.filter((cat) => !isSpecialQuizModeCategory(cat))
  );
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);

  useEffect(() => {
    const checkClaimed = () => {
      try {
        const today = new Date().toDateString();
        const lastClaimed = localStorage.getItem('elite_daily_reward_claimed_date');
        setIsRewardClaimed(lastClaimed === today);
      } catch {}
    };
    checkClaimed();
    window.addEventListener('focus', checkClaimed);
    window.addEventListener('storage', checkClaimed);
    return () => {
      window.removeEventListener('focus', checkClaimed);
      window.removeEventListener('storage', checkClaimed);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/categories?type=1')
      .then((r) => r.json())
      .then((res) => {
        if (!cancelled && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const valid = res.data
            .filter((c: any) => !isSpecialQuizModeCategory(c))
            .map((c: any) => ({
              id: String(c.id),
              categoryName: c.category_name,
              image: c.image || '/assets/images/quiz_zone_icon.svg',
              hasSubcategories: c.id === '1' || c.id === '2' || c.id === '4' || Boolean(c.hasSubcategories),
              hasLevels: true,
              maxLevel: String(c.maxLevel || '5'),
              noOfQuestions: String(c.noOfQuestions || '50'),
              isPremium: c.is_premium === '1',
              requiredCoins: c.required_coins || 200,
            }));
          if (valid.length > 0) {
            setCategories(valid);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';
  const primaryColor = isDark ? '#f279a2' : '#ef5388';

  const userName = isGuest ? tr('guest') : user?.name || 'Tawaab';
  const profileImg = user?.profileUrl || '/assets/config/profile/1.svg';

  return (
    <div className="w-full flex flex-col space-y-6 pb-6">
      {/* 1. User Profile Header (Sticky across all devices) */}
      <div className={`sticky top-0 z-30 w-full ${surfaceBg}/95 backdrop-blur-md rounded-b-[10px] lg:rounded-[14px] px-4 lg:px-6 pt-3.5 pb-4 shadow-[0_4px_16px_rgba(69,83,109,0.08)] transition-colors border ${cardBorder}`}>
        {/* Mobile/Tablet Brand Wordmark */}
        <div className="flex lg:hidden items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
          <StudyCordLogo size="sm" isDark={isDark} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">v1.0.0</span>
        </div>

        <div className="flex items-center justify-between">
          {/* Avatar + Name */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer select-none"
            onClick={() => requireAuth(() => router.push('/profile/edit'), '/profile/edit')}
          >
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-[#ef5388]/40 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <QImage imageUrl={profileImg} width={46} height={46} circular alt={userName} />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg lg:text-xl leading-tight truncate max-w-[170px] sm:max-w-[280px] ${textColor}`}>
                {userName}
              </span>
              <span className="text-xs text-slate-400 font-medium mt-0.5">
                {tr('letsplay')}
              </span>
            </div>
          </div>

          {/* Action Buttons: Notification & Coin Store */}
          <div className="flex items-center space-x-2.5">
            {/* Notification button */}
            <button
              onClick={() => {
                soundManager.playClick();
                requireAuth(() => router.push('/notifications'), '/notifications');
              }}
              className="w-10 h-10 rounded-[10px] bg-[#ef5388] text-white flex items-center justify-center hover:opacity-90 active:scale-95 shadow-sm transition-all"
              title="Notifications"
            >
              <QImage
                imageUrl="/assets/images/notification_icon.svg"
                width={20}
                height={20}
                color="#ffffff"
                alt="Notifications"
              />
            </button>

            {/* Coin Store button */}
            <button
              onClick={() => {
                soundManager.playClick();
                requireAuth(() => router.push('/coin-store'), '/coin-store');
              }}
              className="w-10 h-10 rounded-[10px] bg-[#ef5388] text-white flex items-center justify-center hover:opacity-90 active:scale-95 shadow-sm transition-all"
              title="Coin Store"
            >
              <QImage
                imageUrl="/assets/images/coin_icon.svg"
                width={20}
                height={20}
                color="#ffffff"
                alt="Coin Store"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Guest Welcome Offer Invitation */}
      {isGuest && (
        <div className="px-4 lg:px-0">
          <div
            onClick={() => {
              soundManager.playClick();
              router.push('/sign-up');
            }}
            className={`w-full ${surfaceBg} rounded-[10px] p-4 flex items-center justify-between border ${cardBorder} shadow-sm cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#ef5388]/10 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-[#ef5388]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className={`font-bold text-base leading-tight ${textColor}`}>
                    Claim 250 Free Welcome Coins
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#ef5388] text-white">
                    New Player
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Create your account to unlock tournaments, 1v1 battles, and leaderboard rewards.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap text-white bg-[#ef5388] shrink-0">
              Claim
            </span>
          </div>
        </div>
      )}

      {/* 2. User Achievements Card */}
      <div className="w-full">
        <UserAchievements rank={rank} coins={coins} score={score} />
      </div>

      {/* 3. Daily Coins & Live Contest Section (Stacked on mobile, 2-column on desktop) */}
      <div className="px-4 lg:px-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Reward Banner */}
        <div
          onClick={() => {
            soundManager.playClick();
            requireAuth(() => router.push('/rewards'), '/rewards');
          }}
          className={`w-full ${surfaceBg} rounded-[10px] p-4 flex items-center justify-between border ${cardBorder} shadow-sm cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]`}
        >
          <div className="flex items-center space-x-3.5">
            <QImage imageUrl="/assets/images/daily_coins.svg" width={48} height={48} alt="Daily Coins" />
            <div>
              <h3 className={`font-bold text-base leading-tight ${textColor}`}>Daily Reward Available</h3>
              <p className="text-xs text-slate-400 mt-0.5">Scratch card to reveal bonus coins</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap ${
            isRewardClaimed
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'text-[#ef5388] dark:text-[#f279a2] bg-[#ef5388]/10'
          }`}>
            {isRewardClaimed ? 'Claimed' : 'Claim'}
          </span>
        </div>

        {/* Live Contest Card */}
        {MOCK_CONTESTS.slice(0, 1).map((contest) => (
          <div
            key={contest.id}
            onClick={() => {
              soundManager.playClick();
              requireAuth(() => router.push('/contest'), '/contest');
            }}
            className={`w-full ${surfaceBg} rounded-[10px] p-4 shadow-sm border ${cardBorder} flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Live Contest
              </span>
              <span className="text-xs font-medium text-slate-400">
                {tr('entryFee')}: <strong className="text-[#ef5388] dark:text-[#f279a2]">{contest.entryFee} Coins</strong>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-bold text-base ${textColor}`}>{contest.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{contest.description}</p>
              </div>
              <span className="text-xs font-bold text-white bg-[#ef5388] dark:bg-[#f279a2] px-3 py-1.5 rounded-[8px] shrink-0 ml-2">
                {tr('playNow')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Quiz Zone Categories (Capped at 4 on homepage) */}
      <div className="px-4 lg:px-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-bold text-[18px] ${textColor}`}>{tr('quizZone')}</h2>
          <button
            onClick={() => {
              soundManager.playClick();
              if (onTabChange) onTabChange('quizZone');
              else router.push('/?tab=quizZone');
            }}
            className="text-xs font-semibold text-[#ef5388] dark:text-[#f279a2] hover:underline"
          >
            {tr('viewAll')}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {categories.slice(0, 4).map((cat) => (
            <QuizGridCard
              key={cat.id}
              title={cat.categoryName}
              desc={`${cat.maxLevel} Levels Available`}
              img={cat.image || '/assets/images/quiz_zone_icon.svg'}
              badge={cat.isPremium && !cat.hasUnlocked ? `${cat.requiredCoins || 200} Coins` : undefined}
              isLocked={cat.isPremium && !cat.hasUnlocked}
              onClick={() => {
                soundManager.playClick();
                if (cat.hasSubcategories) {
                  router.push(`/category?id=${cat.id}&name=${encodeURIComponent(cat.categoryName)}`);
                } else if (cat.hasLevels) {
                  router.push(`/levels?categoryId=${cat.id}&name=${encodeURIComponent(cat.categoryName)}&maxLevel=${cat.maxLevel}`);
                } else {
                  router.push(`/quiz?categoryId=${cat.id}&level=1&title=${encodeURIComponent(cat.categoryName)}`);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* 5. Battle Zone (Group Battle & 1 vs 1 Battle) */}
      <div className="px-4 lg:px-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-bold text-[18px] ${textColor}`}>Battle Zone</h2>
          <button
            onClick={() => {
              soundManager.playClick();
              requireAuth(() => router.push('/battle'), '/battle');
            }}
            className="text-xs font-semibold text-[#ef5388] dark:text-[#f279a2] hover:underline"
          >
            {tr('viewAll')}
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <QuizGridCard
            title={tr('groupPlay')}
            desc={tr('desGroupPlay')}
            img="/assets/images/group_battle_icon.svg"
            onClick={() => requireAuth(() => router.push('/battle/group'), '/battle/group')}
          />
          <QuizGridCard
            title={tr('battleQuiz')}
            desc={tr('desBattleQuiz')}
            img="/assets/images/one_vs_one_icon.svg"
            onClick={() => requireAuth(() => router.push('/battle/find-opponent'), '/battle/find-opponent')}
          />
          <QuizGridCard
            title={tr('exam')}
            desc={tr('desExam')}
            img="/assets/images/exam_icon.svg"
            onClick={() => requireAuth(() => router.push('/exam'), '/exam')}
          />
          <QuizGridCard
            title={tr('selfChallenge')}
            desc={tr('challengeYourselfLbl')}
            img="/assets/images/self_challenge.svg"
            onClick={() => requireAuth(() => router.push('/self-challenge'), '/self-challenge')}
          />
        </div>
      </div>

      {/* 6. Play Zone Quick Access */}
      <div className="px-4 lg:px-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-bold text-[18px] ${textColor}`}>{tr('navPlayZone')}</h2>
          <button
            onClick={() => {
              soundManager.playClick();
              if (onTabChange) onTabChange('playZone');
              else router.push('/?tab=playZone');
            }}
            className="text-xs font-semibold text-[#ef5388] dark:text-[#f279a2] hover:underline"
          >
            {tr('viewAll')}
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <QuizGridCard
            title={tr('dailyQuiz')}
            desc={tr('desDailyQuiz')}
            img="/assets/images/daily_quiz_icon.svg"
            onClick={() => requireAuth(() => router.push('/quiz?quizType=dailyQuiz&title=' + encodeURIComponent(tr('dailyQuiz'))), '/quiz?quizType=dailyQuiz')}
          />
          <QuizGridCard
            title={tr('funAndLearn')}
            desc={tr('desFunAndLearn')}
            img="/assets/images/fun_icon.svg"
            onClick={() => requireAuth(() => router.push('/fun-and-learn'), '/fun-and-learn')}
          />
          <QuizGridCard
            title={tr('guessTheWord')}
            desc={tr('desGuessTheWord')}
            img="/assets/images/guess_icon.svg"
            onClick={() => requireAuth(() => router.push('/guess-the-word'), '/guess-the-word')}
          />
          <QuizGridCard
            title={tr('truefalse')}
            desc={tr('desTrueFalse')}
            img="/assets/images/true_false_icon.svg"
            onClick={() => requireAuth(() => router.push('/quiz?quizType=trueAndFalse&title=' + encodeURIComponent(tr('truefalse'))), '/quiz?quizType=trueAndFalse')}
          />
        </div>
      </div>
    </div>
  );
};
