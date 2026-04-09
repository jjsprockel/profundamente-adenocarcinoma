import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

interface ImageViewerProps {
  imageUrl: string
}

export default function ImageViewer({ imageUrl }: ImageViewerProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={10}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Viewer area */}
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="flex items-center justify-center"
            >
              <img
                src={imageUrl}
                alt="Imagen histopatológica"
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />
            </TransformComponent>

            {/* Controls overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface-container-high/80 backdrop-blur-sm rounded-xl px-3 py-2">
              <ControlButton icon="zoom_in" label="Acercar" onClick={() => zoomIn()} />
              <ControlButton icon="zoom_out" label="Alejar" onClick={() => zoomOut()} />
              <div className="w-px h-6 bg-outline-variant/20 mx-1" />
              <ControlButton icon="restart_alt" label="Restablecer" onClick={() => resetTransform()} />
            </div>
          </>
        )}
      </TransformWrapper>
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
