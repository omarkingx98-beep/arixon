import React from 'react';
import { Check, X, Shield, Zap, Database, Lock, Wrench, Sparkles, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { SOCIAL_LINKS } from '../data/apps';
import { sound } from '../utils/sound';

interface ComparisonMatrixSectionProps {
  language: Language;
  onOpenProjectWizard: () => void;
}

export const ComparisonMatrixSection: React.FC<ComparisonMatrixSectionProps> = ({
  language,
  onOpenProjectWizard,
}) => {
  const isAr = language === 'ar';

  const rows = [
    {
      featureAr: 'ملكية الكود وقاعدة البيانات',
      featureEn: 'Code & Database Ownership',
      descAr: 'التحكم الكامل ببياناتك وأكوادك دون أي قفل أو احتكار',
      descEn: 'Zero vendor lock-in. 100% owned by your enterprise',
      arixon: isAr ? 'ملكية تامة 100% (أنت المالك الوحيد)' : '100% Owned by You (Zero Rental)',
      generic: isAr ? 'تأجير واشتراك شهري إلزامي (بياناتك محبوسة)' : 'Monthly Rent (Locked In)',
      arixonCheck: true,
      genericCheck: false,
    },
    {
      featureAr: 'الاستمرارية بدون إنترنت (Offline First)',
      featureEn: 'Full Offline Resilience',
      descAr: 'مواصلة المبيعات والطباعة وإصدار الفواتير عند انقطاع الشبكة',
      descEn: 'Continue sales and printing during network drops',
      arixon: isAr ? 'يعمل بكامل كفاءته أوفلاين مع مزامنة ذكية' : 'Uninterrupted Offline Performance',
      generic: isAr ? 'يتوقف النظام كلياً عن العمل عند انقطاع النت' : 'Completely halts on disconnection',
      arixonCheck: true,
      genericCheck: false,
    },
    {
      featureAr: 'سرعة الاستجابة وأداء الكاشير',
      featureEn: 'Response Latency & Speed',
      descAr: 'زمن تنفيذ العمليات أثناء ذروة الازدحام',
      descEn: 'Operation latency during peak traffic hours',
      arixon: isAr ? 'فائق السرعة (أقل من 50 ميلي ثانية)' : 'Blazing Fast (<50ms locally)',
      generic: isAr ? 'بطيء ويعتمد على تحميل صفحات الويب (1-3 ثوانٍ)' : 'Laggy web page loads (1-3s)',
      arixonCheck: true,
      genericCheck: false,
    },
    {
      featureAr: 'الهندسة العربية والطباعة الحرارية',
      featureEn: 'Native Arabic RTL & Thermal Hardware',
      descAr: 'طباعة فورية متوافقة مع الطابعات الحرارية وباركود الكاشير',
      descEn: 'Native ESC/POS hardware bus & Arabic receipt typography',
      arixon: isAr ? 'مبرمج أصلياً للغة العربية والطابعات الحرارية' : 'Native Arabic & ESC/POS Printers',
      generic: isAr ? 'قوالب أجنبية مترجمة تشوه الفواتير وتنسيقها' : 'Translated foreign templates',
      arixonCheck: true,
      genericCheck: false,
    },
    {
      featureAr: 'الدعم الهندسي المباشر',
      featureEn: 'Direct Architect Support',
      descAr: 'التواصل لحل المشكلات أو التخصيص المستقبلي',
      descEn: 'Direct escalation with the lead software architect',
      arixon: isAr ? 'تواصل مباشر مع المهندس عمر شراب' : 'Direct Access to Lead Architect',
      generic: isAr ? 'بوتات دعم آلي أو موظفي مبيعات غير تقنيين' : 'Automated bots or slow ticket queues',
      arixonCheck: true,
      genericCheck: false,
    },
  ];

  const whatsappUrl =
    isAr ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-widest mb-3">
            <Shield className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
            <span>{isAr ? 'مقارنة المعايير الهندسية' : 'Engineering Benchmark'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            <span>{isAr ? 'لماذا تختار أنظمة ' : 'Why Choose '}</span>
            <span className="underline decoration-2 underline-offset-8 decoration-neutral-400">
              {isAr ? 'اريكسون؟' : 'Arixon Architecture?'}
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'مقارنة صريحة بين البنية البرمجية المخصصة التي نبنيها من الصفر، وبين القوالب المستأجرة والشركات التقليدية.'
              : 'A transparent comparison between bespoke high-performance engineering versus off-the-shelf rental scripts.'}
          </p>
        </div>

        {/* Matrix Card */}
        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 overflow-hidden shadow-xl">
          {/* Header Row */}
          <div className="grid grid-cols-12 p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 font-bold text-xs sm:text-sm">
            <div className="col-span-5 sm:col-span-6 text-neutral-700 dark:text-neutral-300">
              {isAr ? 'المعيار والميزة' : 'Standard / Feature'}
            </div>
            <div className="col-span-4 sm:col-span-3 text-center text-neutral-950 dark:text-white flex items-center justify-center gap-1.5 font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAr ? 'أنظمة اريكسون' : 'Arixon Architecture'}</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center text-neutral-500 dark:text-neutral-400">
              {isAr ? 'الأنظمة والقوالب الأخرى' : 'Generic / Rental Apps'}
            </div>
          </div>

          {/* Body Rows */}
          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80 text-xs sm:text-sm">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-4 sm:p-6 items-center hover:bg-neutral-100/40 dark:hover:bg-neutral-900/40 transition-colors"
              >
                {/* Feature Description */}
                <div className="col-span-5 sm:col-span-6 pe-2 sm:pe-4">
                  <div className="font-bold text-neutral-900 dark:text-white">
                    {isAr ? row.featureAr : row.featureEn}
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                    {isAr ? row.descAr : row.descEn}
                  </div>
                </div>

                {/* Arixon Column (Highlighted) */}
                <div className="col-span-4 sm:col-span-3 text-center p-2 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-neutral-200/60 dark:border-neutral-800/60">
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black text-white dark:bg-white dark:text-black mb-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="font-bold text-neutral-900 dark:text-white text-[11px] sm:text-xs leading-snug">
                    {row.arixon}
                  </div>
                </div>

                {/* Generic Column */}
                <div className="col-span-3 sm:col-span-3 text-center ps-2">
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 mb-1">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 leading-snug">
                    {row.generic}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Footer Action Bar */}
          <div className="p-6 sm:p-8 bg-neutral-100/90 dark:bg-neutral-900/90 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-start">
              <span className="font-bold text-neutral-900 dark:text-white text-sm block">
                {isAr
                  ? 'هل تريد حلاً مخصصاً مصمماً خصيصاً لمؤسستك؟'
                  : 'Ready to build a system crafted specifically for your workflow?'}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mt-0.5">
                {isAr
                  ? 'احصل على دراسة متطلبات مجانية ومناقشة تقنية مباشرة.'
                  : 'Get a zero-obligation architecture assessment and direct engineering consultation.'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenProjectWizard();
                }}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                {isAr ? 'بدء طلب مشروع جديد' : 'Configure Your Project'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold text-xs sm:text-sm hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-all cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
