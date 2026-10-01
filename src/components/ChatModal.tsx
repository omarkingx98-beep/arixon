import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageCircle,
  Clock,
  Loader2,
  ExternalLink,
  Shield,
  User,
  Check,
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db, ChatMessage, Conversation } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { SOCIAL_LINKS } from '../data/apps';
import { EriksonLogo } from './EriksonLogo';

interface ChatModalProps {
  language: Language;
}

export const ChatModal: React.FC<ChatModalProps> = ({ language }) => {
  const { currentUser, userProfile, isChatOpen, closeChat } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAr = language === 'ar';
  const whatsappUrl = isAr ? SOCIAL_LINKS.whatsappUrlAr : SOCIAL_LINKS.whatsappUrlEn;

  // Real-time messages listener
  useEffect(() => {
    if (!isChatOpen || !currentUser) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    const messagesRef = collection(db, 'conversations', currentUser.uid, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
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
        console.warn('Error loading messages:', err);
        setLoadingMessages(false);
      }
    );

    // Reset unreadByUser when user opens the chat
    const convRef = doc(db, 'conversations', currentUser.uid);
    updateDoc(convRef, { unreadByUser: 0 }).catch(() => {});

    return () => unsubscribe();
  }, [isChatOpen, currentUser]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingMessages]);

  if (!isChatOpen || !currentUser) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    if (userProfile?.blocked) {
      return;
    }

    setSending(true);
    try {
      const convRef = doc(db, 'conversations', currentUser.uid);
      const messagesRef = collection(db, 'conversations', currentUser.uid, 'messages');

      // 1. Add message subdocument
      await addDoc(messagesRef, {
        text,
        senderId: currentUser.uid,
        senderRole: 'user',
        senderName: userProfile?.name || currentUser.displayName || 'Visitor',
        createdAt: serverTimestamp(),
      });

      // 2. Upsert conversation parent document
      await setDoc(
        convRef,
        {
          userId: currentUser.uid,
          userName: userProfile?.name || currentUser.displayName || 'Visitor',
          userUsername: userProfile?.username || '',
          userEmail: currentUser.email || '',
          userPhone: userProfile?.fullPhone || '',
          userCountry: userProfile?.country || '',
          userCountryFlag: userProfile?.countryFlag || '',
          userAge: userProfile?.age || null,
          lastMessage: text,
          updatedAt: serverTimestamp(),
          unreadByAdmin: increment(1),
          unreadByUser: 0,
        },
        { merge: true }
      );

      setInputText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (createdAt: any) => {
    if (!createdAt) return '';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col h-[640px] max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-sm">
                <EriksonLogo size="sm" glow={false} />
              </div>
              <span className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
                  {isAr ? 'إدارة اريكسون · الدعم والمشاريع' : 'Arixon Administration · Direct'}
                </h3>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded">
                  {isAr ? 'مباشر' : 'Live'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isAr
                  ? 'محادثة مشفرة ومباشرة مع المطور والإدارة'
                  : 'Real-time encrypted inquiry with lead engineer'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Fallback Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700"
              title="WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>

            {/* Close Button */}
            <button
              onClick={closeChat}
              className="p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp Banner on Mobile */}
        <div className="sm:hidden px-4 py-2 bg-neutral-100 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-500 dark:text-neutral-400">
            {isAr ? 'أو تواصل فورياً عبر الهاتف:' : 'Or chat on WhatsApp:'}
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neutral-900 dark:text-white underline flex items-center gap-1"
          >
            <span>+970 594 399 472</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-white dark:bg-neutral-900/40">
          {loadingMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p className="text-xs">{isAr ? 'جاري تحميل المحادثة...' : 'Loading chat...'}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                {isAr ? 'ابدأ محادثتك مع إدارة اريكسون' : 'Start your conversation with Arixon'}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                {isAr
                  ? 'اكتب استفسارك، فكرة مشروعك، أو طلبك البرمجي، وسيقوم المطور بالرد عليك في أقرب وقت هنا مباشرة.'
                  : 'Send your project requirements or inquiries. Our engineering lead will respond directly here.'}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdminMsg = msg.senderRole === 'admin';
              const isMine = msg.senderId === currentUser.uid;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isMine ? 'items-end' : 'items-start'
                  } transition-all`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                      {isAdminMsg
                        ? isAr
                          ? 'إدارة اريكسون'
                          : 'Arixon Admin'
                        : msg.senderName || (isAr ? 'أنت' : 'You')}
                    </span>
                    {isAdminMsg && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-black text-white dark:bg-white dark:text-black font-mono">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black rounded-ee-sm'
                        : 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 rounded-es-sm border border-neutral-200 dark:border-neutral-700/60'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                        isMine
                          ? 'text-neutral-300 dark:text-neutral-600'
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    >
                      <span>{formatMessageTime(msg.createdAt)}</span>
                      {isMine && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-sm">
          {userProfile?.blocked ? (
            <div className="p-3 text-center text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-medium">
              {isAr ? 'تم تقييد حسابك مؤقتاً من قبل الإدارة. يرجى التواصل عبر الواتساب للاستفسار.' : 'Your account has been restricted by administration. Please contact us via WhatsApp.'}
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isAr
                    ? 'اكتب رسالتك أو استفسارك هنا...'
                    : 'Type your message or project inquiry...'
                }
                className="flex-1 py-2.5 px-4 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-40"
                aria-label="Send message"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                )}
                <span className="hidden sm:inline">{isAr ? 'إرسال' : 'Send'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
