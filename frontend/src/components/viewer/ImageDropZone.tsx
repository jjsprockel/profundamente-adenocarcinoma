import { useState, useRef, useCallback } from 'react'
import { uploadImage } from '@/api/client'

interface ImageDropZoneProps {
  onImageLoaded: (url: string, sessionId: string, fileName: string) => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

export default function ImageDropZone({ onImageLoaded }: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Formato no soportado. Use JPEG o PNG.')
        return
      }
      setError(null)
      setIsLoading(true)
      try {
        const { session_id, image_url } = await uploadImage(file)
        onImageLoaded(image_url, session_id, file.name)
      } catch {
        setError('Error al cargar la imagen. Intente nuevamente.')
      } finally {
        setIsLoading(false)
      }
    },
    [onImageLoaded],
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="max-w-xl w-full px-8">
      <div className="relative group">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10 group-hover:bg-primary/10 transition-colors duration-700" />

        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={[
            'border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-8 glass-panel',
            'transition-all duration-500 cursor-pointer',
            isDragging
              ? 'border-primary/80 bg-primary/5'
              : 'border-outline-variant/30 group-hover:border-primary/40',
          ].join(' ')}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileInput}
          />

          <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center shadow-inner">
            {isLoading ? (
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                progress_activity
              </span>
            ) : (
              <span
                className="material-symbols-outlined text-4xl text-primary"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
              >
                magnification_small
              </span>
            )}
          </div>

          <div className="space-y-2 pointer-events-none">
            <p className="text-xl font-bold text-on-surface font-headline">
              {isLoading ? 'Cargando imagen...' : 'Sube una imagen de histopatología'}
            </p>
            <p className="text-sm text-on-surface/50 font-mono">
              Soporta JPEG y PNG · Arrastra o haz clic
            </p>
          </div>

          {!isLoading && (
            <button
              type="button"
              className="px-8 py-3 bg-primary text-on-primary font-black rounded-lg shadow-amber hover:shadow-amber-lg active:scale-95 transition-all font-headline pointer-events-none"
            >
              Explorar archivos
            </button>
          )}

          {error && (
            <p className="text-error text-sm font-mono">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
