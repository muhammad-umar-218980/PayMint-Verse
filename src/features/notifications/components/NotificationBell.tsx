'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, HandCoins, Receipt, Trash2, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Notification } from '@/types';

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

function getTypeIcon(type: string) {
  if (type.includes('expense')) return <Receipt className="w-4 h-4 text-emerald-600" />;
  if (type.includes('settlement')) return <HandCoins className="w-4 h-4 text-emerald-700" />;
  if (type.includes('member')) return <UserPlus className="w-4 h-4 text-blue-500" />;
  return <Bell className="w-4 h-4 text-slate-400" />;
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();

    const load = async () => {
      const [{ data: items }, { count }] = await Promise.all([
        supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_read', false),
      ]);
      if (items) setNotifications(items as Notification[]);
      setUnread(count ?? 0);
    };
    load();

    try {
      const channel = supabase
        .channel(`notifications-${userId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
          (payload) => {
            const row = payload.new as Notification;
            setNotifications((prev) => [row, ...prev].slice(0, 20));
            setUnread((prev) => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Realtime unavailable — poll once instead.
      return;
    }
  }, [userId]);

  const handleMarkAllRead = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnread(0);
    loadingRef.current = false;
  };

  const handleClearAll = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    if (loadingRef.current) return;
    loadingRef.current = true;
    const supabase = createClient();
    await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);
    setNotifications([]);
    setUnread(0);
    setConfirmClear(false);
    loadingRef.current = false;
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmClear(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Notifications"
        aria-label="Notifications"
        className="relative p-2 rounded-lg text-ink/50 hover:text-ink hover:bg-ink/[0.05] transition-colors cursor-pointer"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClose} />
          <div className="absolute right-0 lg:left-0 lg:right-auto top-[calc(100%+8px)] z-50 w-[min(320px,calc(100vw-2rem))] bg-white border border-line rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-line bg-[#F5F7F4]/50">
              <h3 className="text-[13px] font-semibold text-ink shrink-0">Notifications</h3>
              <div className="flex items-center gap-3 min-w-0">
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className={`flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                      confirmClear
                        ? 'text-red-600 font-bold'
                        : 'text-red-500/80 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {confirmClear ? 'Confirm?' : 'Clear all'}
                  </button>
                )}
                {unread > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <p className="text-[12px] text-slate-400">No notifications yet.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-line last:border-b-0 ${
                      n.is_read ? 'opacity-60' : 'bg-emerald-600/[0.03]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-line flex items-center justify-center shrink-0 mt-0.5">
                      {getTypeIcon(n.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] leading-snug text-ink">{n.message}</p>
                      <p className="text-[11px] text-ink/45 mt-0.5">{formatTimeAgo(n.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
