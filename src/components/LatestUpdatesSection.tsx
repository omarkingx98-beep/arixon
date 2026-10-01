import React, { useState, useEffect } from 'react';
import { Bell, Clock, Sparkles, ArrowUpRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db, CompanyUpdate } from '../firebase/config';
import { Language } from '../types';

interface LatestUpdatesSectionProps {
  language: Language;
}

export const LatestUpdatesSection: React.FC<LatestUpdatesSectionProps> = ({ language }) => {
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const isAr = language === 'ar';

  useEffect(() => {
    const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'), limit(6));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: CompanyUpdate[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            titleAR: data.titleAR || '',
            titleEN: data.titleEN || '',
            bodyAR: data.bodyAR || '',
            bodyEN: data.bodyEN || '',
            createdAt: data.createdAt,
          });
        });
        setUpdates(list);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to updates:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // CRITICAL REQUIREMENT: "hide the section when there are none."
  if (loading || updates.length === 0) {
    return null;
  }

  const formatDate = (ts: any) => {
    if (!ts) return '';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <section id="updates" className="py-16 sm:py-24 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2.5">
            <Bell className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>{isAr ? 'أخبار الشركة وتحديثات الأنظمة' : 'Official Announcements'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'آخر التحديثات والإصدارات' : 'Latest Updates & Releases'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isAr
              ? 'متابعة مستمرة لتطوير منتجاتنا، الميزات الجديدة المضافة، والإصدارات المعتمدة لأنظمة اريكسون.'
              : 'Direct changelog and announcements on new releases, architectural improvements, and system deployments.'}
          </p>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {updates.map((item) => (
            <article
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                  {isAr ? item.titleAR : item.titleEN}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {isAr ? item.bodyAR : item.bodyEN}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>ARIXON DISPATCH</span>
                <span className="text-neutral-900 dark:text-white font-medium">VERIFIED</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
