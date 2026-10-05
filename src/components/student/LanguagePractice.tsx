import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { EduHubStore } from '../../services/dataStore';
import { LanguageExercise, TargetLanguage, CEFRLevel, ExerciseType } from '../../types';
import {
  Globe2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  BookOpen,
  Award
} from 'lucide-react';

export const LanguagePractice: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, consumeDailyUsage, awardPointsToStudent } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState<TargetLanguage>('en');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [matchingSelections, setMatchingSelections] = useState<{ [left: string]: string }>({});
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [limitNotice, setLimitNotice] = useState<string | null>(null);

  const languagesList: { id: TargetLanguage; name: string; flag: string }[] = [
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'ru', name: 'Русский', flag: '🇷🇺' },
    { id: 'uz', name: 'O‘zbek tili', flag: '🇺🇿' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const allExercises = EduHubStore.getLanguageExercises();
  const currentCategoryExercises = allExercises.filter(
    (ex) => ex.language === selectedLanguage && ex.level === selectedLevel
  );

  // Fallback if no exercise matches exact tier
  const activeExercise: LanguageExercise =
    currentCategoryExercises[currentExerciseIndex] ||
    allExercises.find((ex) => ex.language === selectedLanguage) ||
    allExercises[0];

  const handleEvaluate = () => {
    if (!currentUser) return;

    // Check free daily usage limit
    const allowed = consumeDailyUsage();
    if (!allowed) {
      setLimitNotice(t('dailyLimitReached'));
      return;
    }

    setLimitNotice(null);
    let correct = false;

    if (activeExercise.type === 'multiple_choice' || activeExercise.type === 'vocabulary' || activeExercise.type === 'grammar' || activeExercise.type === 'translation') {
      correct = selectedOption === activeExercise.correctAnswer;
    } else {
      correct = selectedOption === activeExercise.correctAnswer;
    }

    setIsCorrect(correct);
    setHasEvaluated(true);

    if (correct) {
      awardPointsToStudent(
        currentUser.id,
        activeExercise.points,
        `${activeExercise.language.toUpperCase()} ${activeExercise.level} mashqi: ${activeExercise.title}`,
        'EduHub Language Lab'
      );
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setTextAnswer('');
    setMatchingSelections({});
    setHasEvaluated(false);
    setIsCorrect(false);
    setLimitNotice(null);

    if (currentExerciseIndex < currentCategoryExercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setCurrentExerciseIndex(0);
    }
  };

  const playSimulatedAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Language Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>{t('practiceLanguages')}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Xalqaro CEFR A1–C2 standartlari asosida 6 ta xorijiy tilni mukammal o‘rganing
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          {languagesList.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setSelectedLanguage(lang.id);
                setCurrentExerciseIndex(0);
                setHasEvaluated(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedLanguage === lang.id
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{lang.flag}</span>
              <span className="hidden sm:inline">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Level selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          {t('selectLevel')}:
        </span>
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => {
              setSelectedLevel(lvl);
              setCurrentExerciseIndex(0);
              setHasEvaluated(false);
            }}
            className={`min-w-[44px] h-9 px-3.5 text-xs font-bold rounded-lg border transition-all ${
              selectedLevel === lvl
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {limitNotice && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span>{limitNotice}</span>
        </div>
      )}

      {/* Interactive Exercise Stage */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/50 border border-teal-200/50 dark:border-teal-800/50 uppercase">
              {activeExercise.type.replace('_', ' ')}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 dark:text-slate-300">{activeExercise.title}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Award className="w-4 h-4" />
            <span className="tabular-nums">+{activeExercise.points} ball</span>
          </div>
        </div>

        {/* Prompt */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white leading-relaxed">
              {activeExercise.prompt}
            </h3>
            <button
              onClick={() => playSimulatedAudio(activeExercise.prompt)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0 transition-colors"
              title="Tinglash (Audio)"
              aria-label="Play audio prompt"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {activeExercise.passage && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
              {activeExercise.passage}
            </div>
          )}
        </div>

        {/* Options */}
        {activeExercise.options && activeExercise.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {activeExercise.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600';

              if (hasEvaluated) {
                if (idx === activeExercise.correctAnswer) {
                  btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300';
                }
              } else if (isSelected) {
                btnClass = 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-200 ring-1 ring-teal-500';
              }

              return (
                <button
                  key={idx}
                  disabled={hasEvaluated}
                  onClick={() => setSelectedOption(idx)}
                  className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between min-h-[52px] ${btnClass}`}
                >
                  <span>{opt}</span>
                  {hasEvaluated && idx === activeExercise.correctAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {hasEvaluated && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Evaluation Banner */}
        {hasEvaluated && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{isCorrect ? t('correctMsg', { points: activeExercise.points }) : 'Noto‘g‘ri javob'}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              {activeExercise.explanation}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handleNext()}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>O‘tkazib yuborish</span>
          </button>

          {!hasEvaluated ? (
            <button
              disabled={selectedOption === null}
              onClick={handleEvaluate}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              {t('checkAnswer')}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-[0.98]"
            >
              <span>{t('nextExercise')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
