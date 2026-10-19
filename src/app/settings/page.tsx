'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, Vibrate, Type, Globe } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { tr } from '../../lib/translations';

export default function SettingsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { sound, vibration, fontSize, toggleSound, toggleVibration, setFontSize } = useSettings();

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar title="Settings" />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-4">
        <div className={`${surfaceBg} rounded-[10px] border ${cardBorder} divide-y divide-black/5 dark:divide-white/5 shadow-sm overflow-hidden`}>
          {/* Sound Toggle */}
          <div
            onClick={toggleSound}
            className="p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-[#ef5388]">
                <Volume2 className="w-5 h-5" />
              </div>
              <span className={`font-semibold text-sm ${textColor}`}>
                Sound Effects
              </span>
            </div>
            <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${sound ? 'bg-[#ef5388]' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${sound ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Vibration Toggle */}
          <div
            onClick={toggleVibration}
            className="p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-[#ef5388]">
                <Vibrate className="w-5 h-5" />
              </div>
              <span className={`font-semibold text-sm ${textColor}`}>
                Vibration & Haptics
              </span>
            </div>
            <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${vibration ? 'bg-[#ef5388]' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${vibration ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Font Size Selector */}
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-[#ef5388]">
                <Type className="w-5 h-5" />
              </div>
              <span className={`font-semibold text-sm ${textColor}`}>
                Question Font Size ({fontSize}px)
              </span>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              {[16, 18, 20, 22].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`flex-1 py-1.5 rounded-[8px] text-xs font-bold border transition-all ${
                    fontSize === sz
                      ? 'border-[#ef5388] bg-[#ef5388] text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  {sz}px
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
