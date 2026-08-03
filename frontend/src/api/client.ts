import type { DiagnosisResult, ImageKind } from '@/types'

const BASE = '/api'

// ─── Image ────────────────────────────────────────────────────────────────────

export interface UploadImageResponse {
  session_id: string
  kind: ImageKind
  image_url: string
  dzi_url: string | null
  width: number | null
  height: number | null
}

export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE}/image/upload`, { method: 'POST', body: form })
  if (!res.ok) {
    const detail = await res.json().catch(() => null)
    throw new Error(detail?.detail ?? `Upload failed: ${res.statusText}`)
  }
  return res.json() as Promise<UploadImageResponse>
}

// ─── Diagnosis ────────────────────────────────────────────────────────────────

export async function evaluateDiagnosis(
  sessionId: string,
  answers: Record<string, string>,
): Promise<DiagnosisResult> {
  const res = await fetch(`${BASE}/diagnosis/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, answers }),
  })
  if (!res.ok) throw new Error(`Evaluation failed: ${res.statusText}`)
  return res.json() as Promise<DiagnosisResult>
}

// ─── PDF Export ───────────────────────────────────────────────────────────────

export async function exportPdf(result: DiagnosisResult, imageFileName?: string): Promise<void> {
  const res = await fetch(`${BASE}/export/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result, image_filename: imageFileName ?? null }),
  })
  if (!res.ok) throw new Error(`PDF export failed: ${res.statusText}`)

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  // Use the image filename as the base for the PDF download name
  const baseName = imageFileName
    ? imageFileName.replace(/\.[^.]+$/, '')
    : 'resultado-diagnostico'
  a.download = `${baseName}-diagnostico.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
