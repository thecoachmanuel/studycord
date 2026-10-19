'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QAppBar } from '../common/QAppBar';
import { QuizGridCard } from '../common/QuizGridCard';
import { useAuth } from '../../context/AuthContext';
import { tr } from '../../lib/translations';

export const PlayZoneTab: React.FC = () => {
  const router = useRouter();
  const { requireAuth } = useAuth();

  const PLAY_ZONES = [
    {
      title: tr('dailyQuiz'),
      desc: tr('desDailyQuiz'),
      img: '/assets/images/daily_quiz_icon.svg',
      route: '/quiz?quizType=dailyQuiz&title=' + encodeURIComponent(tr('dailyQuiz')),
    },
    {
      title: tr('funAndLearn'),
      desc: tr('desFunAndLearn'),
      img: '/assets/images/fun_icon.svg',
      route: '/fun-and-learn',
    },
    {
      title: tr('guessTheWord'),
      desc: tr('desGuessTheWord'),
      img: '/assets/images/guess_icon.svg',
      route: '/guess-the-word',
    },
    {
      title: tr('audioQuestions'),
      desc: tr('desAudioQuestions'),
      img: '/assets/images/audio_icon.svg',
      route: '/quiz?quizType=audioQuestions&title=' + encodeURIComponent(tr('audioQuestions')),
    },
    {
      title: tr('mathMania'),
      desc: tr('desMathMania'),
      img: '/assets/images/maths_icon.svg',
      route: '/quiz?quizType=mathMania&title=' + encodeURIComponent(tr('mathMania')),
    },
    {
      title: tr('truefalse'),
      desc: tr('desTrueFalse'),
      img: '/assets/images/true_false_icon.svg',
      route: '/quiz?quizType=trueAndFalse&title=' + encodeURIComponent(tr('truefalse')),
    },
    {
      title: tr('multiMatch'),
      desc: tr('desMultiMatch'),
      img: '/assets/images/multi_match_icon.svg',
      route: '/multi-match',
    },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen pb-6">
      <QAppBar title={tr('navPlayZone')} showBack={false} />

      <div className="px-4 lg:px-0 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PLAY_ZONES.map((zone, idx) => (
          <QuizGridCard
            key={idx}
            title={zone.title}
            desc={zone.desc}
            img={zone.img}
            onClick={() => requireAuth(() => router.push(zone.route), zone.route)}
          />
        ))}
      </div>
    </div>
  );
};
