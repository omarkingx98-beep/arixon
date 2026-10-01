import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TECH_STACK } from '../data/apps';

interface TechStackSectionProps {
  language: Language;
}

export const TechStackSection: React.FC<TechStackSectionProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="tech" className="py-24 sm:py-32 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            <span>{t.techSection.kicker}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'ar' ? 'معايير اريكسون' : 'Arixon Disciplines'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {t.techSection.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t.techSection.subtitle}
          </p>
        </div>

        {/* Tech Grid (Strict Monochrome) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 hover:-translate-y-1 shadow-sm select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-3 font-mono text-xs font-bold">
                {tech.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                {tech.name}
              </div>
              <div className="mt-0.5 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                {tech.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
