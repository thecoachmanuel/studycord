'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lightbulb, RotateCcw, Award, ChevronRight, Frown } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';
import { shuffleArray } from '../../lib/quizEngine';
import { getWordsForLevel, GuessWordItem } from '../../lib/guessWordData';
import { InsufficientCoinsModal } from '../../components/common/InsufficientCoinsModal';

/**
 * Generates an authentically scrambled pool of tiles containing the target letters
 * plus randomized decoy/distractor letters, ensuring that letters of the target word
 * do NOT follow each other consecutively in order.
 */
function generateScrambledTiles(word: string): string[] {
  const upperWord = word.toUpperCase();
  const wordLetters = upperWord.split('');

  // Target total tiles: minimum 10 tiles, or word length + 4 decoys
  const targetTotal = Math.max(10, wordLetters.length + 4);
  const neededDecoys = targetTotal - wordLetters.length;

  // Realistic decoy letters pool
  const distractorPool = ['A', 'E', 'R', 'S', 'T', 'L', 'N', 'M', 'D', 'C', 'P', 'G', 'H', 'B', 'O', 'K', 'I', 'U', 'F', 'W'];
  const decoys: string[] = [];
  for (let i = 0; i < neededDecoys; i++) {
    const randomChar = distractorPool[Math.floor(Math.random() * distractorPool.length)];
    decoys.push(randomChar);
  }

  const combined = [...wordLetters, ...decoys];
  let shuffled = shuffleArray(combined);

  // Guarantee that no 2 adjacent letters from the target word appear adjacent in the scramble
  for (let attempt = 0; attempt < 20; attempt++) {
    let hasConsecutive = false;
    for (let i = 0; i < shuffled.length - 1; i++) {
      const c1 = shuffled[i];
      const c2 = shuffled[i + 1];
      for (let w = 0; w < upperWord.length - 1; w++) {
        if (upperWord[w] === c1 && upperWord[w + 1] === c2) {
          hasConsecutive = true;
          break;
        }
      }
      if (hasConsecutive) break;
    }
    if (!hasConsecutive) break;
    shuffled = shuffleArray(combined);
  }

  return shuffled;
}

interface FilledSlot {
  char: string;
  tileIndex: number;
}

function GuessTheWordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRetake = searchParams.get('retake') === 'true';
  const levelParam = parseInt(searchParams.get('level') || '1', 10);
  const currentLevel = isNaN(levelParam) || levelParam < 1 ? 1 : Math.min(10, levelParam);

  const { isDark } = useTheme();
  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { addScore, addCoins, deductCoins } = useUserDetails();

  useEffect(() => {
    if (isInitialized && (!user || isGuest)) {
      openLoginModal('/guess-the-word', 'Please sign in to play Guess the Word, track your progress, and earn rewards.');
    }
  }, [isInitialized, user, isGuest]);

  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<GuessWordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTiles, setActiveTiles] = useState<string[]>([]);
  const [filledSlots, setFilledSlots] = useState<(FilledSlot | null)[]>([]);
  const [usedTileIndices, setUsedTileIndices] = useState<number[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [reviewQuestions, setReviewQuestions] = useState<any[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [insufficientModal, setInsufficientModal] = useState<{
    isOpen: boolean;
    requiredCoins: number;
    actionTitle: string;
  }>({ isOpen: false, requiredCoins: 5, actionTitle: '' });

  useEffect(() => {
    setMounted(true);
    let selected: GuessWordItem[] = [];

    // If retake is requested, restore the exact same question set from session cache
    if (isRetake) {
      try {
        const cached = sessionStorage.getItem(`elite_gtw_session_v3_lvl_${currentLevel}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            selected = parsed;
          }
        }
      } catch {
        // Fallback to fresh if cache read fails
      }
    }

    // Pick fresh words for this level and persist them
    if (selected.length === 0) {
      selected = getWordsForLevel(currentLevel, 5);
      try {
        sessionStorage.setItem(`elite_gtw_session_v3_lvl_${currentLevel}`, JSON.stringify(selected));
      } catch {
        // Ignore quota error
      }
    }

    setQuestions(selected);
    setCurrentIndex(0);
    setCorrectCount(0);
    setReviewQuestions([]);
    initQuestion(selected[0]);
  }, [isRetake, currentLevel]);

  const initQuestion = (item: GuessWordItem) => {
    if (!item) return;
    const tiles = generateScrambledTiles(item.word);
    setActiveTiles(tiles);
    setFilledSlots(new Array(item.word.length).fill(null));
    setUsedTileIndices([]);
    setIsAnswerCorrect(null);
  };

  const currentQ = questions[currentIndex] || questions[0];

  const handleTileClick = (letter: string, tileIndex: number) => {
    if (usedTileIndices.includes(tileIndex) || isAnswerCorrect !== null) return;
    soundManager.playClick();

    // Find the first available empty slot
    const firstEmptyIndex = filledSlots.findIndex((s) => s === null);
    if (firstEmptyIndex !== -1) {
      const nextSlots = [...filledSlots];
      nextSlots[firstEmptyIndex] = { char: letter, tileIndex };
      setFilledSlots(nextSlots);
      setUsedTileIndices([...usedTileIndices, tileIndex]);

      // Check if word is now fully filled
      const allFilled = nextSlots.every((s) => s !== null);
      if (allFilled) {
        const guessedWord = nextSlots.map((s) => s?.char || '').join('');
        const targetWord = currentQ.word.toUpperCase();

        if (guessedWord === targetWord) {
          soundManager.playCorrect();
          setIsAnswerCorrect(true);
          const newCorrect = correctCount + 1;
          setCorrectCount(newCorrect);
          addScore(20);
          addCoins(3);

          const record = {
            id: currentQ.id,
            category: '8',
            question: currentQ.clue,
            options: [{ id: 'opt1', title: currentQ.word.toUpperCase() }],
            correctAnswerOptionId: 'opt1',
            userAnswer: 'opt1',
            note: `Correct Word: ${currentQ.word.toUpperCase()}`,
          };
          const updatedReviews = [...reviewQuestions, record];
          setReviewQuestions(updatedReviews);

          setTimeout(() => {
            advanceToNext(newCorrect, updatedReviews);
          }, 1100);
        } else {
          soundManager.playWrong();
          setIsAnswerCorrect(false);
          // Auto clear after brief shake feedback
          setTimeout(() => {
            setIsAnswerCorrect(null);
            setFilledSlots(new Array(currentQ.word.length).fill(null));
            setUsedTileIndices([]);
          }, 850);
        }
      }
    }
  };

  const handleBoxClick = (slotIndex: number) => {
    if (isAnswerCorrect !== null) return;
    const slot = filledSlots[slotIndex];
    if (slot !== null) {
      soundManager.playClick();
      const nextSlots = [...filledSlots];
      nextSlots[slotIndex] = null;
      setFilledSlots(nextSlots);
      setUsedTileIndices(usedTileIndices.filter((idx) => idx !== slot.tileIndex));
    }
  };

  const handleClearAll = () => {
    if (isAnswerCorrect !== null) return;
    soundManager.playClick();
    setFilledSlots(new Array(currentQ.word.length).fill(null));
    setUsedTileIndices([]);
  };

  const handleHint = () => {
    if (isAnswerCorrect !== null) return;

    if (!deductCoins(5, 'Guess The Word Hint')) {
      setInsufficientModal({
        isOpen: true,
        requiredCoins: 5,
        actionTitle: 'reveal a hint letter',
      });
      return;
    }
    soundManager.playClick();

    const targetWord = currentQ.word.toUpperCase();
    const emptyIndices: number[] = [];
    filledSlots.forEach((slot, idx) => {
      if (slot === null || slot.char !== targetWord[idx]) {
        emptyIndices.push(idx);
      }
    });

    if (emptyIndices.length > 0) {
      const hintSlotIdx = emptyIndices[0];
      const targetChar = targetWord[hintSlotIdx];

      // Find an unused tile that has this targetChar
      const matchingTileIdx = activeTiles.findIndex(
        (t, idx) => t === targetChar && !usedTileIndices.includes(idx)
      );

      if (matchingTileIdx !== -1) {
        // If there was an incorrect character in this slot, return it to pool
        const existingSlot = filledSlots[hintSlotIdx];
        let newUsed = [...usedTileIndices];
        if (existingSlot !== null) {
          newUsed = newUsed.filter((idx) => idx !== existingSlot.tileIndex);
        }
        newUsed.push(matchingTileIdx);

        const nextSlots = [...filledSlots];
        nextSlots[hintSlotIdx] = { char: targetChar, tileIndex: matchingTileIdx };
        setFilledSlots(nextSlots);
        setUsedTileIndices(newUsed);

        // Check if word is now complete
        const allFilled = nextSlots.every((s) => s !== null);
        if (allFilled) {
          const guessedWord = nextSlots.map((s) => s?.char || '').join('');
          if (guessedWord === targetWord) {
            soundManager.playCorrect();
            setIsAnswerCorrect(true);
            const newCorrect = correctCount + 1;
            setCorrectCount(newCorrect);
            addScore(20);
            addCoins(3);

            const record = {
              id: currentQ.id,
              category: '8',
              question: currentQ.clue,
              options: [{ id: 'opt1', title: currentQ.word.toUpperCase() }],
              correctAnswerOptionId: 'opt1',
              userAnswer: 'opt1',
              note: `Correct Word: ${currentQ.word.toUpperCase()}`,
            };
            const updatedReviews = [...reviewQuestions, record];
            setReviewQuestions(updatedReviews);

            setTimeout(() => {
              advanceToNext(newCorrect, updatedReviews);
            }, 1100);
          }
        }
      }
    }
  };

  const handleSkipWord = () => {
    soundManager.playClick();

    const record = {
      id: currentQ.id,
      category: '8',
      question: currentQ.clue,
      options: [{ id: 'opt1', title: currentQ.word.toUpperCase() }],
      correctAnswerOptionId: 'opt1',
      userAnswer: 'skipped',
      note: `Skipped. Correct Word: ${currentQ.word.toUpperCase()}`,
    };
    const updatedReviews = [...reviewQuestions, record];
    setReviewQuestions(updatedReviews);

    advanceToNext(correctCount, updatedReviews);
  };

  const advanceToNext = (finalCorrect: number, allReviews: any[]) => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      initQuestion(questions[nextIdx]);
    } else {
      // Store session payload for review-answers
      try {
        const reviewPayload = {
          title: `Guess The Word - Level ${currentLevel}`,
          quizType: 'guessTheWord',
          questions: allReviews,
          userAnswers: allReviews.reduce((acc, r) => ({ ...acc, [r.id]: r.userAnswer }), {}),
          timestamp: Date.now(),
        };
        sessionStorage.setItem('elite_last_quiz_session', JSON.stringify(reviewPayload));
      } catch {
        // Ignore quota
      }

      const totalEarnedScore = finalCorrect * 20;
      const totalEarnedCoins = finalCorrect * 3;

      router.replace(
        `/result?total=${questions.length}&correct=${finalCorrect}&score=${totalEarnedScore}&coins=${totalEarnedCoins}&quizType=guessTheWord&level=${currentLevel}&title=${encodeURIComponent(
          `Guess The Word - Level ${currentLevel}`
        )}`
      );
    }
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';

  if (isInitialized && (!user || isGuest)) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col items-center justify-center p-6 text-center select-none`}>
        <div className={`w-full max-w-sm ${isDark ? 'bg-[#294261]' : 'bg-white'} rounded-[20px] p-6 shadow-xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} space-y-4`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
            <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
          </div>
          <div className="space-y-1.5">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#45536d]'}`}>Login Required</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Please sign in to play Guess the Word, track your progress, earn coins, and rank on the leaderboard!
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => router.push('/login?redirect=/guess-the-word')}
              className="w-full h-11 rounded-[10px] bg-gradient-to-r from-[#ef5388] to-[#f279a2] hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Sign In to Play
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted || !currentQ) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex items-center justify-center`}>
        <div className="w-10 h-10 border-4 border-[#ef5388]/30 border-t-[#ef5388] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-8 select-none`}>
      <QAppBar
        title={`Guess The Word - Level ${currentLevel}`}
        onBack={() => {
          soundManager.playClick();
          setShowExitModal(true);
        }}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearAll}
              className="p-1.5 rounded-full text-slate-400 hover:text-[#ef5388] transition-colors"
              title="Reset Letters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleHint}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 text-xs font-bold hover:opacity-80 transition-all active:scale-95"
              title="Reveal 1 Letter (5 Coins)"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Hint</span>
            </button>
          </div>
        }
      />

      <div className="max-w-md w-full mx-auto px-4 py-4 flex-1 flex flex-col justify-between space-y-6">
        {/* Progress & Category Banner */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span className="px-2.5 py-1 rounded-full bg-[#ef5388]/10 text-[#ef5388] dark:text-[#f279a2] uppercase tracking-wider">
            Level {currentLevel} of 10 • {currentQ.category}
          </span>
          <span>
            Word {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Clue Container */}
        <div className={`${surfaceBg} rounded-[16px] p-5 shadow-sm border ${cardBorder} text-center space-y-2`}>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ef5388] dark:text-[#f279a2]">
            Clue & Definition
          </span>
          <p className={`text-base sm:text-lg font-bold leading-relaxed ${textColor}`}>
            "{currentQ.clue}"
          </p>
        </div>

        {/* Word Answer Slots */}
        <div className="flex justify-center space-x-2 flex-wrap gap-y-2">
          {Array.from({ length: currentQ.word.length }).map((_, idx) => {
            const slot = filledSlots[idx];
            let slotBorder = 'border-slate-300 dark:border-slate-600';
            let slotBg = surfaceBg;

            if (isAnswerCorrect === true) {
              slotBorder = 'border-[#5DB760] bg-[#5DB760]/20 text-[#5DB760] scale-105';
            } else if (isAnswerCorrect === false) {
              slotBorder = 'border-[#FF6169] bg-[#FF6169]/20 text-[#FF6169] animate-bounce';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleBoxClick(idx)}
                className={`w-11 h-12 rounded-[12px] border-2 ${slotBorder} ${slotBg} flex items-center justify-center font-black text-xl shadow-sm transition-all active:scale-95`}
              >
                <span className={slot ? textColor : 'opacity-0'}>
                  {slot ? slot.char : ' '}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrambled Available Letters Pool */}
        <div className="space-y-3">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-2.5 max-w-sm mx-auto">
            {activeTiles.map((char, tileIdx) => {
              const isUsed = usedTileIndices.includes(tileIdx);
              return (
                <button
                  key={tileIdx}
                  type="button"
                  disabled={isUsed || isAnswerCorrect !== null}
                  onClick={() => handleTileClick(char, tileIdx)}
                  className={`aspect-square rounded-[12px] font-black text-base sm:text-lg shadow-sm flex items-center justify-center transition-all ${
                    isUsed
                      ? 'bg-black/5 dark:bg-white/5 text-transparent border border-transparent opacity-25 cursor-default'
                      : `${surfaceBg} ${textColor} border-2 border-slate-200 dark:border-slate-700 hover:border-[#ef5388] hover:scale-105 active:scale-90 cursor-pointer`
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleClearAll}
              className={`flex-1 h-11 rounded-[10px] ${surfaceBg} ${textColor} border ${cardBorder} font-bold text-xs hover:bg-black/5 dark:hover:bg-white/5 active:scale-98 transition-all`}
            >
              Clear Letters
            </button>
            <button
              onClick={handleSkipWord}
              className={`flex-1 h-11 rounded-[10px] ${surfaceBg} text-slate-400 border ${cardBorder} font-bold text-xs hover:text-slate-600 dark:hover:text-slate-200 active:scale-98 transition-all`}
            >
              Skip Word
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-2xl p-6 shadow-2xl space-y-4 border ${cardBorder} text-center`}>
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Frown className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${textColor}`}>Leave Word Puzzle?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to exit? Your progress in Level {currentLevel} will not be saved.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowExitModal(false);
                }}
                className="w-full h-11 rounded-[12px] bg-[#ef5388] text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all"
              >
                Continue Playing
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowExitModal(false);
                  router.push('/');
                }}
                className={`w-full h-11 rounded-[12px] text-xs font-bold transition-colors ${
                  isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Exit to Home
              </button>
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

export default function GuessTheWordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex items-center justify-center text-slate-400">Loading...</div>}>
      <GuessTheWordContent />
    </Suspense>
  );
}
