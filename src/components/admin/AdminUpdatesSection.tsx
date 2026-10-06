import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Save,
  Loader2,
  Calendar,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, CompanyUpdate } from '../../firebase/config';
import { Language } from '../../types';

interface AdminUpdatesSectionProps {
  language: Language;
  updates: CompanyUpdate[];
}

export const AdminUpdatesSection: React.FC<AdminUpdatesSectionProps> = ({
  language,
  updates,
}) => {
  const isAr = language === 'ar';

  const [isCreating, setIsCreating] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<CompanyUpdate | null>(null);

  const [titleAR, setTitleAR] = useState('');
  const [titleEN, setTitleEN] = useState('');
  const [bodyAR, setBodyAR] = useState('');
  const [bodyEN, setBodyEN] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitleAR('');
    setTitleEN('');
    setBodyAR('');
    setBodyEN('');
    setEditingUpdate(null);
    setIsCreating(false);
    setError(null);
  };

  const handleStartEdit = (u: CompanyUpdate) => {
    setEditingUpdate(u);
    setTitleAR(u.titleAR || '');
    setTitleEN(u.titleEN || '');
    setBodyAR(u.bodyAR || '');
    setBodyEN(u.bodyEN || '');
    setIsCreating(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAR.trim() || !titleEN.trim() || !bodyAR.trim() || !bodyEN.trim()) {
      setError(
        isAr
          ? 'يرجى ملء جميع الحقول باللغتين العربية والإنجليزية.'
          : 'Please complete all bilingual title and body fields.'
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingUpdate) {
        // Update existing
        const docRef = doc(db, 'updates', editingUpdate.id);
        await updateDoc(docRef, {
          titleAR: titleAR.trim(),
          titleEN: titleEN.trim(),
          bodyAR: bodyAR.trim(),
          bodyEN: bodyEN.trim(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new
        await addDoc(collection(db, 'updates'), {
          titleAR: titleAR.trim(),
          titleEN: titleEN.trim(),
          bodyAR: bodyAR.trim(),
          bodyEN: bodyEN.trim(),
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (err: any) {
      console.error('Error saving update:', err);
      setError(err.message || (isAr ? 'فشل حفظ التحديث' : 'Failed to save update'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        isAr ? 'هل أنت متأكد من حذف هذا التحديث نهائياً؟' : 'Are you sure you want to delete this update?'
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'updates', id));
    } catch (err) {
      console.error('Failed to delete update:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <span>{isAr ? 'التحديثات والإعلانات الرسمية' : 'Company Releases & Announcements'}</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'تظهر هذه التحديثات مباشرة في قسم "آخر التحديثات" على الموقع الرئيسي.'
              : 'Published updates immediately appear in the public "Latest Updates" section.'}
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'نشر تحديث جديد' : 'New Update'}</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form Drawer */}
      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-lg space-y-4 animate-in zoom-in-98"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              {editingUpdate
                ? (isAr ? 'تعديل التحديث' : 'Edit Update')
                : (isAr ? 'إنشاء تحديث جديد' : 'Compose New Update')}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Arabic Title */}
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                {isAr ? 'عنوان التحديث (بالعربية)' : 'Title (Arabic)'} *
              </label>
              <input
                type="text"
                required
                value={titleAR}
                onChange={(e) => setTitleAR(e.target.value)}
                placeholder="إطلاق الإصدار 2.0 من نظام كاشير اريكسون..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none"
                dir="rtl"
              />
            </div>

            {/* English Title */}
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                {isAr ? 'عنوان التحديث (بالإنجليزية)' : 'Title (English)'} *
              </label>
              <input
                type="text"
                required
                value={titleEN}
                onChange={(e) => setTitleEN(e.target.value)}
                placeholder="Release v2.0 of Arixon POS Platform..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none"
                dir="ltr"
              />
            </div>

            {/* Arabic Body */}
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                {isAr ? 'نص التحديث وتفاصيل الإعلان (بالعربية)' : 'Body (Arabic)'} *
              </label>
              <textarea
                rows={4}
                required
                value={bodyAR}
                onChange={(e) => setBodyAR(e.target.value)}
                placeholder="تفاصيل التحديث، الميزات الجديدة والتحسينات المضافة..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none"
                dir="rtl"
              />
            </div>

            {/* English Body */}
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                {isAr ? 'نص التحديث وتفاصيل الإعلان (بالإنجليزية)' : 'Body (English)'} *
              </label>
              <textarea
                rows={4}
                required
                value={bodyEN}
                onChange={(e) => setBodyEN(e.target.value)}
                placeholder="Release notes, new features and architecture upgrades..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-md"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{editingUpdate ? (isAr ? 'حفظ التعديلات' : 'Update') : (isAr ? 'نشر التحديث' : 'Publish')}</span>
            </button>
          </div>
        </form>
      )}

      {/* Updates List */}
      <div className="grid grid-cols-1 gap-4">
        {updates.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
              {isAr ? 'لا توجد تحديثات منشورة حالياً' : 'No updates published yet'}
            </p>
            <p className="mt-1">
              {isAr
                ? 'قسم "آخر التحديثات" على الصفحة الرئيسية مخفي تلقائياً طالما لا توجد تحديثات.'
                : 'The public "Latest Updates" section is hidden on the site until an update is published.'}
            </p>
          </div>
        ) : (
          updates.map((u) => (
            <div
              key={u.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Arabic side */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/80" dir="rtl">
                    <div className="text-[10px] font-mono text-neutral-400 mb-1">العربية (AR)</div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {u.titleAR}
                    </h4>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                      {u.bodyAR}
                    </p>
                  </div>

                  {/* English side */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/80" dir="ltr">
                    <div className="text-[10px] font-mono text-neutral-400 mb-1">English (EN)</div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {u.titleEN}
                    </h4>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                      {u.bodyEN}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                <button
                  onClick={() => handleStartEdit(u)}
                  className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  disabled={deletingId === u.id}
                  className="p-2 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-500 transition-colors cursor-pointer"
                  title="Delete"
                >
                  {deletingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
