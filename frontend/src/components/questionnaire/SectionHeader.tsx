import { SECTIONS } from '@/data/questionnaire'

interface SectionHeaderProps {
  currentSectionIndex: number
  currentQuestionIndex: number
  totalQuestionsInSection: number
}

export default function SectionHeader({
  currentSectionIndex,
  currentQuestionIndex,
  totalQuestionsInSection,
}: SectionHeaderProps) {
  const section = SECTIONS[currentSectionIndex]

  return (
    <div className="px-6 pt-5 pb-4 border-b border-outline-variant/10">
      {/* Section label + counter */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-primary/80">
          Sección {currentSectionIndex + 1} de {SECTIONS.length}
        </span>
        <span className="text-[10px] font-mono text-on-surface/30">
          {currentQuestionIndex + 1} / {totalQuestionsInSection}
        </span>
      </div>

      <h2 className="text-base font-bold font-headline text-on-surface">
        {section.label}
      </h2>

      {/* Progress within section */}
      <div className="mt-3 h-[2px] bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{
            width: `${((currentQuestionIndex + 1) / totalQuestionsInSection) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
