import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Users,
  MessageSquare,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Search,
  Send,
  Phone,
  Mail,
  Calendar,
  Globe2,
  CheckCheck,
  Clock,
  Loader2,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Inbox,
  Bell,
  Trash2,
  Plus,
  Filter,
  CheckCircle2,
  DollarSign,
  Tag,
  Sparkles,
  X,
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  getDocs,
  limit,
} from 'firebase/firestore';
import {
  db,
  ADMIN_EMAIL,
  Conversation,
  ChatMessage,
  UserProfile,
  ProjectRequest,
  CompanyUpdate,
} from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { EriksonLogo } from './EriksonLogo';

interface AdminDashboardProps {
  language: Language;
  onClose: () => void;
}

type AdminTab = 'requests' | 'updates' | 'conversations' | 'users';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onClose }) => {
  const { currentUser, isAdmin } = useAuth();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<AdminTab>('requests');

  // --- Requests State ---
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [requestStatusFilter, setRequestStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'done'>('all');
  const [requestSearchQuery, setRequestSearchQuery] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);

  // --- Updates State ---
  const [updatesList, setUpdatesList] = useState<CompanyUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState<boolean>(true);
  const [updateTitleAR, setUpdateTitleAR] = useState<string>('');
  const [updateTitleEN, setUpdateTitleEN] = useState<string>('');
  const [updateBodyAR, setUpdateBodyAR] = useState<string>('');
  const [updateBodyEN, setUpdateBodyEN] = useState<string>('');
  const [publishingUpdate, setPublishingUpdate] = useState<boolean>(false);
  const [updatePublishError, setUpdatePublishError] = useState<string | null>(null);

  // --- Conversations State ---
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [adminReplyText, setAdminReplyText] = useState<string>('');
  const [sendingReply, setSendingReply] = useState<boolean>(false);

  // --- Users State ---
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Project Requests in Real Time
  useEffect(() => {
    if (!isAdmin) return;
    setLoadingRequests(true);
    const q = query(collection(db, 'projectRequests'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ProjectRequest[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            userId: data.userId || '',
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || null,
            appType: data.appType || 'Other',
            budgetRange: data.budgetRange || 'Not sure',
            timeline: data.timeline || 'Flexible',
            description: data.description || '',
            status: data.status || 'new',
            createdAt: data.createdAt,
          });
        });
        setRequests(list);
        setLoadingRequests(false);
      },
      (err) => {
        console.error('Error fetching projectRequests:', err);
        setLoadingRequests(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // 2. Fetch Updates in Real Time
  useEffect(() => {
    if (!isAdmin) return;
    setLoadingUpdates(true);
    const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));

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
        setUpdatesList(list);
        setLoadingUpdates(false);
      },
      (err) => {
        console.error('Error fetching updates:', err);
        setLoadingUpdates(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // 3. Fetch Conversations in Real Time
  useEffect(() => {
    if (!isAdmin) return;

    setLoadingConversations(true);
    const convQuery = query(collection(db, 'conversations'), orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      convQuery,
      (snapshot) => {
        const list: Conversation[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            userId: data.userId || d.id,
            userName: data.userName || 'User',
            userUsername: data.userUsername || '',
            userEmail: data.userEmail || '',
            userPhoto: data.userPhoto || '',
            userPhone: data.userPhone || '',
            userCountry: data.userCountry || '',
            userCountryFlag: data.userCountryFlag || '🌍',
            userAge: data.userAge,
            lastMessage: data.lastMessage || '',
            updatedAt: data.updatedAt,
            unreadByAdmin: data.unreadByAdmin || 0,
            unreadByUser: data.unreadByUser || 0,
          });
        });
        setConversations(list);
        setLoadingConversations(false);

        if (selectedConversation) {
          const current = list.find((c) => c.userId === selectedConversation.userId);
          if (current) setSelectedConversation(current);
        }
      },
      (err) => {
        console.error('Error fetching conversations:', err);
        setLoadingConversations(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // 4. Fetch Users on tab switch
  useEffect(() => {
    if (!isAdmin || activeTab !== 'users') return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const uQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(150));
        const snap = await getDocs(uQuery);
        const users: UserProfile[] = [];
        snap.forEach((d) => {
          users.push(d.data() as UserProfile);
        });
        setUsersList(users);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isAdmin, activeTab]);

  // 5. Fetch Messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) {
      setChatMessages([]);
      return;
    }

    setLoadingChat(true);
    const msgQuery = query(
      collection(db, 'conversations', selectedConversation.userId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      msgQuery,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          msgs.push({
            id: d.id,
            text: data.text || '',
            senderId: data.senderId || '',
            senderRole: data.senderRole || 'user',
            senderName: data.senderName || '',
            createdAt: data.createdAt,
          });
        });
        setChatMessages(msgs);
        setLoadingChat(false);

        // Mark as read by admin
        if (selectedConversation.unreadByAdmin > 0) {
          updateDoc(doc(db, 'conversations', selectedConversation.userId), {
            unreadByAdmin: 0,
          }).catch(console.error);
        }
      },
      (err) => {
        console.error('Error fetching chat messages:', err);
        setLoadingChat(false);
      }
    );

    return () => unsubscribe();
  }, [selectedConversation]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, loadingChat]);

  // --- Handlers ---
  const handleUpdateStatus = async (requestId: string, newStatus: 'new' | 'in_progress' | 'done') => {
    try {
      await updateDoc(doc(db, 'projectRequests', requestId), {
        status: newStatus,
      });
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Error updating request status:', err);
    }
  };

  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitleAR.trim() || !updateTitleEN.trim() || !updateBodyAR.trim() || !updateBodyEN.trim()) {
      setUpdatePublishError(
        isAr ? 'يرجى ملء جميع الحقول باللغتين العربية والإنجليزية.' : 'Please fill in all bilingual fields.'
      );
      return;
    }

    setUpdatePublishError(null);
    setPublishingUpdate(true);
    try {
      await addDoc(collection(db, 'updates'), {
        titleAR: updateTitleAR.trim(),
        titleEN: updateTitleEN.trim(),
        bodyAR: updateBodyAR.trim(),
        bodyEN: updateBodyEN.trim(),
        createdAt: serverTimestamp(),
      });
      setUpdateTitleAR('');
      setUpdateTitleEN('');
      setUpdateBodyAR('');
      setUpdateBodyEN('');
    } catch (err: any) {
      console.error('Error publishing update:', err);
      setUpdatePublishError(err.message || 'Error publishing update');
    } finally {
      setPublishingUpdate(false);
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا التحديث؟' : 'Are you sure you want to delete this update?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'updates', updateId));
    } catch (err) {
      console.error('Error deleting update:', err);
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !adminReplyText.trim() || sendingReply) return;

    const reply = adminReplyText.trim();
    setSendingReply(true);

    try {
      const convRef = doc(db, 'conversations', selectedConversation.userId);
      const messagesRef = collection(db, 'conversations', selectedConversation.userId, 'messages');

      await addDoc(messagesRef, {
        text: reply,
        senderId: currentUser?.uid || 'admin',
        senderRole: 'admin',
        senderName: currentUser?.displayName || 'Omar Shurrab (Admin)',
        createdAt: serverTimestamp(),
      });

      await updateDoc(convRef, {
        lastMessage: reply,
        updatedAt: serverTimestamp(),
        unreadByUser: increment(1),
      });

      setAdminReplyText('');
    } catch (err) {
      console.error('Error sending admin reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const formatTime = (ts: any) => {
    if (!ts) return '';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-white">
        <div className="max-w-md w-full p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">
            {isAr ? 'منطقة مخصصة للإدارة فقط' : 'Administrator Access Only'}
          </h3>
          <p className="text-neutral-400 text-sm mb-6">
            {isAr
              ? `هذه اللوحة متاحة حصرياً للمدير البرمجي (${ADMIN_EMAIL}).`
              : `This console is restricted to the administrator (${ADMIN_EMAIL}).`}
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors"
          >
            {isAr ? 'العودة للموقع' : 'Return to Site'}
          </button>
        </div>
      </div>
    );
  }

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    if (requestStatusFilter !== 'all' && r.status !== requestStatusFilter) return false;
    if (!requestSearchQuery.trim()) return true;
    const q = requestSearchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.appType.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  const totalUnreadChats = conversations.reduce((acc, c) => acc + (c.unreadByAdmin || 0), 0);
  const newRequestsCount = requests.filter((r) => r.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 overflow-hidden animate-in fade-in">
      {/* Top Navbar */}
      <header className="px-4 sm:px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Back"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2">
            <EriksonLogo size="sm" />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Shield className="w-3.5 h-3.5 text-white" />
                <span>ARIXON CONSOLE</span>
              </div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white">
                {isAr ? 'لوحة القيادة الإدارية' : 'Admin Control Center'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>{isAr ? 'الطلبات' : 'Requests'}</span>
            {newRequestsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black text-white dark:bg-white dark:text-black font-bold">
                {newRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('updates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'updates'
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isAr ? 'التحديثات' : 'Updates'}</span>
            {updatesList.length > 0 && (
              <span className="text-[10px] font-mono text-neutral-400">({updatesList.length})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('conversations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'conversations'
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isAr ? 'المحادثات' : 'Chats'}</span>
            {totalUnreadChats > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold">
                {totalUnreadChats}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isAr ? 'المستخدمين' : 'Users'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* TAB 1: PROJECT REQUESTS */}
        {activeTab === 'requests' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                    {isAr ? 'طلبات المشاريع المقدمة' : 'Incoming Project Requests'}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    {isAr
                      ? 'متابعة كافة طلبات الأنظمة والتطبيقات المقدمة عبر معالج الطلبات في الموقع.'
                      : 'Track and manage client project submissions from the request wizard.'}
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={requestSearchQuery}
                      onChange={(e) => setRequestSearchQuery(e.target.value)}
                      placeholder={isAr ? 'بحث بالاسم أو النوع...' : 'Search by name or type...'}
                      className="ps-9 pe-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
                    {(['all', 'new', 'in_progress', 'done'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setRequestStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          requestStatusFilter === st
                            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs'
                            : 'text-neutral-500 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {st === 'all'
                          ? isAr ? 'الكل' : 'All'
                          : st === 'new'
                          ? isAr ? 'جديد' : 'New'
                          : st === 'in_progress'
                          ? isAr ? 'قيد التنفيذ' : 'In Progress'
                          : isAr ? 'مكتمل' : 'Done'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requests List */}
              {loadingRequests ? (
                <div className="p-12 text-center text-neutral-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <span className="text-xs">{isAr ? 'جاري تحميل الطلبات...' : 'Loading requests...'}</span>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-400">
                  <Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">
                    {isAr ? 'لا توجد طلبات مشاريع مطابقة.' : 'No project requests found.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all shadow-xs"
                    >
                      <div>
                        {/* Header & Status */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-mono text-neutral-400">{formatDate(req.createdAt)}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              req.status === 'new'
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-black dark:border-white'
                                : req.status === 'in_progress'
                                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-400'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {req.status === 'new'
                              ? isAr ? 'جديد' : 'New'
                              : req.status === 'in_progress'
                              ? isAr ? 'قيد التنفيذ' : 'In Progress'
                              : isAr ? 'مكتمل' : 'Done'}
                          </span>
                        </div>

                        {/* Requester Name & App Type */}
                        <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                          {req.name}
                        </h4>
                        <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 mt-0.5">
                          {req.appType}
                        </div>

                        {/* Contact details */}
                        <div className="mt-3 space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate font-mono">{req.email}</span>
                          </div>
                          {req.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <span className="font-mono" dir="ltr">{req.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Description Preview */}
                        <p className="mt-3 text-xs text-neutral-700 dark:text-neutral-300 line-clamp-3 bg-white dark:bg-black/40 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
                          {req.description}
                        </p>

                        {/* Budget & Timeline */}
                        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                          <span>{req.budgetRange}</span>
                          <span>·</span>
                          <span>{req.timeline}</span>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateStatus(req.id, e.target.value as any)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
                        >
                          <option value="new">{isAr ? 'جديد' : 'New'}</option>
                          <option value="in_progress">{isAr ? 'قيد التنفيذ' : 'In Progress'}</option>
                          <option value="done">{isAr ? 'مكتمل' : 'Done'}</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                          {req.phone && (
                            <a
                              href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white transition-colors"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                          >
                            {isAr ? 'تفاصيل' : 'Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Request Detail Modal */}
            {selectedRequest && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="relative w-full max-w-xl p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {isAr ? 'تفاصيل طلب المشروع' : 'Project Request Details'}
                    </h4>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                    <div>
                      <span className="text-neutral-500">{isAr ? 'الاسم:' : 'Name:'}</span>{' '}
                      <span className="font-bold">{selectedRequest.name}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">{isAr ? 'البريد:' : 'Email:'}</span>{' '}
                      <span className="font-mono">{selectedRequest.email}</span>
                    </div>
                    {selectedRequest.phone && (
                      <div>
                        <span className="text-neutral-500">{isAr ? 'الهاتف:' : 'Phone:'}</span>{' '}
                        <span className="font-mono" dir="ltr">{selectedRequest.phone}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-neutral-500">{isAr ? 'نوع التطبيق:' : 'App Type:'}</span>{' '}
                      <span className="font-semibold">{selectedRequest.appType}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">{isAr ? 'الميزانية:' : 'Budget:'}</span>{' '}
                      <span>{selectedRequest.budgetRange}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">{isAr ? 'المدة:' : 'Timeline:'}</span>{' '}
                      <span>{selectedRequest.timeline}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-neutral-500 font-semibold block mb-1">
                        {isAr ? 'الوصف الكامل والميزات:' : 'Full Description & Key Features:'}
                      </span>
                      <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-48 overflow-y-auto">
                        {selectedRequest.description}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">{isAr ? 'تغيير الحالة:' : 'Change Status:'}</span>
                      <select
                        value={selectedRequest.status}
                        onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value as any)}
                        className="px-2 py-1 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      >
                        <option value="new">{isAr ? 'جديد' : 'New'}</option>
                        <option value="in_progress">{isAr ? 'قيد التنفيذ' : 'In Progress'}</option>
                        <option value="done">{isAr ? 'مكتمل' : 'Done'}</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-xs cursor-pointer"
                    >
                      {isAr ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPANY UPDATES */}
        {activeTab === 'updates' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {isAr ? 'نشر تحديثات الشركة الرسمية' : 'Publish Official Company Updates'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {isAr
                    ? 'التحديثات المنشورة هنا ستظهر تلقائياً في قسم «آخر التحديثات» على الصفحة الرئيسية للموقع.'
                    : 'Updates published here appear in the "Latest Updates" section on the public site.'}
                </p>
              </div>

              {/* Publish Form */}
              <form
                onSubmit={handlePublishUpdate}
                className="p-5 sm:p-7 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة تحديث جديد (ثنائي اللغة)' : 'New Update (Bilingual)'}</span>
                </div>

                {updatePublishError && (
                  <div className="p-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white">
                    {updatePublishError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                      {isAr ? 'عنوان التحديث بالعربية *' : 'Update Title (Arabic) *'}
                    </label>
                    <input
                      type="text"
                      value={updateTitleAR}
                      onChange={(e) => setUpdateTitleAR(e.target.value)}
                      placeholder="مثال: إطلاق التحديث الجديد لنظام الكاشير..."
                      dir="rtl"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                      {isAr ? 'عنوان التحديث بالإنجليزية *' : 'Update Title (English) *'}
                    </label>
                    <input
                      type="text"
                      value={updateTitleEN}
                      onChange={(e) => setUpdateTitleEN(e.target.value)}
                      placeholder="e.g. Launch of New POS Cashier Engine..."
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                      {isAr ? 'نص التحديث بالعربية *' : 'Update Body (Arabic) *'}
                    </label>
                    <textarea
                      rows={3}
                      value={updateBodyAR}
                      onChange={(e) => setUpdateBodyAR(e.target.value)}
                      placeholder="تفاصيل التحديث والمزايا الجديدة..."
                      dir="rtl"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                      {isAr ? 'نص التحديث بالإنجليزية *' : 'Update Body (English) *'}
                    </label>
                    <textarea
                      rows={3}
                      value={updateBodyEN}
                      onChange={(e) => setUpdateBodyEN(e.target.value)}
                      placeholder="Details of the update and improvements..."
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={publishingUpdate}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {publishingUpdate ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isAr ? 'جاري النشر...' : 'Publishing...'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? 'نشر التحديث الآن' : 'Publish Update Now'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Published Updates List */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  {isAr ? 'التحديثات المنشورة حالياً' : 'Currently Published Updates'}
                </h4>

                {loadingUpdates ? (
                  <div className="p-8 text-center text-neutral-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    <span className="text-xs">{isAr ? 'جاري تحميل التحديثات...' : 'Loading updates...'}</span>
                  </div>
                ) : updatesList.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-400 text-xs">
                    {isAr ? 'لا توجد تحديثات منشورة حتى الآن.' : 'No updates published yet.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {updatesList.map((upd) => (
                      <div
                        key={upd.id}
                        className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(upd.createdAt)}</span>
                          </div>
                          <div className="text-sm font-bold text-neutral-900 dark:text-white">
                            {isAr ? upd.titleAR : upd.titleEN}
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {isAr ? upd.bodyAR : upd.bodyEN}
                          </p>
                          <div className="text-[11px] text-neutral-400 pt-1 font-mono">
                            {isAr ? `(EN: ${upd.titleEN})` : `(AR: ${upd.titleAR})`}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteUpdate(upd.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                          title={isAr ? 'حذف التحديث' : 'Delete Update'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONVERSATIONS (LIVE CHAT SPLIT VIEW) */}
        {activeTab === 'conversations' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Conversations Sidebar */}
            <div className="w-full sm:w-80 md:w-96 border-e border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col shrink-0">
              <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {isAr ? 'المحادثات المباشرة مع الزوار' : 'Live Inquiries & Chats'}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900">
                {loadingConversations ? (
                  <div className="p-8 text-center text-neutral-400 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    <span>{isAr ? 'جاري تحميل المحادثات...' : 'Loading chats...'}</span>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <span>{isAr ? 'لا توجد محادثات حتى الآن.' : 'No conversations yet.'}</span>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isSelected = selectedConversation?.userId === conv.userId;

                    return (
                      <button
                        key={conv.userId}
                        onClick={() => setSelectedConversation(conv)}
                        className={`w-full text-start p-3.5 transition-colors flex items-start gap-3 relative cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 dark:bg-neutral-900'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm text-neutral-800 dark:text-neutral-200">
                            {conv.userName.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="absolute -bottom-1 -end-1 text-xs">
                            {conv.userCountryFlag || '🌍'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-semibold text-xs sm:text-sm truncate text-neutral-900 dark:text-white">
                              {conv.userName}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                              {formatTime(conv.updatedAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
                            {conv.userUsername && (
                              <span className="font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                                {conv.userUsername}
                              </span>
                            )}
                            {conv.userCountry && <span>· {conv.userCountry}</span>}
                          </div>

                          <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                            {conv.lastMessage || (isAr ? 'بدء محادثة...' : 'Started conversation...')}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Pane */}
            <div className="hidden sm:flex flex-1 flex-col bg-white dark:bg-black">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm">
                        {selectedConversation.userName.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-neutral-900 dark:text-white">
                          {selectedConversation.userName}
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">
                          {selectedConversation.userEmail}
                        </div>
                      </div>
                    </div>

                    {selectedConversation.userPhone && (
                      <a
                        href={`https://wa.me/${selectedConversation.userPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-800 rounded-xl"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span dir="ltr">{selectedConversation.userPhone}</span>
                      </a>
                    )}
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-neutral-50/50 dark:bg-black/30">
                    {loadingChat ? (
                      <div className="h-full flex items-center justify-center text-neutral-400 text-xs">
                        <Loader2 className="w-5 h-5 animate-spin mb-2" />
                        <span>{isAr ? 'جاري تحميل الرسائل...' : 'Loading messages...'}</span>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-neutral-400 text-xs">
                        <span>{isAr ? 'لا توجد رسائل سابقة.' : 'No messages found.'}</span>
                      </div>
                    ) : (
                      chatMessages.map((msg) => {
                        const isAdminMsg = msg.senderRole === 'admin';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-neutral-400">
                              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                {isAdminMsg ? (isAr ? 'أنت (الإدارة)' : 'You (Admin)') : msg.senderName}
                              </span>
                              <span>·</span>
                              <span className="font-mono text-[10px]">{formatTime(msg.createdAt)}</span>
                            </div>

                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                                isAdminMsg
                                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black rounded-br-xs'
                                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-xs'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Reply Bar */}
                  <form onSubmit={handleSendAdminReply} className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex gap-2">
                    <input
                      type="text"
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder={isAr ? 'اكتب ردك كمسؤول...' : 'Type response as admin...'}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!adminReplyText.trim() || sendingReply}
                      className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs disabled:opacity-50 cursor-pointer"
                    >
                      {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-400 text-xs">
                  {isAr ? 'اختر محادثة لعرض الرسائل والرد عليها' : 'Select a conversation to reply'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: USERS DATABASE */}
        {activeTab === 'users' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {isAr ? 'سجل المستخدمين المسجلين' : 'Registered Users Database'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {isAr ? `إجمالي الحسابات: ${usersList.length}` : `Total accounts: ${usersList.length}`}
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
                    className="w-full ps-9 pe-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {loadingUsers ? (
                <div className="p-12 text-center text-neutral-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <span className="text-xs">{isAr ? 'جاري تحميل المستخدمين...' : 'Loading users...'}</span>
                </div>
              ) : (
                <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-950">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                      <tr>
                        <th className="py-3 px-4 text-start">{isAr ? 'المستخدم' : 'User'}</th>
                        <th className="py-3 px-4 text-start">{isAr ? 'اسم المستخدم' : 'Username'}</th>
                        <th className="py-3 px-4 text-start">{isAr ? 'الدولة' : 'Country'}</th>
                        <th className="py-3 px-4 text-start">{isAr ? 'الهاتف' : 'Phone'}</th>
                        <th className="py-3 px-4 text-start">{isAr ? 'تاريخ التسجيل' : 'Registered'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                      {usersList
                        .filter((u) => {
                          if (!searchQuery.trim()) return true;
                          const q = searchQuery.toLowerCase();
                          return (
                            (u.name || '').toLowerCase().includes(q) ||
                            (u.email || '').toLowerCase().includes(q) ||
                            (u.username || '').toLowerCase().includes(q)
                          );
                        })
                        .map((u) => (
                          <tr key={u.uid} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                            <td className="py-3 px-4">
                              <div className="font-bold text-neutral-900 dark:text-white">{u.name || 'Anonymous'}</div>
                              <div className="text-[11px] text-neutral-500 font-mono">{u.email}</div>
                            </td>
                            <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300">
                              {u.username || '—'}
                            </td>
                            <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                              {u.countryFlag} {u.country || '—'}
                            </td>
                            <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300" dir="ltr">
                              {u.fullPhone || u.phone || '—'}
                            </td>
                            <td className="py-3 px-4 font-mono text-neutral-400">
                              {formatDate(u.createdAt)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
