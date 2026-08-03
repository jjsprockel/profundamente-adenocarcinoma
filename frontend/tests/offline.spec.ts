import { test, expect } from '@playwright/test'
import { sampleHistologyImageFile, blockExternalRequests } from './fixtures'

/**
 * Verifica que la aplicación funciona por completo sin acceso a internet.
 *
 * Estrategia: se intercepta *toda* solicitud de red del navegador. Las que
 * van a localhost/127.0.0.1 (el propio frontend y el backend FastAPI) se
 * dejan pasar; cualquier otra (Google Fonts, CDNs, analítica, APIs externas)
 * se aborta como si no hubiera conexión y se registra. Al final del recorrido
 * completo (subir imagen, zoom, cuestionario, resultado, exportar PDF, nuevo
 * caso) se comprueba que la lista de solicitudes bloqueadas está vacía: la
 * app nunca intentó salir a internet.
 */

test('flujo completo funciona sin acceso a internet', async ({ page }) => {
  const blockedRequests = await blockExternalRequests(page)

  await page.goto('/')
  await page.reload()

  // ── 1. Cargar una imagen ──────────────────────────────────────────────
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles(sampleHistologyImageFile())

  await expect(page.getByTestId('next-question')).toBeVisible({ timeout: 15_000 })

  // ── 2. Controles de zoom del visor ────────────────────────────────────
  // Los controles quedan deshabilitados hasta que OpenSeadragon termina de
  // abrir la imagen (evento 'open'), no solo tras la respuesta de subida.
  await expect(page.getByTestId('zoom-in')).toBeEnabled({ timeout: 15_000 })
  await page.getByTestId('zoom-in').click()
  await page.getByTestId('zoom-out').click()
  await page.getByTestId('reset-view').click()

  // ── 3. Completar el cuestionario ───────────────────────────────────────
  // El instrumento diagnóstico tiene 18 preguntas fijas (ver
  // frontend/src/data/questionnaire.ts — 4 secciones: 5+5+5+3).
  const TOTAL_QUESTIONS = 18
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    // Salvaguarda: si el modal de resultado ya apareció (última pregunta
    // enviada), no seguir intentando interactuar con el cuestionario debajo.
    if (await page.getByTestId('export-pdf').isVisible()) break

    await page.locator('[data-testid^="option-"]').first().click()
    await page.getByTestId('next-question').click()
  }

  // ── 4. Visualizar el resultado ────────────────────────────────────────
  // La última pregunta dispara evaluateDiagnosis() (POST async al backend).
  await expect(page.getByTestId('export-pdf')).toBeVisible({ timeout: 15_000 })

  // ── 5. Exportar el PDF ─────────────────────────────────────────────────
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('export-pdf').click(),
  ])
  expect(download.suggestedFilename()).toMatch(/\.pdf$/)

  // ── 6. Iniciar un nuevo caso ───────────────────────────────────────────
  await page.getByTestId('new-case').click()
  // El input de archivo es intencionalmente display:none (se activa mediante
  // el área de arrastrar-y-soltar); comprobamos que esa zona esté de vuelta.
  await expect(page.getByText('Sube una imagen de histopatología', { exact: true })).toBeVisible()
  await expect(page.locator('input[type="file"]')).toHaveCount(1)

  // ── 7. Ninguna solicitud debió salir a un host distinto de localhost ──
  expect(blockedRequests, `Solicitudes remotas bloqueadas: ${blockedRequests.join(', ')}`).toEqual([])
})
