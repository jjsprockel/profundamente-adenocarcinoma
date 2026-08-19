import type { ExperienceLevel } from '@/types'

export interface ExperienceLevelOption {
  value: ExperienceLevel
  label: string
}

export const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevelOption[] = [
  { value: 'graduado', label: 'Graduado' },
  { value: 'residente_1', label: '1er año de residencia' },
  { value: 'residente_2', label: '2do año de residencia' },
  { value: 'residente_3', label: '3er año de residencia' },
]

export function getExperienceLevelLabel(level: ExperienceLevel | null): string | null {
  if (!level) return null
  return EXPERIENCE_LEVEL_OPTIONS.find(o => o.value === level)?.label ?? null
}
