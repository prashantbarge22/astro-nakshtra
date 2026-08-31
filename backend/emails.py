import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# Emergent managed email proxy. Constant on purpose — survives deployment.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {
        "to": [to],
        "subject": subject,
        "html": html,
        "from_name": os.environ.get("EMAIL_FROM_NAME", "Astro Nakshatra"),
    }
    rt = reply_to or os.environ.get("EMAIL_REPLY_TO")
    if rt:
        payload["contact_email"] = rt
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": os.environ["EMERGENT_EMAIL_KEY"]},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return None


def _shell(inner: str) -> str:
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#F5F2EB;padding:32px 16px"><tr><td>'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="max-width:560px;margin:0 auto;background:#FDFBF7;border:1px solid #e5ddc8;'
        'border-radius:12px;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#1A1A1A">'
        f'<tr><td>{inner}'
        '<p style="font-size:12px;color:#8a8574;margin-top:28px;line-height:1.5">'
        'Sent by Astro Nakshatra — Shri Rajendra Kumar Gupta. '
        'We never ask for passwords or card details by email.</p>'
        '</td></tr></table></td></tr></table>'
    )


def _row(label: str, value: str) -> str:
    return (
        f'<tr><td style="padding:6px 0;font-size:13px;color:#8a8574;width:140px;vertical-align:top">{escape(label)}</td>'
        f'<td style="padding:6px 0;font-size:14px;color:#1A1A1A">{escape(value)}</td></tr>'
    )


def customer_confirmation_html(b: dict) -> str:
    site = os.environ.get("SITE_URL", "")
    package = "Astral Blueprint (PDF guide)" if b.get("package") == "blueprint" else "20-minute personal consultation"
    link = f'<p style="margin-top:20px"><a href="{escape(site)}" style="color:#C59B27;font-size:14px">Visit Astro Nakshatra</a></p>' if site else ""
    inner = (
        '<h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 6px;font-weight:600">Your booking is confirmed</h1>'
        f'<p style="font-size:14px;color:#4A4A4A;line-height:1.6">Namaste {escape(b["full_name"])}, '
        'thank you for booking with Astro Nakshatra. Our team will confirm your slot on '
        'WhatsApp and email shortly.</p>'
        '<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;width:100%">'
        + _row("Booking reference", b["id"][:8].upper())
        + _row("Service", package)
        + _row("Amount paid", f'INR {b["amount"]}')
        + _row("Preferred slot", f'{b["preferred_day"]} · {b["preferred_time"]}')
        + '</table>'
        '<p style="font-size:14px;color:#4A4A4A;line-height:1.6;margin-top:18px">'
        'Come curious. Come prepared. And come ready to hear the truth.</p>'
        + link
    )
    return _shell(inner)


def owner_alert_html(b: dict) -> str:
    inner = (
        '<h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 6px;font-weight:600">New paid booking</h1>'
        '<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;width:100%">'
        + _row("Name", b["full_name"])
        + _row("Service", b.get("package", "consultation"))
        + _row("Amount", f'INR {b["amount"]}')
        + _row("DOB / Time", f'{b["dob"]} · {b["birth_time"]}')
        + _row("Birth place", b["birth_place"])
        + _row("Questions", b.get("questions") or "—")
        + _row("Preferred slot", f'{b["preferred_day"]} · {b["preferred_time"]}')
        + _row("Email", b["email"])
        + _row("Phone / WhatsApp", b["phone"])
        + _row("Payment ID", b.get("razorpay_payment_id") or "—")
        + _row("Reference", b["id"][:8].upper())
        + '</table>'
    )
    return _shell(inner)


async def send_booking_emails(booking: dict) -> None:
    try:
        await send_email(
            to=booking["email"],
            subject="Your Astro Nakshatra booking is confirmed",
            html=customer_confirmation_html(booking),
        )
    except Exception as e:
        logger.error(f"Customer confirmation email failed: {e}")
    owner = os.environ.get("OWNER_EMAIL", "")
    if owner:
        try:
            await send_email(
                to=owner,
                subject=f"New booking: {booking['full_name']} — INR {booking['amount']}",
                html=owner_alert_html(booking),
            )
        except Exception as e:
            logger.error(f"Owner alert email failed: {e}")
