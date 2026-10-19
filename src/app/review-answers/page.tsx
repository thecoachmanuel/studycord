'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Info, Flag } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QButton } from '../../components/common/QButton';
import { useTheme } from '../../context/ThemeContext';
import { Question, AnswerOption } from '../../types';
import { tr } from '../../lib/translations';
import { soundManager } from '../../lib/sound';
import { formatQuestionText } from '../../lib/quizEngine';

export default function ReviewAnswersPage() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [sessionTitle, setSessionTitle] = useState('');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('elite_last_quiz_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.questions && parsed.questions.length > 0) {
          setQuestions(parsed.questions);
        }
        if (parsed.userAnswers) {
          setUserAnswers(parsed.userAnswers);
        }
        if (parsed.title) {
          setSessionTitle(parsed.title);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const [reportingQuestion, setReportingQuestion] = useState<Question | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleOpenReport = (q: Question) => {
    soundManager.playClick();
    setReportingQuestion(q);
    setReportReason('');
    setReportSubmitted(false);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim() || !reportingQuestion) return;
    soundManager.playCorrect();
    soundManager.vibrate(40);

    // Send report to backend database
    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: reportingQuestion.id,
        message: reportReason,
        user_id: '101',
      }),
    }).catch(() => {});

    setReportSubmitted(true);
    setTimeout(() => {
      setReportingQuestion(null);
      setReportSubmitted(false);
      setReportReason('');
    }, 1600);
  };

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-10 select-none`}>
      <QAppBar title={sessionTitle ? `${sessionTitle} - Review` : tr('reviewAnswerLbl')} onBack={() => router.back()} />

      <div className="flex-1 max-w-md w-full mx-auto px-4 py-6 space-y-6">
        {questions.length === 0 ? (
          <div className={`w-full ${surfaceBg} rounded-[10px] p-8 text-center shadow-sm border ${cardBorder} space-y-4`}>
            <p className={`font-semibold ${textColor}`}>No review questions found</p>
            <QButton onClick={() => router.push('/')}>Explore Quizzes</QButton>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={q.id}
              className={`w-full ${surfaceBg} rounded-[10px] p-5 shadow-sm border ${cardBorder} space-y-4`}
            >
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ef5388] dark:text-[#f279a2]">
                Question {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleOpenReport(q)}
                className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-[#ef5388] transition-colors"
                title="Report Inaccurate Question"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>

            {/* Reading Passage if applicable */}
            {q.passage && (
              <div className="p-3 rounded-[8px] bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                <span className="font-bold block mb-1 text-[#ef5388]">Reference Passage:</span>
                {q.passage}
              </div>
            )}

            {/* Question Text */}
            <h3 className={`font-semibold text-base leading-snug ${textColor}`}>
              {formatQuestionText(q.question)}
            </h3>

            {/* Options List: Dedicated 2-choice layout for True/False */}
            {q.questionType === '2' || q.options.length === 2 ? (
              <div className="grid grid-cols-2 gap-3">
                {q.options.slice(0, 2).map((opt: AnswerOption) => {
                  const isCorrect = opt.id === q.correctAnswerOptionId;
                  const wasChosen = userAnswers[q.id] === opt.id;
                  const isTrue = opt.title.toLowerCase().includes('true');

                  let bg = 'bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200';
                  let icon = isTrue ? <Check className="w-5 h-5 text-emerald-500 stroke-[3]" /> : <X className="w-5 h-5 text-rose-500 stroke-[3]" />;
                  let badge = null;

                  if (isCorrect) {
                    bg = 'bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black shadow-sm';
                    icon = <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />;
                    if (wasChosen) {
                      badge = <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500 text-white mt-1">Your Choice (Correct)</span>;
                    } else {
                      badge = <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mt-1">Correct Answer</span>;
                    }
                  } else if (wasChosen) {
                    bg = 'bg-rose-500/15 border-2 border-rose-500 text-rose-600 dark:text-rose-400 font-black shadow-sm';
                    icon = <X className="w-5 h-5 text-rose-600 dark:text-rose-400 stroke-[3]" />;
                    badge = <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-rose-500 text-white mt-1">Your Choice (Wrong)</span>;
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`h-24 rounded-2xl flex flex-col items-center justify-center p-3 text-center transition-all ${bg}`}
                    >
                      <div className="flex items-center space-x-1.5">
                        {icon}
                        <span className="text-base font-black tracking-wide">{opt.title.toUpperCase()}</span>
                      </div>
                      {badge}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {q.options.map((opt: AnswerOption) => {
                  const isCorrect = opt.id === q.correctAnswerOptionId;
                  const wasChosen = userAnswers[q.id] === opt.id;

                  let bg = 'bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600';
                  let icon = null;
                  let badge = null;

                  if (isCorrect) {
                    bg = 'bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                    icon = <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />;
                    if (wasChosen) {
                      badge = <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-emerald-500 text-white mr-2">Your Answer</span>;
                    }
                  } else if (wasChosen) {
                    bg = 'bg-rose-500/15 border-2 border-rose-500 text-rose-600 dark:text-rose-400 font-bold';
                    icon = <X className="w-4 h-4 text-rose-600 dark:text-rose-400 stroke-[3]" />;
                    badge = <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-rose-500 text-white mr-2">Your Answer</span>;
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`w-full p-3 rounded-[8px] flex items-center justify-between text-sm transition-all ${bg}`}
                    >
                      <span>{opt.title}</span>
                      <div className="flex items-center">
                        {badge}
                        {icon}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Note / Explanation Card */}
            {q.note && (
              <div className="p-3 rounded-[8px] bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-xs flex items-start space-x-2 leading-relaxed">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{q.note}</span>
              </div>
            )}
          </div>
        ))
      )}
      </div>

      {/* Report Question Modal (Flutter showReportQuestionBottomSheet) */}
      {reportingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm ${surfaceBg} rounded-[20px] p-6 shadow-2xl space-y-4 border ${cardBorder}`}>
            <div className="flex items-center justify-between border-b pb-2.5 border-black/5 dark:border-white/5">
              <div className="flex items-center space-x-2 text-[#ef5388]">
                <Flag className="w-4 h-4" />
                <h3 className={`font-bold text-base ${textColor}`}>Report Question</h3>
              </div>
              <button onClick={() => setReportingQuestion(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-4 text-center space-y-2 animate-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className={`font-bold text-sm ${textColor}`}>Report Received</h4>
                <p className="text-xs text-slate-400">
                  Thank you! Our editorial team will review this question promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3">
                <p className="text-xs text-slate-400">
                  Found an issue with this question or its options? Describe the problem below:
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="e.g. Typo in question, incorrect answer option, outdated facts..."
                  rows={3}
                  required
                  className={`w-full p-3 rounded-[10px] text-xs border border-slate-300 dark:border-slate-600 ${surfaceBg} ${textColor} outline-none focus:border-[#ef5388]`}
                />
                <QButton type="submit" size="sm">
                  Submit Report
                </QButton>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
