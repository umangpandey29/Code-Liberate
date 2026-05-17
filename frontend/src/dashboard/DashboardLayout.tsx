import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  ClipboardList,
  Bell,
  ArrowLeft,
  LogOut,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { BRAND_LOGO, BRAND_EMAIL } from '../MarketingSite';
import { Order, hasUnread, subscribeUserOrders } from '../lib/orders';

interface Props {
  user: User;
  onSignOut: () => void;
  onOpenRequestModal: () => void;
}

export default function DashboardLayout({ user, onSignOut, onOpenRequestModal }: Props) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const unsub = subscribeUserOrders(user.uid, setOrders);
    return () => unsub();
  }, [user.uid]);

  const unreadCount = orders.filter(hasUnread).length;

  const NavItem = ({
    to,
    icon: Icon,
    label,
    badge,
    end = false,
  }: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: number;
    end?: boolean;
  }) => (
    <NavLink
      to={to}
      end={end}
      data-testid={`sidebar-nav-${label.toLowerCase().replace(' ', '-')}`}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? 'bg-gold-400/10 text-gold-200 border border-gold-400/30'
            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && badge !== undefined && badge > 0 && (
        <span
          data-testid="sidebar-unread-badge"
          className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gold-400 text-black text-[10px] font-black"
        >
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* Sidebar */}
      <aside
        data-testid="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#070605] border-r border-gold-400/10 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand */}
        <div className="px-5 py-6 border-b border-gold-400/10 flex items-center gap-3">
          <img src={BRAND_LOGO} alt="Code Liberate" className="w-9 h-9 object-contain shrink-0" />
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-white font-black text-xs uppercase tracking-[0.18em] whitespace-nowrap">Code Liberate</p>
              <p className="text-gold-400/70 text-[8px] uppercase tracking-[0.25em] whitespace-nowrap">Client Dashboard</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <NavItem to="/dashboard/orders" icon={ClipboardList} label="Orders" badge={unreadCount} end />
          <NavItem to="/dashboard/activity" icon={Bell} label="Activity" badge={unreadCount} />
          <NavItem to="/dashboard/profile" icon={UserIcon} label="Profile" />

          <div className="pt-4 mt-4 border-t border-gold-400/10">
            <button
              onClick={onOpenRequestModal}
              data-testid="sidebar-new-request-btn"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-400 text-black font-bold text-xs uppercase tracking-[0.18em] hover:bg-gold-300 transition-colors"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              {!collapsed && <span>New Request</span>}
            </button>
          </div>
        </nav>

        {/* User block + Back to site */}
        <div className="p-3 border-t border-gold-400/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            data-testid="sidebar-back-site"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-gold-300 hover:bg-white/5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Back to Site</span>}
          </button>

          <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5 ${collapsed ? 'justify-center' : ''}`}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center text-black font-black text-sm">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-bold truncate">{user.displayName || 'Client'}</p>
                <p className="text-gray-500 text-[10px] truncate">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={onSignOut}
                data-testid="sidebar-signout-btn"
                title="Sign out"
                className="text-gray-500 hover:text-red-400 transition-colors p-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-[9px] uppercase tracking-[0.3em] text-gray-600 hover:text-gold-400 transition-colors py-2"
          >
            {collapsed ? '»' : '« Collapse'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <Outlet context={{ user, orders, unreadCount }} />
      </main>
    </div>
  );
}

/** Helper so child pages can pull dashboard context without re-querying Firestore. */
export interface DashboardContext {
  user: User;
  orders: Order[];
  unreadCount: number;
}
