import os
import re
import time
import uuid
import logging
import ipaddress
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict, deque
from typing import Optional, Dict

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, field_validator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("zavro")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

APP_ENV = os.environ["APP_ENV"]
LEAD_NOTIFY_EMAIL = os.environ["LEAD_NOTIFY_EMAIL"]
SITE_URL = os.environ["SITE_URL"]
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME")
TEST_NOTIFY_EMAIL = "delivered@resend.dev"

app = FastAPI(title="Zavro Solutions API")
api = APIRouter(prefix="/api")

SERVICE_AREAS = {
    "ai-automation", "web-development", "ecommerce-development", "software-development",
    "mobile-app-development", "digital-marketing", "seo", "geo", "social-media", "branding",
    "business-consulting", "growth-audit", "not-sure",
}
TIMINGS = {"", "As soon as possible", "Within 1–3 months", "3–6 months", "Just exploring"}
CONTACTS = {"", "Email", "WhatsApp", "Phone call"}
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")


class EnquiryIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(max_length=200)
    company: str = Field(default="", max_length=200)
    service: str
    summary: str = Field(min_length=10, max_length=1500)
    timing: str = ""
    contact_method: str = ""
    website_url: str = ""  # honeypot
    source_page: str = Field(default="", max_length=120)
    from_nova: bool = False
    utm: Dict[str, str] = Field(default_factory=dict)

    @field_validator("name", "company", "summary", mode="before")
    @classmethod
    def strip(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("email")
    @classmethod
    def check_email(cls, v):
        v = v.strip()
        if not EMAIL_RE.match(v):
            raise ValueError("Please enter a valid email address.")
        return v.lower()

    @field_validator("service")
    @classmethod
    def check_service(cls, v):
        if v not in SERVICE_AREAS:
            raise ValueError("Choose the area you need help with.")
        return v

    @field_validator("timing")
    @classmethod
    def check_timing(cls, v):
        return v if v in TIMINGS else ""

    @field_validator("contact_method")
    @classmethod
    def check_contact(cls, v):
        return v if v in CONTACTS else ""

    @field_validator("utm")
    @classmethod
    def clean_utm(cls, v):
        allowed = {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referrer"}
        return {k: str(val)[:200] for k, val in (v or {}).items() if k in allowed and val}


class Enquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    reference: str
    name: str
    email: str
    company: str
    service: str
    summary: str
    timing: str
    contact_method: str
    source_page: str
    from_nova: bool
    utm: Dict[str, str]
    environment: str
    is_test: bool
    email_notification: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


FIELD_MAP = {"name": "name", "email": "email", "service": "service", "summary": "summary"}


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    fields = {}
    for err in exc.errors():
        loc = err.get("loc", [])
        key = loc[-1] if loc else "form"
        msg = err.get("msg", "Invalid value").replace("Value error, ", "")
        if key in FIELD_MAP:
            fields[key] = msg
    return JSONResponse(status_code=422, content={"detail": {"message": "Please check the highlighted fields.", "fields": fields}})


# Simple in-memory rate limit: 5 submissions per 10 minutes per client IP.
_hits = defaultdict(deque)


def rate_limited(ip: str) -> bool:
    now = time.time()
    q = _hits[ip]
    while q and now - q[0] > 600:
        q.popleft()
    if len(q) >= 5:
        return True
    q.append(now)
    return False


# ---------- Email (Emergent-managed Resend) guardrail gate ----------
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


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> str:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to:
        payload["contact_email"] = reply_to
    async with httpx.AsyncClient(timeout=30) as http:
        resp = await http.post(f"{EMAIL_BASE_URL}/api/v1/email/send", headers={"X-Email-Key": EMAIL_KEY}, json=payload)
    if resp.status_code >= 400:
        try:
            code = resp.json().get("code", "")
        except ValueError:
            code = ""
        logger.warning("Email send refused: %s %s %s", resp.status_code, code, resp.text[:300])
        raise RuntimeError(code or f"http_{resp.status_code}")
    return resp.json().get("id", "")


def lead_email_html(e: Enquiry) -> str:
    rows = [
        ("Reference", e.reference), ("Name", e.name), ("Email", e.email), ("Company / website", e.company or "—"),
        ("Area", e.service), ("Timing", e.timing or "—"), ("Preferred contact", e.contact_method or "—"),
        ("Source page", e.source_page or "—"), ("Via NOVA guide", "Yes" if e.from_nova else "No"),
        ("Environment", f"{e.environment}{' (TEST)' if e.is_test else ''}"),
    ]
    cells = "".join(
        f'<tr><td style="padding:6px 12px;color:#64748b;font-size:13px">{escape(k)}</td>'
        f'<td style="padding:6px 12px;color:#0f172a;font-size:14px">{escape(str(v))}</td></tr>' for k, v in rows
    )
    summary = escape(e.summary).replace("\n", "<br>")
    return (
        '<table role="presentation" width="100%" style="font-family:Arial,sans-serif"><tr><td style="padding:24px">'
        '<p style="font-size:16px;color:#0f172a;margin:0 0 12px">New project enquiry from the website.</p>'
        f'<table role="presentation" style="border-collapse:collapse">{cells}</table>'
        f'<p style="font-size:13px;color:#64748b;margin:18px 0 6px">Project summary</p>'
        f'<p style="font-size:14px;color:#0f172a;margin:0">{summary}</p>'
        f'<p style="font-size:12px;color:#94a3b8;margin-top:24px">Sent by {escape(EMAIL_FROM_NAME or "")} website enquiry system. '
        f'Reply to this email to respond to the visitor directly.</p>'
        '</td></tr></table>'
    )


@api.get("/")
async def root():
    return {"service": "Zavro Solutions API", "status": "ok"}


@api.get("/health")
async def health():
    await db.command("ping")
    return {"status": "ok", "environment": APP_ENV, "email_configured": bool(EMAIL_KEY and EMAIL_FROM_NAME)}


@api.post("/enquiries", status_code=201)
async def create_enquiry(payload: EnquiryIn, request: Request):
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown").split(",")[0].strip()
    if rate_limited(ip):
        raise HTTPException(status_code=429, detail={"message": "Too many submissions. Please try again later or email us directly."})

    reference = "ZV-" + uuid.uuid4().hex[:6].upper()
    if payload.website_url:
        # Honeypot filled: respond like success, store nothing.
        logger.info("Honeypot triggered; enquiry discarded")
        return {"reference": reference, "stored": False}

    is_test = payload.name.upper().startswith("TEST_") or APP_ENV != "production"
    enquiry = Enquiry(
        reference=reference, name=payload.name, email=payload.email, company=payload.company,
        service=payload.service, summary=payload.summary, timing=payload.timing,
        contact_method=payload.contact_method, source_page=payload.source_page, from_nova=payload.from_nova,
        utm=payload.utm, environment=APP_ENV, is_test=is_test,
    )
    try:
        await db.enquiries.insert_one(enquiry.model_dump())
    except Exception:
        logger.exception("Failed to store enquiry")
        raise HTTPException(status_code=503, detail={"message": "We couldn't save your enquiry. Please email us directly."})

    status = "not_configured"
    if EMAIL_KEY and EMAIL_FROM_NAME:
        to = TEST_NOTIFY_EMAIL if payload.name.upper().startswith("TEST_") else LEAD_NOTIFY_EMAIL
        try:
            await send_email(
                to=to,
                subject=f"New enquiry {reference}: {payload.service}{' [TEST]' if is_test else ''}",
                html=lead_email_html(enquiry),
                reply_to=payload.email,
            )
            status = "sent"
        except Exception as exc:
            logger.error("Lead notification failed for %s: %s", reference, exc)
            status = "failed"
    await db.enquiries.update_one({"id": enquiry.id}, {"$set": {"email_notification": status}})
    return {"reference": reference, "stored": True, "email_notification": status}


app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Frame-Options"] = "DENY"
    return response


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
