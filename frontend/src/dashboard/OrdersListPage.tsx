import React, { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Clock,
  MessageSquare,
  ChevronRight,
  PackageOpen,
  Sparkles,
} from 'lucide-react';
import { DashboardContext } from './DashboardLayout';
import { Order, OrderStatus, STATUS_META, formatTimestamp, hasUnread } from '../lib/orders';

const STATUS_FILTERS: ('All' | OrderStatus)[] = ['All', 'Pending', 'In Review', 'Accepted', 'Completed'];

export default function OrdersListPage() {
  const { orders, user } = useOutletContext<DashboardContext>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | OrderStatus>('All');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== 'All' && o.status !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          o.projectName.toLowerCase().includes(q) ||
          o.orderId.toLowerCase().includes(q) ||
          o.type.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, query, filter]);

  const stats = useMemo(
    () => ({
      total: orders.length,
      active: orders.filter((o) => o.status !== 'Completed').length,
      unread: orders.filter(hasUnread).length,
    }),
    [orders]
  );

  return (
    <div className="px-6 sm:px-10 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-400/80 mb-2">Welcome back, {(user.displayName || 'Client').split(' ')[0]}</p>
        <h1 className="font-serif italic text-4xl sm:text-5xl font-black text-white">Your Orders</h1>
        <p className="text-gray-400 mt-2 text-sm">Track every request, talk to the team in real time, watch progress live.</p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Total Orders', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Unread Replies', value: stats.unread, highlight: stats.unread > 0 },
        ].map((s) => (
          <div
            key={s.label}
            className={`p-5 rounded-2xl border ${
              s.highlight ? 'border-gold-400/40 bg-gold-400/5' : 'border-gold-400/10 bg-[#0a0806]'
            }`}
          >
            <p className="font-serif italic text-3xl font-black text-white">{s.value}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="orders-search"
            placeholder="Search by project, ID, type…"
            className="w-full bg-[#0a0806] border border-gold-400/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-400/40"
          />
        </div>
        <div className="flex items-center gap-2 bg-[#0a0806] border border-gold-400/10 rounded-xl p-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              data-testid={`orders-filter-${s.toLowerCase().replace(' ', '-')}`}
              className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.18em] transition-all ${
                filter === s
                  ? 'bg-gold-400 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <EmptyState hasAnyOrders={orders.length > 0} />
      ) : (
        <div className="space-y-3">
          {filtered.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
            >
              <OrderCard order={o} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const meta = STATUS_META[order.status];
  const unread = hasUnread(order);

  return (
    <Link
      to={`/dashboard/orders/${order.id}`}
      data-testid={`order-card-${order.orderId}`}
      className="group block p-6 rounded-2xl border border-gold-400/10 bg-[#0a0806] hover:border-gold-400/40 hover:bg-[#0e0b08] transition-all"
    >
      <div className="flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center shrink-0">
          <PackageOpen className="w-5 h-5 text-gold-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{order.orderId}</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${meta.color} ${meta.bg} ${meta.border}`}>
              {meta.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
              {order.status}
            </span>
            {unread && (
              <span
                data-testid="order-card-unread"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gold-400 text-black"
              >
                <MessageSquare className="w-3 h-3" /> New message
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white truncate group-hover:text-gold-200 transition-colors">{order.projectName}</h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-1">{order.description}</p>
          <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {order.type}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> Created {formatTimestamp(order.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              Updated {formatTimestamp(order.updatedAt)}
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

function EmptyState({ hasAnyOrders }: { hasAnyOrders: boolean }) {
  return (
    <div data-testid="orders-empty-state" className="rounded-3xl border border-dashed border-gold-400/20 bg-[#0a0806] p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-5">
        <PackageOpen className="w-7 h-7 text-gold-400" />
      </div>
      <h3 className="font-serif italic text-2xl font-black text-white mb-2">
        {hasAnyOrders ? 'No orders match these filters' : 'No orders yet'}
      </h3>
      <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
        {hasAnyOrders
          ? 'Try clearing the search box or switching the status filter back to All.'
          : 'Send us a new request and a fresh order card will land here in seconds.'}
      </p>
    </div>
  );
}
