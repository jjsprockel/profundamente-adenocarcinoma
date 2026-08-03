import type { RefObject } from 'react'
import { Loader2, ImageOff } from 'lucide-react'
import type { ImageLoadStatus } from './viewer.types'

interface ViewerCanvasProps {
  canvasRef: RefObject<HTMLDivElement | null>
  imageStatus: ImageLoadStatus
  showHint: boolean
  onRetry: () => void
}

export default function ViewerCanvas({ canvasRef, imageStatus, showHint, onRetry }: ViewerCanvasProps) {
  return (
    <div className="relative flex-1 min-h-0 bg-[#05080f]">
      {/* OpenSeadragon mounts its own canvas/tiles here */}
      <div ref={canvasRef} className="w-full h-full [&_.openseadragon-canvas]:focus:outline-none" />

      {imageStatus === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#05080f]">
          <Loader2 aria-hidden="true" size={28} strokeWidth={1.8} className="text-primary animate-spin" />
          <p className="text-xs font-mono text-on-surface/50">Cargando imagen…</p>
        </div>
      )}

      {imageStatus === 'error' && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#05080f] px-8 text-center"
        >
          <ImageOff aria-hidden="true" size={32} strokeWidth={1.6} className="text-error" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-on-surface font-headline">
              No fue posible mostrar la imagen.
            </p>
            <p className="text-xs text-on-surface/50 font-body max-w-xs">
              Verifique que el archivo sea un formato válido (JPEG, PNG, SVG, TIFF o DICOM) e intente nuevamente.
            </p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2 bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-bold rounded-lg transition-all font-headline"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {showHint && imageStatus === 'loaded' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-surface-container-high/70 backdrop-blur-sm pointer-events-none">
          <p className="text-[10px] font-mono text-on-surface/50 whitespace-nowrap">
            Arrastre para desplazarse · Use la rueda para ampliar
          </p>
        </div>
      )}
    </div>
  )
}
