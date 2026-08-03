import { useEffect, useRef } from 'react'
import OpenSeadragon from 'openseadragon'
import type { ImageKind } from '@/types'

interface ImageViewerProps {
  kind: ImageKind
  imageUrl: string
  dziUrl: string | null
}

export default function ImageViewer({ kind, imageUrl, dziUrl }: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const tileSources =
      kind === 'dzi' && dziUrl ? dziUrl : { type: 'image' as const, url: imageUrl }

    const viewer = OpenSeadragon({
      element: containerRef.current,
      tileSources,
      showNavigationControl: false,
      showNavigator: kind === 'dzi',
      navigatorPosition: 'BOTTOM_LEFT',
      minZoomImageRatio: 0.8,
      maxZoomPixelRatio: kind === 'dzi' ? 4 : 2,
      visibilityRatio: 1,
      constrainDuringPan: true,
      animationTime: 0.4,
      gestureSettingsMouse: { clickToZoom: false },
    })
    viewerRef.current = viewer

    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
  }, [kind, imageUrl, dziUrl])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
      <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden bg-black/20" />

      {/* Controls overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface-container-high/80 backdrop-blur-sm rounded-xl px-3 py-2">
        <ControlButton icon="zoom_in" label="Acercar" onClick={() => viewerRef.current?.viewport.zoomBy(1.4)} />
        <ControlButton icon="zoom_out" label="Alejar" onClick={() => viewerRef.current?.viewport.zoomBy(0.7)} />
        <div className="w-px h-6 bg-outline-variant/20 mx-1" />
        <ControlButton
          icon="restart_alt"
          label="Restablecer"
          onClick={() => viewerRef.current?.viewport.goHome()}
        />
      </div>
    </div>
  )
}

interface ControlButtonProps {
  icon: string
  label: string
  onClick: () => void
}

function ControlButton({ icon, label, onClick }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="flex flex-col items-center gap-0.5 text-on-surface/50 hover:text-primary transition-colors px-2 py-1 rounded"
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span className="font-mono text-[9px] uppercase">{label}</span>
    </button>
  )
}
