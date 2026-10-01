import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { companyImages, CompanyImage } from '../data/companyImages';
import { EriksonLogo } from './EriksonLogo';

interface WorkspaceSectionProps {
  language: Language;
}

export const WorkspaceSection: React.FC<WorkspaceSectionProps> = ({ language }) => {
  const isAr = language === 'ar';
  // Workspace gallery uses images 1 to 4
  const workspaceItems = companyImages.slice(0, 4);

  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({});

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % workspaceItems.length : 0
        );
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + workspaceItems.length) % workspaceItems.length
            : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, workspaceItems.length]);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id: string) => {
    setErrorImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="workspace" className="py-24 sm:py-32 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'بيئة العمل والتطوير' : 'Our Workspace'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? 'اريكسون' : 'Arixon'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
              {isAr
                ? 'المقر وبيئة العمل الهندسية'
                : 'Where High-Performance Systems Are Engineered'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {isAr
                ? 'استكشف المقر، استوديو البرمجة، وقاعات التخطيط التي تصمم فيها أحدث أنظمة الأعمال وتطبيقات الذكاء الاصطناعي.'
                : 'Explore the headquarters, engineering studio, and strategy halls where our bespoke software and AI engines are crafted.'}
            </p>
          </div>
        </div>

        {/* Bento Grid Gallery (Images 1-4) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: Headquarters Exterior (Large Hero Bento Card: col-span-7) */}
          <div className="md:col-span-7 flex flex-col group">
            <div
              onClick={() => setActiveLightboxIndex(0)}
              className="relative aspect-[3/2] w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-lg cursor-pointer transform-gpu transition-all duration-500 hover:shadow-2xl"
            >
              {!loadedImages[workspaceItems[0].id] && !errorImages[workspaceItems[0].id] && (
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              )}
              {!errorImages[workspaceItems[0].id] ? (
                <img
                  src={workspaceItems[0].url}
                  alt={isAr ? workspaceItems[0].title.ar : workspaceItems[0].title.en}
                  loading="lazy"
                  onLoad={() => handleImageLoad(workspaceItems[0].id)}
                  onError={() => handleImageError(workspaceItems[0].id)}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
                    loadedImages[workspaceItems[0].id] ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black text-white">
                  <EriksonLogo size="lg" />
                  <span className="mt-3 text-xs font-mono">Arixon</span>
                </div>
              )}

              {/* Hover Fullscreen Cue */}
              <div className="absolute top-4 end-4 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            {/* Always-Visible Caption Below Image */}
            <div className="mt-3.5 px-1">
              <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                {isAr ? workspaceItems[0].title.ar : workspaceItems[0].title.en}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {isAr ? workspaceItems[0].description.ar : workspaceItems[0].description.en}
              </p>
            </div>
          </div>

          {/* Card 2: Reception (col-span-5) */}
          <div className="md:col-span-5 flex flex-col group">
            <div
              onClick={() => setActiveLightboxIndex(1)}
              className="relative aspect-[3/2] w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-lg cursor-pointer transform-gpu transition-all duration-500 hover:shadow-2xl"
            >
              {!loadedImages[workspaceItems[1].id] && !errorImages[workspaceItems[1].id] && (
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              )}
              {!errorImages[workspaceItems[1].id] ? (
                <img
                  src={workspaceItems[1].url}
                  alt={isAr ? workspaceItems[1].title.ar : workspaceItems[1].title.en}
                  loading="lazy"
                  onLoad={() => handleImageLoad(workspaceItems[1].id)}
                  onError={() => handleImageError(workspaceItems[1].id)}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
                    loadedImages[workspaceItems[1].id] ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black text-white">
                  <EriksonLogo size="lg" />
                  <span className="mt-3 text-xs font-mono">Arixon</span>
                </div>
              )}

              <div className="absolute top-4 end-4 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3.5 px-1">
              <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                {isAr ? workspaceItems[1].title.ar : workspaceItems[1].title.en}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {isAr ? workspaceItems[1].description.ar : workspaceItems[1].description.en}
              </p>
            </div>
          </div>

          {/* Card 3: Software Studio (col-span-6) */}
          <div className="md:col-span-6 flex flex-col group">
            <div
              onClick={() => setActiveLightboxIndex(2)}
              className="relative aspect-[3/2] w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-lg cursor-pointer transform-gpu transition-all duration-500 hover:shadow-2xl"
            >
              {!loadedImages[workspaceItems[2].id] && !errorImages[workspaceItems[2].id] && (
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              )}
              {!errorImages[workspaceItems[2].id] ? (
                <img
                  src={workspaceItems[2].url}
                  alt={isAr ? workspaceItems[2].title.ar : workspaceItems[2].title.en}
                  loading="lazy"
                  onLoad={() => handleImageLoad(workspaceItems[2].id)}
                  onError={() => handleImageError(workspaceItems[2].id)}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
                    loadedImages[workspaceItems[2].id] ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black text-white">
                  <EriksonLogo size="lg" />
                  <span className="mt-3 text-xs font-mono">Arixon</span>
                </div>
              )}

              <div className="absolute top-4 end-4 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3.5 px-1">
              <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                {isAr ? workspaceItems[2].title.ar : workspaceItems[2].title.en}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {isAr ? workspaceItems[2].description.ar : workspaceItems[2].description.en}
              </p>
            </div>
          </div>

          {/* Card 4: Meeting Room (col-span-6) */}
          <div className="md:col-span-6 flex flex-col group">
            <div
              onClick={() => setActiveLightboxIndex(3)}
              className="relative aspect-[3/2] w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-lg cursor-pointer transform-gpu transition-all duration-500 hover:shadow-2xl"
            >
              {!loadedImages[workspaceItems[3].id] && !errorImages[workspaceItems[3].id] && (
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              )}
              {!errorImages[workspaceItems[3].id] ? (
                <img
                  src={workspaceItems[3].url}
                  alt={isAr ? workspaceItems[3].title.ar : workspaceItems[3].title.en}
                  loading="lazy"
                  onLoad={() => handleImageLoad(workspaceItems[3].id)}
                  onError={() => handleImageError(workspaceItems[3].id)}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
                    loadedImages[workspaceItems[3].id] ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black text-white">
                  <EriksonLogo size="lg" />
                  <span className="mt-3 text-xs font-mono">Arixon</span>
                </div>
              )}

              <div className="absolute top-4 end-4 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3.5 px-1">
              <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                {isAr ? workspaceItems[3].title.ar : workspaceItems[3].title.en}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {isAr ? workspaceItems[3].description.ar : workspaceItems[3].description.en}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Top Bar Controls */}
          <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10">
            <div className="text-white text-xs font-mono px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md">
              {activeLightboxIndex + 1} / {workspaceItems.length}
            </div>
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) =>
                prev !== null
                  ? (prev - 1 + workspaceItems.length) % workspaceItems.length
                  : 0
              );
            }}
            className="absolute start-4 sm:start-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Previous image"
          >
            {isAr ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % workspaceItems.length : 0
              );
            }}
            className="absolute end-4 sm:end-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Next image"
          >
            {isAr ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>

          {/* Lightbox Image & Caption Box */}
          <div
            className="max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] w-auto overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={workspaceItems[activeLightboxIndex].url}
                alt={
                  isAr
                    ? workspaceItems[activeLightboxIndex].title.ar
                    : workspaceItems[activeLightboxIndex].title.en
                }
                className="max-h-[75vh] max-w-full object-contain rounded-2xl"
              />
            </div>

            {/* Lightbox Caption */}
            <div className="mt-5 text-center max-w-2xl px-4 text-white">
              <h4 className="text-xl sm:text-2xl font-bold">
                {isAr
                  ? workspaceItems[activeLightboxIndex].title.ar
                  : workspaceItems[activeLightboxIndex].title.en}
              </h4>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {isAr
                  ? workspaceItems[activeLightboxIndex].description.ar
                  : workspaceItems[activeLightboxIndex].description.en}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
