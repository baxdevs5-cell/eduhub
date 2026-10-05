import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { LandingHero } from './components/home/LandingHero';
import { StudentPanel } from './components/student/StudentPanel';
import { TeacherPanel } from './components/teacher/TeacherPanel';
import { AdminPanel } from './components/admin/AdminPanel';
import { ProfileView } from './components/profile/ProfileView';
import { AuthModal } from './components/auth/AuthModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { EduHubStore } from './services/dataStore';

function EduHubMain() {
  const { currentUser, role, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = EduHubStore.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Role-Based Route Protection Guard
  const renderPanel = () => {
    if (!isAuthenticated || !currentUser) {
      return (
        <LandingHero
          onOpenAuth={handleOpenAuth}
          onSelectTab={(tab) => setActiveTab(tab)}
        />
      );
    }

    if (activeTab === 'profile') {
      return <ProfileView />;
    }

    // Role-specific panels
    if (role === 'STUDENT') {
      return <StudentPanel currentTab={activeTab} onSelectTab={setActiveTab} />;
    }

    if (role === 'TEACHER') {
      return <TeacherPanel currentTab={activeTab} onSelectTab={setActiveTab} />;
    }

    if (role === 'ADMIN') {
      return <AdminPanel currentTab={activeTab} onSelectTab={setActiveTab} />;
    }

    return (
      <LandingHero
        onOpenAuth={handleOpenAuth}
        onSelectTab={(tab) => setActiveTab(tab)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuthModal={() => handleOpenAuth('login')}
        unreadCount={unreadCount}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      <main className="flex-1 w-full pb-20 md:pb-10">
        {renderPanel()}
      </main>

      {/* Footer */}
      <footer className="hidden md:block py-6 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 font-display">EduHub</span>
            <span>—</span>
            <span>Ta'limning yangi avlodi</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Xavfsiz SMS Autentifikatsiya</span>
            <span>·</span>
            <span>CEFR A1–C2 Tillar</span>
            <span>·</span>
            <span>RBAC Xavfsizlik Nazorati</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuthModal={() => handleOpenAuth('login')}
      />

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <EduHubMain />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
