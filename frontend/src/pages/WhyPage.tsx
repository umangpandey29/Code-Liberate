import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHero, WhyUs, Numbers } from '../MarketingSite';

export default function WhyPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHero
        eyebrow="Why Code Liberate"
        title={<>The Agency That <span className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent">Actually Delivers</span></>}
        subtitle="We've helped 50+ Indian businesses get websites that work as hard as they do. Here's what makes us different."
      />
      <WhyUs bare />
      <Numbers onCTA={() => navigate('/contact')} bare />
    </>
  );
}
