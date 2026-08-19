import { test, expect } from '@playwright/test'
import { samplePngFile } from './fixtures'

/**
 * Verifica el cuestionario inicial del evaluador (identificación, nivel de
 * experiencia y experiencia en patología pulmonar): aparece antes que
 * cualquier otra pantalla, exige los campos obligatorios para continuar, el
 * campo de años como patólogo solo aparece cuando se elige "Graduado", y una
 * vez completado no se vuelve a pedir en un "Nuevo caso" dentro de la misma
 * sesión.
 */

test('el cuestionario del evaluador se pide antes de subir la imagen y exige los campos requeridos', async ({
  page,
}) => {
  await page.goto('/')

  // ── Es la primera pantalla: no hay zona de carga de imagen todavía ────
  await expect(page.getByText('Cuéntenos sobre usted')).toBeVisible()
  await expect(page.locator('input[type="file"]')).toHaveCount(0)

  const continueButton = page.getByTestId('continue-respondent-survey')
  await expect(continueButton).toBeDisabled()

  // ── El campo de años solo aparece si la experiencia es "Graduado" ─────
  await expect(page.getByTestId('survey-years-as-pathologist')).toHaveCount(0)
  await page.getByTestId('survey-experience-residente_1').click()
  await expect(page.getByTestId('survey-years-as-pathologist')).toHaveCount(0)

  // Sigue deshabilitado: faltan identificación y experiencia pulmonar
  await expect(continueButton).toBeDisabled()
  await page.getByTestId('survey-identification').fill('Residente-QA')
  await expect(continueButton).toBeDisabled()
  await page.getByTestId('survey-pulmonary-experience-no').click()
  await expect(continueButton).toBeEnabled()

  // ── Cambiar a "Graduado" exige además los años de experiencia ─────────
  await page.getByTestId('survey-experience-graduado').click()
  await expect(page.getByTestId('survey-years-as-pathologist')).toBeVisible()
  await expect(continueButton).toBeDisabled()
  await page.getByTestId('survey-years-as-pathologist').fill('8')
  await expect(continueButton).toBeEnabled()

  await continueButton.click()

  // ── Ahora sí se ve la pantalla de carga, no el cuestionario del evaluador ──
  await expect(page.getByText('Sube una imagen de histopatología', { exact: true })).toBeVisible()
  await expect(page.getByText('Cuéntenos sobre usted')).not.toBeVisible()

  // ── "Nuevo caso" no vuelve a pedir el cuestionario del evaluador ──────
  await page.locator('input[type="file"]').setInputFiles(samplePngFile())
  await expect(page.getByTestId('continue-initial-impression')).toBeVisible({ timeout: 15_000 })
  await page.getByRole('button', { name: 'Nuevo caso' }).click()
  await expect(page.getByText('Sube una imagen de histopatología', { exact: true })).toBeVisible()
  await expect(page.getByText('Cuéntenos sobre usted')).not.toBeVisible()
})
