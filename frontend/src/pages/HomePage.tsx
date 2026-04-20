import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Rocket, Smartphone, ShieldCheck, Star } from 'lucide-react';
import { Hero, StatsStrip, GoldButton, SectionEyebrow } from '../MarketingSite';

/**
 * Home page — a condensed overview that teases every other section with
 * a CTA to the dedicated page. Preserves the hero + stats strip intact.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const teasers = [
    { to: '/work', eyebrow: 'Our Work', title: 'Projects That Deliver Results', copy: '50+ Indian businesses launched. See case studies, results, and industries we serve.', icon: Rocket },
    { to: '/why', eyebrow: 'Why Code Liberate', title: 'The Agency That Actually Delivers', copy: 'Free prototype first. 7-day delivery. Mobile-first, SEO built-in, dedicated support.', icon: Sparkles },
    { to: '/process', eyebrow: 'How It Works', title: 'From Idea to Live in 7 Days', copy: 'Tell us your vision, get a free prototype, review & refine, go live. No lengthy contracts.', icon: Zap },
    { to: '/pricing', eyebrow: 'Pricing', title: 'Transparent Pricing, Zero Surprises', copy: 'Starter ₹4,999 · Professional ₹11,999 · Premium ₹24,999+. Free prototype before any payment.', icon: ShieldCheck },
    { to: '/faq', eyebrow: 'FAQ', title: 'Questions We Get All The Time', copy: 'Prototype before paying? Yes. Timeline? 5–7 days. Revisions? Unlimited on Professional+.', icon: Smartphone },
    { to: '/contact', eyebrow: 'Start Today', title: 'Get Your Free Website Prototype', copy: 'No payment, no commitment. Beautiful design of your future website delivered in 48 hours.', icon: Star },
  ];

  return (
    <>
      <Hero onPrototypeClick={() => navigate('/contact')} />
      <StatsStrip />

      <section className="px-6 sm:px-10 py-28">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <SectionEyebrow>Explore</SectionEyebrow>
            <h2 className="font-serif italic text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05]">
              Everything You Need to Grow
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teasers.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                data-testid={`home-teaser-${t.to.replace('/', '')}`}
                className="group relative p-8 rounded-3xl border border-gold-400/10 bg-gradient-to-br from-[#0c0a07] to-[#050403] hover:border-gold-400/40 hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-5">
                  <t.icon className="w-5 h-5 text-gold-400" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-400/80 mb-2">{t.eyebrow}</p>
                <h3 className="text-xl font-bold text-white mb-3">{t.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">{t.copy}</p>
                <p className="mt-6 inline-flex items-center gap-2 text-gold-300 font-bold text-xs uppercase tracking-[0.25em] group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 py-20">
        <div className="max-w-5xl mx-auto rounded-[36px] border border-gold-400/30 bg-gradient-to-r from-gold-400/10 via-gold-400/5 to-transparent p-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-300 mb-2">🔥 Limited Slots Available</p>
            <p className="text-white text-xl md:text-2xl font-serif italic font-bold">We take only 5 new clients per month to ensure quality.</p>
          </div>
          <GoldButton onClick={() => navigate('/contact')} testid="home-final-cta">
            Claim Your Free Prototype <ArrowRight className="w-4 h-4" />
          </GoldButton>
        </div>
      </section>
    </>
  );
}
