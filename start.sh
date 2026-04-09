#!/usr/bin/env bash
# ─────────────────────────────────────────────
# PulmoPath Tutor — Script de arranque local
# Inicia backend (FastAPI) y frontend (Vite) en paralelo
# ─────────────────────────────────────────────
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
VENV_DIR="$BACKEND_DIR/.venv"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     PulmoPath Tutor · Iniciando      ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── Backend ───────────────────────────────────
echo "▶ Preparando backend..."

if [ ! -d "$VENV_DIR" ]; then
  echo "  Creando entorno virtual Python..."
  python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

echo "  Instalando dependencias Python..."
pip install -q -r "$BACKEND_DIR/requirements.txt"

echo "  Iniciando FastAPI en http://localhost:8000 ..."
cd "$BACKEND_DIR"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# ── Frontend ──────────────────────────────────
echo ""
echo "▶ Preparando frontend..."

cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
  echo "  Instalando dependencias npm..."
  npm install
fi

echo "  Iniciando Vite en http://localhost:5173 ..."
npm run dev &
FRONTEND_PID=$!

# ── Cleanup on exit ───────────────────────────
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT INT TERM

echo ""
echo "✓ Backend:  http://localhost:8000"
echo "✓ Frontend: http://localhost:5173"
echo "✓ API docs: http://localhost:8000/docs"
echo ""
echo "Presiona Ctrl+C para detener todo."
echo ""

wait
