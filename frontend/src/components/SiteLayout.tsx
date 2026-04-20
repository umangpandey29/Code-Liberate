import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../MarketingSite';

export default function SiteLayout({
  onOpenMenu,
  onOpenPortal,
}: {
  onOpenMenu: () => void;
  onOpenPortal: () => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <Navbar onOpenMenu={onOpenMenu} onPortalClick={onOpenPortal} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
