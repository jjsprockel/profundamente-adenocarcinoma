import { ClipboardList } from 'lucide-react'
import type { ExperienceLevel, RespondentSurvey } from '@/types'
import { EXPERIENCE_LEVEL_OPTIONS } from '@/data/respondentSurvey'

interface RespondentSurveyStepProps {
  value: RespondentSurvey
  onChange: (patch: Partial<RespondentSurvey>) => void
  onContinue: () => void
}

export function isRespondentSurveyComplete(value: RespondentSurvey): boolean {
  if (value.identification.trim() === '') return false
  if (value.experienceLevel === null) return false
  if (value.hasPulmonaryPathologyExperience === null) return false
  if (value.experienceLevel === 'graduado') {
    return value.yearsAsPathologist !== null && value.yearsAsPathologist >= 0
  }
  return true
}

export default function RespondentSurveyStep({ value, onChange, onContinue }: RespondentSurveyStepProps) {
  const isComplete = isRespondentSurveyComplete(value)

  return (
    <div className="flex-1 flex items-center justify-center overflow-y-auto scrollbar-thin px-8 py-10">
      <div className="max-w-xl w-full glass-panel rounded-3xl p-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList aria-hidden="true" size={14} strokeWidth={2} className="text-primary/80" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary/80">
              Antes de comenzar
            </span>
          </div>
          <h2 className="text-xl font-black font-headline text-on-surface">
            Cuéntenos sobre usted
          </h2>
          <p className="mt-2 text-sm font-body text-on-surface/60 leading-relaxed">
            Esta información se registra de forma anonimizada y se incluye en el reporte
            diagnóstico final, junto con los resultados de la sesión.
          </p>
        </div>

        {/* Identificación */}
        <div className="space-y-2">
          <label htmlFor="respondent-identification" className="block text-xs font-bold font-headline text-on-surface/80">
            Identificación (anonimizado)
          </label>
          <input
            id="respondent-identification"
            type="text"
            data-testid="survey-identification"
            value={value.identification}
            onChange={e => onChange({ identification: e.target.value })}
            placeholder="Ej. Residente-03 o código asignado — no use su nombre real"
            className="w-full px-4 py-3 rounded-lg bg-surface-container-highest/40 text-on-surface placeholder:text-on-surface/30 text-sm font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>

        {/* Experiencia */}
        <div className="space-y-2">
          <span className="block text-xs font-bold font-headline text-on-surface/80">Experiencia</span>
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_LEVEL_OPTIONS.map(option => (
              <ChoiceButton
                key={option.value}
                label={option.label}
                isSelected={value.experienceLevel === option.value}
                testId={`survey-experience-${option.value}`}
                onClick={() => {
                  const patch: Partial<RespondentSurvey> = { experienceLevel: option.value as ExperienceLevel }
                  if (option.value !== 'graduado') patch.yearsAsPathologist = null
                  onChange(patch)
                }}
              />
            ))}
          </div>
        </div>

        {/* Experiencia en patología pulmonar */}
        <div className="space-y-2">
          <span className="block text-xs font-bold font-headline text-on-surface/80">
            ¿Tiene experiencia en patología pulmonar?
          </span>
          <div className="grid grid-cols-2 gap-2">
            <ChoiceButton
              label="Sí"
              isSelected={value.hasPulmonaryPathologyExperience === true}
              testId="survey-pulmonary-experience-yes"
              onClick={() => onChange({ hasPulmonaryPathologyExperience: true })}
            />
            <ChoiceButton
              label="No"
              isSelected={value.hasPulmonaryPathologyExperience === false}
              testId="survey-pulmonary-experience-no"
              onClick={() => onChange({ hasPulmonaryPathologyExperience: false })}
            />
          </div>
        </div>

        {/* Años de experiencia como patólogo — solo si es graduado */}
        {value.experienceLevel === 'graduado' && (
          <div className="space-y-2">
            <label htmlFor="respondent-years" className="block text-xs font-bold font-headline text-on-surface/80">
              Años de experiencia como patólogo
            </label>
            <input
              id="respondent-years"
              type="number"
              min={0}
              step={1}
              data-testid="survey-years-as-pathologist"
              value={value.yearsAsPathologist ?? ''}
              onChange={e => {
                const raw = e.target.value
                onChange({ yearsAsPathologist: raw === '' ? null : Math.max(0, Number(raw)) })
              }}
              placeholder="Ej. 5"
              className="w-full px-4 py-3 rounded-lg bg-surface-container-highest/40 text-on-surface placeholder:text-on-surface/30 text-sm font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onContinue}
          disabled={!isComplete}
          data-testid="continue-respondent-survey"
          className={[
            'w-full py-3 rounded-lg font-black text-sm transition-all font-headline',
            isComplete
              ? 'bg-primary text-on-primary shadow-amber hover:shadow-amber-lg active:scale-95'
              : 'bg-surface-container-highest/30 text-on-surface/20 cursor-not-allowed',
          ].join(' ')}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

interface ChoiceButtonProps {
  label: string
  isSelected: boolean
  testId: string
  onClick: () => void
}

function ChoiceButton({ label, isSelected, testId, onClick }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-pressed={isSelected}
      className={[
        'px-4 py-3 rounded-lg text-sm font-body text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        isSelected
          ? 'bg-primary/15 text-on-surface ring-1 ring-primary/40'
          : 'bg-surface-container-highest/40 hover:bg-surface-container-highest text-on-surface/80 hover:text-on-surface',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
