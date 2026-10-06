import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Language } from '../types';
import { siteContent, TestimonialItem } from '../data/siteContent';
import { sound } from '../utils/sound';

interface TestimonialsSectionProps {
  language: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ language }) => {
  const isAr = language === 'ar';
  const testimonials = siteContent.testimonials || [];

  // GOLDEN RULE: Shown ONLY when real entries exist. If empty, return null!
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    sound.playClick();
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    sound.playClick();
    setCurrentIndex((i) => (i + 1) % testimonials.length);
  };

  const item: TestimonialItem = testimonials[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-[11px] font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-3">
            <Quote className="w-3.5 h-3.5" />
            <span>{isAr ? 'آراء العملاء والشركاء' : 'Client Testimonials'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isAr ? 'شهادات نعتز بها' : 'What Clients Say'}
          </h2>
        </div>

        {/* Carousel Card */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-6">
          <Quote className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto" />

          <p className="text-base sm:text-xl font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed italic max-w-2xl mx-auto">
            "{isAr ? item.quoteAR : item.quoteEN}"
          </p>

          <div className="pt-2">
            <div className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
              {item.name}
            </div>
            <div className="text-xs text-neutral-500 font-mono mt-0.5">
              {item.role} · {item.company}
            </div>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={prev}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setCurrentIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 bg-black dark:bg-white'
                        : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
