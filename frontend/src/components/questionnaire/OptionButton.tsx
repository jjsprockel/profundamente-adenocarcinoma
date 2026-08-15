import HelpPopover from './HelpPopover'
import type { QuestionOptionHelp } from '@/types'

interface OptionButtonProps {
  letter: string
  text: string
  help?: QuestionOptionHelp
  isSelected: boolean
  onClick: () => void
}

export default function OptionButton({ letter, text, help, isSelected, onClick }: OptionButtonProps) {
  return (
    <div
      className={[
        'w-full flex items-start gap-2 px-4 py-3 rounded-lg transition-all duration-200',
        isSelected
          ? 'bg-primary/15 text-on-surface'
          : 'bg-surface-container-highest/40 hover:bg-surface-container-highest text-on-surface/80 hover:text-on-surface',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onClick}
        data-testid={`option-${letter}`}
        className="flex-1 min-w-0 text-left flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
      >
        {/* Letter badge */}
        <span
          className={[
            'flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono transition-colors',
            isSelected
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high text-on-surface/60',
          ].join(' ')}
        >
          {letter}
        </span>

        {/* Option text */}
        <span className="text-sm leading-relaxed font-body">{text}</span>
      </button>

      {/* Help popover — only if this option has help content; click-only, never selects the option */}
      {help && (
        <div className="flex-shrink-0 pt-0.5" onClick={event => event.stopPropagation()}>
          <HelpPopover help={help} />
        </div>
      )}
    </div>
  )
}
