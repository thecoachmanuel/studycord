'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Users, Award, ShieldAlert, Zap, Timer, Trophy } from 'lucide-react';
import { ResponsiveShell } from '../../components/layout/ResponsiveShell';
import { QAppBar } from '../../components/common/QAppBar';
import { QuizGridCard } from '../../components/common/QuizGridCard';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';
import { ECONOMY_RULES } from '../../lib/quizEngine';

export default function BattleZonePage() {
  const router = useRouter();
  const { requireAuth } = useAuth();

  const BATTLE_MODES = [
    {
      title: tr('groupPlay'),
      desc: tr('desGroupPlay'),
      img: '/assets/images/group_battle_icon.svg',
      route: '/battle/group',
    },
    {
      title: tr('battleQuiz'),
      desc: tr('desBattleQuiz'),
      img: '/assets/images/one_vs_one_icon.svg',
      route: '/battle/find-opponent',
    },
    {
      title: tr('exam'),
      desc: tr('desExam'),
      img: '/assets/images/exam_icon.svg',
      route: '/exam',
    },
    {
      title: tr('selfChallenge'),
      desc: tr('challengeYourselfLbl'),
      img: '/assets/images/self_challenge.svg',
      route: '/self-challenge',
    },
  ];

  return (
    <ResponsiveShell showDesktopNav={true}>
      <div className="w-full flex flex-col min-h-screen pb-6">
        <QAppBar title="Battle Zone" />

        <div className="px-4 lg:px-0 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {BATTLE_MODES.map((mode, idx) => (
            <QuizGridCard
              key={idx}
              title={mode.title}
              desc={mode.desc}
              img={mode.img}
              onClick={() => requireAuth(() => router.push(mode.route), mode.route)}
            />
          ))}
        </div>
      </div>
    </ResponsiveShell>
  );
}
