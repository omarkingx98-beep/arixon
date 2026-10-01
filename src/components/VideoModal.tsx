import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Play, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { introVideo, INTRO_VIDEO_EMBED_URL, INTRO_VIDEO_YOUTUBE_URL } from '../data/videoConfig';
import { EriksonLogo } from './EriksonLogo';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isAr = language === 'ar';
  const [loadError, setLoadError] = useState(false);

  // Close on ESC key and handle body scroll lock
  useEffect(() => {
    if (!isOpen) {
      setLoadError(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // CRITICAL: If not open, return null so the iframe is completely removed from DOM and audio/video immediately stops!
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'فيديو تعريفي عن اريكسون' : 'Arixon Intro Video'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Container */}
      <div
        className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <EriksonLogo size="sm" glow={false} />
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span>{isAr ? 'فيديو تعريفي — اريكسون' : 'Meet Arixon — Intro Video'}</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                  HD · 1080p
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden xs:block">
                {isAr
                  ? 'هندسة وتطوير الأنظمة البرمجية المتقدمة'
                  : 'High-Performance Software Architecture & Systems'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct YouTube Link */}
            <a
              href={INTRO_VIDEO_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors border border-neutral-700 cursor-pointer"
              title={isAr ? 'فتح على يوتيوب' : 'Open in YouTube'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAr ? 'شاهد على يوتيوب' : 'Watch on YouTube'}
              </span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700/80 transition-colors cursor-pointer"
              aria-label={isAr ? 'إغلاق الفيديو' : 'Close video'}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Video Canvas */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {!loadError ? (
            <iframe
              src={INTRO_VIDEO_EMBED_URL}
              title="Arixon Intro Video"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full border-0"
              onError={() => setLoadError(true)}
            />
          ) : (
            /* Fallback if embed is blocked or fails */
            <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-neutral-900">
              <img
                src={introVideo.poster}
                alt="Arixon Intro Poster"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 max-w-md">
                <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  {isAr ? 'تعذر تشغيل الفيديو داخل المتصفح' : 'Video player unavailable in frame'}
                </h4>
                <p className="text-xs text-neutral-400 mb-4">
                  {isAr
                    ? 'يمكنك مشاهدة الفيديو التعريفي مباشرة على يوتيوب بجودة عالية وبشاشة كاملة.'
                    : 'You can watch the official intro video directly on YouTube in high definition.'}
                </p>
                <a
                  href={INTRO_VIDEO_YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-lg"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>{isAr ? 'شاهد على يوتيوب' : 'Watch on YouTube'}</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-neutral-950 border-t border-neutral-900 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 gap-2">
          <span>{isAr ? 'اضغط ESC أو في أي مكان بالخارج للإغلاق' : 'Press ESC or click outside to close'}</span>
          <span className="font-mono text-neutral-400">ID: {introVideo.youtubeId}</span>
        </div>
      </div>
    </div>
  );
};
