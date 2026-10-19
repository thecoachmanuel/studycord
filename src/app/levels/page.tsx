'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Star, Trophy } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';
import { getUnlockedLevel, getLevelConfig } from '../../lib/quizEngine';
import { smartBack } from '../../lib/navigation';

function LevelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId') || '1';
  const subId = searchParams.get('subId') || '';
  const name = searchParams.get('name') || 'Select Level';
  const { isDark } = useTheme();
  const { isGuest, openLoginModal, requireAuth } = useAuth();

  const [totalLevels, setTotalLevels] = useState<number>(() => {
    const fromParam = parseInt(searchParams.get('maxLevel') || '0', 10);
    return fromParam > 0 ? fromParam : 10;
  });
  const [selectedRange, setSelectedRange] = useState<string>('all');
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);

  useEffect(() => {
    const lvl = getUnlockedLevel(categoryId, subId);
    setUnlockedLevel(lvl);
  }, [categoryId, subId]);

  // Dynamically calculate the number of levels available based on questions in the database
  useEffect(() => {
    let cancelled = false;
    const query = new URLSearchParams();
    query.set('category', categoryId);
    if (subId) query.set('subcategory', subId);

    fetch(`/api/questions?${query.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        if (!cancelled && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const levels = res.data
            .map((q: any) => parseInt(q.level, 10))
            .filter((n: number) => !isNaN(n) && n > 0);
          const maxQLevel = levels.length > 0 ? Math.max(...levels) : 0;
          const countLevels = Math.ceil(res.data.length / 5);
          const calculated = Math.max(maxQLevel, countLevels, 1);
          setTotalLevels(calculated);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [categoryId, subId]);

  // Level groupings of 10 for clean arrangement when there are more than 10 levels
  const levelGroups = React.useMemo(() => {
    if (totalLevels <= 10) return [];
    const groups: { label: string; start: number; end: number }[] = [];
    for (let start = 1; start <= totalLevels; start += 10) {
      const end = Math.min(start + 9, totalLevels);
      groups.push({
        label: `${start}–${end}`,
        start,
        end,
      });
    }
    return groups;
  }, [totalLevels]);

  const displayedLevels = React.useMemo(() => {
    if (selectedRange === 'all' || totalLevels <= 10) {
      return Array.from({ length: totalLevels }, (_, i) => i + 1);
    }
    const targetGroup = levelGroups.find((g) => g.label === selectedRange);
    if (!targetGroup) {
      return Array.from({ length: totalLevels }, (_, i) => i + 1);
    }
    const list: number[] = [];
    for (let i = targetGroup.start; i <= targetGroup.end; i++) {
      list.push(i);
    }
    return list;
  }, [totalLevels, selectedRange, levelGroups]);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const primaryColor = isDark ? '#f279a2' : '#ef5388';

  const handleBack = () => {
    soundManager.playClick();
    if (subId) {
      router.push(`/category?id=${categoryId}&name=${encodeURIComponent(name)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar title={name} onBack={handleBack} />

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col space-y-5">
        {/* Progress Banner */}
        <div className={`${surfaceBg} rounded-[14px] p-4 shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-[10px] bg-[#ef5388]/10 text-[#ef5388] flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-bold text-base leading-tight ${textColor}`}>
                {isGuest ? 'Free Trial Quiz' : 'Level Progression'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isGuest
                  ? `Level 1 is free to try! Sign in to unlock all ${totalLevels} levels.`
                  : `${Math.min(unlockedLevel, totalLevels)} of ${totalLevels} Levels Mastered`}
              </p>
            </div>
          </div>
          {isGuest ? (
            <button
              onClick={() =>
                openLoginModal(
                  `/levels?categoryId=${categoryId}&subId=${subId}&name=${encodeURIComponent(name)}&maxLevel=${totalLevels}`,
                  'Sign in to unlock all levels, earn coins, and rank on the leaderboard!'
                )
              }
              className="flex items-center space-x-1 text-xs font-bold text-[#ef5388] bg-[#ef5388]/10 hover:bg-[#ef5388]/20 px-3 py-1.5 rounded-full transition-colors"
            >
              <span>Sign In</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 text-xs font-bold text-[#ef5388] bg-[#ef5388]/10 px-3 py-1.5 rounded-full">
              <span>60% to Unlock Next</span>
            </div>
          )}
        </div>

        {/* Tier Range Filter Pills (Shows when category has > 10 levels) */}
        {totalLevels > 10 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedRange('all');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedRange === 'all'
                  ? 'bg-[#ef5388] text-white shadow-sm'
                  : `${surfaceBg} ${textColor} hover:border-[#ef5388]/40 border border-slate-200 dark:border-slate-700/60`
              }`}
            >
              All Levels ({totalLevels})
            </button>
            {levelGroups.map((group) => (
              <button
                key={group.label}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedRange(group.label);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedRange === group.label
                    ? 'bg-[#ef5388] text-white shadow-sm'
                    : `${surfaceBg} ${textColor} hover:border-[#ef5388]/40 border border-slate-200 dark:border-slate-700/60`
                }`}
              >
                Levels {group.label}
              </button>
            ))}
          </div>
        )}

        {/* Levels Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3 pt-2">
          {displayedLevels.map((levelNum) => {
            const isUnlocked = isGuest ? levelNum === 1 : levelNum <= unlockedLevel;
            const config = getLevelConfig(levelNum, 5);

            return (
              <button
                key={levelNum}
                onClick={() => {
                  soundManager.playClick();
                  if (isGuest && levelNum > 1) {
                    openLoginModal(
                      `/levels?categoryId=${categoryId}&subId=${subId}&name=${encodeURIComponent(name)}&maxLevel=${totalLevels}`,
                      `Please sign in to unlock Level ${levelNum} and save your progress to the leaderboard.`
                    );
                    return;
                  }
                  if (!isUnlocked) return;
                  router.push(
                    `/quiz?categoryId=${categoryId}&subId=${subId}&level=${levelNum}&title=${encodeURIComponent(
                      `${name} - Level ${levelNum}`
                    )}`
                  );
                }}
                className={`relative aspect-square rounded-[12px] flex flex-col items-center justify-center p-2.5 transition-all ${
                  isUnlocked
                    ? `${surfaceBg} hover:scale-105 active:scale-95 border-2 border-[#ef5388]/40 shadow-sm hover:shadow-md cursor-pointer group`
                    : isGuest
                    ? `${surfaceBg}/60 hover:border-[#ef5388]/50 border border-slate-200 dark:border-slate-700/60 opacity-80 cursor-pointer group`
                    : 'bg-black/5 dark:bg-white/5 opacity-55 cursor-not-allowed border border-transparent'
                }`}
              >
                {isUnlocked ? (
                  <>
                    {isGuest && levelNum === 1 && (
                      <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-black tracking-wide bg-[#ef5388] text-white shadow-xs">
                        FREE
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                      LVL
                    </span>
                    <span className={`text-2xl font-black ${textColor} group-hover:text-[#ef5388] transition-colors`}>
                      {levelNum}
                    </span>
                    {/* Difficulty indicator stars */}
                    <div className="flex space-x-0.5 mt-1">
                      {Array.from({ length: Math.min(3, Math.ceil(levelNum / 2)) }).map((_, s) => (
                        <Star key={s} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-slate-400 mb-1 group-hover:text-[#ef5388] transition-colors" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#ef5388] transition-colors">
                      {isGuest ? 'UNLOCK' : 'LOCKED'}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Difficulty Info Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Higher levels feature faster countdown timers and tougher questions.
            <br />
            Score at least <strong className="text-[#ef5388]">60%</strong> to unlock the next level!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LevelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex items-center justify-center text-slate-400">Loading...</div>}>
      <LevelsContent />
    </Suspense>
  );
}
