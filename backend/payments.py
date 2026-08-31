import os
import razorpay

_client = None


def get_key_id():
    return os.environ.get("RAZORPAY_KEY_ID", "")


def is_configured():
    return bool(get_key_id() and os.environ.get("RAZORPAY_KEY_SECRET"))


def get_client():
    global _client
    if _client is None:
        _client = razorpay.Client(auth=(get_key_id(), os.environ["RAZORPAY_KEY_SECRET"]))
    return _client


def create_order(amount_inr: int, receipt: str):
    return get_client().order.create({
        "amount": amount_inr * 100,
        "currency": "INR",
        "payment_capture": 1,
        "receipt": receipt[:40],
    })


def verify_signature(order_id: str, payment_id: str, signature: str) -> bool:
    try:
        get_client().utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
        })
        return True
    except Exception:
        return False
