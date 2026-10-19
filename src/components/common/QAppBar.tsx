'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

import { soundManager } from '../../lib/sound';

import { smartBack } from '../../lib/navigation';

interface QAppBarProps {
  title: string | React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  fallbackRoute?: string;
  actions?: React.ReactNode;
  rounded?: boolean;
  bottom?: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

export const QAppBar: React.FC<QAppBarProps> = ({
  title,
  showBack = true,
  onBack,
  fallbackRoute = '/',
  actions,
  rounded = true,
  bottom,
  className = '',
  transparent = false,
}) => {
  const router = useRouter();
  const { isDark } = useTheme();

  const handleBack = () => {
    soundManager.playClick();
    if (onBack) {
      onBack();
    } else {
      smartBack(router, fallbackRoute);
    }
  };

  const bgColor = transparent
    ? 'bg-transparent'
    : isDark
    ? 'bg-[#294261]'
    : 'bg-white';

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-colors ${bgColor} ${
        rounded ? 'rounded-b-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : ''
      } ${className}`}
    >
      <div className="h-14 px-4 flex items-center justify-between relative max-w-md mx-auto md:max-w-none">
        {/* Back Button */}
        <div className="w-10 flex items-center">
          {showBack && (
            <button
              onClick={handleBack}
              aria-label="Back"
              className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform ${textColor}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Center Title */}
        <div className="flex-1 text-center font-bold text-lg tracking-wide truncate px-2 select-none">
          {typeof title === 'string' ? (
            <h1 className={`${textColor} truncate font-bold text-[18px]`}>{title}</h1>
          ) : (
            title
          )}
        </div>

        {/* Action icons / widgets */}
        <div className="w-10 flex items-center justify-end">{actions}</div>
      </div>

      {bottom && <div className="px-4 pb-3">{bottom}</div>}
    </header>
  );
};
