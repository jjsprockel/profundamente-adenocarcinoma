export interface InitialImpressionOption {
  letter: string
  text: string
}

// Todas las categorías diagnósticas finales que puede producir el motor de
// reglas (rules_engine.py) — el usuario elige su impresión visual inicial
// entre las mismas opciones posibles, antes de responder el cuestionario
// estructurado. No se usa como entrada del motor de reglas: solo se conserva
// para comparar contra el resultado final en el reporte.
export const INITIAL_IMPRESSION_OPTIONS: InitialImpressionOption[] = [
  { letter: 'A', text: 'Lepídico' },
  { letter: 'B', text: 'Acinar' },
  { letter: 'C', text: 'Papilar' },
  { letter: 'D', text: 'Micropapilar' },
  { letter: 'E', text: 'Sólido' },
  { letter: 'F', text: 'Mucinoso invasivo' },
  { letter: 'G', text: 'Coloide' },
  { letter: 'H', text: 'Fetal' },
  { letter: 'I', text: 'Entérico' },
  { letter: 'J', text: 'No tengo una impresión clara / indeterminado' },
]

export function getInitialImpressionLabel(letter: string | null): string | null {
  if (!letter) return null
  return INITIAL_IMPRESSION_OPTIONS.find(o => o.letter === letter)?.text ?? null
}

// Loose match: the rules engine's main_pattern is phrased differently from
// the gestalt option label (e.g. "Adenocarcinoma con patrón acinar" vs.
// "Acinar"), so an exact comparison would never match. A substring check on
// the pattern name is close enough for a "did your first impression agree?"
// indicator — it's informational, not a scored result.
export function impressionMatchesResult(impression: string, mainPattern: string): boolean {
  return mainPattern.toLowerCase().includes(impression.toLowerCase())
}
