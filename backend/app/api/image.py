import base64
import tempfile
import uuid
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.models.schemas import ImageUploadResponse
from app.services import slide_service

router = APIRouter(prefix="/image", tags=["image"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".svg", ".tif", ".tiff", ".dcm"}
CONTENT_TYPE_TO_EXTENSION = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/tiff": ".tiff",
    "application/dicom": ".dcm",
}
# Kept comfortably under the ~4.5 MB request-body limit of a Vercel
# serverless function. This is only a cap on the *uploaded* bytes — some
# formats (WebP, BMP, flat TIFF) get re-encoded as lossless PNG, which can
# come out larger than the original, so the actual response size is
# enforced separately below via MAX_RESPONSE_B64_BYTES.
MAX_FILE_SIZE_MB = 3
CHUNK_SIZE = 512 * 1024

# Vercel's ~4.5 MB response-body limit applies to the base64-encoded data
# URI, not the raw image bytes (base64 inflates size by ~33%). Stay under
# it with headroom for the small JSON wrapper (session_id, kind, etc.).
MAX_RESPONSE_B64_BYTES = 4 * 1024 * 1024


def _resolve_extension(filename: str | None, content_type: str | None) -> str:
    ext = Path(filename or "").suffix.lower()
    if ext in ALLOWED_EXTENSIONS:
        return ext
    return CONTENT_TYPE_TO_EXTENSION.get(content_type or "", "")


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(file: UploadFile = File(...)) -> ImageUploadResponse:
    """Validates, converts if needed, and returns the image inline as a data
    URI — there is no follow-up "fetch the image" request and no server-side
    session to keep track of, so this works the same whether it's served by
    a long-running process or a stateless serverless function."""
    extension = _resolve_extension(file.filename, file.content_type)
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Formato no soportado. Use JPEG, PNG, SVG, TIFF/TIF o DICOM (.dcm).",
        )

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=extension)
    size = 0
    try:
        while chunk := await file.read(CHUNK_SIZE):
            size += len(chunk)
            if size > MAX_FILE_SIZE_MB * 1024 * 1024:
                raise HTTPException(
                    status_code=413,
                    detail=f"Archivo demasiado grande. Máximo {MAX_FILE_SIZE_MB} MB.",
                )
            tmp.write(chunk)
    except HTTPException:
        tmp.close()
        Path(tmp.name).unlink(missing_ok=True)
        raise
    finally:
        if not tmp.closed:
            tmp.close()

    path = Path(tmp.name)
    try:
        processed = slide_service.process_image(path, extension)
    except slide_service.UnsupportedImageError as exc:
        raise HTTPException(
            status_code=400,
            detail="No se pudo interpretar el archivo. Verifique que sea una imagen "
            "válida (JPEG, PNG, SVG, TIFF o DICOM).",
        ) from exc
    finally:
        path.unlink(missing_ok=True)

    encoded = base64.b64encode(processed.data).decode("ascii")
    if len(encoded) > MAX_RESPONSE_B64_BYTES:
        raise HTTPException(
            status_code=413,
            detail="La imagen procesada quedó demasiado grande para mostrarse "
            "(la conversión a PNG puede pesar más que el archivo original). "
            "Pruebe con una imagen más pequeña o en JPEG/PNG.",
        )
    data_uri = f"data:{processed.media_type};base64,{encoded}"

    return ImageUploadResponse(
        session_id=str(uuid.uuid4()),
        kind="simple",
        image_url=data_uri,
        dzi_url=None,
        width=processed.width or None,
        height=processed.height or None,
    )
