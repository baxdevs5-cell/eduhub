import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { EduHubAuthService } from '../../services/api';
import { EduHubLogo } from '../brand/EduHubLogo';
import {
  X,
  Phone,
  KeyRound,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { t } = useLanguage();
  const { refreshUser, quickLogin } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('+998 ');
  const [code, setCode] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dev simulation notice: in dev mode, server provides masked dev hint so testing costs zero money
  const [devHint, setDevHint] = useState<string | null>(null);

  // Registration specifics (Normal users can only choose STUDENT or TEACHER. NEVER ADMIN.)
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [fullName, setFullName] = useState('');
  const [selectedClass, setSelectedClass] = useState('10-A sinf');
  const [selectedSubject, setSelectedSubject] = useState('Informatika');

  useEffect(() => {
    setMode(initialMode);
    setStep('phone');
    setErrorMsg(null);
    setSuccessMsg(null);
    setCode('');
    setDevHint(null);
  }, [isOpen, initialMode]);

  // Resend timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    setErrorMsg(null);
    // Allow friendly phone typing with +998
    if (!val.startsWith('+998')) {
      setPhone('+998 ');
    } else {
      setPhone(val);
    }
  };

  const handleSendSms = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const rawDigits = phone.replace(/[^\d]/g, '');
    if (rawDigits.length < 11) {
      setErrorMsg(t('phoneRequired'));
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setErrorMsg('Iltimos, to‘liq ism-familiyangizni kiriting');
      return;
    }

    try {
      setLoading(true);
      const res = await EduHubAuthService.sendSms(phone);
      if (res.success) {
        setSessionId(res.sessionId);
        setStep('code');
        setTimer(60);
        setSuccessMsg(t('smsSentSuccess'));
        if (res.devHintCode) {
          setDevHint(res.devHintCode);
        }
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'SMS yuborishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySms = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sessionId) return;
    if (code.trim().length < 6) {
      setErrorMsg('SMS tasdiqlash kodi 6 ta raqamdan iborat bo‘lishi shart');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const regPayload =
        mode === 'register'
          ? {
              fullName: fullName.trim(),
              role: selectedRole,
              className: selectedRole === 'STUDENT' ? selectedClass : undefined,
              subject: selectedRole === 'TEACHER' ? selectedSubject : undefined
            }
          : undefined;

      const res = await EduHubAuthService.verifySms(sessionId, code.trim(), regPayload);

      if (res.success && res.user) {
        refreshUser();
        onClose();
      } else {
        setErrorMsg(res.message || t('invalidCode'));
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Kodni tasdiqlashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    quickLogin(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <EduHubLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {mode === 'login' ? t('authTitleLogin') : t('authTitleRegister')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('authSubtitle')}
            </p>
          </div>

          {/* Toggle Login / Register */}
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 mb-5">
            <button
              onClick={() => {
                setMode('login');
                setStep('phone');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t('loginBtn')}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setStep('phone');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t('registerBtn')}
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/50 flex items-center gap-2.5 text-xs text-teal-700 dark:text-teal-300">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Step 1: Phone input & registration details */}
          {step === 'phone' && (
            <form onSubmit={handleSendSms} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ism va familiya"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('chooseRole')}
                    </label>
                    {/* Role selector - Admin is strictly prohibited for standard signup */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('STUDENT')}
                        className={`flex items-center justify-center gap-2 p-2.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedRole === 'STUDENT'
                            ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>{t('roleStudent')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('TEACHER')}
                        className={`flex items-center justify-center gap-2 p-2.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedRole === 'TEACHER'
                            ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{t('roleTeacher')}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      {t('roleAdminInfo')}
                    </p>
                  </div>

                  {selectedRole === 'STUDENT' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('selectClass')}
                      </label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                      >
                        <option value="10-A sinf">10-A sinf</option>
                        <option value="11-B sinf">11-B sinf</option>
                        <option value="9-V sinf">9-V sinf</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('selectSubject')}
                      </label>
                      <input
                        type="text"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        placeholder="Informatika, Matematika..."
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('phoneNumber')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white tracking-wide"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t('getSmsCode')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: SMS Verification Code */}
          {step === 'code' && (
            <form onSubmit={handleVerifySms} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t('enterSmsCode')}
                  </label>
                  <span className="text-xs text-slate-500 font-mono">{phone}</span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full pl-10 pr-3.5 py-3 text-center text-lg font-mono tracking-[0.5em] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Dev hint indicator for zero-cost instant verification */}
                {devHint && (
                  <div className="mt-2.5 p-2 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-lg flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300">
                    <span>Demo SMS test kodi: <strong className="font-mono text-xs">{devHint}</strong></span>
                    <button
                      type="button"
                      onClick={() => setCode(devHint)}
                      className="text-[10px] font-bold text-amber-700 dark:text-amber-400 underline hover:no-underline"
                    >
                      Kiritish
                    </button>
                  </div>
                )}
              </div>

              {/* Resend Code with Countdown */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                {timer > 0 ? (
                  <span>
                    {t('resendCodeIn')}: <strong className="font-mono text-teal-600 dark:text-teal-400">{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendSms()}
                    className="text-teal-600 dark:text-teal-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t('resendNow')}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setErrorMsg(null);
                  }}
                  className="hover:underline text-slate-400"
                >
                  Raqamni o‘zgartirish
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 active:scale-[0.98] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{mode === 'login' ? t('verifyAndLogin') : t('verifyAndRegister')}</span>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Login Fallback Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('quickDemoLogin')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                className="py-2 px-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors truncate"
              >
                👨🎓 {t('roleStudent')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('TEACHER')}
                className="py-2 px-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors truncate"
              >
                👨🏫 {t('roleTeacher')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="py-2 px-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors truncate"
              >
                👑 {t('role_ADMIN')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
