import React from 'react';
import {
  MessageCircle,
  Instagram,
  Facebook,
  Github,
} from 'lucide-react';
import { Language } from '../types';
import { SOCIAL_LINKS } from '../data/apps';

interface FloatingSocialDockProps {
  language: Language;
}

export const FloatingSocialDock: React.FC<FloatingSocialDockProps> = ({ language }) => {
  const whatsappUrl =
    language === 'ar' ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  const dockItems = [
    {
      id: 'github',
      name: 'GitHub',
      label: language === 'ar' ? 'مستودعات GitHub' : 'GitHub Repos',
      subtitle: 'omarkingx98-beep',
      url: SOCIAL_LINKS.github,
      icon: Github,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      label: language === 'ar' ? 'واتساب مباشر' : 'WhatsApp Chat',
      subtitle: SOCIAL_LINKS.whatsappNumber,
      url: whatsappUrl,
      icon: MessageCircle,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      label: language === 'ar' ? 'انستغرام' : 'Instagram',
      subtitle: '@omarshurrab.1',
      url: SOCIAL_LINKS.instagram,
      icon: Instagram,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      label: language === 'ar' ? 'فيسبوك' : 'Facebook',
      subtitle: language === 'ar' ? 'الصفحة الرسمية' : 'Official Page',
      url: SOCIAL_LINKS.facebook,
      icon: Facebook,
    },
  ];

  return (
    /* Desktop Floating Glass Dock (Side of screen only) */
    <aside
      aria-label={language === 'ar' ? 'قنوات التواصل والمستودعات' : 'Social & Code Channels'}
      className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-40 transition-all duration-300 left-5 rtl:left-auto rtl:right-5 flex-col items-center gap-2.5 p-2 rounded-2xl bg-white/75 dark:bg-black/75 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl select-none"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:text-neutral-600 mb-1" />

      {dockItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="relative group">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-neutral-100/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-800/80 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:rotate-6" />
            </a>

            {/* Tooltip on Hover */}
            <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-full ml-3 rtl:left-auto rtl:right-full rtl:ml-0 rtl:mr-3 px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 translate-x-1 rtl:-translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 rtl:group-hover:translate-x-0 transition-all duration-200 z-50">
              <div className="font-bold">{item.label}</div>
              <div className="text-[10px] opacity-75 font-mono dir-ltr">{item.subtitle}</div>
            </div>
          </div>
        );
      })}

      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:text-neutral-600 mt-1" />
    </aside>
  );
};
