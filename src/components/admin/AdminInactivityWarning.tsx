import React from 'react';
import { AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';

interface AdminInactivityWarningProps {
  language: Language;
  secondsRemaining: number;
  onStaySignedIn: () => void;
  onSignOutNow: () => void;
}

export const AdminInactivityWarning: React.FC<AdminInactivityWarningProps> = ({
  language,
  secondsRemaining,
  onStaySignedIn,
  onSignOutNow,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <Clock className="w-7 h-7 animate-pulse" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            {isAr ? 'تنبيه انتهاء الجلسة لعدم النشاط' : 'Inactivity Timeout Warning'}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isAr
              ? `لحماية أمان لوحة التحكم، سيتم تسجيل خروجك تلقائياً خلال ${secondsRemaining} ثانية لعدم وجود نشاط.`
              : `For security, your admin session will automatically terminate in ${secondsRemaining} seconds due to inactivity.`}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 font-mono text-2xl font-black text-amber-600 dark:text-amber-400 border border-neutral-200 dark:border-neutral-800">
          <span>00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={onStaySignedIn}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'البقاء متصلاً' : 'Stay Signed In'}</span>
          </button>
          <button
            onClick={onSignOutNow}
            className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-800 transition-colors cursor-pointer"
          >
            {isAr ? 'تسجيل الخروج الآن' : 'Sign Out Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
