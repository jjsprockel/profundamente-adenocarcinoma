import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HelpCircle, X } from 'lucide-react'
import type { QuestionOptionHelp } from '@/types'

interface HelpPopoverProps {
  help: QuestionOptionHelp
}

// The panel is a scrollable list (overflow-y-auto): a plain in-flow
// `absolute bottom-full` popover gets clipped for options near the top of
// that scroll area, making the close button unreachable. Rendering into a
// portal with fixed coordinates (computed from the trigger) keeps the same
// "above the icon" placement without being clipped by any ancestor.
const POPOVER_WIDTH = 288 // w-72
const GAP = 8 // visual gap between the icon and the popover
const VIEWPORT_MARGIN = 8

interface Position {
  top: number
  left: number
}

export default function HelpPopover({ help }: HelpPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, rect.right - POPOVER_WIDTH),
      window.innerWidth - POPOVER_WIDTH - VIEWPORT_MARGIN,
    )
    // Positioned via translateY(-100%) below, so `top` is where the
    // popover's bottom edge should land — GAP px above the icon.
    setPosition({ top: rect.top - GAP, left })
  }, [isOpen])

  // Closes on click outside or Escape — never on hover. (Deliberately not on
  // scroll: the browser's own focus-into-view behavior fires a scroll event
  // right after the opening click for triggers near the edge of the panel,
  // which closed the popover before it was ever visible to the user.)
  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) {
        return
      }
      setIsOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={event => {
          event.stopPropagation()
          setIsOpen(prev => !prev)
        }}
        aria-label={`Ayuda: ${help.title}`}
        aria-expanded={isOpen}
        className="flex-shrink-0 text-slate-400 hover:text-amber-400 transition-colors"
      >
        <HelpCircle aria-hidden="true" size={14} strokeWidth={2} />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={help.title}
            onClick={event => event.stopPropagation()}
            style={{ top: position.top, left: position.left, transform: 'translateY(-100%)' }}
            className="fixed z-50 w-72 rounded-lg border border-slate-600 bg-[#1a2540] p-4 shadow-deep"
          >
            <button
              type="button"
              onClick={event => {
                event.stopPropagation()
                setIsOpen(false)
              }}
              aria-label="Cerrar ayuda"
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X aria-hidden="true" size={14} strokeWidth={2} />
            </button>

            <h4 className="text-xs font-bold text-amber-400 font-headline pr-5">{help.title}</h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed font-body">{help.body}</p>

            {help.examples && help.examples.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {help.examples.map((example, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-1.5 text-[11px] text-slate-300 font-body leading-snug"
                  >
                    <span className="text-amber-400 flex-shrink-0">·</span>
                    {example}
                  </li>
                ))}
              </ul>
            )}

            {/* Decorative arrow pointing down at the help icon */}
            <div className="absolute -bottom-[5px] right-3 w-2.5 h-2.5 bg-[#1a2540] border-b border-r border-slate-600 rotate-45" />
          </div>,
          document.body,
        )}
    </>
  )
}
