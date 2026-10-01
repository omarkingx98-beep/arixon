import React from 'react';
import { ArrowUpRight, MessageCircle, MessageSquare } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SOCIAL_LINKS } from '../data/apps';
import { useAuth } from '../context/AuthContext';

interface CtaBannerProps {
  language: Language;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const { currentUser, openChat, openAuthModal } = useAuth();

  const handleStartProject = () => {
    if (currentUser) {
      openChat();
    } else {
      openAuthModal('signup');
    }
  };

  const whatsappUrl =
    language === 'ar' ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 bg-neutral-900 text-white dark:bg-neutral-950 dark:border dark:border-neutral-800 shadow-2xl">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t.ctaBanner.heading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              {t.ctaBanner.subtitle}
            </p>

            {/* Action buttons (Strict Monochrome) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <button
                onClick={handleStartProject}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all shadow-md whitespace-nowrap cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {currentUser
                    ? language === 'ar'
                      ? 'محادثة فورية مع الإدارة'
                      : 'Live Chat with Arixon'
                    : t.ctaBanner.buttonText}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl transition-all whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.ctaBanner.whatsappBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
