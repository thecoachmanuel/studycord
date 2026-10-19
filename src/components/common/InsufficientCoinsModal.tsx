'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Gift } from 'lucide-react';
import { QImage } from './QImage';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { soundManager } from '../../lib/sound';

interface InsufficientCoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCoins?: number;
  actionTitle?: string;
}

export const InsufficientCoinsModal: React.FC<InsufficientCoinsModalProps> = ({
  isOpen,
  onClose,
  requiredCoins = 5,
  actionTitle = 'continue',
}) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { coins } = useUserDetails();

  if (!isOpen) return null;

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';

  const handleGoToCoinStore = () => {
    soundManager.playClick();
    onClose();
    router.push('/coin-store');
  };

  const handleGoToRewards = () => {
    soundManager.playClick();
    onClose();
    router.push('/rewards');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-sm ${surfaceBg} rounded-[20px] p-6 shadow-2xl border ${cardBorder} text-center space-y-4`}>
        {/* Animated Coins Dialog Graphic */}
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
          <QImage imageUrl="/assets/images/coins_dialog_icon.svg" width={38} height={38} alt="Coins" />
        </div>

        <div>
          <h3 className={`text-xl font-bold ${textColor}`}>
            Need More Coins
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            You need <strong className="text-amber-500 font-extrabold">{requiredCoins} coins</strong> to {actionTitle}. You currently have <span className="font-bold text-slate-700 dark:text-slate-200">{coins} coins</span>.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {/* Primary: Visit Coin Store */}
          <button
            onClick={handleGoToCoinStore}
            className="w-full h-11 rounded-[10px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Visit Coin Store</span>
          </button>

          {/* Secondary: Daily Rewards Free Coins */}
          <button
            onClick={handleGoToRewards}
            className={`w-full h-11 rounded-[10px] ${surfaceBg} ${textColor} border border-slate-200 dark:border-slate-700 font-bold text-xs shadow-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2`}
          >
            <Gift className="w-4 h-4 text-emerald-500" />
            <span>Claim Free Daily Rewards</span>
          </button>

          {/* Dismiss */}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
