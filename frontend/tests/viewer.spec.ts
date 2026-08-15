import { test, expect } from '@playwright/test'
import { samplePngFile, sampleHistologyImageFile, blockExternalRequests, completeInitialImpression } from './fixtures'

/**
 * Recorre los controles enriquecidos del visor de imágenes: nombre de
 * archivo, zoom con porcentaje, tamaño real, ajustar, paneo, pantalla
 * completa, persistencia entre preguntas y reemplazo de imagen — sin
 * ninguna solicitud a un host remoto.
 */

test('el visor de imagen expone nombre, zoom, ajuste, pantalla completa y persiste entre preguntas', async ({
  page,
}) => {
  const blockedRequests = await blockExternalRequests(page)

  await page.goto('/')
  await page.locator('input[type="file"]').setInputFiles(sampleHistologyImageFile())

  // ── Nombre de archivo visible en la barra superior ────────────────────
  await expect(page.getByText('adenocarcinoma_01.png')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText(/^PNG/)).toBeVisible()

  // ── Impresión diagnóstica inicial (antes del cuestionario) ────────────
  await completeInitialImpression(page)

  const zoomIndicator = page.locator('[aria-live="polite"]')
  await expect(zoomIndicator).toBeVisible()
  await expect(page.getByTestId('zoom-in')).toBeEnabled({ timeout: 15_000 })

  const initialZoomText = await zoomIndicator.textContent()
  const initialZoom = Number(initialZoomText?.replace(' %', ''))

  // ── Acercar / alejar cambian el porcentaje mostrado ───────────────────
  await page.getByTestId('zoom-in').click()
  await expect(zoomIndicator).not.toHaveText(`${initialZoom} %`)
  const zoomedInText = await zoomIndicator.textContent()
  const zoomedIn = Number(zoomedInText?.replace(' %', ''))
  expect(zoomedIn).toBeGreaterThan(initialZoom)

  await page.getByTestId('zoom-out').click()
  await page.getByTestId('zoom-out').click()
  const zoomedOutText = await zoomIndicator.textContent()
  const zoomedOut = Number(zoomedOutText?.replace(' %', ''))
  expect(zoomedOut).toBeLessThan(zoomedIn)

  // ── "Tamaño real" lleva siempre a exactamente 100 % ───────────────────
  await page.getByTestId('actual-size').click()
  await expect(zoomIndicator).toHaveText('100 %')

  // ── "Ajustar" cambia el zoom (para este fixture 1x1, "ajustar" no es 100 %) ──
  await page.getByTestId('fit-to-screen').click()
  await expect(zoomIndicator).not.toHaveText('100 %')
  const fitZoomText = await zoomIndicator.textContent()

  // ── Paneo por arrastre no rompe el visor ──────────────────────────────
  const canvas = page.getByRole('region', { name: 'Visor de imagen histológica' })
  const box = await canvas.boundingBox()
  if (box) {
    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2
    await page.mouse.move(centerX, centerY)
    await page.mouse.down()
    await page.mouse.move(centerX + 60, centerY + 40, { steps: 5 })
    await page.mouse.up()
  }

  // ── "Restablecer" vuelve al mismo estado de ajuste inicial ────────────
  await page.getByTestId('reset-view').click()
  await expect(zoomIndicator).toHaveText(fitZoomText ?? '')

  // ── Pantalla completa: entra y sale ───────────────────────────────────
  await page.getByTestId('fullscreen-toggle').click()
  await expect(page.getByRole('button', { name: 'Salir de pantalla completa' })).toBeVisible()
  expect(await page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true)

  await page.getByTestId('fullscreen-toggle').click()
  await expect(page.getByRole('button', { name: 'Entrar en pantalla completa' })).toBeVisible()
  expect(await page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false)

  // ── El visor no se reinicia al cambiar de pregunta ────────────────────
  await page.getByTestId('zoom-in').click()
  const beforeQuestionChange = await zoomIndicator.textContent()

  await page.locator('[data-testid^="option-"]').first().click()
  await page.getByTestId('next-question').click()
  await expect(page.getByText('Pregunta A2', { exact: false })).toBeVisible()

  await expect(zoomIndicator).toHaveText(beforeQuestionChange ?? '')

  // ── Reemplazar imagen vuelve a la pantalla de carga ───────────────────
  await page.getByRole('button', { name: 'Reemplazar imagen' }).click()
  await expect(page.getByText('Sube una imagen de histopatología', { exact: true })).toBeVisible()

  // ── Ninguna solicitud debió salir a un host distinto de localhost ─────
  expect(blockedRequests, `Solicitudes remotas bloqueadas: ${blockedRequests.join(', ')}`).toEqual([])
})

test('el visor informa un error de carga y permite reintentar', async ({ page }) => {
  await page.goto('/')

  // Intercepta únicamente la descarga de la imagen (GET) y simula un fallo de
  // carga; la subida (POST /api/image/upload) debe seguir funcionando para
  // llegar al visor.
  let shouldFail = true
  await page.route('**/api/image/**', route => {
    if (shouldFail && route.request().method() === 'GET') {
      route.fulfill({ status: 500, body: 'error' })
    } else {
      route.continue()
    }
  })

  await page.locator('input[type="file"]').setInputFiles(samplePngFile())

  await expect(page.getByRole('alert')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText('No fue posible mostrar la imagen.')).toBeVisible()

  shouldFail = false
  await page.getByRole('button', { name: 'Intentar de nuevo' }).click()
  await expect(page.getByRole('alert')).not.toBeVisible()
  await expect(page.getByText('Imagen cargada')).toBeVisible({ timeout: 15_000 })
})
