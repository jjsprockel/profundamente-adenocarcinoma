import { Microscope, Replace } from 'lucide-react'
import { fileTypeLabel } from './viewer.utils'
import type { ImageLoadStatus } from './viewer.types'

interface ViewerToolbarProps {
  fileName?: string
  imageStatus: ImageLoadStatus
  zoomPercentage: number
  onReplaceImage?: () => void
}

const STATUS_LABEL: Record<ImageLoadStatus, string> = {
  loading: 'Cargando imagen…',
  loaded: 'Imagen cargada',
  error: 'Error al cargar',
}

export default function ViewerToolbar({
  fileName,
  imageStatus,
  zoomPercentage,
  onReplaceImage,
}: ViewerToolbarProps) {
  const typeLabel = fileTypeLabel(fileName)

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-surface-container-high/60 border-b border-outline-variant/10">
      <div className="flex items-center gap-2.5 min-w-0">
        <Microscope aria-hidden="true" size={16} strokeWidth={1.8} className="text-primary flex-shrink-0" />
        <div className="min-w-0 leading-tight">
          <p className="text-xs font-bold text-on-surface font-headline truncate max-w-[280px]" title={fileName}>
            {fileName ?? 'Imagen histológica'}
          </p>
          <p className="text-[10px] font-mono text-on-surface/40 uppercase tracking-wider">
            {[typeLabel, STATUS_LABEL[imageStatus]].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          aria-live="polite"
          className="font-mono text-xs text-on-surface/60 tabular-nums min-w-[3.5rem] text-right"
        >
          {imageStatus === 'loaded' ? `${zoomPercentage} %` : '—'}
        </span>

        {onReplaceImage && (
          <button
            type="button"
            onClick={onReplaceImage}
            aria-label="Reemplazar imagen"
            title="Reemplazar imagen"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider text-on-surface/50 hover:text-primary hover:bg-surface-container-highest transition-colors"
          >
            <Replace aria-hidden="true" size={14} strokeWidth={1.8} />
            Reemplazar
          </button>
        )}
      </div>
    </div>
  )
}
