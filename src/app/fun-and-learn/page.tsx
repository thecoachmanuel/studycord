'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Clock, Award, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';
import { COMPREHENSION_LEVELS, getComprehensionByLevel } from '../../lib/comprehensionData';

function FunAndLearnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelParam = parseInt(searchParams.get('level') || '1', 10);
  const { isDark } = useTheme();
  const { requireAuth } = useAuth();

  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(1);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('app_unlocked_level_funAndLearn') || '1', 10);
    const validStored = isNaN(stored) || stored < 1 ? 1 : Math.min(10, stored);
    setUnlockedLevel(validStored);

    if (levelParam && levelParam >= 1 && levelParam <= 10) {
      setSelectedLevel(levelParam);
    } else {
      setSelectedLevel(validStored);
    }
  }, [levelParam]);

  const currentPassage = getComprehensionByLevel(selectedLevel);

  const handleBack = () => {
    soundManager.playClick();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleSelectLevel = (lvl: number) => {
    soundManager.playClick();
    if (lvl <= unlockedLevel) {
      setSelectedLevel(lvl);
    }
  };

  const handleStartQuiz = () => {
    soundManager.playClick();
    requireAuth(() => {
      router.push(
        `/quiz?quizType=funAndLearn&level=${selectedLevel}&title=${encodeURIComponent(
          `Comprehension Level ${selectedLevel}: ${currentPassage.title}`
        )}`
      );
    }, `/fun-and-learn?level=${selectedLevel}`);
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-8 select-none`}>
      <QAppBar title={tr('funAndLearn')} onBack={handleBack} />

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col space-y-5">
        {/* Level Progression Carousel / Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider">
              Comprehension Levels (1 to 10)
            </span>
            <span className="font-extrabold text-[#ef5388] dark:text-[#f279a2]">
              {unlockedLevel} / 10 Mastered
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {COMPREHENSION_LEVELS.map((item) => {
              const isUnlocked = item.level <= unlockedLevel;
              const isSelected = item.level === selectedLevel;

              return (
                <button
                  key={item.level}
                  onClick={() => handleSelectLevel(item.level)}
                  disabled={!isUnlocked}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#ef5388] text-white shadow-md scale-105'
                      : isUnlocked
                      ? `${surfaceBg} ${textColor} border ${cardBorder} hover:border-[#ef5388]/50 cursor-pointer`
                      : 'bg-black/5 dark:bg-white/5 text-slate-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {isUnlocked ? (
                    item.level < unlockedLevel ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                    )
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Level {item.level}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reading Passage Card */}
        <div className={`${surfaceBg} rounded-[16px] p-5 sm:p-7 shadow-sm border ${cardBorder} space-y-4`}>
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-[#ef5388]/10 text-[#ef5388] dark:text-[#f279a2] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Level {currentPassage.level}: {currentPassage.difficulty}
              </span>
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                • {currentPassage.subject}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#ef5388]" />
                <span>{currentPassage.estimatedReadTime}</span>
              </span>
              <span>{currentPassage.wordCount} words</span>
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-xl sm:text-2xl font-black ${textColor} tracking-tight leading-snug`}>
            {currentPassage.title}
          </h2>

          {/* Text Content */}
          <div className={`text-sm sm:text-base leading-relaxed space-y-4 opacity-95 ${textColor} font-serif`}>
            {currentPassage.passageText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-7">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <QButton onClick={handleStartQuiz} size="lg" className="w-full flex items-center justify-center space-x-2">
            <span>Start Comprehension Quiz ({currentPassage.questions.length} Questions)</span>
            <ChevronRight className="w-4 h-4" />
          </QButton>
          <p className="text-center text-xs text-slate-400 mt-2">
            Answer accurately to unlock Level {Math.min(10, selectedLevel + 1)}! You can re-read the passage anytime during the quiz.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FunAndLearnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex items-center justify-center text-slate-400">Loading...</div>}>
      <FunAndLearnContent />
    </Suspense>
  );
}
