import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  ArrowUpRight,
  Search,
  LogIn,
  UserPlus,
  User,
  MessageCircle,
  LogOut,
  Shield,
  ChevronDown,
  Sliders,
  Volume2,
  VolumeX,
  LifeBuoy,
  Briefcase,
  HelpCircle,
  Sparkles,
  Layers,
  Compass,
  FileText,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { EriksonLogo } from './EriksonLogo';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/sound';
import { PORTFOLIO_APPS, SOCIAL_LINKS } from '../data/apps';

interface NavbarProps {
  language: Language;
  theme: Theme;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onOpenAdmin?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenStudioConfigurator?: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
  onOpenAdmin,
  onOpenCommandPalette,
  onOpenStudioConfigurator,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'products' | 'company' | 'support' | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const megaMenuTimeoutRef = useRef<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';

  const {
    currentUser,
    userProfile,
    isAdmin,
    openAuthModal,
    openProfileModal,
    openChat,
    unreadCount,
    logout,
  } = useAuth();

  // Scroll tracking & reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 20);
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMegaEnter = (menu: 'products' | 'company' | 'support') => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menu);
  };

  const handleMegaLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  const navigateTo = (destination: string) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    sound.playClick();

    if (destination.startsWith('/')) {
      if (onNavigate) {
        onNavigate(destination);
      } else {
        window.history.pushState(null, '', destination);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      return;
    }

    if (destination.startsWith('#')) {
      // If we are currently on a subpage like /about, go home first
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.history.pushState(null, '', `/${destination}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => {
          const el = document.querySelector(destination);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(destination);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = destination;
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-xs py-2.5 sm:py-3'
          : 'bg-transparent py-3.5 sm:py-5'
      }`}
    >
      {/* Scroll Progress Bar at very top */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] bg-neutral-200 dark:bg-neutral-800 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-neutral-900 dark:bg-white transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Zone 1: Brand Wordmark & Official Arixon Logo */}
          <button
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2 sm:gap-2.5 text-neutral-900 dark:text-white group select-none shrink-0 cursor-pointer text-start"
            aria-label="Arixon Homepage"
          >
            <EriksonLogo size="md" glow={true} />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight leading-none font-sans">
                {t.nav.brand}
              </span>
              <span className="text-[10px] tracking-wider text-neutral-500 dark:text-neutral-400 leading-tight hidden xs:block">
                {language === 'ar' ? 'أنظمة وتطبيقات متقدمة' : 'Software Systems'}
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Mega Menu Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* 1. Products Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => handleMegaEnter('products')}
              onMouseLeave={handleMegaLeave}
            >
              <button
                onClick={() => navigateTo('#apps')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeMegaMenu === 'products'
                    ? 'text-black dark:text-white bg-neutral-100 dark:bg-neutral-850'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>{isAr ? 'المنتجات والأنظمة' : 'Products'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'products' ? 'rotate-180' : ''}`} />
              </button>

              {/* Products Mega Flyout */}
              {activeMegaMenu === 'products' && (
                <div className="absolute top-full start-0 mt-2 w-96 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1 mb-1">
                    {isAr ? 'الأنظمة البرمجية الرسمية (5 تطبيقات)' : 'Flagship Software Systems'}
                  </div>
                  <div className="space-y-1">
                    {PORTFOLIO_APPS.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => navigateTo('#apps')}
                        className="w-full text-start p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-900 dark:text-white group-hover:scale-105 transition-transform">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                              {app.name[language]}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {app.year}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                            {app.description[language]}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Company Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => handleMegaEnter('company')}
              onMouseLeave={handleMegaLeave}
            >
              <button
                onClick={() => navigateTo('/about')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeMegaMenu === 'company'
                    ? 'text-black dark:text-white bg-neutral-100 dark:bg-neutral-850'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>{isAr ? 'عن الشركة' : 'Company'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'company' ? 'rotate-180' : ''}`} />
              </button>

              {/* Company Mega Flyout */}
              {activeMegaMenu === 'company' && (
                <div className="absolute top-full start-0 mt-2 w-72 p-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => navigateTo('/about')}
                    className="w-full text-start p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {isAr ? 'عن اريكسون' : 'About Arixon'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {isAr ? 'قصة التأسيس والرؤية' : 'Our Story & Mission'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('/about')}
                    className="w-full text-start p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {isAr ? 'المؤسس: عمر شراب' : 'Founder: Omar Shurrab'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {isAr ? 'المسيرة والمحطات' : 'Bio & Milestones'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('/brand')}
                    className="w-full text-start p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <Palette className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {isAr ? 'الهوية البصرية (Brand Kit)' : 'Brand Kit'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {isAr ? 'الشعار، الألوان، والخطوط' : 'Logos, Colors & Typography'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('#workspace')}
                    className="w-full text-start p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {isAr ? 'مقر وبيئة العمل' : 'Workspace & Studio'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {isAr ? 'معرض صور المقر' : 'Official Workspace Images'}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Support Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => handleMegaEnter('support')}
              onMouseLeave={handleMegaLeave}
            >
              <button
                onClick={() => navigateTo('/support')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeMegaMenu === 'support'
                    ? 'text-black dark:text-white bg-neutral-100 dark:bg-neutral-850'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>{isAr ? 'الدعم والخدمات' : 'Support'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'support' ? 'rotate-180' : ''}`} />
              </button>

              {/* Support Mega Flyout */}
              {activeMegaMenu === 'support' && (
                <div className="absolute top-full start-0 mt-2 w-72 p-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => navigateTo('/faq')}
                    className="w-full text-start p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {isAr ? 'الأسئلة الشائعة (FAQ)' : 'FAQ & Help'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {isAr ? 'إجابات فورية ومعمارية الأنظمة' : 'Frequently asked questions'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('/support')}
                    className="w-full text-start p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <LifeBuoy className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {isAr ? 'تذاكر الدعم الفني' : 'Client Support Tickets'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {isAr ? 'متابعة البلاغات للعملاء' : 'Submit & track technical issues'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('#contact')}
                    className="w-full text-start p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {isAr ? 'قنوات التواصل المباشر' : 'Contact Channels'}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {isAr ? 'واتساب، البريد، والهاتف' : 'WhatsApp, Email & Phone'}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Studio Configurator Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenStudioConfigurator?.();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-all cursor-pointer border border-neutral-200 dark:border-neutral-750"
              title={isAr ? 'استوديو تخصيص المشاريع' : 'Studio Configurator'}
            >
              <Sliders className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
              <span>{isAr ? 'تخصيص مشروع' : 'Studio Config'}</span>
            </button>

            {/* Direct Admin Dashboard Trigger */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-900 dark:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-all cursor-pointer shadow-xs"
                title={isAr ? 'لوحة التحكم' : 'Dashboard'}
              >
                <Shield className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
                <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions (Search, Language Switcher, Theme Toggle, Auth, Contact CTA) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Search Trigger (Desktop & Mobile) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenCommandPalette?.();
              }}
              className="inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-xl bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-all border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer"
              aria-label={t.nav.search}
              title={language === 'ar' ? 'البحث السريع (Ctrl+K أو /)' : 'Quick Search (Ctrl+K or /)'}
            >
              <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden lg:inline">{t.nav.search}</span>
              <kbd className="hidden sm:inline-flex text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-500">⌘K</kbd>
            </button>

            {/* Tactile Audio Feedback Switch */}
            <button
              onClick={() => {
                const next = sound.toggle();
                setSoundEnabled(next);
              }}
              className="p-1.5 text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-xl bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-750 transition-all border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer shrink-0"
              title={soundEnabled ? (isAr ? 'صوت التفاعل نشط' : 'Haptic Sound Active') : (isAr ? 'صوت التفاعل مكتوم' : 'Haptic Sound Muted')}
              aria-label="Toggle haptic sound feedback"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {/* Language Switcher (Desktop & Tablet) */}
            <button
              onClick={onToggleLanguage}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-xl bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-all border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer"
              aria-label={t.nav.toggleLanguage}
              title={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Dark/Light Mode Toggle (Always Visible) */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-xl bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-all border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer shrink-0"
              aria-label={t.nav.toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* DIRECT ADMIN DASHBOARD BUTTON */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 dark:bg-white dark:text-black hover:bg-black dark:hover:bg-neutral-100 rounded-xl shadow-xs border border-neutral-800 dark:border-neutral-200 transition-all cursor-pointer shrink-0"
                title={isAr ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 fill-amber-400/30" />
                <span className="font-bold hidden xs:inline">{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
                <span className="xs:hidden font-bold">{isAr ? 'إدارة' : 'Admin'}</span>
              </button>
            )}

            {/* AUTH SECTION */}
            {currentUser ? (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 pe-2 sm:pe-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 transition-all cursor-pointer relative"
                  aria-label="User menu"
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs uppercase">
                      {userProfile?.name?.slice(0, 1) || currentUser.displayName?.slice(0, 1) || 'U'}
                    </div>
                    {isAdmin ? (
                      <span className="absolute -bottom-1 -end-1 w-3 h-3 rounded-full bg-amber-500 text-black flex items-center justify-center ring-2 ring-white dark:ring-black">
                        <Shield className="w-2 h-2 fill-current" />
                      </span>
                    ) : unreadCount > 0 ? (
                      <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-black" />
                    ) : null}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 max-w-[70px] sm:max-w-[120px] truncate hidden xs:inline sm:inline">
                    {userProfile?.name || currentUser.displayName || (isAr ? 'حسابي' : 'Account')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute end-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in duration-150 text-xs">
                    <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                          {userProfile?.name || currentUser.displayName || 'User'}
                        </span>
                        {userProfile?.countryFlag && (
                          <span className="text-sm">{userProfile.countryFlag}</span>
                        )}
                      </div>
                      <div className="text-neutral-400 text-[10px] truncate mt-0.5 font-mono">
                        {currentUser.email}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openChat();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-neutral-500" />
                        <span className="font-semibold">{isAr ? 'رسائلي مع الإدارة' : 'My Messages'}</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigateTo('/support');
                      }}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                    >
                      <LifeBuoy className="w-4 h-4 text-neutral-500" />
                      <span>{isAr ? 'تذاكر الدعم الخاصة بي' : 'My Support Tickets'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openProfileModal();
                      }}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-neutral-500" />
                      <span>{isAr ? 'الملف الشخصي' : 'My Profile'}</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenAdmin) onOpenAdmin();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/70 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold transition-colors cursor-pointer my-1"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-neutral-900 dark:text-white" />
                          <span>{isAr ? 'لوحة تحكم الإدارة' : 'Admin Panel'}</span>
                        </div>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-black text-white dark:bg-white dark:text-black">
                          ROOT
                        </span>
                      </button>
                    )}

                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all border border-neutral-200/80 dark:border-neutral-700/80 cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  <span className="sm:hidden">{isAr ? 'دخول' : 'Login'}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Clean Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCommandPalette?.();
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 mb-4 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <span>{isAr ? 'ابحث في الصفحات، الأنظمة، والأسئلة...' : 'Search pages, apps, FAQ...'}</span>
            </div>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">⌘K</kbd>
          </button>

          <div className="space-y-4 text-xs">
            {/* Products Group */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1 px-1">
                {isAr ? 'المنتجات والأنظمة (5)' : 'Products (5 Apps)'}
              </div>
              <div className="space-y-1">
                {PORTFOLIO_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => navigateTo('#apps')}
                    className="w-full text-start p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-bold text-neutral-900 dark:text-white">{app.name[language]}</span>
                    <span className="text-[10px] font-mono text-neutral-400">{app.year}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company Group */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1 px-1">
                {isAr ? 'عن الشركة والمؤسس' : 'Company'}
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => navigateTo('/about')}
                  className="w-full text-start p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{isAr ? 'عن اريكسون وقصة التأسيس' : 'About Arixon'}</span>
                  <span className="text-[10px] text-neutral-400">/about</span>
                </button>
                <button
                  onClick={() => navigateTo('/about')}
                  className="w-full text-start p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{isAr ? 'المؤسس: عمر شراب' : 'Founder: Omar Shurrab'}</span>
                </button>
                <button
                  onClick={() => navigateTo('/brand')}
                  className="w-full text-start p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{isAr ? 'الهوية البصرية (Brand Kit)' : 'Brand Kit'}</span>
                  <span className="text-[10px] text-neutral-400">/brand</span>
                </button>
                <button
                  onClick={() => navigateTo('#workspace')}
                  className="w-full text-start p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{isAr ? 'مقر وبيئة العمل' : 'Workspace'}</span>
                </button>
              </div>
            </div>

            {/* Support Group */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1 px-1">
                {isAr ? 'الدعم الفني والمساعدة' : 'Support & Help'}
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => navigateTo('/faq')}
                  className="w-full text-start p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{isAr ? 'الأسئلة الشائعة (FAQ)' : 'FAQ & Knowledgebase'}</span>
                  <span className="text-[10px] text-neutral-400">/faq</span>
                </button>
                <button
                  onClick={() => navigateTo('/support')}
                  className="w-full text-start p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{isAr ? 'بوابة تذاكر الدعم الفني' : 'Client Support Desk'}</span>
                  <span className="text-[10px] text-neutral-400">/support</span>
                </button>
                <button
                  onClick={() => navigateTo('#contact')}
                  className="w-full text-start p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{isAr ? 'التواصل المباشر والطلب' : 'Contact Us'}</span>
                </button>
              </div>
            </div>

            {/* Studio Configurator Trigger */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                sound.playClick();
                onOpenStudioConfigurator?.();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span>{isAr ? 'استوديو تخصيص المشاريع' : 'Studio Configurator'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black">
                PRO
              </span>
            </button>

            {/* Mobile Language and Theme Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => {
                  onToggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
              </button>

              <button
                onClick={onToggleTheme}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'الوضع الفاتح' : 'Light Mode'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-neutral-700" />
                    <span>{isAr ? 'الوضع الداكن' : 'Dark Mode'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
