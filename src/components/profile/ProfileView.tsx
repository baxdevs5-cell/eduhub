import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { EduHubStore } from '../../services/dataStore';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Save
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const users = EduHubStore.getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        fullName: fullName.trim(),
        email: email.trim(),
        bio: bio.trim()
      };
      EduHubStore.saveUsers(users);
      refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 text-center sm:text-left">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-teal-500 shadow-xl"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {currentUser.fullName}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {currentUser.role === 'ADMIN'
                  ? t('role_ADMIN')
                  : currentUser.role === 'TEACHER'
                  ? t('role_TEACHER')
                  : t('role_STUDENT')}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">{currentUser.phone}</p>
            {currentUser.className && (
              <p className="text-xs text-slate-400">Sinf: {currentUser.className}</p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">{t('myPoints')}</span>
            <div className="text-xl font-bold text-teal-600 dark:text-teal-400 tabular-nums mt-1">
              {currentUser.points}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">{t('currentLevel')}</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
              {currentUser.level}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">Faollik Seriyasi</span>
            <div className="text-xl font-bold text-amber-500 tabular-nums mt-1">
              {currentUser.streakDays} kun
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">{t('dailyUsageLabel')}</span>
            <div className="text-xl font-bold text-sky-600 dark:text-sky-400 tabular-nums mt-1">
              {currentUser.dailyUsage.count} / {currentUser.dailyUsage.max}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profil muvaffaqiyatli yangilandi!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('fullName')}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Elektron pochta (Ixtiyoriy)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Qisqacha ma'lumot (Bio)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Qiziqishlaringiz, maqsadlaringiz..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
