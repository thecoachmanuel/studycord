'use client';

import React from 'react';
import { tr } from '../../lib/translations';

interface UserAchievementsProps {
  rank?: string | number;
  coins?: string | number;
  score?: string | number;
  className?: string;
}

export const UserAchievements: React.FC<UserAchievementsProps> = ({
  rank = '0',
  coins = '0',
  score = '0',
  className = '',
}) => {
  const formatNumber = (val: string | number) => {
    const num = Number(String(val).replace(/,/g, ''));
    return isNaN(num) ? val : num.toLocaleString();
  };

  return (
    <div className={`px-4 lg:px-0 ${className}`}>
      <div className="relative">
        {/* Soft elliptical shadow glow below card */}
        <div className="absolute -bottom-1 inset-x-4 h-4 bg-[#ef5388]/30 blur-md rounded-b-[20px]" />

        {/* Card */}
        <div className="relative bg-[#ef5388] text-white rounded-[10px] py-4 px-6 shadow-md flex items-center justify-around">
          {/* Rank */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
              {tr('rankLbl')}
            </span>
            <span className="text-white font-extrabold text-xl tracking-tight">
              {formatNumber(rank)}
            </span>
          </div>

          {/* Divider 1 */}
          <div className="w-[2px] h-10 bg-white/40 rounded-full mx-2" />

          {/* Coins */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
              {tr('coinsLbl')}
            </span>
            <span className="text-white font-extrabold text-xl tracking-tight">
              {formatNumber(coins)}
            </span>
          </div>

          {/* Divider 2 */}
          <div className="w-[2px] h-10 bg-white/40 rounded-full mx-2" />

          {/* Score */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
              {tr('scoreLbl')}
            </span>
            <span className="text-white font-extrabold text-xl tracking-tight">
              {formatNumber(score)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
