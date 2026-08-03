"""Format detection and image serving for the histopathology viewer.

Three families of input are supported:

- Pyramidal whole-slide images (SVS, NDPI, generic tiled TIFF, ...) are opened
  with OpenSlide and served as Deep Zoom tiles (``kind="dzi"``), so the
  frontend can pan/zoom multi-gigabyte slides smoothly with OpenSeadragon.
- SVG is vector and already lightweight to render in the browser, so it is
  served as-is (``kind="simple"``).
- Everything else (plain JPEG/PNG/BMP/WebP, non-pyramidal TIFF, DICOM) is
  normalized to a single PNG/JPEG and served as a simple image
  (``kind="simple"``); OpenSeadragon still provides pan/zoom for it, just
  without the multi-resolution tile pyramid.
"""

from __future__ import annotations

import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import numpy as np
import openslide
import pydicom
from openslide.deepzoom import DeepZoomGenerator
from PIL import Image

# Histopathology slides routinely exceed Pillow's default decompression-bomb
# threshold; these are trusted local academic uploads, not arbitrary web input.
Image.MAX_IMAGE_PIXELS = None

TILE_SIZE = 254
TILE_OVERLAP = 1
DZI_TILE_FORMAT = "jpeg"

SVG_EXTENSIONS = {".svg"}
DICOM_EXTENSIONS = {".dcm"}


@dataclass
class SlideSession:
    kind: str  # "dzi" | "simple"
    original_path: Path
    display_path: Optional[Path] = None
    display_media_type: Optional[str] = None
    slide: Optional[openslide.OpenSlide] = None
    dzg: Optional[DeepZoomGenerator] = None
    width: int = 0
    height: int = 0

    def close(self) -> None:
        if self.slide is not None:
            self.slide.close()


def _looks_like_dicom(path: Path) -> bool:
    try:
        with open(path, "rb") as f:
            f.seek(128)
            return f.read(4) == b"DICM"
    except OSError:
        return False


def _dicom_to_png(path: Path) -> Path:
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

    out_path = Path(tempfile.mkstemp(suffix=".png")[1])
    img.save(out_path, format="PNG")
    return out_path


def open_slide_session(path: Path, extension: str) -> SlideSession:
    extension = extension.lower()

    if extension in DICOM_EXTENSIONS or _looks_like_dicom(path):
        png_path = _dicom_to_png(path)
        with Image.open(png_path) as im:
            w, h = im.size
        return SlideSession(
            kind="simple",
            original_path=path,
            display_path=png_path,
            display_media_type="image/png",
            width=w,
            height=h,
        )

    if extension in SVG_EXTENSIONS:
        return SlideSession(
            kind="simple",
            original_path=path,
            display_path=path,
            display_media_type="image/svg+xml",
        )

    # Pyramidal whole-slide formats (SVS, NDPI, MRXS, generic tiled TIFF, ...)
    try:
        slide = openslide.OpenSlide(str(path))
        dzg = DeepZoomGenerator(slide, tile_size=TILE_SIZE, overlap=TILE_OVERLAP, limit_bounds=True)
        w, h = slide.dimensions
        return SlideSession(kind="dzi", original_path=path, slide=slide, dzg=dzg, width=w, height=h)
    except openslide.OpenSlideError:
        pass

    # Fallback: flat raster readable by Pillow (JPEG, PNG, BMP, WebP, single-page TIFF, ...)
    with Image.open(path) as im:
        im.seek(0)
        w, h = im.size
        if extension in (".jpg", ".jpeg"):
            display_path, media_type = path, "image/jpeg"
        elif extension == ".png":
            display_path, media_type = path, "image/png"
        else:
            display_path = Path(tempfile.mkstemp(suffix=".png")[1])
            im.convert("RGB").save(display_path, format="PNG")
            media_type = "image/png"

    return SlideSession(
        kind="simple",
        original_path=path,
        display_path=display_path,
        display_media_type=media_type,
        width=w,
        height=h,
    )


def get_dzi_xml(session: SlideSession) -> str:
    assert session.dzg is not None
    return session.dzg.get_dzi(DZI_TILE_FORMAT)


def get_tile(session: SlideSession, level: int, col: int, row: int) -> Image.Image:
    assert session.dzg is not None
    try:
        return session.dzg.get_tile(level, (col, row))
    except ValueError as exc:
        raise KeyError(str(exc)) from exc


def get_thumbnail(session: SlideSession, max_size: tuple[int, int] = (1024, 1024)) -> Image.Image:
    assert session.slide is not None
    return session.slide.get_thumbnail(max_size)
