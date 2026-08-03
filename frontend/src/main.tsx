import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fuentes empaquetadas localmente (sin dependencia de Google Fonts / CDN).
// Solo se incluyen los pesos realmente usados en la interfaz (ver tailwind.config.ts)
// y los subconjuntos latin/latin-ext (suficientes para español/inglés), para no
// empaquetar cirílico, griego o vietnamita innecesariamente.
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-700.css'
import '@fontsource/inter/latin-900.css'
import '@fontsource/inter/latin-ext-900.css'
import '@fontsource/space-grotesk/latin-700.css'
import '@fontsource/space-grotesk/latin-ext-700.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-ext-400.css'
import '@fontsource/jetbrains-mono/latin-700.css'
import '@fontsource/jetbrains-mono/latin-ext-700.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
