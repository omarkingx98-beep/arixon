import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { FAQ_DATA } from '../data/apps';

interface FaqSectionProps {
  language: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language }) => {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);
  const t = TRANSLATIONS[language];

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            <span>{t.faqSection.kicker}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'ar' ? 'توضيحات اريكسون' : 'Arixon Clarifications'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {t.faqSection.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t.faqSection.subtitle}
          </p>
        </div>

        {/* FAQ Accordion List (Strict Monochrome) */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => {
            const isOpen = openId === faq.id;
            const q = faq.question[language];
            const a = faq.answer[language];

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left rtl:text-right font-bold text-base sm:text-lg text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 rtl:pr-0 rtl:pl-4">{q}</span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-neutral-900 text-white dark:bg-white dark:text-black' : 'text-neutral-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 animate-in fade-in duration-200">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
