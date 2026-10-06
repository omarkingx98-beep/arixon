import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, Sparkles } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, AnnouncementSettings } from '../firebase/config';
import { Language } from '../types';
import { sound } from '../utils/sound';

interface AnnouncementBarProps {
  language: Language;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [data, setData] = useState<AnnouncementSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const unsub = onSnapshot(
        doc(db, 'settings', 'announcement'),
        (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.data() as AnnouncementSettings;
            setData(val);
            // Check if dismissed in localStorage for this specific announcement id
            if (val.id) {
              const wasDismissed =
                localStorage.getItem(`arixon_dismissed_announcement_${val.id}`) === 'true';
              setDismissed(wasDismissed);
            }
          } else {
            setData(null);
          }
        },
        (err) => {
          console.warn('Announcement listener:', err);
        }
      );
      return () => unsub();
    } catch (_) {}
  }, []);

  if (!data || !data.active || dismissed) return null;

  const text = isAr ? data.textAR : data.textEN;
  if (!text || !text.trim()) return null;

  const handleDismiss = () => {
    sound.playClick();
    setDismissed(true);
    if (data.id) {
      try {
        localStorage.setItem(`arixon_dismissed_announcement_${data.id}`, 'true');
      } catch (_) {}
    }
  };

  return (
    <div
      role="banner"
      className="relative z-40 bg-neutral-950 text-white dark:bg-white dark:text-black border-b border-neutral-800 dark:border-neutral-200 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-medium">
        <div className="w-6 shrink-0 hidden sm:block" />

        {/* Center message with optional link */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center truncate px-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
          <span className="truncate">{text}</span>
          {data.linkUrl && (
            <a
              href={data.linkUrl}
              target={data.linkUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:opacity-80 shrink-0 ms-1"
            >
              <span>{isAr ? 'عرض التفاصيل' : 'Learn more'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-md text-neutral-400 hover:text-white dark:hover:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
          aria-label={isAr ? 'إغلاق الإعلان' : 'Dismiss announcement'}
          title={isAr ? 'إغلاق' : 'Dismiss'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
