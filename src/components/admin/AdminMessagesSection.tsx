import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Loader2,
  Check,
  CheckCheck,
  Clock,
  User,
  Phone,
  Mail,
  Sparkles,
  Plus,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, Conversation, ChatMessage, UserProfile } from '../../firebase/config';
import { Language } from '../../types';

interface AdminMessagesSectionProps {
  language: Language;
  conversations: Conversation[];
  users: UserProfile[];
  initialSelectedUserId?: string | null;
}

const DEFAULT_TEMPLATES_AR = [
  'مرحباً بك! شكراً لتواصلك مع شركة اريكسون، كيف يمكننا مساعدتك في مشروعك اليوم؟',
  'تم استلام تفاصيل طلبك بنجاح، وسنقوم بمراجعة المواصفات الفنية وإعلامك فوراً.',
  'يمكننا أيضاً التنسيق المباشر عبر تطبيق واتساب على الرقم: +970594399472 لمناقشة أسرع.',
  'الأنظمة لدينا مبنية بأعلى معايير السرعة والأمان مع دعم العمل دون إنترنت (Offline).',
];

const DEFAULT_TEMPLATES_EN = [
  'Hello! Thank you for contacting Arixon. How can we assist with your project today?',
  'We have received your specifications and are reviewing the technical milestones.',
  'We can also coordinate directly on WhatsApp (+970594399472) for faster sync.',
  'Our software platforms are built for ultra-low latency with offline persistence.',
];

export const AdminMessagesSection: React.FC<AdminMessagesSectionProps> = ({
  language,
  conversations,
  users,
  initialSelectedUserId,
}) => {
  const isAr = language === 'ar';

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Quick reply templates stored in localStorage
  const [templates, setTemplates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arixon_admin_templates');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return isAr ? DEFAULT_TEMPLATES_AR : DEFAULT_TEMPLATES_EN;
  });

  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [newTemplateInput, setNewTemplateInput] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync initial selected user if passed from users section
  useEffect(() => {
    if (initialSelectedUserId) {
      const target = conversations.find((c) => c.userId === initialSelectedUserId);
      if (target) {
        setSelectedConversation(target);
      }
    } else if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [initialSelectedUserId, conversations]);

  // Real-time listener for active conversation messages
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    const messagesRef = collection(db, 'conversations', selectedConversation.userId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ChatMessage[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            text: data.text || '',
            senderId: data.senderId || '',
            senderRole: data.senderRole || 'user',
            senderName: data.senderName || '',
            createdAt: data.createdAt,
          });
        });
        setMessages(list);
        setLoadingMessages(false);
      },
      (err) => {
        console.error('Error fetching chat messages:', err);
        setLoadingMessages(false);
      }
    );

    // Clear unreadByAdmin on open
    try {
      const convRef = doc(db, 'conversations', selectedConversation.userId);
      updateDoc(convRef, { unreadByAdmin: 0 }).catch(() => {});
    } catch (_) {}

    return () => unsubscribe();
  }, [selectedConversation]);

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingMessages]);

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedConversation || !replyText.trim() || sending) return;

    setSending(true);
    const text = replyText.trim();
    try {
      const convRef = doc(db, 'conversations', selectedConversation.userId);
      const messagesRef = collection(db, 'conversations', selectedConversation.userId, 'messages');

      // 1. Add message
      await addDoc(messagesRef, {
        text,
        senderId: 'admin',
        senderRole: 'admin',
        senderName: isAr ? 'إدارة اريكسون' : 'Arixon Admin',
        createdAt: serverTimestamp(),
      });

      // 2. Update conversation
      await updateDoc(convRef, {
        lastMessage: text,
        updatedAt: serverTimestamp(),
        unreadByAdmin: 0,
        unreadByUser: (selectedConversation.unreadByUser || 0) + 1,
      });

      setReplyText('');
    } catch (err) {
      console.error('Failed to send admin reply:', err);
    } finally {
      setSending(false);
    }
  };

  const handleAddTemplate = () => {
    if (!newTemplateInput.trim()) return;
    const updated = [newTemplateInput.trim(), ...templates];
    setTemplates(updated);
    try {
      localStorage.setItem('arixon_admin_templates', JSON.stringify(updated));
    } catch (_) {}
    setNewTemplateInput('');
  };

  const handleDeleteTemplate = (idx: number) => {
    const updated = templates.filter((_, i) => i !== idx);
    setTemplates(updated);
    try {
      localStorage.setItem('arixon_admin_templates', JSON.stringify(updated));
    } catch (_) {}
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.userName?.toLowerCase().includes(q) ||
      c.userEmail?.toLowerCase().includes(q) ||
      c.lastMessage?.toLowerCase().includes(q)
    );
  });

  const selectedUserProfile = selectedConversation
    ? users.find((u) => u.uid === selectedConversation.userId)
    : null;

  return (
    <div className="h-[750px] max-h-[85vh] rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex overflow-hidden animate-in fade-in duration-200">
      {/* 1. Conversations List (Sidebar) */}
      <div className="w-80 sm:w-96 border-e border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/50 dark:bg-neutral-950/50">
        {/* Search */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في المحادثات...' : 'Search conversations...'}
              className="w-full ps-9 pe-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              {isAr ? 'لا توجد محادثات' : 'No conversations found'}
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = selectedConversation?.userId === c.userId;
              const hasUnread = (c.unreadByAdmin || 0) > 0;
              return (
                <div
                  key={c.id || c.userId}
                  onClick={() => setSelectedConversation(c)}
                  className={`p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-neutral-200/70 dark:bg-neutral-800'
                      : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-900'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-neutral-300 dark:bg-neutral-800 overflow-hidden flex items-center justify-center font-bold text-xs">
                      {c.userPhoto ? (
                        <img src={c.userPhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{(c.userName || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    {hasUnread && (
                      <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-black" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {c.userName || 'Visitor'}
                      </span>
                      {hasUnread && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white">
                          {c.unreadByAdmin}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate font-mono mb-1">
                      {c.userEmail}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      {c.lastMessage || '...'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Real-Time Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 min-w-0">
          {/* Chat Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 bg-neutral-50/60 dark:bg-neutral-950/60">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                {selectedConversation.userPhoto ? (
                  <img src={selectedConversation.userPhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{(selectedConversation.userName || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="truncate">
                <div className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                  {selectedConversation.userName || 'Visitor'}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono truncate">
                  {selectedConversation.userEmail}
                </div>
              </div>
            </div>

            {/* Quick Contact buttons if available */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowTemplatesModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-semibold cursor-pointer"
                title={isAr ? 'الردود الجاهزة' : 'Quick replies'}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'ردود جاهزة' : 'Templates'}</span>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {loadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-neutral-400">
                <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                <span>{isAr ? 'لا توجد رسائل سابقة في هذه المحادثة' : 'No messages yet'}</span>
              </div>
            ) : (
              messages.map((m) => {
                const isAdminMsg = m.senderRole === 'admin';
                return (
                  <div
                    key={m.id}
                    className={`flex ${isAdminMsg ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAdminMsg
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black rounded-ee-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-es-xs'
                      }`}
                    >
                      <div className="font-semibold text-[11px] opacity-70 mb-1">
                        {isAdminMsg ? (isAr ? 'إدارة اريكسون' : 'Arixon Admin') : (selectedConversation.userName || 'User')}
                      </div>
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Reply Bar Preview */}
          {templates.length > 0 && (
            <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider shrink-0">
                {isAr ? 'قوالب سريعة:' : 'Quick:'}
              </span>
              {templates.slice(0, 3).map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => setReplyText(tpl)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[11px] text-neutral-700 dark:text-neutral-300 truncate max-w-[200px] cursor-pointer shrink-0 transition-colors"
                >
                  {tpl}
                </button>
              ))}
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 bg-neutral-50/80 dark:bg-neutral-950/80">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={isAr ? 'اكتب ردك كمسؤول اريكسون...' : 'Type reply as administrator...'}
              className="flex-1 py-2.5 px-4 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
            <button
              type="submit"
              disabled={!replyText.trim() || sending}
              className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-xs"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />}
              <span className="hidden sm:inline">{isAr ? 'إرسال الرد' : 'Reply'}</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-400">
          <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
          <h3 className="font-bold text-sm text-neutral-700 dark:text-neutral-300">
            {isAr ? 'اختر محادثة للبدء في الرد' : 'Select a conversation to reply'}
          </h3>
        </div>
      )}

      {/* Quick Reply Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'قوالب الردود السريعة' : 'Quick-Reply Templates'}</span>
              </h3>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Add new */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTemplateInput}
                onChange={(e) => setNewTemplateInput(e.target.value)}
                placeholder={isAr ? 'أضف قالب رد جديد...' : 'Add new template...'}
                className="flex-1 py-2 px-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleAddTemplate}
                className="p-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Templates list */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {templates.map((tpl, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-3 text-xs"
                >
                  <p className="flex-1 text-neutral-800 dark:text-neutral-200">{tpl}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setReplyText(tpl);
                        setShowTemplatesModal(false);
                      }}
                      className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-[10px] font-semibold cursor-pointer"
                    >
                      {isAr ? 'استخدام' : 'Use'}
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(idx)}
                      className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
