import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { JOURNEY_MILESTONES } from '../data/apps';

interface JourneySectionProps {
  language: Language;
}

export const JourneySection: React.FC<JourneySectionProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="journey" className="py-24 sm:py-32 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            <span>{t.journeySection.kicker}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'ar' ? 'محطات التطور' : 'Milestones'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {t.journeySection.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t.journeySection.subtitle}
          </p>
        </div>

        {/* Timeline Path (Strict Monochrome) */}
        <div className="relative border-l-2 rtl:border-l-0 rtl:border-r-2 border-neutral-200 dark:border-neutral-800 ml-4 rtl:ml-0 rtl:mr-4 space-y-12 sm:space-y-16">
          {JOURNEY_MILESTONES.map((item) => {
            const title = item.title[language];
            const desc = item.description[language];

            return (
              <div key={item.year} className="relative pl-6 sm:pl-10 rtl:pl-0 rtl:pr-6 rtl:sm:pr-10 group">
                {/* Node circle */}
                <div className="absolute -left-[9px] rtl:-left-auto rtl:-right-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-black border-2 border-neutral-900 dark:border-white group-hover:scale-125 transition-transform" />

                {/* Year Marker */}
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                  {item.year}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
