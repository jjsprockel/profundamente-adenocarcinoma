import { useState } from 'react'
import type { AppPhase, AnswerMap, DiagnosisResult } from '@/types'
import Header from '@/components/layout/Header'
import AcademicBanner from '@/components/layout/AcademicBanner'
import ProgressBar from '@/components/layout/ProgressBar'
import AboutPage from '@/components/layout/AboutPage'
import ImageDropZone from '@/components/viewer/ImageDropZone'
import ImageViewer from '@/components/viewer/ImageViewer'
import QuestionPanel from '@/components/questionnaire/QuestionPanel'
import ResultModal from '@/components/results/ResultModal'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('upload')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [showAbout, setShowAbout] = useState(false)

  function handleImageLoaded(url: string, sid: string, fileName: string) {
    setImageUrl(url)
    setSessionId(sid)
    setImageFileName(fileName)
    setPhase('questionnaire')
  }

  function handleAnswer(questionId: string, letter: string) {
    setAnswers(prev => ({ ...prev, [questionId]: letter }))
  }

  function handleSectionComplete(sectionId: string) {
    setCompletedSections(prev =>
      prev.includes(sectionId) ? prev : [...prev, sectionId],
    )
  }

  function handleDiagnosis(diagResult: DiagnosisResult) {
    setResult(diagResult)
    setPhase('result')
    setCompletedSections(prev =>
      prev.includes('integracion') ? prev : [...prev, 'integracion'],
    )
  }

  function handleNewCase() {
    setPhase('upload')
    setImageUrl(null)
    setImageFileName(null)
    setSessionId(null)
    setAnswers({})
    setCompletedSections([])
    setResult(null)
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <Header onNewCase={handleNewCase} onAbout={() => setShowAbout(true)} />

      <main className="flex-1 pt-16 pb-24 flex overflow-hidden">
        {/* Left: Image area */}
        <section className="flex-1 flex items-center justify-center overflow-hidden">
          {phase === 'upload' ? (
            <ImageDropZone onImageLoaded={handleImageLoaded} />
          ) : (
            imageUrl && <ImageViewer imageUrl={imageUrl} />
          )}
        </section>

        {/* Right: Question panel */}
        <aside className="w-[450px] flex-shrink-0 border-l border-outline-variant/10 flex flex-col overflow-hidden bg-surface-container-low">
          <QuestionPanel
            phase={phase}
            answers={answers}
            sessionId={sessionId}
            onAnswer={handleAnswer}
            onSectionComplete={handleSectionComplete}
            onDiagnosis={handleDiagnosis}
          />
        </aside>
      </main>

      <AcademicBanner />
      <ProgressBar completedSections={completedSections} currentPhase={phase} />

      {result && (
        <ResultModal
          result={result}
          imageFileName={imageFileName}
          onClose={() => setPhase('questionnaire')}
          onNewCase={handleNewCase}
        />
      )}

      {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
    </div>
  )
}
