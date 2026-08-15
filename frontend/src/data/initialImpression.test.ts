import { describe, it, expect } from 'vitest'
import { INITIAL_IMPRESSION_OPTIONS, getInitialImpressionLabel, impressionMatchesResult } from './initialImpression'

describe('getInitialImpressionLabel', () => {
  it('resolves a letter to its label', () => {
    expect(getInitialImpressionLabel('B')).toBe('Acinar')
  })

  it('returns null for null input', () => {
    expect(getInitialImpressionLabel(null)).toBeNull()
  })

  it('returns null for an unknown letter', () => {
    expect(getInitialImpressionLabel('Z')).toBeNull()
  })

  it('every option resolves to itself', () => {
    for (const option of INITIAL_IMPRESSION_OPTIONS) {
      expect(getInitialImpressionLabel(option.letter)).toBe(option.text)
    }
  })
})

describe('impressionMatchesResult', () => {
  it('matches when the pattern name contains the impression, case-insensitively', () => {
    expect(impressionMatchesResult('Acinar', 'Adenocarcinoma con patrón acinar')).toBe(true)
    expect(impressionMatchesResult('acinar', 'Adenocarcinoma con patrón ACINAR')).toBe(true)
  })

  it('matches special subtypes phrased without "patrón"', () => {
    expect(impressionMatchesResult('Mucinoso invasivo', 'Adenocarcinoma mucinoso invasivo')).toBe(true)
    expect(impressionMatchesResult('Coloide', 'Adenocarcinoma coloide')).toBe(true)
  })

  it('does not match a different pattern', () => {
    expect(impressionMatchesResult('Sólido', 'Adenocarcinoma con patrón acinar')).toBe(false)
  })
})
