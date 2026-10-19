'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, X } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { Badge } from '../../types';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';
import confetti from 'canvas-confetti';

export default function BadgesPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { badges, claimBadgeReward } = useUserDetails();

  React.useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/badges', 'Please sign in to earn, view, and claim your achievement badges.');
    }
  }, [isInitialized, user, isGuest]);

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Match Flutter's _organizedBadges: unlocked first, then locked
  const unlockedBadges = badges.filter((b) => b.status !== 'locked');
  const lockedBadges = badges.filter((b) => b.status === 'locked');
  const organizedBadges = [...unlockedBadges, ...lockedBadges];

  const handleClaim = (badge: Badge) => {
    claimBadgeReward(badge.id);
    soundManager.playCorrect();
    soundManager.vibrate(50);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#ef5388', '#5DB760'],
    });
    setSelectedBadge(null);
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-10 select-none`}>
      <QAppBar
        title={tr('badges')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-3xl w-full mx-auto px-4 py-6">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to View Badges</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts cannot unlock badges or claim coin rewards. Sign in to your StudyCord account to track achievements and level up!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/badges')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
            {organizedBadges.map((badge) => {
              const isUnlocked = badge.status !== 'locked';

              // Exact Flutter RadialGradient and BoxShadow with signature pink accents
              const cardBgStyle = isUnlocked
                ? {
                    background: isDark
                      ? 'radial-gradient(circle at top, rgba(242, 121, 162, 0.16) 0%, #294261 100%)'
                      : 'radial-gradient(circle at top, rgba(239, 83, 136, 0.12) 0%, #ffffff 100%)',
                    boxShadow: isDark
                      ? '0 4px 16px -2px rgba(242, 121, 162, 0.28)'
                      : '0 4px 16px -2px rgba(239, 83, 136, 0.22)',
                  }
                : {
                    background: isDark
                      ? 'radial-gradient(circle at top, rgba(128, 128, 128, 0.08) 0%, #294261 100%)'
                      : 'radial-gradient(circle at top, rgba(128, 128, 128, 0.06) 0%, #ffffff 100%)',
                    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
                  };

              const cardBorder = isUnlocked
                ? isDark
                  ? 'border-[#f279a2]/50 ring-1 ring-[#f279a2]/30'
                  : 'border-[#ef5388]/40 ring-1 ring-[#ef5388]/25'
                : isDark
                ? 'border-slate-700/60'
                : 'border-slate-200/60';

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedBadge(badge);
                  }}
                  className="relative pt-7 flex flex-col items-center cursor-pointer group active:scale-[0.98] transition-transform duration-150"
                >
                  {/* Flutter Bottom Container (75% height with rounded-[20px]) */}
                  <div
                    className={`w-full min-h-[120px] sm:min-h-[135px] rounded-[20px] pb-3 px-2 pt-10 flex flex-col items-center justify-end text-center border ${cardBorder}`}
                    style={cardBgStyle}
                  >
                    {/* Flutter: TextStyle(color: isUnlocked ? signaturePink : kBadgeLockedColor, fontSize: 14, fontWeight: bold) */}
                    <h4
                      className={`font-bold text-xs sm:text-[14px] leading-tight px-1 line-clamp-2 ${
                        isUnlocked
                          ? isDark
                            ? 'text-[#f279a2]'
                            : 'text-[#ef5388]'
                          : 'text-[#7b7b7b]'
                      }`}
                    >
                      {badge.title}
                    </h4>
                    <div className="h-2 sm:h-3" />
                  </div>

                  {/* Flutter BadgesIconContainer (Sits on top without dark shadows or lock overlay) */}
                  <div className="absolute top-0 w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center pointer-events-none">
                    {/* Hexagon Shape */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-transform duration-150 group-hover:scale-105 ${
                        isUnlocked ? '' : 'filter grayscale contrast-75 opacity-60'
                      }`}
                    >
                      <QImage
                        imageUrl="/assets/images/hexagon.svg"
                        width={56}
                        height={56}
                        alt="Hexagon"
                      />
                    </div>

                    {/* Guaranteed Centered Pure White Icon */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${
                        isUnlocked ? '' : 'filter grayscale opacity-60'
                      }`}
                    >
                      <span
                        className="w-5 h-5 sm:w-6 sm:h-6 block select-none pointer-events-none"
                        style={{
                          backgroundColor: '#ffffff',
                          WebkitMask: `url("${badge.icon}") no-repeat center / contain`,
                          mask: `url("${badge.icon}") no-repeat center / contain`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Flutter _BadgeDetailsSheet modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-sm ${
              isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'
            } rounded-t-[20px] sm:rounded-[20px] p-6 shadow-2xl text-center space-y-4 border ${
              isDark ? 'border-slate-700/60' : 'border-slate-200'
            } relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-150`}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Flutter Hexagon in Sheet (showShadow: true in Flutter) */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
              <div
                className={`relative ${
                  selectedBadge.status !== 'locked'
                    ? 'drop-shadow-[4px_4px_6px_rgba(0,0,0,0.25)]'
                    : 'filter grayscale opacity-60'
                }`}
              >
                <QImage
                  imageUrl="/assets/images/hexagon.svg"
                  width={96}
                  height={96}
                  alt="Hexagon Badge"
                />
              </div>

              {/* Centered White Icon with shimmer */}
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  selectedBadge.status === 'locked' ? 'filter grayscale opacity-60' : ''
                }`}
              >
                <span
                  className="w-9 h-9 block select-none pointer-events-none"
                  style={{
                    backgroundColor: '#ffffff',
                    WebkitMask: `url("${selectedBadge.icon}") no-repeat center / contain`,
                    mask: `url("${selectedBadge.icon}") no-repeat center / contain`,
                  }}
                />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3
                className={`text-xl sm:text-[22px] font-bold ${
                  selectedBadge.status !== 'locked'
                    ? isDark
                      ? 'text-[#fefefe]'
                      : 'text-[#45536d]'
                    : 'text-[#7b7b7b]'
                }`}
              >
                {selectedBadge.title}
              </h3>
              <p
                className={`text-[15px] sm:text-[16px] leading-relaxed mt-2 max-w-xs mx-auto ${
                  isDark ? 'text-[#fefefe]/80' : 'text-[#45536d]/80'
                }`}
              >
                {selectedBadge.description}
              </p>
            </div>

            {/* Unlock Status / Reward Notice */}
            {selectedBadge.status === 'locked' ? (
              <div
                className={`p-3 rounded-xl text-[15px] sm:text-[16px] ${
                  isDark ? 'text-[#fefefe]/80 bg-white/5' : 'text-[#45536d]/80 bg-black/5'
                }`}
              >
                <span>{tr('unlockToEarn')}</span>{' '}
                <strong
                  className={`font-bold ${
                    isDark ? 'text-[#f279a2]' : 'text-[#ef5388]'
                  }`}
                >
                  {selectedBadge.reward} {tr('coinsLbl')}!
                </strong>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-500 font-bold text-xs sm:text-sm">
                <Award className="w-4 h-4" />
                <span>Prize: +{selectedBadge.reward} Coins</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex space-x-3">
              <button
                onClick={() => setSelectedBadge(null)}
                className={`flex-1 h-11 text-xs sm:text-sm font-semibold rounded-[10px] transition-colors ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-700/60'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {tr('cancel')}
              </button>

              {selectedBadge.status === 'unlocked' && (
                <QButton
                  onClick={() => handleClaim(selectedBadge)}
                  size="sm"
                  className="flex-1 shadow-md"
                >
                  Claim +{selectedBadge.reward} Coins
                </QButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
