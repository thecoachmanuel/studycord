'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HelpCircle, 
  Award, 
  Swords, 
  Compass, 
  Coins, 
  ChevronDown, 
  CheckCircle2, 
  Zap,
  Clock,
  RotateCcw,
  SkipForward
} from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { useTheme } from '../../context/ThemeContext';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';

interface InstructionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  items: {
    title: string;
    description: string;
    badge?: string;
  }[];
}

export default function InstructionsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [expandedId, setExpandedId] = useState<string>('rules');

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  const sections: InstructionSection[] = [
    {
      id: 'rules',
      title: 'General Quiz Rules',
      subtitle: 'Scoring, timers, and basic gameplay mechanics',
      icon: <HelpCircle className="w-5 h-5 text-[#ef5388] dark:text-[#f279a2]" />,
      items: [
        {
          title: 'Point Scoring',
          description: 'Each question offers 4 points for a correct answer. In competitive and battle modes, incorrect answers deduct 2 points.',
          badge: '+4 / -2 Pts',
        },
        {
          title: 'Timer & Countdown',
          description: 'Each question has an individual countdown timer (usually 25 seconds). Answering faster earns bonus speed points on the leaderboard.',
          badge: '25s Limit',
        },
        {
          title: 'Multiple Choice Format',
          description: 'Questions feature 4 answer choices, or 2 choices in True & False mode. Tap to lock in your answer immediately.',
        },
        {
          title: 'Level Progression',
          description: 'Quiz Zone categories feature multiple levels. Score at least 70% in each level to unlock the next challenging tier.',
        },
      ],
    },
    {
      id: 'lifelines',
      title: 'In-Quiz Lifelines',
      subtitle: 'Boost your score when stuck on difficult questions',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      items: [
        {
          title: '50 - 50 Lifeline',
          description: 'Eliminates two incorrect options, leaving only the correct answer and one distractor choice.',
          badge: 'Cost: 4 Coins',
        },
        {
          title: 'Audience Poll',
          description: 'Crowdsources statistical confidence percentages across all options to guide your decision.',
          badge: 'Cost: 4 Coins',
        },
        {
          title: 'Reset Timer',
          description: 'Resets the current question countdown timer back to full duration so you have ample time to calculate.',
          badge: 'Cost: 4 Coins',
        },
        {
          title: 'Skip Question',
          description: 'Skips the active question without scoring penalty or score deduction, advancing straight to the next question.',
          badge: 'Cost: 4 Coins',
        },
      ],
    },
    {
      id: 'battle',
      title: 'Battle Zone (Multiplayer)',
      subtitle: 'Head-to-head duels and room tournaments',
      icon: <Swords className="w-5 h-5 text-[#ef5388] dark:text-[#f279a2]" />,
      items: [
        {
          title: '1 vs 1 Battle',
          description: 'Match real-time against another trivia competitor. Both players answer identical questions simultaneously. The player with the highest total score wins the coin pot!',
          badge: 'Live Duels',
        },
        {
          title: 'Group Play (Up to 4 Players)',
          description: 'Create a custom battle room, share your 6-digit room code with friends, and compete in a multiplayer quiz showdown.',
          badge: 'Room Code',
        },
        {
          title: 'In-Battle Quick Chat',
          description: 'Send quick interactive reactions, compliments, and banter during matches using the in-game message drawer.',
        },
      ],
    },
    {
      id: 'playzones',
      title: 'Specialized Play Zones',
      subtitle: 'Distinct formats designed for variety and learning',
      icon: <Compass className="w-5 h-5 text-indigo-500" />,
      items: [
        {
          title: 'Daily Quiz',
          description: 'A fresh curated 10-question quiz every 24 hours. Play daily to maintain streaks and unlock bonus rewards.',
        },
        {
          title: 'Fun & Learn',
          description: 'Read an educational article or passage, then answer comprehension questions testing your grasp of the material.',
        },
        {
          title: 'Guess The Word',
          description: 'Solve fun word puzzles! View clue hints, select letters from a scrambled keyboard, and guess the target word.',
        },
        {
          title: 'Audio Questions',
          description: 'Listen to embedded acoustic audio samples (instruments, bird songs, sound effects) and identify the correct sound source.',
        },
        {
          title: 'Math Mania',
          description: 'Solve arithmetic formulas, algebraic equations, and mental speed math problems under intense time limits.',
        },
        {
          title: 'True & False',
          description: 'Rapid-fire binary evaluation mode with streamlined 2-button choice interface testing your instant factual knowledge.',
        },
        {
          title: 'Multi Match',
          description: 'Connect pairs across columns, matching capital cities to countries, definitions to terms, and historical figures to eras.',
        },
        {
          title: 'Self Challenge',
          description: 'Customize your own training regimen: choose any category, select 5 to 20 questions, and set custom timers from 3 to 12 minutes.',
        },
        {
          title: 'Exam Mode',
          description: 'Formal certified assessment mode with strict anti-cheating guidelines, time limits, and official scoring benchmarks.',
        },
      ],
    },
    {
      id: 'rewards',
      title: 'Coins, Badges & Wallet',
      subtitle: 'Earn currency and redeem real cash payouts',
      icon: <Coins className="w-5 h-5 text-emerald-500" />,
      items: [
        {
          title: 'Earning Coins',
          description: 'Earn coins by scoring well, winning battle rooms, claiming daily scratch card rewards, unlocking achievement badges, and referring friends.',
        },
        {
          title: 'Achievement Badges',
          description: 'Accomplish milestones (Quiz Maestro, Streak King, Battle Gladiator) to unlock prestige badges on your profile and claim coin bonuses.',
        },
        {
          title: 'Wallet & Real Payouts',
          description: 'Accumulated coins can be redeemed for real money via PayPal, Paytm, or UPI (100 coins = $1.00 USD). Payouts process in 3 to 5 business days.',
        },
      ],
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-10 select-none`}>
      <QAppBar
        title={tr('howToPlayLbl')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-2xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Banner Card */}
        <div className={`w-full ${surfaceBg} rounded-[16px] p-5 shadow-sm border ${cardBorder} flex items-center justify-between`}>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ef5388] dark:text-[#f279a2]">
              Official Guide
            </span>
            <h2 className={`text-xl font-black mt-0.5 ${textColor}`}>
              How to Play StudyCord
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
              Master quiz lifelines, battle multiplayer opponents, unlock achievement badges, and redeem real rewards.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#ef5388]/10 flex items-center justify-center shrink-0">
            <HelpCircle className="w-7 h-7 text-[#ef5388] dark:text-[#f279a2]" />
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {sections.map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <div
                key={section.id}
                className={`${surfaceBg} rounded-[14px] border ${cardBorder} shadow-sm overflow-hidden transition-all`}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setExpandedId(isExpanded ? '' : section.id);
                  }}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-base leading-tight ${textColor}`}>
                        {section.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-normal">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isExpanded ? 'rotate-180 text-[#ef5388]' : ''
                    }`}
                  />
                </button>

                {/* Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 divide-y divide-black/5 dark:divide-white/5 border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="py-3 first:pt-2 last:pb-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold flex items-center space-x-2 ${textColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ef5388] shrink-0" />
                            <span>{item.title}</span>
                          </h4>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ef5388]/10 text-[#ef5388] dark:text-[#f279a2]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed pl-3.5">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
