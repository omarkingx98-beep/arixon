import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Laptop,
  MessageCircle,
  Moon,
  Sun,
  Globe,
  Shield,
  Volume2,
  VolumeX,
  FileCode2,
  ExternalLink,
  Sparkles,
  X,
  Layers,
  HelpCircle,
  FileText,
  Clock,
  Compass,
  Briefcase,
  LifeBuoy,
  Palette,
} from 'lucide-react';
import { Language, PortfolioApp } from '../types';
import { PORTFOLIO_APPS, SOCIAL_LINKS } from '../data/apps';
import { siteContent } from '../data/siteContent';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onSelectApp: (app: PortfolioApp) => void;
  onOpenAdmin?: () => void;
  onOpenProjectWizard: () => void;
  onNavigate?: (path: string) => void;
}

interface PaletteItem {
  id: string;
  category: 'page' | 'section' | 'app' | 'faq' | 'action';
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  icon: any;
  action: () => void;
}

const RECENT_KEY = 'arixon_cmd_palette_recent_ids';

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  onToggleTheme,
  onToggleLanguage,
  onSelectApp,
  onOpenAdmin,
  onOpenProjectWizard,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return ['page_about', 'page_support', 'app_arixon-pos', 'page_brand'];
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const isAr = language === 'ar';
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      sound.playClick(1200);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Keyboard shortcuts: Cmd+K / Ctrl+K, Slash "/", and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        if (isOpen) onClose();
      } else if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault();
        sound.playClick();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const saveRecent = (id: string) => {
    try {
      const next = [id, ...recentIds.filter((i) => i !== id)].slice(0, 6);
      setRecentIds(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch (_) {}
  };

  const navigateTo = (path: string) => {
    onClose();
    sound.playClick();
    if (path.startsWith('/')) {
      if (onNavigate) {
        onNavigate(path);
      } else {
        window.history.pushState(null, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      return;
    }
    if (path.startsWith('#')) {
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.history.pushState(null, '', `/${path}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => {
          const el = document.querySelector(path);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(path);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = path;
        }
      }
    }
  };

  if (!isOpen) return null;

  // Build Palette Items Catalog
  const allItems: PaletteItem[] = [
    // Pages
    {
      id: 'page_home',
      category: 'page',
      titleAr: 'الصفحة الرئيسية',
      titleEn: 'Home Page',
      subtitleAr: 'واجهة استعراض الأنظمة والمعمارية البرمجية',
      subtitleEn: 'Primary architecture showcase and systems',
      icon: Compass,
      action: () => {
        saveRecent('page_home');
        navigateTo('/');
      },
    },
    {
      id: 'page_about',
      category: 'page',
      titleAr: 'عن اريكسون والمؤسس',
      titleEn: 'About Arixon & Founder',
      subtitleAr: 'قصة التأسيس، الرؤية، والمهندس عمر شراب',
      subtitleEn: 'Founding story, engineering philosophy & Omar Shurrab',
      icon: Compass,
      action: () => {
        saveRecent('page_about');
        navigateTo('/about');
      },
    },
    {
      id: 'page_brand',
      category: 'page',
      titleAr: 'الهوية البصرية (Brand Kit)',
      titleEn: 'Brand Kit & Guidelines',
      subtitleAr: 'شعار اريكسون، الألوان المعتمدة، ورموز QR',
      subtitleEn: 'Official vector logos, color swatches & QR codes',
      icon: Palette,
      action: () => {
        saveRecent('page_brand');
        navigateTo('/brand');
      },
    },
    {
      id: 'page_faq',
      category: 'page',
      titleAr: 'الأسئلة الشائعة (FAQ)',
      titleEn: 'FAQ & Architecture Answers',
      subtitleAr: 'إجابات عن أنظمة الكاشير، العمل دون إنترنت، والملكية التامة',
      subtitleEn: 'Offline-first, 100% code ownership & technical guarantees',
      icon: HelpCircle,
      action: () => {
        saveRecent('page_faq');
        navigateTo('/faq');
      },
    },
    {
      id: 'page_support',
      category: 'page',
      titleAr: 'بوابة تذاكر الدعم الفني',
      titleEn: 'Client Support Portal',
      subtitleAr: 'فتح ومتابعة بلاغات الأنظمة وتحديثات البرمجيات',
      subtitleEn: 'Submit and track system bug tickets & requests',
      icon: LifeBuoy,
      action: () => {
        saveRecent('page_support');
        navigateTo('/support');
      },
    },

    // Sections
    {
      id: 'sec_apps',
      category: 'section',
      titleAr: 'معرض الأنظمة البرمجية (Apps Gallery)',
      titleEn: 'Software Gallery Bento Grid',
      subtitleAr: 'استعراض التطبيقات الخمسة الأساسية',
      subtitleEn: 'Inspect the 5 flagship software platforms',
      icon: Layers,
      action: () => {
        saveRecent('sec_apps');
        navigateTo('#apps');
      },
    },
    {
      id: 'sec_workspace',
      category: 'section',
      titleAr: 'مقر وبيئة العمل (Studio & Workspace)',
      titleEn: 'Workspace & Engineering Studio',
      subtitleAr: 'معرض صور المقر ومكاتب التطوير الحقيقية',
      subtitleEn: 'Photographs of physical studio facilities',
      icon: Briefcase,
      action: () => {
        saveRecent('sec_workspace');
        navigateTo('#workspace');
      },
    },
    {
      id: 'sec_contact',
      category: 'section',
      titleAr: 'قنوات التواصل المباشر',
      titleEn: 'Direct Contact Channels',
      subtitleAr: 'واتساب، البريد، والهاتف المباشر',
      subtitleEn: 'WhatsApp, verified email, and phone',
      icon: MessageCircle,
      action: () => {
        saveRecent('sec_contact');
        navigateTo('#contact');
      },
    },

    // Portfolio Apps
    ...PORTFOLIO_APPS.map((app) => ({
      id: `app_${app.id}`,
      category: 'app' as const,
      titleAr: app.name.ar,
      titleEn: app.name.en,
      subtitleAr: app.description.ar,
      subtitleEn: app.description.en,
      icon: Layers,
      action: () => {
        saveRecent(`app_${app.id}`);
        onClose();
        onSelectApp(app);
      },
    })),

    // FAQ Items
    ...siteContent.faq.map((item, index) => ({
      id: `faq_${index}`,
      category: 'faq' as const,
      titleAr: item.qAR,
      titleEn: item.qEN,
      subtitleAr: item.aAR,
      subtitleEn: item.aEN,
      icon: HelpCircle,
      action: () => {
        saveRecent(`faq_${index}`);
        navigateTo('/faq');
      },
    })),

    // Actions & Utilities
    {
      id: 'action_wizard',
      category: 'action',
      titleAr: 'طلب مشروع جديد (Arixon Configurator)',
      titleEn: 'Start New Project Configuration',
      subtitleAr: 'تخصيص مواصفات النظام وحساب الميزانية التقديرية',
      subtitleEn: 'Specify systems, offline needs, and architecture',
      icon: Sparkles,
      action: () => {
        saveRecent('action_wizard');
        onClose();
        onOpenProjectWizard();
      },
    },
    {
      id: 'action_whatsapp',
      category: 'action',
      titleAr: 'محادثة مباشرة عبر واتساب مع عمر شراب',
      titleEn: 'Direct WhatsApp with Omar Shurrab',
      subtitleAr: '+970 594 399 472',
      subtitleEn: '+970 594 399 472',
      icon: MessageCircle,
      action: () => {
        saveRecent('action_whatsapp');
        onClose();
        window.open(isAr ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn, '_blank');
      },
    },
    {
      id: 'action_theme',
      category: 'action',
      titleAr: theme === 'dark' ? 'التبديل إلى الوضع الفاتح (Light Mode)' : 'التبديل إلى الوضع الداكن (Dark Mode)',
      titleEn: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        onToggleTheme();
      },
    },
    {
      id: 'action_language',
      category: 'action',
      titleAr: isAr ? 'Switch to English (LTR)' : 'التبديل إلى العربية (RTL)',
      titleEn: isAr ? 'Switch to English (LTR)' : 'التبديل إلى العربية (RTL)',
      icon: Globe,
      action: () => {
        onToggleLanguage();
      },
    },
    {
      id: 'action_sound',
      category: 'action',
      titleAr: soundEnabled ? 'تعطيل المؤثرات الصوتية اللمسية' : 'تفعيل المؤثرات الصوتية اللمسية',
      titleEn: soundEnabled ? 'Mute Haptic Sound FX' : 'Enable Haptic Sound FX',
      icon: soundEnabled ? Volume2 : VolumeX,
      action: () => {
        const next = sound.toggle();
        setSoundEnabled(next);
      },
    },
    ...(isAdmin && onOpenAdmin
      ? [
          {
            id: 'action_admin',
            category: 'action' as const,
            titleAr: 'فتح لوحة التحكم الإدارية (Root Admin)',
            titleEn: 'Open Admin Dashboard (Root Admin)',
            subtitleAr: 'إدارة المستخدمين، المحادثات، التذاكر، والإعلانات',
            subtitleEn: 'Users, messages, requests, tickets & live announcements',
            icon: Shield,
            action: () => {
              saveRecent('action_admin');
              onClose();
              onOpenAdmin();
            },
          },
        ]
      : []),
  ];

  // Search filtering
  const q = query.trim().toLowerCase();

  let filteredItems: PaletteItem[] = [];
  if (!q) {
    // Show recent items first + top essential shortcuts
    const recents = recentIds
      .map((id) => allItems.find((item) => item.id === id))
      .filter(Boolean) as PaletteItem[];
    const others = allItems.filter((i) => !recentIds.includes(i.id)).slice(0, 8);
    filteredItems = [...recents, ...others];
  } else {
    filteredItems = allItems.filter(
      (item) =>
        item.titleAr.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        (item.subtitleAr && item.subtitleAr.toLowerCase().includes(q)) ||
        (item.subtitleEn && item.subtitleEn.toLowerCase().includes(q))
    );
  }

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredItems[selectedIndex];
      if (target) {
        target.action();
      }
    }
  };

  const getCategoryLabel = (cat: PaletteItem['category']) => {
    switch (cat) {
      case 'page':
        return isAr ? 'صفحة' : 'Page';
      case 'section':
        return isAr ? 'قسم' : 'Section';
      case 'app':
        return isAr ? 'تطبيق' : 'System';
      case 'faq':
        return isAr ? 'سؤال شائع' : 'FAQ';
      case 'action':
        return isAr ? 'إجراء سريع' : 'Action';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            placeholder={
              isAr
                ? 'ابحث في الصفحات، تطبيقات اريكسون، الأسئلة الشائعة، أو الأوامر...'
                : 'Search pages, systems, FAQ entries, or commands...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base font-medium placeholder-neutral-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-500">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400 space-y-1">
              <Search className="w-6 h-6 mx-auto opacity-30 mb-2" />
              <p>{isAr ? 'لم يتم العثور على أي نتائج مطابقة.' : 'No matching results found.'}</p>
            </div>
          ) : (
            <>
              {!query && recentIds.length > 0 && (
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>{isAr ? 'العناصر الأخيرة والمقترحة' : 'Recent & Suggested'}</span>
                </div>
              )}

              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                const title = isAr ? item.titleAr : item.titleEn;
                const subtitle = isAr ? item.subtitleAr : item.subtitleEn;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => item.action()}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm truncate">{title}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase ${
                              isSelected
                                ? 'bg-white/30 text-white dark:bg-black/20 dark:text-black'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        {subtitle && (
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected
                                ? 'text-neutral-300 dark:text-neutral-700'
                                : 'text-neutral-500 dark:text-neutral-400'
                            }`}
                          >
                            {subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 ms-2">
                      {isAr ? (
                        <ArrowLeft className={`w-4 h-4 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                      ) : (
                        <ArrowRight className={`w-4 h-4 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-[10px] text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ للتنقل</span>
            <span>↵ للاختيار</span>
            <span>ESC للإغلاق</span>
          </div>
          <span>Arixon Spotlight 2.0</span>
        </div>
      </div>
    </div>
  );
};
