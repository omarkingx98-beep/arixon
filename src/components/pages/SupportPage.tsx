import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  LifeBuoy,
  Plus,
  Send,
  Lock,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  Loader2,
  LogIn,
} from 'lucide-react';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, SupportTicket } from '../../firebase/config';
import { Language } from '../../types';
import { PORTFOLIO_APPS } from '../../data/apps';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/sound';

interface SupportPageProps {
  language: Language;
  onGoHome: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ language, onGoHome }) => {
  const isAr = language === 'ar';
  const { currentUser, userProfile, openAuthModal } = useAuth();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Form State
  const [appId, setAppId] = useState(PORTFOLIO_APPS[0].id);
  const [issueType, setIssueType] = useState('bug');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time listener on user's own support tickets
  useEffect(() => {
    if (!currentUser) {
      setTickets([]);
      setLoadingTickets(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'supportTickets'),
        where('userId', '==', currentUser.uid)
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: SupportTicket[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as any) });
          });
          // Sort client-side by date to avoid composite index requirement
          list.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });
          setTickets(list);
          setLoadingTickets(false);
        },
        (err) => {
          console.warn('Support tickets listener:', err);
          setLoadingTickets(false);
        }
      );
      return () => unsub();
    } catch (_) {
      setLoadingTickets(false);
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!description.trim()) {
      setErrorMessage(isAr ? 'يرجى كتابة وصف المشكلة أو الطلب.' : 'Please describe your issue or request.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    sound.playClick();

    try {
      const newTicket = {
        userId: currentUser.uid,
        name: userProfile?.name || currentUser.displayName || 'Client',
        email: userProfile?.email || currentUser.email || '',
        appId,
        issueType,
        priority,
        description: description.trim(),
        status: 'open',
        adminNote: '',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'supportTickets'), newTicket);
      sound.playChime();
      setSuccessMessage(
        isAr
          ? 'تم فتح التذكرة بنجاح! سيقوم فريق اريكسون بمتابعتها والرد عليك فوراً.'
          : 'Support ticket submitted successfully! Our team will review and reply shortly.'
      );
      setDescription('');
    } catch (err: any) {
      console.error('Error submitting ticket:', err);
      setErrorMessage(
        err.message || (isAr ? 'حدث خطأ أثناء إرسال التذكرة.' : 'Failed to submit ticket.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Navigation Breadcrumb / Go Home */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة للرئيسية' : 'Return to Home'}</span>
          </button>

          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            {isAr ? 'بوابة دعم العملاء' : 'Client Support Portal'}
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-[11px] font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>{isAr ? 'تذاكر الدعم الفني' : 'Technical Support Tickets'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isAr ? 'بوابة الدعم الفني والمتابعة' : 'Client Support & Issue Tracking'}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            {isAr
              ? 'مخصصة لعملاء اريكسون لمتابعة البلاغات الفنية، طلب الميزات، وتحديثات الأنظمة مع تواصل مباشر وموثق.'
              : 'Dedicated support ticket desk for Arixon clients to submit bugs, request feature enhancements, and track resolution in real-time.'}
          </p>
        </div>

        {/* Auth Barrier if not logged in */}
        {!currentUser ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-6 shadow-xl max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-700 dark:text-neutral-300">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">
                {isAr ? 'تسجيل الدخول مطلوب لفتح تذكرة' : 'Sign in Required for Support'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                {isAr
                  ? 'يرجى تسجيل الدخول بحسابك لربط التذكرة ببياناتك وإتاحة متابعة الردود وتحديثات الحالة.'
                  : 'Please sign in to link your support tickets to your account and track live resolution updates.'}
              </p>
            </div>

            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الدخول والمتابعة' : 'Sign in & Continue'}</span>
            </button>
          </div>
        ) : (
          /* Client Support Portal Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Create Ticket Form */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <Plus className="w-4 h-4 text-emerald-500" />
                  <h2 className="font-bold text-base sm:text-lg">
                    {isAr ? 'فتح تذكرة دعم جديدة' : 'Open a New Ticket'}
                  </h2>
                </div>

                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Select App */}
                  <div>
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                      {isAr ? 'التطبيق أو المنصة المعنية' : 'Related Application / System'}
                    </label>
                    <select
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    >
                      {PORTFOLIO_APPS.map((app) => (
                        <option key={app.id} value={app.id}>
                          {isAr ? app.name.ar : app.name.en}
                        </option>
                      ))}
                      <option value="general">{isAr ? 'حساب عام / خدمة أخرى' : 'General / Other Service'}</option>
                    </select>
                  </div>

                  {/* Issue Type & Priority */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        {isAr ? 'نوع التذكرة' : 'Issue Type'}
                      </label>
                      <select
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none"
                      >
                        <option value="bug">{isAr ? 'خلل فني / Bug' : 'Bug Report'}</option>
                        <option value="feature">{isAr ? 'طلب ميزة جديدة' : 'Feature Request'}</option>
                        <option value="hardware">{isAr ? 'طابعات / أجهزة الكاشير' : 'Printer / Hardware'}</option>
                        <option value="question">{isAr ? 'استفسار تقني' : 'Technical Question'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        {isAr ? 'الأولوية' : 'Priority'}
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none"
                      >
                        <option value="low">{isAr ? 'منخفضة' : 'Low'}</option>
                        <option value="medium">{isAr ? 'متوسطة' : 'Medium'}</option>
                        <option value="high">{isAr ? 'عالية' : 'High'}</option>
                        <option value="urgent">{isAr ? 'حرجة / عاجلة' : 'Urgent'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                      {isAr ? 'شرح المشكلة بالتفصيل' : 'Detailed Description'}
                    </label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        isAr
                          ? 'اكتب تفاصيل ما حدث معك، الخطوات التي أدت للخلل، أو الميزة التي ترغب في إضافتها...'
                          : 'Describe the issue, steps to reproduce, or feature specifications...'
                      }
                      className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 placeholder-neutral-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isAr ? 'إرسال التذكرة للإدارة' : 'Submit Support Ticket'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: User's Existing Tickets */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base sm:text-lg">
                  {isAr ? 'تذاكري السابقة' : 'My Support Tickets'}
                </h2>
                <span className="text-xs font-mono text-neutral-500">
                  {tickets.length} {isAr ? 'تذاكر' : 'tickets'}
                </span>
              </div>

              {loadingTickets ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-neutral-400" />
                  <span>{isAr ? 'جارٍ تحميل تذاكرك...' : 'Loading tickets...'}</span>
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2 text-neutral-500">
                  <FileText className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-700" />
                  <p className="text-xs">
                    {isAr ? 'لا توجد لديك تذاكر دعم مفتوحة حالياً.' : 'You have no support tickets yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t) => {
                    const statusColor =
                      t.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : t.status === 'in_progress'
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20';

                    const statusLabel =
                      t.status === 'resolved'
                        ? isAr ? 'مكتملة / تم الحل' : 'Resolved'
                        : t.status === 'in_progress'
                        ? isAr ? 'قيد المعالجة' : 'In Progress'
                        : isAr ? 'جديدة / قيد المراجعة' : 'Open';

                    return (
                      <div
                        key={t.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-neutral-400 text-[11px]">
                            #{t.id.slice(0, 6)} · {t.appId}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                          {t.description}
                        </p>

                        {/* Admin reply note if available */}
                        {t.adminNote && (
                          <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs space-y-1">
                            <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-[11px]">
                              <MessageSquare className="w-3 h-3 text-amber-500" />
                              <span>{isAr ? 'رد إدارة اريكسون (عمر شراب):' : 'Arixon Admin Response:'}</span>
                            </span>
                            <p className="text-neutral-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                              {t.adminNote}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
