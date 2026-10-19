'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QImage } from '../../components/common/QImage';

export default function SplashScreen() {
  const router = useRouter();
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    // Logo entrance animation matching Flutter
    const t1 = setTimeout(() => {
      setScale(1.1);
    }, 100);

    const t2 = setTimeout(() => {
      setScale(1.0);
    }, 450);

    const t3 = setTimeout(() => {
      const introSeen = localStorage.getItem('intro_seen');
      if (introSeen === 'true') {
        router.replace('/');
      } else {
        router.replace('/intro-slider');
      }
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 bg-[#ef5388] dark:bg-[#f279a2] flex flex-col items-center justify-between py-10 px-6 transition-colors select-none">
      <div className="flex-1" />

      {/* Main Animated App Logo */}
      <div
        className="transition-transform duration-500 ease-out flex items-center justify-center"
        style={{ transform: `scale(${scale})` }}
      >
        <QImage
          imageUrl="/assets/config/splash_logo.svg"
          width={180}
          height={180}
          alt="Elite Quiz Logo"
          fit="contain"
        />
      </div>

      {/* Organization Logo at bottom */}
      <div className="flex-1 flex items-end justify-center pb-4">
        <QImage
          imageUrl="/assets/config/org_logo.svg"
          width={140}
          height={40}
          alt="WRTeam"
          fit="contain"
        />
      </div>
    </div>
  );
}
