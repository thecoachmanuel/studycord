'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Share2, Award } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { useAuth } from '../../context/AuthContext';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';
import { InsufficientCoinsModal } from '../../components/common/InsufficientCoinsModal';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const { isGuest, openLoginModal } = useAuth();
  const { deductCoins, recordQuizCompletion } = useUserDetails();

  const total = parseInt(searchParams.get('total') || '5', 10);
  const correct = parseInt(searchParams.get('correct') || '4', 10);
  const score = parseInt(searchParams.get('score') || '80', 10);
  const coins = parseInt(searchParams.get('coins') || '8', 10);
  const categoryId = searchParams.get('categoryId') || '1';
  const subId = searchParams.get('subId') || '101';
  const level = parseInt(searchParams.get('level') || '1', 10);
  const quizType = searchParams.get('quizType') || '';
  const rawTitle = searchParams.get('title');
  const title = rawTitle && rawTitle !== 'Quiz' && !rawTitle.toLowerCase().includes('result') ? (
    quizType === 'trueAndFalse' ? tr('truefalseQuizResult') :
    quizType === 'guessTheWord' ? 'Guess The Word Result' :
    `${rawTitle} Result`
  ) : (
    quizType === 'trueAndFalse' ? tr('truefalseQuizResult') :
    quizType === 'guessTheWord' ? 'Guess The Word Result' :
    tr('quizResultLbl')
  );

  const incorrect = Math.max(0, total - correct);
  const percentage = Math.round((correct / (total || 1)) * 100);
  const isWin = percentage >= 60;

  const [copied, setCopied] = useState(false);
  const [showReviewConfirm, setShowReviewConfirm] = useState(false);
  const [insufficientModal, setInsufficientModal] = useState<{
    isOpen: boolean;
    requiredCoins: number;
    actionTitle: string;
  }>({ isOpen: false, requiredCoins: 5, actionTitle: '' });
  const [completionResult, setCompletionResult] = useState<{
    passed: boolean;
    nextLevelUnlocked?: number;
    newBadges: string[];
  } | null>(null);

  useEffect(() => {
    if (!isGuest) {
      // Record game completion, auto level unlocking, and badge attainment
      const res = recordQuizCompletion({
        totalQuestions: total,
        correctAnswers: correct,
        score,
        coins,
        categoryId,
        subId,
        level,
      });
      setCompletionResult(res);
    } else {
      // Save pending trial score so signing in credits the user with this score!
      try {
        localStorage.setItem(
          'pending_guest_score',
          JSON.stringify({
            score,
            coins,
            categoryId,
            subId,
            level,
            timestamp: Date.now(),
          })
        );
      } catch {}
    }

    if (isWin) {
      soundManager.playCorrect();
      soundManager.vibrate(60);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ef5388', '#5DB760', '#FFD700', '#294261'],
      });
    } else {
      soundManager.playWrong();
      soundManager.vibrate(100);
    }
  }, [isGuest]);

  const handleShare = async () => {
    soundManager.playClick();
    const shareText = `Elite Quiz - I just scored ${score} pts with ${percentage}% accuracy on ${title}! Can you beat my score?`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Elite Quiz Score',
          text: shareText,
          url: window.location.origin,
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReviewAnswers = () => {
    soundManager.playClick();
    if (isGuest) {
      openLoginModal(
        `/result?total=${total}&correct=${correct}&score=${score}&coins=${coins}&level=${level}&categoryId=${categoryId}&subId=${subId}`,
        'Please sign in to review answers and save your progress.'
      );
      return;
    }
    setShowReviewConfirm(true);
  };

  const confirmUnlockReview = () => {
    if (!deductCoins(5, 'Review Answers Lifeline')) {
      setShowReviewConfirm(false);
      setInsufficientModal({
        isOpen: true,
        requiredCoins: 5,
        actionTitle: 'review answers',
      });
      return;
    }
    setShowReviewConfirm(false);
    router.push('/review-answers');
  };

  const getNextLevelNumber = () => {
    if (quizType === 'guessTheWord') {
      const stored = typeof window !== 'undefined' ? parseInt(localStorage.getItem('app_unlocked_level_guessTheWord') || '1', 10) : 1;
      return Math.min(10, Math.max(stored, level + 1));
    }
    if (quizType === 'funAndLearn') {
      const stored = typeof window !== 'undefined' ? parseInt(localStorage.getItem('app_unlocked_level_funAndLearn') || '1', 10) : 1;
      return Math.min(10, Math.max(stored, level + 1));
    }
    if (quizType === 'trueAndFalse') {
      const stored = typeof window !== 'undefined' ? parseInt(localStorage.getItem('app_unlocked_level_trueAndFalse') || '1', 10) : 1;
      return Math.min(10, Math.max(stored, level + 1));
    }
    if (quizType === 'dailyQuiz') {
      const stored = typeof window !== 'undefined' ? parseInt(localStorage.getItem('app_unlocked_level_dailyQuiz') || '1', 10) : 1;
      return Math.min(10, Math.max(stored, level + 1));
    }
    if (quizType === 'mathMania') {
      const stored = typeof window !== 'undefined' ? parseInt(localStorage.getItem('app_unlocked_level_mathMania') || '1', 10) : 1;
      return Math.min(10, Math.max(stored, level + 1));
    }
    if (quizType === 'audioQuestions') {
      const stored = typeof window !== 'undefined' ? parseInt(localStorage.getItem('app_unlocked_level_audioQuestions') || '1', 10) : 1;
      return Math.min(10, Math.max(stored, level + 1));
    }
    return Math.min(10, completionResult?.nextLevelUnlocked || level + 1);
  };

  const handleNextLevel = () => {
    soundManager.playClick();
    if (isGuest) {
      openLoginModal(
        `/levels?categoryId=${categoryId}&subId=${subId}`,
        `Sign in to unlock Level ${getNextLevelNumber()} and record your score.`
      );
      return;
    }
    const nextLvl = getNextLevelNumber();

    if (quizType === 'guessTheWord') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_unlocked_level_guessTheWord', String(nextLvl));
      }
      router.replace(`/guess-the-word?level=${nextLvl}`);
      return;
    }
    if (quizType === 'funAndLearn') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_unlocked_level_funAndLearn', String(nextLvl));
      }
      router.replace(`/fun-and-learn?level=${nextLvl}`);
      return;
    }
    if (quizType === 'trueAndFalse') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_unlocked_level_trueAndFalse', String(nextLvl));
      }
      router.replace(
        `/quiz?quizType=trueAndFalse&level=${nextLvl}&title=${encodeURIComponent(`True & False - Level ${nextLvl}`)}`
      );
      return;
    }
    if (quizType === 'dailyQuiz') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_unlocked_level_dailyQuiz', String(nextLvl));
      }
      router.replace(
        `/quiz?quizType=dailyQuiz&level=${nextLvl}&title=${encodeURIComponent(`Daily Quiz - Level ${nextLvl}`)}`
      );
      return;
    }
    if (quizType === 'mathMania') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_unlocked_level_mathMania', String(nextLvl));
      }
      router.replace(
        `/quiz?quizType=mathMania&level=${nextLvl}&title=${encodeURIComponent(`Math Mania - Level ${nextLvl}`)}`
      );
      return;
    }
    if (quizType === 'audioQuestions') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_unlocked_level_audioQuestions', String(nextLvl));
      }
      router.replace(
        `/quiz?quizType=audioQuestions&level=${nextLvl}&title=${encodeURIComponent(`Audio Quiz - Level ${nextLvl}`)}`
      );
      return;
    }

    // Category / subcategory quiz
    router.replace(
      `/quiz?categoryId=${categoryId}&subId=${subId}&level=${nextLvl}&title=${encodeURIComponent(
        rawTitle ? rawTitle.replace(/Level \d+/, `Level ${nextLvl}`) : `Level ${nextLvl}`
      )}`
    );
  };

  const handleRetry = () => {
    soundManager.playClick();
    if (isGuest) {
      if (level === 1) {
        router.replace(
          `/quiz?categoryId=${categoryId}&subId=${subId}&level=1&quizType=${encodeURIComponent(quizType)}&title=${encodeURIComponent(rawTitle || title)}&retake=true`
        );
      } else {
        openLoginModal(
          `/levels?categoryId=${categoryId}&subId=${subId}`,
          'Please sign in to retake this level.'
        );
      }
      return;
    }
    if (!deductCoins(5, 'Quiz Retry Cost')) {
      setInsufficientModal({
        isOpen: true,
        requiredCoins: 5,
        actionTitle: `retake Level ${level}`,
      });
      return;
    }
    if (quizType === 'guessTheWord') {
      router.replace(`/guess-the-word?level=${level}&retake=true`);
      return;
    }
    if (quizType === 'funAndLearn') {
      router.replace(`/fun-and-learn?level=${level}&retake=true`);
      return;
    }
    if (quizType === 'trueAndFalse') {
      router.replace(`/quiz?quizType=trueAndFalse&level=${level}&title=${encodeURIComponent(`True & False - Level ${level}`)}&retake=true`);
      return;
    }
    // retake=true ensures the quiz loads the exact same question set that the user took last time
    router.replace(
      `/quiz?categoryId=${categoryId}&subId=${subId}&level=${level}&quizType=${encodeURIComponent(quizType)}&title=${encodeURIComponent(rawTitle || title)}&retake=true`
    );
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const primaryColor = isDark ? '#f279a2' : '#ef5388';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-8 select-none`}>
      <QAppBar title={title} onBack={() => router.replace('/')} />

      <div className="flex-1 max-w-md lg:max-w-2xl w-full mx-auto px-4 py-6 flex flex-col items-center justify-between space-y-5">
        {/* New Badge Attained Banner */}
        {completionResult?.newBadges && completionResult.newBadges.length > 0 && (
          <div className="w-full bg-gradient-to-r from-amber-500/15 via-pink-500/15 to-purple-500/15 border border-amber-400/40 rounded-[14px] p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  New Badge Unlocked!
                </span>
                <h4 className={`font-black text-sm leading-tight ${textColor}`}>
                  {completionResult.newBadges.join(', ')}
                </h4>
              </div>
            </div>
            <button
              onClick={() => router.push('/badges')}
              className="text-xs font-bold text-[#ef5388] px-3 py-1 rounded-full bg-white/80 dark:bg-black/30 shadow-sm"
            >
              View Badges
            </button>
          </div>
        )}

        {/* Radial Percentage Score Ring */}
        <div className="relative w-40 h-40 flex items-center justify-center my-1">
          <div className="absolute inset-0 rounded-full bg-[#ef5388]/10 blur-xl" />

          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={isDark ? '#294261' : '#ffffff'}
              strokeWidth="8"
              fill="none"
              className="shadow-sm"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={primaryColor}
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${textColor}`}>
              {percentage}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {tr('accuracy')}
            </span>
          </div>
        </div>

        {/* Win / Loss Title Message */}
        <div className="text-center">
          <h2 className={`text-2xl font-black ${textColor} tracking-tight`}>
            {isGuest ? (isWin ? 'Trial Quiz Completed!' : tr('betterLuckNextTime')) : (isWin ? tr('congratulations') : tr('betterLuckNextTime'))}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {isGuest
              ? isWin
                ? `You scored ${percentage}% on Level 1! Sign in now to record your ${score} pts and unlock Level 2.`
                : 'Trial quiz finished. Sign in to unlock all levels, earn coins, and rank on the leaderboard.'
              : isWin
              ? `Outstanding! You achieved ${percentage}% score and unlocked Level ${(completionResult?.nextLevelUnlocked || level + 1)}.`
              : 'Keep practicing! Need 60% accuracy to unlock the next level.'}
          </p>
        </div>

        {/* 4 Stats Grid Cards */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={`${surfaceBg} rounded-[10px] p-3 flex items-center space-x-3 shadow-sm border border-black/5 dark:border-white/5`}>
            <CheckCircle2 className="w-8 h-8 text-[#5DB760]" />
            <div>
              <span className="text-xs text-slate-400">{tr('correct')}</span>
              <p className={`text-lg font-bold leading-tight ${textColor}`}>{correct}</p>
            </div>
          </div>

          <div className={`${surfaceBg} rounded-[10px] p-3 flex items-center space-x-3 shadow-sm border border-black/5 dark:border-white/5`}>
            <XCircle className="w-8 h-8 text-[#FF6169]" />
            <div>
              <span className="text-xs text-slate-400">{tr('incorrect')}</span>
              <p className={`text-lg font-bold leading-tight ${textColor}`}>{incorrect}</p>
            </div>
          </div>

          <div className={`${surfaceBg} rounded-[10px] p-3 flex items-center space-x-3 shadow-sm border border-black/5 dark:border-white/5`}>
            <QImage imageUrl="/assets/images/earnedCoin.svg" width={32} height={32} />
            <div>
              <span className="text-xs text-slate-400">{tr('earnedCoins')}</span>
              <p className="text-lg font-bold leading-tight text-emerald-500">+{coins}</p>
            </div>
          </div>

          <div className={`${surfaceBg} rounded-[10px] p-3 flex items-center space-x-3 shadow-sm border border-black/5 dark:border-white/5`}>
            <QImage imageUrl="/assets/images/score.svg" width={32} height={32} />
            <div>
              <span className="text-xs text-slate-400">{tr('totalScore')}</span>
              <p className={`text-lg font-bold leading-tight text-[#ef5388] dark:text-[#f279a2]`}>
                +{score}
              </p>
            </div>
          </div>
        </div>

        {/* Guest Trial Call to Action Banner */}
        {isGuest && (
          <div className={`w-full ${surfaceBg} rounded-[16px] p-4 border-2 border-[#ef5388]/30 shadow-md flex flex-col space-y-3`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#ef5388]/10 text-[#ef5388] flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className={`text-sm font-bold leading-tight ${textColor}`}>
                  Record Score & Unlock Level 2
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in to save your +{score} pts & +{coins} coins to the leaderboard!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                openLoginModal(
                  `/levels?categoryId=${categoryId}&subId=${subId}`,
                  `Sign in to record your ${score} pts and unlock Level 2!`
                );
              }}
              className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <span>Sign In to Save Progress</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          {isWin ? (
            <>
              <button
                onClick={handleNextLevel}
                className="w-full h-12 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f05387] text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Level {getNextLevelNumber()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleRetry}
                className={`w-full h-11 rounded-[10px] ${surfaceBg} ${textColor} border border-slate-200 dark:border-slate-700 font-bold text-xs shadow-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>Retake Level {level} (5 Coins)</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleRetry}
              className="w-full h-12 rounded-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Level {level} (5 Coins)</span>
            </button>
          )}

          {/* Review Answers (5 Coins) */}
          <button
            onClick={handleReviewAnswers}
            className={`w-full h-11 rounded-[10px] ${surfaceBg} ${textColor} border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-sm hover:opacity-90 active:scale-[0.99] transition-all`}
          >
            {tr('reviewAnsBtn')} (5 Coins)
          </button>

          {/* Share Score */}
          <button
            onClick={handleShare}
            className={`w-full h-11 rounded-[10px] ${surfaceBg} text-[#ef5388] dark:text-[#f279a2] border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2`}
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Score Link Copied!' : tr('shareScoreBtn')}</span>
          </button>

          {/* Back to Home */}
          <button
            onClick={() => router.replace('/')}
            className="w-full text-center text-xs font-semibold text-slate-400 hover:text-[#ef5388] py-1.5 transition-colors"
          >
            {tr('homeBtn')}
          </button>
        </div>
      </div>

      {/* Review Answers Coins Confirmation Modal */}
      {showReviewConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-[20px] p-6 shadow-2xl text-center space-y-4`}>
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 mx-auto flex items-center justify-center">
              <QImage imageUrl="/assets/images/coins_dialog_icon.svg" width={36} height={36} />
            </div>
            <h3 className={`text-lg font-bold ${textColor}`}>
              {tr('reviewAnswers')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {tr('spend')} <strong className="text-[#ef5388]">5 coins</strong> {tr('reviewAnsMessage')}
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowReviewConfirm(false)}
                className="flex-1 h-11 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px]"
              >
                {tr('notNow')}
              </button>
              <QButton onClick={confirmUnlockReview} size="sm" className="flex-1">
                {tr('reviewAndImprove')}
              </QButton>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Coins Modal */}
      <InsufficientCoinsModal
        isOpen={insufficientModal.isOpen}
        onClose={() => setInsufficientModal((prev) => ({ ...prev, isOpen: false }))}
        requiredCoins={insufficientModal.requiredCoins}
        actionTitle={insufficientModal.actionTitle}
      />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex items-center justify-center text-slate-400">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
