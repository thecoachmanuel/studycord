'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { QAppBar } from '../../components/common/QAppBar';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { tr } from '../../lib/translations';
import { MOCK_CATEGORIES, isSpecialQuizModeCategory } from '../../lib/api';

export default function SelfChallengePage() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { isDark } = useTheme();

  const standardCategories = useMemo(
    () => MOCK_CATEGORIES.filter((c) => !isSpecialQuizModeCategory(c)),
    []
  );

  const [selectedCategory, setSelectedCategory] = useState(
    standardCategories[0]?.id || '1'
  );
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(6);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const primaryBg = isDark ? 'bg-[#f279a2]' : 'bg-[#ef5388]';

  const handleStart = () => {
    requireAuth(() => {
      const cat = standardCategories.find((c) => c.id === selectedCategory);
      router.push(
        `/quiz?quizType=selfChallenge&categoryId=${selectedCategory}&limit=${questionCount}&timerMinutes=${durationMinutes}&title=${encodeURIComponent(
          `Self Challenge - ${cat?.categoryName || 'General'}`
        )}`
      );
    }, '/self-challenge');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-8 select-none`}>
      <QAppBar title={tr('selfChallenge')} />

      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Category Picker */}
        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
            Select Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {standardCategories.slice(0, 6).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full p-3.5 rounded-[12px] text-sm font-semibold flex items-center justify-between border transition-all ${
                    isSelected
                      ? `border-[#ef5388] ${surfaceBg} ${isDark ? 'text-[#f279a2]' : 'text-[#ef5388]'} shadow-sm`
                      : `border-transparent ${surfaceBg} text-slate-500 hover:border-slate-300`
                  }`}
                >
                  <span className="truncate">{cat.categoryName}</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${isSelected ? 'border-[#ef5388]' : 'border-slate-300'}`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#ef5388]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[5, 10, 15, 20].map((num) => {
              const isSelected = questionCount === num;
              return (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`py-3 rounded-[10px] font-bold text-sm transition-all ${
                    isSelected
                      ? `${primaryBg} text-white shadow-sm`
                      : `${surfaceBg} ${textColor} hover:opacity-80`
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration (Minutes) */}
        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
            Time Duration (Minutes)
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[3, 6, 9, 12].map((min) => {
              const isSelected = durationMinutes === min;
              return (
                <button
                  key={min}
                  onClick={() => setDurationMinutes(min)}
                  className={`py-3 rounded-[10px] font-bold text-sm transition-all ${
                    isSelected
                      ? `${primaryBg} text-white shadow-sm`
                      : `${surfaceBg} ${textColor} hover:opacity-80`
                  }`}
                >
                  {min}m
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <QButton onClick={handleStart} size="lg">
          Start Self Challenge
        </QButton>
      </div>
    </div>
  );
}
