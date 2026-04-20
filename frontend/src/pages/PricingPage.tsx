import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHero, Pricing, FAQ } from '../MarketingSite';

export default function PricingPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={<>Transparent Pricing, <span className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent">Zero Surprises</span></>}
        subtitle="Free prototype before any payment. 25% upfront after approval, 75% after delivery."
      />
      <Pricing onCTA={() => navigate('/contact')} bare />
      <FAQ />
    </>
  );
}
