'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Gift, Sparkles, RefreshCw } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_NOTIFICATIONS } from '../../lib/api';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  date: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/notifications', 'Please sign in to view your account notifications and updates.');
    }
  }, [isInitialized, user, isGuest]);

  useEffect(() => {
    if (!user || isGuest) {
      setLoading(false);
      return;
    }

    const email = user.email ? encodeURIComponent(user.email) : '';
    const userId = user.userId ? encodeURIComponent(user.userId) : '';
    fetch(`/api/notifications?email=${email}&userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setNotifications(data.data);
        } else {
          setNotifications(MOCK_NOTIFICATIONS as NotificationItem[]);
        }
      })
      .catch(() => {
        setNotifications(MOCK_NOTIFICATIONS as NotificationItem[]);
      })
      .finally(() => setLoading(false));
  }, [user, isGuest]);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar title="Notifications" />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-3">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to View Notifications</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts cannot receive personalized alerts or contest notifications. Sign in to your StudyCord account to stay informed!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/notifications')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
            <div className="w-7 h-7 border-2 border-[#ef5388] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading notifications...</p>
          </div>
        ) : (
          notifications.map((n) => {
            const isReferral = n.type === 'referral' || n.type === 'welcome' || n.title?.toLowerCase().includes('referral');
            return (
              <div
                key={n.id}
                className={`w-full ${surfaceBg} rounded-[12px] p-4 flex items-start space-x-3.5 shadow-sm border ${
                  isReferral ? 'border-[#ef5388]/30 dark:border-[#ef5388]/40' : cardBorder
                } transition-all`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isReferral
                      ? 'bg-pink-500/15 text-[#ef5388]'
                      : 'bg-[#ef5388]/10 text-[#ef5388]'
                  }`}
                >
                  {isReferral ? <Gift className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-bold text-sm leading-tight ${textColor}`}>{n.title}</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
