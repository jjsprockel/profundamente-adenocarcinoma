import type { Question } from '@/types'
import OptionButton from './OptionButton'

interface QuestionCardProps {
  question: Question
  selectedLetter: string | undefined
  onSelect: (letter: string) => void
}

export default function QuestionCard({ question, selectedLetter, onSelect }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      {/* Question ID badge + text */}
      <div className="space-y-2">
        <span className="inline-block text-[10px] font-mono text-on-surface/40 uppercase tracking-widest">
          Pregunta {question.id}
        </span>
        <p className="text-sm font-body text-on-surface leading-relaxed">
          {question.text}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map(option => (
          <OptionButton
            key={option.letter}
            letter={option.letter}
            text={option.text}
            isSelected={selectedLetter === option.letter}
            onClick={() => onSelect(option.letter)}
          />
        ))}
      </div>
    </div>
  )
}
