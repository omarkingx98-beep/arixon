import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Loader2,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, ProjectRequest, UserProfile } from '../../firebase/config';
import { Language } from '../../types';

interface AdminRequestsSectionProps {
  language: Language;
  requests: ProjectRequest[];
  users: UserProfile[];
  initialSelectedRequest?: ProjectRequest | null;
}

export const AdminRequestsSection: React.FC<AdminRequestsSectionProps> = ({
  language,
  requests,
  users,
  initialSelectedRequest = null,
}) => {
  const isAr = language === 'ar';

  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'done'>('all');
  const [appTypeFilter, setAppTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(initialSelectedRequest);

  const [statusInput, setStatusInput] = useState<'new' | 'in_progress' | 'done'>('new');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [updating, setUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const toMillis = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.toMillis) return val.toMillis();
    if (val.seconds) return val.seconds * 1000;
    const d = new Date(val);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const handleSelect = (r: ProjectRequest) => {
    setSelectedRequest(r);
    setStatusInput(r.status || 'new');
    setAdminNoteInput(r.adminNote || '');
  };

  const availableAppTypes = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (r.appType) set.add(r.appType);
    });
    return Array.from(set);
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (appTypeFilter !== 'all' && r.appType !== appTypeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = r.name?.toLowerCase().includes(q);
        const matchesEmail = r.email?.toLowerCase().includes(q);
        const matchesPhone = r.phone?.toLowerCase().includes(q);
        const matchesDesc = r.description?.toLowerCase().includes(q);
        const matchesAppType = r.appType?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesDesc && !matchesAppType) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  }, [requests, statusFilter, appTypeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage]);

  const handleSaveChanges = async () => {
    if (!selectedRequest) return;
    setUpdating(true);
    try {
      const docRef = doc(db, 'projectRequests', selectedRequest.id);
      await updateDoc(docRef, {
        status: statusInput,
        adminNote: adminNoteInput.trim(),
        updatedAt: serverTimestamp(),
      });
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: statusInput,
              adminNote: adminNoteInput.trim(),
            }
          : null
      );
    } catch (err) {
      console.error('Error updating request:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'App Type', 'Budget', 'Timeline', 'Status', 'Description', 'Admin Note'];
    const rows = filteredRequests.map((r) => [
      `"${r.id}"`,
      `"${new Date(toMillis(r.createdAt)).toISOString()}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.appType || '').replace(/"/g, '""')}"`,
      `"${(r.budgetRange || '').replace(/"/g, '""')}"`,
      `"${(r.timeline || '').replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${(r.description || '').replace(/"/g, '""')}"`,
      `"${(r.adminNote || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arixon-requests-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp clean url generator
  const getWhatsAppUrl = (phoneStr: string, name: string) => {
    const cleanDigits = phoneStr.replace(/[^0-9]/g, '');
    const text = isAr
      ? `مرحباً ${name}، نتواصل معك بخصوص طلبك في شركة اريكسون.`
      : `Hello ${name}, reaching out regarding your project request with Arixon.`;
    return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search & Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={isAr ? 'البحث بالاسم، البريد، الهاتف أو تفاصيل المشروع...' : 'Search requests by client, email, phone...'}
              className="w-full ps-10 pe-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تصدير كـ CSV' : 'Export CSV'}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            {(['all', 'new', 'in_progress', 'done'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white dark:bg-neutral-900 text-black dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {st === 'all' && (isAr ? 'الكل' : 'All')}
                {st === 'new' && (isAr ? 'جديد' : 'New')}
                {st === 'in_progress' && (isAr ? 'قيد التنفيذ' : 'In Progress')}
                {st === 'done' && (isAr ? 'مكتمل' : 'Done')}
              </button>
            ))}
          </div>

          {/* App Type filter */}
          {availableAppTypes.length > 0 && (
            <div className="flex items-center gap-1.5 ms-auto">
              <span className="text-neutral-400">{isAr ? 'نوع التطبيق:' : 'App Type:'}</span>
              <select
                value={appTypeFilter}
                onChange={(e) => {
                  setAppTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs cursor-pointer focus:outline-none"
              >
                <option value="all">{isAr ? 'جميع الأنواع' : 'All Types'}</option>
                {availableAppTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-neutral-700 dark:text-neutral-300">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 text-start">{isAr ? 'العميل' : 'Client'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'نوع التطبيق' : 'App Type'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'الميزانية والمدة' : 'Budget & Timeline'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'تاريخ الطلب' : 'Submitted'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-4 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                    {isAr ? 'لا توجد طلبات تطابق معايير الفرز' : 'No requests found'}
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((r) => {
                  return (
                    <tr
                      key={r.id}
                      onClick={() => handleSelect(r)}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    >
                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900 dark:text-white truncate max-w-[170px]">
                          {r.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono truncate max-w-[170px]">
                          {r.email}
                        </div>
                      </td>

                      {/* App Type */}
                      <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200">
                        {r.appType}
                      </td>

                      {/* Budget & Timeline */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                        <div>{r.budgetRange}</div>
                        <div className="text-[10px] text-neutral-400">{r.timeline}</div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                        {toMillis(r.createdAt) ? new Date(toMillis(r.createdAt)).toLocaleDateString() : '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            r.status === 'new'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : r.status === 'in_progress'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {r.status === 'new' && (isAr ? 'جديد' : 'New')}
                          {r.status === 'in_progress' && (isAr ? 'قيد التنفيذ' : 'In Progress')}
                          {r.status === 'done' && (isAr ? 'مكتمل' : 'Done')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {r.phone && (
                            <a
                              href={getWhatsAppUrl(r.phone, r.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          <a
                            href={`mailto:${r.email}?subject=${encodeURIComponent(
                              isAr ? `بخصوص طلبك: ${r.appType} | اريكسون` : `Regarding your project request: ${r.appType} | Arixon`
                            )}`}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleSelect(r)}
                            className="px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                          >
                            {isAr ? 'تفاصيل' : 'View'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <div>
            {isAr
              ? `عرض ${paginatedRequests.length} من ${filteredRequests.length} طلب`
              : `Showing ${paginatedRequests.length} of ${filteredRequests.length} requests`}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
            <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  ID: {selectedRequest.id}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                  {selectedRequest.appType}
                </h3>
                <div className="text-xs text-neutral-500 mt-1">
                  {isAr ? 'مقدم الطلب:' : 'Client:'} <span className="font-semibold text-neutral-900 dark:text-white">{selectedRequest.name}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${selectedRequest.email}?subject=${encodeURIComponent(
                  isAr ? `بخصوص طلب مشروعك: ${selectedRequest.appType}` : `Regarding your project request: ${selectedRequest.appType}`
                )}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{selectedRequest.email}</span>
              </a>

              {selectedRequest.phone && (
                <a
                  href={getWhatsAppUrl(selectedRequest.phone, selectedRequest.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {selectedRequest.phone}</span>
                </a>
              )}
            </div>

            {/* Project Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80">
                <div className="text-neutral-400 text-[10px] uppercase font-mono">{isAr ? 'الميزانية' : 'Budget'}</div>
                <div className="font-bold mt-0.5">{selectedRequest.budgetRange}</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80">
                <div className="text-neutral-400 text-[10px] uppercase font-mono">{isAr ? 'الجدول الزمني' : 'Timeline'}</div>
                <div className="font-bold mt-0.5">{selectedRequest.timeline}</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 col-span-2 sm:col-span-1">
                <div className="text-neutral-400 text-[10px] uppercase font-mono">{isAr ? 'تاريخ الإرسال' : 'Submitted At'}</div>
                <div className="font-bold mt-0.5 font-mono text-[11px]">
                  {toMillis(selectedRequest.createdAt) ? new Date(toMillis(selectedRequest.createdAt)).toLocaleString() : '—'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80 space-y-1.5 text-xs">
              <div className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                {isAr ? 'وصف المشروع والميزات المطلوبة' : 'Project Description & Features'}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans">
                {selectedRequest.description}
              </div>
            </div>

            {/* Status Change & Admin Note */}
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-900 dark:text-white mb-1.5">
                  {isAr ? 'تعديل حالة الطلب' : 'Update Status'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'in_progress', 'done'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusInput(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        statusInput === st
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                      }`}
                    >
                      {st === 'new' && (isAr ? 'جديد (new)' : 'New')}
                      {st === 'in_progress' && (isAr ? 'قيد التنفيذ' : 'In Progress')}
                      {st === 'done' && (isAr ? 'مكتمل (done)' : 'Done')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-900 dark:text-white mb-1.5">
                  {isAr ? 'ملاحظة سرية للمسؤول' : 'Admin Internal Note'}
                </label>
                <textarea
                  rows={2}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder={isAr ? 'ملاحظات الاتفاق، التكاليف أو أي تفاصيل خاصة...' : 'Contract, pricing, or milestone notes...'}
                  className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  disabled={updating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isAr ? 'حفظ التغييرات' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
