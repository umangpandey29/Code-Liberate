/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Firestore helpers + types for the Orders dashboard.
 *
 * Data model:
 *   orders/{orderId}                  → Order document (one per prototype/service request)
 *     ├── userId, userName, userEmail
 *     ├── projectName, type, description
 *     ├── status, attachments[]
 *     ├── createdAt, updatedAt
 *     ├── lastTeamMessageAt          → set whenever a team member replies
 *     └── lastClientReadAt           → set whenever the user opens this order
 *
 *   orders/{orderId}/messages/{messageId}
 *     ├── senderType: 'client' | 'team' | 'system'
 *     ├── senderName, senderEmail
 *     ├── text
 *     ├── attachments[]
 *     └── createdAt
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

export type OrderStatus = 'Pending' | 'In Review' | 'Accepted' | 'Completed';

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  projectName: string;
  type: string;
  description: string;
  status: OrderStatus;
  attachments?: { name: string; url: string }[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  lastTeamMessageAt?: Timestamp | null;
  lastClientReadAt?: Timestamp | null;
}

export interface OrderMessage {
  id: string;
  senderType: 'client' | 'team' | 'system';
  senderName: string;
  senderEmail?: string;
  text: string;
  attachments?: { name: string; url: string }[];
  createdAt: Timestamp | null;
}

export const STATUS_META: Record<OrderStatus, { color: string; bg: string; border: string; pulse: boolean }> = {
  Pending:     { color: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   pulse: true },
  'In Review': { color: 'text-blue-300',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    pulse: true },
  Accepted:    { color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', pulse: false },
  Completed:   { color: 'text-gold-300',    bg: 'bg-gold-400/10',    border: 'border-gold-400/30',    pulse: false },
};

/** Generate a short human-readable order id e.g. ORD-A4F2 */
export function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `ORD-${s}`;
}

/** Create a new order + seed a system message + a client message containing the request body. */
export async function createOrder(input: {
  userId: string;
  userName: string;
  userEmail: string;
  projectName: string;
  type: string;
  description: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), {
    orderId: generateOrderId(),
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    projectName: input.projectName,
    type: input.type,
    description: input.description,
    status: 'Pending' as OrderStatus,
    attachments: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastTeamMessageAt: null,
    lastClientReadAt: serverTimestamp(),
  });

  // Seed initial conversation: system intro + client's original message
  const messagesCol = collection(db, 'orders', ref.id, 'messages');
  await addDoc(messagesCol, {
    senderType: 'system',
    senderName: 'Code Liberate',
    text: 'Your request has been received. A team member will respond within 24 hours.',
    createdAt: serverTimestamp(),
  });
  await addDoc(messagesCol, {
    senderType: 'client',
    senderName: input.userName,
    senderEmail: input.userEmail,
    text: input.description,
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

/** Subscribe to all orders owned by a user, ordered newest-first. */
export function subscribeUserOrders(
  userId: string,
  callback: (orders: Order[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const list: Order[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
    callback(list);
  });
}

/** Subscribe to messages for one order in chronological order. */
export function subscribeOrderMessages(
  orderDocId: string,
  callback: (messages: OrderMessage[]) => void
): Unsubscribe {
  const q = query(collection(db, 'orders', orderDocId, 'messages'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const list: OrderMessage[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<OrderMessage, 'id'>) }));
    callback(list);
  });
}

/** Append a client message to an order. */
export async function sendClientMessage(
  orderDocId: string,
  senderName: string,
  senderEmail: string,
  text: string
) {
  await addDoc(collection(db, 'orders', orderDocId, 'messages'), {
    senderType: 'client',
    senderName,
    senderEmail,
    text,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'orders', orderDocId), {
    updatedAt: serverTimestamp(),
  });
}

/** Mark this order as read by the client (clears the unread badge). */
export async function markOrderRead(orderDocId: string) {
  try {
    await updateDoc(doc(db, 'orders', orderDocId), {
      lastClientReadAt: serverTimestamp(),
    });
  } catch {
    // Non-fatal — read state is a UX nicety, not a correctness requirement.
  }
}

/** Compute unread state from order timestamps without an extra query. */
export function hasUnread(order: Order): boolean {
  if (!order.lastTeamMessageAt) return false;
  if (!order.lastClientReadAt) return true;
  const team = order.lastTeamMessageAt.toMillis?.() ?? 0;
  const read = order.lastClientReadAt.toMillis?.() ?? 0;
  return team > read;
}

/** Format a Firestore Timestamp into a short relative-ish string. */
export function formatTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts || !ts.toDate) return '—';
  const d = ts.toDate();
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export { setDoc };
