'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Share2, Link2, Users, Coins, Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { tr } from '../../lib/translations';

interface ReferralRecord {
  id: string;
  referee_name: string;
  referee_email?: string;
  reward_coins: number;
  date: string;
  created_at?: string;
}

export default function ReferAndEarnPage() {
  const router = useRouter();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { isDark } = useTheme();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);

  React.useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/refer-and-earn', 'Please sign in to invite friends and earn bonus coins.');
    }
  }, [isInitialized, user, isGuest]);

  const referCode = user?.referCode || 'STUDY99';
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const inviteUrl = origin ? `${origin}/sign-up?ref=${referCode}` : `/sign-up?ref=${referCode}`;

  // Fetch referrals for this user
  useEffect(() => {
    if (!user || isGuest) return;
    setLoadingReferrals(true);
    const query = user.userId ? `referrer_id=${user.userId}` : `referrer_code=${referCode}`;
    fetch(`/api/referrals?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setReferrals(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingReferrals(false));
  }, [user, isGuest, referCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    const text = `Join me on StudyCord! Sign up using my referral link to get +50 bonus coins immediately: ${inviteUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StudyCord Referral Invite',
          text,
          url: inviteUrl,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const subtleBg = isDark ? 'bg-[#1e2e48]' : 'bg-[#f4f7fa]';
  const totalEarned = referrals.reduce((sum, r) => sum + (Number(r.reward_coins) || 100), 0);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-10 select-none`}>
      <QAppBar
        title={tr('referAndEarn')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-xl w-full mx-auto px-4 py-6 flex-1 flex flex-col space-y-6">
        {isGuest ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to Invite Friends</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts cannot invite friends or track referral rewards. Sign in to get your personalized invite link and earn coins!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/refer-and-earn')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <>
            {/* Top Illustration */}
            <div className="w-full flex items-center justify-center pt-1">
              <div className="relative">
                <QImage
                  imageUrl="/assets/images/refer_friends.svg"
                  width={200}
                  height={150}
                  alt="Refer Friends"
                />
              </div>
            </div>

            {/* Header and Reward Details */}
            <div className="text-center space-y-1.5">
              <h2 className={`text-2xl font-black ${textColor} tracking-tight`}>
                Invite Friends & Earn Coins
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Share your invite code or link. You earn <strong className="text-[#ef5388] font-bold">+100 coins</strong> for every friend who joins, and they receive <strong className="text-[#ef5388] font-bold">+50 coins</strong>!
              </p>
            </div>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`${surfaceBg} rounded-[14px] p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-[#ef5388] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Friends Joined
                  </span>
                  <span className={`text-xl font-black ${textColor}`}>
                    {referrals.length}
                  </span>
                </div>
              </div>

              <div className={`${surfaceBg} rounded-[14px] p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Coins Earned
                  </span>
                  <span className={`text-xl font-black text-amber-500`}>
                    +{totalEarned}
                  </span>
                </div>
              </div>
            </div>

            {/* Referral Code Box */}
            <div className={`${surfaceBg} rounded-[14px] p-4 border-2 border-dashed border-[#ef5388]/60 shadow-sm flex items-center justify-between`}>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Your Referral Code
                </span>
                <span className="text-2xl font-black tracking-widest text-[#ef5388] dark:text-[#f279a2]">
                  {referCode}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-[10px] bg-[#ef5388] hover:bg-[#de4377] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Invite Link Box */}
            <div className={`${surfaceBg} rounded-[14px] p-4 shadow-sm border border-slate-200/60 dark:border-slate-700/60 space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-[#ef5388]" />
                  Direct Invite Link
                </span>
                {copiedLink && (
                  <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Link Copied!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-10 px-3 rounded-[8px] ${subtleBg} ${textColor} text-xs font-mono flex items-center overflow-x-auto whitespace-nowrap scrollbar-none select-all border border-slate-200 dark:border-slate-700`}>
                  {inviteUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="h-10 px-3.5 rounded-[8px] bg-slate-200 dark:bg-[#1e2e48] hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shrink-0 transition-colors"
                >
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Primary Share Action */}
            <div className="w-full pt-1">
              <QButton onClick={handleShare} size="lg" className="flex items-center justify-center space-x-2">
                <Share2 className="w-5 h-5 mr-1" />
                <span>Share Invitation Link</span>
              </QButton>
            </div>

            {/* Referral Audit Trail / Friends List */}
            <div className="space-y-3 pt-2">
              <h3 className={`text-sm font-bold ${textColor} flex items-center gap-1.5`}>
                <Sparkles className="w-4 h-4 text-[#ef5388]" />
                Referred Friends ({referrals.length})
              </h3>

              {loadingReferrals ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading your referral history...</div>
              ) : referrals.length === 0 ? (
                <div className={`${surfaceBg} rounded-[14px] p-6 text-center space-y-2 border border-slate-200/50 dark:border-slate-700/50`}>
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 text-[#ef5388] mx-auto flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                  <p className={`text-xs font-bold ${textColor}`}>No referrals yet</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Share your invite link with your study partners or classmates to start earning bonus coins!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {referrals.map((item) => (
                    <div
                      key={item.id}
                      className={`${surfaceBg} rounded-[12px] p-3.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ef5388]/15 text-[#ef5388] font-bold text-sm flex items-center justify-center uppercase">
                          {item.referee_name ? item.referee_name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${textColor}`}>
                            {item.referee_name || 'Anonymous User'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {item.date || 'Recently joined'}
                          </p>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        +{item.reward_coins || 100} Coins
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
