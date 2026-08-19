// ─── Questionnaire ───────────────────────────────────────────────────────────

export interface QuestionOptionHelp {
  title: string
  body: string
  examples?: string[]
}

export interface QuestionOption {
  letter: string
  text: string
  help?: QuestionOptionHelp
}

export interface Question {
  id: string        // e.g. "A1", "C3", "CE2"
  text: string
  options: QuestionOption[]
}

export interface Section {
  id: string        // e.g. "arquitectura"
  label: string     // e.g. "Arquitectura"
  questions: Question[]
}

// ─── Session State ────────────────────────────────────────────────────────────

export type AnswerMap = Record<string, string>  // { A1: "B", C3: "A", ... }

// A single answered question, enriched with the actual question/option text
// (not just IDs/letters) — built from SECTIONS + AnswerMap so the PDF report
// can list the session's answers without duplicating the questionnaire
// content on the backend.
export interface AnsweredQuestion {
  sectionLabel: string
  questionId: string
  questionText: string
  selectedLetter: string
  selectedText: string
}

export type AppPhase =
  | 'respondent-survey'   // Initial: identifying who's taking the session, before any image
  | 'upload'              // Waiting for image
  | 'initial-impression'  // Image loaded, gestalt pattern impression before the structured questionnaire
  | 'questionnaire'       // Answering the structured questionnaire
  | 'result'              // Diagnosis computed

// ─── Respondent survey ─────────────────────────────────────────────────────────

export type ExperienceLevel = 'graduado' | 'residente_1' | 'residente_2' | 'residente_3'

// Captured once, before the image upload screen — identifies who is taking
// the session (anonymized) and their level of experience, so it can be
// included in the PDF report. Kept separate from `answers`: it never reaches
// the rules engine, only the report.
export interface RespondentSurvey {
  identification: string
  experienceLevel: ExperienceLevel | null
  hasPulmonaryPathologyExperience: boolean | null
  // Only meaningful (and only asked) when experienceLevel === 'graduado'
  yearsAsPathologist: number | null
}

// "dzi": diapositiva piramidal grande (SVS/NDPI/TIFF piramidal) servida por tiles Deep Zoom
// "simple": imagen servida completa (JPEG/PNG/SVG/TIFF plano/DICOM convertido)
export type ImageKind = 'dzi' | 'simple'

export interface AppState {
  phase: AppPhase
  imageUrl: string | null
  dziUrl: string | null
  imageKind: ImageKind
  sessionId: string | null
  answers: AnswerMap
  currentSectionIndex: number
  currentQuestionIndex: number
}

// ─── Diagnosis ────────────────────────────────────────────────────────────────

export type ConfidenceLevel = 'alto' | 'moderado' | 'bajo' | 'indeterminado'

export interface DiagnosisResult {
  main_pattern: string
  secondary_patterns: string[]
  architectural_findings: string[]
  cytological_findings: string[]
  stromal_findings: string[]
  special_features: string[]
  differentials: string[]
  confidence: ConfidenceLevel
  narrative: string
  warnings: string[]
  contradictions: string[]
  missing_findings_hint: string | null
}
