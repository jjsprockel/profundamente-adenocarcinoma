interface OptionButtonProps {
  letter: string
  text: string
  isSelected: boolean
  onClick: () => void
}

export default function OptionButton({ letter, text, isSelected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        isSelected
          ? 'bg-primary/15 text-on-surface'
          : 'bg-surface-container-highest/40 hover:bg-surface-container-highest text-on-surface/80 hover:text-on-surface',
      ].join(' ')}
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
  )
}
