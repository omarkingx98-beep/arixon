import React from 'react';
import {
  Instagram,
  Facebook,
  MessageCircle,
  Github,
  ArrowUpRight,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SOCIAL_LINKS } from '../data/apps';

interface SocialSectionProps {
  language: Language;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const whatsappUrl =
    language === 'ar' ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  const socialItems = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      handle: SOCIAL_LINKS.whatsappNumber,
      actionText: language === 'ar' ? 'محادثة فورية على واتساب' : 'Chat on WhatsApp',
      url: whatsappUrl,
      icon: MessageCircle,
      isNumber: true,
    },
    {
      id: 'github',
      name: 'GitHub',
      handle: 'omarkingx98-beep',
      actionText: language === 'ar' ? 'تصفح مستودعات الكود' : 'Explore Repositories',
      url: SOCIAL_LINKS.github,
      icon: Github,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@omarshurrab.1',
      actionText: language === 'ar' ? 'متابعة عبر انستغرام' : 'Follow on Instagram',
      url: SOCIAL_LINKS.instagram,
      icon: Instagram,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'Omar Shurrab',
      actionText: language === 'ar' ? 'متابعة عبر فيسبوك' : 'Follow on Facebook',
      url: SOCIAL_LINKS.facebook,
      icon: Facebook,
    },
  ];

  return (
    <div className="pt-6">
      <div className="mb-4">
        <h4 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white uppercase font-mono">
          {t.socialSection.heading}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t.socialSection.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 group shadow-xs select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>{item.name}</span>
                  </div>
                  <div className={`text-xs text-neutral-500 dark:text-neutral-400 font-mono ${item.isNumber ? 'dir-ltr text-right rtl:text-right' : ''}`}>
                    {item.handle}
                  </div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                    {item.actionText}
                  </div>
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
