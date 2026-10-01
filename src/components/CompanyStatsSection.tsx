import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface CompanyStatsSectionProps {
  language: Language;
}

export const CompanyStatsSection: React.FC<CompanyStatsSectionProps> = ({ language }) => {
  const isAr = language === 'ar';
  const { realStats } = COMPANY_CONFIG;

  // Golden rule: only display real verified numbers
  if (!realStats || realStats.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-950 border-y border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          {/* Real verified stats display */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-3xl sm:text-4xl font-mono shadow-md">
              {realStats[0].value}
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'بيانات حقيقية معتمدة' : 'Verified Production Data'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
                {isAr ? realStats[0].label.ar : realStats[0].label.en}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {isAr ? realStats[0].sublabel.ar : realStats[0].sublabel.en}
              </p>
            </div>
          </div>

          {/* Direct Architecture Statement */}
          <div className="md:max-w-md text-start md:text-end border-t md:border-t-0 md:border-s border-neutral-200 dark:border-neutral-800 pt-4 md:pt-0 md:ps-8">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
              ARIXON ENGINEERING
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {isAr
                ? 'أنظمة برمجية حقيقية 100% تم تصميمها وتطويرها لحل مشكلات واقعية في المبيعات، المحاسبة، إدارة المراكز، وتطبيقات الذكاء الاصطناعي.'
                : '100% genuine software architectures engineered to solve tangible problems in retail POS, education centers, and AI business workflows.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
