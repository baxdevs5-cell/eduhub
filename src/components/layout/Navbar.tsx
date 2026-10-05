import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { EduHubLogo } from '../brand/EduHubLogo';
import {
  Sun,
  Moon,
  Globe,
  LogOut,
  Sparkles,
  ChevronDown,
  UserCheck,
  ShieldAlert,
  Bell
} from 'lucide-react';
import { LanguageCode, UserRole } from '../../types';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuthModal?: () => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAuthModal,
  unreadCount = 0,
  onOpenNotifications
}) => {
  const { currentUser, role, isAuthenticated, logout, quickLogin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'uz', label: 'O‘zbekcha', flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center text-left focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1"
          >
            <EduHubLogo size="md" />
          </button>

          {/* Role badge if logged in */}
          {isAuthenticated && role && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <span>
                {role === 'ADMIN'
                  ? t('role_ADMIN')
                  : role === 'TEACHER'
                  ? t('role_TEACHER')
                  : t('role_STUDENT')}
              </span>
            </div>
          )}
        </div>

        {/* Zone 2: Desktop Contextual Nav Links (Clean typography, no pill sandbagging) */}
        {isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navDashboard')}
            </button>

            {role === 'STUDENT' && (
              <>
                <button
                  onClick={() => onSelectTab('homework')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'homework'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navHomework')}
                </button>
                <button
                  onClick={() => onSelectTab('tests')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'tests'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navTests')}
                </button>
                <button
                  onClick={() => onSelectTab('languages')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'languages'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navLanguages')}
                </button>
                <button
                  onClick={() => onSelectTab('achievements')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'achievements'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navAchievements')}
                </button>
              </>
            )}

            {role === 'TEACHER' && (
              <>
                <button
                  onClick={() => onSelectTab('classes')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'classes'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navClasses')}
                </button>
                <button
                  onClick={() => onSelectTab('homework')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'homework'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navHomework')}
                </button>
                <button
                  onClick={() => onSelectTab('tests')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'tests'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navTests')}
                </button>
                <button
                  onClick={() => onSelectTab('attendance')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'attendance'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navAttendance')}
                </button>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <button
                  onClick={() => onSelectTab('users')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'users'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navStudents')} & {t('navTeachers')}
                </button>
                <button
                  onClick={() => onSelectTab('security')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'security'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navSecurity')}
                </button>
                <button
                  onClick={() => onSelectTab('settings')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('navSettings')}
                </button>
              </>
            )}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>{t('heroSubtitle')}</span>
          </div>
        )}

        {/* Zone 3: Actions (Theme, Language, Notifications, Auth/Role) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Usage Indicator for Student/Teacher */}
          {isAuthenticated && currentUser && role !== 'ADMIN' && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">{t('dailyUsageLabel')}:</span>
              <span className="font-bold tabular-nums text-teal-600 dark:text-teal-400">
                {currentUser.dailyUsage.count} / {currentUser.dailyUsage.max}
              </span>
            </div>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 min-h-[44px] min-w-[44px] px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      language === l.code ? 'font-bold text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Button */}
          {isAuthenticated && (
            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center min-h-[44px] min-w-[44px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          )}

          {/* Instant Role Preview Dropdown (Zero-friction reviewer mode for all 3 panels) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
              title="Panelni almashtirish (Demo test)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Rolni sinash</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50">
                <div className="px-3 py-1 text-[11px] font-medium text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  {t('quickDemoLogin')}
                </div>
                <button
                  onClick={() => {
                    quickLogin('STUDENT');
                    setDemoMenuOpen(false);
                    onSelectTab('dashboard');
                  }}
                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <UserCheck className="w-3.5 h-3.5 text-teal-500" />
                  <span>👨🎓 {t('demoStudent')}</span>
                </button>
                <button
                  onClick={() => {
                    quickLogin('TEACHER');
                    setDemoMenuOpen(false);
                    onSelectTab('dashboard');
                  }}
                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                  <span>👨🏫 {t('demoTeacher')}</span>
                </button>
                <button
                  onClick={() => {
                    quickLogin('ADMIN');
                    setDemoMenuOpen(false);
                    onSelectTab('dashboard');
                  }}
                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                  <span>👑 {t('demoAdmin')}</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Logout or Login Button */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title={currentUser.fullName}
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-900 dark:text-white max-w-[110px] truncate">
                  {currentUser.fullName}
                </span>
              </button>

              <button
                onClick={logout}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg transition-colors"
                title={t('logout')}
                aria-label={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
            >
              {t('loginBtn')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
