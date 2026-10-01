import React from 'react';
import {
  ArrowUp,
  Instagram,
  Facebook,
  MessageCircle,
  Github,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SOCIAL_LINKS } from '../data/apps';
import { companyImages } from '../data/companyImages';
import { EriksonLogo } from './EriksonLogo';

interface FooterProps {
  language: Language;
  onOpenLegal?: (doc: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenLegal }) => {
  const t = TRANSLATIONS[language];
  const isAr = language === 'ar';
  const receptionImage = companyImages[1]; // Image 2: Reception

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { href: '#meet-arixon', label: isAr ? 'فيديو تعريفي' : 'Intro Video' },
    { href: '#why-arixon', label: isAr ? 'لماذا اريكسون' : 'Why Arixon' },
    { href: '#how-we-work', label: isAr ? 'كيف نعمل' : 'How We Work' },
    { href: '#apps', label: t.nav.apps },
    { href: '#workspace', label: isAr ? 'بيئة العمل' : 'Workspace' },
    { href: '#updates', label: isAr ? 'آخر التحديثات' : 'Updates' },
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#contact', label: t.nav.contact },
  ];

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
      {/* Subtle Darkened Reception Background (Image 2) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 dark:opacity-10">
        <img
          src={receptionImage.url}
          alt={isAr ? receptionImage.title.ar : receptionImage.title.en}
          loading="lazy"
          className="w-full h-full object-cover filter grayscale"
        />
        <div className="absolute inset-0 bg-white/90 dark:bg-black/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-neutral-100 dark:border-neutral-900">
          {/* Brand Col (md: col-span-5) */}
          <div className="md:col-span-5 space-y-4">
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

            {/* Social Media Row with 4 official channels */}
            <div className="pt-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2.5">
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
                      className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 border border-neutral-200/60 dark:border-neutral-800"
                      aria-label={s.name}
                      title={s.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links (md: col-span-3) */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              {t.footer.quickLinks}
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Summary (md: col-span-4) */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              {t.footer.contactInfo}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
              {language === 'ar' ? 'شركة اريكسون للحلول البرمجية' : 'Arixon Software Solutions'}
            </div>
            <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              {SOCIAL_LINKS.email}
            </div>
            <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 dir-ltr text-right rtl:text-right">
              {SOCIAL_LINKS.whatsappNumber}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 pt-2">
              {language === 'ar'
                ? 'مقر التطوير: أنظمة الأعمال المتقدمة وهندسة الذكاء الاصطناعي'
                : 'Advanced Enterprise Software & AI Architecture'}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
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
            <span className="mx-1">·</span>
            <button
              onClick={() => onOpenLegal ? onOpenLegal('privacy') : (window.location.hash = '#privacy')}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegal ? onOpenLegal('terms') : (window.location.hash = '#terms')}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'شروط الخدمة' : 'Terms of Service'}
            </button>
          </div>

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
