import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { EduHubStore } from '../../services/dataStore';
import {
  User,
  UserRole,
  ClassItem,
  AuditLog,
  AdminSettings,
  NotificationItem
} from '../../types';
import {
  Users,
  ShieldCheck,
  Settings,
  Activity,
  Plus,
  Trash2,
  Edit2,
  Slash,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Sliders,
  Smartphone,
  Award,
  Bell,
  BarChart3,
  BookOpen,
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react';

interface AdminPanelProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>(EduHubStore.getUsers());
  const [classes, setClasses] = useState<ClassItem[]>(EduHubStore.getClasses());
  const [settings, setSettings] = useState<AdminSettings>(EduHubStore.getSettings());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(EduHubStore.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'ADMIN'>('ALL');

  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [broadcastNotifOpen, setBroadcastNotifOpen] = useState(false);

  // New user form state
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('+998 ');
  const [newRole, setNewRole] = useState<UserRole>('STUDENT');
  const [newClassId, setNewClassId] = useState('class_1');
  const [newSubject, setNewSubject] = useState('');

  // Notification broadcast state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifRole, setNotifRole] = useState<'ALL' | 'STUDENTS' | 'TEACHERS'>('ALL');

  const recordAudit = (action: string, targetUserId?: string, targetUserName?: string, details = '') => {
    EduHubStore.addAuditLog({
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.fullName || 'Administrator',
      action,
      targetUserId,
      targetUserName,
      details,
      ipAddress: '195.158.24.12',
      userAgent: navigator.userAgent
    });
    setAuditLogs(EduHubStore.getAuditLogs());
  };

  const handleToggleSuspend = (targetUser: User) => {
    const newStatus: 'ACTIVE' | 'SUSPENDED' = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = users.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u));
    setUsers(updated);
    EduHubStore.saveUsers(updated);

    recordAudit(
      newStatus === 'SUSPENDED' ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
      targetUser.id,
      targetUser.fullName,
      `Hisob holati o'zgartirildi: ${newStatus}`
    );
  };

  const handleDeleteUser = (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      alert('Siz o‘z administrator hisobingizni o‘chira olmaysiz.');
      return;
    }
    if (!confirm(`${targetUser.fullName} hisobini rostdan ham o‘chirmoqchimisiz?`)) return;

    const updated = users.filter((u) => u.id !== targetUser.id);
    setUsers(updated);
    EduHubStore.saveUsers(updated);

    recordAudit('USER_DELETED', targetUser.id, targetUser.fullName, 'Hisob butunlay o‘chirildi');
  };

  const handleResetAccount = (targetUser: User) => {
    const updated = users.map((u) => {
      if (u.id === targetUser.id) {
        return {
          ...u,
          points: 0,
          level: 1,
          streakDays: 0,
          dailyUsage: { ...u.dailyUsage, count: 0 }
        };
      }
      return u;
    });
    setUsers(updated);
    EduHubStore.saveUsers(updated);

    recordAudit('ACCOUNT_RESET', targetUser.id, targetUser.fullName, 'Ballar va seriya qayta nollashtirildi');
    alert(`${targetUser.fullName} hisobining statistikasi tiklandi.`);
  };

  const handleChangeClass = (targetUser: User, newClassName: string) => {
    const foundClass = classes.find((c) => c.name === newClassName);
    const updated = users.map((u) => {
      if (u.id === targetUser.id) {
        return {
          ...u,
          className: newClassName,
          classId: foundClass?.id || u.classId
        };
      }
      return u;
    });
    setUsers(updated);
    EduHubStore.saveUsers(updated);

    recordAudit('USER_CLASS_CHANGED', targetUser.id, targetUser.fullName, `Yangi sinf: ${newClassName}`);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) return;

    const chosenClass = classes.find((c) => c.id === newClassId);

    const created: User = {
      id: 'usr_' + Date.now(),
      phone: newPhone.trim(),
      fullName: newFullName.trim(),
      role: newRole,
      avatarUrl: newRole === 'TEACHER'
        ? '/src/assets/images/eduhub_avatar_teacher_1791178000273.jpg'
        : '/src/assets/images/eduhub_avatar_student_1791178013935.jpg',
      classId: newRole === 'STUDENT' ? chosenClass?.id : undefined,
      className: newRole === 'STUDENT' ? chosenClass?.name : undefined,
      subject: newRole === 'TEACHER' ? newSubject : undefined,
      points: newRole === 'STUDENT' ? 50 : 0,
      level: 1,
      status: 'ACTIVE',
      dailyUsage: {
        date: new Date().toISOString().split('T')[0],
        count: 0,
        max: newRole === 'TEACHER' ? settings.defaultDailyLimitTeacher : settings.defaultDailyLimitStudent
      },
      streakDays: 1,
      createdAt: new Date().toISOString()
    };

    const updated = [created, ...users];
    setUsers(updated);
    EduHubStore.saveUsers(updated);

    recordAudit('ADMIN_USER_CREATED', created.id, created.fullName, `Admin tomonidan yangi ${created.role} qo‘shildi`);

    setIsAddUserOpen(false);
    setNewFullName('');
    setNewPhone('+998 ');
  };

  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    EduHubStore.addNotification({
      targetRole: notifRole,
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: 'info'
    });

    recordAudit('NOTIFICATION_BROADCAST', undefined, undefined, `Xabar: "${notifTitle}" (${notifRole})`);

    setBroadcastNotifOpen(false);
    setNotifTitle('');
    setNotifMessage('');
    alert('Tizimli bildirishnoma yuborildi!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    EduHubStore.saveSettings(settings);
    recordAudit('SETTINGS_SAVED', undefined, undefined, 'Admin tizim sozlamalarini yangiladi');
    alert('Sozlamalar muvaffaqiyatli saqlandi!');
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  const studentsCount = users.filter((u) => u.role === 'STUDENT').length;
  const teachersCount = users.filter((u) => u.role === 'TEACHER').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Admin Command Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EduHub Root Administrator Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            {t('adminDashboardTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Foydalanuvchilar nazorati, audit jurnallari, ballar tizimi va xavfsizlik konfiguratsiyasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addUser')}</span>
          </button>

          <button
            onClick={() => setBroadcastNotifOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            <span>Xabar yuborish</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'dashboard', label: t('navDashboard') },
          { id: 'users', label: `${t('navStudents')} & ${t('navTeachers')}` },
          { id: 'security', label: t('auditLogs') },
          { id: 'settings', label: t('adminSettings') },
          { id: 'gateway', label: t('navAuthGateway') }
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

      {/* 1. Dashboard KPIs */}
      {currentTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">{t('totalStudents')}</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-teal-600 dark:text-teal-400 tabular-nums mt-1">
                {studentsCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">{t('totalTeachers')}</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-sky-600 dark:text-sky-400 tabular-nums mt-1">
                {teachersCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">{t('totalClasses')}</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-indigo-600 dark:text-indigo-400 tabular-nums mt-1">
                {classes.length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">{t('activeUsers')}</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
                {users.filter((u) => u.status === 'ACTIVE').length}
              </div>
            </div>
          </div>

          {/* Quick User Management preview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Foydalanuvchilar Ro‘yxati
              </h3>
              <button
                onClick={() => onSelectTab('users')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Foydalanuvchi</th>
                    <th className="py-2.5 px-3">Rol</th>
                    <th className="py-2.5 px-3">Telefon</th>
                    <th className="py-2.5 px-3">Holat</th>
                    <th className="py-2.5 px-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.slice(0, 5).map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-6 h-6 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span>{u.fullName}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                              : u.role === 'TEACHER'
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                              : 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{u.phone}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold ${
                            u.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleToggleSuspend(u)}
                          className="text-slate-400 hover:text-slate-900 dark:hover:text-white mr-2"
                          title={u.status === 'ACTIVE' ? t('suspendUser') : t('activateUser')}
                        >
                          <Slash className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Full Users Management (Students & Teachers) */}
      {currentTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Foydalanuvchilarni Boshqarish
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                O‘quvchi va o‘qituvchilarni qo‘shish, tahrirlash, bloklash, sinf biriktirish
              </p>
            </div>

            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addUser')}</span>
            </button>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ism yoki telefon bo‘yicha qidirish..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-stretch sm:self-auto">
              {(['ALL', 'STUDENT', 'TEACHER', 'ADMIN'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    roleFilter === r
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {r === 'ALL' ? 'Barchasi' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Foydalanuvchi</th>
                    <th className="py-3 px-3">Rol</th>
                    <th className="py-3 px-3">Sinf / Fan</th>
                    <th className="py-3 px-3">Telefon</th>
                    <th className="py-3 px-3">Ball</th>
                    <th className="py-3 px-3">Holat</th>
                    <th className="py-3 px-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-7 h-7 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div>{u.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">#{u.id}</div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                              : u.role === 'TEACHER'
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                              : 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {u.role === 'STUDENT' ? (
                          <select
                            value={u.className || '10-A sinf'}
                            onChange={(e) => handleChangeClass(u, e.target.value)}
                            className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-[11px]"
                          >
                            {classes.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{u.subject || '—'}</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-500">{u.phone}</td>

                      <td className="py-3 px-3 font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                        {u.points} ball
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleSuspend(u)}
                            className="p-1 rounded text-slate-400 hover:text-amber-500"
                            title={u.status === 'ACTIVE' ? t('suspendUser') : t('activateUser')}
                          >
                            <Slash className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleResetAccount(u)}
                            className="p-1 rounded text-slate-400 hover:text-sky-500"
                            title={t('resetAccount')}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500"
                            title={t('deleteUser')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Audit & Security Logs */}
      {currentTab === 'security' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Xavfsizlik & Audit Jurnali
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Har bir ma'muriy harakat, foydalanuvchi o‘zgarishi va xavfsizlik voqealari IP va vaqt bilan saqlanadi
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {log.adminName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {log.action}
                      </span>
                      {log.targetUserName && (
                        <span className="text-slate-500">
                          → {log.targetUserName}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      IP: {log.ipAddress} · {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-[11px] pt-1">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Admin Settings */}
      {currentTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {t('adminSettings')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ta'lim platformasining asosiy parametrlarini sozlash
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Platforma nomi
                </label>
                <input
                  type="text"
                  value={settings.appName}
                  onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  SMS Shlyuzi provayderi
                </label>
                <select
                  value={settings.smsProvider}
                  onChange={(e) => setSettings({ ...settings, smsProvider: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="mock">Simulated Gateway (Zero-Cost Dev Testing)</option>
                  <option value="eskiz">Eskiz.uz SMS Provider (Uzbekistan)</option>
                  <option value="twilio">Twilio Global SMS</option>
                  <option value="firebase">Firebase Phone Authentication</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  O‘quvchilar uchun kunlik bepul mashq limiti
                </label>
                <input
                  type="number"
                  value={settings.defaultDailyLimitStudent}
                  onChange={(e) => setSettings({ ...settings, defaultDailyLimitStudent: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  O‘qituvchilar uchun kunlik harakat limiti
                </label>
                <input
                  type="number"
                  value={settings.defaultDailyLimitTeacher}
                  onChange={(e) => setSettings({ ...settings, defaultDailyLimitTeacher: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Har bir uy vazifasi uchun tavsiya etilgan ball
                </label>
                <input
                  type="number"
                  value={settings.pointsPerHomework}
                  onChange={(e) => setSettings({ ...settings, pointsPerHomework: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Har bir til mashqi uchun ball
                </label>
                <input
                  type="number"
                  value={settings.pointsPerLanguageExercise}
                  onChange={(e) => setSettings({ ...settings, pointsPerLanguageExercise: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md transition-all"
              >
                {t('saveSettings')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. SMS Gateway & Auth Security Section */}
      {currentTab === 'gateway' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              SMS Shlyuzi va Autentifikatsiya Integratsiyasi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tashqi provayderlar va xavfsiz SMS tasdiqlash protokoli
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-teal-800 dark:text-teal-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Nolinchi Xarajatli Sinov Rejimi Faol (Dev Sandbox Mode)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Tizim sinov jarayonida SMS xarajatlari talab qilmasligi uchun serverda avtomatik xavfsiz kod simulyatsiyasidan foydalanadi. Shu bilan birga, kodlar mijoz brauzerida ochiq matn (plain-text) holida saqlanmaydi va to‘liq server sessiyasi orqali tasdiqlanadi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Eskiz.uz SMS</span>
                  <span className="text-[10px] text-teal-600 font-mono">Tayyor</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  O‘zbekiston aloqa operatorlari (Ucell, Beeline, Mobiuz, Uztelecom) uchun rasmiy SMS shlyuzi.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Firebase Phone Auth</span>
                  <span className="text-[10px] text-sky-600 font-mono">Tayyor</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Google Cloud Firebase orqali xalqaro va lokal raqamlarni SMS OTP bilan tekshirish.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Twilio SMS</span>
                  <span className="text-[10px] text-indigo-600 font-mono">Tayyor</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Dunyo bo‘ylab 180+ davlatga 2-faktorli tasdiqlash kodlarini yetkazib berish.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              {t('addUser')}
            </h3>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  To‘liq ism-familiya
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ism Familiya"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon raqam
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+998 (90) 123-45-67"
                  className="w-full p-2.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rol
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="STUDENT">O‘quvchi (Student)</option>
                  <option value="TEACHER">O‘qituvchi (Teacher)</option>
                  <option value="ADMIN">Administrator (Admin)</option>
                </select>
              </div>

              {newRole === 'STUDENT' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sinf
                  </label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newRole === 'TEACHER' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fan
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Masalan: Informatika"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Foydalanuvchini qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Broadcast Notification */}
      {broadcastNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Tizimli Xabar Tarqatish
            </h3>

            <form onSubmit={handleBroadcastNotification} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Qabul qiluvchilar
                </label>
                <select
                  value={notifRole}
                  onChange={(e) => setNotifRole(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="ALL">Barchaga (O‘quvchilar va O‘qituvchilar)</option>
                  <option value="STUDENTS">Faqat O‘quvchilarga</option>
                  <option value="TEACHERS">Faqat O‘qituvchilarga</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Xabar sarlavhasi
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="Masalan: Tizim profilaktikasi yoki bayram tabrigi"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Xabar matni
                </label>
                <textarea
                  required
                  rows={4}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Batafsil xabarnoma..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBroadcastNotifOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Xabarni tarqatish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
