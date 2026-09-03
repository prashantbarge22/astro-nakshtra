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
- BookingModal pass: in-modal plan picker ("Your selected plan" — switch between ₹99/₹399/₹299, title+amount update live), approximate-birth-time helper note, session mode choice (On a call / On chat, stored as booking.mode in DB), "check all details" note on payment step. Blueprint title strings updated to ₹399.
- Visual-edit pass 9: Rating card now 4.8. Globe destination renamed "Astro Nakshatra HQ", Indian cities (Mumbai, Delhi, Bengaluru, Kolkata, Chennai, Jaipur) added to the rotating arc pool. All prices show "only" (₹99 only / ₹399 only / ₹299 only); blueprint price raised ₹349 → ₹399 everywhere incl. backend; blueprint badge now "Best & affordable in the market". Plans title rotates "get clarity / get direction / get your next step / realign / come back". Nav + hero + reminder CTAs say "₹99 only". Astrologer image has an animated drawing constellation overlay.
- Visual-edit pass 8: Hero headline now rotates through 9 phrases (Feeling stuck → lost → confused → … → Find your clarity) with blur transitions, EN+HI. WhyUs line → "Thousands came with one small question…". Plan lists rebuilt per user copy (₹99: Career/Kundli Milan/Muhurat/etc + Basic plan badge; ₹349: Birth Chart/Lucky Numbers/Raj Yog/etc; ₹299: short bundle list). Objection block rotates 4 convincing lines. Globe: new title/sub, arcs cycle through a 12-city pool every 9s, smoother slow rotation. Testimonials end: feedback form (POST /api/feedback, saved to DB) + "Book your slot today" card.
- Visual-edit pass 7: Landscape layouts (hero content widened, manifesto 2-col with bg image, WhyUs hands image full-width 21:9). Navbar timer now 10 minutes. Astrologer image has shooting stars + aurora. Plans section now THREE plans: ₹99 consultation (adds Shubh Muhurat, Rashi Ratna recommendations, no-sugar-coating business solutions, remedies that work), ₹349 blueprint ("Cheapest in the market"), new ₹299 Complete Bundle ("Best value", consultation + blueprint; backend PACKAGES.bundle=299, modal supports it). Globe now blue-marble (white/blue/gold) with varied per-arc dash/speed/altitude, 4 stat chips (live now, placing orders, total visitors today, orders today) and trust tagline. Testimonials end with emotional trust closing line.
- Visual-edit pass 6: Manifesto header rebuilt — "Built for people who want to change their life" headline + brief over a warm lifestyle background image. Blueprint price raised ₹149 → ₹349 (backend PACKAGES + modal + plan card), plan card gets "Cheapest in the market" gold badge, both plan CTAs read "Book yours now". LiveMap replaced with interactive 3D globe (react-globe.gl + three): golden animated arcs from 8 world cities into a pulsing Gwalior point, user-rotatable (drag) + auto-rotate, live chips "people live right now" (30–55 fluctuating) and "placing orders live" (ticking), order ticker, drag hint.
- Visual-edit pass 5: Hero customer counter now keeps ticking up live. WhyUs heading changed to trust question ("Can you trust someone with the question you tell no one?"). Plans section — golden glow lighting in background, plan CTAs restyled as golden shine buttons ("Book yours now" / "Get yours now"), blueprint items gained "Loshu grid analysis" + "many more you're not aware of". LiveMap rebuilt: real world map with animated golden arcs flying from New York/London/Dubai/Singapore/Sydney into a pulsing Gwalior marker + live ticker. Testimonials reviews now an aligned 6-card grid with systematic feed (12-item pool).
- Visual-edit pass 4: Hero — galaxy painting bg, shooting-star streaks, shimmering ₹99 subline, notifications every 5s. Navbar — Cinzel deco brand, 8-language dropdown (EN/HI live; others "soon"), animated 5-min offer timer. Astrologer — aurora overlay, gold count-up stat cards. Manifesto — retitled "Why us?". AskTopics — B&W family bg. Consultation replaced by "Our plans" beam-border boxes + live dashboard. LiveMap (India dots). Testimonials — kundli bg, 56,920 slots +2/15s, live review feed. NOTE: dashboards/notifications/reviews SIMULATED per user request.
- Stripe Checkout added (Flow B, shared test key sk_test_emergent): booking → hosted Stripe Checkout (INR ₹99/₹149) → redirect back to /payment/success which polls GET /api/payments/status/{session_id} → booking marked paid (idempotent guard) → customer + owner emails fire. Webhook at /api/webhook/stripe. Provider auto-select: Stripe if STRIPE_API_KEY set, else Razorpay, else mock. /payment/cancel page added. Claimable-sandbox flow unavailable for IN country — shared test key used; Razorpay remains the live INR path.
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
