import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  FileSpreadsheet,
  X,
  Save,
  Loader2,
  Clock,
  Globe2,
  Calendar,
  Lock,
  Mail,
  User,
  Phone,
} from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, UserProfile, Conversation, ProjectRequest } from '../../firebase/config';
import { Language } from '../../types';

interface AdminUsersSectionProps {
  language: Language;
  users: UserProfile[];
  conversations: Conversation[];
  requests: ProjectRequest[];
  onOpenConversation: (userId: string) => void;
  onOpenRequest: (request: ProjectRequest) => void;
}

export const AdminUsersSection: React.FC<AdminUsersSectionProps> = ({
  language,
  users,
  conversations,
  requests,
  onOpenConversation,
  onOpenRequest,
}) => {
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterBlocked, setFilterBlocked] = useState<'all' | 'active' | 'blocked'>('all');
  const [sortBy, setSortBy] = useState<'created_desc' | 'created_asc' | 'name' | 'last_login'>('created_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Selected user for Detail Drawer
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [togglingBlock, setTogglingBlock] = useState(false);

  const toMillis = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.toMillis) return val.toMillis();
    if (val.seconds) return val.seconds * 1000;
    const d = new Date(val);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const isUserOnline = (user: UserProfile): boolean => {
    const ms = toMillis(user.lastSeen);
    return Date.now() - ms <= 2 * 60 * 1000;
  };

  // Distinct countries and providers for filter dropdowns
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.country) set.add(u.country);
    });
    return Array.from(set).sort();
  }, [users]);

  const availableProviders = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.provider) set.add(u.provider);
    });
    return Array.from(set).sort();
  }, [users]);

  // Filter & Sort
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = u.name?.toLowerCase().includes(q);
        const matchesEmail = u.email?.toLowerCase().includes(q);
        const matchesCountry = u.country?.toLowerCase().includes(q);
        const matchesUsername = u.username?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCountry && !matchesUsername) return false;
      }

      if (filterCountry !== 'all' && u.country !== filterCountry) return false;
      if (filterProvider !== 'all' && u.provider !== filterProvider) return false;

      if (filterBlocked === 'active' && u.blocked) return false;
      if (filterBlocked === 'blocked' && !u.blocked) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'created_desc') return toMillis(b.createdAt) - toMillis(a.createdAt);
      if (sortBy === 'created_asc') return toMillis(a.createdAt) - toMillis(b.createdAt);
      if (sortBy === 'last_login') return toMillis(b.lastLogin) - toMillis(a.lastLogin);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });
  }, [users, searchQuery, filterCountry, filterProvider, filterBlocked, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const handleSelectUser = (u: UserProfile) => {
    setSelectedUser(u);
    setAdminNoteInput(u.adminNote || '');
  };

  const handleSaveAdminNote = async () => {
    if (!selectedUser) return;
    setSavingNote(true);
    try {
      const userRef = doc(db, 'users', selectedUser.uid);
      await updateDoc(userRef, { adminNote: adminNoteInput.trim() });
      setSelectedUser((prev) => (prev ? { ...prev, adminNote: adminNoteInput.trim() } : null));
    } catch (err) {
      console.error('Error saving admin note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleToggleBlock = async () => {
    if (!selectedUser) return;
    const newStatus = !selectedUser.blocked;
    setTogglingBlock(true);
    try {
      const userRef = doc(db, 'users', selectedUser.uid);
      await updateDoc(userRef, { blocked: newStatus });
      setSelectedUser((prev) => (prev ? { ...prev, blocked: newStatus } : null));
    } catch (err) {
      console.error('Error toggling block status:', err);
    } finally {
      setTogglingBlock(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['UID', 'Name', 'Email', 'Country', 'Provider', 'Language', 'Timezone', 'Created', 'Last Login', 'Blocked', 'Admin Note'];
    const rows = filteredUsers.map((u) => [
      `"${u.uid}"`,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${(u.country || '').replace(/"/g, '""')}"`,
      `"${(u.provider || '').replace(/"/g, '""')}"`,
      `"${(u.language || '').replace(/"/g, '""')}"`,
      `"${(u.timezone || '').replace(/"/g, '""')}"`,
      `"${new Date(toMillis(u.createdAt)).toISOString()}"`,
      `"${new Date(toMillis(u.lastLogin)).toISOString()}"`,
      `"${u.blocked ? 'Yes' : 'No'}"`,
      `"${(u.adminNote || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arixon-users-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find user's conversation and requests for drawer
  const userConversation = selectedUser ? conversations.find((c) => c.userId === selectedUser.uid) : null;
  const userRequests = selectedUser ? requests.filter((r) => r.userId === selectedUser.uid) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search, Filter & Action Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={isAr ? 'البحث بالاسم، البريد، الدولة أو اسم المستخدم...' : 'Search by name, email, country...'}
              className="w-full ps-10 pe-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>

          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تصدير كـ CSV' : 'Export CSV'}</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          {/* Country filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">{isAr ? 'الدولة:' : 'Country:'}</span>
            <select
              value={filterCountry}
              onChange={(e) => {
                setFilterCountry(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs cursor-pointer focus:outline-none"
            >
              <option value="all">{isAr ? 'الكل' : 'All'}</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Provider filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">{isAr ? 'المزوّد:' : 'Provider:'}</span>
            <select
              value={filterProvider}
              onChange={(e) => {
                setFilterProvider(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs cursor-pointer focus:outline-none"
            >
              <option value="all">{isAr ? 'الكل' : 'All'}</option>
              {availableProviders.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Blocked filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">{isAr ? 'الحالة:' : 'Status:'}</span>
            <select
              value={filterBlocked}
              onChange={(e: any) => {
                setFilterBlocked(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs cursor-pointer focus:outline-none"
            >
              <option value="all">{isAr ? 'جميع الحسابات' : 'All Accounts'}</option>
              <option value="active">{isAr ? 'النشطة فقط' : 'Active Only'}</option>
              <option value="blocked">{isAr ? 'المحظورة فقط' : 'Blocked Only'}</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ms-auto">
            <span className="text-neutral-400">{isAr ? 'ترتيب:' : 'Sort:'}</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs cursor-pointer focus:outline-none"
            >
              <option value="created_desc">{isAr ? 'الأحدث تسجيلاً' : 'Newest First'}</option>
              <option value="created_asc">{isAr ? 'الأقدم تسجيلاً' : 'Oldest First'}</option>
              <option value="last_login">{isAr ? 'آخر تسجيل دخول' : 'Last Login'}</option>
              <option value="name">{isAr ? 'الاسم أبجدياً' : 'Name (A-Z)'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-neutral-700 dark:text-neutral-300">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 text-start">{isAr ? 'المستخدم' : 'User'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'البلد' : 'Country'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'المزوّد' : 'Provider'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'المنطقة واللغة' : 'Timezone & Lang'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'تاريخ التسجيل' : 'Registered'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'آخر ظهور' : 'Last Seen'}</th>
                <th className="py-3 px-4 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                    {isAr ? 'لا يوجد مستخدمون يطابقون شروط البحث' : 'No users match criteria'}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => {
                  const online = isUserOnline(u);
                  return (
                    <tr
                      key={u.uid}
                      onClick={() => handleSelectUser(u)}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    >
                      {/* User Info & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center font-bold text-xs">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{(u.name || 'U').charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${
                                online ? 'bg-emerald-500' : 'bg-neutral-400'
                              }`}
                              title={online ? (isAr ? 'متصل الآن' : 'Online now') : (isAr ? 'غير متصل' : 'Offline')}
                            />
                          </div>

                          <div className="max-w-[180px]">
                            <div className="font-bold text-neutral-900 dark:text-white truncate flex items-center gap-1.5">
                              <span>{u.name || 'Anonymous User'}</span>
                              {u.blocked && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-500/10 text-red-500 border border-red-500/20">
                                  {isAr ? 'محظور' : 'Blocked'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate font-mono">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Country */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <span>{u.countryFlag || '🌍'}</span>
                          <span>{u.country || (isAr ? 'غير محدد' : 'Unknown')}</span>
                        </span>
                      </td>

                      {/* Provider */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                          {u.provider || 'password'}
                        </span>
                      </td>

                      {/* Timezone & Language */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-neutral-500">
                        <div>{u.timezone || 'UTC'}</div>
                        <div className="text-[10px] text-neutral-400">{u.language || 'en'}</div>
                      </td>

                      {/* Registered */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-neutral-500 font-mono text-[11px]">
                        {toMillis(u.createdAt) ? new Date(toMillis(u.createdAt)).toLocaleDateString() : '—'}
                      </td>

                      {/* Last Seen / Login */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        {online ? (
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{isAr ? 'الآن' : 'Now'}</span>
                          </span>
                        ) : toMillis(u.lastSeen) ? (
                          <span className="text-neutral-400">
                            {new Date(toMillis(u.lastSeen)).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectUser(u)}
                          className="px-3 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {isAr ? 'عرض التفاصيل' : 'Details'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <div>
            {isAr
              ? `عرض ${paginatedUsers.length} من أصل ${filteredUsers.length} مستخدم`
              : `Showing ${paginatedUsers.length} of ${filteredUsers.length} accounts`}
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

      {/* DETAIL DRAWER / MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg h-full bg-white dark:bg-neutral-900 border-s border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neutral-500" />
                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                  {isAr ? 'تفاصيل سجل المستخدم' : 'Account Intelligence Profile'}
                </span>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="w-14 h-14 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center font-bold text-lg">
                {selectedUser.photoURL ? (
                  <img src={selectedUser.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{(selectedUser.name || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base text-neutral-900 dark:text-white truncate">
                  {selectedUser.name || 'Anonymous User'}
                </div>
                <div className="text-xs text-neutral-500 font-mono truncate">
                  {selectedUser.email}
                </div>
                {selectedUser.username && (
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {selectedUser.username}
                  </div>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-neutral-400 text-[10px] uppercase font-mono">{isAr ? 'الدولة' : 'Country'}</div>
                <div className="font-bold mt-0.5 flex items-center gap-1">
                  <span>{selectedUser.countryFlag || '🌍'}</span>
                  <span>{selectedUser.country || 'Unknown'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-neutral-400 text-[10px] uppercase font-mono">{isAr ? 'المزوّد' : 'Provider'}</div>
                <div className="font-bold mt-0.5 font-mono">{selectedUser.provider || 'password'}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-neutral-400 text-[10px] uppercase font-mono">{isAr ? 'المنطقة الزمنية' : 'Timezone'}</div>
                <div className="font-bold mt-0.5 font-mono truncate">{selectedUser.timezone || 'UTC'}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-neutral-400 text-[10px] uppercase font-mono">{isAr ? 'اللغة' : 'Language'}</div>
                <div className="font-bold mt-0.5 font-mono">{selectedUser.language || 'en'}</div>
              </div>

              {selectedUser.phone && (
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 col-span-2">
                  <div className="text-neutral-400 text-[10px] uppercase font-mono">{isAr ? 'الهاتف' : 'Phone'}</div>
                  <div className="font-bold mt-0.5 font-mono flex items-center gap-1.5" dir="ltr">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{selectedUser.fullPhone || selectedUser.phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions (Conversation & Requests) */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                {isAr ? 'الأنشطة والارتباطات' : 'Activity & Links'}
              </div>

              <button
                onClick={() => {
                  onOpenConversation(selectedUser.uid);
                  setSelectedUser(null);
                }}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex items-center justify-between text-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-neutral-500" />
                  <span className="font-semibold">{isAr ? 'فتح المحادثة المباشرة' : 'Open Direct Conversation'}</span>
                </div>
                {userConversation?.unreadByAdmin ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                    {userConversation.unreadByAdmin} {isAr ? 'غير مقروءة' : 'unread'}
                  </span>
                ) : (
                  <span className="text-neutral-400 text-[11px]">{userConversation ? (isAr ? 'موجودة' : 'Active') : (isAr ? 'لا توجد رسائل' : 'No messages')}</span>
                )}
              </button>

              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-neutral-500" />
                    <span>{isAr ? 'طلبات المشاريع المرتبطة' : 'Linked Project Requests'}</span>
                  </span>
                  <span className="font-mono text-neutral-400 font-bold">{userRequests.length}</span>
                </div>
                {userRequests.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    {userRequests.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          onOpenRequest(r);
                          setSelectedUser(null);
                        }}
                        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer text-xs flex items-center justify-between"
                      >
                        <span className="font-medium truncate max-w-[200px]">{r.appType}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-black uppercase">
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-neutral-400">{isAr ? 'لم يرسل أي طلب مشروع حتى الآن' : 'No project requests submitted'}</div>
                )}
              </div>
            </div>

            {/* Admin Note */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-900 dark:text-white">
                {isAr ? 'ملاحظة سرية للمسؤول (Admin Note)' : 'Admin Note (Internal Only)'}
              </label>
              <textarea
                rows={3}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder={isAr ? 'أضف ملاحظات خاصة بهذا العميل أو المشروع...' : 'Internal notes visible only to administrators...'}
                className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
              <button
                onClick={handleSaveAdminNote}
                disabled={savingNote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {savingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isAr ? 'حفظ الملاحظة' : 'Save Note'}</span>
              </button>
            </div>

            {/* Block / Unblock Toggle */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isAr ? 'حالة الحظر (Block Status)' : 'Account Restriction'}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {selectedUser.blocked
                    ? (isAr ? 'المستخدم محظور من إرسال الرسائل والطلبات' : 'Restricted from sending messages/requests')
                    : (isAr ? 'الحساب نشط وغير مقيد' : 'Account active and allowed')}
                </div>
              </div>

              <button
                onClick={handleToggleBlock}
                disabled={togglingBlock}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedUser.blocked
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {togglingBlock ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : selectedUser.blocked ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5" />
                )}
                <span>
                  {selectedUser.blocked
                    ? (isAr ? 'إلغاء الحظر' : 'Unblock User')
                    : (isAr ? 'حظر المستخدم' : 'Block User')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
