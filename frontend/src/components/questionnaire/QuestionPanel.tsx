import { useState } from 'react'
import type { AppPhase, AnswerMap, DiagnosisResult } from '@/types'
import { useQuestionnaire } from '@/hooks/useQuestionnaire'
import SectionHeader from './SectionHeader'
import QuestionCard from './QuestionCard'
import { evaluateDiagnosis } from '@/api/client'

interface QuestionPanelProps {
  phase: AppPhase
  answers: AnswerMap
  sessionId: string | null
  onAnswer: (questionId: string, letter: string) => void
  onSectionComplete: (sectionId: string) => void
  onDiagnosis: (result: DiagnosisResult) => void
}

export default function QuestionPanel({
  phase,
  answers,
  sessionId,
  onAnswer,
  onSectionComplete,
  onDiagnosis,
}: QuestionPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    currentSectionIndex,
    currentQuestionIndex,
    currentSection,
    currentQuestion,
    totalQuestions,
    answeredCount,
    canGoNext,
    canGoPrev,
    isLastQuestion,
    completedSectionIds,
    goNext,
    goPrev,
  } = useQuestionnaire(answers)

  // Idle state before image is loaded
  if (phase === 'upload') {
    return (
      <div className="flex-1 flex flex-col">
        {/* Panel header */}
        <div className="p-6 border-b border-outline-variant/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              neurology
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm font-headline">Asistente de Patología</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-tertiary shadow-glow" />
              <span className="text-[10px] font-mono text-tertiary uppercase tracking-wider">
                Sistema en línea
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 flex items-start">
          <div className="bg-surface-container-high rounded-2xl rounded-tl-none p-6 shadow-xl shadow-black/20">
            <p className="text-on-surface leading-relaxed text-sm">
              Bienvenido. Sube una imagen de histopatología para comenzar la sesión de evaluación.
            </p>
            <p className="mt-4 text-on-surface/40 text-xs font-mono">
              Esperando entrada visual para análisis...
            </p>
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit() {
    if (!sessionId) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const result = await evaluateDiagnosis(sessionId, answers)
      onDiagnosis(result)
    } catch {
      setSubmitError('Error al calcular el diagnóstico. Verifique que el servidor esté activo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleAnswer(letter: string) {
    onAnswer(currentQuestion.id, letter)
    // Notify section completion if this was the last question in section
    const isLastInSection =
      currentQuestionIndex === currentSection.questions.length - 1
    if (isLastInSection && !completedSectionIds.includes(currentSection.id)) {
      onSectionComplete(currentSection.id)
    }
  }

  function handleNext() {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      goNext()
    }
  }

  const globalProgress = Math.round((answeredCount / totalQuestions) * 100)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <SectionHeader
        currentSectionIndex={currentSectionIndex}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestionsInSection={currentSection.questions.length}
      />

      {/* Question content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <QuestionCard
          question={currentQuestion}
          selectedLetter={answers[currentQuestion.id]}
          onSelect={handleAnswer}
        />
      </div>

      {/* Navigation footer */}
      <div className="p-6 border-t border-outline-variant/10 space-y-3">
        {/* Global progress */}
        <div className="flex items-center justify-between text-[10px] font-mono text-on-surface/40 mb-1">
          <span>{answeredCount} de {totalQuestions} preguntas respondidas</span>
          <span>{globalProgress}%</span>
        </div>

        {submitError && (
          <p className="text-error text-xs font-mono">{submitError}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className={[
              'flex-1 py-3 rounded-lg font-bold text-sm transition-all font-headline',
              canGoPrev
                ? 'bg-surface-container-highest text-on-surface/70 hover:text-on-surface hover:bg-surface-bright'
                : 'bg-surface-container-highest/30 text-on-surface/20 cursor-not-allowed',
            ].join(' ')}
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext || isSubmitting}
            className={[
              'flex-[2] py-3 rounded-lg font-black text-sm transition-all font-headline',
              canGoNext && !isSubmitting
                ? isLastQuestion
                  ? 'bg-primary text-on-primary shadow-amber hover:shadow-amber-lg active:scale-95'
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-bright'
                : 'bg-surface-container-highest/30 text-on-surface/20 cursor-not-allowed',
            ].join(' ')}
          >
            {isSubmitting
              ? 'Calculando...'
              : isLastQuestion
                ? 'Ver diagnóstico'
                : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}
