import uuid
import tempfile
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.models.schemas import ImageUploadResponse

router = APIRouter(prefix="/image", tags=["image"])

# In-memory session store: {session_id: Path}
_sessions: dict[str, Path] = {}

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
MAX_FILE_SIZE_MB = 50


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(file: UploadFile = File(...)) -> ImageUploadResponse:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Formato no soportado: {file.content_type}. Use JPEG o PNG.",
        )

    content = await file.read()

    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"Archivo demasiado grande. Máximo {MAX_FILE_SIZE_MB} MB.",
        )

    session_id = str(uuid.uuid4())
    suffix = ".jpg" if file.content_type == "image/jpeg" else ".png"

    # Save to a temporary file that persists during the server session
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(content)
    tmp.close()

    _sessions[session_id] = Path(tmp.name)

    return ImageUploadResponse(
        session_id=session_id,
        image_url=f"/api/image/{session_id}",
    )


@router.get("/{session_id}")
async def get_image(session_id: str) -> FileResponse:
    path = _sessions.get(session_id)
    if not path or not path.exists():
        raise HTTPException(status_code=404, detail="Imagen no encontrada.")
    media_type = "image/jpeg" if path.suffix == ".jpg" else "image/png"
    return FileResponse(path, media_type=media_type)
