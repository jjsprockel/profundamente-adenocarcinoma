import type { ShortcutAction } from './viewer.types'

/** Pan/zoom limits relative to OpenSeadragon's own "fit" and "actual size" zoom. */
export const MIN_ZOOM_IMAGE_RATIO = 0.5
export const MAX_ZOOM_PIXEL_RATIO = 4
export const ZOOM_STEP_FACTOR = 1.4

const EXTENSION_LABELS: Record<string, string> = {
  jpg: 'JPEG',
  jpeg: 'JPEG',
  png: 'PNG',
  svg: 'SVG',
  tif: 'TIFF',
  tiff: 'TIFF',
  dcm: 'DICOM',
}

/** Human-readable format label derived from a file name, e.g. "adenocarcinoma.jpg" -> "JPEG". */
export function fileTypeLabel(fileName: string | undefined): string | null {
  if (!fileName) return null
  const match = /\.([a-z0-9]+)$/i.exec(fileName)
  if (!match) return null
  return EXTENSION_LABELS[match[1].toLowerCase()] ?? null
}

/** Zoom expressed as a percentage of "actual size" (1 image pixel = 1 screen pixel). */
export function computeZoomPercentage(currentZoom: number, actualSizeZoom: number): number {
  if (!Number.isFinite(actualSizeZoom) || actualSizeZoom <= 0) return 100
  return Math.round((currentZoom / actualSizeZoom) * 100)
}

/** Whether two zoom levels are close enough to be considered "the same" (for toggle logic). */
export function isApproximately(a: number, b: number, tolerance = 0.02): boolean {
  if (b === 0) return a === 0
  return Math.abs(a - b) / b <= tolerance
}

/** Keyboard shortcuts must not fire while the user is typing elsewhere in the app. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    Boolean(target.isContentEditable)
  )
}

/** Maps a keydown event's key to a viewer action, or null if the key isn't bound. */
export function resolveShortcutAction(key: string, isFullscreen: boolean): ShortcutAction | null {
  switch (key) {
    case '+':
    case '=':
      return 'zoom-in'
    case '-':
    case '_':
      return 'zoom-out'
    case '1':
      return 'actual-size'
    case '0':
      return 'fit'
    case 'r':
    case 'R':
      return 'reset'
    case 'f':
    case 'F':
      return 'fullscreen-toggle'
    case 'Escape':
      return isFullscreen ? 'fullscreen-exit' : null
    default:
      return null
  }
}
