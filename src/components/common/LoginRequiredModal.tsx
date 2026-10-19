'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, X } from 'lucide-react';
import { QImage } from './QImage';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  redirectUrl?: string;
}

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  redirectUrl,
}) => {
  const router = useRouter();
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';

  const handleLogin = () => {
    soundManager.playClick();
    onClose();
    if (redirectUrl) {
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      router.push('/login');
    }
  };

  const handleCancel = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className={`w-full max-w-sm ${surfaceBg} rounded-[20px] p-6 shadow-2xl border ${cardBorder} text-center space-y-4 relative`}>
        {/* Dismiss Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Illustration: Uses official login_acc.svg from Flutter app */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
          <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
        </div>

        {/* Text Header */}
        <div className="space-y-1.5">
          <h3 className={`text-xl font-bold ${textColor}`}>
            {title || tr('loginRequired')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
            {message || tr('loginRequiredDesc')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Sign In Primary Button */}
          <button
            onClick={handleLogin}
            className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{tr('loginLbl')} / {tr('signUpLbl')}</span>
          </button>

          {/* Maybe Later Dismiss Button */}
          <button
            onClick={handleCancel}
            className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1.5 transition-colors"
          >
            {tr('maybeLater')}
          </button>
        </div>
      </div>
    </div>
  );
};
