import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, Process, GoldButton } from '../MarketingSite';

export default function ProcessPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title={<>From Idea to Live in <span className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent">7 Days</span></>}
        subtitle="No lengthy contracts. No upfront full payment. Just results."
      />
      <Process bare />
      <section className="px-6 sm:px-10 pb-24 text-center">
        <GoldButton onClick={() => navigate('/contact')} testid="process-page-cta">
          Start Day 1 Today <ArrowRight className="w-4 h-4" />
        </GoldButton>
      </section>
    </>
  );
}
