import React, { useState } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Mail,
  Smartphone,
  Save,
  Loader2,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, SupportTicket } from '../../firebase/config';
import { Language } from '../../types';
import { sound } from '../../utils/sound';

interface AdminTicketsSectionProps {
  language: Language;
  tickets: SupportTicket[];
}

export const AdminTicketsSection: React.FC<AdminTicketsSectionProps> = ({
  language,
  tickets,
}) => {
  const isAr = language === 'ar';
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Detail Modal edits state
  const [editStatus, setEditStatus] = useState<'open' | 'in_progress' | 'resolved'>('open');
  const [editAdminNote, setEditAdminNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenDetail = (ticket: SupportTicket) => {
    sound.playClick();
    setSelectedTicket(ticket);
    setEditStatus(ticket.status || 'open');
    setEditAdminNote(ticket.adminNote || '');
    setSaveSuccess(false);
  };

  const handleSaveDetail = async () => {
    if (!selectedTicket) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const docRef = doc(db, 'supportTickets', selectedTicket.id);
      await updateDoc(docRef, {
        status: editStatus,
        adminNote: editAdminNote.trim(),
      });
      sound.playChime();
      setSaveSuccess(true);
      // Update local selected ticket
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: editStatus,
              adminNote: editAdminNote.trim(),
            }
          : null
      );
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Error updating ticket:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // CSV Export feature
  const handleExportCSV = () => {
    sound.playClick();
    const headers = ['ID', 'User ID', 'Name', 'Email', 'App ID', 'Issue Type', 'Priority', 'Status', 'Description', 'Admin Note', 'Date'];
    
    const rows = filteredTickets.map((t) => {
      const dateStr = t.createdAt?.toDate ? t.createdAt.toDate().toISOString() : '';
      return [
        t.id,
        t.userId,
        `"${(t.name || '').replace(/"/g, '""')}"`,
        t.email,
        t.appId,
        t.issueType,
        t.priority,
        t.status,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        `"${(t.adminNote || '').replace(/"/g, '""')}"`,
        dateStr,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `arixon-support-tickets-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const q = searchQuery.trim().toLowerCase();
  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (!q) return true;
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.appId && t.appId.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.id && t.id.toLowerCase().includes(q))
    );
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgent':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <LifeBuoy className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
            <span>{isAr ? 'تذاكر الدعم الفني للعملاء' : 'Support Tickets'}</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? `إجمالي التذاكر المسجلة: ${tickets.length} تذكرة`
              : `Total recorded support tickets: ${tickets.length}`}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isAr ? 'تصدير كملف CSV' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs overflow-x-auto">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map((st) => {
            const count = st === 'all' ? tickets.length : tickets.filter((t) => t.status === st).length;
            const label =
              st === 'all'
                ? isAr ? 'الكل' : 'All'
                : st === 'open'
                ? isAr ? 'قيد الانتظار' : 'Open'
                : st === 'in_progress'
                ? isAr ? 'قيد المعالجة' : 'In Progress'
                : isAr ? 'تم الحل' : 'Resolved';

            return (
              <button
                key={st}
                onClick={() => {
                  sound.playClick();
                  setFilterStatus(st);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>{label}</span>
                <span className="ms-1.5 text-[10px] font-mono opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم، الإيميل، التطبيق...' : 'Search by name, email, app...'}
            className="w-full ps-9 pe-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-500 text-xs">
          <LifeBuoy className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>{isAr ? 'لا توجد تذاكر تطابق خيارات البحث الحالية.' : 'No tickets match the selected filters.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => handleOpenDetail(t)}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase ${getStatusBadge(t.status)}`}>
                    {t.status === 'resolved' ? (isAr ? 'تم الحل' : 'Resolved') : t.status === 'in_progress' ? (isAr ? 'قيد المعالجة' : 'In Progress') : (isAr ? 'مفتوحة' : 'Open')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border uppercase ${getPriorityBadge(t.priority)}`}>
                    {t.priority}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">#{t.id.slice(0, 7)}</span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">{t.appId}</span>
                </div>

                <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                  <span>{t.name} ({t.email})</span>
                  <span>·</span>
                  <span>{t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString() : ''}</span>
                  {t.adminNote && (
                    <>
                      <span>·</span>
                      <span className="text-amber-500 font-sans">{isAr ? 'يوجد ملاحظة إدارية' : 'Has admin note'}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <button className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {isAr ? 'عرض التفاصيل' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Details & Management Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 space-y-6 text-neutral-900 dark:text-white max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border uppercase ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                  <span className="font-mono text-xs text-neutral-400">ID: {selectedTicket.id}</span>
                </div>
                <h3 className="text-lg font-extrabold mt-1">
                  {isAr ? `تذكرة لتطبيق: ${selectedTicket.appId}` : `Ticket for: ${selectedTicket.appId}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-400 block mb-0.5">{isAr ? 'العميل:' : 'Client:'}</span>
                <span className="font-bold">{selectedTicket.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-0.5">{isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                <span className="font-mono">{selectedTicket.email}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-0.5">{isAr ? 'نوع البلاغ:' : 'Issue Type:'}</span>
                <span className="font-bold capitalize">{selectedTicket.issueType}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-0.5">{isAr ? 'الأولوية:' : 'Priority:'}</span>
                <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold border text-[10px] uppercase ${getPriorityBadge(selectedTicket.priority)}`}>
                  {selectedTicket.priority}
                </span>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {isAr ? 'نص البلاغ / وصف المشكلة' : 'Issue Description'}
              </span>
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {selectedTicket.description}
              </div>
            </div>

            {/* Status Change & Admin Note Editor */}
            <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5">
                    {isAr ? 'تعديل حالة التذكرة' : 'Change Ticket Status'}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-bold"
                  >
                    <option value="open">{isAr ? 'مفتوحة (Open)' : 'Open'}</option>
                    <option value="in_progress">{isAr ? 'قيد المعالجة (In Progress)' : 'In Progress'}</option>
                    <option value="resolved">{isAr ? 'تم الحل (Resolved)' : 'Resolved'}</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <a
                    href={`mailto:${selectedTicket.email}?subject=${encodeURIComponent(`Arixon Support Update - Ticket #${selectedTicket.id.slice(0, 6)}`)}`}
                    className="w-full inline-flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{isAr ? 'مراسلة العميل عبر البريد' : 'Email Client Directly'}</span>
                  </a>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5">
                  {isAr ? 'ملاحظة الإدارة الداخلية (Admin Note)' : 'Internal Admin Note'}
                </label>
                <textarea
                  rows={3}
                  value={editAdminNote}
                  onChange={(e) => setEditAdminNote(e.target.value)}
                  placeholder={isAr ? 'أدخل ملاحظة داخلية خاصة بفريق العمل...' : 'Add internal resolution note...'}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs leading-relaxed focus:outline-none"
                />
              </div>

              {/* Save & Feedback */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  {saveSuccess && (
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAr ? 'تم حفظ التعديلات بنجاح!' : 'Changes saved successfully!'}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>

                  <button
                    onClick={handleSaveDetail}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isAr ? 'حفظ التحديث' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
