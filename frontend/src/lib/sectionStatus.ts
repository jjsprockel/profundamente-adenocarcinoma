import type { AppPhase, Section, AnswerMap } from '@/types'

export type SectionStatus = 'pending' | 'active' | 'completed'

/**
 * A question is answered once it holds any option letter. Kept as an explicit
 * predicate (rather than `Boolean(value)`) so a future valid-but-falsy answer
 * value wouldn't silently read as "unanswered".
 */
export function hasValidAnswer(value: string | undefined): boolean {
  return value !== undefined && value !== null
}

export function isSectionCompleted(section: Section, answers: AnswerMap): boolean {
  return section.questions.length > 0 && section.questions.every(q => hasValidAnswer(answers[q.id]))
}

/** Derives completed sections directly from answers — the single source of truth. */
export function getCompletedSectionIds(sections: Section[], answers: AnswerMap): string[] {
  return sections.filter(section => isSectionCompleted(section, answers)).map(s => s.id)
}

interface GetSectionStatusParams {
  sectionId: string
  currentPhase: AppPhase
  currentSectionId: string | null
  completedSectionIds: string[]
}

/**
 * A section being revisited (user navigated back into an already-completed
 * section) must read as "active", not "completed" — so the active check runs
 * first and short-circuits the completed check.
 */
export function getSectionStatus({
  sectionId,
  currentPhase,
  currentSectionId,
  completedSectionIds,
}: GetSectionStatusParams): SectionStatus {
  const isActive = currentPhase === 'questionnaire' && currentSectionId === sectionId
  if (isActive) return 'active'

  const isCompleted = completedSectionIds.includes(sectionId)
  if (isCompleted) return 'completed'

  return 'pending'
}

/**
 * This app has no distinct "integration" phase — it goes straight from
 * questionnaire to result — so the integration step is only ever pending or
 * completed, never independently "active".
 */
export function getIntegrationStatus(currentPhase: AppPhase): SectionStatus {
  return currentPhase === 'result' ? 'completed' : 'pending'
}
