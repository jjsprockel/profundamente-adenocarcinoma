import { describe, it, expect } from 'vitest'
import {
  getSectionStatus,
  getCompletedSectionIds,
  getIntegrationStatus,
  hasValidAnswer,
} from './sectionStatus'
import type { Section, AnswerMap } from '@/types'

const SECTION_IDS = ['architecture', 'cytology', 'stroma'] as const

function statusesFor(
  currentSectionId: string | null,
  completedSectionIds: string[],
  currentPhase: 'upload' | 'questionnaire' | 'result' = 'questionnaire',
) {
  return SECTION_IDS.map(sectionId =>
    getSectionStatus({ sectionId, currentPhase, currentSectionId, completedSectionIds }),
  )
}

describe('hasValidAnswer', () => {
  it('treats undefined and null as unanswered', () => {
    expect(hasValidAnswer(undefined)).toBe(false)
  })

  it('treats any option letter as answered', () => {
    expect(hasValidAnswer('A')).toBe(true)
  })
})

describe('getSectionStatus', () => {
  // Caso 1: fase de carga — ninguna sección activa
  it('marks no section as active during the upload phase', () => {
    const statuses = statusesFor('architecture', [], 'upload')
    expect(statuses).toEqual(['pending', 'pending', 'pending'])
    expect(statuses.filter(s => s === 'active')).toHaveLength(0)
  })

  // Caso 2: primera pregunta — primera sección activa, las demás pendientes
  it('marks only the first section as active on the first question', () => {
    const statuses = statusesFor('architecture', [])
    expect(statuses).toEqual(['active', 'pending', 'pending'])
  })

  // Caso 3: avance de sección — anterior completada, actual activa, posteriores pendientes
  it('marks only the current section as active, previous as completed, rest as pending', () => {
    const statuses = statusesFor('cytology', ['architecture'])
    expect(statuses).toEqual(['completed', 'active', 'pending'])
    expect(statuses.filter(s => s === 'active')).toHaveLength(1)
  })

  // Caso 4: retroceso — sección revisada activa aunque ya esté completamente respondida
  it('marks a revisited, fully-answered section as active rather than completed', () => {
    const statuses = statusesFor('architecture', ['architecture', 'cytology'])
    expect(statuses).toEqual(['active', 'completed', 'pending'])
  })

  // Caso 5: pregunta sin respuesta — la sección no se marca completada y permanece activa
  it('keeps an in-progress section active, not completed, while unanswered', () => {
    const statuses = statusesFor('cytology', [])
    expect(statuses).toEqual(['pending', 'active', 'pending'])
  })

  // Caso 6: todas las preguntas contestadas — todos los dominios completados
  it('marks every domain completed once all sections are done', () => {
    const statuses = statusesFor(null, [...SECTION_IDS], 'questionnaire')
    expect(statuses).toEqual(['completed', 'completed', 'completed'])
    expect(statuses.filter(s => s === 'active')).toHaveLength(0)
  })

  // Caso 7: resultado — todos completados, ningún dominio clínico activo
  it('shows no active clinical domain during the result phase', () => {
    const statuses = statusesFor('stroma', [...SECTION_IDS], 'result')
    expect(statuses).toEqual(['completed', 'completed', 'completed'])
    expect(statuses.filter(s => s === 'active')).toHaveLength(0)
  })

  it('never reports more than one active section', () => {
    const statuses = statusesFor('cytology', ['architecture'])
    expect(statuses.filter(s => s === 'active')).toHaveLength(1)
  })
})

describe('getCompletedSectionIds', () => {
  const sections: Section[] = [
    { id: 'a', label: 'A', questions: [{ id: 'q1', text: '', options: [] }, { id: 'q2', text: '', options: [] }] },
    { id: 'b', label: 'B', questions: [{ id: 'q3', text: '', options: [] }] },
  ]

  it('requires every question in a section to be answered', () => {
    const answers: AnswerMap = { q1: 'A' } // q2 missing
    expect(getCompletedSectionIds(sections, answers)).toEqual([])
  })

  it('marks a section completed only once all its questions are answered', () => {
    const answers: AnswerMap = { q1: 'A', q2: 'B' }
    expect(getCompletedSectionIds(sections, answers)).toEqual(['a'])
  })

  it('does not retroactively mark a section incomplete when navigation moves on', () => {
    const answers: AnswerMap = { q1: 'A', q2: 'B', q3: 'A' }
    expect(getCompletedSectionIds(sections, answers)).toEqual(['a', 'b'])
  })
})

describe('getIntegrationStatus', () => {
  it('is pending during upload', () => {
    expect(getIntegrationStatus('upload')).toBe('pending')
  })

  it('is pending during questionnaire (no distinct integration phase in this app)', () => {
    expect(getIntegrationStatus('questionnaire')).toBe('pending')
  })

  it('is completed once a result exists', () => {
    expect(getIntegrationStatus('result')).toBe('completed')
  })
})
