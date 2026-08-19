"""Vercel entry point: exposes the existing FastAPI app as a single
serverless function. Vercel's Python runtime detects the `app` ASGI
callable in this file and routes every request matched by the `/api/(.*)`
rewrite in vercel.json to it, so `backend/app/main.py`'s own routing
(already prefixed with `/api/...`) handles everything from here — no
duplicated route definitions.
"""

import sys
from pathlib import Path

# `backend/app` is a regular (non-namespaced) package rooted at backend/,
# not at the repo root, so it isn't importable as-is from here.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.main import app  # noqa: E402
