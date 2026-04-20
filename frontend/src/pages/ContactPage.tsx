import React from 'react';
import { PageHero, ContactForm } from '../MarketingSite';

export default function ContactPage({
  onLeadSubmit,
}: {
  onLeadSubmit: (lead: { name: string; email: string; business: string; style: string }) => Promise<void>;
}) {
  return (
    <>
      <PageHero
        eyebrow="Start Today"
        title={<>Get Your Free <span className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent">Website Prototype</span></>}
        subtitle="No payment. No commitment. Just a beautiful design of your future website — delivered in 48 hours."
      />
      <ContactForm onSubmit={onLeadSubmit} bare />
    </>
  );
}
