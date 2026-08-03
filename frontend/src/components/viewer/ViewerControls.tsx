import { ZoomIn, ZoomOut, Scan, Expand, RotateCcw, Maximize, Minimize, type LucideIcon } from 'lucide-react'

interface ViewerControlsProps {
  disabled: boolean
  canZoomIn: boolean
  canZoomOut: boolean
  isFullscreen: boolean
  onZoomOut: () => void
  onShowActualSize: () => void
  onZoomIn: () => void
  onFitToScreen: () => void
  onReset: () => void
  onToggleFullscreen: () => void
}

export default function ViewerControls({
  disabled,
  canZoomIn,
  canZoomOut,
  isFullscreen,
  onZoomOut,
  onShowActualSize,
  onZoomIn,
  onFitToScreen,
  onReset,
  onToggleFullscreen,
}: ViewerControlsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-surface-container-high/80 backdrop-blur-sm rounded-xl px-2 py-2 shadow-deep">
      <ControlButton
        icon={ZoomOut}
        label="Alejar imagen"
        shortLabel="Alejar"
        testId="zoom-out"
        onClick={onZoomOut}
        disabled={disabled || !canZoomOut}
      />
      <ControlButton
        icon={Scan}
        label="Mostrar tamaño real"
        shortLabel="100 %"
        testId="actual-size"
        onClick={onShowActualSize}
        disabled={disabled}
      />
      <ControlButton
        icon={ZoomIn}
        label="Acercar imagen"
        shortLabel="Acercar"
        testId="zoom-in"
        onClick={onZoomIn}
        disabled={disabled || !canZoomIn}
      />

      <div className="w-px h-6 bg-outline-variant/20 mx-1" />

      <ControlButton
        icon={Expand}
        label="Ajustar imagen al visor"
        shortLabel="Ajustar"
        testId="fit-to-screen"
        onClick={onFitToScreen}
        disabled={disabled}
      />
      <ControlButton
        icon={RotateCcw}
        label="Restablecer vista"
        shortLabel="Restablecer"
        testId="reset-view"
        onClick={onReset}
        disabled={disabled}
      />

      <div className="w-px h-6 bg-outline-variant/20 mx-1" />

      <ControlButton
        icon={isFullscreen ? Minimize : Maximize}
        label={isFullscreen ? 'Salir de pantalla completa' : 'Entrar en pantalla completa'}
        shortLabel={isFullscreen ? 'Salir' : 'Completa'}
        testId="fullscreen-toggle"
        onClick={onToggleFullscreen}
        pressed={isFullscreen}
      />
    </div>
  )
}

interface ControlButtonProps {
  icon: LucideIcon
  label: string
  shortLabel: string
  testId: string
  onClick: () => void
  disabled?: boolean
  pressed?: boolean
}

function ControlButton({ icon: Icon, label, shortLabel, testId, onClick, disabled, pressed }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      data-testid={testId}
      className="flex flex-col items-center gap-0.5 text-on-surface/50 hover:text-primary transition-colors px-2.5 py-1 rounded-lg disabled:opacity-30 disabled:pointer-events-none aria-pressed:text-primary"
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
      <span className="font-mono text-[9px] uppercase whitespace-nowrap">{shortLabel}</span>
    </button>
  )
}
