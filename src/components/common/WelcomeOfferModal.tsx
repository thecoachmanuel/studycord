'use client';

import React, { useEffect, useState } from 'react';
import { Gift, Sparkles, Coins, Zap, Swords, Trophy, CheckCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';

interface WelcomeOfferModalProps {
  onClaim?: () => void;
}

export const WelcomeOfferModal: React.FC<WelcomeOfferModalProps> = ({ onClaim }) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [welcomeCoins, setWelcomeCoins] = useState('250');

  useEffect(() => {
    try {
      const shouldShow = localStorage.getItem('studycord_show_welcome_modal');
      const coinsAmount = localStorage.getItem('studycord_welcome_coins') || '250';
      if (shouldShow === 'true') {
        setWelcomeCoins(coinsAmount);
        setIsOpen(true);
        soundManager.playCorrect();
      }
    } catch {}
  }, []);

  const handleClaim = () => {
    soundManager.playClick();
    soundManager.playCorrect();
    soundManager.vibrate(30);
    try {
      localStorage.removeItem('studycord_show_welcome_modal');
      localStorage.removeItem('studycord_welcome_coins');
      localStorage.setItem('studycord_welcome_claimed', 'true');
    } catch {}
    setIsOpen(false);
    if (onClaim) onClaim();
  };

  if (!isOpen) return null;

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 select-none">
      <div
        className={`w-full max-w-sm rounded-[20px] ${surfaceBg} border ${cardBorder} shadow-2xl p-6 text-center relative overflow-hidden animate-in zoom-in-95 duration-200`}
      >
        {/* Decorative Top Ambient Glow */}
        <div className="absolute -top-14 inset-x-0 mx-auto w-40 h-40 bg-gradient-to-b from-[#ef5388]/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Floating Celebration Icon */}
        <div className="relative mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388] to-[#f279a2] flex items-center justify-center text-white shadow-lg shadow-[#ef5388]/30">
          <Gift className="w-10 h-10 animate-bounce duration-1000" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Badge & Title */}
        <div className="space-y-1 mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/10 border border-[#ef5388]/30 text-[#ef5388] text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Special Welcome Gift
          </span>
          <h2 className={`text-2xl font-black ${textColor} tracking-tight`}>
            Welcome to StudyCord!
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your free welcome coin bundle is ready to power up your quiz adventures.
          </p>
        </div>

        {/* Coin Highlight Card */}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-tr from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-amber-500/30 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
            <Coins className="w-7 h-7" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider block">
              Free Welcome Pack
            </span>
            <span className="text-2xl font-black text-amber-500">
              +{welcomeCoins} Coins
            </span>
          </div>
        </div>

        {/* Feature List (What user can play) */}
        <div className="text-left space-y-2 mb-6">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            What you can play:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Quiz Zone Levels</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Swords className="w-3.5 h-3.5 text-[#ef5388] shrink-0" />
              <span>1v1 Battle Arena</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Trophy className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>Mega Contests</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Lifelines & Hints</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClaim}
          className="w-full h-12 rounded-[12px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-extrabold text-sm shadow-md shadow-[#ef5388]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span>Claim & Start Playing</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
