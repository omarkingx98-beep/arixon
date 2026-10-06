import React, { useState } from 'react';
import {
  Sliders,
  Check,
  Zap,
  Printer,
  Shield,
  MessageCircle,
  Database,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  FileText,
} from 'lucide-react';
import { Language } from '../types';
import { SOCIAL_LINKS } from '../data/apps';
import { sound } from '../utils/sound';

interface ProjectConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onTransferToWizard: (configSummary: string) => void;
}

interface PlatformOption {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  baseWeeks: number;
}

const PLATFORMS: PlatformOption[] = [
  {
    id: 'pos',
    nameAr: 'نظام كاشير ونقاط بيع متقدم (POS)',
    nameEn: 'Advanced Retail POS Terminal',
    descAr: 'مبيعات فورية، باركود، فواتير حرارية، ومخزون يعمل بدون إنترنت.',
    descEn: 'Instant sales, barcode scanner, thermal printing & offline inventory.',
    baseWeeks: 2,
  },
  {
    id: 'edu',
    nameAr: 'منصة إدارة مراكز تعليمية ومدارس',
    nameEn: 'Educational Center Hub',
    descAr: 'تسجيل طلاب، جداول، حسابات معلمين، واختبارات إلكترونية.',
    descEn: 'Student enrollment, timetables, payroll & digital exam studios.',
    baseWeeks: 2,
  },
  {
    id: 'ai',
    nameAr: 'محرك ذكاء اصطناعي وأتمتة مخصص',
    nameEn: 'Custom AI & Neural Automation',
    descAr: 'توليد محتوى، تحليل بيانات، ومساعد ذكي مخصص للشركة.',
    descEn: 'Generative AI content, visual assets & enterprise automation.',
    baseWeeks: 2,
  },
  {
    id: 'custom',
    nameAr: 'تطبيق ويب ونظام سحابي مخصص',
    nameEn: 'Bespoke Cloud & Web Application',
    descAr: 'هندسة فريدة من الصفر مخصصة لمتطلبات عملك بدقة.',
    descEn: 'Tailored architecture engineered specifically for your operations.',
    baseWeeks: 3,
  },
];

interface ModuleOption {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: any;
}

const MODULES: ModuleOption[] = [
  {
    id: 'offline',
    nameAr: 'استمرارية كاملة دون إنترنت (Offline-First)',
    nameEn: '100% Offline-First Local Database',
    icon: Database,
  },
  {
    id: 'thermal',
    nameAr: 'تعريف الطابعات الحرارية ودرج الكاشير',
    nameEn: 'Thermal ESC/POS Hardware Bus',
    icon: Printer,
  },
  {
    id: 'whatsapp',
    nameAr: 'أتمتة إرسال الفواتير والإشعارات عبر واتساب',
    nameEn: 'WhatsApp Automated Dispatcher',
    icon: MessageCircle,
  },
  {
    id: 'multi_branch',
    nameAr: 'ربط ومزامنة عدة فروع ومستودعات',
    nameEn: 'Multi-Branch Central Synchronization',
    icon: Layers,
  },
  {
    id: 'mobile',
    nameAr: 'نسخة مخصصة للهواتف والتابلت (PWA)',
    nameEn: 'Mobile & Tablet App Support (PWA)',
    icon: Smartphone,
  },
];

export const ProjectConfiguratorModal: React.FC<ProjectConfiguratorModalProps> = ({
  isOpen,
  onClose,
  language,
  onTransferToWizard,
}) => {
  const isAr = language === 'ar';
  const [selectedPlatform, setSelectedPlatform] = useState<string>('pos');
  const [selectedScale, setSelectedScale] = useState<'single' | 'multi' | 'enterprise'>('single');
  const [selectedModules, setSelectedModules] = useState<string[]>(['offline', 'thermal', 'whatsapp']);

  if (!isOpen) return null;

  const toggleModule = (id: string) => {
    sound.playClick();
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const currentPlatform = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0];
  const calculatedWeeks =
    currentPlatform.baseWeeks +
    (selectedScale === 'multi' ? 1 : selectedScale === 'enterprise' ? 2 : 0) +
    (selectedModules.length > 3 ? 1 : 0);

  const buildSummaryText = () => {
    const scaleText =
      selectedScale === 'single'
        ? isAr ? 'فرع واحد / بداية' : 'Single Location'
        : selectedScale === 'multi'
        ? isAr ? 'متعدد الفروع (2-5)' : 'Multi-Branch (2-5)'
        : isAr ? 'مؤسسي كبير / غير محدود' : 'Enterprise Scale';

    const moduleNames = selectedModules
      .map((id) => {
        const m = MODULES.find((mod) => mod.id === id);
        return m ? (isAr ? m.nameAr : m.nameEn) : '';
      })
      .filter(Boolean)
      .join(', ');

    return `${isAr ? 'النظام' : 'Platform'}: ${isAr ? currentPlatform.nameAr : currentPlatform.nameEn}\n${isAr ? 'النطاق' : 'Scale'}: ${scaleText}\n${isAr ? 'الوحدات المحددة' : 'Modules'}: ${moduleNames}\n${isAr ? 'المدة التقديرية' : 'Estimated Duration'}: ${calculatedWeeks} ${isAr ? 'أسابيع' : 'weeks'}`;
  };

  const handleSendWhatsApp = () => {
    sound.playClick();
    const summary = buildSummaryText();
    const encoded = encodeURIComponent(
      isAr
        ? `السلام عليكم، قمت بتخصيص مواصفات مشروعي عبر موقع اريكسون:\n\n${summary}\n\nأود مناقشة التنفيذ وبدء المشروع معكم.`
        : `Hello Omar, I customized my project specification via Arixon Studio Configurator:\n\n${summary}\n\nI would like to discuss implementation details.`
    );
    const phone = '970594399472';
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    onClose();
  };

  const handleTransfer = () => {
    sound.playClick();
    onTransferToWizard(buildSummaryText());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl my-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {isAr ? 'مُعدّ ومخصص المشاريع (Studio Configurator)' : 'Arixon Studio Configurator'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isAr
                  ? 'اختر مواصفات نظامك واحصل على تقدير زمني مباشر ومواصفات دقيقة'
                  : 'Configure your architecture and receive instant technical timeline specs'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 space-y-7 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Platform Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 block">
              {isAr ? '1. اختر نوع المنصة أو النظام الأساسي' : '1. Select Architecture Platform'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLATFORMS.map((platform) => {
                const isSelected = selectedPlatform === platform.id;
                return (
                  <button
                    key={platform.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPlatform(platform.id);
                    }}
                    className={`p-4 rounded-2xl text-start transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent shadow-lg'
                        : 'bg-neutral-50 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-750 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm">
                        {isAr ? platform.nameAr : platform.nameEn}
                      </span>
                      {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    </div>
                    <p
                      className={`text-[11px] leading-relaxed ${
                        isSelected ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-500'
                      }`}
                    >
                      {isAr ? platform.descAr : platform.descEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Scale */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 block">
              {isAr ? '2. حجم المنشأة وتوسع العمليات' : '2. Deployment Scale'}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'single', ar: 'فرع واحد / بداية', en: 'Single Location' },
                { id: 'multi', ar: 'متعدد الفروع (2-5)', en: 'Multi-Branch (2-5)' },
                { id: 'enterprise', ar: 'مؤسسي / غير محدود', en: 'Enterprise Hub' },
              ].map((scale) => {
                const isSelected = selectedScale === scale.id;
                return (
                  <button
                    key={scale.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedScale(scale.id as any);
                    }}
                    className={`py-3 px-2 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {isAr ? scale.ar : scale.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Modules */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 block">
              {isAr ? '3. الميزات والوحدات التقنية المطلوبة' : '3. Engineering Modules & Capabilities'}
            </label>
            <div className="space-y-2">
              {MODULES.map((mod) => {
                const isSelected = selectedModules.includes(mod.id);
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-white'
                        : 'bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      <span>{isAr ? mod.nameAr : mod.nameEn}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                          : 'border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Spec Assessment Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-start">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                {isAr ? 'المواصفة التقديرية للجاهزية' : 'Estimated Delivery Assessment'}
              </div>
              <div className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
                ~ {calculatedWeeks} {isAr ? 'أسابيع للتسليم والاختبار' : 'Weeks for Build & Testing'}
              </div>
              <div className="text-[11px] text-neutral-500">
                {isAr
                  ? 'ملكية تامة 100% · صفر اشتراك شهري · استمرارية بدون نت'
                  : '100% Owned Source · 0% Monthly Rental · Offline Resilient'}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'إرسال المواصفة لواتساب' : 'WhatsApp Spec'}</span>
              </button>

              <button
                onClick={handleTransfer}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{isAr ? 'متابعة كطلب رسمي' : 'Submit as Request'}</span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
