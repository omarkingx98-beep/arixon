import React from 'react';
import {
  Store,
  Cpu,
  Palette,
  GraduationCap,
  Code,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SERVICES_DATA } from '../data/apps';

interface ServicesSectionProps {
  language: Language;
  onSelectService: (serviceTitle: string) => void;
}

const ICON_MAP = {
  Store,
  Cpu,
  Palette,
  GraduationCap,
  Code,
  Boxes: Store,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  language,
  onSelectService,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="services" className="py-24 sm:py-32 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            <span>{t.servicesSection.kicker}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'ar' ? 'حلول اريكسون' : 'Arixon Disciplines'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {t.servicesSection.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t.servicesSection.subtitle}
          </p>
        </div>

        {/* Services Grid (Strict Monochrome) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_DATA.map((service, index) => {
            const Icon = ICON_MAP[service.iconName] || Store;
            const title = service.title[language];
            const subtitle = service.subtitle[language];
            const desc = service.description[language];
            const deliverables = service.deliverables[language];
            const tag = service.highlightTag[language];

            const isFeatured = index === 0;

            return (
              <div
                key={service.id}
                className={`relative flex flex-col justify-between p-7 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 shadow-sm hover:shadow-xl ${
                  isFeatured ? 'lg:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Top Line: Icon and Editorial Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
                      {tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {subtitle}
                  </p>

                  {/* Description */}
                  <p className="mt-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {desc}
                  </p>

                  {/* Deliverables Checklist (Monochrome) */}
                  <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                      {t.servicesSection.keyDeliverables}
                    </div>
                    <ul className="space-y-2">
                      {deliverables.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => {
                      onSelectService(title);
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
                  >
                    <span>{t.servicesSection.requestServiceBtn}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
