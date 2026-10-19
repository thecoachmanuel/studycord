'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';
import { QImage } from '../common/QImage';

export type NavTabType = 'home' | 'leaderboard' | 'quizZone' | 'playZone' | 'profile';

interface NavTabItem {
  id: NavTabType;
  titleKey: string;
  icon: string;
  activeIcon: string;
}

const TABS: NavTabItem[] = [
  {
    id: 'home',
    titleKey: 'navHome',
    icon: '/assets/images/bottom_nav_icons/home_icon.svg',
    activeIcon: '/assets/images/bottom_nav_icons/home_active_icon.svg',
  },
  {
    id: 'leaderboard',
    titleKey: 'navLeaderBoard',
    icon: '/assets/images/bottom_nav_icons/leaderboard_icon.svg',
    activeIcon: '/assets/images/bottom_nav_icons/leaderboard_active_icon.svg',
  },
  {
    id: 'quizZone',
    titleKey: 'navQuizZone',
    icon: '/assets/images/bottom_nav_icons/quiz_zone_icon.svg',
    activeIcon: '/assets/images/bottom_nav_icons/quiz_zone_active_icon.svg',
  },
  {
    id: 'playZone',
    titleKey: 'navPlayZone',
    icon: '/assets/images/bottom_nav_icons/play_zone_icon.svg',
    activeIcon: '/assets/images/bottom_nav_icons/play_zone_active_icon.svg',
  },
  {
    id: 'profile',
    titleKey: 'navProfile',
    icon: '/assets/images/bottom_nav_icons/profile_icon.svg',
    activeIcon: '/assets/images/bottom_nav_icons/profile_active_icon.svg',
  },
];

interface BottomNavBarProps {
  currentTab: NavTabType;
  onTabChange: (tab: NavTabType) => void;
  className?: string;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  className = '',
}) => {
  const { isDark } = useTheme();

  const navBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const primaryColor = isDark ? '#f279a2' : '#ef5388';
  const unselectedColor = isDark ? 'rgba(254, 254, 254, 0.7)' : 'rgba(69, 83, 109, 0.7)';

  return (
    <nav
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 h-[82px] ${navBg} rounded-t-[20px] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-around px-2 max-w-md mx-auto md:max-w-none transition-colors ${className}`}
    >
      {TABS.map((tab) => {
        const isSelected = currentTab === tab.id;
        const color = isSelected ? primaryColor : unselectedColor;
        const iconSrc = isSelected ? tab.activeIcon : tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => {
              soundManager.playClick();
              soundManager.vibrate(25);
              onTabChange(tab.id);
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 group focus:outline-none transition-transform active:scale-95"
          >
            {/* Animated Icon with 1.2 scale when active */}
            <div
              className={`transition-transform duration-150 ease-out flex items-center justify-center h-7 w-7 ${
                isSelected ? 'scale-[1.2]' : 'scale-100'
              }`}
            >
              <QImage
                imageUrl={iconSrc}
                width={24}
                height={24}
                color={color}
                alt={tab.titleKey}
              />
            </div>

            {/* Title Label */}
            <span
              style={{ color }}
              className={`text-[12px] leading-tight mt-1 truncate select-none ${
                isSelected ? 'font-medium' : 'font-normal'
              }`}
            >
              {tr(tab.titleKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
