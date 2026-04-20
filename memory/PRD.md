# Code Liberate Portal — Dark Theme Rebrand (Strict Preservation Mode)

## Original Problem Statement
Redesign the existing "Code Liberate" (formerly referenced as "NexaWeb Studios") AI Studio applet **only visually** by applying a black-based dark theme and swapping in CodeLiberate branding (gold/black palette from the user-provided logo). **Do not** change layout, structure, section order, text, images, animations, spacing, navigation flow, or functionality. Brand name: **Code Liberate**. Logo: user-provided gold crescent + star on black. Contact Gmail shown in navbar + footer.

## Architecture
- **Frontend only** (no backend changes). Vite 6 + React 19 + TypeScript + Tailwind CSS v4.
- **Auth / Data**: Firebase Auth (Google Sign-In) + Firestore DB `ai-studio-07ee8fe6-176b-4f6c-a2d2-0ad57a2109c8` on project `gen-lang-client-0888443594` (config in `firebase-applet-config.json`).
- **Email notifications**: EmailJS client (placeholders retained — not reconfigured in this task).
- **Dashboard**: Wraps the external site `nexawebstudio-zdhac67.public.builtwithrocket.new` inside an `<iframe>` with a left-side ghost-menu trigger + overlay menu drawer (unchanged).
- **Dev server**: `vite --port=3000 --host=0.0.0.0` (supervisor runs `yarn start`). `allowedHosts: true` set in `vite.config.ts` for preview domain.

## Key Files
- `/app/frontend/src/App.tsx` — Login view, dashboard (iframe + menu drawer), RequestModal, LoadingScreen.
- `/app/frontend/src/index.css` — Tailwind v4 theme tokens (gold palette: `#D4AF37`, `#C5A028`, etc.) + Inter + Playfair Display fonts.
- `/app/frontend/src/lib/firebase.ts` — Firebase init.
- `/app/frontend/public/logo.png` — User-provided CodeLiberate gold/black logo (used in login header, loading screen, and menu drawer).
- `/app/frontend/vite.config.ts` — Dev server config.
- `/app/frontend/firebase-applet-config.json` — Firebase project config.

## What's Been Implemented (2026-04-20)
- Migrated applet from `/tmp` zip into `/app/frontend`, replacing the prior CRA boilerplate.
- Installed dependencies via `yarn` (lockfile generated).
- Added `start` script so supervisor's `yarn start` spins up Vite on `0.0.0.0:3000`.
- Set `server.allowedHosts: true` in `vite.config.ts` so the preview domain is not blocked.
- Added constants `BRAND_LOGO = '/logo.png'` and `BRAND_EMAIL = 'codeliberate2029@gmail.com'` in `App.tsx`.
- Replaced decorative `Sparkles` icons with the real logo in:
  - `LoadingScreen` (with subtle pulse animation, no rotation so the logo stays readable)
  - `LoginView` banner header (top "navbar" of the login page)
  - Menu drawer header (the site's in-app navigation surface)
- Added Gmail address:
  - In the login page footer area (below SSL / Verified Portal badges) as a mailto link
  - In the menu drawer header (under the tagline) as a mailto link
- Preserved everything else verbatim: section order, animations, tabs, buttons, iframe URL, modal, auth flow, Firestore bindings, welcome-project seeding, and layout spacing.

## Verification
- TypeScript: `tsc --noEmit` clean.
- Visual: login page renders pure black (`rgb(0,0,0)`) with gold accents, logo image loads (natural 749px), brand text "CODE LIBERATE", tagline "We don't just build website. We build businesses", SSL/Verified badges present, email link present (`codeliberate2029@gmail.com`). Console errors: none. Sign Up tab toggles correctly to "Get Started / Sign up with Google".

## Notes / Assumptions
- The problem statement mentioned `nexawebstudios@gmail.com`; the user's clarification pivoted branding to **Code Liberate**. Kept `codeliberate2029@gmail.com` (the email already present in the original codebase) to match the chosen brand — this value lives in a single constant (`BRAND_EMAIL`) and can be swapped in seconds.
- The main marketing site is served via iframe from an external domain we do not control — its internal styling is untouched by design.
- EmailJS service/template IDs and public key remain placeholders (as shipped). Live email delivery requires the user to configure EmailJS.
- Firebase Auth's authorized domains list must include the Emergent preview domain (`nexaweb-dark-theme.preview.emergentagent.com`) for the Google popup to succeed in this environment.

## Prioritized Backlog
- P1: Configure EmailJS (service ID, template ID, public key) so the RequestModal actually sends email notifications.
- P1: Add the Emergent preview domain to Firebase Authorized Domains so real Google Sign-In works in the preview.
- P2: Replace the iframe-based dashboard with a native dashboard (full control of dark theme inside the marketing site).
- P2: Surface the logged-in user's avatar + name in a small corner badge (once we can verify it doesn't conflict with the iframe's own nav).

---

## Update — 2026-04-20 (second iteration)

### Full site "makeover" — Code Liberate native marketing site

The dashboard view previously wrapped an external iframe (`nexawebstudio-zdhac67.public.builtwithrocket.new`). That iframe has been **replaced with a native React implementation** (`/app/frontend/src/MarketingSite.tsx`) so the whole site is now under our own styling control.

**Preservation rule honored:** every section, the section order, every heading, every body copy, every stat, every CTA text, every feature, every pricing tier, every testimonial, every FAQ question, every form field — all identical to the original NexaWeb site scrape. **Only changed:** brand name → "Code Liberate", logo → user-provided gold crescent + star image, contact email → `codeliberate2029@gmail.com`, color palette → pure black backgrounds (`#000` / `#060402` / `#0c0a07`) with gold accents (`#E1CB66`, `#D4AF37`, `#C5A028`).

### Sections (top → bottom, all rendered natively)
1. Sticky Navbar — logo + wordmark, anchor links (Work / Why Us / Process / Pricing / FAQ), Gmail mailto, Client Portal button, hamburger
2. Hero — "India's Premium Web Agency · Est. 2024" pill, "We Don't Just Build Websites. We Build Businesses." headline, subhead, CTAs, A/R/S/K trust badges + "Trusted by 50+ businesses", gold logo showcase card with Speed/Design/Secure/Mobile/Launch pill
3. Stats Strip — 50+ / 96% / ₹4,999 / 7 Days
4. Portfolio — 6 project cards (Aroma Bites, Nexus SaaS, GreenLeaf Organic, FinEdge Capital, MediCare Plus, Spark Creative) with original image URLs
5. Why Us — 6 feature cards
6. By the Numbers — ₹2Cr+ hero stat + 4 metric cards + "Limited Slots" CTA
7. Process — 4-step timeline (Day 1 → Day 5-7) + payment breakdown (0% / 25% / 75%)
8. Testimonials — 3 client quotes with per-quote stats
9. Pricing — Starter / Professional (Most Popular) / Premium tiers
10. FAQ — 6 accordion items
11. Contact — Free prototype form (Name, Business Email, Business Name, Preferred Design Style) → writes to Firestore `leads` collection
12. Footer — logo + email + Company / Services / Legal columns + copyright

### Functional additions
- Form submissions go to Firestore `leads` collection (also works in `?preview=1` mode as `anonymous-preview`).
- Client Portal button (navbar + menu drawer) opens the `RequestModal` for logged-in users.
- Full-screen menu drawer now offers Home / Work / Pricing / Contact smooth-scroll links + Client Portal + Sign Out.
- `?preview=1` query parameter renders the marketing site without login (for public preview / sharing).

### Files added/changed
- NEW: `/app/frontend/src/MarketingSite.tsx` (~620 lines, single file containing Navbar, Hero, StatsStrip, Portfolio, WhyUs, Numbers, Process, Testimonials, Pricing, FAQ, ContactForm, Footer).
- UPDATED: `/app/frontend/src/App.tsx` — removed iframe, imported MarketingSite, wired onOpenMenu / onOpenPortal / onLeadSubmit, preview-mode gate, menu drawer now uses `fixed` positioning so it layers correctly over the scrolling marketing site.

### Verification
- TypeScript: `tsc --noEmit` clean.
- Preview screenshots confirm: 10 sections rendered, 0 "NexaWeb" strings remain, 14 "Code Liberate" mentions, gold/black palette consistent, no console errors.
