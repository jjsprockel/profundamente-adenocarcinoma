import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import OpenSeadragon from 'openseadragon'
import type { ImageKind } from '@/types'
import type { ImageLoadStatus, ViewMode } from '@/components/viewer/viewer.types'
import {
  MIN_ZOOM_IMAGE_RATIO,
  MAX_ZOOM_PIXEL_RATIO,
  ZOOM_STEP_FACTOR,
  computeZoomPercentage,
  isApproximately,
  isEditableTarget,
  resolveShortcutAction,
} from '@/components/viewer/viewer.utils'

interface UseImageViewerOptions {
  kind: ImageKind
  imageUrl: string
  dziUrl: string | null
}

export interface UseImageViewerResult {
  canvasRef: RefObject<HTMLDivElement | null>
  containerRef: RefObject<HTMLDivElement | null>
  imageStatus: ImageLoadStatus
  viewMode: ViewMode
  zoomPercentage: number
  isFullscreen: boolean
  canZoomIn: boolean
  canZoomOut: boolean
  showHint: boolean
  dismissHint: () => void
  zoomIn: () => void
  zoomOut: () => void
  showActualSize: () => void
  fitToScreen: () => void
  reset: () => void
  toggleFullscreen: () => void
  retry: () => void
}

/**
 * Wraps an OpenSeadragon viewer instance (deep-zoom for pyramidal slides,
 * simple-image mode for everything else) with the state a richer toolbar
 * needs: zoom %, view mode, fullscreen, load/error status and keyboard
 * shortcuts. Panning and wheel/pinch zoom are OpenSeadragon's own — this
 * hook only tracks and reacts to them, it doesn't reimplement them.
 */
export function useImageViewer({ kind, imageUrl, dziUrl }: UseImageViewerOptions): UseImageViewerResult {
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null)

  const [imageStatus, setImageStatus] = useState<ImageLoadStatus>('loading')
  const [viewMode, setViewMode] = useState<ViewMode>('fit')
  const [zoom, setZoom] = useState(1)
  const [actualSizeZoom, setActualSizeZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  const zoomPercentage = computeZoomPercentage(zoom, actualSizeZoom)
  const showHint = imageStatus === 'loaded' && !hasInteracted

  const maxZoom = viewerRef.current?.viewport.getMaxZoom() ?? Infinity
  const minZoom = viewerRef.current?.viewport.getMinZoom() ?? 0
  const canZoomIn = imageStatus === 'loaded' && zoom < maxZoom * 0.999
  const canZoomOut = imageStatus === 'loaded' && zoom > minZoom * 1.001

  const dismissHint = useCallback(() => setHasInteracted(true), [])

  const zoomIn = useCallback(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    viewer.viewport.zoomBy(ZOOM_STEP_FACTOR)
    viewer.viewport.applyConstraints()
    setViewMode('custom')
    setHasInteracted(true)
  }, [])

  const zoomOut = useCallback(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    viewer.viewport.zoomBy(1 / ZOOM_STEP_FACTOR)
    viewer.viewport.applyConstraints()
    setViewMode('custom')
    setHasInteracted(true)
  }, [])

  const showActualSize = useCallback(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    viewer.viewport.zoomTo(viewer.viewport.imageToViewportZoom(1))
    viewer.viewport.applyConstraints()
    setViewMode('actual-size')
    setHasInteracted(true)
  }, [])

  const fitToScreen = useCallback(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    viewer.viewport.goHome(true)
    setViewMode('fit')
    setHasInteracted(true)
  }, [])

  // This app always opens an image already fitted to the viewport, so
  // "reset" means returning to that same initial state.
  const reset = useCallback(() => fitToScreen(), [fitToScreen])

  const retry = useCallback(() => setReloadToken(token => token + 1), [])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen().catch(() => {
        // Fullscreen can be denied by the browser/OS; the toggle button
        // simply stays in its current state, nothing else to recover.
      })
    }
  }, [])

  // ── Fullscreen state sync ──────────────────────────────────────────────
  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  // ── OpenSeadragon lifecycle ──────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return

    setImageStatus('loading')
    setViewMode('fit')
    setHasInteracted(false)

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const tileSources = kind === 'dzi' && dziUrl ? dziUrl : { type: 'image' as const, url: imageUrl }

    const viewer = OpenSeadragon({
      element: canvasRef.current,
      tileSources,
      showNavigationControl: false,
      showNavigator: kind === 'dzi',
      navigatorPosition: 'BOTTOM_LEFT',
      minZoomImageRatio: MIN_ZOOM_IMAGE_RATIO,
      maxZoomPixelRatio: MAX_ZOOM_PIXEL_RATIO,
      visibilityRatio: 1,
      constrainDuringPan: true,
      animationTime: prefersReducedMotion ? 0 : 0.15,
      gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: false },
      gestureSettingsTouch: { dblClickToZoom: false },
    })
    viewerRef.current = viewer

    function handleOpen() {
      setActualSizeZoom(viewer.viewport.imageToViewportZoom(1))
      setZoom(viewer.viewport.getZoom())
      setImageStatus('loaded')
    }
    function handleOpenFailed() {
      setImageStatus('error')
    }
    function handleZoom(event: OpenSeadragon.ZoomEvent) {
      setZoom(event.zoom)
    }
    function markCustomInteraction() {
      setViewMode('custom')
      setHasInteracted(true)
    }
    function handleDoubleClick(event: OpenSeadragon.CanvasDoubleClickEvent) {
      event.preventDefaultAction = true
      const currentActualZoom = viewer.viewport.imageToViewportZoom(1)
      if (isApproximately(viewer.viewport.getZoom(), currentActualZoom)) {
        viewer.viewport.goHome(true)
        setViewMode('fit')
      } else {
        viewer.viewport.zoomTo(currentActualZoom)
        setViewMode('actual-size')
      }
      setHasInteracted(true)
    }

    viewer.addHandler('open', handleOpen)
    viewer.addHandler('open-failed', handleOpenFailed)
    viewer.addHandler('zoom', handleZoom)
    viewer.addHandler('canvas-drag', markCustomInteraction)
    viewer.addHandler('canvas-scroll', markCustomInteraction)
    viewer.addHandler('canvas-pinch', markCustomInteraction)
    viewer.addHandler('canvas-double-click', handleDoubleClick)

    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
  }, [kind, imageUrl, dziUrl, reloadToken])

  // ── Keyboard shortcuts, only while the viewer itself holds focus ────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return
      const action = resolveShortcutAction(event.key, isFullscreen)
      if (!action) return

      event.preventDefault()
      switch (action) {
        case 'zoom-in':
          zoomIn()
          break
        case 'zoom-out':
          zoomOut()
          break
        case 'actual-size':
          showActualSize()
          break
        case 'fit':
          fitToScreen()
          break
        case 'reset':
          reset()
          break
        case 'fullscreen-toggle':
          toggleFullscreen()
          break
        case 'fullscreen-exit':
          document.exitFullscreen()
          break
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, zoomIn, zoomOut, showActualSize, fitToScreen, reset, toggleFullscreen])

  // ── Re-fit on container resize (sidebar width change, fullscreen, ...) ──
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      if (viewMode === 'fit' && viewerRef.current) {
        viewerRef.current.viewport.goHome(true)
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [viewMode])

  return {
    canvasRef,
    containerRef,
    imageStatus,
    viewMode,
    zoomPercentage,
    isFullscreen,
    canZoomIn,
    canZoomOut,
    showHint,
    dismissHint,
    zoomIn,
    zoomOut,
    showActualSize,
    fitToScreen,
    reset,
    toggleFullscreen,
    retry,
  }
}
