import React, { useRef, useEffect } from 'react';
import { ArrowDown, ArrowUpRight, MessageCircle, Play } from 'lucide-react';
import { Language, PortfolioApp } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SOCIAL_LINKS } from '../data/apps';
import { companyImages } from '../data/companyImages';
import { EriksonLogo } from './EriksonLogo';
import { TopSearchBar } from './TopSearchBar';

interface HeroProps {
  language: Language;
  onSelectApp: (app: PortfolioApp) => void;
  onSelectService: (serviceTitle: string) => void;
  onOpenIntroVideo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onSelectApp,
  onSelectService,
  onOpenIntroVideo,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const bgRef = useRef<HTMLDivElement>(null);

  // High-performance smooth parallax without triggering React component re-renders
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (bgRef.current) {
            const offset = Math.min(window.scrollY * 0.12, 60);
            bgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl =
    language === 'ar' ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  // Image 5 (Dusk) for Dark Theme, Image 1 (Headquarters) for Light Theme
  const darkImage = companyImages[4]; // Dusk
  const lightImage = companyImages[0]; // HQ Exterior

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-32 pb-10 overflow-hidden bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      {/* 1. Fullscreen Background Image with Slow Subtle Zoom & Soft Parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none overflow-hidden will-change-transform"
        style={{
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        {/* Light Theme Background: Image 1 (HQ Exterior) */}
        <div className="dark:hidden absolute inset-0">
          <img
            src={lightImage.url}
            alt={isAr ? lightImage.title.ar : lightImage.title.en}
            fetchPriority="high"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
            style={{
              animation: 'subtleHeroZoom 25s ease-in-out infinite alternate',
            }}
          />
          {/* Light Theme Overlays for Contrast & Legibility */}
          <div className="absolute inset-0 bg-white/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white" />
        </div>

        {/* Dark Theme Background: Image 5 (Arixon at Dusk) */}
        <div className="hidden dark:block absolute inset-0">
          <img
            src={darkImage.url}
            alt={isAr ? darkImage.title.ar : darkImage.title.en}
            fetchPriority="high"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
            style={{
              animation: 'subtleHeroZoom 25s ease-in-out infinite alternate',
            }}
          />
          {/* Dark Theme Overlays for High Legibility */}
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black" />
        </div>

        {/* Subtle geometric hairline pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-neutral-900 dark:text-white">
        <div className="text-center flex flex-col items-center">
          {/* Logo Spotlight */}
          <div className="mb-5 sm:mb-7 transition-transform duration-500 hover:scale-105">
            <EriksonLogo size="hero" glow={true} />
          </div>

          {/* Kicker Tagline */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3 select-none">
            <span>{t.hero.kicker}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-900 dark:text-neutral-200">
              {t.hero.officialTag}
            </span>
          </div>

          {/* Big Headline */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.15] sm:leading-[1.08]"
            style={{ textWrap: 'balance' }}
          >
            <span>{t.hero.headlinePart1}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-400">
              {t.hero.headlineAccent}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            {t.hero.subheadline}
          </p>

          {/* FEATURED INSTANT SEARCH BAR */}
          <div className="mt-7 sm:mt-10 w-full max-w-2xl mx-auto">
            <TopSearchBar
              language={language}
              onSelectApp={onSelectApp}
              onSelectService={onSelectService}
            />
          </div>

          {/* Action CTAs */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
            {/* Watch Intro Button */}
            <button
              type="button"
              onClick={onOpenIntroVideo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white bg-white/90 dark:bg-neutral-900/90 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300/80 dark:border-neutral-700/80 rounded-xl backdrop-blur transition-all shadow-sm hover:shadow-md whitespace-nowrap cursor-pointer group"
            >
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center transition-transform group-hover:scale-110">
                <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
              </span>
              <span>{t.hero.watchIntroBtn || (isAr ? 'شاهد المقدمة' : 'Watch Intro')}</span>
            </button>

            {/* View Apps Button */}
            <button
              onClick={() => handleScrollTo('apps')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer group"
            >
              <span>{t.hero.viewAppsBtn}</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>

            {/* Contact WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white/85 dark:bg-neutral-900/85 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800 rounded-xl backdrop-blur transition-all shadow-xs whitespace-nowrap cursor-pointer group"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.hero.contactBtn}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Clean Unboxed Trust Proof Bar */}
          <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-neutral-300/60 dark:border-neutral-800/80 w-full max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <div className="text-center p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                  {t.hero.stats.appsCount}
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                  {t.hero.stats.appsLabel}
                </div>
              </div>

              <div className="text-center p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                  {t.hero.stats.uptime}
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                  {t.hero.stats.uptimeLabel}
                </div>
              </div>

              <div className="text-center p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                  {t.hero.stats.usersCount}
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                  {t.hero.stats.usersLabel}
                </div>
              </div>

              <div className="text-center p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                  {t.hero.stats.bespoke}
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                  {t.hero.stats.bespokeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Background Caption Badge (Always Visible Under Hero) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 flex justify-center sm:justify-end">
        <div className="inline-flex flex-col p-2.5 sm:p-3 rounded-2xl bg-white/85 dark:bg-black/85 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 shadow-md w-full sm:w-auto max-w-sm sm:max-w-md text-start">
          {/* Light theme caption */}
          <div className="dark:hidden">
            <span className="font-bold text-xs text-neutral-900 block">
              {isAr ? lightImage.title.ar : lightImage.title.en}
            </span>
            <span className="text-[11px] text-neutral-600 block mt-0.5 leading-snug">
              {isAr ? lightImage.description.ar : lightImage.description.en}
            </span>
          </div>
          {/* Dark theme caption */}
          <div className="hidden dark:block">
            <span className="font-bold text-xs text-white block">
              {isAr ? darkImage.title.ar : darkImage.title.en}
            </span>
            <span className="text-[11px] text-neutral-400 block mt-0.5 leading-snug">
              {isAr ? darkImage.description.ar : darkImage.description.en}
            </span>
          </div>
        </div>
      </div>

      {/* Keyframe animation style for subtle zoom with GPU optimization */}
      <style>{`
        @keyframes subtleHeroZoom {
          0% { transform: scale3d(1.02, 1.02, 1); }
          100% { transform: scale3d(1.06, 1.06, 1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-subtle-zoom { animation: none !important; }
        }
      `}</style>
    </section>
  );
};
