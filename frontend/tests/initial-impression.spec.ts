import { test, expect } from '@playwright/test'
import { samplePngFile, completeRespondentSurvey } from './fixtures'
import { INITIAL_IMPRESSION_OPTIONS } from '../src/data/initialImpression'

/**
 * Verifica la impresión diagnóstica inicial: aparece antes del cuestionario,
 * lista todas las opciones posibles, exige una selección para continuar, y
 * la selección queda reflejada en el resultado final y en el PDF exportado.
 */

test('la impresión inicial se captura antes del cuestionario y aparece en el reporte final', async ({ page }) => {
  await page.goto('/')
  await completeRespondentSurvey(page)
  await page.locator('input[type="file"]').setInputFiles(samplePngFile())

  // ── Aparece antes del cuestionario, con todas las opciones posibles ────
  await expect(page.getByText('Antes de iniciar el cuestionario')).toBeVisible({ timeout: 15_000 })
  for (const option of INITIAL_IMPRESSION_OPTIONS) {
    await expect(page.getByText(option.text, { exact: true })).toBeVisible()
  }

  // ── No se puede continuar sin seleccionar ──────────────────────────────
  const continueButton = page.getByTestId('continue-initial-impression')
  await expect(continueButton).toBeDisabled()

  // ── Seleccionar "Acinar" (letra B) y continuar ─────────────────────────
  await page.locator('[data-testid="option-B"]').click()
  await expect(continueButton).toBeEnabled()
  await continueButton.click()

  // ── Ahora sí se ve el cuestionario estructurado, no la impresión inicial ──
  await expect(page.getByText('Pregunta A1', { exact: false })).toBeVisible()
  await expect(page.getByText('Antes de iniciar el cuestionario')).not.toBeVisible()

  // ── Completar el cuestionario (18 preguntas) ───────────────────────────
  for (let i = 0; i < 18; i++) {
    if (await page.getByTestId('export-pdf').isVisible()) break
    await page.locator('[data-testid^="option-"]').first().click()
    await page.getByTestId('next-question').click()
  }

  // ── La impresión inicial aparece en el resultado, con indicador de coincidencia ──
  await expect(page.getByTestId('export-pdf')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText('Impresión inicial (antes del cuestionario)')).toBeVisible()
  await expect(page.getByText('Acinar', { exact: true })).toBeVisible()
  await expect(page.getByText(/Coincide|Difiere/)).toBeVisible()

  // ── El PDF se exporta sin errores con la impresión inicial incluida ────
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('export-pdf').click(),
  ])
  expect(download.suggestedFilename()).toMatch(/\.pdf$/)

  // ── Nuevo caso: la impresión inicial se resetea ────────────────────────
  await page.getByTestId('new-case').click()
  await page.locator('input[type="file"]').setInputFiles(samplePngFile())
  await expect(page.getByText('Antes de iniciar el cuestionario')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByTestId('continue-initial-impression')).toBeDisabled()
})
