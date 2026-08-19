import { describe, it, expect } from 'vitest'
import { SECTIONS, ALL_QUESTION_IDS, buildAnsweredQuestions } from './questionnaire'

describe('buildAnsweredQuestions', () => {
  it('returns nothing when there are no answers', () => {
    expect(buildAnsweredQuestions({})).toEqual([])
  })

  it('enriches an answer with section label, question text and selected option text', () => {
    const answered = buildAnsweredQuestions({ A1: 'B' })

    expect(answered).toEqual([
      {
        sectionLabel: 'Arquitectura',
        questionId: 'A1',
        questionText: SECTIONS[0].questions[0].text,
        selectedLetter: 'B',
        selectedText: 'Glándulas o acinos bien formados con lumen reconocible',
      },
    ])
  })

  it('preserves questionnaire order regardless of answer insertion order', () => {
    const answered = buildAnsweredQuestions({ C1: 'A', A1: 'A' })
    expect(answered.map(a => a.questionId)).toEqual(['A1', 'C1'])
  })

  it('ignores unanswered questions and unknown question IDs', () => {
    const answered = buildAnsweredQuestions({ A1: 'A', NOPE: 'X' })
    expect(answered).toHaveLength(1)
    expect(answered[0].questionId).toBe('A1')
  })

  it('falls back to an empty selected text for an unknown option letter', () => {
    const answered = buildAnsweredQuestions({ A1: 'Z' })
    expect(answered[0].selectedText).toBe('')
  })

  it('produces one entry per answered question when the full questionnaire is completed', () => {
    const fullAnswers = Object.fromEntries(ALL_QUESTION_IDS.map(id => [id, 'A']))
    const answered = buildAnsweredQuestions(fullAnswers)
    expect(answered).toHaveLength(ALL_QUESTION_IDS.length)
  })
})
