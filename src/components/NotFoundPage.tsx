import React from 'react';
import { ArrowLeft, ArrowRight, Home, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { EriksonLogo } from './EriksonLogo';

interface NotFoundPageProps {
  language: Language;
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ language, onGoHome }) => {
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <EriksonLogo size="lg" glow={true} />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
            ERROR 404
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isAr
              ? 'عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله. يمكنك العودة إلى الصفحة الرئيسية وتصفح جميع التطبيقات.'
              : 'The requested resource or link could not be located. You can navigate back to the main showcase.'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-sm hover:opacity-90 transition-all shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{isAr ? 'العودة للرئيسية' : 'Return to Home'}</span>
          </button>
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-400">
          ARIXON ARCHITECTURE · STATUS: 404_NOT_FOUND
        </div>
      </div>
    </div>
  );
};
