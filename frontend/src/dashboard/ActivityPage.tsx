import React, { useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { MessageSquare, ArrowRight, Bell } from 'lucide-react';
import { DashboardContext } from './DashboardLayout';
import { formatTimestamp, hasUnread } from '../lib/orders';

/**
 * Activity page — flat reverse-chronological feed of orders with unread replies.
 * Useful for users who want a "what's new" view across all their orders.
 */
export default function ActivityPage() {
  const { orders } = useOutletContext<DashboardContext>();

  const recent = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const aT = a.updatedAt?.toMillis?.() ?? 0;
        const bT = b.updatedAt?.toMillis?.() ?? 0;
        return bT - aT;
      })
      .slice(0, 20);
  }, [orders]);

  return (
    <div className="px-6 sm:px-10 py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-400/80 mb-2">What's new</p>
        <h1 className="font-serif italic text-4xl sm:text-5xl font-black text-white">Activity</h1>
        <p className="text-gray-400 mt-2 text-sm">Real-time feed of replies, status changes, and updates across your orders.</p>
      </div>

      {recent.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gold-400/20 bg-[#0a0806] p-12 text-center">
          <Bell className="w-10 h-10 text-gold-400/50 mx-auto mb-4" />
          <p className="text-white font-bold mb-1">Nothing here yet</p>
          <p className="text-gray-500 text-sm">You'll see new replies and status changes here the moment they happen.</p>
        </div>
      ) : (
        <ol className="space-y-3">
          {recent.map((o) => {
            const unread = hasUnread(o);
            return (
              <li key={o.id}>
                <Link
                  to={`/dashboard/orders/${o.id}`}
                  data-testid={`activity-item-${o.orderId}`}
                  className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                    unread
                      ? 'border-gold-400/40 bg-gold-400/5 hover:bg-gold-400/10'
                      : 'border-gold-400/10 bg-[#0a0806] hover:border-gold-400/30'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${unread ? 'bg-gold-400 text-black' : 'bg-white/5 text-gold-400'}`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">{o.orderId} · {o.status}</p>
                    <p className="text-white font-bold truncate">{o.projectName}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Updated {formatTimestamp(o.updatedAt)}</p>
                  </div>
                  {unread && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-black bg-gold-400 px-2.5 py-1 rounded-full">
                      New
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
