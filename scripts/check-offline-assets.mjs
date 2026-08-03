#!/usr/bin/env node
/**
 * Falla si el frontend contiene referencias de red a hosts remotos
 * (CDN, Google Fonts, analytics, APIs externas, etc).
 *
 * La aplicación debe funcionar completamente offline en tiempo de ejecución:
 * este script es el guardrail que impide que vuelva a colarse una dependencia
 * remota (p. ej. un <link> a fonts.googleapis.com) en un commit futuro.
 *
 * Uso: node scripts/check-offline-assets.mjs   (desde la raíz del repo)
 *      node ../scripts/check-offline-assets.mjs (desde frontend/, vía npm script)
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname, basename, resolve } from 'node:path'

const cwd = process.cwd()
const FRONTEND_DIR = basename(cwd) === 'frontend' ? cwd : resolve(cwd, 'frontend')

// Rutas del frontend a auditar (relativas a FRONTEND_DIR), según el alcance
// definido para esta comprobación.
const TARGETS = ['src', 'index.html', 'vite.config.ts', 'public']

const SKIP_DIRS = new Set(['node_modules', 'dist', '.vite'])

// Solo se inspeccionan archivos de texto; binarios (png, pdf, woff2, ...) se omiten.
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.html', '.svg'])

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

// Excepciones explícitas y documentadas: identificadores de espacio de nombres
// XML/SVG y de esquema, que no son solicitudes de red aunque parezcan URLs.
const ALLOWED_URL_PATTERNS = [
  /^https?:\/\/www\.w3\.org\//, // xmlns de SVG/XHTML
  /^https?:\/\/schemas\.microsoft\.com\//, // xmlns del descriptor Deep Zoom (.dzi)
]

const URL_RE = /https?:\/\/[^\s"'`)]+/g

function isTextFile(path) {
  return TEXT_EXTENSIONS.has(extname(path).toLowerCase())
}

function walk(path, violations) {
  let stat
  try {
    stat = statSync(path)
  } catch {
    return // el objetivo no existe (p. ej. no hay carpeta public) — se omite
  }

  if (stat.isDirectory()) {
    if (SKIP_DIRS.has(basename(path))) return
    for (const entry of readdirSync(path)) {
      walk(join(path, entry), violations)
    }
    return
  }

  if (!isTextFile(path)) return
  checkFile(path, violations)
}

function checkFile(path, violations) {
  const content = readFileSync(path, 'utf-8')
  content.split('\n').forEach((line, i) => {
    const matches = line.match(URL_RE)
    if (!matches) return
    for (const url of matches) {
      if (ALLOWED_URL_PATTERNS.some(re => re.test(url))) continue

      let hostname = null
      try {
        hostname = new URL(url).hostname
      } catch {
        // URL malformada (p. ej. cortada por el split de línea); se reporta igual
      }
      if (hostname && LOCAL_HOSTS.has(hostname)) continue

      violations.push({ path, line: i + 1, url })
    }
  })
}

const violations = []
for (const target of TARGETS) {
  walk(join(FRONTEND_DIR, target), violations)
}

if (violations.length > 0) {
  console.error('✖ check:offline — referencias remotas no permitidas encontradas:\n')
  for (const v of violations) {
    console.error(`  ${v.path}:${v.line}  →  ${v.url}`)
  }
  console.error(
    '\nEl frontend debe funcionar completamente offline en tiempo de ejecución.\n' +
      'Elimine la dependencia remota, o si es una excepción legítima (p. ej. un\n' +
      'espacio de nombres XML), agréguela y documente el motivo en\n' +
      'ALLOWED_URL_PATTERNS dentro de scripts/check-offline-assets.mjs.',
  )
  process.exit(1)
}

console.log('✓ check:offline — no se encontraron referencias remotas en el frontend.')
