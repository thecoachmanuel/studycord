'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface QImageProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  circular?: boolean;
  fit?: 'contain' | 'cover' | 'fill' | 'none';
  onClick?: () => void;
}

const MULTICOLOR_ASSETS = [
  'coin.svg',
  'earnedcoin.svg',
  'daily_coins.svg',
  'app_logo.svg',
  'splash_logo',
  'profile/',
  'google',
  'apple',
  'onboarding',
  'rank_1',
  'rank_2',
  'rank_3',
  'rank_4',
  'placeholder',
  'scratchcard',
  'coins_dialog_icon',
  'payment_methods',
  'paypal',
  'paytm',
  'upi',
  'hexagon',
];

export const QImage: React.FC<QImageProps> = ({
  imageUrl = '/assets/config/placeholder.png',
  alt = 'image',
  className = '',
  width,
  height,
  color,
  circular = false,
  fit = 'contain',
  onClick,
}) => {
  const { isDark } = useTheme();

  let src = imageUrl || '/assets/config/placeholder.png';
  if (!src.startsWith('/') && !src.startsWith('http')) {
    src = `/${src}`;
  }

  const isSvg = src.toLowerCase().endsWith('.svg');
  const isMulticolor = MULTICOLOR_ASSETS.some((m) => src.toLowerCase().includes(m));

  // Only apply mask tint when color is EXPLICITLY provided by caller and it is not a multicolor asset
  const shouldApplyTint = Boolean(color) && isSvg && !isMulticolor;
  const activeColor = color;

  const w = width ? (typeof width === 'number' ? `${width}px` : width) : undefined;
  const h = height ? (typeof height === 'number' ? `${height}px` : height) : undefined;

  const containerStyle: React.CSSProperties = {
    width: w || (className.includes('w-') ? undefined : '100%'),
    height: h || (className.includes('h-') ? undefined : '100%'),
  };

  // When a color tint is explicitly requested on a monochrome SVG
  if (shouldApplyTint && activeColor) {
    return (
      <span
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        title={alt}
        className={`inline-flex items-center justify-center shrink-0 select-none ${
          circular ? 'rounded-full overflow-hidden' : ''
        } ${className}`}
        style={containerStyle}
      >
        <span
          className="w-full h-full block"
          style={{
            backgroundColor: activeColor,
            maskImage: `url("${src}")`,
            WebkitMaskImage: `url("${src}")`,
            maskSize: fit === 'cover' ? 'cover' : 'contain',
            WebkitMaskSize: fit === 'cover' ? 'cover' : 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskMode: 'alpha',
            WebkitMask: `url("${src}") no-repeat center / contain`,
          } as React.CSSProperties}
        />
      </span>
    );
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        circular ? 'rounded-full overflow-hidden' : ''
      } ${className}`}
      style={containerStyle}
    >
      <img
        src={src}
        alt={alt}
        style={{ objectFit: fit }}
        className={`w-full h-full ${circular ? 'rounded-full' : ''}`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/assets/config/placeholder.png';
        }}
      />
    </div>
  );
};
