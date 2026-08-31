from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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


@api_router.get("/")
async def root():
    return {"message": "Astro Nakshatra API"}


@api_router.post("/bookings", status_code=201)
async def create_booking(input: BookingCreate):
    if input.package not in PACKAGES:
        raise HTTPException(status_code=400, detail="Unknown package")
    doc = input.model_dump()
    doc.update({
        "id": str(uuid.uuid4()),
        "amount": PACKAGES[input.package],
        "status": "pending_confirmation",
        "payment_status": "mock_paid",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/bookings")
async def list_bookings():
    return await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


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
