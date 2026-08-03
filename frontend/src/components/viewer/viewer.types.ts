import type { ImageKind } from '@/types'

export interface ImageViewerProps {
  kind: ImageKind
  imageUrl: string
  dziUrl: string | null
  /** Original file name, shown in the toolbar (e.g. "adenocarcinoma_01.jpg"). */
  fileName?: string
  /** Called when the user wants to load a different image; the viewer has no
   * opinion on what that means (new case, clear session, ...) — it just asks. */
  onReplaceImage?: () => void
}

// 'fit': whole image visible in the viewport (OpenSeadragon's "home" zoom).
// 'actual-size': 1 image pixel = 1 screen pixel.
// 'custom': the user zoomed/panned manually away from either of the above.
export type ViewMode = 'fit' | 'actual-size' | 'custom'

export type ImageLoadStatus = 'loading' | 'loaded' | 'error'

export type ShortcutAction =
  | 'zoom-in'
  | 'zoom-out'
  | 'actual-size'
  | 'fit'
  | 'reset'
  | 'fullscreen-toggle'
  | 'fullscreen-exit'
