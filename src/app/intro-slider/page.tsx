'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QImage } from '../../components/common/QImage';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';

const SLIDES = [
  {
    image: '/assets/images/onboarding_a.svg',
    title: 'Compete & Challenge',
    desc: 'Battle with quiz enthusiasts worldwide and prove your intellectual dominance.',
  },
  {
    image: '/assets/images/onboarding_b.svg',
    title: 'Learn & Discover',
    desc: 'Explore thousands of curated questions across science, history, arts, and more.',
  },
  {
    image: '/assets/images/onboarding_c.svg',
    title: 'Earn & Triumph',
    desc: 'Collect badges, earn valuable quiz coins, and redeem thrilling rewards.',
  },
];

export default function IntroSliderPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFinish = () => {
    soundManager.playClick();
    localStorage.setItem('intro_seen', 'true');
    router.replace('/');
  };

  const nextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const topCardBg = isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]';
  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const primaryBg = isDark ? 'bg-[#f279a2]' : 'bg-[#ef5388]';
  const primaryText = isDark ? 'text-[#f279a2]' : 'text-[#ef5388]';

  return (
    <div className={`fixed inset-0 z-50 ${primaryBg} flex flex-col justify-between select-none`}>
      {/* Top 75% Rounded Container */}
      <div className={`h-[75vh] w-full ${topCardBg} rounded-b-[20px] shadow-lg flex flex-col justify-between p-6 relative transition-colors`}>
        {/* Header with Indicators & Skip */}
        <div className="pt-8 flex items-center justify-between">
          {/* Animated Page Indicators */}
          <div className="flex items-center space-x-1.5">
            {SLIDES.map((_, idx) => {
              const isActive = currentIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-200 ${
                    isActive
                      ? `w-6 ${primaryBg}`
                      : `w-2 ${primaryBg} opacity-40`
                  }`}
                />
              );
            })}
          </div>

          {/* Skip Button */}
          <button
            onClick={handleFinish}
            className={`font-semibold text-base ${primaryText} hover:opacity-80 active:scale-95`}
          >
            Skip
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
          {/* Animated Image with gentle floating bounce */}
          <div className="h-60 sm:h-72 w-full max-w-xs flex items-center justify-center mb-6 animate-soft-bounce">
            <QImage
              imageUrl={SLIDES[currentIndex].image}
              width={260}
              height={260}
              alt={SLIDES[currentIndex].title}
              fit="contain"
            />
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold tracking-tight mb-3 ${textColor}`}>
            {SLIDES[currentIndex].title}
          </h2>

          {/* Description */}
          <p className={`text-base font-normal max-w-sm line-clamp-2 leading-relaxed opacity-85 ${textColor}`}>
            {SLIDES[currentIndex].desc}
          </p>
        </div>
      </div>

      {/* Bottom Button Area (in primary background) */}
      <div className="h-[25vh] w-full flex items-center justify-center px-8">
        <button
          onClick={nextSlide}
          className="h-12 w-48 sm:w-56 bg-white dark:bg-[#294261] rounded-[10px] shadow-md flex items-center justify-center active:scale-95 transition-transform"
        >
          <span className={`text-lg font-bold ${textColor}`}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </span>
        </button>
      </div>
    </div>
  );
}
