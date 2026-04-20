import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, FAQ, GoldButton } from '../MarketingSite';

export default function FAQPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={<>Questions We Get <span className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent">All The Time</span></>}
        subtitle="Everything you want to know before you book your free prototype."
      />
      <FAQ bare />
      <section className="px-6 sm:px-10 pb-24 text-center">
        <p className="text-gray-400 mb-6 text-sm">Still have questions?</p>
        <GoldButton onClick={() => navigate('/contact')} testid="faq-page-cta">
          Talk to us <ArrowRight className="w-4 h-4" />
        </GoldButton>
      </section>
    </>
  );
}
