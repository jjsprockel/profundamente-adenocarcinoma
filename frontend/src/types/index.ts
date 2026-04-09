// ─── Questionnaire ───────────────────────────────────────────────────────────

export interface QuestionOption {
  letter: string
  text: string
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

export type AppPhase =
  | 'upload'        // Initial: waiting for image
  | 'questionnaire' // Image loaded, answering questions
  | 'result'        // Diagnosis computed

export interface AppState {
  phase: AppPhase
  imageUrl: string | null
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
