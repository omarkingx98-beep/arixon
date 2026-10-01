import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ArrowUpRight,
  Filter,
  PlusCircle,
  Github,
  ExternalLink,
  Layers,
  Send,
  MessageCircle,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { AppCategory, Language, PortfolioApp } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PORTFOLIO_APPS } from '../data/apps';
import { AppDeviceFrame } from './AppDeviceFrame';
import { AppMockupPreview } from './AppMockupPreview';
import { AppDetailModal } from './AppDetailModal';

interface AppsGalleryProps {
  language: Language;
  onSelectAppForContact: (appName: string, appId?: string) => void;
  externalActiveModalApp?: PortfolioApp | null;
  onCloseExternalModal?: () => void;
}

export const AppsGallery: React.FC<AppsGalleryProps> = ({
  language,
  onSelectAppForContact,
  externalActiveModalApp = null,
  onCloseExternalModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalApp, setActiveModalApp] = useState<PortfolioApp | null>(null);

  // Desktop Pinned Storytelling vs Grid View mode
  const [viewMode, setViewMode] = useState<'story' | 'grid'>('story');
  const [pinnedAppIndex, setPinnedAppIndex] = useState<number>(0);

  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  // Sync external app selection from TopSearchBar
  useEffect(() => {
    if (externalActiveModalApp) {
      setActiveModalApp(externalActiveModalApp);
    }
  }, [externalActiveModalApp]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setViewMode('grid');
      }
    }
  }, []);

  // Category filter tabs
  const categories: { key: AppCategory; label: string }[] = [
    { key: 'all', label: t.appsSection.categories.all },
    { key: 'education', label: t.appsSection.categories.education },
    { key: 'ai', label: t.appsSection.categories.ai },
    { key: 'business', label: t.appsSection.categories.business },
    { key: 'social', label: t.appsSection.categories.social },
  ];

  // Filtered apps based on selected category and search input
  const filteredApps = useMemo(() => {
    return PORTFOLIO_APPS.filter((app) => {
      const matchesCategory =
        selectedCategory === 'all' || app.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameEn = app.name.en.toLowerCase();
      const nameAr = app.name.ar.toLowerCase();
      const descEn = app.description.en.toLowerCase();
      const descAr = app.description.ar.toLowerCase();
      const tech = app.techStack.join(' ').toLowerCase();

      return (
        nameEn.includes(q) ||
        nameAr.includes(q) ||
        descEn.includes(q) ||
        descAr.includes(q) ||
        tech.includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleCloseModal = () => {
    setActiveModalApp(null);
    if (onCloseExternalModal) {
      onCloseExternalModal();
    }
  };

  const currentPinnedApp = PORTFOLIO_APPS[pinnedAppIndex] || PORTFOLIO_APPS[0];

  return (
    <section id="apps" className="py-20 sm:py-32 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأنظمة والتطبيقات الرئيسية' : 'Flagship Systems & Apps'}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono">
                {PORTFOLIO_APPS.length} {isAr ? 'تطبيقات معتمدة' : 'Verified Apps'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
              {isAr ? 'برمجيات حقيقية مبنية لأرض الواقع' : 'Engineered for Scale, Built for Reality'}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {isAr
                ? 'استعرض التطبيقات الخمسة الأساسية التي صممتها وطورتها اريكسون؛ أنظمة كاشير سريعة، إدارة مراكز، منصات امتحانات، وحلول ذكاء اصطناعي.'
                : 'Explore our 5 flagship software platforms; sub-second POS cashiers, education hubs, digital exam studios, and AI business suites.'}
            </p>
          </div>

          {/* Desktop View Switcher (Storytelling vs Grid) */}
          <div className="hidden lg:flex items-center p-1 bg-neutral-200/80 dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-800 text-xs font-semibold shrink-0">
            <button
              onClick={() => setViewMode('story')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'story'
                  ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'عرض تسلسلي للمنظومات' : 'Storytelling Sequence'}</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isAr ? 'شبكة التطبيقات' : 'Grid View'}</span>
            </button>
          </div>
        </div>

        {/* 1. PINNED STORYTELLING SEQUENCE (DESKTOP MODE) */}
        {viewMode === 'story' && (
          <div className="hidden lg:block mb-16">
            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Sticky Sidebar with 5 Apps */}
              <div className="col-span-4 sticky top-28 space-y-2.5 p-3 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  {isAr ? 'اختر النظام للمعالجة' : 'Select Architecture'}
                </div>
                {PORTFOLIO_APPS.map((app, idx) => {
                  const isSelected = pinnedAppIndex === idx;
                  return (
                    <button
                      key={app.id}
                      onClick={() => setPinnedAppIndex(idx)}
                      className={`w-full p-4 rounded-2xl text-start transition-all cursor-pointer flex items-center justify-between border ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md'
                          : 'bg-neutral-50 dark:bg-neutral-950 border-transparent text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="text-[11px] font-mono opacity-60 mb-0.5">0{idx + 1}</div>
                        <div className="text-sm font-bold truncate max-w-[200px]">
                          {app.name[language]}
                        </div>
                      </div>
                      <ArrowUpRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'translate-x-0.5 -translate-y-0.5' : 'opacity-40'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Main Showcase Panel for Selected App */}
              <div className="col-span-8 p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                      {currentPinnedApp.categoryLabel[language]}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-1">
                      {currentPinnedApp.name[language]}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {currentPinnedApp.description[language]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {currentPinnedApp.githubUrl && (
                      <a
                        href={currentPinnedApp.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {currentPinnedApp.liveDemoUrl && (
                      <a
                        href={currentPinnedApp.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* HTML/CSS Device Frame Preview */}
                <div className="py-2">
                  <AppDeviceFrame
                    appId={currentPinnedApp.id}
                    language={language}
                    screenshotUrl={currentPinnedApp.screenshotUrl}
                  />
                </div>

                {/* What it does / Features */}
                {currentPinnedApp.features?.[language] && currentPinnedApp.features[language].length > 0 && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                      {isAr ? 'ماذا يقدم هذا التطبيق' : 'What it does'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      {currentPinnedApp.features[language].map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4">
                  <a
                    href={`https://wa.me/970594399472?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً، أود الاستفسار وطلب نظام مشابه لتطبيق (${currentPinnedApp.name[language]}).`
                        : `Hello, I'd like to ask about the app (${currentPinnedApp.name[language]}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModalApp(currentPinnedApp)}
                      className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      {isAr ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
                    </button>
                    <button
                      onClick={() => onSelectAppForContact(currentPinnedApp.name[language], currentPinnedApp.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isAr ? 'طلب هذا التطبيق' : 'Request this app'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. STACKED BENTO GRID LAYOUT (MOBILE, TABLET, AND REDUCED MOTION) */}
        {(viewMode === 'grid' || true) && (
          <div className={viewMode === 'story' ? 'lg:hidden' : 'block'}>
            {/* Filter Controls & Search */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-1.5 p-1 bg-neutral-200/70 dark:bg-neutral-900 rounded-xl overflow-x-auto no-scrollbar max-w-full">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer select-none shrink-0 ${
                        isActive
                          ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-auto lg:min-w-[280px]">
                <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.appsSection.searchPlaceholder}
                  className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
                />
              </div>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setActiveModalApp(app)}
                  className="group relative flex flex-col justify-between bg-white dark:bg-neutral-900/90 rounded-3xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer select-none"
                >
                  <div className="p-4 sm:p-5 pb-0">
                    <AppMockupPreview app={app} isDetailed={false} />
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-mono">
                        <span>{app.categoryLabel[language]}</span>
                        <span>{app.year}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
                        {app.name[language]}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {app.description[language]}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white">
                      <span>{isAr ? 'عرض المواصفات والمعاينة' : 'View Architecture'}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Start a Custom System Card */}
              <div
                onClick={() => onSelectAppForContact('Bespoke Custom Software Architecture')}
                className="group relative flex flex-col justify-between p-8 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 dark:hover:border-neutral-600 bg-neutral-100/50 dark:bg-neutral-950/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none text-center"
              >
                <div className="my-auto py-6">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-200 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {t.appsSection.comingSoonTitle}
                  </h3>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                    {isAr
                      ? 'هل تحتاج نظاماً بمواصفات خاصة لنشاطك التجاري؟ نبرمج لك كل شيء من الصفر.'
                      : 'Need a custom architecture for your unique operations? We engineer from scratch.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white group-hover:underline">
                    <span>{t.appsSection.requestCustomBtn}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {activeModalApp && (
        <AppDetailModal
          app={activeModalApp}
          language={language}
          onClose={handleCloseModal}
          onRequestSolution={(name, id) => onSelectAppForContact(name, id)}
        />
      )}
    </section>
  );
};
