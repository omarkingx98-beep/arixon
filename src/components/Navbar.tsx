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
} from 'lucide-react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { EriksonLogo } from './EriksonLogo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  language: Language;
  theme: Theme;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  const navLinks = [
    { href: '#meet-arixon', label: isAr ? 'فيديو تعريفي' : 'Intro Video' },
    { href: '#about', label: t.nav.about },
    { href: '#workspace', label: isAr ? 'المقر وبيئة العمل' : 'Workspace' },
    { href: '#apps', label: t.nav.apps },
    { href: '#services', label: t.nav.services },
    { href: '#contact', label: t.nav.contact },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-sm py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Zone 1: Brand Wordmark & Official Arixon Logo */}
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-2.5 text-neutral-900 dark:text-white group select-none shrink-0"
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
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-neutral-900 dark:after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Search Trigger (Desktop & Tablet) */}
            <button
              onClick={() => {
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) {
                  searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => searchInput.focus(), 300);
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-all border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer"
              aria-label={t.nav.search}
              title={language === 'ar' ? 'البحث السريع (Ctrl+K)' : 'Quick Search (Ctrl+K)'}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t.nav.search}</span>
            </button>

            {/* Language Switcher (Desktop & Tablet) */}
            <button
              onClick={onToggleLanguage}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-all border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer"
              aria-label={t.nav.toggleLanguage}
              title={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Dark/Light Mode Toggle (Always Visible) */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-all border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer shrink-0"
              aria-label={t.nav.toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* AUTH SECTION */}
            {currentUser ? (
              /* User Avatar & Dropdown Menu */
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
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-black" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 max-w-[70px] sm:max-w-[120px] truncate hidden xs:inline sm:inline">
                    {userProfile?.name || currentUser.displayName || (isAr ? 'حسابي' : 'Account')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute end-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in duration-150 text-xs">
                    {/* User Header */}
                    <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                          {userProfile?.name || currentUser.displayName || 'User'}
                        </span>
                        {userProfile?.countryFlag && (
                          <span className="text-sm">{userProfile.countryFlag}</span>
                        )}
                      </div>
                      {userProfile?.username && (
                        <div className="font-mono text-neutral-500 text-[11px]">
                          {userProfile.username}
                        </div>
                      )}
                      <div className="text-neutral-400 text-[10px] truncate mt-0.5 font-mono">
                        {currentUser.email}
                      </div>
                    </div>

                    {/* Messages Option */}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openChat();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-neutral-500" />
                        <span className="font-semibold">
                          {isAr ? 'رسائلي مع الإدارة' : 'My Messages'}
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Edit Profile Option */}
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

                    {/* Admin Dashboard Option (Only for verified admin) */}
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

                    {/* Sign out */}
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
              /* Guest: Sign in & Create Account buttons */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all border border-neutral-200/80 dark:border-neutral-700/80 cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  <span className="sm:hidden">{isAr ? 'دخول' : 'Login'}</span>
                </button>

                <button
                  onClick={() => openAuthModal('signup')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إنشاء حساب' : 'Create Account'}</span>
                </button>
              </div>
            )}

            {/* Primary Action Button (Desktop: Contact / Start a Project) */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-lg transition-all shadow-sm whitespace-nowrap"
            >
              <span>{t.nav.getStarted}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white rounded-lg bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Auth actions */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openChat();
                    }}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{isAr ? 'رسائلي مع الإدارة' : 'My Messages'}</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openProfileModal();
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>{isAr ? 'الملف الشخصي' : 'My Profile'}</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenAdmin) onOpenAdmin();
                      }}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{isAr ? 'لوحة تحكم الإدارة' : 'Admin Panel'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="py-2.5 text-center text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
                  >
                    {isAr ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signup');
                    }}
                    className="py-2.5 text-center text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black cursor-pointer"
                  >
                    {isAr ? 'إنشاء حساب' : 'Create Account'}
                  </button>
                </div>
              )}

              {/* Mobile Quick Controls: Language & Theme */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => {
                    onToggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
                </button>
                <button
                  onClick={onToggleTheme}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer"
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
        </div>
      )}
    </header>
  );
};
