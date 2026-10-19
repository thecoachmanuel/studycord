'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Play } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { tr } from '../../lib/translations';

import { QImage } from '../../components/common/QImage';

export default function BookmarkPage() {
  const router = useRouter();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { isDark } = useTheme();
  const { bookmarks, toggleBookmark } = useUserDetails();

  React.useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/bookmark', 'Please sign in to view and save bookmarked questions.');
    }
  }, [isInitialized, user, isGuest]);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-8 select-none`}>
      <QAppBar
        title={tr('bookmarkLbl')}
        fallbackRoute="/?tab=profile"
        onBack={() => router.push('/?tab=profile')}
      />

      <div className="max-w-2xl w-full mx-auto px-4 py-4 flex-1 flex flex-col justify-between space-y-4">
        {isGuest ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
              <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className={`text-xl font-bold ${textColor}`}>Sign In to View Bookmarks</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Guest accounts cannot persist question bookmarks across sessions. Sign in to your account to save questions for later review!
              </p>
            </div>
            <button
              onClick={() => router.push('/login?redirect=/bookmark')}
              className="h-11 px-6 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center text-slate-400 mb-3 p-3">
              <QImage
                imageUrl="/assets/images/bookmark.svg"
                width={36}
                height={36}
                color={isDark ? '#f279a2' : '#ef5388'}
                alt="Bookmarks"
              />
            </div>
            <h3 className={`font-bold text-base ${textColor}`}>No Bookmarks Saved</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Tap the bookmark icon during any quiz to save difficult questions for later review.
            </p>
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {bookmarks.map((q, idx) => (
              <div
                key={q.id}
                className={`w-full ${surfaceBg} rounded-[10px] p-4 shadow-sm border ${cardBorder} flex items-start justify-between space-x-3`}
              >
                <div className="space-y-1.5 flex-1">
                  <span className="text-[11px] font-bold text-[#ef5388] uppercase tracking-wider">
                    Question #{idx + 1}
                  </span>
                  <p className={`font-semibold text-sm leading-snug ${textColor}`}>
                    {q.question}
                  </p>
                  <p className="text-xs font-medium text-emerald-500">
                    Correct: {q.options.find((o) => o.id === q.correctAnswerOptionId)?.title}
                  </p>
                </div>

                <button
                  onClick={() => toggleBookmark(q)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {bookmarks.length > 0 && (
          <div className="pt-2">
            <QButton
              onClick={() => router.push('/quiz?quizType=bookmarkQuiz&title=Bookmark%20Practice')}
              size="md"
            >
              Practice Bookmarked Questions
            </QButton>
          </div>
        )}
      </div>
    </div>
  );
}
