'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QAppBar } from '../../../components/common/QAppBar';
import { QImage } from '../../../components/common/QImage';
import { useTheme } from '../../../context/ThemeContext';
import { MOCK_LEADERBOARD } from '../../../lib/api';

function ContestLeaderboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Contest Leaderboard';
  const { isDark } = useTheme();

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar title={name} />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-2.5">
        {MOCK_LEADERBOARD.map((item) => (
          <div
            key={item.userId}
            className={`w-full ${surfaceBg} rounded-[10px] p-3.5 flex items-center justify-between shadow-sm border border-black/5 dark:border-white/5`}
          >
            <div className="flex items-center space-x-3.5">
              <span className={`w-6 text-center font-bold text-sm ${item.user_rank === '1' ? 'text-amber-500' : 'text-slate-400'}`}>
                #{item.user_rank}
              </span>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <QImage imageUrl={item.profile} width={38} height={38} circular alt={item.name} />
              </div>
              <span className={`font-semibold text-sm ${textColor}`}>
                {item.name}
              </span>
            </div>
            <span className="font-bold text-sm text-[#ef5388] dark:text-[#f279a2]">
              {item.score} Pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContestLeaderboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex items-center justify-center text-slate-400">Loading...</div>}>
      <ContestLeaderboardContent />
    </Suspense>
  );
}
