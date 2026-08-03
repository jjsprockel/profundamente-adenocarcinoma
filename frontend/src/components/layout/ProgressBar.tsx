import type { AppPhase } from '@/types'
import { SECTIONS } from '@/data/questionnaire'
import { getSectionStatus, getIntegrationStatus, type SectionStatus } from '@/lib/sectionStatus'

const DOMAINS = SECTIONS.map(section => ({ id: section.id, label: section.label }))
const INTEGRATION_LABEL = 'Integración'

interface ProgressBarProps {
  currentPhase: AppPhase
  currentSectionId: string | null
  completedSectionIds: string[]
  answeredQuestionsCount: number
  totalQuestions: number
}

export default function ProgressBar({
  currentPhase,
  currentSectionId,
  completedSectionIds,
  answeredQuestionsCount,
  totalQuestions,
}: ProgressBarProps) {
  const integrationStatus = getIntegrationStatus(currentPhase)

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 glass-header z-40 flex flex-col justify-center gap-2 px-12 py-3">
      <nav
        aria-label="Progreso del cuestionario"
        className="w-full max-w-3xl mx-auto flex items-center justify-between relative"
      >
        {/* Connector line */}
        <div className="absolute top-[10px] left-0 right-0 h-[2px] bg-surface-container-highest -z-10" />

        {DOMAINS.map(domain => {
          const status = getSectionStatus({
            sectionId: domain.id,
            currentPhase,
            currentSectionId,
            completedSectionIds,
          })
          return <DomainNode key={domain.id} label={domain.label} status={status} />
        })}

        <DomainNode label={INTEGRATION_LABEL} status={integrationStatus} />
      </nav>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-valuenow={answeredQuestionsCount}
        aria-valuetext={`${answeredQuestionsCount} de ${totalQuestions} preguntas respondidas`}
        className="text-center font-mono text-[9px] text-on-surface/30 uppercase tracking-wider"
      >
        {answeredQuestionsCount} de {totalQuestions} preguntas respondidas
      </div>
    </footer>
  )
}

function getAccessibleStatus(status: SectionStatus): string {
  switch (status) {
    case 'active':
      return 'sección actual'
    case 'completed':
      return 'sección completada'
    default:
      return 'sección pendiente'
  }
}

const NODE_CLASSES: Record<SectionStatus, string> = {
  completed: 'bg-primary shadow-amber',
  active: 'bg-surface-container-high border-primary/40',
  pending: 'bg-surface-container-highest',
}

const LABEL_CLASSES: Record<SectionStatus, string> = {
  completed: 'text-primary',
  active: 'text-on-surface',
  pending: 'text-on-surface/30',
}

interface DomainNodeProps {
  label: string
  status: SectionStatus
}

function DomainNode({ label, status }: DomainNodeProps) {
  return (
    <div
      className="flex flex-col items-center gap-2"
      aria-current={status === 'active' ? 'step' : undefined}
      aria-label={`${label}: ${getAccessibleStatus(status)}`}
    >
      <div
        className={[
          'w-5 h-5 rounded-full border-4 border-background transition-all duration-500',
          NODE_CLASSES[status],
        ].join(' ')}
      />
      <span
        className={[
          'font-mono text-[9px] uppercase tracking-wider transition-colors duration-300 text-center max-w-[80px] leading-tight',
          LABEL_CLASSES[status],
        ].join(' ')}
      >
        {label}
      </span>
    </div>
  )
}
