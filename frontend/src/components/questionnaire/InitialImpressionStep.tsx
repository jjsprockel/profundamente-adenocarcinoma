import { Eye } from 'lucide-react'
import { INITIAL_IMPRESSION_OPTIONS } from '@/data/initialImpression'
import OptionButton from './OptionButton'

interface InitialImpressionStepProps {
  value: string | null
  onSelect: (letter: string) => void
  onContinue: () => void
}

export default function InitialImpressionStep({ value, onSelect, onContinue }: InitialImpressionStepProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-2 mb-1">
          <Eye aria-hidden="true" size={14} strokeWidth={2} className="text-primary/80" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary/80">
            Impresión diagnóstica inicial
          </span>
        </div>
        <h2 className="text-base font-bold font-headline text-on-surface">
          Antes de iniciar el cuestionario
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4">
        <p className="text-sm font-body text-on-surface/80 leading-relaxed">
          Con base en su impresión visual general de la imagen — antes del análisis estructurado —,
          ¿cuál cree que es el patrón predominante de adenocarcinoma? Esta primera impresión quedará
          registrada en el reporte final junto con el resultado del análisis sistemático.
        </p>

        <div className="space-y-2">
          {INITIAL_IMPRESSION_OPTIONS.map(option => (
            <OptionButton
              key={option.letter}
              letter={option.letter}
              text={option.text}
              isSelected={value === option.letter}
              onClick={() => onSelect(option.letter)}
            />
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-outline-variant/10">
        <button
          type="button"
          onClick={onContinue}
          disabled={!value}
          data-testid="continue-initial-impression"
          className={[
            'w-full py-3 rounded-lg font-black text-sm transition-all font-headline',
            value
              ? 'bg-primary text-on-primary shadow-amber hover:shadow-amber-lg active:scale-95'
              : 'bg-surface-container-highest/30 text-on-surface/20 cursor-not-allowed',
          ].join(' ')}
        >
          Continuar al cuestionario
        </button>
      </div>
    </div>
  )
}
