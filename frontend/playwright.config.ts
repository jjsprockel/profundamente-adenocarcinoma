import { defineConfig } from '@playwright/test'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Directorio del backend, para levantarlo junto con el build de producción
// del frontend (vite preview) durante la prueba de funcionamiento offline.
const BACKEND_DIR = resolve(__dirname, '../backend')

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: [
    {
      command: `"${BACKEND_DIR}/.venv/bin/uvicorn" app.main:app --host 127.0.0.1 --port 8000`,
      cwd: BACKEND_DIR,
      url: 'http://127.0.0.1:8000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      // Sirve exactamente el build de producción (dist/), no el servidor de desarrollo.
      command: 'npm run preview -- --port 4173 --strictPort',
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
})
