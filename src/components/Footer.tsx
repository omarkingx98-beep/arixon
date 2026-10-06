import React from 'react';
import {
  ArrowUp,
  Instagram,
  Facebook,
  MessageCircle,
  Github,
  Globe,
  Cookie,
  Layers,
  Compass,
  LifeBuoy,
  FileText,
  ShieldCheck,
  Palette,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SOCIAL_LINKS, PORTFOLIO_APPS } from '../data/apps';
import { companyImages } from '../data/companyImages';
import { EriksonLogo } from './EriksonLogo';
import { sound } from '../utils/sound';

interface FooterProps {
  language: Language;
  onOpenLegal?: (doc: 'privacy' | 'terms') => void;
  onOpenCookieSettings?: () => void;
  onToggleLanguage?: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenLegal,
  onOpenCookieSettings,
  onToggleLanguage,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const receptionImage = companyImages[1]; // Image 2: Reception

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent, dest: string) => {
    e.preventDefault();
    sound.playClick();

    if (dest.startsWith('/')) {
      if (onNavigate) {
        onNavigate(dest);
      } else {
        window.history.pushState(null, '', dest);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      return;
    }

    if (dest.startsWith('#')) {
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.history.pushState(null, '', `/${dest}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => {
          const el = document.querySelector(dest);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(dest);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = dest;
        }
      }
    }
  };

  const whatsappUrl =
    language === 'ar' ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: SOCIAL_LINKS.github },
    { name: 'WhatsApp', icon: MessageCircle, url: whatsappUrl },
    { name: 'Instagram', icon: Instagram, url: SOCIAL_LINKS.instagram },
    { name: 'Facebook', icon: Facebook, url: SOCIAL_LINKS.facebook },
  ];

  return (
    <footer className="relative border-t border-neutral-200 dark:border-neutral-900 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Subtle Reception Background Grayscale */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 dark:opacity-10">
        <img
          src={receptionImage.url}
          alt={isAr ? receptionImage.title.ar : receptionImage.title.en}
          loading="lazy"
          decoding="async"
          width={1920}
          height={1080}
          className="w-full h-full object-cover filter grayscale"
        />
        <div className="absolute inset-0 bg-white/90 dark:bg-black/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Full Footer Sitemap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-neutral-200 dark:border-neutral-900">
          {/* Column 1: Brand & Official Identity (lg: col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <EriksonLogo size="md" glow={false} />
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold tracking-tight font-sans">
                    {language === 'ar' ? 'اريكسون' : 'Arixon'}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {language === 'ar' ? 'Arixon' : 'اريكسون'}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {language === 'ar' ? 'أنظمة وتطبيقات متقدمة' : 'Software Systems & Architecture'}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
              {t.footer.tagline}
            </p>

            {/* Social Channels Row */}
            <div className="pt-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                {t.footer.socialHeading}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 border border-neutral-200/60 dark:border-neutral-800"
                      aria-label={s.name}
                      title={s.name}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Products / Apps (lg: col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأنظمة والمنتجات' : 'Software Products'}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              {PORTFOLIO_APPS.map((app) => (
                <li key={app.id}>
                  <a
                    href="#apps"
                    onClick={(e) => handleLinkClick(e, '#apps')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors block"
                  >
                    {app.name[language]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company & Brand (lg: col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{isAr ? 'عن الشركة' : 'Company'}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {isAr ? 'قصة التأسيس' : 'About Arixon'}
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {isAr ? 'المؤسس: عمر شراب' : 'Founder Bio'}
                </a>
              </li>
              <li>
                <a
                  href="/brand"
                  onClick={(e) => handleLinkClick(e, '/brand')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {isAr ? 'الهوية البصرية (Brand Kit)' : 'Brand Kit'}
                </a>
              </li>
              <li>
                <a
                  href="#workspace"
                  onClick={(e) => handleLinkClick(e, '#workspace')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {isAr ? 'مقر وبيئة العمل' : 'Workspace'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Legal (lg: col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>{isAr ? 'الدعم الفني والخدمات' : 'Support & Legal'}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/faq"
                  onClick={(e) => handleLinkClick(e, '/faq')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {isAr ? 'الأسئلة الشائعة (FAQ)' : 'FAQ & Knowledgebase'}
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  onClick={(e) => handleLinkClick(e, '/support')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {isAr ? 'بوابة تذاكر الدعم' : 'Client Support Desk'}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, '#contact')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {isAr ? 'قنوات الاتصال المباشر' : 'Contact Channels'}
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal ? onOpenLegal('privacy') : (window.location.hash = '#privacy')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-start"
                >
                  {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal ? onOpenLegal('terms') : (window.location.hash = '#terms')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-start"
                >
                  {isAr ? 'شروط الخدمة' : 'Terms of Service'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    if (onOpenCookieSettings) onOpenCookieSettings();
                  }}
                  className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-start font-medium"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAr ? 'إعدادات ملفات الارتباط (Cookies)' : 'Cookie settings'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Language Switcher, Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-2 select-none">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {language === 'ar' ? 'اريكسون' : 'Arixon'}.
            </span>
            <span>
              {language === 'ar'
                ? 'كافة الحقوق محفوظة.'
                : 'All rights reserved.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector Button */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
              </button>
            )}

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              aria-label={t.footer.backToTop}
            >
              <span>{t.footer.backToTop}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Always-visible caption for Image 2 in footer */}
        <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-neutral-900/60 text-[11px] text-neutral-400 dark:text-neutral-500">
          <span className="font-semibold text-neutral-600 dark:text-neutral-300">
            {isAr ? receptionImage.title.ar : receptionImage.title.en}:
          </span>{' '}
          <span>{isAr ? receptionImage.description.ar : receptionImage.description.en}</span>
        </div>
      </div>
    </footer>
  );
};
