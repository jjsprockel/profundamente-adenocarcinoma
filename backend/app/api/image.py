import io
import re
import tempfile
import uuid
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, Response

from app.models.schemas import ImageUploadResponse
from app.services import slide_service

router = APIRouter(prefix="/image", tags=["image"])

# In-memory session store: {session_id: SlideSession}
_sessions: dict[str, slide_service.SlideSession] = {}

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".svg", ".tif", ".tiff", ".dcm"}
CONTENT_TYPE_TO_EXTENSION = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/tiff": ".tiff",
    "application/dicom": ".dcm",
}
# Whole-slide images (SVS/NDPI/pyramidal TIFF) routinely reach several GB.
MAX_FILE_SIZE_MB = 4096
CHUNK_SIZE = 1024 * 1024

TILE_NAME_RE = re.compile(r"^(?P<col>\d+)_(?P<row>\d+)\.(?P<fmt>\w+)$")


def _resolve_extension(filename: str | None, content_type: str | None) -> str:
    ext = Path(filename or "").suffix.lower()
    if ext in ALLOWED_EXTENSIONS:
        return ext
    return CONTENT_TYPE_TO_EXTENSION.get(content_type or "", "")


def _get_session(session_id: str) -> slide_service.SlideSession:
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Imagen no encontrada.")
    return session


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(file: UploadFile = File(...)) -> ImageUploadResponse:
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
        session = slide_service.open_slide_session(path, extension)
    except Exception as exc:
        path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=400,
            detail="No se pudo interpretar el archivo. Verifique que sea una imagen "
            "válida (JPEG, PNG, SVG, TIFF o DICOM).",
        ) from exc

    session_id = str(uuid.uuid4())
    _sessions[session_id] = session

    return ImageUploadResponse(
        session_id=session_id,
        kind=session.kind,
        image_url=f"/api/image/{session_id}",
        dzi_url=f"/api/image/{session_id}.dzi" if session.kind == "dzi" else None,
        width=session.width or None,
        height=session.height or None,
    )


# NOTE: the `.dzi` and `_files` routes must be registered before the plain
# `/{session_id}` route below — otherwise its catch-all path parameter would
# swallow those requests first, since a path segment allows dots.


@router.get("/{session_id}.dzi")
async def get_dzi_descriptor(session_id: str) -> Response:
    session = _get_session(session_id)
    if session.kind != "dzi":
        raise HTTPException(status_code=400, detail="Esta imagen no es una diapositiva piramidal.")
    return Response(content=slide_service.get_dzi_xml(session), media_type="application/xml")


@router.get("/{session_id}_files/{level}/{tile_name}")
async def get_dzi_tile(session_id: str, level: int, tile_name: str) -> Response:
    session = _get_session(session_id)
    if session.kind != "dzi":
        raise HTTPException(status_code=404, detail="Diapositiva no encontrada.")

    match = TILE_NAME_RE.match(tile_name)
    if not match:
        raise HTTPException(status_code=400, detail="Nombre de tile inválido.")

    try:
        tile = slide_service.get_tile(session, level, int(match["col"]), int(match["row"]))
    except KeyError:
        raise HTTPException(status_code=404, detail="Tile fuera de rango.")

    buffer = io.BytesIO()
    tile.save(buffer, format="JPEG", quality=85)
    return Response(content=buffer.getvalue(), media_type="image/jpeg")


@router.get("/{session_id}")
async def get_image(session_id: str) -> FileResponse:
    session = _get_session(session_id)

    if session.kind == "dzi":
        thumbnail = slide_service.get_thumbnail(session)
        thumb_path = Path(tempfile.mkstemp(suffix=".png")[1])
        thumbnail.save(thumb_path, format="PNG")
        return FileResponse(thumb_path, media_type="image/png")

    return FileResponse(session.display_path, media_type=session.display_media_type)
