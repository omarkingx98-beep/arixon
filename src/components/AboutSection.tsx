import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Github,
  Building,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SOCIAL_LINKS, omarPhotoUrl } from '../data/apps';
import { companyImages } from '../data/companyImages';
import { EriksonLogo } from './EriksonLogo';

interface AboutSectionProps {
  language: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  const [imageError, setImageError] = useState(false);
  const [studioImageError, setStudioImageError] = useState(false);
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  const studioImage = companyImages[2]; // Software Studio (Image 3)

  const whatsappUrl =
    language === 'ar' ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  return (
    <section id="about" className="py-24 sm:py-32 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            <span>{t.about.kicker}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'اريكسون' : 'Arixon'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {t.about.heading}
          </h2>
        </div>

        {/* Split Grid: Portrait & Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait on Soft Light-Gray Gradient Card */}
          <div className="lg:col-span-5">
            <div className="relative group max-w-md mx-auto lg:max-w-none">
              {/* Soft light-gray gradient card with a thin border and subtle shadow */}
              <div
                className="p-3 sm:p-3.5 bg-gradient-to-b from-neutral-100 via-neutral-200/50 to-neutral-100 dark:from-neutral-800/60 dark:via-neutral-900/70 dark:to-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xl shadow-black/5 dark:shadow-black/30 transition-all duration-300"
                style={{ borderRadius: '28px' }}
              >
                {!imageError ? (
                  <div
                    className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-950"
                    style={{ borderRadius: '24px' }}
                  >
                    <img
                      src={omarPhotoUrl}
                      alt={
                        language === 'ar'
                          ? 'عمر شراب - مؤسس ومدير اريكسون'
                          : 'Omar Shurrab - Founder & Lead Developer of Arixon'
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                      style={{
                        objectPosition: '50% 68%',
                        borderRadius: '24px',
                      }}
                      onError={() => setImageError(true)}
                    />

                    {/* Subtle Monochrome Scrim Overlay with Name & Role */}
                    <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white pointer-events-none">
                      <div className="text-xl font-bold tracking-tight">
                        {language === 'ar'
                          ? SOCIAL_LINKS.developerName.ar
                          : SOCIAL_LINKS.developerName.en}
                      </div>
                      <div className="text-xs text-neutral-300 font-medium mt-0.5">
                        {t.about.role}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Fallback: simple black rounded card with Arixon logo */
                  <div
                    className="w-full aspect-[4/5] bg-black text-white flex flex-col items-center justify-center p-8 text-center"
                    style={{ borderRadius: '24px' }}
                  >
                    <div className="mb-5">
                      <EriksonLogo size="xl" glow />
                    </div>
                    <div className="text-xl font-bold tracking-tight">
                      {language === 'ar' ? 'اريكسون' : 'Arixon'}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1 font-mono tracking-wider uppercase">
                      {language === 'ar' ? 'أنظمة برمجية متطورة' : 'Advanced Software Systems'}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="mt-4 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {t.about.statusTag}
                  </span>
                </div>
                <span className="font-mono text-neutral-500 dark:text-neutral-400 font-semibold">
                  {language === 'ar' ? 'اريكسون' : 'ARIXON'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Bio & Architecture Principles */}
          <div className="lg:col-span-7 space-y-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 space-y-4">
              <p>{t.about.bioParagraph1}</p>
              <p>{t.about.bioParagraph2}</p>
            </div>

            {/* Architecture Principles (Strict Monochrome Checklist) */}
            <div className="py-5 border-y border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                <span>
                  {language === 'ar'
                    ? 'هندسة ذاتية خالية من القوالب والمكتبات البطيئة'
                    : 'Bespoke zero-bloat architecture tailored to your domain'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                <span>
                  {language === 'ar'
                    ? 'عمل متواصل دون انقطاع حتى مع فقدان شبكة الإنترنت'
                    : 'Offline-first resilience with instant background sync'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                <span>
                  {language === 'ar'
                    ? 'تصميم واجهات أنيق يجمع بين فخامة أبل وسرعة تسلا'
                    : 'Clean minimalist UX blending luxury & engineering precision'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                <span>
                  {language === 'ar'
                    ? 'إشراف وتواصل مباشر مع المطور والمدير بدون وسيط'
                    : 'Direct communication with the founder & lead developer'}
                </span>
              </div>
            </div>

            {/* Action buttons (Strict Monochrome) */}
            <div className="pt-2 flex flex-col xs:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.about.chatWhatsApp}</span>
              </a>

              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-xl transition-all whitespace-nowrap border border-neutral-200 dark:border-neutral-800"
              >
                <Github className="w-4 h-4" />
                <span>{t.about.viewGitHub}</span>
              </a>

              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-xl transition-all whitespace-nowrap border border-neutral-200 dark:border-neutral-800"
              >
                <span>{language === 'ar' ? 'متابعة انستغرام' : 'Follow on Instagram'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        {/* Wide Studio Banner (Image 3: Software Studio Behind Stats / Development Hub) */}
        <div className="mt-16 sm:mt-24 flex flex-col">
          <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-xl group">
            {!studioImageError ? (
              <img
                src={studioImage.url}
                alt={isAr ? studioImage.title.ar : studioImage.title.en}
                loading="lazy"
                onError={() => setStudioImageError(true)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black text-white">
                <EriksonLogo size="xl" />
                <span className="mt-3 text-xs font-mono">Arixon Studio</span>
              </div>
            )}

            {/* Gradient overlay for aesthetic immersion */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            {/* Overlay Title */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white pointer-events-none">
              <div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-300">
                  {isAr ? 'بيئة التطوير الحقيقية' : 'Engineering Studio'}
                </span>
                <h3 className="text-lg sm:text-2xl font-bold mt-0.5">
                  {isAr ? studioImage.title.ar : studioImage.title.en}
                </h3>
              </div>
              <div className="hidden sm:block text-xs font-mono text-neutral-300">
                {isAr ? 'اريكسون للحلول البرمجية' : 'Arixon Software Systems'}
              </div>
            </div>
          </div>

          {/* Always-Visible Caption Below Image 3 */}
          <div className="mt-3.5 px-2">
            <span className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white block">
              {isAr ? studioImage.title.ar : studioImage.title.en}
            </span>
            <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 block mt-1 leading-relaxed">
              {isAr ? studioImage.description.ar : studioImage.description.en}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
