import React from 'react';
import { ArrowLeft, ArrowRight, Shield, Award, Sparkles, CheckCircle2, User } from 'lucide-react';
import { Language } from '../../types';
import { siteContent } from '../../data/siteContent';
import { sound } from '../../utils/sound';

interface AboutPageProps {
  language: Language;
  onGoHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language, onGoHome }) => {
  const isAr = language === 'ar';
  const { company, founder } = siteContent;

  const hasStory = Boolean(isAr ? company.storyAR : company.storyEN);
  const hasMission = Boolean(isAr ? company.missionAR : company.missionEN);
  const hasValues = company.values && company.values.length > 0;
  const hasFounder = Boolean(founder && founder.photo && (isAr ? founder.bioAR : founder.bioEN));
  const hasMilestones = founder.milestones && founder.milestones.length > 0;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Navigation Breadcrumb / Go Home */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة للرئيسية' : 'Return to Home'}</span>
          </button>

          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            {isAr ? 'عن اريكسون والمؤسس' : 'About Arixon & Founder'}
          </span>
        </div>

        {/* 1. Header & Company Story */}
        {hasStory && (
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-[11px] font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'قصة التأسيس' : 'Our Story'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {isAr ? 'هندسة برمجية متينة تصنع فارقاً حقيقياً.' : 'Bespoke software engineered for real-world resilience.'}
            </h1>

            <p className="text-base sm:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-4xl">
              {isAr ? company.storyAR : company.storyEN}
            </p>
          </section>
        )}

        {/* 2. Company Mission (Hidden if empty) */}
        {hasMission && (
          <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
              {isAr ? 'رسالتنا وهدفنا' : 'Our Mission'}
            </div>
            <p className="text-lg sm:text-2xl font-extrabold text-neutral-900 dark:text-white leading-relaxed">
              "{isAr ? company.missionAR : company.missionEN}"
            </p>
          </section>
        )}

        {/* 3. Company Values (Hidden if empty) */}
        {hasValues && (
          <section className="space-y-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isAr ? 'قيم ومبادئ اريكسون الهندسية' : 'Our Core Engineering Values'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500">
                {isAr
                  ? 'المعايير الثابتة التي تحكم كل سطر كود وتطبيق نبنيه لعملائنا.'
                  : 'The uncompromising principles governing every system we deploy.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {company.values.map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                      {isAr ? val.titleAR : val.titleEN}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed ps-6">
                    {isAr ? val.textAR : val.textEN}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Founder Block (Omar Shurrab) */}
        {hasFounder && (
          <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Founder Image Card */}
              <div className="lg:col-span-4">
                <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-300 dark:border-neutral-800 shadow-2xl aspect-[4/5] max-w-sm mx-auto">
                  <img
                    src={founder.photo}
                    alt={isAr ? 'عمر شراب' : 'Omar Shurrab'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="font-extrabold text-lg">
                      {isAr ? 'عمر شراب' : 'Omar Shurrab'}
                    </span>
                    <span className="text-xs text-neutral-300 font-mono">
                      {isAr ? founder.titleAR : founder.titleEN}
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder Bio */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500">
                  <User className="w-3.5 h-3.5" />
                  <span>{isAr ? 'عن المؤسس' : 'The Lead Architect'}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {isAr ? 'عمر شراب' : 'Omar Shurrab'}
                </h2>

                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {isAr ? founder.bioAR : founder.bioEN}
                </p>

                <div className="pt-2 text-xs font-mono text-neutral-500">
                  {isAr ? 'الموقع الرسمي: arixon.app · تواصل مباشر مع المؤسس' : 'Official Portal: arixon.app · Direct Founder Escalation'}
                </div>
              </div>
            </div>

            {/* Founder Milestones Timeline (Hidden if empty) */}
            {hasMilestones && (
              <div className="space-y-6 pt-6">
                <h3 className="text-xl font-bold tracking-tight">
                  {isAr ? 'محطات وتطور الأنظمة' : 'Engineering Milestones'}
                </h3>

                <div className="relative border-s-2 border-neutral-200 dark:border-neutral-800 ms-4 space-y-8">
                  {founder.milestones.map((m, idx) => (
                    <div key={idx} className="relative ps-6 sm:ps-8">
                      <div className="absolute -start-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-black border-2 border-neutral-900 dark:border-white" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                        {m.year}
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl">
                        {isAr ? m.textAR : m.textEN}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
