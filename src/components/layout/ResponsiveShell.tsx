'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import { QImage } from '../common/QImage';
import { NavTabType } from './BottomNavBar';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';
import { syncFrontendWithAdminBackend } from '../../lib/api';
import { StudyCordLogo } from '../common/StudyCordLogo';

interface ResponsiveShellProps {
  children: React.ReactNode;
  activeTab?: NavTabType;
  onTabChange?: (tab: NavTabType) => void;
  showDesktopNav?: boolean;
}

export const ResponsiveShell: React.FC<ResponsiveShellProps> = ({
  children,
  activeTab = 'home',
  onTabChange,
  showDesktopNav = true,
}) => {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    syncFrontendWithAdminBackend();
  }, []);

  const bgPage = isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const primaryColor = isDark ? '#f279a2' : '#ef5388';
  const unselectedColor = isDark ? 'rgba(254, 254, 254, 0.75)' : 'rgba(69, 83, 109, 0.75)';

  const SIDEBAR_TABS = [
    { id: 'home' as NavTabType, label: tr('navHome'), icon: '/assets/images/bottom_nav_icons/home_icon.svg', activeIcon: '/assets/images/bottom_nav_icons/home_active_icon.svg' },
    { id: 'leaderboard' as NavTabType, label: tr('navLeaderBoard'), icon: '/assets/images/bottom_nav_icons/leaderboard_icon.svg', activeIcon: '/assets/images/bottom_nav_icons/leaderboard_active_icon.svg' },
    { id: 'quizZone' as NavTabType, label: tr('navQuizZone'), icon: '/assets/images/bottom_nav_icons/quiz_zone_icon.svg', activeIcon: '/assets/images/bottom_nav_icons/quiz_zone_active_icon.svg' },
    { id: 'playZone' as NavTabType, label: tr('navPlayZone'), icon: '/assets/images/bottom_nav_icons/play_zone_icon.svg', activeIcon: '/assets/images/bottom_nav_icons/play_zone_active_icon.svg' },
    { id: 'profile' as NavTabType, label: tr('navProfile'), icon: '/assets/images/bottom_nav_icons/profile_icon.svg', activeIcon: '/assets/images/bottom_nav_icons/profile_active_icon.svg' },
  ];

  return (
    <div className={`min-h-screen ${bgPage} w-full flex transition-colors font-nunito`}>
      {/* Desktop Sidebar (hidden on mobile < 1024px) */}
      {showDesktopNav && (
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 p-6 border-r border-black/5 dark:border-white/5 sticky top-0 h-screen justify-between shrink-0 bg-white/40 dark:bg-[#294261]/40 backdrop-blur-md z-30 select-none">
          <div>
            {/* App Brand Logo */}
            <div
              className="flex items-center mb-8 cursor-pointer select-none"
              onClick={() => {
                soundManager.playClick();
                if (onTabChange) onTabChange('home');
                else router.push('/');
              }}
            >
              <StudyCordLogo size="lg" isDark={isDark} />
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1.5">
              {SIDEBAR_TABS.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundManager.playClick();
                      if (onTabChange) onTabChange(tab.id);
                      else router.push(`/?tab=${tab.id}`);
                    }}
                    className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-[10px] text-sm font-semibold transition-all ${
                      isSelected
                        ? `${surfaceBg} shadow-sm ${isDark ? 'text-[#f279a2]' : 'text-[#ef5388]'}`
                        : `${textColor}/75 hover:${textColor} hover:bg-black/5 dark:hover:bg-white/5`
                    }`}
                  >
                    <QImage
                      imageUrl={isSelected ? tab.activeIcon : tab.icon}
                      width={22}
                      height={22}
                      color={isSelected ? primaryColor : unselectedColor}
                      alt={tab.label}
                    />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Controls: Dark/Light Mode Switcher & Version */}
          <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
            <button
              onClick={() => {
                soundManager.playClick();
                toggleTheme();
              }}
              className={`flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-lg ${surfaceBg} ${textColor} hover:opacity-80 transition-opacity border border-black/5 dark:border-white/5 shadow-sm`}
            >
              <span>{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-bold">v1.0.0</span>
          </div>
        </aside>
      )}

      {/* Main Content Area - Fully responsive on mobile, tablet, and desktop */}
      <main className="flex-1 w-full min-w-0 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-7xl min-h-screen flex flex-col relative pb-24 lg:pb-8 px-2 sm:px-4 lg:px-8 py-2 lg:py-4">
          {children}
        </div>
      </main>
    </div>
  );
};
