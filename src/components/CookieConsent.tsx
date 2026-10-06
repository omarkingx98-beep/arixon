import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/sound';
import { initializeAnalyticsIfConsented } from '../firebase/config';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  timestamp: string;
}

const COOKIE_STORAGE_KEY = 'arixon_cookie_consent';

interface CookieConsentProps {
  language: Language;
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
  onConsentChange?: (prefs: CookiePreferences) => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  language,
  isOpenOverride,
  onCloseOverride,
  onConsentChange,
}) => {
  const isAr = language === 'ar';
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!saved) {
      // Show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed: CookiePreferences = JSON.parse(saved);
        setAnalyticsEnabled(parsed.analytics);
        if (parsed.analytics) {
          initializeAnalyticsIfConsented();
        }
        if (onConsentChange) onConsentChange(parsed);
      } catch (_) {}
    }
  }, []);

  // Handle open override (when triggered from footer link)
  useEffect(() => {
    if (isOpenOverride) {
      setIsVisible(true);
      setIsCustomizing(true);
    }
  }, [isOpenOverride]);

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch (_) {}
    if (prefs.analytics) {
      initializeAnalyticsIfConsented();
    }
    setIsVisible(false);
    setIsCustomizing(false);
    if (onCloseOverride) onCloseOverride();
    if (onConsentChange) onConsentChange(prefs);
  };

  const handleAcceptAll = () => {
    sound.playClick();
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsEnabled(true);
    savePreferences(prefs);
  };

  const handleRejectNonEssential = () => {
    sound.playClick();
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsEnabled(false);
    savePreferences(prefs);
  };

  const handleSaveCustom = () => {
    sound.playClick();
    const prefs: CookiePreferences = {
      essential: true,
      analytics: analyticsEnabled,
      timestamp: new Date().toISOString(),
    };
    savePreferences(prefs);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label={isAr ? 'إشعار ملفات تعريف الارتباط' : 'Cookie Consent Notice'}
      className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:end-6 sm:max-w-lg z-50 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-300 dark:border-neutral-800 shadow-2xl text-neutral-900 dark:text-white space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">
                {isAr ? 'خصوصيتك وخيارات ملفات الارتباط' : 'Privacy & Cookie Preferences'}
              </h4>
              <p className="text-[11px] text-neutral-500 font-mono">
                ARIXON PRIVACY COMPLIANCE
              </p>
            </div>
          </div>

          {isOpenOverride && (
            <button
              onClick={() => {
                setIsVisible(false);
                if (onCloseOverride) onCloseOverride();
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body Text */}
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {isAr
            ? 'نستخدم ملفات تعريف الارتباط الأساسية لتمكين عمل الجلسة واللغة والوضع الليلي، وملفات تحليلية اختيارية عبر Firebase Analytics لتحسين جودة الأنظمة دون جمع أي بيانات شخصية حساسة.'
            : 'We use essential cookies to manage your secure session, language, and theme, plus optional privacy-respecting analytics to optimize system performance.'}
        </p>

        {/* Customization Details Accordion */}
        {isCustomizing && (
          <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
            {/* Essential (Always On) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-750">
              <div>
                <span className="font-bold block text-neutral-900 dark:text-white">
                  {isAr ? 'ملفات الارتباط الأساسية (Essential)' : 'Essential Cookies'}
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  {isAr ? 'ضرورية لعمل الموقع والمصادقة وتفضيلاتك (مفعلة دائماً)' : 'Required for sessions, auth, and theme (Always Active)'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 font-bold">
                {isAr ? 'إلزامية' : 'ALWAYS ON'}
              </span>
            </div>

            {/* Analytics (Optional) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-750">
              <div>
                <span className="font-bold block text-neutral-900 dark:text-white">
                  {isAr ? 'ملفات التحليل والأداء (Analytics)' : 'Analytics & Performance'}
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  {isAr ? 'تساعدنا على قياس سرعة الأنظمة واستقرارها عبر Firebase' : 'Helps us measure system stability & latency via Firebase'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  analyticsEnabled ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-black transition-transform ${
                    analyticsEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Buttons Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          {!isCustomizing ? (
            <>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all cursor-pointer shadow-sm"
              >
                {isAr ? 'قبول الكل' : 'Accept all'}
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="w-full sm:flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all cursor-pointer border border-neutral-200 dark:border-neutral-700"
              >
                {isAr ? 'رفض غير الضرورية' : 'Reject non-essential'}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsCustomizing(true);
                }}
                className="w-full sm:w-auto py-2.5 px-3 rounded-xl font-semibold text-xs text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isAr ? 'تخصيص' : 'Customize'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all cursor-pointer shadow-sm"
              >
                {isAr ? 'حفظ الخيارات المحددة' : 'Save preferences'}
              </button>
              <button
                onClick={() => setIsCustomizing(false)}
                className="py-2.5 px-3 rounded-xl font-semibold text-xs text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
