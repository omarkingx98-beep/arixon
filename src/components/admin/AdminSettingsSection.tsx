import React, { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Plus,
  Trash2,
  LogOut,
  Shield,
  Lock,
  Megaphone,
  Save,
  CheckCircle2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, ADMIN_EMAIL, AnnouncementSettings } from '../../firebase/config';
import { Language } from '../../types';
import { sound } from '../../utils/sound';

interface AdminSettingsSectionProps {
  language: Language;
  onToggleLanguage: () => void;
  onSignOut: () => void;
}

const DEFAULT_TEMPLATES_AR = [
  'مرحباً بك! شكراً لتواصلك مع شركة اريكسون، كيف يمكننا مساعدتك في مشروعك اليوم؟',
  'تم استلام تفاصيل طلبك بنجاح، وسنقوم بمراجعة المواصفات الفنية وإعلامك فوراً.',
  'يمكننا أيضاً التنسيق المباشر عبر تطبيق واتساب على الرقم: +970594399472 لمناقشة أسرع.',
  'الأنظمة لدينا مبنية بأعلى معايير السرعة والأمان مع دعم العمل دون إنترنت (Offline).',
];

export const AdminSettingsSection: React.FC<AdminSettingsSectionProps> = ({
  language,
  onToggleLanguage,
  onSignOut,
}) => {
  const isAr = language === 'ar';

  // Announcement Bar State
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [announcementTextAR, setAnnouncementTextAR] = useState('');
  const [announcementTextEN, setAnnouncementTextEN] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('');
  const [announcementId, setAnnouncementId] = useState('');
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [announcementSaveSuccess, setAnnouncementSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'announcement'), (snap) => {
        if (snap.exists()) {
          const val = snap.data() as AnnouncementSettings;
          setAnnouncementActive(Boolean(val.active));
          setAnnouncementTextAR(val.textAR || '');
          setAnnouncementTextEN(val.textEN || '');
          setAnnouncementLink(val.linkUrl || '');
          setAnnouncementId(val.id || '');
        }
      });
      return () => unsub();
    } catch (_) {}
  }, []);

  const handleSaveAnnouncement = async () => {
    setIsSavingAnnouncement(true);
    setAnnouncementSaveSuccess(false);
    try {
      const newId = announcementId || `announcement-${Date.now()}`;
      await setDoc(doc(db, 'settings', 'announcement'), {
        id: newId,
        active: announcementActive,
        textAR: announcementTextAR.trim(),
        textEN: announcementTextEN.trim(),
        linkUrl: announcementLink.trim(),
        updatedAt: new Date().toISOString(),
      });
      setAnnouncementId(newId);
      sound.playChime();
      setAnnouncementSaveSuccess(true);
      setTimeout(() => setAnnouncementSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save announcement:', err);
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  const [templates, setTemplates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arixon_admin_templates');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_TEMPLATES_AR;
  });

  const [newTemplate, setNewTemplate] = useState('');

  const handleAdd = () => {
    if (!newTemplate.trim()) return;
    const updated = [newTemplate.trim(), ...templates];
    setTemplates(updated);
    try {
      localStorage.setItem('arixon_admin_templates', JSON.stringify(updated));
    } catch (_) {}
    setNewTemplate('');
  };

  const handleDelete = (index: number) => {
    const updated = templates.filter((_, i) => i !== index);
    setTemplates(updated);
    try {
      localStorage.setItem('arixon_admin_templates', JSON.stringify(updated));
    } catch (_) {}
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
      {/* Admin Credentials & Session Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>{isAr ? 'بيانات الجلسة الموثقة' : 'Verified Admin Session'}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
            Root Admin
          </span>
        </div>

        <p className="text-xs text-neutral-500">
          {isAr
            ? `الحساب المسؤول الأساسي المعتمد: ${ADMIN_EMAIL}`
            : `Authorized primary administrator: ${ADMIN_EMAIL}`}
        </p>

        <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>{isAr ? 'بروتوكول المصادقة:' : 'Auth Protocol:'}</span>
            <span className="font-mono text-neutral-900 dark:text-white">Google OAuth 2.0 (Verified)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{isAr ? 'مهلة الخمول التلقائي:' : 'Inactivity Timeout:'}</span>
            <span className="font-mono text-neutral-900 dark:text-white">30 Minutes</span>
          </div>
        </div>
      </div>

      {/* Language Switcher Setting */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-500" />
            <span>{isAr ? 'لغة واجهة لوحة التحكم' : 'Dashboard Language'}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isAr ? 'التبديل بين العربية (RTL) والإنجليزية (LTR)' : 'Switch between Arabic (RTL) and English (LTR)'}
          </p>
        </div>

        <button
          onClick={onToggleLanguage}
          className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold transition-colors cursor-pointer"
        >
          {language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}
        </button>
      </div>

      {/* Announcement Bar Editor with Live Preview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'شريط الإعلانات العلوي المباشر (Announcement Bar)' : 'Live Announcement Bar'}</span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isAr
                ? 'إعلان يظهر أعلى شريط التنقل لكافة زوار الموقع، مع تذكر الإغلاق وحفظه في Firestore.'
                : 'Slim dismissable alert banner displayed above the navigation for all website visitors.'}
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {announcementActive ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'معطّل' : 'Inactive')}
            </span>
            <input
              type="checkbox"
              checked={announcementActive}
              onChange={(e) => setAnnouncementActive(e.target.checked)}
              className="w-4 h-4 rounded text-black dark:text-white focus:ring-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Text Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              {isAr ? 'النص بالعربية' : 'Arabic Text (textAR)'}
            </label>
            <input
              type="text"
              value={announcementTextAR}
              onChange={(e) => setAnnouncementTextAR(e.target.value)}
              placeholder="مثال: إطلاق النسخة الجديدة من نظام الكاشير ونقاط البيع Arixon POS 2.0"
              className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              {isAr ? 'النص بالإنجليزية' : 'English Text (textEN)'}
            </label>
            <input
              type="text"
              value={announcementTextEN}
              onChange={(e) => setAnnouncementTextEN(e.target.value)}
              placeholder="Example: Just launched: Next-gen offline POS cashier terminal with instant sync."
              className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-white focus:outline-none dir-ltr"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              {isAr ? 'رابط الوجهة (اختياري)' : 'Link URL (Optional linkUrl)'}
            </label>
            <input
              type="url"
              value={announcementLink}
              onChange={(e) => setAnnouncementLink(e.target.value)}
              placeholder="https://arixon.app/#apps"
              className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-white focus:outline-none dir-ltr"
            />
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
            <Eye className="w-3.5 h-3.5" />
            <span>{isAr ? 'معاينة حية لشريط الإعلان (Live Preview):' : 'Live Preview Banner:'}</span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 p-2">
            {announcementActive && (announcementTextAR || announcementTextEN) ? (
              <div className="py-2 px-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate font-medium">
                    {isAr ? announcementTextAR || announcementTextEN : announcementTextEN || announcementTextAR}
                  </span>
                </div>
                {announcementLink && (
                  <span className="text-[10px] font-bold underline shrink-0">
                    {isAr ? 'عرض الآن' : 'Learn More'}
                  </span>
                )}
              </div>
            ) : (
              <div className="py-3 text-center text-xs text-neutral-400">
                {isAr
                  ? 'الشريط معطل أو بدون نص. لن يظهر أي شيء للزوار حالياً.'
                  : 'Banner is inactive or empty. Nothing will be shown to visitors.'}
              </div>
            )}
          </div>
        </div>

        {/* Save Announcement Button */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {announcementSaveSuccess && (
              <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تم تحديث الإعلان في الموقع فورياً!' : 'Live announcement updated!'}</span>
              </span>
            )}
          </div>

          <button
            onClick={handleSaveAnnouncement}
            disabled={isSavingAnnouncement}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingAnnouncement ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ ونشر الإعلان' : 'Save & Publish')}</span>
          </button>
        </div>
      </div>

      {/* Quick Reply Templates Editor */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div>
          <div className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-500" />
            <span>{isAr ? 'إدارة قوالب الردود السريعة' : 'Quick-Reply Templates Manager'}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isAr
              ? 'احفظ رسائل جاهزة للرد بنقرة واحدة على استفسارات العملاء.'
              : 'Save canned responses for one-click customer replies in the messages panel.'}
          </p>
        </div>

        {/* Add new template */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
            placeholder={isAr ? 'اكتب قالباً جديداً...' : 'Enter a new reply template...'}
            className="flex-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-white focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            {isAr ? 'إضافة' : 'Add'}
          </button>
        </div>

        {/* List of templates */}
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {templates.map((tpl, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-3 text-xs"
            >
              <p className="flex-1 text-neutral-800 dark:text-neutral-200 leading-relaxed">{tpl}</p>
              <button
                onClick={() => handleDelete(i)}
                className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-red-600 dark:text-red-400">
            {isAr ? 'إنهاء جلسة الإدارة وتسجيل الخروج' : 'Terminate Admin Session'}
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isAr
              ? 'تسجيل الخروج الآمن والعودة للواجهة العامة للموقع.'
              : 'Safely sign out and return to the public website view.'}
          </p>
        </div>

        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );
};
