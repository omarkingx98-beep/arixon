import React, { useEffect } from 'react';
import {
  X,
  CheckCircle,
  ArrowUpRight,
  MessageCircle,
  Layers,
  Github,
  ExternalLink,
  Send,
} from 'lucide-react';
import { Language, PortfolioApp } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SOCIAL_LINKS } from '../data/apps';
import { AppDeviceFrame } from './AppDeviceFrame';

interface AppDetailModalProps {
  app: PortfolioApp | null;
  language: Language;
  onClose: () => void;
  onRequestSolution: (appName: string, appId?: string) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  language,
  onClose,
  onRequestSolution,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (app) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [app, onClose]);

  if (!app) return null;

  const appName = app.name[language];
  const appDesc = app.description[language];
  const features = app.features?.[language] || [];

  const whatsappInquiryUrl = `https://wa.me/970594399472?text=${encodeURIComponent(
    isAr
      ? `مرحباً، أود الاستفسار وطلب نظام مشابه لتطبيق (${appName}).`
      : `Hello, I'd like to ask about and request the app (${appName}).`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card (Pure Monochrome) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-3xl my-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 transition-all duration-300 animate-in zoom-in-95"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              {app.categoryLabel[language]}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              {app.year}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label={t.modal.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Title & Links */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h3 id="modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {appName}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {appDesc}
              </p>
            </div>

            {/* Quick Links (GitHub / Live Demo) */}
            <div className="flex items-center gap-2 shrink-0">
              {app.githubUrl && (
                <a
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white transition-all shadow-xs"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}

              {app.liveDemoUrl && (
                <a
                  href={app.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 text-xs font-semibold transition-all shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t.modal.openLiveDemo}</span>
                </a>
              )}
            </div>
          </div>

          {/* Interface Preview (HTML/CSS Device Frame with neutral sample content & small label) */}
          <div className="py-2">
            <AppDeviceFrame
              appId={app.id}
              language={language}
              screenshotUrl={app.screenshotUrl}
            />
          </div>

          {/* What it does / Features List (Hidden if empty) */}
          {features.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
                {isAr ? 'ماذا يقدم هذا التطبيق' : 'What it does'}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    <CheckCircle className="w-4 h-4 text-neutral-900 dark:text-white mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {app.techStack && app.techStack.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{t.modal.techStack}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {app.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions: "Request this app" & "Chat on WhatsApp" */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              {isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}
            </span>
          </a>

          <button
            onClick={() => {
              onRequestSolution(appName, app.id);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAr ? 'طلب هذا التطبيق' : 'Request this app'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
