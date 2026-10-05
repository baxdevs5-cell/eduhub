import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { EduHubStore } from '../../services/dataStore';
import { NotificationItem } from '../../types';
import {
  X,
  Bell,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const notifications = EduHubStore.getNotifications();

  if (!isOpen) return null;

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    localStorage.setItem('eduhub_db_notifications', JSON.stringify(updated));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              {t('navNotifications')}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Barchasini o‘qilgan qilish
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Yangi bildirishnomalar mavjud emas
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border text-xs space-y-1.5 transition-all ${
                  notif.read
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-slate-900 border-teal-500/40 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {notif.type === 'point' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                    {notif.type === 'homework' && <BookOpen className="w-3.5 h-3.5 text-teal-500" />}
                    {notif.type === 'test' && <Award className="w-3.5 h-3.5 text-sky-500" />}
                    {notif.type === 'info' && <Info className="w-3.5 h-3.5 text-indigo-500" />}
                    <span>{notif.title}</span>
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
