import type { AppPhase } from '@/types'

const DOMAINS = [
  { id: 'arquitectura', label: 'Arquitectura' },
  { id: 'citologia', label: 'Citología' },
  { id: 'estroma', label: 'Estroma' },
  { id: 'especiales', label: 'Características Especiales' },
  { id: 'integracion', label: 'Integración' },
]

interface ProgressBarProps {
  completedSections: string[]
  currentPhase: AppPhase
}

export default function ProgressBar({ completedSections, currentPhase }: ProgressBarProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 glass-header z-40 flex items-center px-12">
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute top-[10px] left-0 right-0 h-[2px] bg-surface-container-highest -z-10" />

        {DOMAINS.map(domain => {
          const isComplete = completedSections.includes(domain.id)
          const isActive = currentPhase !== 'upload' && !isComplete

          return (
            <div key={domain.id} className="flex flex-col items-center gap-2">
              <div
                className={[
                  'w-5 h-5 rounded-full border-4 border-background transition-all duration-500',
                  isComplete
                    ? 'bg-primary shadow-amber'
                    : isActive
                      ? 'bg-surface-container-high border-primary/40'
                      : 'bg-surface-container-highest',
                ].join(' ')}
              />
              <span
                className={[
                  'font-mono text-[9px] uppercase tracking-wider transition-colors duration-300 text-center max-w-[80px] leading-tight',
                  isComplete
                    ? 'text-primary'
                    : 'text-on-surface/30',
                ].join(' ')}
              >
                {domain.label}
              </span>
            </div>
          )
        })}
      </div>
    </footer>
  )
}
