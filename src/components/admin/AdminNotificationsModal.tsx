import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  UserPlus,
  MessageSquare,
  FileSpreadsheet,
  Volume2,
  VolumeX,
  X,
  Clock,
  ArrowUpRight,
  Shield,
  LifeBuoy,
} from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, UserProfile, Conversation, ProjectRequest } from '../../firebase/config';
import { Language } from '../../types';

export interface AdminNotificationItem {
  id: string;
  type: 'user' | 'message' | 'request' | 'ticket';
  title: string;
  desc: string;
  timestamp: any;
  targetId?: string;
}

interface AdminNotificationsModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotificationItem[];
  unreadCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateToItem: (type: 'user' | 'message' | 'request' | 'ticket', targetId?: string) => void;
}

export const AdminNotificationsModal: React.FC<AdminNotificationsModalProps> = ({
  language,
  isOpen,
  onClose,
  notifications,
  unreadCount,
  soundEnabled,
  onToggleSound,
  onNavigateToItem,
}) => {
  const isAr = language === 'ar';
  const [marking, setMarking] = useState(false);

  // Mark all as read by updating adminState/main
  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      const docRef = doc(db, 'adminState', 'main');
      await updateDoc(docRef, {
        lastSeenNotificationsAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Error updating lastSeenNotificationsAt:', err);
    } finally {
      setMarking(false);
    }
  };

  const toMillis = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val.toMillis) return val.toMillis();
    if (val.seconds) return val.seconds * 1000;
    const d = new Date(val);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-neutral-500" />
            <span className="font-bold text-sm text-neutral-900 dark:text-white">
              {isAr ? 'مركز الإشعارات الحية' : 'Live Notifications Feed'}
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
              title={soundEnabled ? (isAr ? 'الصوت مفعّل' : 'Sound ON') : (isAr ? 'الصوت معطّل' : 'Sound OFF')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">
            {notifications.length} {isAr ? 'إشعارات مسجلة' : 'total items'}
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={marking}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:underline cursor-pointer disabled:opacity-50"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-[280px]">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-xs text-neutral-400 py-12">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <span>{isAr ? 'لا توجد إشعارات جديدة حالياً' : 'No new notifications'}</span>
            </div>
          ) : (
            notifications.map((n) => {
              return (
                <div
                  key={n.id}
                  onClick={() => {
                    onNavigateToItem(n.type, n.targetId);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    {n.type === 'user' && <UserPlus className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />}
                    {n.type === 'message' && <MessageSquare className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />}
                    {n.type === 'request' && <FileSpreadsheet className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />}
                    {n.type === 'ticket' && <LifeBuoy className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />}
                  </div>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-neutral-900 dark:text-white truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                        {toMillis(n.timestamp) ? new Date(toMillis(n.timestamp)).toLocaleTimeString() : ''}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {n.desc}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
