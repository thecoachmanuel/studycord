'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface StudyCordLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  isDark?: boolean;
}

export const StudyCordLogo: React.FC<StudyCordLogoProps> = ({
  size = 'md',
  className = '',
  onClick,
  isDark: propIsDark,
}) => {
  const { isDark: contextIsDark } = useTheme();
  const effectiveIsDark = propIsDark !== undefined ? propIsDark : contextIsDark;

  const sizeClasses = {
    xs: 'text-base',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-baseline font-black tracking-normal select-none ${sizeClasses[size]} ${
        onClick ? 'cursor-pointer hover:opacity-95 active:scale-[0.99] transition-transform' : ''
      } ${className}`}
      title="StudyCord"
    >
      {/* "Study" with natural tight kerning without collision */}
      <span className={`${effectiveIsDark ? 'text-white' : 'text-[#233354]'} transition-colors font-black`}>
        Study
      </span>
      {/* "Cord" with signature vibrant modern gradient */}
      <span className="bg-gradient-to-r from-[#ef5388] via-[#f05387] to-[#8a33f6] dark:from-[#f279a2] dark:to-[#c084fc] bg-clip-text text-transparent font-black">
        Cord
      </span>
    </div>
  );
};
