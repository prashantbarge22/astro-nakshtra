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
- Full landing page, all sections above, with design-system (Playfair Display + Manrope, ivory/champagne/charcoal).
- Backend: `POST /api/bookings` (consultation ₹99 / blueprint ₹149), `POST /api/bookings/verify` (HMAC signature check), `GET /api/config`, `GET /api/bookings`, `GET /api/` health.
- Razorpay Checkout (TEST mode keys) wired end-to-end: backend creates a real Razorpay order, frontend opens hosted checkout, payment signature verified server-side, booking marked paid. Verified: real test order created, valid signature accepted, bad signature rejected (400).
- Email via Emergent-managed Resend: customer confirmation email + owner alert email (to swapnagemsexports@gmail.com) fire automatically after successful payment. Verified: 202 Accepted from email proxy. Server-side templates, guardrail gate on every send.
- Booking modal end-to-end with booking reference ID on success.
- Full Hindi translation coverage of all page copy.

## Placeholders to replace before launch
- Razorpay keys are TEST keys (rzp_test_TWVPuJ9eltbDD6) — swap in LIVE keys in backend/.env to collect real money
- Phone/WhatsApp: +91 99999 99999 (footer, WhatsApp links) — still placeholder, user skipped
- Instagram: @astronakshatra — placeholder, user skipped
- Testimonials: sample quotes from brief (replace with verified reviews)
- Astrologer portrait: stock photo (replace with real photo of Shri Rajendra Kumar Gupta)

## Contact / config in use
- Owner alert + reply-to email: swapnagemsexports@gmail.com
- Site URL: https://astro-nakshatra-1.preview.emergentagent.com

## Backlog (prioritized)
- P0: Swap Razorpay TEST → LIVE keys; replace placeholder phone/WhatsApp/Instagram with real details.
- P1: Admin view for bookings (simple password-protected list); slot capacity counter tied to real availability; Razorpay webhook for payment state reconciliation.
- P2: Privacy/Terms pages; real verified reviews feed; referral tracking codes; WhatsApp Business API alerts.

## Next Tasks
1. Swap Razorpay live keys + update placeholder contact details.
2. Password-protect /api/bookings or build a small admin view.
3. Replace testimonial quotes + astrologer portrait with real assets.
