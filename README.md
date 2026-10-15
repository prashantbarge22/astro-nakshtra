# Astro Nakshatra

Premium, mobile-first landing page for 1-on-1 astrology consultations — ₹99 / 20-minute session, cinematic animated design, 3D live globe, multi-plan booking modal, Razorpay + Stripe payments, email booking alerts, and a password-protected admin dashboard.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Lenis (smooth scroll), Three.js (3D globe)
- **Backend:** FastAPI (Python), MongoDB
- **Payments:** Razorpay + Stripe
- **Emails:** Resend (owner alert + customer confirmation on every paid booking)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env      # then fill in every <REPLACE_...> value
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # then fill in REACT_APP_BACKEND_URL
yarn install
yarn start                # runs on port 3000
```

## Keys & Placeholders (IMPORTANT)

All secrets live in `.env` files, which are **git-ignored and never committed**. Each app ships an `.env.example` with clearly-marked `<REPLACE_...>` placeholders:

| Key | Where | What to put |
|---|---|---|
| `MONGO_URL` / `DB_NAME` | `backend/.env` | Your MongoDB connection string + database name |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | `backend/.env` | From Razorpay Dashboard → Settings → API Keys (`rzp_test_*` for testing, `rzp_live_*` for real money) |
| `STRIPE_API_KEY` | `backend/.env` | Stripe secret key |
| `EMERGENT_EMAIL_KEY` | `backend/.env` | Email provider key (booking alert emails) |
| `OWNER_EMAIL` / `EMAIL_REPLY_TO` | `backend/.env` | Email that receives new-booking alerts |
| `JWT_SECRET` | `backend/.env` | Any random 64-character string |
| `ADMIN_PASSWORD` | `backend/.env` | Password for the `/admin` dashboard |
| `REACT_APP_BACKEND_URL` | `frontend/.env` | Public URL of the backend |

### Contact details (phone / WhatsApp / email / Instagram)

These are **not** in `.env` — edit the single file `frontend/src/config.js` (clearly marked `TODO` placeholders). It updates the footer and WhatsApp links site-wide, in both English and Hindi.

## Admin Dashboard

Visit `/admin` and log in with your `ADMIN_PASSWORD` to see all bookings, payment status, and one-tap WhatsApp confirmation links.

## Payments

- **Razorpay:** server-side signature verification at `POST /api/bookings/verify`
- **Stripe:** Checkout Session + webhook fulfillment at `POST /api/bookings/stripe/webhook`
- On successful payment, the customer gets a confirmation email and the owner gets an alert email with full booking details.
