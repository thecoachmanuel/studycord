'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  Bookmark, 
  BookmarkCheck, 
  Play, 
  Pause, 
  Volume2, 
  Calculator, 
  BookOpen, 
  Check, 
  X, 
  FileText,
  MessageSquare,
  Trophy,
  Frown,
  Users
} from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QImage } from '../../components/common/QImage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserDetails } from '../../context/UserDetailsContext';
import { soundManager } from '../../lib/sound';
import { tr } from '../../lib/translations';
import { getQuestionsForQuizType, fetchQuestionsFromBackend } from '../../lib/api';
import { getLevelConfig, ECONOMY_RULES, formatQuestionText } from '../../lib/quizEngine';
import { PREDEFINED_MESSAGES } from '../../lib/constants';
import { Question } from '../../types';
import { getComprehensionByLevel } from '../../lib/comprehensionData';
import { InsufficientCoinsModal } from '../../components/common/InsufficientCoinsModal';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizType = searchParams.get('quizType') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const subId = searchParams.get('subId') || '';
  const levelParam = searchParams.get('level') || '1';
  const levelNum = parseInt(levelParam, 10) || 1;
  const levelConfig = useMemo(() => getLevelConfig(levelNum, 5), [levelNum]);
  const title = searchParams.get('title') || (
    quizType === 'trueAndFalse' ? tr('truefalse') :
    quizType === 'audioQuestions' ? tr('audioQuestions') :
    quizType === 'mathMania' ? tr('mathMania') :
    quizType === 'dailyQuiz' ? tr('dailyQuiz') :
    quizType === 'funAndLearn' ? tr('funAndLearn') :
    quizType === 'selfChallenge' ? tr('selfChallenge') :
    quizType === 'oneVsOneBattle' ? '1 vs 1 Battle' :
    quizType === 'groupPlay' ? 'Group Battle' :
    'Quiz'
  );

  const { user, isGuest, isInitialized, openLoginModal } = useAuth();
  const { isDark } = useTheme();
  const { deductCoins, addScore, addCoins, toggleBookmark, isBookmarked, recordBattleResult } = useUserDetails();

  const is1v1Battle = quizType === 'oneVsOneBattle';
  const isGroupBattle = quizType === 'groupPlay';
  const isBattle = is1v1Battle || isGroupBattle;
  const isRetake = searchParams.get('retake') === 'true';
  const isTrialAllowed = Boolean(isGuest && levelNum === 1 && !isBattle && quizType !== 'exam');

  useEffect(() => {
    if (isInitialized) {
      if (!user && !isGuest) {
        openLoginModal('/quiz', 'Please sign in to play this quiz, track your progress, and earn rewards.');
      } else if (isGuest && !isTrialAllowed) {
        openLoginModal(
          `/quiz?categoryId=${categoryId}&subId=${subId}&level=${levelParam}`,
          `Guest trial is limited to Level 1. Please sign in to play Level ${levelParam} and save your score to the leaderboard!`
        );
      }
    }
  }, [isInitialized, user, isGuest, isTrialAllowed, levelParam, categoryId, subId, openLoginModal]);

  // Battle Entry Fee Deduction (guarantees house margin; only deducts once for 1v1 battle)
  const battleEntryDeductedRef = useRef(false);
  useEffect(() => {
    if (is1v1Battle && !battleEntryDeductedRef.current) {
      battleEntryDeductedRef.current = true;
      deductCoins(ECONOMY_RULES.BATTLE_1V1_ENTRY, '1v1 Battle Entry Fee');
    }
  }, [is1v1Battle, deductCoins]);

  // Dynamic Battle State
  const opponent = useMemo(() => ({
    name: searchParams.get('oppName') || 'Sarah Connor',
    profile: searchParams.get('oppAvatar') || '/assets/config/profile/6.svg',
  }), [searchParams]);

  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentAnswerEffect, setOpponentAnswerEffect] = useState<'+20' | '+0' | null>(null);
  const [userBubble, setUserBubble] = useState<string | null>(null);
  const [opponentBubble, setOpponentBubble] = useState<string | null>(null);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | 'draw' | null>(null);

  // Group Battle Players (loaded from room lobby or fallback)
  const [groupOpponents, setGroupOpponents] = useState(() => {
    try {
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem('group_battle_players') : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const others = parsed.filter((p: any) => !p.isHost && p.name !== 'You (Host)');
          if (others.length > 0) return others;
        }
      }
    } catch {}
    return [
      { id: '2', name: 'Sarah Connor', score: 0, avatar: '/assets/config/profile/6.svg' },
      { id: '3', name: 'Liam Chen', score: 0, avatar: '/assets/config/profile/2.svg' },
      { id: '4', name: 'Maya Patel', score: 0, avatar: '/assets/config/profile/3.svg' },
    ];
  });

  // Load question dataset: Always fetch live from backend API with local cache recovery for retakes
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const cacheKey = `elite_quiz_cache_v3_${quizType || 'cat'}_${categoryId || '0'}_${subId || '0'}_${levelNum}`;
    
    if (isRetake) {
      try {
        const cachedRaw = sessionStorage.getItem(cacheKey);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (
            parsed &&
            Array.isArray(parsed.questions) &&
            parsed.questions.length > 0 &&
            String(parsed.categoryId || '') === String(categoryId || '') &&
            String(parsed.subId || '') === String(subId || '') &&
            String(parsed.level || '') === String(levelNum) &&
            String(parsed.quizType || '') === String(quizType || '')
          ) {
            setQuestions(parsed.questions);
            setLoadingQuestions(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to load retake quiz questions', err);
      }
    }

    const limitParam = parseInt(searchParams.get('limit') || '0', 10);
    const countToFetch = limitParam > 0 ? limitParam : (isBattle ? 10 : 5);

    setLoadingQuestions(true);
    fetchQuestionsFromBackend({
      quizType,
      categoryId,
      subcategoryId: subId || undefined,
      level: levelNum,
      count: countToFetch,
    }).then((fresh) => {
      if (isCancelled) return;
      setQuestions(fresh);
      setLoadingQuestions(false);

      try {
        const payload = {
          quizType: quizType || '',
          categoryId: categoryId || '',
          subId: subId || '',
          level: levelNum,
          title,
          questions: fresh,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('elite_last_quiz_session', JSON.stringify(payload));
        sessionStorage.setItem(cacheKey, JSON.stringify(payload));
      } catch {
        // Ignore quota errors
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [quizType, categoryId, levelNum, isRetake, subId, title, searchParams]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Audio Player State for Audio Questions
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fun & Learn Passage Modal
  const [showPassageModal, setShowPassageModal] = useState(false);

  // Lifelines state
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedAudiencePoll, setUsedAudiencePoll] = useState(false);
  const [usedResetTime, setUsedResetTime] = useState(false);
  const [usedSkip, setUsedSkip] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [pollPercentages, setPollPercentages] = useState<Record<string, number>>({});
  const [insufficientModal, setInsufficientModal] = useState<{
    isOpen: boolean;
    requiredCoins: number;
    actionTitle: string;
  }>({ isOpen: false, requiredCoins: 4, actionTitle: '' });

  // Dynamic Level-Scaled Timer & Point Stakes (Higher Level = Tougher & Faster)
  const timerMinutesParam = parseInt(searchParams.get('timerMinutes') || '0', 10);
  const DURATION = timerMinutesParam > 0
    ? Math.max(15, Math.floor((timerMinutesParam * 60) / (questions.length || 10)))
    : (isBattle ? 25 : levelConfig.durationSeconds);
  const pointsPerCorrect = isBattle ? 20 : levelConfig.pointsPerCorrect;
  const coinsReward = isBattle ? 0 : levelConfig.coinsReward;
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const isLastQuestion = questions.length > 0 && currentIndex === questions.length - 1;
  const isTrueFalse = quizType === 'trueAndFalse' || currentQ?.questionType === '2';
  const isAudioQuiz = quizType === 'audioQuestions' || Boolean(currentQ?.audio);
  const isMathQuiz = quizType === 'mathMania' || Boolean(currentQ?.mathEquation);

  // Opponent simulated answering for Battle Mode
  useEffect(() => {
    if (!isBattle || battleResult !== null) return;
    setOpponentAnswerEffect(null);

    const delay = Math.floor(Math.random() * 2000) + 2500;
    const oppTimer = setTimeout(() => {
      const isOppCorrect = Math.random() > 0.25;
      if (isOppCorrect) {
        setOpponentScore((s) => s + 20);
        setOpponentAnswerEffect('+20');
        if (isGroupBattle) {
          setGroupOpponents((prev) =>
            prev.map((p) => (p.id === '2' ? { ...p, score: p.score + 20 } : p))
          );
        }
      } else {
        setOpponentAnswerEffect('+0');
      }

      if (isGroupBattle) {
        setGroupOpponents((prev) =>
          prev.map((p) => {
            if (p.id !== '2' && Math.random() > 0.35) {
              return { ...p, score: p.score + 20 };
            }
            return p;
          })
        );
      }

      setTimeout(() => {
        setOpponentAnswerEffect(null);
      }, 1500);
    }, delay);

    return () => clearTimeout(oppTimer);
  }, [currentIndex, isBattle, isGroupBattle, battleResult]);

  const handleSendMessage = (msg: string) => {
    soundManager.playClick();
    setUserBubble(msg);
    setShowChatDrawer(false);

    setTimeout(() => {
      setUserBubble(null);
    }, 2800);

    setTimeout(() => {
      const replies = ['Good luck!', 'Well played', 'Hurry Up', 'What a performance..!!', 'Thanks..'];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setOpponentBubble(reply);
      setTimeout(() => {
        setOpponentBubble(null);
      }, 2800);
    }, 2000);
  };

  const hasAnsweredRef = useRef(false);
  const isAdvancingRef = useRef(false);

  // Reset audio & start countdown timer once questions are loaded and for each question change
  useEffect(() => {
    if (loadingQuestions || questions.length === 0 || !currentQ) return;

    setTimeLeft(DURATION);
    setSelectedOptionId(null);
    setHasAnswered(false);
    hasAnsweredRef.current = false;
    isAdvancingRef.current = false;
    setHiddenOptions([]);
    setPollPercentages({});
    setShowAudienceModal(false);
    setIsPlayingAudio(false);
    setAudioProgress(0);

    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [currentIndex, loadingQuestions, DURATION]);

  const toggleAudio = () => {
    soundManager.playClick();
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    } else {
      setIsPlayingAudio(true);
      // Play audio sample with Web Audio acoustic synthesis and fallback
      const sampleKey = currentQ?.audio || currentQ?.id || '';
      soundManager.playAudioSample(sampleKey);

      // Try playing file if available as secondary
      if (currentQ?.audio && typeof Audio !== 'undefined') {
        try {
          const a = new Audio(currentQ.audio);
          a.volume = 0.85;
          a.play().catch(() => {});
        } catch {
          // Handled by Web Audio
        }
      }

      // Animate progress smoothly
      setAudioProgress(0);
      let p = 0;
      audioIntervalRef.current = setInterval(() => {
        p += 5;
        setAudioProgress(p);
        if (p >= 100) {
          clearInterval(audioIntervalRef.current!);
          setIsPlayingAudio(false);
          setAudioProgress(0);
        }
      }, 150);
    }
  };

  const handleTimeOut = () => {
    if (isAdvancingRef.current) return;

    if (!hasAnsweredRef.current) {
      // User did not select any option before time elapsed: mark timed out
      setHasAnswered(true);
      hasAnsweredRef.current = true;
      setWrongCount((w) => w + 1);
      soundManager.playWrong();
      soundManager.vibrate(80);

      // Highlight the correct answer briefly (1000ms) then automatically take to next question
      setTimeout(() => {
        if (!isAdvancingRef.current) {
          goToNext(false);
        }
      }, 1000);
    } else {
      // User already clicked an option, ensure auto-advance proceeds
      setTimeout(() => {
        if (!isAdvancingRef.current) {
          goToNext();
        }
      }, 300);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (hasAnsweredRef.current || isAdvancingRef.current || !currentQ) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    setIsPlayingAudio(false);

    setSelectedOptionId(optionId);
    setHasAnswered(true);
    hasAnsweredRef.current = true;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));

    const isCorrect = optionId === currentQ.correctAnswerOptionId;
    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.vibrate(40);
      setScoreCount((s) => s + pointsPerCorrect);
      setCorrectCount((c) => c + 1);
      addScore(pointsPerCorrect);
    } else {
      soundManager.playWrong();
      soundManager.vibrate(80);
      setWrongCount((w) => w + 1);
    }

    // Automatically advance to next question after feedback
    setTimeout(() => {
      if (!isAdvancingRef.current) {
        goToNext(isCorrect);
      }
    }, 1200);
  };

  const goToNext = (wasCorrect?: boolean) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isLastQuestion) {
      const finalCorrect = wasCorrect ? correctCount + 1 : correctCount;
      const finalScore = wasCorrect ? scoreCount + pointsPerCorrect : scoreCount;
      const finalCoins = coinsReward > 0 ? finalCorrect * coinsReward : 0;

      // Persist full completed session so retakes and review answers load identical questions
      try {
        const completedSession = {
          quizType,
          categoryId,
          subId,
          level: levelNum,
          title,
          questions,
          userAnswers: { ...userAnswers, ...(currentQ ? { [currentQ.id]: selectedOptionId || '' } : {}) },
          score: finalScore,
          correctCount: finalCorrect,
          totalCount: questions.length,
          coins: finalCoins,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('elite_last_quiz_session', JSON.stringify(completedSession));
        const cacheKey = `elite_quiz_cache_${quizType || 'cat'}_${categoryId || '0'}_${levelNum}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(completedSession));
      } catch {
        // Ignore storage errors
      }

      if (isBattle) {
        let res: 'win' | 'lose' | 'draw' = 'draw';
        const isGroup = quizType === 'groupPlay';
        const entryFee = parseInt(searchParams.get('entryCoins') || '20', 10);
        const groupPot = entryFee * 4;
        const winnerCoins = Math.floor(groupPot * 0.9); // 10% platform fee retained

        if (finalScore > opponentScore) {
          res = 'win';
          if (isGroup) {
            addCoins(winnerCoins, `Group Battle Victory (+${winnerCoins} Coins)`);
            addScore(finalScore);
          } else {
            recordBattleResult(true);
          }
          soundManager.playCorrect();
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.5 },
            colors: ['#FFD700', '#5DB760', '#ef5388'],
          });
        } else if (finalScore < opponentScore) {
          res = 'lose';
          recordBattleResult(false);
          soundManager.playWrong();
        } else {
          res = 'draw';
          recordBattleResult(false, true);
        }
        setBattleResult(res);
        return;
      }

      router.replace(
        `/result?total=${questions.length}&correct=${finalCorrect}&score=${finalScore}&coins=${finalCoins}&level=${levelNum}&categoryId=${categoryId}&subId=${subId}&quizType=${encodeURIComponent(
          quizType
        )}&title=${encodeURIComponent(title)}`
      );
    } else {
      setPollPercentages({});
      setShowAudienceModal(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Lifelines: Each deducts 4 coins, burning coins to power platform economy
  const handleFiftyFifty = () => {
    if (usedFiftyFifty || hasAnswered || isTrueFalse) return;
    if (!deductCoins(ECONOMY_RULES.LIFELINE_FIFTY_FIFTY_COST, '50/50 Lifeline')) {
      soundManager.playWrong();
      setInsufficientModal({
        isOpen: true,
        requiredCoins: ECONOMY_RULES.LIFELINE_FIFTY_FIFTY_COST,
        actionTitle: 'use the 50:50 lifeline',
      });
      return;
    }
    soundManager.playClick();
    setUsedFiftyFifty(true);

    // Hide 2 incorrect options
    const incorrect = currentQ.options.filter((o) => o.id !== currentQ.correctAnswerOptionId);
    const toHide = incorrect.slice(0, 2).map((o) => o.id);
    setHiddenOptions(toHide);
  };

  const handleAudiencePoll = () => {
    if (usedAudiencePoll || hasAnswered) return;
    if (!deductCoins(ECONOMY_RULES.LIFELINE_AUDIENCE_POLL_COST, 'Audience Poll Lifeline')) {
      soundManager.playWrong();
      setInsufficientModal({
        isOpen: true,
        requiredCoins: ECONOMY_RULES.LIFELINE_AUDIENCE_POLL_COST,
        actionTitle: 'use the Audience Poll lifeline',
      });
      return;
    }
    soundManager.playClick();
    setUsedAudiencePoll(true);

    const p: Record<string, number> = {};
    const correctId = currentQ.correctAnswerOptionId;
    p[correctId] = 72;
    const rest = currentQ.options.filter((o) => o.id !== correctId);
    if (rest.length === 3) {
      p[rest[0].id] = 12;
      p[rest[1].id] = 10;
      p[rest[2].id] = 6;
    } else if (rest.length === 1) {
      p[rest[0].id] = 28;
    }
    setPollPercentages(p);
    setShowAudienceModal(true);
  };

  const handleResetTime = () => {
    if (usedResetTime || hasAnswered) return;
    if (!deductCoins(ECONOMY_RULES.LIFELINE_RESET_TIME_COST, 'Reset Time Lifeline')) {
      soundManager.playWrong();
      setInsufficientModal({
        isOpen: true,
        requiredCoins: ECONOMY_RULES.LIFELINE_RESET_TIME_COST,
        actionTitle: 'reset the timer',
      });
      return;
    }
    soundManager.playClick();
    setUsedResetTime(true);
    setTimeLeft(DURATION);
  };

  const handleSkip = () => {
    if (usedSkip || hasAnswered) return;
    if (!deductCoins(ECONOMY_RULES.LIFELINE_SKIP_COST, 'Skip Question Lifeline')) {
      soundManager.playWrong();
      setInsufficientModal({
        isOpen: true,
        requiredCoins: ECONOMY_RULES.LIFELINE_SKIP_COST,
        actionTitle: 'skip this question',
      });
      return;
    }
    soundManager.playClick();
    setUsedSkip(true);
    goToNext();
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700/60' : 'border-slate-100';
  const isHurry = timeLeft <= 5;
  const timerColor = isHurry ? '#FF6169' : '#ef5388';

  if (isInitialized && (!user || isGuest) && !isTrialAllowed) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col items-center justify-center p-6 text-center select-none`}>
        <div className={`w-full max-w-sm ${isDark ? 'bg-[#294261]' : 'bg-white'} rounded-[20px] p-6 shadow-xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} space-y-4`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef5388]/15 to-purple-500/15 mx-auto flex items-center justify-center p-3.5 shadow-inner">
            <QImage imageUrl="/assets/images/login_acc.svg" width={52} height={52} alt="Login Required" />
          </div>
          <div className="space-y-1.5">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#45536d]'}`}>Login Required</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isGuest
                ? `Guest trial is only available for Level 1. Please sign in to play Level ${levelParam}, earn coins, and rank on the leaderboard!`
                : 'Please sign in to play this quiz, track your progress, earn coins, and rank on the leaderboard!'}
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => router.push('/login')}
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

  if (!mounted || questions.length === 0 || !currentQ || loadingQuestions) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col items-center justify-center select-none gap-3`}>
        <div className="w-10 h-10 border-4 border-[#ef5388]/30 border-t-[#ef5388] rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-wide text-slate-400">Loading questions from server...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col justify-between pb-6 select-none`}>
      {/* App Bar */}
      <QAppBar
        title={title}
        onBack={() => {
          soundManager.playClick();
          setShowExitModal(true);
        }}
        actions={
          <div className="flex items-center space-x-1">
            {isBattle && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowChatDrawer(true);
                }}
                className="p-2 text-slate-400 hover:text-[#ef5388] transition-colors relative"
                title="In-Battle Quick Chat"
              >
                <MessageSquare className="w-5 h-5 text-[#ef5388] dark:text-[#f279a2]" />
              </button>
            )}
            {(currentQ?.passage || quizType === 'funAndLearn') && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowPassageModal(true);
                }}
                className="p-2 text-slate-400 hover:text-[#ef5388] transition-colors"
                title="View Reading Passage"
              >
                <BookOpen className="w-5 h-5 text-[#ef5388]" />
              </button>
            )}
            <button
              onClick={() => {
                soundManager.playClick();
                toggleBookmark(currentQ);
              }}
              className="p-2 text-slate-400 hover:text-[#ef5388] transition-colors"
              title="Bookmark"
            >
              {isBookmarked(currentQ.id) ? (
                <BookmarkCheck className="w-5 h-5 text-[#ef5388]" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        }
      />

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 flex flex-col justify-between py-4 space-y-4">

        {/* Reading Passage Quick Reference Banner for Fun & Learn */}
        {quizType === 'funAndLearn' && (
          <div
            onClick={() => {
              soundManager.playClick();
              setShowPassageModal(true);
            }}
            className={`w-full py-2.5 px-4 rounded-xl ${surfaceBg} border-2 border-[#ef5388]/30 hover:border-[#ef5388] shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all`}
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-[#ef5388] dark:text-[#f279a2]">
              <BookOpen className="w-4 h-4" />
              <span>Reference Reading Passage</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 hover:text-[#ef5388]">Tap to Read 📖</span>
          </div>
        )}
        {/* ============================================================== */}
        {/* TOP BAR: 1v1 BATTLE / GROUP BATTLE / STANDARD SOLO QUIZ        */}
        {/* ============================================================== */}
        {is1v1Battle ? (
          /* 1 VS 1 Head-to-Head Battle Container */
          <div className={`w-full ${surfaceBg} rounded-2xl p-3 shadow-md border ${cardBorder} flex items-center justify-between relative`}>
            {/* User Details (Left) */}
            <div className="flex items-center space-x-2.5 relative">
              {userBubble && (
                <div className="absolute -top-9 left-0 bg-[#ef5388] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg animate-in zoom-in-95 duration-150 z-20 whitespace-nowrap">
                  {userBubble}
                </div>
              )}
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#ef5388] p-0.5 overflow-hidden">
                  <QImage imageUrl={user?.profileUrl || '/assets/config/profile/1.svg'} width={44} height={44} circular />
                </div>
              </div>
              <div>
                <span className={`font-bold text-xs truncate max-w-[85px] block ${textColor}`}>
                  {user?.name || 'You'}
                </span>
                <span className="text-xs font-black text-emerald-500">
                  {scoreCount} Pts
                </span>
              </div>
            </div>

            {/* VS Circle + Circular Timer (Center) */}
            <div className="flex flex-col items-center">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="3" fill="none" />
                  <circle
                    cx="22" cy="22" r="18"
                    stroke={timerColor} strokeWidth="3"
                    strokeDasharray="113.1"
                    strokeDashoffset={113.1 - (113.1 * timeLeft) / DURATION}
                    strokeLinecap="round" fill="none"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <span style={{ color: timerColor }} className="absolute font-black text-xs">
                  {timeLeft}s
                </span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                VS
              </span>
            </div>

            {/* Opponent Details (Right) */}
            <div className="flex items-center space-x-2.5 text-right relative">
              {opponentBubble && (
                <div className="absolute -top-9 right-0 bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg animate-in zoom-in-95 duration-150 z-20 whitespace-nowrap">
                  {opponentBubble}
                </div>
              )}
              <div>
                <span className={`font-bold text-xs truncate max-w-[85px] block ${textColor}`}>
                  {opponent.name}
                </span>
                <div className="flex items-center justify-end space-x-1">
                  {opponentAnswerEffect && (
                    <span className={`text-[10px] font-black ${opponentAnswerEffect === '+20' ? 'text-emerald-500 animate-bounce' : 'text-rose-500'}`}>
                      {opponentAnswerEffect}
                    </span>
                  )}
                  <span className="text-xs font-black text-indigo-500">
                    {opponentScore} Pts
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-400 p-0.5 overflow-hidden">
                  <QImage imageUrl={opponent.profile} width={44} height={44} circular />
                </div>
              </div>
            </div>
          </div>
        ) : isGroupBattle ? (
          /* Group Battle 4-Player Lobby Bar */
          <div className={`w-full ${surfaceBg} rounded-2xl p-3 shadow-md border ${cardBorder} space-y-2`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span className="flex items-center space-x-1.5 text-[#ef5388]">
                <Users className="w-4 h-4" />
                <span>Group Battle Lobby</span>
              </span>
              <span className="text-[#ef5388] font-black">{timeLeft}s</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-center border border-[#ef5388]/30">
                <span className={`text-[11px] font-bold block truncate ${textColor}`}>You</span>
                <span className="text-xs font-black text-emerald-500">{scoreCount}</span>
              </div>
              {groupOpponents.map((p) => (
                <div key={p.id} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-center">
                  <span className="text-[11px] font-bold block truncate text-slate-400">{p.name}</span>
                  <span className="text-xs font-black text-indigo-500">{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Standard Solo Question Counter & Circular Countdown Timer */
          <div className="flex items-center justify-between px-2">
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-2xl font-black ${textColor}`}>
                {currentIndex + 1}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {questions.length}
              </span>
              {quizType === 'dailyQuiz' && (
                <span className="ml-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  2x Streak
                </span>
              )}
              {quizType === 'mathMania' && (
                <span className="ml-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Math Mode
                </span>
              )}
            </div>

            {/* Circular Timer (TextCircularTimer in Flutter) */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  className="stroke-slate-200 dark:stroke-slate-700"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke={timerColor}
                  strokeWidth="4"
                  strokeDasharray="113.1"
                  strokeDashoffset={113.1 - (113.1 * timeLeft) / DURATION}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span
                style={{ color: timerColor }}
                className={`absolute font-extrabold text-sm ${isHurry ? 'animate-ping' : ''}`}
              >
                {timeLeft}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* AUDIO QUESTION CONTAINER (Flutter AudioQuestionContainer)       */}
        {/* ============================================================== */}
        {isAudioQuiz && (
          <div className={`w-full ${surfaceBg} rounded-2xl p-4 shadow-sm border ${cardBorder} flex flex-col space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#ef5388] dark:text-[#f279a2]">
                <Volume2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Audio Question Track</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {isPlayingAudio ? 'Playing Sound...' : 'Click Play to Listen'}
              </span>
            </div>

            {/* Waveform Player Bar */}
            <div className="flex items-center space-x-3.5 bg-black/5 dark:bg-white/5 p-3 rounded-xl">
              <button
                onClick={toggleAudio}
                className="w-12 h-12 rounded-xl bg-[#ef5388] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Audio Track #{currentIndex + 1}</span>
                  <span>{isPlayingAudio ? `${Math.round(audioProgress)}%` : '00:15'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-[#ef5388] rounded-full transition-all duration-150"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MATH MANIA FORMULA CONTAINER                                  */}
        {/* ============================================================== */}
        {isMathQuiz && currentQ?.mathEquation && (
          <div className={`w-full ${surfaceBg} rounded-2xl p-5 shadow-sm border ${cardBorder} text-center space-y-2`}>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ef5388] dark:text-[#f279a2]">
              Mathematical Equation
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-black text-[#ef5388] dark:text-[#f279a2] bg-black/5 dark:bg-white/5 py-3 px-4 rounded-xl border border-black/5 dark:border-white/5">
              {currentQ.mathEquation}
            </div>
          </div>
        )}

        {/* Question Text Box */}
        <div className={`w-full ${surfaceBg} rounded-[10px] p-5 shadow-sm border border-black/5 dark:border-white/5 flex flex-col items-center justify-center min-h-[120px] text-center transition-colors`}>
          <p className={`font-semibold text-lg leading-relaxed ${textColor}`}>
            {formatQuestionText(currentQ.question)}
          </p>
        </div>

        {/* ============================================================== */}
        {/* TRUE & FALSE SPECIFIC UI (2 Large Interactive Buttons)         */}
        {/* ============================================================== */}
        {isTrueFalse ? (
          <div className="w-full grid grid-cols-2 gap-4 py-2">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.id === currentQ.correctAnswerOptionId;
              const isTrueBtn = opt.title.toLowerCase().includes('true');

              let btnBg = surfaceBg;
              let btnTextColor = isTrueBtn ? 'text-emerald-500' : 'text-rose-500';
              let borderColor = isTrueBtn ? 'border-emerald-500/30' : 'border-rose-500/30';

              if (hasAnswered) {
                if (isCorrect) {
                  btnBg = 'bg-[#5DB760] text-white border-[#5DB760]';
                  btnTextColor = 'text-white';
                } else if (isSelected) {
                  btnBg = 'bg-[#FF6169] text-white border-[#FF6169] animate-haptic-shake';
                  btnTextColor = 'text-white';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasAnswered}
                  className={`h-28 rounded-2xl border-2 ${btnBg} ${borderColor} shadow-md flex flex-col items-center justify-center space-y-2 transition-all active:scale-[0.98] disabled:cursor-default`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasAnswered && (isCorrect || isSelected) ? 'bg-white/20 text-white' : isTrueBtn ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {isTrueBtn ? <Check className="w-6 h-6 stroke-[3]" /> : <X className="w-6 h-6 stroke-[3]" />}
                  </div>
                  <span className={`text-lg font-black tracking-wide ${btnTextColor}`}>
                    {opt.title.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Standard 4-Option Multiple Choice Layout */
          <div className="w-full space-y-3">
            {currentQ.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i); // A, B, C, D
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.id === currentQ.correctAnswerOptionId;
              const isHidden = hiddenOptions.includes(opt.id);

              if (isHidden) {
                return (
                  <div
                    key={opt.id}
                    className="w-full h-14 rounded-[10px] border border-dashed border-slate-300 dark:border-slate-700 opacity-20 pointer-events-none"
                  />
                );
              }

              let optionBg = surfaceBg;
              let optionTextColor = textColor;
              let optionBorder = 'border-transparent';

              if (hasAnswered) {
                if (isCorrect) {
                  optionBg = 'bg-[#5DB760]';
                  optionTextColor = 'text-white';
                } else if (isSelected) {
                  optionBg = 'bg-[#FF6169] animate-haptic-shake';
                  optionTextColor = 'text-white';
                }
              } else if (isSelected) {
                optionBg = isDark ? 'bg-[#f279a2]' : 'bg-[#ef5388]';
                optionTextColor = 'text-white';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasAnswered}
                  className={`w-full min-h-[56px] px-4 py-3 rounded-[10px] flex items-center justify-between ${optionBg} ${optionBorder} shadow-sm transition-all duration-150 active:scale-[0.99] disabled:cursor-default`}
                >
                  <div className="flex items-center space-x-3.5 text-left">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        hasAnswered && (isCorrect || isSelected)
                          ? 'bg-white/20 text-white'
                          : 'bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className={`text-base font-medium ${optionTextColor}`}>
                      {opt.title}
                    </span>
                  </div>

                  {pollPercentages[opt.id] !== undefined && (
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-black/10 dark:bg-white/20">
                      {pollPercentages[opt.id]}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Lifelines Bar OR In-Battle Quick Chat Launcher */}
        <div className="pt-2">
          {isBattle ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowChatDrawer(true);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#ef5388] text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send In-Battle Quick Message</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-around px-2 max-w-sm mx-auto">
              {/* 50/50 (Hidden on True & False) */}
              {!isTrueFalse && (
                <button
                  onClick={handleFiftyFifty}
                  disabled={usedFiftyFifty || hasAnswered}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                    usedFiftyFifty ? 'opacity-30 line-through' : 'active:scale-90 hover:opacity-80'
                  }`}
                  title="50/50 Lifeline (Cost: 4 coins)"
                >
                  <div className="w-12 h-12 rounded-[10px] bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center p-2.5 shadow-sm">
                    <QImage
                      imageUrl="/assets/images/lifeline_fiftyfifty.svg"
                      width={24}
                      height={24}
                      color={isDark ? '#f279a2' : '#ef5388'}
                      alt="50/50"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">50/50</span>
                </button>
              )}

              {/* Audience Poll (Hidden on True & False) */}
              {!isTrueFalse && (
                <button
                  onClick={handleAudiencePoll}
                  disabled={usedAudiencePoll || hasAnswered}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                    usedAudiencePoll ? 'opacity-30 line-through' : 'active:scale-90 hover:opacity-80'
                  }`}
                  title="Audience Poll (Cost: 4 coins)"
                >
                  <div className="w-12 h-12 rounded-[10px] bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center p-2.5 shadow-sm">
                    <QImage
                      imageUrl="/assets/images/lifeline_audiencepoll.svg"
                      width={24}
                      height={24}
                      color={isDark ? '#f279a2' : '#ef5388'}
                      alt="Poll"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">Poll</span>
                </button>
              )}

              {/* Reset Time */}
              <button
                onClick={handleResetTime}
                disabled={usedResetTime || hasAnswered}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                  usedResetTime ? 'opacity-30 line-through' : 'active:scale-90 hover:opacity-80'
                }`}
                title="Reset Timer (Cost: 4 coins)"
              >
                <div className="w-12 h-12 rounded-[10px] bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center p-2.5 shadow-sm">
                  <QImage
                    imageUrl="/assets/images/lifeline_resettime.svg"
                    width={24}
                    height={24}
                    color={isDark ? '#f279a2' : '#ef5388'}
                    alt="Reset"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Reset</span>
              </button>

              {/* Skip */}
              <button
                onClick={handleSkip}
                disabled={usedSkip || hasAnswered}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                  usedSkip ? 'opacity-30 line-through' : 'active:scale-90 hover:opacity-80'
                }`}
                title="Skip Question (Cost: 4 coins)"
              >
                <div className="w-12 h-12 rounded-[10px] bg-[#ef5388]/10 dark:bg-[#f279a2]/15 flex items-center justify-center p-2.5 shadow-sm">
                  <QImage
                    imageUrl="/assets/images/lifeline_skip.svg"
                    width={24}
                    height={24}
                    color={isDark ? '#f279a2' : '#ef5388'}
                    alt="Skip"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Skip</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Audience Poll Modal */}
      {showAudienceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-[20px] p-6 shadow-2xl text-center space-y-4 border ${cardBorder}`}>
            <h3 className={`text-lg font-bold ${textColor}`}>Audience Poll Results</h3>
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt) => {
                const pct = pollPercentages[opt.id] || 0;
                return (
                  <div key={opt.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={textColor}>{opt.title}</span>
                      <span className="text-[#ef5388] font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-[#ef5388] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowAudienceModal(false)}
              className="w-full h-11 text-sm font-bold text-white bg-[#ef5388] rounded-[10px] mt-4"
            >
              Continue Quiz
            </button>
          </div>
        </div>
      )}

      {/* Fun & Learn Passage Modal */}
      {showPassageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className={`w-full max-w-lg ${surfaceBg} rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border ${cardBorder}`}>
            <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/5">
              <div className="flex items-center space-x-2 text-[#ef5388]">
                <BookOpen className="w-5 h-5" />
                <h3 className={`font-bold text-base ${textColor}`}>
                  {quizType === 'funAndLearn' ? getComprehensionByLevel(levelNum).title : 'Reading Passage'}
                </h3>
              </div>
              <button
                onClick={() => setShowPassageModal(false)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className={`text-sm sm:text-base leading-relaxed ${textColor} opacity-95 space-y-3 font-serif`}>
              {(quizType === 'funAndLearn' ? getComprehensionByLevel(levelNum).passageText : currentQ?.passage || '').split('\n\n').map((para, i) => (
                <p key={i} className="leading-6">
                  {para}
                </p>
              ))}
            </div>
            <button
              onClick={() => setShowPassageModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#ef5388] text-white font-bold text-xs shadow-sm hover:opacity-95"
            >
              Back to Question
            </button>
          </div>
        </div>
      )}

      {/* Quick In-Battle Messages Drawer */}
      {showChatDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-t-[24px] sm:rounded-[24px] p-5 shadow-2xl space-y-3 border ${cardBorder}`}>
            <div className="flex items-center justify-between border-b pb-2.5 border-black/5 dark:border-white/5">
              <span className={`text-sm font-bold ${textColor}`}>In-Battle Quick Messages</span>
              <button onClick={() => setShowChatDrawer(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {PREDEFINED_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(msg)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                    isDark ? 'bg-slate-800 hover:bg-[#ef5388] text-slate-200 hover:text-white' : 'bg-slate-100 hover:bg-[#ef5388] text-slate-700 hover:text-white'
                  }`}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Battle Victory / Defeat Modal */}
      {battleResult && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-[24px] p-6 shadow-2xl text-center space-y-5 border ${cardBorder}`}>
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg p-3 bg-amber-500/10">
              {battleResult === 'win' ? (
                <Trophy className="w-12 h-12 text-amber-500 stroke-[2.5]" />
              ) : battleResult === 'lose' ? (
                <Frown className="w-12 h-12 text-rose-500 stroke-[2.5]" />
              ) : (
                <Trophy className="w-12 h-12 text-indigo-500 stroke-[2.5]" />
              )}
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Battle Room Completed
              </span>
              <h3 className={`text-2xl font-black mt-1 ${battleResult === 'win' ? 'text-emerald-500' : battleResult === 'lose' ? 'text-rose-500' : 'text-indigo-500'}`}>
                {battleResult === 'win' ? 'VICTORY! YOU WON!' : battleResult === 'lose' ? 'DEFEAT' : 'TIED MATCH!'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {battleResult === 'win'
                  ? 'Congratulations! You outperformed your opponent and claimed the coin pot.'
                  : battleResult === 'lose'
                  ? 'Great effort! Your opponent was a bit faster this round.'
                  : 'An evenly matched intellectual showdown!'}
              </p>
            </div>

            {/* Score Comparison Card */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
              <div className="text-center">
                <span className="text-[11px] font-bold text-slate-400 block truncate">Your Score</span>
                <span className="text-xl font-black text-emerald-500">{scoreCount}</span>
              </div>
              <div className="text-center border-l border-black/10 dark:border-white/10">
                <span className="text-[11px] font-bold text-slate-400 block truncate">{opponent.name}</span>
                <span className="text-xl font-black text-indigo-500">{opponentScore}</span>
              </div>
            </div>

            {battleResult === 'win' && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-500 font-bold text-xs">
                <span>
                  Won +{isGroupBattle ? Math.floor(parseInt(searchParams.get('entryCoins') || '20', 10) * 4 * 0.9) : ECONOMY_RULES.BATTLE_1V1_WIN_REWARD} Coins Pot Prize!
                </span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentIndex(0);
                  setScoreCount(0);
                  setOpponentScore(0);
                  setBattleResult(null);
                  setTimeLeft(DURATION);
                }}
                className="w-full h-11 rounded-[12px] bg-[#ef5388] text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-98 transition-all"
              >
                Play Again / Rematch
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  router.replace('/');
                }}
                className={`w-full h-11 rounded-[12px] text-sm font-semibold transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Leave Battle Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-2xl p-6 shadow-2xl space-y-4 border ${cardBorder} text-center`}>
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Frown className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${textColor}`}>Quit Quiz Session?</h3>
              <p className="text-xs text-slate-400 mt-1">
                {isBattle
                  ? 'Leaving an active battle counts as a forfeit and your entry fee cannot be refunded.'
                  : 'Are you sure you want to exit? Your progress in this round will not be saved.'}
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
                Continue Quiz
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowExitModal(false);
                  if (quizType === 'funAndLearn') {
                    router.push('/fun-and-learn');
                  } else if (quizType === 'guessTheWord') {
                    router.push('/guess-the-word');
                  } else if (quizType === 'oneVsOneBattle' || quizType === 'groupPlay') {
                    router.push('/battle');
                  } else if (categoryId) {
                    router.push(subId ? `/levels?categoryId=${categoryId}&subId=${subId}` : `/levels?categoryId=${categoryId}`);
                  } else {
                    if (typeof window !== 'undefined' && window.history.length > 1) {
                      router.back();
                    } else {
                      router.push('/');
                    }
                  }
                }}
                className={`w-full h-11 rounded-[12px] text-xs font-bold transition-colors ${
                  isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Quit and Leave
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

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f7fa] dark:bg-[#233354] flex items-center justify-center text-slate-400">Loading...</div>}>
      <QuizContent />
    </Suspense>
  );
}

