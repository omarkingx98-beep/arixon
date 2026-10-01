import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ArrowUpRight,
  ExternalLink,
  Github,
  Cpu,
  Store,
  GraduationCap,
  Layers,
  Sparkles,
  Command,
} from 'lucide-react';
import { Language, PortfolioApp } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PORTFOLIO_APPS, SERVICES_DATA, SOCIAL_LINKS } from '../data/apps';

interface TopSearchBarProps {
  language: Language;
  onSelectApp: (app: PortfolioApp) => void;
  onSelectService: (serviceTitle: string) => void;
  className?: string;
  isCompact?: boolean;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  language,
  onSelectApp,
  onSelectService,
  className = '',
  isCompact = false,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'apps' | 'repos' | 'services'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[language];

  // Global keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute matched items
  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return { apps: [], repos: [], services: [] };

    // 1. Search Portfolio Apps
    const matchedApps = PORTFOLIO_APPS.filter((app) => {
      const name = `${app.name.en} ${app.name.ar}`.toLowerCase();
      const desc = `${app.description.en} ${app.description.ar} ${app.tagline.en} ${app.tagline.ar}`.toLowerCase();
      const tech = app.techStack.join(' ').toLowerCase();
      const category = `${app.category} ${app.categoryLabel.en} ${app.categoryLabel.ar}`.toLowerCase();
      const repo = (app.repoName || '').toLowerCase();

      return (
        name.includes(trimmed) ||
        desc.includes(trimmed) ||
        tech.includes(trimmed) ||
        category.includes(trimmed) ||
        repo.includes(trimmed)
      );
    });

    // 2. Search GitHub Repositories Specifically
    const matchedRepos = PORTFOLIO_APPS.filter((app) => {
      if (!app.githubUrl) return false;
      const repo = (app.repoName || '').toLowerCase();
      const name = `${app.name.en} ${app.name.ar}`.toLowerCase();
      const tech = app.techStack.join(' ').toLowerCase();
      return (
        trimmed.includes('git') ||
        trimmed.includes('مستودع') ||
        trimmed.includes('repo') ||
        repo.includes(trimmed) ||
        name.includes(trimmed) ||
        tech.includes(trimmed)
      );
    });

    // 3. Search Services
    const matchedServices = SERVICES_DATA.filter((s) => {
      const title = `${s.title.en} ${s.title.ar}`.toLowerCase();
      const sub = `${s.subtitle.en} ${s.subtitle.ar}`.toLowerCase();
      const desc = `${s.description.en} ${s.description.ar}`.toLowerCase();
      const items = (s.deliverables.en.concat(s.deliverables.ar)).join(' ').toLowerCase();

      return (
        title.includes(trimmed) ||
        sub.includes(trimmed) ||
        desc.includes(trimmed) ||
        items.includes(trimmed)
      );
    });

    return {
      apps: filter === 'all' || filter === 'apps' ? matchedApps : [],
      repos: filter === 'all' || filter === 'repos' ? matchedRepos : [],
      services: filter === 'all' || filter === 'services' ? matchedServices : [],
    };
  }, [query, filter]);

  const totalResults =
    results.apps.length + results.repos.length + results.services.length;

  const quickSearchKeywords = [
    { label: language === 'ar' ? 'كاشير POS' : 'POS Cashier', q: 'pos' },
    { label: language === 'ar' ? 'الذكاء الاصطناعي' : 'AI Studio', q: 'ai' },
    { label: language === 'ar' ? 'مستودعات GitHub' : 'GitHub Repos', q: 'github' },
    { label: language === 'ar' ? 'إدارة المراكز' : 'Education Centers', q: 'centers' },
    { label: language === 'ar' ? 'طلاب و امتحانات' : 'Students Exams', q: 'students' },
    { label: language === 'ar' ? 'محرك نوفا تريد' : 'NovaTrade 3D', q: 'novatrade' },
  ];

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Search Input Box */}
      <div
        className={`relative flex items-center transition-all duration-300 rounded-2xl border ${
          isOpen
            ? 'border-neutral-900 dark:border-white shadow-2xl ring-2 ring-neutral-900/10 dark:ring-white/20 bg-white dark:bg-neutral-900'
            : 'border-neutral-300/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 hover:border-neutral-400 dark:hover:border-neutral-700 shadow-lg backdrop-blur-md'
        }`}
      >
        <div className="pl-4 pr-2 rtl:pl-2 rtl:pr-4 text-neutral-400 dark:text-neutral-500">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={t.search.placeholder}
          className="w-full py-3.5 px-2 text-sm sm:text-base bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none font-medium"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1.5 mr-2 rtl:mr-0 rtl:ml-2 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 mr-3 rtl:mr-0 rtl:ml-3 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] font-mono text-neutral-400 select-none">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
      </div>

      {/* Quick Search Chips underneath the search bar */}
      {!query && !isOpen && (
        <div className="mt-2.5 sm:mt-3 flex items-center justify-start sm:justify-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 overflow-x-auto no-scrollbar py-1 px-0.5">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 shrink-0">
            {t.search.quickSearches}
          </span>
          {quickSearchKeywords.map((chip) => (
            <button
              key={chip.q}
              onClick={() => {
                setQuery(chip.q);
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer select-none shrink-0 text-xs whitespace-nowrap"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Instant Dropdown Results Panel */}
      {isOpen && (
        <div className="absolute top-full inset-x-0 mt-2 p-3 sm:p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-200 max-h-[75vh] overflow-y-auto">
          {/* Segmented Category Filters inside search */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-neutral-100 dark:border-neutral-900 overflow-x-auto no-scrollbar">
            {(
              [
                { key: 'all', label: t.search.filterAll },
                { key: 'apps', label: t.search.filterApps },
                { key: 'repos', label: t.search.filterRepos },
                { key: 'services', label: t.search.filterServices },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filter === f.key
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-neutral-100 dark:bg-neutral-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* If query is empty, show prompt & popular options */}
          {!query.trim() && (
            <div className="py-6 px-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {language === 'ar'
                  ? 'اكتب أي كلمة للبحث الفوري في التطبيقات، مستودعات الكود، أو الخدمات'
                  : 'Type anything to search across apps, code repositories, or services'}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {quickSearchKeywords.map((chip) => (
                  <button
                    key={chip.q}
                    onClick={() => {
                      setQuery(chip.q);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 font-medium transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query.trim() && (
            <div className="space-y-4 pt-2">
              {totalResults === 0 ? (
                <div className="py-8 text-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  <p>
                    {t.search.noResults} <span className="font-semibold text-neutral-900 dark:text-white">"{query}"</span>
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    {language === 'ar'
                      ? 'جرّب البحث بكلمات أخرى مثل: كاشير، ذكاء، طلاب، NovaTrade، أو github'
                      : 'Try terms like: POS, AI, Students, NovaTrade, or GitHub'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Matching Apps & Projects */}
                  {results.apps.length > 0 && (
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 px-1">
                        {t.search.filterApps} ({results.apps.length})
                      </div>
                      <div className="space-y-2">
                        {results.apps.map((app) => (
                          <div
                            key={app.id}
                            className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/60 hover:bg-neutral-100/90 dark:hover:bg-neutral-800/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                          >
                            <div
                              onClick={() => {
                                onSelectApp(app);
                                setIsOpen(false);
                              }}
                              className="cursor-pointer flex-1"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-neutral-900 dark:text-white group-hover:underline">
                                  {app.name[language]}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-neutral-600 dark:text-neutral-400">
                                  {app.categoryLabel[language]}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                                {app.tagline[language]}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                                <span>{app.techStack.slice(0, 3).join(' · ')}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                              {app.githubUrl && (
                                <a
                                  href={app.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:border-neutral-400 transition-all"
                                  title={app.repoName}
                                >
                                  <Github className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Repo</span>
                                </a>
                              )}

                              {app.liveDemoUrl && (
                                <a
                                  href={app.liveDemoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-all"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">{t.search.liveDemo}</span>
                                </a>
                              )}

                              <button
                                onClick={() => {
                                  onSelectApp(app);
                                  setIsOpen(false);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-all cursor-pointer"
                              >
                                {t.search.viewDetails}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching GitHub Repositories */}
                  {results.repos.length > 0 && filter !== 'apps' && (
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 px-1 flex items-center justify-between">
                        <span>{t.search.filterRepos} ({results.repos.length})</span>
                        <a
                          href={SOCIAL_LINKS.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 text-[11px] lowercase"
                        >
                          <span>github.com/omarkingx98-beep</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="space-y-2">
                        {results.repos.map((app) => (
                          <a
                            key={`repo-${app.id}`}
                            href={app.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white shrink-0 group-hover:scale-105 transition-transform">
                                <Github className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-bold font-mono text-neutral-900 dark:text-white group-hover:underline">
                                  {app.repoName || `omarkingx98-beep/${app.id}`}
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                  {app.name[language]} — {app.tagline[language]}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white">
                              <span>GitHub</span>
                              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Services */}
                  {results.services.length > 0 && filter !== 'apps' && filter !== 'repos' && (
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 px-1">
                        {t.search.filterServices} ({results.services.length})
                      </div>
                      <div className="space-y-2">
                        {results.services.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => {
                              onSelectService(service.title[language]);
                              setIsOpen(false);
                            }}
                            className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center justify-between cursor-pointer group"
                          >
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white group-hover:underline">
                                {service.title[language]}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                {service.subtitle[language]}
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-white">
                              <span>{language === 'ar' ? 'طلب الخدمة' : 'Request'}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
