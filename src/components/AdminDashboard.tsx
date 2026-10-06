import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileSpreadsheet,
  Sparkles,
  Settings,
  Bell,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Shield,
  Volume2,
  VolumeX,
  Clock,
  Menu,
  X,
  ExternalLink,
  LifeBuoy,
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  db,
  isVerifiedGoogleAdmin,
  UserProfile,
  Conversation,
  ProjectRequest,
  CompanyUpdate,
  SupportTicket,
} from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { EriksonLogo } from './EriksonLogo';

// Modular Admin Components
import { AdminUnauthorized } from './admin/AdminUnauthorized';
import { AdminInactivityWarning } from './admin/AdminInactivityWarning';
import { AdminOverviewSection } from './admin/AdminOverviewSection';
import { AdminUsersSection } from './admin/AdminUsersSection';
import { AdminMessagesSection } from './admin/AdminMessagesSection';
import { AdminRequestsSection } from './admin/AdminRequestsSection';
import { AdminTicketsSection } from './admin/AdminTicketsSection';
import { AdminUpdatesSection } from './admin/AdminUpdatesSection';
import { AdminNotificationsModal, AdminNotificationItem } from './admin/AdminNotificationsModal';
import { AdminSettingsSection } from './admin/AdminSettingsSection';

interface AdminDashboardProps {
  language: Language;
  onClose: () => void;
}

type AdminTab = 'overview' | 'users' | 'messages' | 'requests' | 'tickets' | 'updates' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onClose }) => {
  const { currentUser, logout, isAdmin, userProfile } = useAuth();
  const isAr = language === 'ar';

  // 1. ACCESS CONTROL CHECK
  const isAuthorized = Boolean(
    isAdmin ||
    (currentUser && isVerifiedGoogleAdmin(currentUser)) ||
    (userProfile?.role === 'admin')
  );

  // If not authorized, return early with zero Firestore listeners attached!
  if (!isAuthorized) {
    return (
      <AdminUnauthorized
        language={language}
        currentUserEmail={currentUser?.email}
        onGoHome={onClose}
        onSignOut={logout}
      />
    );
  }

  // --- STATE FOR AUTHORIZED ADMIN ---
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedUserIdForChat, setSelectedUserIdForChat] = useState<string | null>(null);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<ProjectRequest | null>(null);

  // Firestore Data State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [lastSeenNotificationsAt, setLastSeenNotificationsAt] = useState<any>(null);

  // Inactivity State (30 mins = 1800000 ms, 1 min warning = 60000 ms)
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const lastActivityRef = useRef<number>(Date.now());

  // Sound & Notifications
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('arixon_admin_sound') !== 'false';
    } catch (_) {
      return true;
    }
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- 2. FIRESTORE REAL-TIME LISTENERS (ATTACHED ONLY FOR AUTHORIZED ADMIN) ---
  useEffect(() => {
    // Users Listener
    const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubUsers = onSnapshot(
      qUsers,
      (snap) => {
        const list: UserProfile[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            uid: d.id,
            name: data.name || '',
            username: data.username || '',
            email: data.email || '',
            photoURL: data.photoURL,
            provider: data.provider || 'google.com',
            country: data.country || '',
            countryCode: data.countryCode || '',
            countryFlag: data.countryFlag || '',
            timezone: data.timezone || 'UTC',
            language: data.language || 'en',
            role: data.role || 'user',
            blocked: Boolean(data.blocked),
            adminNote: data.adminNote || '',
            createdAt: data.createdAt,
            lastLogin: data.lastLogin,
            lastSeen: data.lastSeen,
            profileCompleted: Boolean(data.profileCompleted),
            phone: data.phone,
            fullPhone: data.fullPhone,
          });
        });
        setUsers(list);
      },
      (err) => console.warn('Users listener:', err)
    );

    // Conversations Listener
    const qConv = query(collection(db, 'conversations'), orderBy('updatedAt', 'desc'));
    const unsubConv = onSnapshot(
      qConv,
      (snap) => {
        const list: Conversation[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            userId: data.userId || d.id,
            userName: data.userName || '',
            userUsername: data.userUsername || '',
            userEmail: data.userEmail || '',
            userPhoto: data.userPhoto,
            userPhone: data.userPhone,
            userCountry: data.userCountry,
            lastMessage: data.lastMessage || '',
            updatedAt: data.updatedAt,
            unreadByAdmin: data.unreadByAdmin || 0,
            unreadByUser: data.unreadByUser || 0,
          });
        });
        setConversations(list);
      },
      (err) => console.warn('Conversations listener:', err)
    );

    // Project Requests Listener
    const qReq = query(collection(db, 'projectRequests'), orderBy('createdAt', 'desc'));
    const unsubReq = onSnapshot(
      qReq,
      (snap) => {
        const list: ProjectRequest[] = [];
        snap.forEach((d) => {
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
            adminNote: data.adminNote || '',
            createdAt: data.createdAt,
          });
        });
        setRequests(list);
      },
      (err) => console.warn('Requests listener:', err)
    );

    // Updates Listener
    const qUpdates = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
    const unsubUpdates = onSnapshot(
      qUpdates,
      (snap) => {
        const list: CompanyUpdate[] = [];
        snap.forEach((d) => {
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
      },
      (err) => console.warn('Updates listener:', err)
    );

    // Support Tickets Listener
    const qTickets = query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc'));
    const unsubTickets = onSnapshot(
      qTickets,
      (snap) => {
        const list: SupportTicket[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as any) });
        });
        setTickets(list);
      },
      (err) => console.warn('Tickets listener:', err)
    );

    // AdminState Listener (lastSeenNotificationsAt)
    const unsubAdminState = onSnapshot(
      doc(db, 'adminState', 'main'),
      (snap) => {
        if (snap.exists()) {
          setLastSeenNotificationsAt(snap.data()?.lastSeenNotificationsAt);
        }
      },
      (err) => console.warn('AdminState listener:', err)
    );

    return () => {
      unsubUsers();
      unsubConv();
      unsubReq();
      unsubUpdates();
      unsubTickets();
      unsubAdminState();
    };
  }, []);

  // --- 3. INACTIVITY TIMER (30 MINS WITH 1 MIN WARNING) ---
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (showInactivityWarning) {
        setShowInactivityWarning(false);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const thirtyMinutes = 30 * 60 * 1000;
      const twentyNineMinutes = 29 * 60 * 1000;

      if (elapsed >= thirtyMinutes) {
        // Auto sign-out
        clearInterval(interval);
        logout();
        onClose();
      } else if (elapsed >= twentyNineMinutes) {
        const remaining = Math.max(0, Math.ceil((thirtyMinutes - elapsed) / 1000));
        setSecondsRemaining(remaining);
        setShowInactivityWarning(true);
      } else {
        setShowInactivityWarning(false);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [showInactivityWarning, logout, onClose]);

  // --- 4. AUDIO CHIME (SYNTHESIZED WEB AUDIO) ---
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('arixon_admin_sound', String(next));
    } catch (_) {}
    if (next) playChime();
  };

  // --- 5. NOTIFICATIONS FEED & BADGES ---
  const toMillis = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.toMillis) return val.toMillis();
    if (val.seconds) return val.seconds * 1000;
    const d = new Date(val);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const notificationsFeed = useMemo((): AdminNotificationItem[] => {
    const items: AdminNotificationItem[] = [];

    // New Users
    users.slice(0, 10).forEach((u) => {
      items.push({
        id: `user_${u.uid}`,
        type: 'user',
        title: isAr ? `مستخدم جديد: ${u.name || 'Anonymous'}` : `New user: ${u.name || 'Anonymous'}`,
        desc: `${u.email} · ${u.country || 'Unknown'}`,
        timestamp: u.createdAt,
        targetId: u.uid,
      });
    });

    // Unread or recent messages
    conversations.forEach((c) => {
      if ((c.unreadByAdmin || 0) > 0) {
        items.push({
          id: `msg_${c.userId}`,
          type: 'message',
          title: isAr ? `رسالة جديدة من: ${c.userName}` : `New message from: ${c.userName}`,
          desc: c.lastMessage || '...',
          timestamp: c.updatedAt,
          targetId: c.userId,
        });
      }
    });

    // New Requests
    requests.forEach((r) => {
      if (r.status === 'new') {
        items.push({
          id: `req_${r.id}`,
          type: 'request',
          title: isAr ? `طلب مشروع جديد: ${r.appType}` : `New request: ${r.appType}`,
          desc: `${r.name} · ${r.budgetRange}`,
          timestamp: r.createdAt,
          targetId: r.id,
        });
      }
    });

    // Support Tickets (Open or In Progress)
    tickets.forEach((t) => {
      if (t.status === 'open') {
        items.push({
          id: `ticket_${t.id}`,
          type: 'ticket',
          title: isAr ? `تذكرة دعم فني جديدة: ${t.appId}` : `New support ticket: ${t.appId}`,
          desc: `${t.name}: ${t.description.slice(0, 70)}...`,
          timestamp: t.createdAt,
          targetId: t.id,
        });
      }
    });

    return items.sort((a, b) => toMillis(b.timestamp) - toMillis(a.timestamp));
  }, [users, conversations, requests, tickets, isAr]);

  const lastSeenMs = toMillis(lastSeenNotificationsAt);
  const unreadNotificationsCount = useMemo(() => {
    if (!lastSeenMs) return notificationsFeed.length;
    return notificationsFeed.filter((n) => toMillis(n.timestamp) > lastSeenMs).length;
  }, [notificationsFeed, lastSeenMs]);

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadByAdmin || 0), 0);
  const totalNewRequests = requests.filter((r) => r.status === 'new').length;
  const totalOpenTickets = tickets.filter((t) => t.status === 'open').length;

  // Sync document.title badge e.g. "(3) Arixon Admin"
  useEffect(() => {
    const totalBadges =
      unreadNotificationsCount +
      totalUnreadMessages +
      totalNewRequests +
      totalOpenTickets;

    const baseTitle = isAr ? 'لوحة تحكم إدارة اريكسون' : 'Arixon Executive Dashboard';
    if (totalBadges > 0) {
      document.title = `(${totalBadges}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [unreadNotificationsCount, totalUnreadMessages, totalNewRequests, totalOpenTickets, isAr]);

  // Desktop Browser Notification API permission request
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex bg-neutral-100 dark:bg-black text-neutral-900 dark:text-neutral-100 overflow-hidden font-sans">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 border-e border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 select-none shrink-0">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-4 border-b border-neutral-100 dark:border-neutral-800/80">
          <EriksonLogo size="sm" glow={true} />
          <div>
            <div className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-white leading-none">
              ARIXON
            </div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
              Command Suite
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>{isAr ? 'نظرة عامة' : 'Overview'}</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>{isAr ? 'المستخدمون والحسابات' : 'Users & Accounts'}</span>
            </div>
            <span className="font-mono text-[10px] opacity-60">{users.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>{isAr ? 'الرسائل والمحادثات' : 'Messages'}</span>
            </div>
            {totalUnreadMessages > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                {totalUnreadMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isAr ? 'طلبات المشاريع' : 'Project Requests'}</span>
            </div>
            {totalNewRequests > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                {totalNewRequests}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LifeBuoy className="w-4 h-4" />
              <span>{isAr ? 'تذاكر الدعم الفني' : 'Support Tickets'}</span>
            </div>
            {totalOpenTickets > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                {totalOpenTickets}
              </span>
            ) : (
              <span className="font-mono text-[10px] opacity-60">{tickets.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('updates')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'updates'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'التحديثات والإعلانات' : 'Releases'}</span>
            </div>
            <span className="font-mono text-[10px] opacity-60">{updates.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>{isAr ? 'إعدادات الإدارة' : 'Settings'}</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs transition-colors cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'العودة للموقع الرئيسي' : 'Return to Website'}</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md flex items-center justify-between gap-4 select-none shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-neutral-900 dark:text-white uppercase hidden sm:inline">
                {activeTab}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-[11px] truncate max-w-[200px]">{currentUser?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white bg-neutral-50 dark:bg-neutral-900 cursor-pointer"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white bg-neutral-50 dark:bg-neutral-900 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-black" />
              )}
            </button>

            {/* Exit to Site Button */}
            <button
              onClick={onClose}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-xs font-semibold cursor-pointer"
            >
              <span>{isAr ? 'عرض الموقع' : 'View Site'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAr ? 'خروج' : 'Sign out'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-50/70 dark:bg-black pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <AdminOverviewSection
                language={language}
                users={users}
                conversations={conversations}
                requests={requests}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsersSection
                language={language}
                users={users}
                conversations={conversations}
                requests={requests}
                onOpenConversation={(uid) => {
                  setSelectedUserIdForChat(uid);
                  setActiveTab('messages');
                }}
                onOpenRequest={(req) => {
                  setSelectedRequestForDetail(req);
                  setActiveTab('requests');
                }}
              />
            )}

            {activeTab === 'messages' && (
              <AdminMessagesSection
                language={language}
                conversations={conversations}
                users={users}
                initialSelectedUserId={selectedUserIdForChat}
              />
            )}

            {activeTab === 'requests' && (
              <AdminRequestsSection
                language={language}
                requests={requests}
                users={users}
                initialSelectedRequest={selectedRequestForDetail}
              />
            )}

            {activeTab === 'tickets' && (
              <AdminTicketsSection
                language={language}
                tickets={tickets}
              />
            )}

            {activeTab === 'updates' && (
              <AdminUpdatesSection
                language={language}
                updates={updates}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsSection
                language={language}
                onToggleLanguage={() => {
                  const ev = new CustomEvent('toggle_arixon_language');
                  window.dispatchEvent(ev);
                }}
                onSignOut={logout}
              />
            )}
          </div>
        </main>

        {/* 3. MOBILE BOTTOM TABS NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 h-16 border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md flex items-center justify-around px-2 z-20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl ${
              activeTab === 'overview'
                ? 'text-neutral-900 dark:text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{isAr ? 'الرئيسية' : 'Overview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl ${
              activeTab === 'users'
                ? 'text-neutral-900 dark:text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isAr ? 'الحسابات' : 'Users'}</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl ${
              activeTab === 'messages'
                ? 'text-neutral-900 dark:text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isAr ? 'الرسائل' : 'Chats'}</span>
            {totalUnreadMessages > 0 && (
              <span className="absolute top-0 end-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl ${
              activeTab === 'requests'
                ? 'text-neutral-900 dark:text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isAr ? 'الطلبات' : 'Requests'}</span>
            {totalNewRequests > 0 && (
              <span className="absolute top-0 end-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl ${
              activeTab === 'tickets'
                ? 'text-neutral-900 dark:text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>{isAr ? 'التذاكر' : 'Tickets'}</span>
            {totalOpenTickets > 0 && (
              <span className="absolute top-0 end-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl ${
              activeTab === 'settings'
                ? 'text-neutral-900 dark:text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
          </button>
        </div>
      </div>

      {/* 4. NOTIFICATIONS MODAL */}
      <AdminNotificationsModal
        language={language}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notificationsFeed}
        unreadCount={unreadNotificationsCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onNavigateToItem={(type, targetId) => {
          if (type === 'user') setActiveTab('users');
          else if (type === 'message') {
            if (targetId) setSelectedUserIdForChat(targetId);
            setActiveTab('messages');
          } else if (type === 'request') {
            if (targetId) {
              const req = requests.find((r) => r.id === targetId);
              if (req) setSelectedRequestForDetail(req);
            }
            setActiveTab('requests');
          } else if (type === 'ticket') {
            setActiveTab('tickets');
          }
        }}
      />

      {/* 5. INACTIVITY TIMEOUT WARNING MODAL */}
      {showInactivityWarning && (
        <AdminInactivityWarning
          language={language}
          secondsRemaining={secondsRemaining}
          onStaySignedIn={() => {
            lastActivityRef.current = Date.now();
            setShowInactivityWarning(false);
          }}
          onSignOutNow={() => {
            logout();
            onClose();
          }}
        />
      )}
    </div>
  );
};
