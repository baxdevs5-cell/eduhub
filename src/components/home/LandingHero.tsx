import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Globe2,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingHeroProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSelectTab: (tab: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenAuth, onSelectTab }) => {
  const { t } = useLanguage();
  const { isAuthenticated, quickLogin } = useAuth();

  const handleQuickPreview = (role: UserRole) => {
    quickLogin(role);
    onSelectTab('dashboard');
  };

  return (
    <div className="w-full space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs font-semibold text-teal-800 dark:text-teal-300">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>EduHub 2026 Academic Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
                Ta'limning yangi avlodi.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed text-balance">
                EduHub — o‘quvchi, o‘qituvchi va ta’lim boshqaruvini bitta platformada birlashtiradi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2 min-h-[48px]"
                >
                  <span>{t('registerBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all min-h-[48px]"
                >
                  {t('loginBtn')}
                </button>
              </div>

              {/* Instant Reviewer Fast-Access Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  {t('quickDemoLogin')}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickPreview('STUDENT')}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800 transition-colors flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>👨🎓 {t('demoStudent')}</span>
                  </button>
                  <button
                    onClick={() => handleQuickPreview('TEACHER')}
                    className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-800 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800 transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>👨🏫 {t('demoTeacher')}</span>
                  </button>
                  <button
                    onClick={() => handleQuickPreview('ADMIN')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>👑 {t('demoAdmin')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Visual Element */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900">
                <img
                  src="/src/assets/images/eduhub_hero_visual_1791177970194.jpg"
                  alt="EduHub Platform Visual"
                  className="w-full h-auto object-cover aspect-[16/9] hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    <span>Xavfsiz SMS Autentifikatsiya</span>
                  </div>
                  <h3 className="text-white text-lg font-bold font-display mt-1">
                    Barcha ta'lim subyektlari yagona ekotizimda
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Panels Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            Uchta Mustaqil Boshqaruv Muhiti
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
            Har bir rol uchun moslashtirilgan professional interfeys
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel 1: Student */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                👨🎓 O‘quvchi Paneli
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Vazifalarni topshirish, interaktiv testlar, 6 ta tilda darajali mashqlar, to‘plangan ballar va yutuq nishonlari.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>Uy vazifasini topshirish va baholarni ko‘rish</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>A1–C2 bosqichli 6 ta til mashqi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>Sinf reytingi va 8 ta avtomatik yutuq</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickPreview('STUDENT')}
              className="mt-6 w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-xs font-bold transition-colors"
            >
              O‘quvchi sifatida kirish
            </button>
          </div>

          {/* Panel 2: Teacher */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                👨🏫 O‘qituvchi Paneli
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sinflar nazorati, vazifalar yaratish va tekshirish, test konstruktori, elektron davomat va qo‘lda ball berish.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Vazifalarni tekshirish va xulosa berish</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Interaktiv testlar yaratish</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Matritsali davomat va rag‘batlantirish</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickPreview('TEACHER')}
              className="mt-6 w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-xs font-bold transition-colors"
            >
              O‘qituvchi sifatida kirish
            </button>
          </div>

          {/* Panel 3: Admin */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                👑 Admin Paneli
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                To‘liq platforma nazorati: foydalanuvchilarni bloklash, sinf o‘zgartirish, xavfsizlik audit jurnali, kunlik limitlar.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>O‘quvchi va o‘qituvchilarni to‘liq boshqarish</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>IP/Vaqt bo‘yicha to‘liq xavfsizlik audit logi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Ballar va kunlik limitlarni sozlash</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickPreview('ADMIN')}
              className="mt-6 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors"
            >
              Admin sifatida kirish
            </button>
          </div>
        </div>
      </section>

      {/* Security & Multi-Language Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden border border-slate-800">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display">SMS Orqali Xavfsiz Kirish</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Parollarni saqlash yoki o‘g‘irlash xavfisiz, faqat tasdiqlangan telefon raqami va bir martalik SMS kod bilan himoyalangan tizim.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display">3 Tilda To‘liq Interfeys</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                O‘zbek tili, rus tili va ingliz tillarida har bir tugma, bildirishnoma, dars va ma'muriy boshqaruv to‘liq mahalliylashtirilgan.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold font-display">Merit Ball & Yutuqlar</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vazifalar, testlar va til mashqlari orqali avtomatik ballar to‘planadi, unvonlar ochiladi va davomat hisobga olinadi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
