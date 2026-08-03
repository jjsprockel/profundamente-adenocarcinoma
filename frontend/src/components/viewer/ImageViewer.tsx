import { useEffect, useRef } from 'react'
import OpenSeadragon from 'openseadragon'
import { ZoomIn, ZoomOut, RotateCcw, type LucideIcon } from 'lucide-react'
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
        <ControlButton
          icon={ZoomIn}
          label="Acercar"
          testId="zoom-in"
          onClick={() => viewerRef.current?.viewport.zoomBy(1.4)}
        />
        <ControlButton
          icon={ZoomOut}
          label="Alejar"
          testId="zoom-out"
          onClick={() => viewerRef.current?.viewport.zoomBy(0.7)}
        />
        <div className="w-px h-6 bg-outline-variant/20 mx-1" />
        <ControlButton
          icon={RotateCcw}
          label="Restablecer"
          testId="reset-view"
          onClick={() => viewerRef.current?.viewport.goHome()}
        />
      </div>
    </div>
  )
}

interface ControlButtonProps {
  icon: LucideIcon
  label: string
  testId: string
  onClick: () => void
}

function ControlButton({ icon: Icon, label, testId, onClick }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      data-testid={testId}
      className="flex flex-col items-center gap-0.5 text-on-surface/50 hover:text-primary transition-colors px-2 py-1 rounded"
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
      <span className="font-mono text-[9px] uppercase">{label}</span>
    </button>
  )
}
