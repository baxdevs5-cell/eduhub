import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Languages,
  Users,
  CheckSquare,
  ShieldCheck,
  User,
  GraduationCap
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuthModal?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAuthModal
}) => {
  const { isAuthenticated, role } = useAuth();
  const { t } = useLanguage();

  if (!isAuthenticated) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 pb-safe">
        <button
          onClick={onOpenAuthModal}
          className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs tracking-wide shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>{t('heroTagline')} — {t('loginBtn')}</span>
        </button>
      </div>
    );
  }

  // Student bottom destinations: 5 tabs
  const studentTabs = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'homework', label: t('navHomework'), icon: BookOpen },
    { id: 'languages', label: t('navLanguages'), icon: Languages },
    { id: 'achievements', label: t('navAchievements'), icon: Award },
    { id: 'profile', label: t('navProfile'), icon: User }
  ];

  // Teacher bottom destinations
  const teacherTabs = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'classes', label: t('navClasses'), icon: Users },
    { id: 'homework', label: t('navHomework'), icon: BookOpen },
    { id: 'attendance', label: t('navAttendance'), icon: CheckSquare },
    { id: 'profile', label: t('navProfile'), icon: User }
  ];

  // Admin bottom destinations
  const adminTabs = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'users', label: t('navStudents'), icon: Users },
    { id: 'security', label: t('navSecurity'), icon: ShieldCheck },
    { id: 'analytics', label: t('navAnalytics'), icon: LayoutDashboard },
    { id: 'settings', label: t('navSettings'), icon: User }
  ];

  const tabs =
    role === 'ADMIN' ? adminTabs : role === 'TEACHER' ? teacherTabs : studentTabs;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
      <nav className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[58px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
