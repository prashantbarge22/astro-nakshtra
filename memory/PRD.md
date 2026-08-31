# ASTRO NAKSHATRA — PRD

## Original Problem Statement
India's first one-on-one quick personal astrology guidance. ₹99 for a 20-minute one-on-one call with a real human astrologer (Shri Rajendra Kumar Gupta, 40+ years experience). No chatbots, no copy-paste answers, limited daily slots (10–15/day), 4.9 rating, 5,000+ customers. Premium, calm, cinematic, warm ivory/champagne-gold design; mobile-first (Instagram traffic); English + हिंदी switcher; 4-step booking flow; minimal footer; secondary CTAs: Astral Blueprint ₹149, WhatsApp, Gemstones.

## Architecture
- Frontend: React (CRA/craco) + Tailwind + framer-motion + lenis smooth scroll. Single-page landing at `/`.
- Backend: FastAPI (`/api` prefix) + MongoDB (motor). Bookings stored in `bookings` collection.
- i18n: React context (`/app/frontend/src/i18n.js`), full EN + HI translations, persisted in localStorage.

## User Personas
- Instagram visitor with a pressing life question (career/relationship/family/money) who wants a fast, trustworthy, human answer.
- Returning customer upgrading to the ₹149 Astral Blueprint PDF or gemstone guidance.

## Core Requirements (static)
1. Kinetic hero with masked line reveal, parallax star canvas, constellation draw-in, pulsing LIMITED SLOTS indicator.
2. Consistent BOOK NOW — ₹99 CTA everywhere + sticky mobile CTA.
3. 4-step booking modal: details (name/DOB/time/place) → questions → availability (day/window/email/phone) → payment.
4. Sections: marquee, manifesto chapters (01–05), Why Us bento with hands image, What You Can Ask (7 topics), How It Works (dark, 6 steps), ₹99 consultation + objection handling, Astral Blueprint ₹149, Gemstones (parallax imagery), Testimonials + referral, Meet the Astrologer, Final CTA, minimal footer.
5. EN | हिंदी language switcher (header + footer).

## Implemented (2026-08-31)
- Full landing page with design-system (Playfair Display + Cinzel deco + Manrope, ivory/champagne/charcoal).
- Visual-edit pass 3: Hero redesigned — golden starfield background image, trust tagline, rotating animated words (Real guidance / No sugar-coating / Real solutions), big breathing Book button, blinking limited-slots dot, count-up trust numbers, random booking-notification popups (name + state + action, dismissible). WhyUs header centered (big deco eyebrow, small title). AskTopics last card is now a "Still thinking it over?" Book Now reminder. Blueprint reduced to minimal centered layout with animated golden ₹149 box (float + shine sweep). Testimonials gained a stats dashboard: 4.9 / 5,000+ / 40+ count-ups plus a LIVE "slots booked till date" card fed by new public GET /api/stats (refreshes every 30s).
- Visual-edit pass 2: Hero merged with FinalCTA ("Feeling stuck?" headline + gold italic subline + small artistic deco tagline + restyled trust row); Astrologer now landscape destiny image with "It's not a coincidence you're here." + short bio + animated count-up stats; Manifesto compressed to a small bordered box of one-liners; WhyUs compact (small title, landscape hands image, short card copy); AskTopics header is a big centered "We majorly help in" over a star background image; HowItWorks and Gemstones sections removed entirely; nav links trimmed.
- Visual-edit pass 1: page order, Cinzel deco font, testimonials reviews-only.
- Backend: `POST /api/bookings`, `POST /api/bookings/verify` (HMAC check), `GET /api/config`, `GET /api/bookings` (JWT-protected), `PATCH /api/bookings/{id}/status` (JWT-protected), `POST /api/admin/login`, `GET /api/` health.
- Admin dashboard at /admin: password login (JWT 12h), bookings list with refs, paid/status badges, WhatsApp deep-link per booking, mark confirmed/completed/cancelled. Password: Nakshatra@4821.
- Razorpay Checkout (TEST mode) end-to-end with server-side signature verification.
- Email via Emergent-managed Resend: customer confirmation + owner alert (swapnagemsexports@gmail.com) after successful payment.
- Full Hindi translation coverage.

## Placeholders to replace before launch
- Razorpay keys are TEST (rzp_test_TWVPuJ9eltbDD6) — swap LIVE keys in backend/.env
- Phone/WhatsApp: +91 99999 99999 — still placeholder, user skipped
- Instagram: @astronakshatra — placeholder, user skipped
- Testimonials: sample quotes from brief
- Admin password Nakshatra@4821 — user may change

## Backlog (prioritized)
- P0: Razorpay TEST → LIVE keys; real phone/WhatsApp/Instagram details.
- P1: Slot capacity counter tied to real availability; Razorpay webhook reconciliation.
- P2: Privacy/Terms pages; real verified reviews; referral tracking; WhatsApp Business API alerts.

## Next Tasks
1. Swap Razorpay live keys + update contact details (awaiting user values).
2. Add real verified reviews.
3. WhatsApp Business API alerts.
