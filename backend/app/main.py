import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api import image, diagnosis, export

app = FastAPI(
    title="ProfundaMente API",
    description="Motor de reglas diagnóstico para adenocarcinoma pulmonar invasivo.",
    version="0.1.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
# En desarrollo: permitir el servidor de Vite (localhost:5173).
# En producción en Render: frontend y backend comparten origen, CORS no es necesario,
# pero se deja configurable via variable de entorno para flexibilidad.
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
CORS_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── API routers (deben registrarse antes del catch-all del SPA) ───────────────
app.include_router(image.router, prefix="/api")
app.include_router(diagnosis.router, prefix="/api")
app.include_router(export.router, prefix="/api")


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok", "service": "profundamente"}


# ─── Frontend estático (producción) ───────────────────────────────────────────
# El build de Vite se copia a backend/frontend_dist/ durante el build de Render.
# En desarrollo local esto no existe y la app usa el servidor de Vite directamente.
FRONTEND_DIR = Path(__file__).parent.parent / "frontend_dist"

if FRONTEND_DIR.exists():
    # Montar assets estáticos con cache headers óptimos
    _assets_dir = FRONTEND_DIR / "assets"
    if _assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(_assets_dir)), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str) -> FileResponse:
        """
        Catch-all para el SPA de React.
        1. Intenta servir el archivo exacto (PDF embebido, favicon, etc.)
        2. Si no existe, devuelve index.html para que React Router maneje la ruta.
        """
        # Evitar path traversal
        try:
            resolved = (FRONTEND_DIR / full_path).resolve()
            resolved.relative_to(FRONTEND_DIR.resolve())
        except ValueError:
            raise HTTPException(status_code=403, detail="Acceso denegado.")

        if resolved.exists() and resolved.is_file():
            return FileResponse(str(resolved))

        index = FRONTEND_DIR / "index.html"
        if index.exists():
            return FileResponse(str(index))

        raise HTTPException(status_code=404, detail="Recurso no encontrado.")
