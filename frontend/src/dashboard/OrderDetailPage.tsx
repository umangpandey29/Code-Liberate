import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Sparkles,
  Clock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Hash,
  CheckCircle2,
  CircleDashed,
} from 'lucide-react';
import { DashboardContext } from './DashboardLayout';
import {
  Order,
  OrderMessage,
  OrderStatus,
  STATUS_META,
  formatTimestamp,
  markOrderRead,
  sendClientMessage,
  subscribeOrderMessages,
} from '../lib/orders';

const STATUS_TIMELINE: OrderStatus[] = ['Pending', 'In Review', 'Accepted', 'Completed'];

export default function OrderDetailPage() {
  const { orderId: orderDocId } = useParams<{ orderId: string }>();
  const { user, orders } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const order: Order | undefined = orders.find((o) => o.id === orderDocId);

  // Subscribe to messages whenever the order id changes
  useEffect(() => {
    if (!orderDocId) return;
    const unsub = subscribeOrderMessages(orderDocId, setMessages);
    // Mark as read on open
    markOrderRead(orderDocId);
    return () => unsub();
  }, [orderDocId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages.length]);

  if (!order) {
    return (
      <div className="px-6 sm:px-10 py-16 max-w-3xl mx-auto text-center">
        <p className="text-gray-500 mb-6">Order not found or still loading…</p>
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-bold text-sm uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await sendClientMessage(
        order.id,
        user.displayName || 'Client',
        user.email || '',
        text
      );
      setDraft('');
    } catch (err) {
      console.error('Failed to send message', err);
      alert('Could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const meta = STATUS_META[order.status];
  const statusIndex = STATUS_TIMELINE.indexOf(order.status);

  return (
    <div className="px-6 sm:px-10 py-8 max-w-6xl mx-auto">
      {/* Top breadcrumb */}
      <Link
        to="/dashboard/orders"
        data-testid="order-detail-back"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-300 text-xs uppercase tracking-[0.25em] font-bold mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All Orders
      </Link>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main column */}
        <div>
          {/* Order header card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-gold-400/15 bg-gradient-to-br from-[#0c0a07] to-[#050403] p-6 mb-5"
          >
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                <Hash className="w-3 h-3" /> {order.orderId}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${meta.color} ${meta.bg} ${meta.border}`}>
                {meta.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                {order.status}
              </span>
            </div>
            <h1 className="font-serif italic text-3xl sm:text-4xl font-black text-white mb-2" data-testid="order-detail-title">
              {order.projectName}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{order.description}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gold-400" /> {order.type}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gold-400" /> Created {formatTimestamp(order.createdAt)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gold-400" /> Updated {formatTimestamp(order.updatedAt)}</span>
            </div>
          </motion.div>

          {/* Chat thread */}
          <div className="rounded-3xl border border-gold-400/10 bg-[#0a0806] flex flex-col" style={{ height: '60vh', minHeight: 460 }}>
            <div className="px-6 py-4 border-b border-gold-400/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80 font-bold">Conversation</p>
                <p className="text-white text-sm font-bold">Code Liberate × {order.userName}</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-gold-400" /> Encrypted
              </span>
            </div>

            <div
              ref={scrollRef}
              data-testid="order-chat-thread"
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
            >
              {messages.length === 0 && (
                <p className="text-center text-gray-600 text-sm py-10">Loading conversation…</p>
              )}
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>

            <form onSubmit={handleSend} className="px-4 py-3 border-t border-gold-400/10 flex items-end gap-3">
              <button
                type="button"
                title="Attach (coming soon)"
                className="p-2.5 rounded-xl text-gray-500 hover:text-gold-400 hover:bg-white/5 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                data-testid="order-chat-input"
                placeholder="Type your reply…  (Enter to send · Shift+Enter for new line)"
                rows={1}
                className="flex-1 resize-none bg-transparent border border-white/5 focus:border-gold-400/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none max-h-32"
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending}
                data-testid="order-chat-send"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-400 text-black font-bold text-xs uppercase tracking-[0.18em] hover:bg-gold-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar — status tracker + meta */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-gold-400/15 bg-[#0a0806] p-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80 font-bold mb-4">Status Tracker</p>
            <ol className="space-y-3">
              {STATUS_TIMELINE.map((s, i) => {
                const done = i < statusIndex;
                const current = i === statusIndex;
                return (
                  <li key={s} className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                    ) : current ? (
                      <span className="w-5 h-5 rounded-full border-2 border-gold-400 bg-gold-400/30 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                      </span>
                    ) : (
                      <CircleDashed className="w-5 h-5 text-gray-700 shrink-0" />
                    )}
                    <span className={`text-sm font-semibold ${current ? 'text-gold-200' : done ? 'text-emerald-200/80' : 'text-gray-600'}`}>
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="rounded-3xl border border-gold-400/10 bg-[#0a0806] p-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80 font-bold mb-4">Client</p>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2 text-white"><UserIcon className="w-3.5 h-3.5 text-gold-400" /> {order.userName}</p>
              <p className="flex items-center gap-2 text-gray-400 break-all"><Mail className="w-3.5 h-3.5 text-gold-400" /> {order.userEmail}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gold-400/10 bg-[#0a0806] p-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80 font-bold mb-4">Attachments</p>
            {order.attachments && order.attachments.length > 0 ? (
              <ul className="space-y-2">
                {order.attachments.map((a) => (
                  <li key={a.url}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 text-xs font-semibold"
                    >
                      <Paperclip className="w-3.5 h-3.5" /> {a.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-xs">No attachments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: OrderMessage }) {
  if (message.senderType === 'system') {
    return (
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[11px] uppercase tracking-[0.25em] text-gray-500 font-bold">
          <ShieldCheck className="w-3 h-3 text-gold-400" />
          {message.text}
        </div>
      </div>
    );
  }
  const isClient = message.senderType === 'client';
  return (
    <div className={`flex gap-3 ${isClient ? 'justify-end' : 'justify-start'}`}>
      {!isClient && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center text-black font-black text-xs shrink-0">
          CL
        </div>
      )}
      <div className={`max-w-[75%] ${isClient ? 'text-right' : ''}`}>
        <p className={`text-[10px] uppercase tracking-[0.25em] font-bold mb-1 ${isClient ? 'text-gray-500' : 'text-gold-400/80'}`}>
          {isClient ? 'You' : message.senderName || 'Code Liberate'} · {formatTimestamp(message.createdAt)}
        </p>
        <div
          className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isClient
              ? 'bg-gold-400/15 border border-gold-400/30 text-gold-50 rounded-tr-sm'
              : 'bg-white/5 border border-white/5 text-gray-100 rounded-tl-sm'
          }`}
        >
          {message.text}
        </div>
      </div>
      {isClient && (
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white font-bold text-xs shrink-0">
          {(message.senderName || 'You').charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
