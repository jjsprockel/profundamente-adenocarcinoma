import type { DiagnosisResult, ConfidenceLevel } from '@/types'
import { exportPdf } from '@/api/client'
import { useState } from 'react'

interface ResultModalProps {
  result: DiagnosisResult
  imageFileName: string | null
  onClose: () => void
  onNewCase: () => void
}

const CONFIDENCE_STYLES: Record<ConfidenceLevel, string> = {
  alto: 'text-tertiary',
  moderado: 'text-primary',
  bajo: 'text-error',
  indeterminado: 'text-on-surface/50',
}

export default function ResultModal({ result, imageFileName, onClose, onNewCase }: ResultModalProps) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      await exportPdf(result, imageFileName ?? undefined)
    } catch {
      // Silent: error is non-blocking for the UI
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-surface-container rounded-2xl shadow-deep overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">
              Resultado diagnóstico
              {imageFileName && (
                <span className="ml-2 text-on-surface/30 normal-case tracking-normal">
                  · {imageFileName}
                </span>
              )}
            </span>
            <h2 className="text-2xl font-black font-headline text-on-surface mt-1 leading-tight">
              {result.main_pattern}
            </h2>
            {result.secondary_patterns.length > 0 && (
              <p className="text-sm text-on-surface/60 mt-1 font-body">
                Secundario: {result.secondary_patterns.join(', ')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-on-surface/40 uppercase">Confianza</span>
            <span className={`text-sm font-bold font-mono uppercase ${CONFIDENCE_STYLES[result.confidence]}`}>
              {result.confidence}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6 space-y-6">
          {/* Narrative */}
          {result.narrative && (
            <Section title="Razonamiento">
              <p className="text-sm text-on-surface/80 leading-relaxed font-body">{result.narrative}</p>
            </Section>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FindingsList title="Hallazgos arquitectónicos" items={result.architectural_findings} />
            <FindingsList title="Hallazgos citológicos" items={result.cytological_findings} />
            <FindingsList title="Hallazgos estromales" items={result.stromal_findings} />
            {result.special_features.length > 0 && (
              <FindingsList title="Características especiales" items={result.special_features} />
            )}
          </div>

          {/* Differentials */}
          {result.differentials.length > 0 && (
            <Section title="Diagnósticos diferenciales">
              <div className="flex flex-wrap gap-2">
                {result.differentials.map(d => (
                  <span
                    key={d}
                    className="px-3 py-1 text-xs font-mono bg-secondary-container/40 text-on-secondary-container rounded-full"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Contradictions */}
          {result.contradictions.length > 0 && (
            <Section title="Contradicciones detectadas">
              <ul className="space-y-1">
                {result.contradictions.map((c, i) => (
                  <li key={i} className="text-xs font-mono text-error flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">warning</span>
                    {c}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Missing findings hint */}
          {result.missing_findings_hint && (
            <Section title="Hallazgo sugerido">
              <p className="text-xs font-mono text-on-surface/60">{result.missing_findings_hint}</p>
            </Section>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="bg-surface-container-high/60 rounded-xl p-4 space-y-2">
              {result.warnings.map((w, i) => (
                <p key={i} className="text-[11px] font-mono text-on-surface/50 leading-relaxed">
                  ⚠ {w}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-8 py-5 border-t border-outline-variant/10 flex gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-highest hover:bg-surface-bright text-on-surface text-sm font-bold rounded-lg transition-all font-headline disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            {exporting ? 'Exportando...' : 'Exportar PDF'}
          </button>

          <button
            type="button"
            onClick={onNewCase}
            className="flex-1 py-2.5 bg-primary text-on-primary font-black text-sm rounded-lg shadow-amber hover:shadow-amber-lg active:scale-95 transition-all font-headline"
          >
            Nuevo caso
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-surface-container-highest hover:bg-surface-bright text-on-surface/60 hover:text-on-surface text-sm font-bold rounded-lg transition-all font-headline"
          >
            Revisar respuestas
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-mono uppercase tracking-widest text-on-surface/40">{title}</h4>
      {children}
    </div>
  )
}

function FindingsList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <Section title={title}>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-on-surface/70 font-body flex items-start gap-1.5">
            <span className="text-primary mt-0.5 flex-shrink-0">·</span>
            {item}
          </li>
        ))}
      </ul>
    </Section>
  )
}
