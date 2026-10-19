'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_SUBCATEGORIES } from '../../lib/api';
import { Subcategory } from '../../types';
import { soundManager } from '../../lib/sound';
import { smartBack } from '../../lib/navigation';

function CategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id') || '1';
  const categoryName = searchParams.get('name') || 'Subcategories';
  const { isDark } = useTheme();
  const { requireAuth } = useAuth();

  const fallbackSubcategories = MOCK_SUBCATEGORIES[categoryId] || [
    { id: 'sub1', maincatId: categoryId, subcategoryName: 'General Quiz', status: '1', maxLevel: '5' },
    { id: 'sub2', maincatId: categoryId, subcategoryName: 'Advanced Challenge', status: '1', maxLevel: '5' },
  ];

  const [subcategories, setSubcategories] = useState<Subcategory[]>(fallbackSubcategories);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/subcategories?category=${categoryId}`)
      .then((res) => res.json())
      .then((res) => {
        if (!cancelled && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Subcategory[] = res.data.map((s: any) => ({
            id: String(s.id),
            maincatId: String(s.maincat_id || categoryId),
            subcategoryName: s.subcategory_name || s.subcategoryName,
            status: String(s.status || '1'),
            maxLevel: String(s.maxLevel || '5'),
          }));
          setSubcategories(mapped);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const categoryIcon = React.useMemo(() => {
    const fromMock = MOCK_CATEGORIES.find(
      (c) => c.id === String(categoryId) || c.categoryName.toLowerCase() === categoryName.toLowerCase()
    );
    if (fromMock?.image) return fromMock.image;

    switch (String(categoryId)) {
      case '1':
        return '/assets/images/quiz_zone_icon.svg';
      case '2':
        return '/assets/images/science_icon.svg';
      case '3':
        return '/assets/images/maths_icon.svg';
      case '4':
        return '/assets/images/daily_quiz_icon.svg';
      case '5':
        return '/assets/images/group_battle_icon.svg';
      case '6':
        return '/assets/images/premium_icon.svg';
      default:
        return '/assets/images/quiz_zone_icon.svg';
    }
  }, [categoryId, categoryName]);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  const handleBack = () => {
    soundManager.playClick();
    router.push('/');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-6 select-none`}>
      <QAppBar title={categoryName} onBack={handleBack} />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {subcategories.map((sub) => {
          const subIcon = (sub as any).image || categoryIcon;
          return (
            <div
              key={sub.id}
              onClick={() => {
                soundManager.playClick();
                router.push(`/levels?categoryId=${categoryId}&subId=${sub.id}&name=${encodeURIComponent(sub.subcategoryName)}&maxLevel=${sub.maxLevel}`);
              }}
              className={`w-full ${surfaceBg} rounded-[10px] p-4 flex items-center justify-between border ${cardBorder} shadow-sm hover:shadow-md transition-all cursor-pointer select-none active:scale-[0.99]`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-[10px] bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center p-2">
                  <QImage imageUrl={subIcon} width={24} height={24} className="brightness-0" />
                </div>
                <div>
                  <h3 className={`font-bold text-base leading-tight ${textColor}`}>
                    {sub.subcategoryName}
                  </h3>
                <span className="text-xs text-slate-400 mt-0.5 inline-block">
                  {sub.maxLevel} Levels Available
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex items-center justify-center text-slate-400">Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
