import type { Page } from '@playwright/test'

// PNG 1x1 embebido en base64 — evita depender de un archivo binario en el repo.
const SAMPLE_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

export function samplePngFile(name = 'sample.png') {
  return { name, mimeType: 'image/png', buffer: Buffer.from(SAMPLE_PNG_BASE64, 'base64') }
}

// 320x240 PNG (a filled ellipse on a solid background) embebido en base64.
// Las pruebas de zoom del visor necesitan dimensiones realistas: con una
// imagen de 1x1, "ajustar a pantalla" ya excede el límite máximo de zoom.
const SAMPLE_HISTOLOGY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAUAAAADwCAIAAAD+Tyo8AAAFt0lEQVR4nO3b220jRxCG0baxcfhZQTiODXIj2nD8QIPgUrwO59J/1TkBECNWfd0jAfrrn69/B5Dp76MfAFhOwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBDsx9EPwEd+fa3wIT9/r/AhHELAGVYJ9d0PF/b8BDypTYtd9gx6npCAZzFDsY/peUICPtL80T5w+fBiPoqADxDd7U3nn0jJOxPwfup1+52SdybgzXXo9jsl70PAG+qZ7pXTlyDjjQh4fbr9zoW8EQGvSbpPuZDXJeB1SPctMl6LgD8l3cVk/DkBLyfdVcj4EwJeQrqrk/EyAn6PdDcl43f5h/43qHcfvufXuYFfYqV25ip+kRv4OfUexTf/lBv4EQt0OFfxY27gu9Q7D7O4xw18g3WZkKv4JjfwNfXOzHSuCPgP9mN+ZnTJK/T/rEUQr9NnbuAx1JvJ1IaAhz1IZnbdA7YB6ZpPsHXAzWdfRuc59g2489TraTvNpgG3nXdhPWfaMeCek+6g4WTbBdxwxq10m2+vgLtNt6dWU24UcKu5Ntdn1l0C7jNRTppMvEXATWbJlQ5zbxEwVFU/4A7HMPeUn37xgMvPj6dq70DlgGtPjtcV3oTKAUN5ZQMufOiyQNV9qBlw1WnxiZJbUTNgaKJgwCUPWlZRbzeqBVxvQqyr2IZUCxhaKRVwscOVjVTak1IBQzd1Aq50rLK1MttSJ2BoqEjAZQ5UdlNjZ4oEDD1VCLjGUcr+CmxOhYChLQFDsPiAC7wFcaD0/YkPGDoTMATLDjj9/YcZRG9RdsDQnIAhWHDA0W8+TCV3l4IDBgQMwQQMwVIDzv2lhTmFblRqwMAQMEQTMAQTMAQTMAQTMASLDDj0D4ZMLnGvIgMGTgQMwQQMwQQMwQQMwQQMwQQMwQQMwQQMwQQMwQQMwQQMwQQMwQQMwSID/vn76CegosS9igwYOBEwBBMwBBMwBBMwBEsNOPEPhswsdKNSAwaGgCGagCFYcMChv7QwodxdCg4YEDAEyw44982HeURvUXbA0JyAIVh8wNHvPxwufX/iA4bOBAzBKgSc/hbEUQpsToWAoa0iARc4StlZjZ0pEjD0VCfgGgcq+yizLXUChoZKBVzmWGVTlfakVMDQTbWAKx2ubKHYhlQLeJSbECuqtxsFA4Y+agZc76DlcyW3ombAo+i0WKzqPpQNGDqoHHDVQ5d3Fd6EygGP0pPjRbV3oHjAo/r8eKz89OsHDIW1CLj8McxNHebeIuDRY5ZcajLxLgGPNhNldJp1o4BHp7l21mrKvQIezabbULf5tgt49JtxHw0n2zHg0XLS5fWcadOAR9d5V9V2mn0DHo2nXkznObYOePSefQ3NJ9g94NF+A6KZnYDHsAeZTG2M8ePoB5jFaRt+fR39HLxAumdu4D/YjPmZ0SUBX7MfMzOdK16hb/A6PSHp3uQGvsvGzMMs7nEDP+IqPpx0H3MDP2eHjuKbf8oN/BJX8c6k+yI38Bts1T58z69zA7/HVbwp6b5LwEvIeHXSXUbAy8l4FdL9hIA/JePFpPs5Aa9Dxm+R7loEvCYZPyXddQl4fecdVfKZbjci4A25kId0NybgzfW8kHW7DwHvp0PJut2ZgA9Qr2TdHkXAR7rc+7iYRTsDAc/iqocJe1bshAQ8qRl6Vuz8BJzhXkurhC3UXALOpr3m/EM/BBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBBMwBPsPL4374KUPR58AAAAASUVORK5CYII='

export function sampleHistologyImageFile(name = 'adenocarcinoma_01.png') {
  return { name, mimeType: 'image/png', buffer: Buffer.from(SAMPLE_HISTOLOGY_PNG_BASE64, 'base64') }
}

/**
 * After uploading an image, the app shows a one-off "initial impression"
 * step (pick a gestalt pattern from the full option list) before the
 * structured questionnaire appears. Every e2e flow that uploads an image
 * must clear it first.
 */
export async function completeInitialImpression(page: Page) {
  await page.locator('[data-testid^="option-"]').first().click()
  await page.getByTestId('continue-initial-impression').click()
}

interface RespondentSurveyFixtureOptions {
  identification?: string
  experienceLevel?: 'graduado' | 'residente_1' | 'residente_2' | 'residente_3'
  hasPulmonaryExperience?: boolean
  yearsAsPathologist?: number
}

/**
 * Before the upload screen is even reachable, the app gates behind a
 * one-off respondent survey (identification + experience level). Every
 * e2e flow must clear it first, right after `page.goto('/')`.
 */
export async function completeRespondentSurvey(
  page: Page,
  {
    identification = 'QA-e2e',
    experienceLevel = 'residente_2',
    hasPulmonaryExperience = true,
    yearsAsPathologist,
  }: RespondentSurveyFixtureOptions = {},
) {
  await page.getByTestId('survey-identification').fill(identification)
  await page.getByTestId(`survey-experience-${experienceLevel}`).click()
  await page.getByTestId(
    hasPulmonaryExperience ? 'survey-pulmonary-experience-yes' : 'survey-pulmonary-experience-no',
  ).click()
  if (experienceLevel === 'graduado') {
    await page.getByTestId('survey-years-as-pathologist').fill(String(yearsAsPathologist ?? 5))
  }
  await page.getByTestId('continue-respondent-survey').click()
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1'])

/**
 * Aborts any request to a non-local host (simulating no internet access) and
 * returns the running list of what got blocked, so a test can assert it's
 * empty at the end — i.e. the app never tried to reach outside localhost.
 */
export async function blockExternalRequests(page: Page): Promise<string[]> {
  const blocked: string[] = []
  await page.route('**/*', route => {
    const url = new URL(route.request().url())
    if (LOCAL_HOSTS.has(url.hostname)) {
      route.continue()
      return
    }
    blocked.push(`${route.request().method()} ${url.toString()}`)
    route.abort('internetdisconnected')
  })
  return blocked
}
