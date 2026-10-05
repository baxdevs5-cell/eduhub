import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { EduHubStore } from '../../services/dataStore';
import { Homework, HomeworkSubmission, TestItem } from '../../types';
import { LanguagePractice } from './LanguagePractice';
import { TestEngine } from './TestEngine';
import {
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  Trophy,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';

interface StudentPanelProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();
  const { currentUser, refreshUser, consumeDailyUsage, awardPointsToStudent } = useAuth();

  // Active modal states
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [submissionModalHw, setSubmissionModalHw] = useState<Homework | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  if (!currentUser) return null;

  const homeworks = EduHubStore.getHomeworks();
  const submissions = EduHubStore.getSubmissions().filter((s) => s.studentId === currentUser.id);
  const tests = EduHubStore.getTests();
  const testSubmissions = EduHubStore.getTestSubmissions().filter((s) => s.studentId === currentUser.id);
  const achievements = EduHubStore.getAchievements();
  const pointHistories = EduHubStore.getPointHistories().filter((p) => p.userId === currentUser.id);
  const allUsers = EduHubStore.getUsers();
  const attendanceRecords = EduHubStore.getAttendance();

  // Cohort Ranking
  const cohortStudents = allUsers
    .filter((u) => u.role === 'STUDENT' && (!currentUser.classId || u.classId === currentUser.classId))
    .sort((a, b) => b.points - a.points);
  const myRank = cohortStudents.findIndex((s) => s.id === currentUser.id) + 1;

  // Level computation: next level at level * 150 points
  const pointsInCurrentLevel = currentUser.points % 150;
  const levelProgressPercent = Math.min(100, Math.round((pointsInCurrentLevel / 150) * 100));

  const handleOpenSubmission = (hw: Homework) => {
    setSubmissionModalHw(hw);
    setSubmissionText('');
    setSubmissionSuccess(false);
  };

  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalHw || !submissionText.trim()) return;

    // Daily limit check
    const allowed = consumeDailyUsage();
    if (!allowed) {
      alert(t('dailyLimitReached'));
      return;
    }

    const newSub: HomeworkSubmission = {
      id: 'subm_' + Date.now(),
      homeworkId: submissionModalHw.id,
      homeworkTitle: submissionModalHw.title,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      submissionText: submissionText.trim(),
      submittedAt: new Date().toISOString(),
      status: 'PENDING'
    };

    EduHubStore.saveSubmissions([newSub, ...EduHubStore.getSubmissions()]);
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionModalHw(null);
      refreshUser();
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Student Profile Quick Hero Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                  {currentUser.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {currentUser.className || '10-A sinf'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentUser.phone} · ID: #{currentUser.id.substring(4, 9)}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">{t('myPoints')}</div>
              <div className="text-lg sm:text-xl font-extrabold font-display text-teal-600 dark:text-teal-400 tabular-nums">
                {currentUser.points}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-medium">{t('currentLevel')}</div>
              <div className="text-lg sm:text-xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums flex items-center gap-1">
                <span>{currentUser.level}</span>
                <span className="text-[10px] text-slate-400 font-normal">({levelProgressPercent}%)</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-medium">{t('rankPosition')}</div>
              <div className="text-lg sm:text-xl font-extrabold font-display text-amber-500 tabular-nums flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>#{myRank > 0 ? myRank : 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>Daraja {currentUser.level} rivojlanishi</span>
            <span className="tabular-nums">
              {pointsInCurrentLevel} / 150 ball (Keyingi darajagacha {150 - pointsInCurrentLevel} ball)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-sky-500 h-full transition-all duration-500"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'dashboard', label: t('navDashboard') },
          { id: 'homework', label: t('navHomework') },
          { id: 'tests', label: t('navTests') },
          { id: 'languages', label: t('navLanguages') },
          { id: 'achievements', label: t('navAchievements') },
          { id: 'attendance', label: t('navAttendance') },
          { id: 'analytics', label: t('navAnalytics') }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentTab === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Dashboard View */}
      {currentTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Homeworks card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {t('activeHomeworks')}
                  </span>
                  <BookOpen className="w-5 h-5 text-teal-500" />
                </div>
                <div className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums">
                  {homeworks.length}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Topshirilishi kutilayotgan vazifalar mavjud
                </p>
              </div>
              <button
                onClick={() => onSelectTab('homework')}
                className="mt-4 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Vazifalarni ko‘rish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Upcoming Tests card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    {t('upcomingTests')}
                  </span>
                  <Award className="w-5 h-5 text-sky-500" />
                </div>
                <div className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums">
                  {tests.length}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Informatika va Matematika sinovlari
                </p>
              </div>
              <button
                onClick={() => onSelectTab('tests')}
                className="mt-4 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Testlarga o‘tish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Streak & Attendance card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Faollik Seriyasi
                  </span>
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums flex items-center gap-2">
                  <span>{currentUser.streakDays}</span>
                  <span className="text-sm font-normal text-slate-500">kun</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Uzluksiz bilim olish va mashqlar bajarish
                </p>
              </div>
              <button
                onClick={() => onSelectTab('languages')}
                className="mt-4 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Til mashqini bajarish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Leaderboard and Recent Merit Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Class Leaderboard */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Sinf Reytingi ({currentUser.className || '10-A sinf'})</span>
                </h3>
                <span className="text-xs text-slate-400">Umumiy ball bo‘yicha</span>
              </div>

              <div className="space-y-2">
                {cohortStudents.map((st, idx) => {
                  const isMe = st.id === currentUser.id;
                  return (
                    <div
                      key={st.id}
                      className={`p-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        isMe
                          ? 'bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 font-bold'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            idx === 0
                              ? 'bg-amber-400 text-slate-950'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-900'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <img
                          src={st.avatarUrl}
                          alt={st.fullName}
                          className="w-7 h-7 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-slate-800 dark:text-slate-200 truncate max-w-[140px] sm:max-w-xs">
                          {st.fullName} {isMe && '(Siz)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">Daraja {st.level}</span>
                        <span className="font-extrabold text-teal-600 dark:text-teal-400 tabular-nums">
                          {st.points} ball
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Merit & Feedback History */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <span>{t('pointsHistory')}</span>
                </h3>
              </div>

              <div className="space-y-3">
                {pointHistories.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Hozircha ballar tarixi yo‘q</p>
                ) : (
                  pointHistories.slice(0, 5).map((ph) => (
                    <div
                      key={ph.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {ph.reason}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {ph.awardedByName} · {new Date(ph.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-extrabold text-teal-600 dark:text-teal-400 tabular-nums shrink-0">
                        +{ph.points}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Homework View */}
      {currentTab === 'homework' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Uy Vazifalari
            </h2>
            <span className="text-xs text-slate-400">Topshiriqlar va baholar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homeworks.map((hw) => {
              const mySub = submissions.find((s) => s.homeworkId === hw.id);
              return (
                <div
                  key={hw.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/50">
                        {hw.subject}
                      </span>
                      <span className="text-xs font-bold text-amber-500 tabular-nums">
                        +{hw.points} ball
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                      {hw.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {hw.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>O‘qituvchi: {hw.teacherName}</span>
                      <span>·</span>
                      <span>Muddati: {hw.dueDate}</span>
                    </div>

                    {/* If student submitted */}
                    {mySub && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Topshirilgan javob:
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              mySub.status === 'GRADED'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                            }`}
                          >
                            {mySub.status === 'GRADED' ? t('statusGraded') : t('statusPending')}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 italic font-mono text-[11px]">
                          "{mySub.submissionText}"
                        </p>

                        {mySub.grade !== undefined && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                            <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                              <span>Olingan baho:</span>
                              <span>{mySub.grade} / {hw.points} ball</span>
                            </div>
                            {mySub.feedback && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                💬 {t('teacherFeedback')}: {mySub.feedback}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!mySub ? (
                    <button
                      onClick={() => handleOpenSubmission(hw)}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t('submitHomework')}</span>
                    </button>
                  ) : (
                    <div className="text-center py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vazifa topshirilgan</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Tests View */}
      {currentTab === 'tests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Akademik Testlar
            </h2>
            <span className="text-xs text-slate-400">Choraklik va oraliq sinovlar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => {
              const mySub = testSubmissions.find((s) => s.testId === test.id);
              return (
                <div
                  key={test.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/50">
                        {test.subject}
                      </span>
                      <span className="text-xs font-bold text-amber-500 tabular-nums">
                        {test.totalPoints} ball
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                      {test.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 py-1">
                      <div>Davomiyligi: {test.durationMinutes} daqiqa</div>
                      <div>Savollar: {test.questions.length} ta</div>
                    </div>

                    {mySub && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            Natija: {mySub.score} / {mySub.maxScore} ({mySub.percentage}%)
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(mySub.completedAt).toLocaleDateString()} da topshirilgan
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            mySub.passed
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                          }`}
                        >
                          {mySub.passed ? 'Muvaffaqiyatli' : 'Qayta urinish'}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTest(test)}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{mySub ? 'Qaytadan topshirish' : t('takeTest')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Language Learning Tab */}
      {currentTab === 'languages' && <LanguagePractice />}

      {/* 5. Achievements Tab */}
      {currentTab === 'achievements' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {t('navAchievements')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Faollik, test natijalari va til mashqlari orqali unvonlarni oching
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((ach) => {
              const isUnlocked = ach.unlockedAt !== undefined || currentUser.points >= ach.criteriaPoints;
              return (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-white dark:bg-slate-900 border-teal-500/40 shadow-sm'
                      : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shadow-inner'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Award className="w-6 h-6" />
                    </div>

                    <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                      {ach.title.uz}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ach.description.uz}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Talab: {ach.criteriaPoints} ball</span>
                    <span
                      className={`font-bold ${
                        isUnlocked ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'
                      }`}
                    >
                      {isUnlocked ? t('unlocked') : t('locked')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Attendance Tab */}
      {currentTab === 'attendance' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Mening Davomatim
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Darslarga qatnashish va kechikishlar hisoboti
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-3">
              {attendanceRecords.map((att) => {
                const myRecord = att.records.find((r) => r.studentId === currentUser.id);
                const status = myRecord?.status || 'PRESENT';
                return (
                  <div
                    key={att.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {att.date} · {att.className}
                      </div>
                      <div className="text-slate-400 text-[11px]">O‘qituvchi: {att.teacherName}</div>
                      {myRecord?.note && (
                        <div className="text-slate-500 text-[11px] mt-0.5">Izoh: {myRecord.note}</div>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full font-bold text-xs ${
                        status === 'PRESENT'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : status === 'LATE'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {status === 'PRESENT'
                        ? t('attendancePresent')
                        : status === 'LATE'
                        ? t('attendanceLate')
                        : t('attendanceAbsent')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. Analytics Tab */}
      {currentTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Shaxsiy Akademik Tahlil
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              O‘zlashtirish dinamikasi va kunlik yuklama ko‘rsatkichlari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400">Vazifalar bajarilishi</span>
              <div className="text-3xl font-extrabold font-display text-teal-600 dark:text-teal-400 tabular-nums">
                {submissions.length} / {homeworks.length}
              </div>
              <p className="text-xs text-slate-500">Faol topshiriqlarning 67% qismi topshirilgan</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400">O‘rtacha test balli</span>
              <div className="text-3xl font-extrabold font-display text-sky-600 dark:text-sky-400 tabular-nums">
                92%
              </div>
              <p className="text-xs text-slate-500">Algoritmika va matematika bo‘yicha yuqori ko‘rsatkich</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-400">Bugungi bepul mashqlar</span>
              <div className="text-3xl font-extrabold font-display text-amber-500 tabular-nums">
                {currentUser.dailyUsage.count} / {currentUser.dailyUsage.max}
              </div>
              <p className="text-xs text-slate-500">Har kuni soat 00:00 da yangilanadi</p>
            </div>
          </div>
        </div>
      )}

      {/* Homework Submission Modal */}
      {submissionModalHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Vazifani topshirish: {submissionModalHw.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {submissionModalHw.description}
            </p>

            {submissionSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center">
                Vazifa muvaffaqiyatli yuborildi! O‘qituvchi tez orada tekshiradi.
              </div>
            ) : (
              <form onSubmit={handleSubmitHomework} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('yourAnswer')} (Kod, hisob-kitob yoki havola)
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Vazifa bo‘yicha to‘liq javob matnini kiriting..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmissionModalHw(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                  >
                    {t('sendSubmission')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Active Interactive Test Engine Modal */}
      {activeTest && <TestEngine test={activeTest} onClose={() => setActiveTest(null)} />}
    </div>
  );
};
