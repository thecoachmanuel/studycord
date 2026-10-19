'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Shield, FileText, Info, ChevronRight } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { useTheme } from '../../context/ThemeContext';
import { tr } from '../../lib/translations';
import { StudyCordLogo } from '../../components/common/StudyCordLogo';

export default function AboutPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [cmsSettings, setCmsSettings] = useState<{
    about_us?: string;
    contact_us?: string;
    terms_conditions?: string;
    privacy_policy?: string;
    app_name?: string;
  }>({});

  React.useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setCmsSettings(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const SECTIONS = [
    {
      id: 'about',
      title: 'About ' + (cmsSettings.app_name || 'Elite Quiz'),
      icon: <Info className="w-5 h-5 text-[#ef5388]" />,
      content: cmsSettings.about_us || `Elite Quiz is an interactive, modern quiz gaming platform featuring real-time battles, competitive tournaments, learning modules, and trivia across dozens of categories. Built to entertain, educate, and reward quiz enthusiasts worldwide.`,
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: <Mail className="w-5 h-5 text-[#ef5388]" />,
      content: cmsSettings.contact_us || `Have questions, bug reports, or feature requests? Contact our support team directly at support@studycord.app or call +234 800 123 4567.`,
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: <FileText className="w-5 h-5 text-[#ef5388]" />,
      content: cmsSettings.terms_conditions || `By accessing or using the StudyCord application, you agree to comply with our community fair play rules. Account sharing, exploitation of lifelines, automated scripts, or fraudulent coin redemption requests will result in immediate forfeiture of coins and permanent suspension.`,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Shield className="w-5 h-5 text-[#ef5388]" />,
      content: cmsSettings.privacy_policy || `We prioritize user privacy. We do not sell personal data to third parties. Performance statistics, leaderboard entries, and quiz progress are securely stored and utilized solely for game operation and multiplayer matchmaking.`,
    },
  ];

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar
        title={tr('aboutQuizApp')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-4">
        {/* Brand Banner */}
        <div className={`w-full ${surfaceBg} rounded-[14px] p-6 text-center space-y-3.5 shadow-sm border ${cardBorder}`}>
          <div className="mx-auto flex items-center justify-center py-2">
            <StudyCordLogo size="xl" isDark={isDark} />
          </div>
          <div>
            <span className="text-xs font-bold text-pink-500 bg-pink-50 dark:bg-pink-950/40 px-3 py-1 rounded-full border border-pink-500/20">Version 1.0.0</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            The premier trivia & competitive learning web application.
          </p>
        </div>

        {/* Options List */}
        <div className={`${surfaceBg} rounded-[10px] border ${cardBorder} divide-y divide-black/5 dark:divide-white/5 shadow-sm overflow-hidden`}>
          {SECTIONS.map((sec) => (
            <div key={sec.id} className="transition-colors">
              <button
                onClick={() => setActiveSection(activeSection === sec.id ? null : sec.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center">
                    {sec.icon}
                  </div>
                  <span className={`font-semibold text-sm ${textColor}`}>
                    {sec.title}
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeSection === sec.id ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {activeSection === sec.id && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40">
                  {sec.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
