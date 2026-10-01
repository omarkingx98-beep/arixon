import React, { useState } from 'react';
import { ShieldAlert, LogIn, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from '../../firebase/config';
import { Language } from '../../types';
import { EriksonLogo } from '../EriksonLogo';

interface AdminUnauthorizedProps {
  language: Language;
  currentUserEmail?: string | null;
  onGoHome: () => void;
  onSignOut: () => void;
}

export const AdminUnauthorized: React.FC<AdminUnauthorizedProps> = ({
  language,
  currentUserEmail,
  onGoHome,
  onSignOut,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAr = language === 'ar';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
      } else {
        setError(err.message || (isAr ? 'فشل تسجيل الدخول بحساب Google' : 'Google sign-in failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-black text-neutral-900 dark:text-white">
      <div className="max-w-md w-full p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
          </div>
        </div>

        <div>
          <div className="flex justify-center mb-2">
            <EriksonLogo size="sm" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'غير مصرح بالدخول' : 'Access Restricted'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isAr
              ? 'لوحة الإدارة مخصصة حصرياً لحساب المؤسس المسؤول عبر Google مع تأكيد البريد الإلكتروني.'
              : 'The Arixon Admin Dashboard is strictly restricted to the administrator account via verified Google authentication.'}
          </p>
        </div>

        {currentUserEmail ? (
          <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="text-neutral-500 text-[11px] mb-1">
              {isAr ? 'أنت مسجل حالياً بالبريد:' : 'Currently signed in as:'}
            </div>
            <div className="font-mono font-bold text-neutral-900 dark:text-white truncate">
              {currentUserEmail}
            </div>
            <div className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
              {isAr ? `المطلوب: ${ADMIN_EMAIL}` : `Required: ${ADMIN_EMAIL}`}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs text-neutral-500 font-mono">
            {isAr ? 'لم يتم تسجيل الدخول بعد' : 'Not signed in'}
          </div>
        )}

        {error && (
          <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>
              {isAr ? 'تسجيل الدخول كمسؤول بحساب Google' : 'Sign in as Admin with Google'}
            </span>
          </button>

          {currentUserEmail && (
            <button
              onClick={onSignOut}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-800 transition-colors cursor-pointer"
            >
              {isAr ? 'تسجيل الخروج والتبديل' : 'Sign out & switch account'}
            </button>
          )}

          <button
            onClick={onGoHome}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'العودة للموقع الرئيسي' : 'Return to Home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
