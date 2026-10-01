import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { Language } from '../types';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface HowWeWorkSectionProps {
  language: Language;
}

export const HowWeWorkSection: React.FC<HowWeWorkSectionProps> = ({ language }) => {
  const isAr = language === 'ar';
  const { howWeWork } = COMPANY_CONFIG;

  return (
    <section id="how-we-work" className="py-20 sm:py-28 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            <Clock className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>{isAr ? 'منهجية العمل والتنفيذ' : 'Our Engineering Process'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {isAr ? 'كيف نعمل: من الفكرة إلى النظام الحي' : 'How We Work: From Concept to Production'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isAr
              ? 'أربع خطوات واضحة ومباشرة تضمن لك نظاماً برمجياً دقيقاً ومستقراً، دون هدر للوقت أو غموض في التنفيذ.'
              : 'A structured, transparent four-stage delivery model ensuring zero surprises and rapid time-to-market.'}
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howWeWork.map((step, idx) => (
            <div
              key={step.step}
              className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-all"
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                    {step.step}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {isAr ? `مرحلة ${idx + 1}` : `Phase ${idx + 1}`}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  {isAr ? step.title.ar : step.title.en}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {isAr ? step.description.ar : step.description.en}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {idx === 0
                    ? isAr ? 'تحديد النطاق' : 'Scope Definition'
                    : idx === 1
                    ? isAr ? 'اعتماد الواجهات' : 'UI Approval'
                    : idx === 2
                    ? isAr ? 'اختبار المعمارية' : 'Code Verification'
                    : isAr ? 'تشغيل وتدريب' : 'Deployment & Live'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
