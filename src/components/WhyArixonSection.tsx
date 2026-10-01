import React from 'react';
import { ShieldCheck, UserCheck, Zap, Globe2, Sparkles, Layers } from 'lucide-react';
import { Language } from '../types';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface WhyArixonSectionProps {
  language: Language;
}

export const WhyArixonSection: React.FC<WhyArixonSectionProps> = ({ language }) => {
  const isAr = language === 'ar';
  const { whyArixon, techMarquee } = COMPANY_CONFIG;

  const icons = [
    <Layers className="w-5 h-5 text-neutral-900 dark:text-white" />,
    <UserCheck className="w-5 h-5 text-neutral-900 dark:text-white" />,
    <Zap className="w-5 h-5 text-neutral-900 dark:text-white" />,
    <Globe2 className="w-5 h-5 text-neutral-900 dark:text-white" />,
  ];

  return (
    <section id="why-arixon" className="py-20 sm:py-28 bg-white dark:bg-black text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>{isAr ? 'القيمة الهندسية والعملية' : 'Why Choose Arixon'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {isAr
              ? 'لماذا تعتمد الشركات والمؤسسات على اريكسون؟'
              : 'Engineered for Performance. Built Without Compromise.'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isAr
              ? 'نبتعد عن القوالب الجاهزة والحلول المؤقتة؛ نبني معمارية برمجية صلبة وواقعية تخدم نشاطك التجاري بدقة وسرعة متناهية.'
              : 'We reject generic templates and fragile workarounds. We build robust, reliable systems that adapt to your exact business operations.'}
          </p>
        </div>

        {/* 4 Non-Numeric Value Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {whyArixon.map((point, idx) => (
            <div
              key={point.id}
              className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-xs">
                    {icons[idx] || <ShieldCheck className="w-5 h-5 text-white" />}
                  </div>
                  <span className="font-mono text-xs text-neutral-400">0{idx + 1}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  {isAr ? point.title.ar : point.title.en}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {isAr ? point.description.ar : point.description.en}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>ARIXON PRINCIPLE</span>
                <span className="text-neutral-900 dark:text-white font-medium">CORE VALUE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Marquee (Editable in Config) */}
        <div className="mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              {isAr ? 'التقنيات الأساسية المعتمدة' : 'Core Technology Stack'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {techMarquee.map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-xs hover:border-neutral-400 transition-colors"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
