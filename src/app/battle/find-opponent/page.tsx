'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QAppBar } from '../../../components/common/QAppBar';
import { QImage } from '../../../components/common/QImage';
import { QButton } from '../../../components/common/QButton';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useUserDetails } from '../../../context/UserDetailsContext';
import { soundManager } from '../../../lib/sound';
import { ECONOMY_RULES } from '../../../lib/quizEngine';

export default function FindOpponentPage() {
  const router = useRouter();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { isDark } = useTheme();
  const { coins } = useUserDetails();

  useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/battle/find-opponent', 'Please sign in to join 1 vs 1 quiz battles.');
    }
  }, [isInitialized, user, isGuest]);

  const [finding, setFinding] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [insufficientCoins, setInsufficientCoins] = useState(false);

  const opponent = {
    name: 'Sarah Connor',
    profile: '/assets/config/profile/6.svg',
    score: '3,120',
  };

  useEffect(() => {
    if (!isInitialized || !user || isGuest) return;
    if (coins < ECONOMY_RULES.BATTLE_1V1_ENTRY) {
      setInsufficientCoins(true);
      setFinding(false);
      return;
    }

    const t = setTimeout(() => {
      setFinding(false);
      setCountdown(3);
      soundManager.playCorrect();
    }, 2500);

    return () => clearTimeout(t);
  }, [isInitialized, user, isGuest, coins]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const c = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(c);
    } else {
      router.replace('/quiz?quizType=oneVsOneBattle&title=1%20vs%201%20Battle');
    }
  }, [countdown, router]);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';

  const handleBack = () => {
    soundManager.playClick();
    router.replace('/battle');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-8 select-none`}>
      <QAppBar title="Finding Opponent" onBack={handleBack} />

      <div className="max-w-md w-full mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-between space-y-6">
        {isGuest ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to Play Battle Quiz</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts cannot enter competitive 1 vs 1 battles or stake coins. Sign in to your StudyCord account to challenge players and win coins!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/battle/find-opponent')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <>
            {/* Finding Radar Graphic */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#ef5388]/10 animate-ping" />
              <div className="relative w-48 h-48 rounded-full overflow-hidden flex items-center justify-center shadow-lg border-2 border-[#ef5388]/30">
                <QImage
                  imageUrl="/assets/images/map_finding.png"
                  width={192}
                  height={192}
                  fit="cover"
                  alt="Finding"
                />
              </div>
            </div>

            {/* Head-to-Head Avatars with VS Icon */}
            <div className="w-full flex items-center justify-around py-4">
              {/* User */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 rounded-full border-2 border-[#ef5388] p-0.5 overflow-hidden bg-white shadow-md">
                  <QImage imageUrl={user?.profileUrl || '/assets/config/profile/1.svg'} width={60} height={60} circular />
                </div>
                <span className={`font-bold text-sm truncate max-w-[100px] ${textColor}`}>
                  {user?.name || 'You'}
                </span>
              </div>

              {/* VS Icon */}
              <div className="w-12 h-12 flex items-center justify-center">
                <QImage imageUrl="/assets/images/vs_icon.png" width={40} height={40} alt="VS" />
              </div>

              {/* Opponent */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 rounded-full border-2 border-slate-300 p-0.5 overflow-hidden bg-white shadow-md">
                  {finding ? (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center text-slate-400 text-xs">
                      ?
                    </div>
                  ) : (
                    <QImage imageUrl={opponent.profile} width={60} height={60} circular />
                  )}
                </div>
                <span className={`font-bold text-sm truncate max-w-[100px] ${textColor}`}>
                  {finding ? 'Searching...' : opponent.name}
                </span>
              </div>
            </div>

            {/* Status Message */}
            <div className="text-center">
              {insufficientCoins ? (
                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-rose-500">Insufficient Coins</h3>
                  <p className="text-xs text-slate-400">
                    You need at least <strong className="text-amber-500">{ECONOMY_RULES.BATTLE_1V1_ENTRY} Coins</strong> to enter a 1 vs 1 Battle.
                  </p>
                </div>
              ) : finding ? (
                <p className="text-sm font-semibold text-slate-400">
                  Locating worthy challenger...
                </p>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-emerald-500">Opponent Found!</h3>
                  <p className="text-xs text-slate-400">
                    Battle commences in <strong className="text-lg text-[#ef5388]">{countdown}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Cancel */}
            <div className="w-full">
              <QButton onClick={() => router.back()} variant="secondary">
                Cancel Search
              </QButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
