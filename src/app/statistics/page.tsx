'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Swords, Award, Coins } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { tr } from '../../lib/translations';

export default function StatisticsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { coins, score, badges } = useUserDetails();

  React.useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/statistics', 'Please sign in to view your quiz statistics, accuracy, and performance history.');
    }
  }, [isInitialized, user, isGuest]);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  const stats = {
    questionsAnswered: 248,
    correctAnswers: 204,
    incorrectAnswers: 44,
    battlesPlayed: 32,
    battlesWon: 24,
    battlesLost: 8,
  };

  const accuracy = Math.round((stats.correctAnswers / stats.questionsAnswered) * 100);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar
        title={tr('statisticsLabel')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-4">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to View Statistics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts do not have performance history or progress tracking. Sign in to your StudyCord account to view accuracy, battles won, and question breakdowns!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/statistics')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <>
            {/* Overall Accuracy Card */}
            <div className={`w-full ${surfaceBg} rounded-[10px] p-5 shadow-sm border ${cardBorder} flex items-center justify-between`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Accuracy
                </span>
                <h2 className={`text-3xl font-black mt-1 ${textColor}`}>
                  {accuracy}%
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Based on {stats.questionsAnswered} questions attempted
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[#ef5388] flex items-center justify-center font-bold text-lg text-[#ef5388]">
                {accuracy}%
              </div>
            </div>

            {/* Question Performance Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Correct */}
              <div className={`${surfaceBg} rounded-[10px] p-4 shadow-sm border ${cardBorder} flex items-center space-x-3`}>
                <CheckCircle className="w-8 h-8 text-[#5DB760]" />
                <div>
                  <span className="text-xs text-slate-400">{tr('correct')}</span>
                  <p className={`text-xl font-black ${textColor}`}>{stats.correctAnswers}</p>
                </div>
              </div>

              {/* Incorrect */}
              <div className={`${surfaceBg} rounded-[10px] p-4 shadow-sm border ${cardBorder} flex items-center space-x-3`}>
                <XCircle className="w-8 h-8 text-[#FF6169]" />
                <div>
                  <span className="text-xs text-slate-400">{tr('incorrect')}</span>
                  <p className={`text-xl font-black ${textColor}`}>{stats.incorrectAnswers}</p>
                </div>
              </div>
            </div>

            {/* Battle Statistics */}
            <div className={`w-full ${surfaceBg} rounded-[10px] p-5 shadow-sm border ${cardBorder} space-y-3`}>
              <div className="flex items-center space-x-2 text-[#ef5388]">
                <Swords className="w-5 h-5" />
                <h3 className={`font-bold text-sm uppercase tracking-wider ${textColor}`}>
                  Battle Performance
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <span className="text-xs text-slate-400">Played</span>
                  <p className={`text-lg font-bold mt-0.5 ${textColor}`}>{stats.battlesPlayed}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Victories</span>
                  <p className="text-lg font-bold mt-0.5 text-emerald-500">{stats.battlesWon}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Defeats</span>
                  <p className="text-lg font-bold mt-0.5 text-rose-500">{stats.battlesLost}</p>
                </div>
              </div>
            </div>

            {/* Coins & Badges Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`${surfaceBg} rounded-[10px] p-4 shadow-sm border ${cardBorder} flex items-center space-x-3`}>
                <Coins className="w-8 h-8 text-amber-500" />
                <div>
                  <span className="text-xs text-slate-400">{tr('coinsLbl')}</span>
                  <p className={`text-xl font-black ${textColor}`}>{coins.toLocaleString()}</p>
                </div>
              </div>

              <div
                onClick={() => router.push('/badges')}
                className={`${surfaceBg} rounded-[10px] p-4 shadow-sm border ${cardBorder} flex items-center space-x-3 cursor-pointer hover:shadow-md transition-shadow`}
              >
                <Award className="w-8 h-8 text-[#ef5388]" />
                <div>
                  <span className="text-xs text-slate-400">Badges</span>
                  <p className={`text-xl font-black ${textColor}`}>
                    {badges.filter((b) => b.status !== 'locked').length} / {badges.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Flutter Collected Badges Section */}
            {badges.filter((b) => b.status !== 'locked').length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-1">
                  <h3 className={`font-bold text-base ${textColor}`}>
                    Collected Badges
                  </h3>
                  <button
                    onClick={() => router.push('/badges')}
                    className="text-xs font-semibold text-[#ef5388] dark:text-[#f279a2] hover:underline"
                  >
                    {tr('viewAll')}
                  </button>
                </div>

                <div className={`w-full ${surfaceBg} rounded-[20px] p-4 shadow-sm border ${cardBorder} flex items-center justify-around`}>
                  {badges
                    .filter((b) => b.status !== 'locked')
                    .slice(0, 4)
                    .map((badge) => (
                      <div
                        key={badge.id}
                        onClick={() => router.push('/badges')}
                        className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
                      >
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <QImage imageUrl="/assets/images/hexagon.svg" width={44} height={44} alt={badge.title} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <QImage imageUrl={badge.icon} width={18} height={18} color="#ffffff" alt={badge.title} />
                          </div>
                        </div>
                        <span className={`text-[11px] font-semibold text-center line-clamp-1 max-w-[64px] mt-1 ${textColor}`}>
                          {badge.title}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
