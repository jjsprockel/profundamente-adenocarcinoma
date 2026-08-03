import { test, expect } from '@playwright/test'
import { samplePngFile } from './fixtures'

/**
 * Verifica que la barra de progreso nunca muestra más de un dominio activo
 * a la vez, y que refleja con precisión: carga, avance de sección, retroceso,
 * y el estado final de integración/resultado.
 */

test('la barra de progreso muestra exactamente un paso activo a la vez', async ({ page }) => {
  await page.goto('/')

  // ── Carga de imagen: ningún dominio debe estar activo ─────────────────
  await page.locator('input[type="file"]').setInputFiles(samplePngFile())
  await expect(page.getByTestId('next-question')).toBeVisible({ timeout: 15_000 })

  // ── Primera pregunta: solo "Arquitectura" activa ──────────────────────
  await expect(page.locator('[aria-current="step"]')).toHaveCount(1)
  await expect(page.getByLabel('Arquitectura: sección actual')).toBeVisible()
  await expect(page.getByLabel('Citología: sección pendiente')).toBeVisible()

  // ── Responder las 5 preguntas de "Arquitectura" (A1–A5) ───────────────
  for (let i = 0; i < 5; i++) {
    await page.locator('[data-testid^="option-"]').first().click()
    await page.getByTestId('next-question').click()
  }

  // ── Avance de sección: "Arquitectura" completada, "Citología" activa ──
  await expect(page.locator('[aria-current="step"]')).toHaveCount(1)
  await expect(page.getByLabel('Arquitectura: sección completada')).toBeVisible()
  await expect(page.getByLabel('Citología: sección actual')).toBeVisible()
  await expect(page.getByLabel('Estroma y Microambiente: sección pendiente')).toBeVisible()

  // ── Retroceso: volver a "Arquitectura" (5 preguntas atrás) ────────────
  const prevButton = page.getByRole('button', { name: 'Anterior', exact: true })
  for (let i = 0; i < 5; i++) {
    await prevButton.click()
  }

  // La sección revisada debe leerse como activa, no solo como completada,
  // aunque sus 5 preguntas ya tengan respuesta.
  await expect(page.locator('[aria-current="step"]')).toHaveCount(1)
  await expect(page.getByLabel('Arquitectura: sección actual')).toBeVisible()

  // ── Volver a avanzar y completar el resto del cuestionario ────────────
  const TOTAL_QUESTIONS = 18
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    if (await page.getByTestId('export-pdf').isVisible()) break
    await page.locator('[data-testid^="option-"]').first().click()
    await page.getByTestId('next-question').click()
  }

  // ── Resultado: todos los dominios completados, ninguno activo ─────────
  await expect(page.getByTestId('export-pdf')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('[aria-current="step"]')).toHaveCount(0)
  await expect(page.getByLabel('Arquitectura: sección completada')).toBeVisible()
  await expect(page.getByLabel('Citología: sección completada')).toBeVisible()
  await expect(page.getByLabel('Estroma y Microambiente: sección completada')).toBeVisible()
  await expect(page.getByLabel('Características Especiales: sección completada')).toBeVisible()
  await expect(page.getByLabel('Integración: sección completada')).toBeVisible()
})
