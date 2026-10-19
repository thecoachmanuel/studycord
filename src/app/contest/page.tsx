'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Calendar, Coins } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { MOCK_CONTESTS } from '../../lib/api';
import { tr } from '../../lib/translations';
import { QImage } from '../../components/common/QImage';
import { InsufficientCoinsModal } from '../../components/common/InsufficientCoinsModal';

export default function ContestPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { requireAuth } = useAuth();
  const { coins, deductCoins } = useUserDetails();

  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>('live');
  const [contestsList, setContestsList] = useState<any[]>(MOCK_CONTESTS);
  const [insufficientModal, setInsufficientModal] = useState<{
    isOpen: boolean;
    requiredCoins: number;
    actionTitle: string;
  }>({ isOpen: false, requiredCoins: 50, actionTitle: '' });

  // Sync with live database contests
  React.useEffect(() => {
    fetch('/api/contests')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            startDate: c.start_date || c.startDate,
            endDate: c.end_date || c.endDate,
            entryFee: Number(c.entry_coin || c.entryFee || 50),
            status: c.status || 'live',
            prizePool: c.prize_pool || 2500,
            category: c.category || c.categoryId || '',
          }));
          setContestsList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/70' : 'border-slate-100';

  const displayedContests = contestsList.filter((c) => {
    const s = (c.status || 'live').toLowerCase();
    return s === activeTab;
  });

  const handleEnterContest = (contest: any) => {
    requireAuth(() => {
      const success = deductCoins(contest.entryFee, `Contest Entry: ${contest.name}`);
      if (!success) {
        setInsufficientModal({
          isOpen: true,
          requiredCoins: contest.entryFee,
          actionTitle: `enter "${contest.name}"`,
        });
        return;
      }
      const catQuery = contest.category ? `&categoryId=${encodeURIComponent(contest.category)}` : '';
      router.push(`/quiz?quizType=contest&title=${encodeURIComponent(contest.name)}${catQuery}`);
    }, '/contest');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar title={tr('contest')} />

      <div className="max-w-3xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Tab filters */}
        <div className="flex bg-black/5 dark:bg-white/10 p-1 rounded-full max-w-sm mx-auto">
          {(['live', 'upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full capitalize transition-all ${
                activeTab === t
                  ? 'bg-[#ef5388] text-white shadow-sm'
                  : 'text-slate-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {t === 'live' ? 'Ongoing' : t}
            </button>
          ))}
        </div>

        {/* Contest Cards */}
        {displayedContests.length === 0 ? (
          <div className={`w-full ${surfaceBg} rounded-[16px] p-10 text-center border ${cardBorder} shadow-sm space-y-3`}>
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className={`font-bold text-base ${textColor}`}>
              {activeTab === 'live' && 'No Ongoing Contests'}
              {activeTab === 'upcoming' && 'No Upcoming Contests'}
              {activeTab === 'past' && 'No Past Contests'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {activeTab === 'live' && 'There are currently no active tournament matches. Check upcoming tab to see what is scheduled next!'}
              {activeTab === 'upcoming' && 'New tournaments are organized weekly by admin. Stay tuned for registration!'}
              {activeTab === 'past' && 'Finished contests and hall-of-fame records will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedContests.map((c) => (
              <div
                key={c.id}
                className={`w-full ${surfaceBg} rounded-[16px] p-5 shadow-sm border ${cardBorder} flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  {c.status === 'live' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Ongoing
                    </span>
                  )}
                  {c.status === 'upcoming' && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                      Upcoming
                    </span>
                  )}
                  {c.status === 'past' && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                      Completed
                    </span>
                  )}

                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#ef5388] dark:text-[#f279a2]">
                    <QImage imageUrl="/assets/images/coin.svg" width={16} height={16} alt="Coins" />
                    <span>{c.entryFee} Coins</span>
                  </div>
                </div>

                <div>
                  <h3 className={`font-bold text-lg leading-tight ${textColor}`}>{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{c.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-black/5 dark:border-white/5 pt-3">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {c.status === 'upcoming' ? `Starts: ${c.startDate}` : `Ends: ${c.endDate}`}
                    </span>
                  </div>
                  {c.prizePool && (
                    <span className="font-semibold text-amber-500">Prize: {c.prizePool} Coins</span>
                  )}
                </div>

                <div className="flex space-x-2.5 pt-1">
                  <button
                    onClick={() => router.push(`/contest/leaderboard?id=${c.id}&name=${encodeURIComponent(c.name)}`)}
                    className={`flex-1 h-11 rounded-[10px] border border-slate-200 dark:border-slate-700 font-bold text-xs ${textColor} hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-center space-x-2`}
                  >
                    <QImage
                      imageUrl="/assets/images/bottom_nav_icons/leaderboard_icon.svg"
                      width={16}
                      height={16}
                      color={isDark ? '#f279a2' : '#ef5388'}
                      alt="Leaderboard"
                    />
                    <span>Leaderboard</span>
                  </button>

                  {c.status === 'live' && (
                    <QButton onClick={() => handleEnterContest(c)} size="sm" className="flex-1">
                      Enter Contest
                    </QButton>
                  )}
                  {c.status === 'upcoming' && (
                    <button
                      disabled
                      className="flex-1 h-11 rounded-[10px] bg-black/5 dark:bg-white/5 font-bold text-xs text-slate-400 cursor-not-allowed"
                    >
                      Starts Soon
                    </button>
                  )}
                  {c.status === 'past' && (
                    <button
                      onClick={() => router.push(`/contest/leaderboard?id=${c.id}&name=${encodeURIComponent(c.name)}`)}
                      className="flex-1 h-11 rounded-[10px] bg-black/5 dark:bg-white/10 font-bold text-xs text-[#ef5388] dark:text-[#f279a2] hover:underline"
                    >
                      View Results
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insufficient Coins Modal */}
      <InsufficientCoinsModal
        isOpen={insufficientModal.isOpen}
        onClose={() => setInsufficientModal((prev) => ({ ...prev, isOpen: false }))}
        requiredCoins={insufficientModal.requiredCoins}
        actionTitle={insufficientModal.actionTitle}
      />
    </div>
  );
}
