'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, ChevronRight, LogOut, Trash2, LogIn, Gift, Copy, Check, Share2 } from 'lucide-react';
import { QAppBar } from '../common/QAppBar';
import { QImage } from '../common/QImage';
import { QButton } from '../common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';

export const ProfileTab: React.FC = () => {
  const router = useRouter();
  const { user, isGuest, logout, requireAuth } = useAuth();
  const { coins } = useUserDetails();
  const { isDark, toggleTheme } = useTheme();
  const { sound, vibration, toggleSound, toggleVibration } = useSettings();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const referCode = user?.referCode || 'STUDY99';

  const handleCopyReferCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(referCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareReferral = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteUrl = origin ? `${origin}/sign-up?ref=${referCode}` : `/sign-up?ref=${referCode}`;
    const text = `Join me on StudyCord! Sign up with my referral code ${referCode} to get +50 bonus coins: ${inviteUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StudyCord Referral Invite',
          text,
          url: inviteUrl,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(inviteUrl);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  const userName = isGuest ? tr('guest') : user?.name || 'Tawaab';
  const userEmail = isGuest ? 'Sign in to sync your score' : user?.email || 'tawaab@studycord.app';
  const profileImg = user?.profileUrl || '/assets/config/profile/1.svg';

  const MENU_ITEMS = [
    { name: 'wallet', title: tr('wallet'), icon: '/assets/images/wallet_icon.svg', route: '/wallet' },
    { name: 'coinHistory', title: tr('coinHistory'), icon: '/assets/images/coin_history_icon.svg', route: '/coin-history' },
    { name: 'inviteFriendsLbl', title: tr('inviteFriendsLbl'), icon: '/assets/images/invite_friends.svg', route: '/refer-and-earn' },
    { name: 'bookmarkLbl', title: tr('bookmarkLbl'), icon: '/assets/images/bookmark.svg', route: '/bookmark' },
    { name: 'badges', title: tr('badges'), icon: '/assets/images/badges_icon.svg', route: '/badges' },
    { name: 'rewardsLbl', title: tr('rewardsLbl'), icon: '/assets/images/reword_icon.svg', route: '/rewards' },
    { name: 'statisticsLabel', title: tr('statisticsLabel'), icon: '/assets/images/statistics_icon.svg', route: '/statistics' },
    { name: 'aboutQuizApp', title: tr('aboutQuizApp'), icon: '/assets/images/about_us_icon.svg', route: '/about' },
    { name: 'howToPlayLbl', title: tr('howToPlayLbl'), icon: '/assets/images/how_to_play_icon.svg', route: '/instructions' },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen pb-10">
      <QAppBar title={tr('navProfile')} showBack={false} />

      <div className="px-4 py-4 space-y-4">
        {/* 1. Top Profile Card */}
        <div className={`w-full ${surfaceBg} rounded-[10px] p-4 flex items-center justify-between border ${cardBorder} shadow-sm transition-colors`}>
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full border-2 border-[#ef5388]/40 p-0.5 overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={() => requireAuth(() => router.push('/profile/edit'), '/profile/edit')}
              >
                <QImage imageUrl={profileImg} width={50} height={50} circular alt={userName} />
              </div>
              <button
                onClick={() => requireAuth(() => router.push('/profile/edit'), '/profile/edit')}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ef5388] text-white flex items-center justify-center shadow-md active:scale-95"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>

            <div>
              <h2 className={`font-bold text-base leading-tight truncate max-w-[150px] sm:max-w-[200px] ${textColor}`}>
                {userName}
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-[160px] mt-0.5">
                {userEmail}
              </p>
              {!isGuest && (
                <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <QImage imageUrl="/assets/images/coin.svg" width={14} height={14} />
                  <span>{coins.toLocaleString()} Coins</span>
                </div>
              )}
            </div>
          </div>

          {isGuest && (
            <button
              onClick={() => router.push('/login')}
              className="text-xs font-bold text-white bg-[#ef5388] px-3.5 py-2 rounded-[8px] active:scale-95 transition-transform"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Refer & Earn Quick Card */}
        {!isGuest && (
          <div
            onClick={() => router.push('/refer-and-earn')}
            className={`w-full ${surfaceBg} rounded-[12px] p-3.5 border border-[#ef5388]/30 shadow-sm relative overflow-hidden transition-all hover:shadow-md cursor-pointer`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[12px] font-bold text-[#ef5388] uppercase tracking-wider flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" /> Refer & Earn
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-[#ef5388] text-[10px] font-extrabold">
                    +100 Coins / friend
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-xs text-slate-400">Invite Code:</span>
                  <span className="font-mono font-black text-sm tracking-widest text-[#ef5388] dark:text-[#f279a2]">
                    {referCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyReferCode}
                  className="px-2.5 py-1.5 rounded-[8px] bg-slate-100 dark:bg-[#1e2e48] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareReferral}
                  className="px-3 py-1.5 rounded-[8px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Primary Navigation Menu Items (Responsive Grid on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {MENU_ITEMS.map((item) => {
            const isRestrictedForGuest = ['wallet', 'coinHistory', 'inviteFriendsLbl', 'bookmarkLbl', 'badges', 'rewardsLbl', 'statisticsLabel'].includes(item.name);

            return (
              <div
                key={item.name}
                onClick={() => {
                  soundManager.playClick();
                  if (isRestrictedForGuest) {
                    requireAuth(() => router.push(item.route), item.route);
                  } else {
                    router.push(item.route);
                  }
                }}
                className={`p-4 rounded-[10px] ${surfaceBg} border ${cardBorder} flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-[0.99] shadow-sm`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-[10px] bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center p-2 shrink-0">
                    <QImage
                      imageUrl={item.icon}
                      width={22}
                      height={22}
                      color={isDark ? '#f279a2' : '#ef5388'}
                      alt={item.title}
                    />
                  </div>
                  <span className={`font-semibold text-sm ${textColor}`}>
                    {item.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            );
          })}
        </div>

        {/* 3. Preferences Section (Theme, Sound, Vibration) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Theme Toggle */}
          <div
            onClick={() => {
              soundManager.playClick();
              toggleTheme();
            }}
            className={`p-4 rounded-[10px] ${surfaceBg} border ${cardBorder} flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-[0.99] shadow-sm`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center p-2 shrink-0">
                <QImage
                  imageUrl="/assets/images/theme_icon.svg"
                  width={22}
                  height={22}
                  color={isDark ? '#f279a2' : '#ef5388'}
                  alt="Theme"
                />
              </div>
              <span className={`font-semibold text-sm ${textColor}`}>
                {tr('theme')}
              </span>
            </div>
            <span className="text-xs font-bold text-[#ef5388] dark:text-[#f279a2] px-2.5 py-1 rounded-md bg-[#ef5388]/10">
              {isDark ? 'Dark' : 'Light'}
            </span>
          </div>

          {/* Sound Toggle */}
          <div
            onClick={toggleSound}
            className={`p-4 rounded-[10px] ${surfaceBg} border ${cardBorder} flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-[0.99] shadow-sm`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center p-2 shrink-0">
                <QImage
                  imageUrl="/assets/images/volume_icon.svg"
                  width={22}
                  height={22}
                  color={isDark ? '#f279a2' : '#ef5388'}
                  alt="Sound"
                />
              </div>
              <span className={`font-semibold text-sm ${textColor}`}>
                {tr('soundLbl')}
              </span>
            </div>
            {/* Toggle Switch */}
            <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${sound ? 'bg-[#ef5388]' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${sound ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Vibration Toggle */}
          <div
            onClick={toggleVibration}
            className={`p-4 rounded-[10px] ${surfaceBg} border ${cardBorder} flex items-center justify-between hover:shadow-md cursor-pointer transition-all active:scale-[0.99] shadow-sm`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center p-2 shrink-0">
                <QImage
                  imageUrl="/assets/images/vibration_icon.svg"
                  width={22}
                  height={22}
                  color={isDark ? '#f279a2' : '#ef5388'}
                  alt="Vibration"
                />
              </div>
              <span className={`font-semibold text-sm ${textColor}`}>
                {tr('vibrationLbl')}
              </span>
            </div>
            {/* Toggle Switch */}
            <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${vibration ? 'bg-[#ef5388]' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${vibration ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>

        {/* 4. Guest Mode Sign In / Create Account Button OR Logout / Delete Account */}
        {isGuest ? (
          <div className="pt-2">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm py-3.5 rounded-[10px] shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{tr('loginLbl')} / {tr('signUpLbl')}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`w-full ${surfaceBg} rounded-[10px] p-3.5 flex items-center justify-center space-x-2 text-rose-500 font-bold text-sm border ${cardBorder} hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95 transition-all`}
            >
              <LogOut className="w-4 h-4" />
              <span>{tr('logoutLbl')}</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors py-1.5"
            >
              {tr('deleteAccountLbl')}
            </button>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-[20px] p-6 shadow-2xl text-center space-y-4`}>
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 mx-auto flex items-center justify-center">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className={`text-lg font-bold ${textColor}`}>Confirm Logout</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 h-11 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px]"
              >
                {tr('cancel')}
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                  router.replace('/login');
                }}
                className="flex-1 h-11 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-[10px]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-[20px] p-6 shadow-2xl text-center space-y-4`}>
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className={`text-lg font-bold text-red-600`}>Delete Account</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will permanently delete your account, earned coins, badges, and progress. This action cannot be undone.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-11 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px]"
              >
                {tr('cancel')}
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowDeleteModal(false);
                }}
                className="flex-1 h-11 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-[10px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
