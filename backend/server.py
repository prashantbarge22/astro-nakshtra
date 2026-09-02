import asyncio
import logging
import os
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Body
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from payments import is_configured, create_order, verify_signature, get_key_id
from emails import send_booking_emails
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

PACKAGES = {"consultation": 99, "blueprint": 349, "bundle": 299}


class BookingCreate(BaseModel):
    full_name: str
    dob: str
    birth_time: str
    birth_place: str
    questions: str = ""
    preferred_day: str
    preferred_time: str
    email: EmailStr
    phone: str
    package: str = "consultation"


class PaymentVerify(BaseModel):
    booking_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@api_router.get("/")
async def root():
    return {"message": "Astro Nakshatra API"}


def payment_provider():
    if os.environ.get("STRIPE_API_KEY"):
        return "stripe"
    if is_configured():
        return "razorpay"
    return None


@api_router.get("/config")
async def config():
    provider = payment_provider()
    return {"payments_enabled": provider is not None, "provider": provider}


@api_router.get("/stats")
async def stats():
    count = await db.bookings.count_documents({"payment_status": {"$in": ["paid", "mock_paid"]}})
    return {"slots_booked": count}


@api_router.post("/bookings", status_code=201)
async def create_booking(input: BookingCreate):
    if input.package not in PACKAGES:
        raise HTTPException(status_code=400, detail="Unknown package")
    provider = payment_provider()
    payments_on = provider is not None
    doc = input.model_dump()
    doc.update({
        "id": str(uuid.uuid4()),
        "amount": PACKAGES[input.package],
        "status": "payment_pending" if payments_on else "pending_confirmation",
        "payment_status": "unpaid" if payments_on else "mock_paid",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)

    if provider == "razorpay":
        try:
            order = await asyncio.to_thread(create_order, PACKAGES[input.package], doc["id"])
        except Exception as e:
            logging.getLogger(__name__).error(f"Razorpay order creation failed: {e}")
            raise HTTPException(status_code=502, detail="Could not initiate payment")
        await db.bookings.update_one({"id": doc["id"]}, {"$set": {"razorpay_order_id": order["id"]}})
        return {
            "booking": doc,
            "payments_enabled": True,
            "provider": provider,
            "key_id": get_key_id(),
            "order": {"id": order["id"], "amount": order["amount"], "currency": order["currency"]},
        }
    return {"booking": doc, "payments_enabled": payments_on, "provider": provider}


class StripeCheckoutReq(BaseModel):
    booking_id: str
    origin_url: str


async def _mark_paid(session_id: str):
    res = await db.payment_transactions.update_one(
        {"session_id": session_id, "payment_status": {"$ne": "paid"}},
        {"$set": {"status": "completed", "payment_status": "paid",
                  "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if tx and res.modified_count and tx.get("booking_id"):
        bres = await db.bookings.update_one(
            {"id": tx["booking_id"], "payment_status": {"$ne": "paid"}},
            {"$set": {"payment_status": "paid", "status": "pending_confirmation",
                      "stripe_session_id": session_id}},
        )
        if bres.modified_count:
            booking = await db.bookings.find_one({"id": tx["booking_id"]}, {"_id": 0})
            if booking:
                asyncio.create_task(send_booking_emails(booking))
    return tx


@api_router.post("/payments/checkout")
async def stripe_checkout_session(input: StripeCheckoutReq, request: Request):
    booking = await db.bookings.find_one({"id": input.booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.get("payment_status") == "paid":
        raise HTTPException(status_code=400, detail="Booking already paid")
    amount = float(PACKAGES[booking["package"]])
    webhook_url = f"{str(request.base_url)}api/webhook/stripe"
    sc = StripeCheckout(api_key=os.environ["STRIPE_API_KEY"], webhook_url=webhook_url)
    req = CheckoutSessionRequest(
        amount=amount,
        currency="inr",
        success_url=f"{input.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{input.origin_url}/payment/cancel",
        metadata={"booking_id": booking["id"], "package": booking["package"]},
    )
    session = await sc.create_checkout_session(req)
    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "booking_id": booking["id"],
        "amount": amount,
        "currency": "inr",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"checkout_url": session.url, "session_id": session.session_id}


@api_router.get("/payments/status/{session_id}")
async def stripe_payment_status(session_id: str, request: Request):
    record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if record.get("payment_status") != "paid":
        try:
            webhook_url = f"{str(request.base_url)}api/webhook/stripe"
            sc = StripeCheckout(api_key=os.environ["STRIPE_API_KEY"], webhook_url=webhook_url)
            s = await sc.get_checkout_status(session_id)
            if s.payment_status == "paid":
                record = await _mark_paid(session_id)
        except Exception as e:
            logging.getLogger(__name__).warning(f"Stripe status check failed: {e}")
    return {"session_id": record["session_id"], "status": record["status"],
            "payment_status": record["payment_status"]}


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    webhook_url = f"{str(request.base_url)}api/webhook/stripe"
    sc = StripeCheckout(api_key=os.environ["STRIPE_API_KEY"], webhook_url=webhook_url)
    try:
        resp = await sc.handle_webhook(body, request.headers.get("Stripe-Signature"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook")
    if resp.payment_status == "paid":
        await _mark_paid(resp.session_id)
    return {"status": "ok"}


@api_router.post("/bookings/verify")
async def verify_booking_payment(input: PaymentVerify):
    booking = await db.bookings.find_one({"id": input.booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.get("razorpay_order_id") != input.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Order mismatch")
    ok = await asyncio.to_thread(
        verify_signature,
        input.razorpay_order_id,
        input.razorpay_payment_id,
        input.razorpay_signature,
    )
    if not ok:
        raise HTTPException(status_code=400, detail="Payment verification failed")
    updates = {
        "payment_status": "paid",
        "status": "pending_confirmation",
        "razorpay_payment_id": input.razorpay_payment_id,
    }
    await db.bookings.update_one({"id": input.booking_id}, {"$set": updates})
    booking.update(updates)
    asyncio.create_task(send_booking_emails(booking))
    return {"booking": booking}


JWT_ALG = "HS256"
BOOKING_STATUSES = {"pending_confirmation", "confirmed", "completed", "cancelled"}


class AdminLogin(BaseModel):
    password: str


def require_admin(request: Request):
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALG])
        if payload.get("sub") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@api_router.post("/admin/login")
async def admin_login(input: AdminLogin):
    if input.password != os.environ.get("ADMIN_PASSWORD", ""):
        raise HTTPException(status_code=401, detail="Wrong password")
    token = jwt.encode(
        {"sub": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=12)},
        os.environ["JWT_SECRET"],
        algorithm=JWT_ALG,
    )
    return {"token": token}


@api_router.get("/bookings")
async def list_bookings(_=Depends(require_admin)):
    return await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.patch("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str = Body(..., embed=True), _=Depends(require_admin)):
    if status not in BOOKING_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"id": booking_id, "status": status}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
