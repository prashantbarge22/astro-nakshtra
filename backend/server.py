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

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

PACKAGES = {"consultation": 99, "blueprint": 149}


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


@api_router.get("/config")
async def config():
    return {"payments_enabled": is_configured()}


@api_router.get("/stats")
async def stats():
    count = await db.bookings.count_documents({"payment_status": {"$in": ["paid", "mock_paid"]}})
    return {"slots_booked": count}


@api_router.post("/bookings", status_code=201)
async def create_booking(input: BookingCreate):
    if input.package not in PACKAGES:
        raise HTTPException(status_code=400, detail="Unknown package")
    payments_on = is_configured()
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

    if payments_on:
        try:
            order = await asyncio.to_thread(create_order, PACKAGES[input.package], doc["id"])
        except Exception as e:
            logging.getLogger(__name__).error(f"Razorpay order creation failed: {e}")
            raise HTTPException(status_code=502, detail="Could not initiate payment")
        await db.bookings.update_one({"id": doc["id"]}, {"$set": {"razorpay_order_id": order["id"]}})
        return {
            "booking": doc,
            "payments_enabled": True,
            "key_id": get_key_id(),
            "order": {"id": order["id"], "amount": order["amount"], "currency": order["currency"]},
        }
    return {"booking": doc, "payments_enabled": False}


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
