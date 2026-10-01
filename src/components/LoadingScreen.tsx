import React, { useState, useEffect } from 'react';
import { EriksonLogo } from './EriksonLogo';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface LoadingScreenProps {
  language: Language;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 850);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1250);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-opacity duration-500 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Arixon"
    >
      <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        <div className="relative mb-6">
          <EriksonLogo size="xl" glow={true} />
        </div>

        <div className="text-2xl sm:text-3xl font-bold tracking-tight uppercase font-sans">
          {t.loading.brand}
        </div>
        <div className="mt-1 text-xs tracking-widest text-neutral-400 uppercase font-mono">
          {t.loading.subtitle}
        </div>

        {/* Minimalist monochrome loading track */}
        <div className="mt-8 w-36 h-[2px] bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-marquee" style={{ width: '45%' }} />
        </div>
      </div>
    </div>
  );
};
