from fastapi import APIRouter
from fastapi.responses import Response
from app.models.schemas import PdfRequest
from app.services.pdf_service import generate_pdf

router = APIRouter(prefix="/export", tags=["export"])


@router.post("/pdf")
async def export_pdf(request: PdfRequest) -> Response:
    pdf_bytes = generate_pdf(request.result, image_filename=request.image_filename)

    # Build a safe filename for the download
    base = request.image_filename.rsplit(".", 1)[0] if request.image_filename else "resultado-diagnostico"
    safe_base = "".join(c if c.isalnum() or c in "-_." else "_" for c in base)
    download_name = f"{safe_base}-diagnostico.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
    )
