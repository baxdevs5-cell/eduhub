import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { EduHubStore } from '../../services/dataStore';
import {
  Homework,
  HomeworkSubmission,
  TestItem,
  AttendanceStatus,
  User,
  AttendanceRecord
} from '../../types';
import {
  Users,
  BookOpen,
  CheckSquare,
  Award,
  Plus,
  Send,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  FileCheck,
  Megaphone
} from 'lucide-react';

interface TeacherPanelProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();
  const { currentUser, awardPointsToStudent, refreshUser } = useAuth();

  const [classes, setClasses] = useState(EduHubStore.getClasses());
  const [homeworks, setHomeworks] = useState(EduHubStore.getHomeworks());
  const [submissions, setSubmissions] = useState(EduHubStore.getSubmissions());
  const [tests, setTests] = useState(EduHubStore.getTests());
  const [attendance, setAttendance] = useState(EduHubStore.getAttendance());
  const [allUsers, setAllUsers] = useState(EduHubStore.getUsers());

  // Modals
  const [isCreateHwOpen, setIsCreateHwOpen] = useState(false);
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [isAwardPointsOpen, setIsAwardPointsOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<HomeworkSubmission | null>(null);

  // Form states for Create Homework
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwSubject, setNewHwSubject] = useState('Informatika');
  const [newHwClass, setNewHwClass] = useState('class_1');
  const [newHwDesc, setNewHwDesc] = useState('');
  const [newHwDueDate, setNewHwDueDate] = useState('2026-10-15');
  const [newHwPoints, setNewHwPoints] = useState(50);

  // Form state for Grading
  const [gradeScore, setGradeScore] = useState(45);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Form state for Manual Points
  const [awardStudentId, setAwardStudentId] = useState('');
  const [awardPointsVal, setAwardPointsVal] = useState(25);
  const [awardReason, setAwardReason] = useState('Darsda namunali faollik ko‘rsatgani uchun');

  // Form state for Announcement
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');

  // Form state for Create Test
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestSubject, setNewTestSubject] = useState('Informatika');
  const [newTestDuration, setNewTestDuration] = useState(15);
  const [q1Text, setQ1Text] = useState('');
  const [q1Opt1, setQ1Opt1] = useState('');
  const [q1Opt2, setQ1Opt2] = useState('');
  const [q1Opt3, setQ1Opt3] = useState('');
  const [q1Opt4, setQ1Opt4] = useState('');
  const [q1Correct, setQ1Correct] = useState(0);

  const studentsList = allUsers.filter((u) => u.role === 'STUDENT');

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newHwTitle.trim()) return;

    const targetClass = classes.find((c) => c.id === newHwClass) || classes[0];

    const newHw: Homework = {
      id: 'hw_' + Date.now(),
      title: newHwTitle.trim(),
      subject: newHwSubject,
      classId: targetClass.id,
      className: targetClass.name,
      teacherId: currentUser.id,
      teacherName: currentUser.fullName,
      description: newHwDesc.trim(),
      dueDate: newHwDueDate,
      points: Number(newHwPoints),
      submissionsCount: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const updated = [newHw, ...homeworks];
    setHomeworks(updated);
    EduHubStore.saveHomeworks(updated);

    // Notify students
    EduHubStore.addNotification({
      targetRole: 'STUDENTS',
      title: `Yangi vazifa: ${newHw.title}`,
      message: `${currentUser.fullName} yangi topshiriq yukladi. Muddati: ${newHw.dueDate}`,
      type: 'homework'
    });

    setIsCreateHwOpen(false);
    setNewHwTitle('');
    setNewHwDesc('');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission || !currentUser) return;

    const updatedSubmissions = submissions.map((sub) => {
      if (sub.id === gradingSubmission.id) {
        return {
          ...sub,
          status: 'GRADED' as const,
          grade: Number(gradeScore),
          feedback: gradeFeedback.trim(),
          gradedAt: new Date().toISOString(),
          gradedByName: currentUser.fullName
        };
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);
    EduHubStore.saveSubmissions(updatedSubmissions);

    // Award merit points to the student
    awardPointsToStudent(
      gradingSubmission.studentId,
      Number(gradeScore),
      `${gradingSubmission.homeworkTitle} vazifasi baholandi`,
      currentUser.fullName
    );

    setGradingSubmission(null);
    setGradeFeedback('');
  };

  const handleManualAwardPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !awardStudentId) return;

    awardPointsToStudent(
      awardStudentId,
      Number(awardPointsVal),
      awardReason.trim(),
      currentUser.fullName
    );

    setAllUsers(EduHubStore.getUsers());
    setIsAwardPointsOpen(false);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !announcementTitle.trim()) return;

    EduHubStore.addNotification({
      targetRole: 'STUDENTS',
      title: announcementTitle.trim(),
      message: announcementMsg.trim(),
      type: 'info'
    });

    setIsAnnouncementOpen(false);
    setAnnouncementTitle('');
    setAnnouncementMsg('');
    alert('E\'lon barcha o‘quvchilarga yuborildi!');
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newTestTitle.trim() || !q1Text.trim()) return;

    const targetClass = classes[0];

    const newTest: TestItem = {
      id: 'test_' + Date.now(),
      title: newTestTitle.trim(),
      subject: newTestSubject,
      classId: targetClass.id,
      className: targetClass.name,
      teacherId: currentUser.id,
      teacherName: currentUser.fullName,
      durationMinutes: Number(newTestDuration),
      totalPoints: 100,
      active: true,
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'q_' + Date.now(),
          text: q1Text.trim(),
          type: 'single',
          options: [q1Opt1, q1Opt2, q1Opt3, q1Opt4].filter(Boolean),
          correctOptionIndex: Number(q1Correct),
          points: 100
        }
      ]
    };

    const updated = [newTest, ...tests];
    setTests(updated);
    EduHubStore.saveTests(updated);

    EduHubStore.addNotification({
      targetRole: 'STUDENTS',
      title: `Yangi test: ${newTest.title}`,
      message: `${currentUser.fullName} tomonidan yangi sinov testi yaratildi.`,
      type: 'test'
    });

    setIsCreateTestOpen(false);
    setNewTestTitle('');
    setQ1Text('');
  };

  const handleToggleAttendance = (recordId: string, studentId: string, newStatus: AttendanceStatus) => {
    const updated = attendance.map((att) => {
      if (att.id === recordId) {
        return {
          ...att,
          records: att.records.map((r) =>
            r.studentId === studentId ? { ...r, status: newStatus } : r
          )
        };
      }
      return att;
    });

    setAttendance(updated);
    EduHubStore.saveAttendance(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Teacher Profile / Actions Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatarUrl}
            alt={currentUser?.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                {currentUser?.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {currentUser?.subject || 'Oliy toifali o‘qituvchi'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Biriktirilgan sinf: {currentUser?.className || '10-A sinf'} · {currentUser?.phone}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateHwOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createHomework')}</span>
          </button>

          <button
            onClick={() => setIsCreateTestOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createTest')}</span>
          </button>

          <button
            onClick={() => setIsAwardPointsOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>{t('awardPoints')}</span>
          </button>

          <button
            onClick={() => setIsAnnouncementOpen(true)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="E'lon yuborish"
          >
            <Megaphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'dashboard', label: t('navDashboard') },
          { id: 'classes', label: t('navClasses') },
          { id: 'homework', label: t('navHomework') },
          { id: 'tests', label: t('navTests') },
          { id: 'attendance', label: t('navAttendance') },
          { id: 'progress', label: t('studentProgress') }
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

      {/* 1. Dashboard Overview */}
      {(currentTab === 'dashboard' || currentTab === 'classes') && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Jami o‘quvchilar</span>
              <div className="text-3xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums mt-1">
                {studentsList.length}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Tekshirilishi kutilayotgan</span>
              <div className="text-3xl font-extrabold font-display text-amber-500 tabular-nums mt-1">
                {submissions.filter((s) => s.status === 'PENDING').length}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Faol vazifalar</span>
              <div className="text-3xl font-extrabold font-display text-teal-600 dark:text-teal-400 tabular-nums mt-1">
                {homeworks.length}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Bugungi harakatlar</span>
              <div className="text-3xl font-extrabold font-display text-sky-600 dark:text-sky-400 tabular-nums mt-1">
                {currentUser?.dailyUsage.count} / {currentUser?.dailyUsage.max}
              </div>
            </div>
          </div>

          {/* Classes Overview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Biriktirilgan Sinflar
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {cls.name}
                    </span>
                    <span className="text-xs text-slate-400">{cls.room}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    O‘quvchilar soni: <strong className="text-slate-800 dark:text-slate-200">{cls.studentCount} nafar</strong>
                  </div>
                  <div className="text-xs text-slate-400">
                    Sinf rahbari: {cls.teacherName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Homework Review & Grading */}
      {currentTab === 'homework' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Vazifalarni Tekshirish & Baholash
            </h2>
            <button
              onClick={() => setIsCreateHwOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('createHomework')}</span>
            </button>
          </div>

          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {sub.homeworkTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      O‘quvchi: <strong className="text-teal-600 dark:text-teal-400">{sub.studentName}</strong> · Topshirilgan vaqt: {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold self-start ${
                      sub.status === 'GRADED'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {sub.status === 'GRADED' ? `Baholandi: ${sub.grade} ball` : 'Tekshirish kutilmoqda'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {sub.submissionText}
                </div>

                {sub.feedback && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>O‘qituvchi xulosasi:</strong> {sub.feedback}
                  </div>
                )}

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      setGradingSubmission(sub);
                      setGradeScore(sub.grade || 45);
                      setGradeFeedback(sub.feedback || '');
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{sub.status === 'GRADED' ? 'Bahoni o‘zgartirish' : 'Baholash va ball berish'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Tests Builder & Oversight */}
      {currentTab === 'tests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Testlar va Savollar Bazasi
            </h2>
            <button
              onClick={() => setIsCreateTestOpen(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('createTest')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">
                    {test.subject}
                  </span>
                  <span className="text-xs font-bold text-amber-500 tabular-nums">
                    {test.totalPoints} ball
                  </span>
                </div>

                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  {test.title}
                </h3>

                <div className="text-xs text-slate-500">
                  Davomiyligi: {test.durationMinutes} daqiqa · Savollar soni: {test.questions.length} ta
                </div>

                <div className="text-xs text-slate-400">
                  Biriktirilgan sinf: {test.className}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Attendance Matrix */}
      {currentTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {t('markAttendance')}
            </h2>
            <span className="text-xs text-slate-400">Bugungi sana: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="space-y-6">
            {attendance.map((att) => (
              <div
                key={att.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {att.className} · {att.date}
                  </h3>
                  <span className="text-xs text-slate-400">O‘qituvchi: {att.teacherName}</span>
                </div>

                <div className="space-y-2">
                  {att.records.map((r) => (
                    <div
                      key={r.studentId}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {r.studentName}
                      </span>

                      {/* Attendance status toggles */}
                      <div className="flex items-center gap-1.5">
                        {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleToggleAttendance(att.id, r.studentId, st)}
                            className={`min-h-[38px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              r.status === st
                                ? st === 'PRESENT'
                                  ? 'bg-emerald-600 text-white'
                                  : st === 'ABSENT'
                                  ? 'bg-rose-600 text-white'
                                  : st === 'LATE'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-sky-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {st === 'PRESENT'
                              ? t('attendancePresent')
                              : st === 'ABSENT'
                              ? t('attendanceAbsent')
                              : st === 'LATE'
                              ? t('attendanceLate')
                              : t('attendanceExcused')}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Student Progress */}
      {currentTab === 'progress' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            {t('studentProgress')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studentsList.map((st) => (
              <div
                key={st.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.avatarUrl}
                    alt={st.fullName}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {st.fullName}
                    </h4>
                    <p className="text-xs text-slate-400">{st.className || '10-A sinf'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div>
                    <span className="text-slate-400">Umumiy ball:</span>
                    <div className="font-bold text-teal-600 dark:text-teal-400 text-base tabular-nums">
                      {st.points}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Daraja:</span>
                    <div className="font-bold text-slate-900 dark:text-white text-base">
                      {st.level}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAwardStudentId(st.id);
                    setIsAwardPointsOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors"
                >
                  Rag‘bat balli berish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Homework */}
      {isCreateHwOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              {t('createHomework')}
            </h3>

            <form onSubmit={handleCreateHomework} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vazifa sarlavhasi
                </label>
                <input
                  type="text"
                  required
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  placeholder="Masalan: Funksiyalar va grafigi"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fan
                  </label>
                  <select
                    value={newHwSubject}
                    onChange={(e) => setNewHwSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Informatika">Informatika</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Ingliz tili">Ingliz tili</option>
                    <option value="Fizika">Fizika</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sinf
                  </label>
                  <select
                    value={newHwClass}
                    onChange={(e) => setNewHwClass(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vazifa tavsifi va shartlari
                </label>
                <textarea
                  required
                  rows={3}
                  value={newHwDesc}
                  onChange={(e) => setNewHwDesc(e.target.value)}
                  placeholder="Topshiriq mazmuni, misol va mashqlar ro‘yxati..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Topshirish muddati
                  </label>
                  <input
                    type="date"
                    value={newHwDueDate}
                    onChange={(e) => setNewHwDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Maksimal ball
                  </label>
                  <input
                    type="number"
                    value={newHwPoints}
                    onChange={(e) => setNewHwPoints(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateHwOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Vazifani e'lon qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grading Submission */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Vazifani Baholash: {gradingSubmission.studentName}
            </h3>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono max-h-40 overflow-y-auto">
              {gradingSubmission.submissionText}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Baho (Maksimal 50 ball)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('teacherComment')}
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="O‘quvchiga tavsiyalar, kamchiliklar va maqtov..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  {t('saveGrade')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Award Manual Points */}
      {isAwardPointsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{t('awardPoints')}</span>
            </h3>

            <form onSubmit={handleManualAwardPoints} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  O‘quvchini tanlang
                </label>
                <select
                  required
                  value={awardStudentId}
                  onChange={(e) => setAwardStudentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="">-- Tanlang --</option>
                  {studentsList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.className || '10-A'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ball miqdori (+ball)
                </label>
                <input
                  type="number"
                  required
                  min={5}
                  max={200}
                  value={awardPointsVal}
                  onChange={(e) => setAwardPointsVal(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sabab / Sababli rag‘bat
                </label>
                <input
                  type="text"
                  required
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="Olimpiada natijasi, darsda faollik..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAwardPointsOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  Ballni tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Test */}
      {isCreateTestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              {t('createTest')}
            </h3>

            <form onSubmit={handleCreateTest} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Test nomi
                </label>
                <input
                  type="text"
                  required
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  placeholder="Masalan: Ma'lumotlar bazasi asoslari"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fan
                  </label>
                  <input
                    type="text"
                    value={newTestSubject}
                    onChange={(e) => setNewTestSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vaqt (daqiqa)
                  </label>
                  <input
                    type="number"
                    value={newTestDuration}
                    onChange={(e) => setNewTestDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  1-Savol matni
                </label>
                <input
                  type="text"
                  required
                  value={q1Text}
                  onChange={(e) => setQ1Text(e.target.value)}
                  placeholder="Savolni kiriting..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Javob variantlari (A, B, C, D)
                </label>
                <input
                  type="text"
                  required
                  value={q1Opt1}
                  onChange={(e) => setQ1Opt1(e.target.value)}
                  placeholder="Variant A"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
                <input
                  type="text"
                  required
                  value={q1Opt2}
                  onChange={(e) => setQ1Opt2(e.target.value)}
                  placeholder="Variant B"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
                <input
                  type="text"
                  value={q1Opt3}
                  onChange={(e) => setQ1Opt3(e.target.value)}
                  placeholder="Variant C"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
                <input
                  type="text"
                  value={q1Opt4}
                  onChange={(e) => setQ1Opt4(e.target.value)}
                  placeholder="Variant D"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  To‘g‘ri javob varianti:
                </label>
                <select
                  value={q1Correct}
                  onChange={(e) => setQ1Correct(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value={0}>Variant A</option>
                  <option value={1}>Variant B</option>
                  <option value={2}>Variant C</option>
                  <option value={3}>Variant D</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTestOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Testni yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Announcement */}
      {isAnnouncementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-teal-500" />
              <span>{t('sendAnnouncement')}</span>
            </h3>

            <form onSubmit={handleSendAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E'lon mavzusi
                </label>
                <input
                  type="text"
                  required
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Masalan: Ertangi dars jadvali o‘zgarishi"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E'lon matni
                </label>
                <textarea
                  required
                  rows={4}
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  placeholder="Barcha o‘quvchilarga yetkazilishi kerak bo‘lgan muhim ma'lumot..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
