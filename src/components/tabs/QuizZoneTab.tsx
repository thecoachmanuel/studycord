'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Lock } from 'lucide-react';
import { QAppBar } from '../common/QAppBar';
import { QImage } from '../common/QImage';
import { QButton } from '../common/QButton';
import { QuizGridCard } from '../common/QuizGridCard';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { tr } from '../../lib/translations';
import { MOCK_CATEGORIES, isSpecialQuizModeCategory } from '../../lib/api';
import { Category } from '../../types';
import { soundManager } from '../../lib/sound';
import { InsufficientCoinsModal } from '../common/InsufficientCoinsModal';

export const QuizZoneTab: React.FC = () => {
  const router = useRouter();
  const { isGuest, openLoginModal } = useAuth();
  const { isDark } = useTheme();
  const { coins, deductCoins } = useUserDetails();
  const [categories, setCategories] = useState<Category[]>(() =>
    MOCK_CATEGORIES.filter((c) => !isSpecialQuizModeCategory(c))
  );
  const [unlockTarget, setUnlockTarget] = useState<Category | null>(null);
  const [unlockError, setUnlockError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/categories?type=1')
      .then((res) => res.json())
      .then((res) => {
        if (!cancelled && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Category[] = res.data
            .filter((c: any) => !isSpecialQuizModeCategory(c))
            .map((c: any) => ({
              id: String(c.id),
              categoryName: c.category_name,
              image: c.image || '/assets/images/quiz_zone_icon.svg',
              hasSubcategories: c.id === '1' || c.id === '2' || c.id === '4' || Boolean(c.hasSubcategories),
              hasLevels: c.hasLevels !== false,
              maxLevel: String(c.maxLevel || '5'),
              noOfQuestions: String(c.noOfQuestions || '50'),
              isPremium: c.is_premium === '1',
              hasUnlocked: false,
              requiredCoins: c.required_coins || 200,
            }));
          setCategories(mapped);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  const handleCategoryClick = (cat: Category) => {
    soundManager.playClick();
    if (cat.isPremium && !cat.hasUnlocked) {
      if (isGuest) {
        openLoginModal(
          cat.hasSubcategories
            ? `/category?id=${cat.id}&name=${encodeURIComponent(cat.categoryName)}`
            : `/levels?categoryId=${cat.id}&name=${encodeURIComponent(cat.categoryName)}`,
          'Please sign in to unlock premium quiz categories.'
        );
        return;
      }
      setUnlockTarget(cat);
      setUnlockError('');
      return;
    }

    if (cat.hasSubcategories) {
      router.push(`/category?id=${cat.id}&name=${encodeURIComponent(cat.categoryName)}`);
    } else if (cat.hasLevels) {
      router.push(`/levels?categoryId=${cat.id}&name=${encodeURIComponent(cat.categoryName)}&maxLevel=${cat.maxLevel}`);
    } else {
      router.push(`/quiz?categoryId=${cat.id}&title=${encodeURIComponent(cat.categoryName)}`);
    }
  };

  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [insufficientReqCoins, setInsufficientReqCoins] = useState(100);

  const handleConfirmUnlock = () => {
    if (!unlockTarget) return;
    const req = unlockTarget.requiredCoins || 100;
    const success = deductCoins(req, `Unlock Category: ${unlockTarget.categoryName}`);
    if (!success) {
      soundManager.playWrong();
      setInsufficientReqCoins(req);
      setUnlockTarget(null);
      setShowInsufficientModal(true);
      return;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === unlockTarget.id ? { ...c, hasUnlocked: true } : c))
    );
    soundManager.playCorrect();
    setUnlockTarget(null);
  };

  return (
    <div className="w-full flex flex-col min-h-screen pb-6">
      <QAppBar title={tr('quizZone')} showBack={false} />

      <div className="px-4 lg:px-0 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {categories.map((cat) => {
          const isLocked = cat.isPremium && !cat.hasUnlocked;

          return (
            <QuizGridCard
              key={cat.id}
              title={cat.categoryName}
              desc={`${cat.maxLevel} Levels Available`}
              img={cat.image || '/assets/images/quiz_zone_icon.svg'}
              badge={isLocked ? `${cat.requiredCoins || 200} Coins` : undefined}
              isLocked={isLocked}
              onClick={() => handleCategoryClick(cat)}
            />
          );
        })}
      </div>

      {/* Unlock Category Modal */}
      {unlockTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-[20px] p-6 shadow-2xl text-center space-y-4`}>
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className={`text-lg font-bold ${textColor}`}>
              Unlock {unlockTarget.categoryName}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Spend <strong className="text-[#ef5388]">{unlockTarget.requiredCoins} Coins</strong> to unlock this premium category permanently?
            </p>

            <div className="text-xs font-semibold text-slate-400">
              Your balance: <strong className="text-emerald-500">{coins} Coins</strong>
            </div>

            {unlockError && (
              <div className="text-xs text-red-500 font-semibold p-2 bg-red-100 dark:bg-red-950/40 rounded-lg">
                {unlockError}
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setUnlockTarget(null)}
                className="flex-1 h-11 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px]"
              >
                {tr('cancel')}
              </button>
              <QButton onClick={handleConfirmUnlock} size="sm" className="flex-1">
                Unlock
              </QButton>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Coins Modal */}
      <InsufficientCoinsModal
        isOpen={showInsufficientModal}
        onClose={() => setShowInsufficientModal(false)}
        requiredCoins={insufficientReqCoins}
        actionTitle="unlock this premium category"
      />
    </div>
  );
};
