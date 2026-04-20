/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Code Liberate marketing site - native React rebuild of the original
 * NexaWeb Studios page with identical section order, copy, and layout.
 * Only brand name, logo, email, and color palette have been changed.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Zap,
  Palette,
  ShieldCheck,
  Smartphone,
  Rocket,
  Star,
  MessageSquare,
  PenLine,
  Eye,
  Plane,
  Menu as MenuIcon,
  Mail,
  Sparkles,
} from 'lucide-react';

const BRAND_LOGO = '/logo.png';
const BRAND_EMAIL = 'codeliberate2029@gmail.com';

const PORTFOLIO_IMAGES = {
  aroma: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop',
  nexus: 'https://img.rocket.new/generatedImages/rocket_gen_img_11cc2132a-1771902525376.png',
  greenleaf: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d16df74c-1776141106893.png',
  finedge: 'https://img.rocket.new/generatedImages/rocket_gen_img_15348d823-1772860198256.png',
  medicare: 'https://img.rocket.new/generatedImages/rocket_gen_img_13aa9211e-1772148515180.png',
  spark: 'https://img.rocket.new/generatedImages/rocket_gen_img_137ddd9e4-1772074857584.png',
};

/* ------------------------------------------------------------------ */
/*  Small shared primitives                                            */
/* ------------------------------------------------------------------ */

const GoldButton = ({
  children,
  onClick,
  as = 'button',
  href,
  testid,
  variant = 'solid',
  full = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  testid?: string;
  variant?: 'solid' | 'ghost';
  full?: boolean;
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-sm uppercase tracking-[0.15em] transition-all active:scale-[0.98]';
  const solid =
    'bg-gold-400 text-black hover:bg-gold-300 shadow-[0_20px_40px_-10px_rgba(212,175,55,0.45)]';
  const ghost =
    'border border-gold-400/40 text-gold-300 hover:border-gold-400 hover:text-gold-200 hover:bg-gold-400/5';
  const cls = `${base} ${variant === 'solid' ? solid : ghost} ${full ? 'w-full' : ''}`;
  if (as === 'a' && href) {
    return (
      <a href={href} data-testid={testid} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} data-testid={testid} className={cls}>
      {children}
    </button>
  );
};

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-gold-400/80 mb-4">
    {children}
  </p>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-serif italic text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] max-w-4xl">
    {children}
  </h2>
);

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

const Navbar = ({ onOpenMenu, onPortalClick }: { onOpenMenu: () => void; onPortalClick: () => void }) => {
  return (
    <header
      data-testid="site-navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-gold-400/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
        <a
          href="#top"
          data-testid="navbar-brand"
          className="flex items-center gap-3 shrink-0"
        >
          <img src={BRAND_LOGO} alt="Code Liberate" className="w-10 h-10 object-contain shrink-0" />
          <div className="leading-tight hidden sm:block">
            <p className="text-white font-black text-sm uppercase tracking-[0.18em] whitespace-nowrap">Code Liberate</p>
            <p className="hidden xl:block text-gold-400/70 text-[8px] uppercase tracking-[0.28em] whitespace-nowrap">We build businesses</p>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] xl:text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-300 flex-1 justify-center min-w-0">
          <a href="#work" className="hover:text-gold-300 transition-colors whitespace-nowrap">Work</a>
          <a href="#why" className="hover:text-gold-300 transition-colors whitespace-nowrap">Why Us</a>
          <a href="#process" className="hover:text-gold-300 transition-colors whitespace-nowrap">Process</a>
          <a href="#pricing" className="hover:text-gold-300 transition-colors whitespace-nowrap">Pricing</a>
          <a href="#faq" className="hover:text-gold-300 transition-colors whitespace-nowrap">FAQ</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={`mailto:${BRAND_EMAIL}`}
            data-testid="navbar-email"
            className="hidden 2xl:inline-flex items-center gap-2 text-[11px] font-semibold text-gold-400/80 hover:text-gold-300 uppercase tracking-[0.18em] whitespace-nowrap"
          >
            <Mail className="w-4 h-4" />
            {BRAND_EMAIL}
          </a>
          <button
            onClick={onPortalClick}
            data-testid="navbar-portal-btn"
            className="hidden sm:inline-flex items-center gap-2 bg-gold-400 text-black font-bold text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 rounded-full hover:bg-gold-300 transition-colors whitespace-nowrap"
          >
            Client Portal
          </button>
          <button
            onClick={onOpenMenu}
            data-testid="navbar-menu-btn"
            aria-label="Open menu"
            className="p-2 rounded-full border border-white/10 text-white hover:text-gold-300 hover:border-gold-400/40 transition-colors shrink-0"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

const Hero = ({ onPrototypeClick }: { onPrototypeClick: () => void }) => {
  return (
    <section
      id="top"
      className="relative pt-36 pb-24 px-6 sm:px-10 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 luxury-gradient" />
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-gold-400/10 blur-[140px] rounded-full -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold-400/5 blur-[160px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold-400/20 bg-gold-400/5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gold-300">
              India's Premium Web Agency · Est. 2024
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-white leading-[0.95] mb-8"
          >
            We Don't Just Build
            <span className="block italic bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent">
              Websites.
            </span>
            We Build
            <span className="block italic bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent">
              Businesses.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mb-10"
          >
            From ₹4,999. Get a <span className="text-gold-300 font-bold">free prototype</span> before you pay a single rupee. Premium design that converts visitors into paying customers.
          </motion.p>

          <div className="flex flex-wrap gap-4 mb-12">
            <GoldButton testid="hero-cta-prototype" onClick={onPrototypeClick}>
              Get Free Prototype <ArrowRight className="w-4 h-4" />
            </GoldButton>
            <GoldButton variant="ghost" as="a" href="#work" testid="hero-cta-work">
              View Our Work
            </GoldButton>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {['A', 'R', 'S', 'K'].map((l, i) => (
                <div
                  key={l}
                  className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center font-black text-black text-sm"
                  style={{
                    background: `linear-gradient(135deg, #E1CB66 ${i * 15}%, #C5A028 100%)`,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-white font-semibold">Trusted by 50+ businesses</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400/70 font-bold mt-0.5">Starting ₹4,999</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="aspect-square rounded-[40px] border border-gold-400/20 bg-gradient-to-br from-[#141008] via-black to-[#0a0a0a] p-10 flex flex-col items-center justify-center shadow-[0_40px_80px_-20px_rgba(212,175,55,0.25)] gold-shadow"
          >
            <img
              src={BRAND_LOGO}
              alt="Code Liberate"
              className="w-48 h-48 object-contain filter drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]"
            />
            <p className="mt-6 text-[9px] uppercase tracking-[0.5em] text-gold-400/70 font-bold text-center">
              We don't just build website. We build businesses
            </p>
          </motion.div>

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-black/80 backdrop-blur-md border border-gold-400/20 rounded-full px-4 py-3">
            {[
              { icon: Zap, label: 'Speed' },
              { icon: Palette, label: 'Design' },
              { icon: ShieldCheck, label: 'Secure' },
              { icon: Smartphone, label: 'Mobile' },
              { icon: Rocket, label: 'Launch' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-2">
                <Icon className="w-4 h-4 text-gold-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Stats strip                                                        */
/* ------------------------------------------------------------------ */

const StatsStrip = () => {
  const items = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '96%', label: 'Client Retention' },
    { value: '₹4,999', label: 'Starting Price' },
    { value: '7 Days', label: 'Avg. Delivery' },
  ];
  return (
    <section className="px-6 sm:px-10 py-16 border-y border-gold-400/10 bg-[#080604]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {items.map((it) => (
          <div key={it.label}>
            <p className="font-serif italic text-4xl sm:text-5xl font-black bg-gradient-to-b from-gold-300 to-gold-600 bg-clip-text text-transparent mb-2">
              {it.value}
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">
              {it.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Portfolio                                                          */
/* ------------------------------------------------------------------ */

const Portfolio = () => {
  const projects = [
    { tag: 'Restaurant', title: 'Aroma Bites', result: '+240% online orders', img: PORTFOLIO_IMAGES.aroma },
    { tag: 'SaaS', title: 'Nexus SaaS', result: '3x sign-up rate', img: PORTFOLIO_IMAGES.nexus },
    { tag: 'E-commerce', title: 'GreenLeaf Organic', result: '+180% revenue', img: PORTFOLIO_IMAGES.greenleaf },
    { tag: 'Finance', title: 'FinEdge Capital', result: '500% lead growth', img: PORTFOLIO_IMAGES.finedge },
    { tag: 'Healthcare', title: 'MediCare Plus', result: '+320% bookings', img: PORTFOLIO_IMAGES.medicare },
    { tag: 'Agency', title: 'Spark Creative', result: '10x brand reach', img: PORTFOLIO_IMAGES.spark },
  ];

  return (
    <section id="work" className="px-6 sm:px-10 py-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
          <div>
            <SectionEyebrow>Our Work</SectionEyebrow>
            <SectionHeading>Projects That Deliver Results</SectionHeading>
          </div>
          <a href="#contact" className="text-gold-400 hover:text-gold-300 font-bold text-sm uppercase tracking-[0.25em] inline-flex items-center gap-2">
            View All Projects <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              data-testid={`portfolio-card-${i}`}
              className="group relative overflow-hidden rounded-3xl border border-gold-400/10 bg-[#0c0a07] hover:border-gold-400/40 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#141008]">
                <img
                  src={p.img}
                  alt={p.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = PORTFOLIO_IMAGES.nexus;
                  }}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80 font-bold mb-2">{p.tag}</p>
                <h3 className="text-2xl font-serif italic font-bold text-white mb-2">{p.title}</h3>
                <p className="text-gold-300 font-bold text-sm">{p.result}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Why Us                                                             */
/* ------------------------------------------------------------------ */

const WhyUs = () => {
  const features = [
    { icon: Sparkles, title: 'Free Prototype First', copy: 'See your website design before paying anything. Zero risk, total confidence.' },
    { icon: Zap, title: '7-Day Delivery', copy: 'Most projects live in under a week. No waiting months for your new website.' },
    { icon: Rocket, title: 'Conversion-Focused', copy: 'Every pixel is designed to turn visitors into customers, not just look pretty.' },
    { icon: Smartphone, title: 'Mobile-First Always', copy: '70% of your visitors use mobile. We design for them first, desktop second.' },
    { icon: ShieldCheck, title: 'SEO Built-In', copy: 'Rank on Google from day one. Technical SEO, schema markup, and speed optimization included.' },
    { icon: MessageSquare, title: 'Dedicated Support', copy: 'Direct WhatsApp access to your designer. Not a ticket system — a real person.' },
  ];

  return (
    <section id="why" className="px-6 sm:px-10 py-28 bg-[#060402]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <SectionEyebrow>Why Code Liberate</SectionEyebrow>
          <SectionHeading>The Agency That Actually Delivers</SectionHeading>
          <p className="text-gray-400 text-base mt-6 max-w-2xl">
            We've helped 50+ Indian businesses get websites that work as hard as they do.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="p-8 rounded-3xl border border-gold-400/10 bg-gradient-to-br from-[#0c0a07] to-[#050403] hover:border-gold-400/40 hover:translate-y-[-4px] transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-5">
                <f.icon className="w-5 h-5 text-gold-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Numbers block                                                      */
/* ------------------------------------------------------------------ */

const Numbers = ({ onCTA }: { onCTA: () => void }) => {
  return (
    <section className="px-6 sm:px-10 py-28">
      <div className="max-w-7xl mx-auto">
        <SectionEyebrow>By the numbers</SectionEyebrow>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-start">
          <div className="p-10 rounded-[36px] border border-gold-400/20 bg-gradient-to-br from-[#14100a] to-black">
            <p className="font-serif italic text-6xl md:text-7xl font-black bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent mb-4">
              ₹2Cr+
            </p>
            <p className="text-gray-300 max-w-md leading-relaxed">
              Combined additional revenue generated for our clients through conversion-optimized websites.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '50+', label: 'Projects Delivered', sub: 'Across 12 industries' },
              { value: '96%', label: 'Client Retention', sub: 'Come back for more' },
              { value: '₹4,999', label: 'Starting Price', sub: 'No hidden fees' },
              { value: '4.9★', label: 'Average Rating', sub: 'From 50+ reviews' },
            ].map((it) => (
              <div key={it.label} className="p-6 rounded-2xl border border-gold-400/10 bg-[#0a0806]">
                <p className="font-serif italic text-3xl font-black text-gold-300 mb-1">{it.value}</p>
                <p className="text-white font-bold text-xs uppercase tracking-widest">{it.label}</p>
                <p className="text-gray-500 text-xs mt-1">{it.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-[36px] border border-gold-400/30 bg-gradient-to-r from-gold-400/10 via-gold-400/5 to-transparent p-8 md:p-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-300 mb-2">🔥 Limited Slots Available</p>
            <p className="text-white text-xl md:text-2xl font-serif italic font-bold">We take only 5 new clients per month to ensure quality.</p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <GoldButton onClick={onCTA} testid="numbers-cta">
              Claim Your Free Prototype <ArrowRight className="w-4 h-4" />
            </GoldButton>
            <span className="text-xs text-gray-500">Free. No commitment.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Process                                                            */
/* ------------------------------------------------------------------ */

const Process = () => {
  const steps = [
    { day: 'Day 1', icon: MessageSquare, title: 'Tell Us Your Vision', copy: 'Fill out a quick form with your business details, goals, and design preferences. Takes 3 minutes.' },
    { day: 'Day 2–3', icon: Palette, title: 'Get Free Prototype', copy: 'Within 48 hours, we send you a fully designed mockup. No payment required at this stage.' },
    { day: 'Day 3–5', icon: PenLine, title: 'Review & Refine', copy: "Love it? Approve. Want changes? We refine until it's perfect. You pay only 25% after approval." },
    { day: 'Day 5–7', icon: Plane, title: 'Go Live', copy: "We build the full website, test everything, and launch. Final 75% payment after you're happy." },
  ];

  return (
    <section id="process" className="px-6 sm:px-10 py-28 bg-[#060402]">
      <div className="max-w-7xl mx-auto">
        <SectionEyebrow>How It Works</SectionEyebrow>
        <SectionHeading>From Idea to Live in 7 Days</SectionHeading>
        <p className="text-gray-400 mt-6 max-w-xl mb-14">No lengthy contracts. No upfront full payment. Just results.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((s, i) => (
            <div key={s.title} className="relative p-8 rounded-3xl border border-gold-400/10 bg-black hover:border-gold-400/40 transition-all">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/80 font-bold flex items-center gap-2 mb-5">
                <s.icon className="w-4 h-4" /> {s.day}
              </p>
              <p className="font-serif italic text-5xl font-black text-gold-400/20 absolute top-6 right-6">
                0{i + 1}
              </p>
              <p className="text-[10px] font-black text-gold-300 uppercase tracking-widest mb-2">Step {i + 1}</p>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.copy}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-center p-6 rounded-3xl border border-gold-400/10 bg-[#0a0806]">
          <div className="flex flex-col items-center">
            <p className="font-serif italic text-3xl font-black text-gold-300">₹0</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Upfront</p>
            <p className="text-xs text-gray-400 mt-1">Get prototype first</p>
          </div>
          <span className="text-gold-400/40 font-bold">then</span>
          <div className="flex flex-col items-center">
            <p className="font-serif italic text-3xl font-black text-gold-300">25%</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">After approval</p>
          </div>
          <span className="text-gold-400/40 font-bold">+</span>
          <div className="flex flex-col items-center">
            <p className="font-serif italic text-3xl font-black text-gold-300">75%</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">After delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

const Testimonials = () => {
  const quotes = [
    {
      text: 'We interviewed 4 agencies. Code Liberate was the only one who showed us a prototype before asking for money. The website they built increased our online orders by 240% in 3 months.',
      initial: 'P',
      name: 'Priya Sharma',
      role: 'Owner, Aroma Bites Restaurant · Mumbai',
      stats: [{ value: '+240%', label: 'Online Orders' }, { value: '5 Days', label: 'To Delivery' }],
    },
    {
      text: 'I was skeptical about a ₹4,999 website. But Code Liberate delivered something that looks like it cost ₹1 lakh. Our leads tripled in the first month.',
      initial: 'R',
      name: 'Rahul Mehta',
      role: 'Founder, GreenLeaf Organic',
      stats: [{ value: '3x leads', label: 'In first month' }],
    },
    {
      text: 'The 7-day delivery promise seemed impossible. They delivered in 5 days. The mobile experience is flawless — 70% of our bookings now come through mobile.',
      initial: 'K',
      name: 'Dr. Kavitha Nair',
      role: 'Director, MediCare Plus',
      stats: [{ value: '+320% bookings', label: 'On mobile' }],
    },
  ];

  return (
    <section className="px-6 sm:px-10 py-28">
      <div className="max-w-7xl mx-auto">
        <SectionEyebrow>Client Results</SectionEyebrow>
        <SectionHeading>Real Businesses, Real Results</SectionHeading>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="p-8 rounded-3xl border border-gold-400/10 bg-gradient-to-br from-[#0c0a07] to-black flex flex-col"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <blockquote className="text-gray-200 text-[15px] leading-relaxed italic mb-6 flex-1">
                "{q.text}"
              </blockquote>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center text-black font-black">
                  {q.initial}
                </div>
                <div>
                  <p className="text-white font-bold">{q.name}</p>
                  <p className="text-gray-500 text-xs">{q.role}</p>
                </div>
              </div>
              <div className="flex gap-6 pt-4 border-t border-gold-400/10">
                {q.stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-serif italic text-xl font-black text-gold-300">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{s.label}</p>
                  </div>
                ))}
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */

const Pricing = ({ onCTA }: { onCTA: () => void }) => {
  const tiers = [
    {
      name: 'Starter',
      sub: 'Perfect for first-time websites',
      price: '₹4,999',
      note: 'one-time',
      features: ['1–3 pages', 'Mobile responsive', 'Basic design', 'Contact form', '2 revisions', '7-day delivery'],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      sub: 'Most popular for growing businesses',
      price: '₹11,999',
      note: 'one-time',
      features: ['5–7 pages', 'Premium UI/UX design', 'Basic SEO setup', 'Google Analytics', 'Unlimited revisions', '5-day delivery', 'WhatsApp support'],
      cta: 'Get Free Prototype',
      popular: true,
    },
    {
      name: 'Premium',
      sub: 'Advanced for serious businesses',
      price: '₹24,999+',
      note: 'one-time',
      features: ['Unlimited pages', 'Advanced UI/UX', 'AI chatbot integration', 'Speed optimization', 'Priority support', '3-day delivery', 'SEO optimization'],
      cta: "Let's Talk",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="px-6 sm:px-10 py-28 bg-[#060402]">
      <div className="max-w-7xl mx-auto">
        <SectionEyebrow>Pricing</SectionEyebrow>
        <SectionHeading>Transparent Pricing, Zero Surprises</SectionHeading>
        <p className="text-gray-400 mt-6 max-w-xl mb-14">
          Free prototype before any payment. 25% upfront after approval.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              data-testid={`pricing-${t.name.toLowerCase()}`}
              className={`relative p-8 rounded-3xl border transition-all ${
                t.popular
                  ? 'border-gold-400/60 bg-gradient-to-br from-[#1c1507] to-[#0a0604] shadow-[0_40px_80px_-20px_rgba(212,175,55,0.3)] scale-[1.02]'
                  : 'border-gold-400/10 bg-[#0c0a07] hover:border-gold-400/30'
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-black text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{t.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{t.sub}</p>
              <div className="mb-8">
                <span className="font-serif italic text-5xl font-black text-white">{t.price}</span>
                <span className="text-gray-500 text-sm ml-2">{t.note}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gold-400/15 text-gold-300 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <GoldButton onClick={onCTA} variant={t.popular ? 'solid' : 'ghost'} full testid={`pricing-cta-${t.name.toLowerCase()}`}>
                {t.cta}
              </GoldButton>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#contact" className="text-gold-400 hover:text-gold-300 font-semibold text-sm uppercase tracking-[0.25em] inline-flex items-center gap-2">
            View full pricing & add-ons <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const FAQ = () => {
  const faqs = [
    { q: 'Do I really get a free prototype before paying?', a: 'Yes, 100%. We design a full mockup of your website homepage — no payment required. You only pay after you approve the design and decide to move forward.' },
    { q: 'How long does it take to build my website?', a: "Most websites are delivered within 5–7 days. Complex projects may take up to 14 days. We'll give you an exact timeline before starting." },
    { q: "What if I don't like the design?", a: "We offer unlimited revisions until you're 100% happy. Our Professional and Premium plans include unlimited revisions. Starter includes 2 rounds." },
    { q: 'Do you handle hosting and domain?', a: 'Yes! Hosting is available for ₹999/year and domain registration for ₹499/year. We handle everything — you just manage your business.' },
    { q: 'Will my website work on mobile?', a: 'Every website we build is mobile-first. We design for mobile screens first, then adapt for desktop. 70% of your visitors will be on mobile.' },
    { q: 'What happens after the website is delivered?', a: 'You get 30 days of free support after delivery. We fix any bugs, make minor content updates, and ensure everything runs smoothly.' },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 sm:px-10 py-28">
      <div className="max-w-4xl mx-auto">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <SectionHeading>Questions We Get All The Time</SectionHeading>

        <div className="mt-14 space-y-3">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className={`border rounded-3xl overflow-hidden transition-all ${
                open === i ? 'border-gold-400/40 bg-[#0c0a07]' : 'border-gold-400/10 bg-[#08060490]'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                data-testid={`faq-${i}`}
                className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
              >
                <span className="text-white font-bold text-base md:text-lg">{f.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gold-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

const ContactForm = ({ onSubmit }: { onSubmit: (data: any) => Promise<void> }) => {
  const [form, setForm] = useState({ name: '', email: '', business: '', style: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setSent(true);
      setForm({ name: '', email: '', business: '', style: '' });
    } catch (err) {
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="px-6 sm:px-10 py-28 bg-[#060402]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <SectionEyebrow>Start Today</SectionEyebrow>
          <h2 className="font-serif italic text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
            Get Your Free <span className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-transparent">Website Prototype</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6">
            No payment. No commitment. Just a beautiful design of your future website — delivered in 48 hours.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 mb-12 text-xs uppercase tracking-[0.25em] font-bold">
          <span className="text-gold-300 flex items-center gap-2"><Check className="w-4 h-4" /> Free prototype in 48 hours</span>
          <span className="text-gold-300 flex items-center gap-2"><Check className="w-4 h-4" /> No payment until you approve</span>
          <span className="text-gold-300 flex items-center gap-2"><Check className="w-4 h-4" /> 5 slots remaining this month</span>
        </div>

        <div className="rounded-[36px] border border-gold-400/20 bg-gradient-to-br from-[#0c0a07] to-black p-8 md:p-10">
          <p className="text-xs text-gray-500 mb-6 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
            🔒 We collect your details only to contact you regarding your website project. We never share your information.
          </p>

          {sent ? (
            <div data-testid="contact-success" className="text-center py-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold-400/15 flex items-center justify-center mb-5">
                <Check className="w-8 h-8 text-gold-300" />
              </div>
              <h3 className="text-2xl font-serif italic font-bold text-white mb-2">Request received!</h3>
              <p className="text-gray-400 text-sm">We'll email you at your address within 48 hours with your free prototype.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold-400/80">Your Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="contact-name"
                  className="bg-black/50 border border-gold-400/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/60"
                  placeholder="Jane Doe"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold-400/80">Business Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="contact-email"
                  className="bg-black/50 border border-gold-400/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/60"
                  placeholder="you@business.com"
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold-400/80">Business Name</span>
                <input
                  required
                  value={form.business}
                  onChange={(e) => setForm({ ...form, business: e.target.value })}
                  data-testid="contact-business"
                  className="bg-black/50 border border-gold-400/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/60"
                  placeholder="Your Business Ltd."
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold-400/80">Preferred Design Style</span>
                <select
                  required
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value })}
                  data-testid="contact-style"
                  className="bg-black/50 border border-gold-400/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/60"
                >
                  <option value="" className="bg-black">Select a style</option>
                  <option value="Minimal & Clean" className="bg-black">Minimal & Clean</option>
                  <option value="Bold & Modern" className="bg-black">Bold & Modern</option>
                  <option value="Elegant & Premium" className="bg-black">Elegant & Premium</option>
                  <option value="Playful & Creative" className="bg-black">Playful & Creative</option>
                </select>
              </label>
              <div className="md:col-span-2 flex flex-col items-center gap-3 mt-4">
                <GoldButton testid="contact-submit" full>
                  {loading ? 'Sending…' : 'Request Free Prototype →'}
                </GoldButton>
                <span className="text-xs text-gray-500">Free. No commitment. Limited slots.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

const Footer = () => (
  <footer className="px-6 sm:px-10 pt-20 pb-10 border-t border-gold-400/10 bg-black">
    <div className="max-w-7xl mx-auto grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <img src={BRAND_LOGO} alt="Code Liberate" className="w-10 h-10 object-contain" />
          <div>
            <p className="text-white font-black uppercase tracking-[0.2em] text-sm">Code Liberate</p>
            <p className="text-gold-400/70 text-[8px] uppercase tracking-[0.3em]">We build businesses</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-5">
          India's premium web agency. Free prototype first. Transparent pricing. 7-day delivery.
        </p>
        <a
          href={`mailto:${BRAND_EMAIL}`}
          data-testid="footer-email"
          className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 text-sm font-semibold"
        >
          <Mail className="w-4 h-4" /> {BRAND_EMAIL}
        </a>
      </div>
      {[
        { title: 'Company', links: ['About', 'Our Work', 'Process', 'Contact'] },
        { title: 'Services', links: ['Web Design', 'Web Development', 'SEO', 'Hosting'] },
        { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Refund Policy'] },
      ].map((col) => (
        <div key={col.title}>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-400/80 mb-4">{col.title}</p>
          <ul className="space-y-2">
            {col.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-gray-400 hover:text-gold-300 text-sm transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gold-400/10 flex flex-wrap justify-between items-center gap-4 text-xs text-gray-500">
      <p>© {new Date().getFullYear()} Code Liberate. All rights reserved.</p>
      <p>Crafted with gold-standard care · Est. 2024</p>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export default function MarketingSite({
  onOpenMenu,
  onOpenPortal,
  onLeadSubmit,
}: {
  onOpenMenu: () => void;
  onOpenPortal: () => void;
  onLeadSubmit: (lead: { name: string; email: string; business: string; style: string }) => Promise<void>;
}) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar onOpenMenu={onOpenMenu} onPortalClick={onOpenPortal} />
      <Hero onPrototypeClick={scrollToContact} />
      <StatsStrip />
      <Portfolio />
      <WhyUs />
      <Numbers onCTA={scrollToContact} />
      <Process />
      <Testimonials />
      <Pricing onCTA={scrollToContact} />
      <FAQ />
      <ContactForm onSubmit={onLeadSubmit} />
      <Footer />
    </div>
  );
}
