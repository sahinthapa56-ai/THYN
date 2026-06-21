# THYN — Master Product Plan

## Product Overview

**Mission:** Never Forget a Relationship Again.
**Product:** Relationship Memory System for LinkedIn
**Stack:** Next.js 15 + Fastify + Supabase + Chrome Extension MV3

---

## Phase 1 — Design System & Brand Identity

### Color Palette (Updated)
| Token | Hex |
|-------|-----|
| Primary | `#6D5DFC` |
| Secondary | `#8B7FFF` |
| Accent | `#A78BFA` |
| Background | `#0A0A0A` |
| Surface | `#111111` |
| Text | `#FFFFFF` |
| Muted | `#A1A1AA` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |

### Typography
- **Display:** Syne (700, 800) — headings/brand
- **Serif:** Instrument Serif — hero titles
- **Sans:** Inter (300-700) — body text

### Components to Build
- Navigation (sticky, glass-blur)
- Footer
- Hero section
- Feature card
- Pricing card
- FAQ accordion
- Screenshot showcase
- CTAs (primary/secondary)
- Badge
- Testimonial card
- Stats/metrics display

---

## Phase 2 — Marketing Website

Routes to build:
| Route | Priority | Description |
|-------|----------|-------------|
| `/` | P0 | Conversion-optimized landing page |
| `/features` | P0 | Detailed feature breakdown |
| `/pricing` | P0 | Plans, toggle, comparison, FAQ |
| `/privacy` | P1 | Chrome Web Store compliant |
| `/terms` | P1 | SaaS terms of service |
| `/changelog` | P2 | Product updates |
| `/contact` | P2 | Support contact form |

### Landing Page Sections
1. **Hero** — "Remember Every Important Relationship"
2. **Social Proof** — metrics, testimonials
3. **Problem** — forgotten connections, missed follow-ups
4. **Solution** — THYN sidebar on LinkedIn
5. **How It Works** — 3 steps
6. **Features** — 6 feature cards
7. **Screenshots** — extension, dashboard, contact view
8. **FAQ** — 10+ questions
9. **Final CTA** — Install call-to-action

---

## Phase 3 — App Redesign

Routes to redesign:
| Route | What's needed |
|-------|---------------|
| `/auth` | Premium sign-in page with glassmorphism |
| `/dashboard` | Sidebar + contact list + search + filters |
| `/contact/[id]` | Profile + notes + timeline + reminders |
| `/settings` | Account, auth, subscription, export, delete |

---

## Phase 4 — Chrome Extension

- Fix white screen bug (React render issue)
- Premium dark UI for popup & sidepanel
- Production API URL (`https://thyn-api.vercel.app`)
- LinkedIn content script fixes
- Chrome Web Store packaging

---

## Phase 5 — SEO & Analytics

- Metadata / Open Graph / Twitter Cards
- Structured data (JSON-LD)
- Sitemap.xml / robots.txt
- PostHog + Google Analytics (feature-flagged)

---

## Phase 6 — Launch

- Supabase OAuth: add `https://thyn-flame.vercel.app/auth/callback`
- Test full auth flow
- Chrome Web Store listing
- GitHub auto-deploy

---

## File Structure (Web App)

```
web/
├── app/
│   ├── globals.css              # Design system styles
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page
│   ├── features/page.tsx        # Features page
│   ├── pricing/page.tsx         # Pricing page
│   ├── privacy/page.tsx         # Privacy policy
│   ├── terms/page.tsx           # Terms of service
│   ├── changelog/page.tsx       # Changelog
│   ├── contact/page.tsx         # Contact form
│   ├── auth/page.tsx            # Sign-in page
│   ├── dashboard/page.tsx       # Dashboard
│   ├── contact/[id]/page.tsx    # Contact detail
│   ├── settings/page.tsx        # Settings
│   └── ClientLayout.tsx         # App shell (sidebar)
├── components/
│   ├── Header.tsx               # Site header
│   ├── Footer.tsx               # Site footer
│   ├── Hero.tsx                 # Landing hero
│   ├── FeatureCard.tsx          # Feature card
│   ├── PricingCard.tsx          # Pricing card
│   ├── FAQ.tsx                  # FAQ accordion
│   └── ... (shared components)
├── lib/
│   ├── api.ts                   # Supabase client
│   └── shared.tsx               # Auth context
├── tailwind.config.ts
├── next.config.js
└── package.json
```
