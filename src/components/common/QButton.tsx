'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';

interface QButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

export const QButton: React.FC<QButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = true,
  size = 'md',
  type = 'button',
}) => {
  const { isDark } = useTheme();

  const handleClick = () => {
    if (disabled || loading) return;
    soundManager.playClick();
    soundManager.vibrate(30);
    onClick?.();
  };

  const primaryColor = isDark ? 'bg-[#f279a2]' : 'bg-[#ef5388]';
  const primaryHover = isDark ? 'hover:bg-[#eb6794]' : 'hover:bg-[#e04378]';

  let baseStyles =
    'relative inline-flex items-center justify-center font-bold transition-all duration-150 rounded-[10px] select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  if (size === 'sm') baseStyles += ' h-10 px-4 text-sm';
  if (size === 'md') baseStyles += ' h-12 px-6 text-base';
  if (size === 'lg') baseStyles += ' h-14 px-8 text-lg';
  if (fullWidth) baseStyles += ' w-full';

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = `${primaryColor} ${primaryHover} text-white shadow-[0_4px_12px_rgba(239,83,136,0.3)]`;
  } else if (variant === 'secondary') {
    variantStyles = isDark
      ? 'bg-[#294261] text-[#fefefe] hover:bg-[#324f73]'
      : 'bg-white text-[#45536d] hover:bg-slate-50 border border-slate-200';
  } else if (variant === 'outline') {
    variantStyles = `border-2 ${
      isDark ? 'border-[#f279a2] text-[#f279a2]' : 'border-[#ef5388] text-[#ef5388]'
    } bg-transparent`;
  } else if (variant === 'danger') {
    variantStyles = 'bg-[#FF6169] text-white hover:bg-[#fa4d56] shadow-[0_4px_12px_rgba(255,97,105,0.3)]';
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};
