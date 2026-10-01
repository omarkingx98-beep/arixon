import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../types';

interface BackToTopButtonProps {
  language: Language;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isAr = language === 'ar';

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label={isAr ? 'العودة إلى أعلى الصفحة' : 'Back to top'}
      title={isAr ? 'العودة للأعلى' : 'Back to top'}
      className="fixed bottom-6 end-6 z-40 p-3 sm:p-3.5 rounded-2xl bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-950 hover:bg-black dark:hover:bg-white shadow-xl hover:shadow-2xl border border-neutral-700/60 dark:border-neutral-200/60 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group flex items-center justify-center animate-in fade-in slide-in-from-bottom-3"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
    </button>
  );
};
