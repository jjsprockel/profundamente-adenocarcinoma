import { useImageViewer } from '@/hooks/useImageViewer'
import ViewerToolbar from './ViewerToolbar'
import ViewerCanvas from './ViewerCanvas'
import ViewerControls from './ViewerControls'
import type { ImageViewerProps } from './viewer.types'

/**
 * Orchestrates the histology image viewer: OpenSeadragon does the actual
 * pan/zoom/deep-zoom rendering (see hooks/useImageViewer.ts); this component
 * only lays out the toolbar, canvas and controls around it and stays
 * unaware of the clinical workflow (questionnaire, diagnosis, ...) — it
 * only ever receives display data and a "replace image" callback.
 */
export default function ImageViewer({ kind, imageUrl, dziUrl, fileName, onReplaceImage }: ImageViewerProps) {
  const {
    canvasRef,
    containerRef,
    imageStatus,
    zoomPercentage,
    isFullscreen,
    canZoomIn,
    canZoomOut,
    showHint,
    zoomIn,
    zoomOut,
    showActualSize,
    fitToScreen,
    reset,
    toggleFullscreen,
    retry,
  } = useImageViewer({ kind, imageUrl, dziUrl })

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Visor de imagen histológica"
        className="relative w-full h-full flex flex-col rounded-2xl overflow-hidden bg-[#05080f] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <ViewerToolbar
          fileName={fileName}
          imageStatus={imageStatus}
          zoomPercentage={zoomPercentage}
          onReplaceImage={onReplaceImage}
        />

        <ViewerCanvas canvasRef={canvasRef} imageStatus={imageStatus} showHint={showHint} onRetry={retry} />

        <ViewerControls
          disabled={imageStatus !== 'loaded'}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          isFullscreen={isFullscreen}
          onZoomOut={zoomOut}
          onShowActualSize={showActualSize}
          onZoomIn={zoomIn}
          onFitToScreen={fitToScreen}
          onReset={reset}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  )
}
