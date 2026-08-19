import { test, expect } from '@playwright/test'
import { execFileSync } from 'child_process'
import { mkdtempSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { samplePngFile, completeInitialImpression, completeRespondentSurvey } from './fixtures'

/**
 * Verifica que el PDF exportado incluye, al final del reporte, las
 * respuestas dadas durante la sesión (pregunta + opción elegida),
 * agrupadas por dominio — y, en el encabezado, los datos del evaluador
 * capturados en el cuestionario inicial (identificación, experiencia,
 * experiencia en patología pulmonar y años como patólogo si es graduado).
 */

test('el PDF exportado incluye las respuestas del cuestionario al final', async ({ page }) => {
  await page.goto('/')
  await completeRespondentSurvey(page, {
    identification: 'QA-pdf-01',
    experienceLevel: 'graduado',
    hasPulmonaryExperience: true,
    yearsAsPathologist: 12,
  })
  await page.locator('input[type="file"]').setInputFiles(samplePngFile())
  await page.waitForSelector('[data-testid="continue-initial-impression"]', { timeout: 15_000 })
  await completeInitialImpression(page)

  // Responder siempre la primera opción disponible en cada una de las 18 preguntas
  for (let i = 0; i < 18; i++) {
    if (await page.getByTestId('export-pdf').isVisible()) break
    await page.locator('[data-testid^="option-"]').first().click()
    await page.getByTestId('next-question').click()
  }
  await expect(page.getByTestId('export-pdf')).toBeVisible({ timeout: 15_000 })

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('export-pdf').click(),
  ])

  const dir = mkdtempSync(path.join(tmpdir(), 'pdf-answers-'))
  const pdfPath = path.join(dir, 'result.pdf')
  await download.saveAs(pdfPath)

  const text = execFileSync('pdftotext', ['-layout', pdfPath, '-']).toString('utf-8')

  // Datos del evaluador, capturados antes de cargar la imagen.
  expect(text).toContain('QA-pdf-01')
  expect(text).toContain('Graduado')
  expect(text).toContain('Experiencia en patología pulmonar: Sí')
  expect(text).toContain('Años de experiencia como patólogo: 12')

  // La sección de respuestas aparece, después de las advertencias, antes del
  // aviso legal de cierre.
  expect(text).toContain('Respuestas del cuestionario')
  const answersIndex = text.indexOf('Respuestas del cuestionario')
  const disclaimerIndex = text.indexOf('uso exclusivamente académico')
  expect(answersIndex).toBeGreaterThan(-1)
  expect(disclaimerIndex).toBeGreaterThan(answersIndex)

  // Domain headers and the first question of each domain are present.
  expect(text).toContain('ARQUITECTURA')
  expect(text).toContain('CITOLOGÍA')
  expect(text).toContain('A1.')
  expect(text).toContain('¿Cuál es el patrón arquitectónico predominante en la imagen?')
  // The selected option (letter A, always clicked first) shows with its text.
  expect(text).toMatch(/→\s*A\)/)
})
