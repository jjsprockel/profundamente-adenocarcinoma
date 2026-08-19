"""Format detection and conversion for the histopathology viewer.

Two families of input are supported, both resolved synchronously into a
single in-memory image (bytes + media type + dimensions) — there is no
server-side session or on-disk artifact left behind after the call returns:

- SVG is vector and already lightweight to render in the browser, so it is
  passed through as-is.
- Everything else (JPEG/PNG/BMP/WebP/TIFF, DICOM) is normalized to a single
  PNG (or passed through as JPEG/PNG unchanged) via Pillow/pydicom.

This intentionally does not support pyramidal whole-slide formats (SVS,
NDPI, tiled multi-resolution TIFF via OpenSlide): OpenSlide is a native
system library that can't be installed in a serverless runtime, and reading
a multi-gigabyte slide requires a persistent server process anyway — not a
fit for a stateless deployment. Only flat, single-resolution images are
handled here.
"""

from __future__ import annotations

import io
from pathlib import Path

import numpy as np
import pydicom
from PIL import Image

# The upload endpoint is publicly reachable, so a small, highly-compressed
# file (e.g. a crafted TIFF/WebP "decompression bomb") could otherwise
# decode to a huge pixel buffer and exhaust memory/CPU on a single request.
# 100 MP is far beyond any legitimate flat capture that fits the 3 MB
# upload cap, so this only blocks pathological input.
Image.MAX_IMAGE_PIXELS = 100_000_000

SVG_EXTENSIONS = {".svg"}
DICOM_EXTENSIONS = {".dcm"}


class UnsupportedImageError(Exception):
    """Raised when the file can't be interpreted as an image at all."""


def _looks_like_dicom(path: Path) -> bool:
    try:
        with open(path, "rb") as f:
            f.seek(128)
            return f.read(4) == b"DICM"
    except OSError:
        return False


def _dicom_to_png_bytes(path: Path) -> bytes:
    ds = pydicom.dcmread(path)
    arr = ds.pixel_array

    # Multi-frame series: show the first frame as the representative image.
    if arr.ndim >= 3 and arr.shape[-1] not in (3, 4):
        arr = arr[0]

    arr = arr.astype(np.float32)
    lo, hi = np.percentile(arr, 0.5), np.percentile(arr, 99.5)
    if hi <= lo:
        lo, hi = float(arr.min()), float(arr.max() or 1.0)
    arr = np.clip((arr - lo) / (hi - lo) * 255.0, 0, 255).astype(np.uint8)

    if getattr(ds, "PhotometricInterpretation", "") == "MONOCHROME1":
        arr = 255 - arr

    mode = "L" if arr.ndim == 2 else "RGB"
    img = Image.fromarray(arr, mode=mode).convert("RGB")

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


class ProcessedImage:
    __slots__ = ("data", "media_type", "width", "height")

    def __init__(self, data: bytes, media_type: str, width: int, height: int):
        self.data = data
        self.media_type = media_type
        self.width = width
        self.height = height


def process_image(path: Path, extension: str) -> ProcessedImage:
    """Reads the uploaded file and returns a ready-to-serve image.

    Raises UnsupportedImageError if the file can't be interpreted.
    """
    extension = extension.lower()

    if extension in DICOM_EXTENSIONS or _looks_like_dicom(path):
        try:
            data = _dicom_to_png_bytes(path)
        except Exception as exc:
            raise UnsupportedImageError(str(exc)) from exc
        with Image.open(io.BytesIO(data)) as im:
            w, h = im.size
        return ProcessedImage(data=data, media_type="image/png", width=w, height=h)

    if extension in SVG_EXTENSIONS:
        data = path.read_bytes()
        return ProcessedImage(data=data, media_type="image/svg+xml", width=0, height=0)

    # Flat raster readable by Pillow (JPEG, PNG, BMP, WebP, single-page TIFF, ...)
    try:
        with Image.open(path) as im:
            im.seek(0)
            w, h = im.size
            if extension in (".jpg", ".jpeg"):
                data = path.read_bytes()
                media_type = "image/jpeg"
            elif extension == ".png":
                data = path.read_bytes()
                media_type = "image/png"
            else:
                buffer = io.BytesIO()
                im.convert("RGB").save(buffer, format="PNG")
                data = buffer.getvalue()
                media_type = "image/png"
    except Exception as exc:
        raise UnsupportedImageError(str(exc)) from exc

    return ProcessedImage(data=data, media_type=media_type, width=w, height=h)
