'use client';

import React from 'react';
import { QImage } from './QImage';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';

interface QuizGridCardProps {
  title: string;
  desc: string;
  img: string;
  onClick?: () => void;
  className?: string;
  badge?: string;
  isLocked?: boolean;
}

export const QuizGridCard: React.FC<QuizGridCardProps> = ({
  title,
  desc,
  img,
  onClick,
  className = '',
  badge,
  isLocked,
}) => {
  const { isDark } = useTheme();

  const handleClick = () => {
    soundManager.playClick();
    soundManager.vibrate(20);
    onClick?.();
  };

  const cardBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const titleColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const descColor = isDark ? 'text-[#fefefe]/60' : 'text-[#45536d]/60';
  const primaryColor = isDark ? '#f279a2' : '#ef5388';
  const iconBorderColor = isDark ? 'border-[#233354]' : 'border-[#f3f7fa]';

  return (
    <div
      onClick={handleClick}
      className={`group relative aspect-square ${cardBg} rounded-[10px] p-3 sm:p-4 flex flex-col justify-between cursor-pointer select-none transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md shadow-[0_4px_16px_rgba(69,83,109,0.08)] active:scale-[0.98] ${className}`}
    >
      {/* Title & Desc */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className={`font-semibold text-base sm:text-[18px] leading-tight line-clamp-2 ${titleColor}`}>
            {title}
          </h3>
          {(badge || isLocked) && (
            <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
              {badge || 'Locked'}
            </span>
          )}
        </div>
        <p className={`text-xs sm:text-[14px] leading-snug line-clamp-2 ${descColor}`}>
          {desc}
        </p>
      </div>

      {/* Flutter Svg Icon Container at Bottom Right (w-[28%] aspect-square with 6px rounded border) */}
      <div className={`self-end mt-auto w-10 h-10 sm:w-11 sm:h-11 rounded-[6px] border ${iconBorderColor} p-1.5 flex items-center justify-center transition-transform duration-150 group-hover:scale-105`}>
        <QImage
          imageUrl={img}
          width={30}
          height={30}
          color={primaryColor}
          alt={title}
        />
      </div>
    </div>
  );
};
