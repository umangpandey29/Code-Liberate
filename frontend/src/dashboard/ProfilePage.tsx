import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Hash, Calendar } from 'lucide-react';
import { DashboardContext } from './DashboardLayout';
import { BRAND_EMAIL } from '../MarketingSite';

export default function ProfilePage() {
  const { user } = useOutletContext<DashboardContext>();

  return (
    <div className="px-6 sm:px-10 py-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-400/80 mb-2">Account</p>
        <h1 className="font-serif italic text-4xl sm:text-5xl font-black text-white">Profile</h1>
      </div>

      <div className="rounded-3xl border border-gold-400/15 bg-gradient-to-br from-[#0c0a07] to-[#050403] p-8">
        <div className="flex items-center gap-5 mb-8">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-20 h-20 rounded-full border-2 border-gold-400/30" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center text-black font-black text-2xl">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white">{user.displayName || 'Client'}</h2>
            <p className="text-gray-400 text-sm break-all">{user.email}</p>
          </div>
        </div>

        <dl className="space-y-4">
          <Row icon={Hash} label="User ID" value={user.uid} mono />
          <Row icon={Mail} label="Email" value={user.email || '—'} />
          <Row icon={Calendar} label="Last sign-in" value={user.metadata.lastSignInTime || '—'} />
          <Row icon={Calendar} label="Account created" value={user.metadata.creationTime || '—'} />
        </dl>

        <div className="mt-8 pt-6 border-t border-gold-400/10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80 font-bold mb-2">Need help?</p>
          <a href={`mailto:${BRAND_EMAIL}`} className="text-gold-300 hover:text-gold-200 text-sm font-semibold inline-flex items-center gap-2">
            <Mail className="w-4 h-4" /> {BRAND_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, mono }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <Icon className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <dt className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-1">{label}</dt>
        <dd className={`text-sm text-white break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
      </div>
    </div>
  );
}
