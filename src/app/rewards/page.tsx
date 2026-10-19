'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Gift, CheckCircle2, Clock, Lock, Play } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';

interface ScratchCardItem {
  id: number;
  title: string;
  reward: number;
  description: string;
  claimed: boolean;
  requiredQuizzes: number;
  isUnlocked: boolean;
  activityHint: string;
}

export default function RewardsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { addCoins } = useUserDetails();

  const [dailyCoins, setDailyCoins] = useState(50);
  const [streakCoins, setStreakCoins] = useState(25);
  const [claimedCards, setClaimedCards] = useState<number[]>([]);
  const [activeScratch, setActiveScratch] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [quizzesPlayedToday, setQuizzesPlayedToday] = useState(0);
  const [streakDays, setStreakDays] = useState(1);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const todayStr = typeof window !== 'undefined' ? new Date().toDateString() : '';

  // Load activity metrics
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const todayPlayed = parseInt(localStorage.getItem(`daily_quizzes_played_${today}`) || '0', 10) || 0;
      setQuizzesPlayedToday(todayPlayed);
      const streak = parseInt(localStorage.getItem('app_daily_streak') || '1', 10) || 1;
      setStreakDays(streak);
    } catch {}
  }, []);

  // Calculate time until midnight reset
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch settings from admin
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.daily_reward_coins) setDailyCoins(Number(res.data.daily_reward_coins));
          if (res.data.daily_streak_coins) setStreakCoins(Number(res.data.daily_streak_coins));
        }
      })
      .catch(() => {});
  }, []);

  // Load claimed cards from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const today = new Date().toDateString();
      const savedClaimed = localStorage.getItem(`elite_claimed_cards_${today}`);
      if (savedClaimed) {
        setClaimedCards(JSON.parse(savedClaimed));
      } else {
        const lastDaily = localStorage.getItem('elite_daily_reward_claimed_date');
        if (lastDaily === today) {
          setClaimedCards([1]);
        }
      }
    } catch {}
  }, []);

  const cards: ScratchCardItem[] = [
    {
      id: 1,
      title: 'Daily Login Bonus',
      reward: dailyCoins,
      description: 'Your free daily bonus coin card',
      claimed: claimedCards.includes(1),
      requiredQuizzes: 0,
      isUnlocked: true,
      activityHint: 'Daily Login Check-in',
    },
    {
      id: 2,
      title: 'Streak Multiplier',
      reward: streakCoins,
      description: 'Extra reward for active daily quiz play',
      claimed: claimedCards.includes(2),
      requiredQuizzes: 1,
      isUnlocked: quizzesPlayedToday >= 1 || streakDays >= 2,
      activityHint: 'Complete 1 Quiz today',
    },
    {
      id: 3,
      title: 'Trivia Mystery Gift',
      reward: Math.max(30, Math.floor(dailyCoins * 0.8)),
      description: 'Hidden mystery prize for active quizzers',
      claimed: claimedCards.includes(3),
      requiredQuizzes: 2,
      isUnlocked: quizzesPlayedToday >= 2,
      activityHint: 'Complete 2 Quizzes today',
    },
    {
      id: 4,
      title: 'Super Scratch Jackpot',
      reward: dailyCoins * 2,
      description: 'Champion reward for dedicated players',
      claimed: claimedCards.includes(4),
      requiredQuizzes: 3,
      isUnlocked: quizzesPlayedToday >= 3,
      activityHint: 'Complete 3 Quizzes today',
    },
  ];

  // Scratch Canvas logic
  useEffect(() => {
    if (activeScratch === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw scratch cover
    ctx.fillStyle = '#ef5388';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.fillRect(i, 0, 10, canvas.height);
    }

    ctx.font = 'bold 16px Nunito, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Reveal!', canvas.width / 2, canvas.height / 2 + 6);

    let isDrawing = false;
    let scratchedPixels = 0;

    const performScratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      scratchedPixels += 1;
      if (scratchedPixels > 22 && !isRevealed) {
        handleRevealReward();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      performScratch(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      performScratch(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerUp = () => {
      isDrawing = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeScratch, isRevealed]);

  const handleRevealReward = () => {
    if (isRevealed || activeScratch === null) return;
    setIsRevealed(true);
    soundManager.playCorrect();
    soundManager.vibrate(60);

    const card = cards.find((c) => c.id === activeScratch);
    if (card) {
      addCoins(card.reward, `Daily Scratch: ${card.title}`);

      const today = new Date().toDateString();
      const nextClaimed = Array.from(new Set([...claimedCards, card.id]));
      setClaimedCards(nextClaimed);

      try {
        localStorage.setItem(`elite_claimed_cards_${today}`, JSON.stringify(nextClaimed));
        localStorage.setItem('elite_daily_reward_claimed_date', today);
      } catch {}

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef5388', '#FFD700', '#5DB760'],
      });
    }
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  const selectedCard = cards.find((c) => c.id === activeScratch);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar
        title={tr('rewardsLbl') || 'Daily Rewards'}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-4">
        {/* Reset Countdown Banner */}
        <div className={`w-full ${surfaceBg} rounded-[14px] p-4 border ${cardBorder} shadow-sm flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Next Reset In
              </span>
              <p className={`text-base font-black ${textColor}`}>
                {timeUntilReset || 'Calculating...'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ef5388]/10 text-[#ef5388] block">
              Daily Reset
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {quizzesPlayedToday} quiz{quizzesPlayedToday === 1 ? '' : 'zes'} played today
            </span>
          </div>
        </div>

        {/* Scratch Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {cards.map((card) => {
            const isClaimed = card.claimed;
            const isUnlocked = card.isUnlocked;

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (isClaimed) return;
                  if (!isUnlocked) {
                    soundManager.playClick();
                    setLockedNotice(`Complete ${card.requiredQuizzes - quizzesPlayedToday} more quiz today to unlock this ${card.title} card!`);
                    return;
                  }
                  soundManager.playClick();
                  setActiveScratch(card.id);
                  setIsRevealed(false);
                }}
                className={`aspect-[4/3.5] rounded-[14px] overflow-hidden relative shadow-sm border ${cardBorder} transition-all active:scale-95 ${
                  isClaimed
                    ? 'cursor-default opacity-80'
                    : !isUnlocked
                    ? 'cursor-pointer hover:border-amber-400/50'
                    : 'cursor-pointer hover:shadow-md hover:scale-[1.02]'
                }`}
              >
                {isClaimed ? (
                  <div className={`w-full h-full ${surfaceBg} flex flex-col items-center justify-center p-3 text-center`}>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className={`text-xs font-black ${textColor}`}>{card.title}</span>
                    <span className="text-xs font-bold text-emerald-500 mt-0.5">
                      +{card.reward} Coins
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Claimed for Today</span>
                  </div>
                ) : !isUnlocked ? (
                  <div className={`w-full h-full ${surfaceBg} flex flex-col items-center justify-center p-3 text-center relative overflow-hidden bg-slate-50 dark:bg-[#1f2d47]/70`}>
                    <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mb-1">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-black ${textColor}`}>{card.title}</span>
                    <span className="text-[10px] font-bold text-amber-500 mt-0.5 leading-tight">
                      {card.activityHint}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1.5 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full font-semibold">
                      {quizzesPlayedToday}/{card.requiredQuizzes} Done • Tap to unlock
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#ef5388] to-[#d83c70] flex flex-col items-center justify-center text-white p-3 text-center shadow-inner relative overflow-hidden">
                    <Gift className="w-8 h-8 mb-1 animate-bounce" />
                    <span className="text-xs font-black">{card.title}</span>
                    <span className="text-[11px] font-bold text-amber-200 mt-0.5">
                      Up to {card.reward} Coins
                    </span>
                    <span className="text-[10px] opacity-80 mt-1 bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                      Tap to scratch
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Locked Activity Notice Modal */}
        {lockedNotice && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-xs ${surfaceBg} rounded-[18px] p-5 shadow-2xl text-center space-y-3.5 border ${cardBorder}`}>
              <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-500 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-base font-black ${textColor}`}>Reward Card Locked</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {lockedNotice}
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setLockedNotice(null)}
                  className="flex-1 h-10 rounded-[10px] text-xs font-bold text-slate-500 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setLockedNotice(null);
                    router.push('/?tab=quizZone');
                  }}
                  className="flex-1 h-10 rounded-[10px] text-xs font-bold text-white bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play Quiz</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Scratch Modal */}
      {activeScratch !== null && selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className={`w-full max-w-xs ${surfaceBg} rounded-[20px] p-6 shadow-2xl text-center space-y-4 border ${cardBorder}`}>
            <h3 className={`text-lg font-black ${textColor}`}>{selectedCard.title}</h3>
            <p className="text-xs text-slate-400 font-medium">
              Rub your finger or mouse across the card to uncover your coins
            </p>

            {/* Scratch Pad Container */}
            <div className="relative w-64 h-44 mx-auto rounded-[14px] overflow-hidden shadow-inner flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
              {/* Underlying Revealed Reward */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <QImage imageUrl="/assets/images/earnedCoin.svg" width={48} height={48} />
                <span className="text-2xl font-black text-emerald-500">
                  +{selectedCard.reward} Coins
                </span>
                <span className="text-xs font-bold text-amber-500">Congratulations!</span>
              </div>

              {/* Foreground Scratch Canvas */}
              {!isRevealed && (
                <canvas
                  ref={canvasRef}
                  width={256}
                  height={176}
                  className="absolute inset-0 cursor-crosshair touch-none"
                />
              )}
            </div>

            {/* Quick Reveal / Close Controls */}
            <div className="space-y-2 pt-1">
              {!isRevealed ? (
                <button
                  type="button"
                  onClick={handleRevealReward}
                  className="w-full py-2.5 rounded-[10px] font-bold text-xs bg-[#ef5388] text-white hover:opacity-90 active:scale-95 shadow-sm transition-all"
                >
                  Scratch &amp; Reveal All
                </button>
              ) : (
                <QButton
                  onClick={() => {
                    setActiveScratch(null);
                    setIsRevealed(false);
                  }}
                  size="md"
                >
                  Collect Reward
                </QButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
