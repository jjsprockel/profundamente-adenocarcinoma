import { useMemo, useState } from 'react'
import type { AppPhase, AnswerMap, DiagnosisResult, ImageKind } from '@/types'
import { ALL_QUESTION_IDS, SECTIONS } from '@/data/questionnaire'
import { getInitialImpressionLabel } from '@/data/initialImpression'
import { getCompletedSectionIds } from '@/lib/sectionStatus'
import Header from '@/components/layout/Header'
import AcademicBanner from '@/components/layout/AcademicBanner'
import ProgressBar from '@/components/layout/ProgressBar'
import AboutPage from '@/components/layout/AboutPage'
import ImageDropZone from '@/components/viewer/ImageDropZone'
import ImageViewer from '@/components/viewer/ImageViewer'
import InitialImpressionStep from '@/components/questionnaire/InitialImpressionStep'
import QuestionPanel from '@/components/questionnaire/QuestionPanel'
import ResultModal from '@/components/results/ResultModal'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('upload')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [dziUrl, setDziUrl] = useState<string | null>(null)
  const [imageKind, setImageKind] = useState<ImageKind>('simple')
  const [imageFileName, setImageFileName] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [visibleSectionId, setVisibleSectionId] = useState<string | null>(null)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [showAbout, setShowAbout] = useState(false)
  // Gestalt impression captured before the structured questionnaire — kept
  // entirely separate from `answers` so it never reaches the rules engine,
  // only the final report.
  const [initialImpression, setInitialImpression] = useState<string | null>(null)
  const initialImpressionLabel = getInitialImpressionLabel(initialImpression)

  // Derived, not stored: a section is "completed" exactly when every one of
  // its questions has a valid answer — never inferred from navigation order.
  const completedSectionIds = useMemo(
    () => getCompletedSectionIds(SECTIONS, answers),
    [answers],
  )
  const answeredQuestionsCount = Object.keys(answers).length

  // The progress bar must never show a domain active outside the
  // questionnaire phase (loading, or once a result exists).
  const currentSectionId = phase === 'questionnaire' ? visibleSectionId : null

  function handleImageLoaded(
    url: string,
    dzi: string | null,
    kind: ImageKind,
    sid: string,
    fileName: string,
  ) {
    setImageUrl(url)
    setDziUrl(dzi)
    setImageKind(kind)
    setSessionId(sid)
    setImageFileName(fileName)
    setPhase('initial-impression')
  }

  function handleAnswer(questionId: string, letter: string) {
    setAnswers(prev => ({ ...prev, [questionId]: letter }))
  }

  function handleDiagnosis(diagResult: DiagnosisResult) {
    setResult(diagResult)
    setPhase('result')
  }

  function handleNewCase() {
    setPhase('upload')
    setImageUrl(null)
    setDziUrl(null)
    setImageKind('simple')
    setImageFileName(null)
    setSessionId(null)
    setAnswers({})
    setVisibleSectionId(null)
    setResult(null)
    setInitialImpression(null)
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <Header onNewCase={handleNewCase} onAbout={() => setShowAbout(true)} />

      <main className="flex-1 pt-16 pb-28 flex overflow-hidden">
        {/* Left: Image area */}
        <section className="flex-1 flex items-center justify-center overflow-hidden">
          {phase === 'upload' ? (
            <ImageDropZone onImageLoaded={handleImageLoaded} />
          ) : (
            imageUrl && (
              <ImageViewer
                kind={imageKind}
                imageUrl={imageUrl}
                dziUrl={dziUrl}
                fileName={imageFileName ?? undefined}
                onReplaceImage={handleNewCase}
              />
            )
          )}
        </section>

        {/* Right: Question panel */}
        <aside className="w-[450px] flex-shrink-0 border-l border-outline-variant/10 flex flex-col overflow-hidden bg-surface-container-low">
          {phase === 'initial-impression' ? (
            <InitialImpressionStep
              value={initialImpression}
              onSelect={setInitialImpression}
              onContinue={() => setPhase('questionnaire')}
            />
          ) : (
            <QuestionPanel
              phase={phase}
              answers={answers}
              sessionId={sessionId}
              onAnswer={handleAnswer}
              onCurrentSectionChange={setVisibleSectionId}
              onDiagnosis={handleDiagnosis}
            />
          )}
        </aside>
      </main>

      <AcademicBanner />
      <ProgressBar
        currentPhase={phase}
        currentSectionId={currentSectionId}
        completedSectionIds={completedSectionIds}
        answeredQuestionsCount={answeredQuestionsCount}
        totalQuestions={ALL_QUESTION_IDS.length}
      />

      {result && (
        <ResultModal
          result={result}
          imageFileName={imageFileName}
          initialImpression={initialImpressionLabel}
          onClose={() => setPhase('questionnaire')}
          onNewCase={handleNewCase}
        />
      )}

      {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
    </div>
  )
}
