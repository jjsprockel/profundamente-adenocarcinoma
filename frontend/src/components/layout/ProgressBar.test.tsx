import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from './ProgressBar'
import { SECTIONS } from '@/data/questionnaire'

describe('ProgressBar', () => {
  it('renders a single current step while answering the questionnaire', () => {
    render(
      <ProgressBar
        currentPhase="questionnaire"
        currentSectionId="citologia"
        completedSectionIds={['arquitectura']}
        answeredQuestionsCount={6}
        totalQuestions={18}
      />,
    )

    expect(screen.getAllByRole('generic', { current: 'step' })).toHaveLength(1)
  })

  it('shows every domain label from the questionnaire data', () => {
    render(
      <ProgressBar
        currentPhase="questionnaire"
        currentSectionId="arquitectura"
        completedSectionIds={[]}
        answeredQuestionsCount={0}
        totalQuestions={18}
      />,
    )

    for (const section of SECTIONS) {
      expect(screen.getByText(section.label)).toBeInTheDocument()
    }
    expect(screen.getByText('Integración')).toBeInTheDocument()
  })

  it('marks completed sections accessibly, distinct from the active one', () => {
    render(
      <ProgressBar
        currentPhase="questionnaire"
        currentSectionId="citologia"
        completedSectionIds={['arquitectura']}
        answeredQuestionsCount={6}
        totalQuestions={18}
      />,
    )

    expect(screen.getByLabelText('Arquitectura: sección completada')).toBeInTheDocument()
    expect(screen.getByLabelText('Citología: sección actual')).toBeInTheDocument()
    expect(screen.getByLabelText('Estroma y Microambiente: sección pendiente')).toBeInTheDocument()
  })

  it('shows no active step and no completed domains during the upload phase', () => {
    render(
      <ProgressBar
        currentPhase="upload"
        currentSectionId={null}
        completedSectionIds={[]}
        answeredQuestionsCount={0}
        totalQuestions={18}
      />,
    )

    expect(screen.queryAllByRole('generic', { current: 'step' })).toHaveLength(0)
    for (const section of SECTIONS) {
      expect(screen.getByLabelText(`${section.label}: sección pendiente`)).toBeInTheDocument()
    }
  })

  it('completes every domain and the integration step once a result exists, with none active', () => {
    const completedSectionIds = SECTIONS.map(s => s.id)
    render(
      <ProgressBar
        currentPhase="result"
        currentSectionId={null}
        completedSectionIds={completedSectionIds}
        answeredQuestionsCount={18}
        totalQuestions={18}
      />,
    )

    expect(screen.queryAllByRole('generic', { current: 'step' })).toHaveLength(0)
    for (const section of SECTIONS) {
      expect(screen.getByLabelText(`${section.label}: sección completada`)).toBeInTheDocument()
    }
    expect(screen.getByLabelText('Integración: sección completada')).toBeInTheDocument()
  })

  it('renders the numeric progress indicator', () => {
    render(
      <ProgressBar
        currentPhase="questionnaire"
        currentSectionId="arquitectura"
        completedSectionIds={[]}
        answeredQuestionsCount={6}
        totalQuestions={18}
      />,
    )

    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '6')
    expect(progress).toHaveAttribute('aria-valuemax', '18')
    expect(screen.getByText('6 de 18 preguntas respondidas')).toBeInTheDocument()
  })
})
