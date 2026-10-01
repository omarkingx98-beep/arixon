import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { introVideo, INTRO_VIDEO_YOUTUBE_URL } from '../data/videoConfig';

interface MeetArixonSectionProps {
  language: Language;
}

export const MeetArixonSection: React.FC<MeetArixonSectionProps> = ({
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  // Embed URL with optimized parameters for direct in-page browsing
  const directEmbedUrl = `https://www.youtube-nocookie.com/embed/${introVideo.youtubeId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <section
      id="meet-arixon"
      className="py-16 sm:py-24 relative overflow-hidden bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300"
    >
      {/* Background subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 mb-3 select-none">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
            <span>{t.meetArixon?.kicker || (isAr ? 'العرض التعريفي المباشر' : 'Arixon Showcase')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {t.meetArixon?.title || (isAr ? 'تعرّف على اريكسون' : 'Meet Arixon')}
          </h2>

          <p className="mt-3 text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            {t.meetArixon?.subtitle ||
              (isAr
                ? 'شاهد الفيديو التعريفي مباشرة أثناء تصفحك للموقع، للتعرف على رؤية اريكسون وأنظمتنا البرمجية المتقدمة.'
                : 'Watch the official intro video directly as you browse, presenting Arixon software architecture and systems.')}
          </p>
        </div>

        {/* Direct In-Page 16:9 Video Canvas */}
        <div className="relative max-w-5xl mx-auto">
          {/* Subtle Outer Glow Frame */}
          <div className="absolute -inset-1 sm:-inset-2 rounded-3xl sm:rounded-[36px] bg-gradient-to-b from-neutral-200 to-transparent dark:from-neutral-800 dark:to-transparent opacity-60 blur-sm pointer-events-none" />

          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-2xl bg-black">
            <iframe
              src={directEmbedUrl}
              title={isAr ? 'فيديو تعريفي عن اريكسون' : 'Arixon Official Intro Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full border-0"
            />
          </div>

          {/* Video Footer Info Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isAr
                  ? 'مشغّل مدمج مباشر عالي الدقة HD 1080p'
                  : 'Embedded Direct In-Page Player · HD 1080p'}
              </span>
            </div>

            <a
              href={INTRO_VIDEO_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium transition-colors"
            >
              <span>{t.meetArixon?.watchOnYoutube || (isAr ? 'مشاهدة على YouTube' : 'Open in YouTube')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
