import { useState, useCallback, useMemo } from 'react'
import { SECTIONS } from '@/data/questionnaire'
import type { AnswerMap } from '@/types'

interface UseQuestionnaireReturn {
  currentSectionIndex: number
  currentQuestionIndex: number
  currentSection: typeof SECTIONS[0]
  currentQuestion: typeof SECTIONS[0]['questions'][0]
  totalQuestions: number
  answeredCount: number
  canGoNext: boolean
  canGoPrev: boolean
  isLastQuestion: boolean
  goNext: () => void
  goPrev: () => void
  jumpToQuestion: (sectionIdx: number, questionIdx: number) => void
}

export function useQuestionnaire(answers: AnswerMap): UseQuestionnaireReturn {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const currentSection = SECTIONS[currentSectionIndex]
  const currentQuestion = currentSection.questions[currentQuestionIndex]

  const totalQuestions = useMemo(
    () => SECTIONS.reduce((acc, s) => acc + s.questions.length, 0),
    [],
  )

  const answeredCount = Object.keys(answers).length

  const canGoNext = answers[currentQuestion.id] !== undefined

  // Determine if there's a previous question to go back to
  const canGoPrev = currentSectionIndex > 0 || currentQuestionIndex > 0

  // Check if we're on the last question of all sections
  const isLastQuestion =
    currentSectionIndex === SECTIONS.length - 1 &&
    currentQuestionIndex === currentSection.questions.length - 1

  const goNext = useCallback(() => {
    if (!canGoNext) return

    const isLastInSection = currentQuestionIndex === currentSection.questions.length - 1

    if (isLastInSection) {
      if (currentSectionIndex < SECTIONS.length - 1) {
        setCurrentSectionIndex(prev => prev + 1)
        setCurrentQuestionIndex(0)
      }
      // If truly last question, the parent handles submit
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }, [canGoNext, currentQuestionIndex, currentSection.questions.length, currentSectionIndex])

  const goPrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else if (currentSectionIndex > 0) {
      const prevSection = SECTIONS[currentSectionIndex - 1]
      setCurrentSectionIndex(prev => prev - 1)
      setCurrentQuestionIndex(prevSection.questions.length - 1)
    }
  }, [currentQuestionIndex, currentSectionIndex])

  const jumpToQuestion = useCallback((sectionIdx: number, questionIdx: number) => {
    setCurrentSectionIndex(sectionIdx)
    setCurrentQuestionIndex(questionIdx)
  }, [])

  return {
    currentSectionIndex,
    currentQuestionIndex,
    currentSection,
    currentQuestion,
    totalQuestions,
    answeredCount,
    canGoNext,
    canGoPrev,
    isLastQuestion,
    goNext,
    goPrev,
    jumpToQuestion,
  }
}
