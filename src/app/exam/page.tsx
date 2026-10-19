'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Award, ShieldAlert, CheckSquare, Square } from 'lucide-react';
import { QAppBar } from '../../components/common/QAppBar';
import { QButton } from '../../components/common/QButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_EXAMS } from '../../lib/api';
import { EXAM_RULES } from '../../lib/constants';
import { tr } from '../../lib/translations';

export default function ExamPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { requireAuth } = useAuth();

  const [selectedExam, setSelectedExam] = useState<typeof MOCK_EXAMS[0] | null>(null);
  const [agreed, setAgreed] = useState(false);

  const textColor = isDark ? 'text-[#fefefe]' : 'text-[#45536d]';
  const surfaceBg = isDark ? 'bg-[#294261]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-100';

  const handleStartExam = () => {
    if (!agreed || !selectedExam) return;
    requireAuth(() => {
      router.push(`/quiz?quizType=exam&title=${encodeURIComponent(selectedExam.title)}`);
    }, '/exam');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#233354]' : 'bg-[#f3f7fa]'} flex flex-col pb-8 select-none`}>
      <QAppBar title={tr('exam')} />

      <div className="max-w-md w-full mx-auto px-4 py-4 space-y-4">
        {MOCK_EXAMS.map((ex) => (
          <div
            key={ex.id}
            className={`w-full ${surfaceBg} rounded-[10px] p-5 shadow-sm border ${cardBorder} space-y-4`}
          >
            <div>
              <span className="px-2.5 py-1 rounded-full bg-[#ef5388]/10 text-[#ef5388] dark:text-[#f279a2] font-bold text-xs uppercase tracking-wider">
                Certified Exam
              </span>
              <h3 className={`font-bold text-lg mt-2 ${textColor}`}>{ex.title}</h3>
            </div>

            <div className="flex items-center space-x-4 text-xs text-slate-400 border-t border-black/5 dark:border-white/5 pt-3">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{ex.duration} Minutes</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-slate-400" />
                <span>{ex.totalMarks} Marks</span>
              </div>
            </div>

            <div className="pt-1">
              <QButton
                onClick={() => {
                  requireAuth(() => {
                    setSelectedExam(ex);
                    setAgreed(false);
                  }, '/exam');
                }}
                size="sm"
              >
                Begin Exam
              </QButton>
            </div>
          </div>
        ))}
      </div>

      {/* Exam Rules Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md ${surfaceBg} rounded-[20px] p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col`}>
            <div className="flex items-center space-x-2.5 text-amber-500">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className={`text-lg font-bold ${textColor}`}>Exam Rules & Instructions</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-y border-black/5 dark:border-white/5 py-3">
              {EXAM_RULES.map((rule, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="font-bold text-[#ef5388] shrink-0">{idx + 1}.</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            {/* Checkbox agreement */}
            <div
              onClick={() => setAgreed(!agreed)}
              className="flex items-center space-x-3 cursor-pointer py-1"
            >
              {agreed ? (
                <CheckSquare className="w-5 h-5 text-[#ef5388] shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0" />
              )}
              <span className={`text-xs font-semibold select-none ${textColor}`}>
                I have read and agree to comply with all exam rules.
              </span>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setSelectedExam(null)}
                className="flex-1 h-11 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px]"
              >
                {tr('cancel')}
              </button>
              <QButton
                onClick={handleStartExam}
                disabled={!agreed}
                size="sm"
                className="flex-1"
              >
                Start Exam
              </QButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
