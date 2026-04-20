import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHero, Portfolio, Testimonials, StatsStrip, GoldButton } from '../MarketingSite';
import { ArrowRight } from 'lucide-react';

export default function WorkPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title={<>Projects That <span className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent">Deliver Results</span></>}
        subtitle="50+ Indian businesses across 12 industries. Here are some of the brands we've launched, scaled, and helped generate ₹2Cr+ in combined additional revenue."
      />
      <StatsStrip />
      <Portfolio bare />
      <Testimonials bare />
      <section className="px-6 sm:px-10 pb-24 text-center">
        <div className="max-w-2xl mx-auto">
          <GoldButton onClick={() => navigate('/contact')} testid="work-page-cta">
            Start Your Project <ArrowRight className="w-4 h-4" />
          </GoldButton>
        </div>
      </section>
    </>
  );
}
