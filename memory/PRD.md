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
