import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Search,
  ChevronDown,
  X,
  MessageCircle,
} from 'lucide-react';
import { Language } from '../../types';
import { siteContent } from '../../data/siteContent';
import { SOCIAL_LINKS } from '../../data/apps';
import { sound } from '../../utils/sound';

interface FaqPageProps {
  language: Language;
  onGoHome: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ language, onGoHome }) => {
  const isAr = language === 'ar';
  const { faq } = siteContent;

  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Filter FAQs based on query
  const q = searchQuery.trim().toLowerCase();
  const filteredFaqs = faq.filter((item) => {
    if (!q) return true;
    return (
      item.qAR.toLowerCase().includes(q) ||
      item.qEN.toLowerCase().includes(q) ||
      item.aAR.toLowerCase().includes(q) ||
      item.aEN.toLowerCase().includes(q)
    );
  });

  // Inject dynamic FAQPage JSON-LD strictly from the real entries
  useEffect(() => {
    if (faq.length === 0) return;

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: isAr ? item.qAR : item.qEN,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isAr ? item.aAR : item.aEN,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-page-jsonld';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('faq-page-jsonld');
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, [faq, isAr]);

  const toggleAccordion = (idx: number) => {
    sound.playClick();
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const whatsappUrl =
    isAr ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
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
            {isAr ? 'الأسئلة الشائعة والأجوبة' : 'Frequently Asked Questions'}
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-[11px] font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'مركز الإجابات المعتمدة' : 'Official FAQ Desk'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isAr ? 'الأسئلة الشائعة حول أنظمة اريكسون' : 'Frequently Asked Questions'}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            {isAr
              ? 'إجابات تقنية مباشرة حول آلية العمل، العمل بدون إنترنت، ملكية الكود، والتوافق مع الأجهزة.'
              : 'Direct engineering answers regarding offline resilience, code ownership, hardware buses, and onboarding.'}
          </p>
        </div>

        {/* Live Search Box */}
        <div className="relative">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null);
            }}
            placeholder={
              isAr
                ? 'ابحث في الأسئلة (مثال: أوفلاين، طابعات، ملكية، كاشير)...'
                : 'Search FAQ (e.g., offline, printer, ownership, delivery)...'
            }
            className="w-full ps-11 pe-10 py-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Accordion FAQ Entries */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              {isAr ? 'لم يتم العثور على سؤال يطابق بحثك.' : 'No FAQ entries matched your search query.'}
            </div>
          ) : (
            filteredFaqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              const question = isAr ? item.qAR : item.qEN;
              const answer = isAr ? item.aAR : item.aEN;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAccordion(idx);
                      }
                    }}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-start font-bold text-xs sm:text-base text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="pe-4">{question}</span>
                    <div
                      className={`w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-850">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base">
              {isAr ? 'هل لديك سؤال غير مذكور هنا؟' : 'Have a question not listed here?'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isAr
                ? 'تواصل مباشرة مع المهندس عمر شراب لمناقشة تفاصيل نظامك.'
                : 'Direct escalation with lead architect Omar Shurrab via WhatsApp.'}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-md shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAr ? 'اسألنا عبر واتساب' : 'Ask on WhatsApp'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
