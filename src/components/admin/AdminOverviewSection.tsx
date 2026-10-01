import React, { useMemo } from 'react';
import {
  Users,
  UserPlus,
  Radio,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  TrendingUp,
  Globe2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { UserProfile, Conversation, ProjectRequest } from '../../firebase/config';
import { Language } from '../../types';

interface AdminOverviewSectionProps {
  language: Language;
  users: UserProfile[];
  conversations: Conversation[];
  requests: ProjectRequest[];
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  language,
  users,
  conversations,
  requests,
  onNavigateTab,
}) => {
  const isAr = language === 'ar';

  // Compute metrics
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const twoMinutesAgo = now - 2 * 60 * 1000;

  const toMillis = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.toMillis) return val.toMillis();
    if (val.seconds) return val.seconds * 1000;
    const d = new Date(val);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const totalUsers = users.length;
  const newToday = users.filter((u) => toMillis(u.createdAt) >= oneDayAgo).length;
  const new7Days = users.filter((u) => toMillis(u.createdAt) >= sevenDaysAgo).length;
  const new30Days = users.filter((u) => toMillis(u.createdAt) >= thirtyDaysAgo).length;
  const onlineNow = users.filter((u) => toMillis(u.lastSeen) >= twoMinutesAgo).length;

  const unreadConversations = conversations.filter((c) => (c.unreadByAdmin || 0) > 0).length;
  const newRequests = requests.filter((r) => r.status === 'new').length;
  const inProgressRequests = requests.filter((r) => r.status === 'in_progress').length;
  const doneRequests = requests.filter((r) => r.status === 'done').length;

  // 1. Signups over the last 30 days (daily buckets)
  const signupChartData = useMemo(() => {
    const buckets: { dateStr: string; label: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      buckets.push({ dateStr: key, label, count: 0 });
    }

    users.forEach((u) => {
      const ms = toMillis(u.createdAt);
      if (ms >= thirtyDaysAgo) {
        const d = new Date(ms);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        const found = buckets.find((b) => b.dateStr === key);
        if (found) found.count++;
      }
    });

    return buckets;
  }, [users, now, thirtyDaysAgo]);

  const maxDailySignups = Math.max(...signupChartData.map((d) => d.count), 5);

  // 2. Top 10 Countries
  const topCountries = useMemo(() => {
    const counts: Record<string, { count: number; flag: string }> = {};
    users.forEach((u) => {
      const country = u.country || (isAr ? 'غير محدد' : 'Unknown');
      const flag = u.countryFlag || '🌍';
      if (!counts[country]) counts[country] = { count: 0, flag };
      counts[country].count++;
    });

    return Object.entries(counts)
      .map(([name, { count, flag }]) => ({ name, count, flag }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [users, isAr]);

  const maxCountryCount = Math.max(...topCountries.map((c) => c.count), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 text-white dark:bg-white dark:text-black border border-neutral-800 shadow-md">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase opacity-70">
            {isAr ? 'نظام المراقبة والتحكم المركزي' : 'Core Command Center'}
          </span>
          <h2 className="text-2xl font-black mt-0.5">
            {isAr ? 'نظرة عامة على الأنظمة والعمليات' : 'Executive Systems Overview'}
          </h2>
          <p className="text-xs sm:text-sm opacity-80 mt-1">
            {isAr
              ? 'مؤشرات حقيقية مستمدة مباشرة من قواعد بيانات Firestore الخاصة بشركة اريكسون.'
              : 'Real-time verified metrics pulled live from Arixon production Firestore.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {onlineNow} {isAr ? 'متصل الآن' : 'Live Online'}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-medium">{isAr ? 'إجمالي الحسابات' : 'Total Accounts'}</span>
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
            {totalUsers}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>+{newToday} {isAr ? 'اليوم' : 'today'}</span>
            <span aria-hidden="true">·</span>
            <span>+{new7Days} {isAr ? 'هذا الأسبوع' : 'this week'}</span>
          </div>
        </div>

        {/* Card 2: 30 Days Signups */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-medium">{isAr ? 'تسجيلات 30 يوماً' : '30-Day Registrations'}</span>
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
            {new30Days}
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{isAr ? 'حسابات حقيقية مؤكدة' : 'Verified signups'}</span>
          </div>
        </div>

        {/* Card 3: Unread Messages */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-medium">{isAr ? 'محادثات غير مقروءة' : 'Unread Inquiries'}</span>
            <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <span>{unreadConversations}</span>
            {unreadConversations > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            <span>{conversations.length} {isAr ? 'إجمالي المحادثات' : 'total chats'}</span>
          </div>
        </div>

        {/* Card 4: Requests */}
        <div
          onClick={() => onNavigateTab('requests')}
          className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-3">
            <span className="text-xs font-medium">{isAr ? 'طلبات المشاريع' : 'Project Requests'}</span>
            <FileSpreadsheet className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <span>{requests.length}</span>
            {newRequests > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {newRequests} {isAr ? 'جديد' : 'new'}
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center gap-2">
            <span>{inProgressRequests} {isAr ? 'قيد التنفيذ' : 'in progress'}</span>
            <span aria-hidden="true">·</span>
            <span>{doneRequests} {isAr ? 'مكتمل' : 'done'}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Chart 1: Signups over 30 Days (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                {isAr ? 'معدل التسجيل خلال آخر 30 يوماً' : 'Registration Velocity (Last 30 Days)'}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isAr ? 'توزيع انضمام المستخدمين يوماً بيوم' : 'Daily distribution of registered accounts'}
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              30 Days
            </span>
          </div>

          {/* SVG Area Chart */}
          <div className="w-full h-56 relative select-none">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 600 180"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" className="text-neutral-900 dark:text-white" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-neutral-900 dark:text-white" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="600" y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="600" y2="130" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

              {/* Build Path */}
              {(() => {
                const points = signupChartData.map((d, idx) => {
                  const x = (idx / (signupChartData.length - 1)) * 600;
                  const y = 160 - (d.count / maxDailySignups) * 130;
                  return { x, y };
                });

                if (points.length < 2) return null;

                const lineD = points.reduce(
                  (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
                  ''
                );
                const areaD = `${lineD} L 600 160 L 0 160 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#signupGradient)" />
                    <path
                      d={lineD}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-neutral-900 dark:text-white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="3"
                        className="fill-white dark:fill-black stroke-neutral-900 dark:stroke-white stroke-2"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-2">
            <span>{signupChartData[0]?.label}</span>
            <span>{signupChartData[14]?.label}</span>
            <span>{signupChartData[signupChartData.length - 1]?.label}</span>
          </div>
        </div>

        {/* Requests by Status Distribution (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              {isAr ? 'حالة طلبات المشاريع' : 'Requests Distribution'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {requests.length} {isAr ? 'إجمالي الطلبات المستلمة' : 'total submissions'}
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="my-6 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{isAr ? 'جديد (بانتظار المراجعة)' : 'New / Review'}</span>
                </span>
                <span className="font-mono">{newRequests}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${requests.length ? (newRequests / requests.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
                  <span>{isAr ? 'قيد التنفيذ والبرمجة' : 'In Progress'}</span>
                </span>
                <span className="font-mono">{inProgressRequests}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500"
                  style={{ width: `${requests.length ? (inProgressRequests / requests.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{isAr ? 'مكتمل ومعتمد' : 'Completed / Done'}</span>
                </span>
                <span className="font-mono">{doneRequests}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${requests.length ? (doneRequests / requests.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('requests')}
            className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isAr ? 'إدارة جميع الطلبات' : 'Manage All Requests'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Countries Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-neutral-500" />
              <span>{isAr ? 'أعلى 10 دول من حيث المستخدمين' : 'Top 10 User Regions & Demographics'}</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isAr ? 'بناءً على اختيار المستخدم عند إكمال الملف الشخصي' : 'Recorded via user profile completion'}
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {topCountries.length} {isAr ? 'دول مسجلة' : 'countries'}
          </span>
        </div>

        {topCountries.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            {isAr ? 'لا توجد بيانات دول حتى الآن' : 'No country metrics recorded yet'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topCountries.map((c, idx) => {
              const pct = (c.count / maxCountryCount) * 100;
              return (
                <div
                  key={c.name}
                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate max-w-[180px]">{c.name}</span>
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {c.count} <span className="text-[10px] text-neutral-400 font-normal">({Math.round((c.count / (totalUsers || 1)) * 100)}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
