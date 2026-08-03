// PNG 1x1 embebido en base64 — evita depender de un archivo binario en el repo.
const SAMPLE_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

export function samplePngFile(name = 'sample.png') {
  return { name, mimeType: 'image/png', buffer: Buffer.from(SAMPLE_PNG_BASE64, 'base64') }
}
