export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export type LanguageCode = 'uz' | 'ru' | 'en';

export interface User {
  id: string;
  phone: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string;
  classId?: string;
  className?: string;
  subject?: string;
  points: number;
  level: number;
  status: 'ACTIVE' | 'SUSPENDED';
  dailyUsage: {
    date: string;
    count: number;
    max: number;
  };
  streakDays: number;
  createdAt: string;
  email?: string;
  bio?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
  teacherId: string;
  teacherName: string;
  room: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  description: string;
  dueDate: string;
  points: number;
  submissionsCount: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  studentId: string;
  studentName: string;
  submissionText: string;
  fileAttachment?: string;
  submittedAt: string;
  status: 'PENDING' | 'GRADED';
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedByName?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points: number;
}

export interface TestItem {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  durationMinutes: number;
  totalPoints: number;
  questions: Question[];
  createdAt: string;
  active: boolean;
}

export interface TestSubmission {
  id: string;
  testId: string;
  testTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  records: {
    studentId: string;
    studentName: string;
    status: AttendanceStatus;
    note?: string;
  }[];
}

export type TargetLanguage = 'en' | 'ru' | 'uz' | 'de' | 'es' | 'fr';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type ExerciseType =
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'translation'
  | 'multiple_choice'
  | 'fill_blanks'
  | 'matching';

export interface LanguageExercise {
  id: string;
  language: TargetLanguage;
  level: CEFRLevel;
  type: ExerciseType;
  title: string;
  prompt: string;
  passage?: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string | number;
  matchingPairs?: { left: string; right: string }[];
  explanation: string;
  points: number;
}

export interface Achievement {
  id: string;
  title: { uz: string; ru: string; en: string };
  description: { uz: string; ru: string; en: string };
  badgeIcon: string;
  badgeColor: string;
  criteriaPoints: number;
  category: 'points' | 'homework' | 'tests' | 'languages' | 'streak';
  unlockedAt?: string;
}

export interface PointHistory {
  id: string;
  userId: string;
  points: number;
  reason: string;
  awardedBy: string;
  awardedByName: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetUserId?: string;
  targetUserName?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  targetRole: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'ADMIN';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'homework' | 'test' | 'point' | 'achievement';
  read: boolean;
  createdAt: string;
}

export interface AdminSettings {
  appName: string;
  allowStudentRegistration: boolean;
  allowTeacherRegistration: boolean;
  defaultDailyLimitStudent: number;
  defaultDailyLimitTeacher: number;
  pointsPerHomework: number;
  pointsPerTest100: number;
  pointsPerLanguageExercise: number;
  smsProvider: 'mock' | 'eskiz' | 'twilio' | 'firebase';
  smsSenderName: string;
  smsApiKey: string;
  maintenanceMode: boolean;
}
