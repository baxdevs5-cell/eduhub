import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { EduHubStore } from '../../services/dataStore';
import { TestItem, TestSubmission } from '../../types';
import {
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface TestEngineProps {
  test: TestItem;
  onClose: () => void;
}

export const TestEngine: React.FC<TestEngineProps> = ({ test, onClose }) => {
  const { t } = useLanguage();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<TestSubmission | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeftSeconds]);

  const currentQuestion = test.questions[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: index
    });
  };

  const handleSubmit = () => {
    if (!currentUser || isSubmitted) return;

    let totalEarned = 0;
    const answersBreakdown = test.questions.map((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) totalEarned += q.points;
      return {
        questionId: q.id,
        selectedOption: selected !== undefined ? selected : -1,
        isCorrect
      };
    });

    const percentage = Math.round((totalEarned / test.totalPoints) * 100);
    const passed = percentage >= 60;

    const newSub: TestSubmission = {
      id: 'tsub_' + Date.now(),
      testId: test.id,
      testTitle: test.title,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      score: totalEarned,
      maxScore: test.totalPoints,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
      answers: answersBreakdown
    };

    EduHubStore.saveTestSubmissions([newSub, ...EduHubStore.getTestSubmissions()]);
    setSubmissionResult(newSub);
    setIsSubmitted(true);

    // Award merit points
    awardPointsToStudent(
      currentUser.id,
      totalEarned,
      `${test.title} sinov testi (${percentage}%)`,
      'EduHub Assessment Engine'
    );
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {test.subject} · {test.className}
            </span>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
              {test.title}
            </h3>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-mono text-xs font-bold">
              <Timer className="w-4 h-4" />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        {!isSubmitted ? (
          <div className="p-6 space-y-6">
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>
                Savol {currentQIndex + 1} / {test.questions.length}
              </span>
              <span className="tabular-nums font-bold text-slate-700 dark:text-slate-300">
                {currentQuestion.points} ball
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-500 h-full transition-all duration-300"
                style={{
                  width: `${((currentQIndex + 1) / test.questions.length) * 100}%`
                }}
              />
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.text}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between min-h-[52px] ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span>{option}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                        isSelected
                          ? 'border-teal-500 bg-teal-500 text-white font-bold'
                          : 'border-slate-300 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
              >
                Oldingi
              </button>

              <div className="flex items-center gap-2">
                {currentQIndex < test.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Keyingisi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('finishTest')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Test Result Summary */
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                {t('testResult')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {submissionResult?.passed ? t('testPassed') : t('testFailed')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">To‘plangan ball</div>
                <div className="text-xl font-bold font-display text-teal-600 dark:text-teal-400 tabular-nums">
                  {submissionResult?.score} / {submissionResult?.maxScore}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Foiz ko‘rsatkichi</div>
                <div className="text-xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
                  {submissionResult?.percentage}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Status</div>
                <div
                  className={`text-sm font-bold mt-1 ${
                    submissionResult?.passed ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {submissionResult?.passed ? 'O‘tdi' : 'Qayta topshirish'}
                </div>
              </div>
            </div>

            {/* Answer Breakdown list */}
            <div className="text-left space-y-3 max-h-60 overflow-y-auto pr-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Savollar tahlili:
              </div>
              {test.questions.map((q, idx) => {
                const ans = submissionResult?.answers.find((a) => a.questionId === q.id);
                const isCorr = ans?.isCorrect;
                return (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {idx + 1}. {q.text}
                      </span>
                      {isCorr ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>
                    {q.explanation && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Yopish va Bosh sahifaga qaytish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
