'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ResponsiveShell } from '../components/layout/ResponsiveShell';
import { BottomNavBar, NavTabType } from '../components/layout/BottomNavBar';
import { HomeTab } from '../components/tabs/HomeTab';
import { LeaderboardTab } from '../components/tabs/LeaderboardTab';
import { QuizZoneTab } from '../components/tabs/QuizZoneTab';
import { PlayZoneTab } from '../components/tabs/PlayZoneTab';
import { ProfileTab } from '../components/tabs/ProfileTab';
import { WelcomeOfferModal } from '../components/common/WelcomeOfferModal';
import { useAuth } from '../context/AuthContext';
import { syncFrontendWithAdminBackend } from '../lib/api';

function DashboardContent() {
  const router = useRouter();
  const { user, isGuest, isInitialized } = useAuth();
  const searchParams = useSearchParams();
  const requestedTab = (searchParams.get('tab') as NavTabType) || 'home';
  const [currentTab, setCurrentTab] = useState<NavTabType>('home');

  useEffect(() => {
    syncFrontendWithAdminBackend();
  }, []);

  // When users first visit the app, land on login screen
  useEffect(() => {
    if (isInitialized && !user && !isGuest) {
      router.replace('/login');
    }
  }, [isInitialized, user, isGuest, router]);

  useEffect(() => {
    if (requestedTab && ['home', 'leaderboard', 'quizZone', 'playZone', 'profile'].includes(requestedTab)) {
      setCurrentTab(requestedTab);
    }
  }, [requestedTab]);

  if (!isInitialized || (!user && !isGuest)) {
    return (
      <div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#ef5388] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading StudyCord...</span>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'home':
        return <HomeTab onTabChange={setCurrentTab} />;
      case 'leaderboard':
        return <LeaderboardTab onTabChange={setCurrentTab} />;
      case 'quizZone':
        return <QuizZoneTab />;
      case 'playZone':
        return <PlayZoneTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab onTabChange={setCurrentTab} />;
    }
  };

  return (
    <ResponsiveShell activeTab={currentTab} onTabChange={setCurrentTab}>
      <div className="w-full flex-1 flex flex-col">
        {renderActiveTab()}
      </div>

      <WelcomeOfferModal />

      {/* Flutter Mobile 82px Curved Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        className="lg:hidden"
      />
    </ResponsiveShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex items-center justify-center text-slate-400">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

