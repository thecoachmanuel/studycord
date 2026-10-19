'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';
import { shuffleArray } from '../../lib/quizEngine';

const MATCH_POOLS = [
  [
    { left: 'Paris', right: 'France' },
    { left: 'Tokyo', right: 'Japan' },
    { left: 'Canberra', right: 'Australia' },
    { left: 'Ottawa', right: 'Canada' },
  ],
  [
    { left: 'Au (Gold)', right: 'Atomic 79' },
    { left: 'Ag (Silver)', right: 'Atomic 47' },
    { left: 'Fe (Iron)', right: 'Atomic 26' },
    { left: 'Hg (Mercury)', right: 'Atomic 80' },
  ],
  [
    { left: 'Telephone', right: 'Alexander Graham Bell' },
    { left: 'Lightbulb', right: 'Thomas Edison' },
    { left: 'Radio', right: 'Guglielmo Marconi' },
    { left: 'Airplane', right: 'Wright Brothers' },
  ],
  [
    { left: 'Machu Picchu', right: 'Peru' },
    { left: 'Petra', right: 'Jordan' },
    { left: 'Colosseum', right: 'Italy' },
    { left: 'Taj Mahal', right: 'India' },
  ],
];

export default function MultiMatchPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { addScore, addCoins } = useUserDetails();

  React.useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/multi-match', 'Please sign in to play Multi-Match and earn coins.');
    }
  }, [isInitialized, user, isGuest]);

  const [activePairs] = useState(() => {
    const randomPool = MATCH_POOLS[Math.floor(Math.random() * MATCH_POOLS.length)];
    return shuffleArray(randomPool);
  });

  const [leftItems] = useState(() => shuffleArray(activePairs.map((p) => p.left)));
  const [rightItems] = useState(() => shuffleArray(activePairs.map((p) => p.right)));

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<{ left: string; right: string } | null>(null);

  const handleSelectLeft = (item: string) => {
    if (matchedPairs.includes(item)) return;
    soundManager.playClick();
    setSelectedLeft(item);

    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleSelectRight = (item: string) => {
    const pair = activePairs.find((p) => p.right === item);
    if (pair && matchedPairs.includes(pair.left)) return;
    soundManager.playClick();
    setSelectedRight(item);

    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (left: string, right: string) => {
    const isCorrect = activePairs.some((p) => p.left === left && p.right === right);
    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.vibrate(40);
      setMatchedPairs((prev) => [...prev, left]);
      setSelectedLeft(null);
      setSelectedRight(null);
      addScore(20);
      addCoins(2);

      if (matchedPairs.length + 1 === activePairs.length) {
        setTimeout(() => {
          router.replace(
            `/result?total=${activePairs.length}&correct=${activePairs.length}&score=${
              activePairs.length * 20
            }&coins=${activePairs.length * 2}&title=${encodeURIComponent('Multi Match')}`
          );
        }, 800);
      }
    } else {
      soundManager.playWrong();
      soundManager.vibrate(80);
      setErrorPair({ left, right });
      setTimeout(() => {
        setErrorPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';

  if (isInitialized && (!user || isGuest)) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col items-center justify-center p-6 text-center select-none`}>
        <div className={`w-full max-w-sm ${isDark ? 'bg-[#294261]' : 'bg-white'} rounded-[20px] p-6 shadow-xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} space-y-4`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
            <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
          </div>
          <div className="space-y-1.5">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#45536d]'}`}>Login Required</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Please sign in to play Multi-Match, track your progress, earn coins, and rank on the leaderboard!
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => router.push('/login?redirect=/multi-match')}
              className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Play
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-8 select-none`}>
      <QAppBar title={tr('multiMatch')} />

      <div className="max-w-md w-full mx-auto px-4 py-4 flex-1 flex flex-col justify-between space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ef5388]">
            Match Capitals with Countries
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap a capital city on the left and its matching country on the right.
          </p>
        </div>

        {/* Two Columns for Matching */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column (Capitals) */}
          <div className="space-y-3">
            {leftItems.map((item) => {
              const isMatched = matchedPairs.includes(item);
              const isSelected = selectedLeft === item;
              const isError = errorPair?.left === item;

              let style = `${surfaceBg} ${textColor} border-slate-200 dark:border-slate-700`;
              if (isMatched) {
                style = 'bg-[#5DB760] text-white border-[#5DB760] opacity-80';
              } else if (isError) {
                style = 'bg-[#FF6169] text-white border-[#FF6169] animate-shake';
              } else if (isSelected) {
                style = 'border-2 border-[#ef5388] text-[#ef5388] shadow-md';
              }

              return (
                <button
                  key={item}
                  onClick={() => handleSelectLeft(item)}
                  disabled={isMatched}
                  className={`w-full h-14 px-3 rounded-[10px] border font-bold text-sm flex items-center justify-center text-center shadow-sm transition-all active:scale-95 disabled:cursor-default ${style}`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Right Column (Countries) */}
          <div className="space-y-3">
            {rightItems.map((item) => {
              const pair = activePairs.find((p) => p.right === item);
              const isMatched = pair ? matchedPairs.includes(pair.left) : false;
              const isSelected = selectedRight === item;
              const isError = errorPair?.right === item;

              let style = `${surfaceBg} ${textColor} border-slate-200 dark:border-slate-700`;
              if (isMatched) {
                style = 'bg-[#5DB760] text-white border-[#5DB760] opacity-80';
              } else if (isError) {
                style = 'bg-[#FF6169] text-white border-[#FF6169] animate-shake';
              } else if (isSelected) {
                style = 'border-2 border-[#ef5388] text-[#ef5388] shadow-md';
              }

              return (
                <button
                  key={item}
                  onClick={() => handleSelectRight(item)}
                  disabled={isMatched}
                  className={`w-full h-14 px-3 rounded-[10px] border font-bold text-sm flex items-center justify-center text-center shadow-sm transition-all active:scale-95 disabled:cursor-default ${style}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <QButton onClick={() => router.replace('/')} variant="secondary">
            Quit Game
          </QButton>
        </div>
      </div>
    </div>
  );
}
