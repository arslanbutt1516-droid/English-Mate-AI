'use client'
import { useState, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { GRAMMAR_LESSONS } from '@/lib/data/grammar'
import { GrammarLesson } from '@/lib/types'
import { markLessonComplete, playTTS, addXP, getUserProgress } from '@/lib/storage'
import {
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react'

export default function GrammarPage() {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson>(GRAMMAR_LESSONS[0])
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const progress = getUserProgress()
    setCompletedIds(progress.completedLessons)
  }, [])

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (submittedQuiz) return
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }))
  }

  const handleCheckAnswers = () => {
    setSubmittedQuiz(true)
    let score = 0
    selectedLesson.practiceQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++
      }
    })
    const gainedXP = score * 20
    addXP(gainedXP)
    setToastMessage(`You scored ${score}/${selectedLesson.practiceQuestions.length}! +${gainedXP} XP added!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleCompleteLesson = () => {
    const updated = markLessonComplete(selectedLesson.id)
    setCompletedIds(updated.completedLessons)
    setToastMessage('Unit marked complete! +50 XP bonus earned!')
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <AppShell>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '700',
            fontSize: '14px',
            zIndex: 100,
          }}
        >
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'var(--primary-100)',
              color: 'var(--color-primary)',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            Structured Grammar Masterclass
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            36 Interactive Units • A1 to C1
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(26px, 3.5vw, 36px)',
            fontWeight: '800',
            color: 'var(--foreground)',
            marginBottom: '8px',
          }}
        >
          Grammar Academy • جامع گرامر اکیڈمی
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Master English tenses, prepositions, and modal verbs without fear. Clear formulas, common error breakdowns, and Urdu explanations make every concept effortless.
        </p>
      </div>

      {/* Two Column Layout: Units List & Lesson Reader */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Lesson Units Navigation */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            padding: '20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>
            Course Curriculum
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {GRAMMAR_LESSONS.map((lesson) => {
              const isSelected = selectedLesson.id === lesson.id
              const isCompleted = completedIds.includes(lesson.id)

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson)
                    setSelectedAnswers({})
                    setSubmittedQuiz(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-50)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: isSelected ? 'var(--color-primary)' : 'var(--surface-subtle)',
                          color: isSelected ? 'white' : 'var(--foreground-muted)',
                        }}
                      >
                        {lesson.level}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>
                        {lesson.estimatedMinutes} mins
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: isSelected ? 'var(--color-primary)' : 'var(--foreground)',
                      }}
                    >
                      {lesson.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '2px' }}>
                      {lesson.urduTitle}
                    </div>
                  </div>

                  {isCompleted && (
                    <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Active Lesson Content */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            padding: '28px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          {/* Header of Active Lesson */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                {selectedLesson.category} • Level {selectedLesson.level}
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
              {selectedLesson.title}
            </h2>
            <div style={{ fontSize: '15px', color: '#0284c7', fontWeight: '600' }}>
              {selectedLesson.urduTitle}
            </div>
          </div>

          {/* Formula Callout */}
          <div
            style={{
              background: 'var(--gradient-card)',
              border: '1px solid var(--primary-200)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '4px' }}>
              Core Formula:
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--foreground)', fontFamily: 'monospace' }}>
              {selectedLesson.formula}
            </div>
          </div>

          {/* Rule and Urdu Rule */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
              Rule Explanation:
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--foreground-muted)', marginBottom: '12px' }}>
              {selectedLesson.rule}
            </p>
            <div
              style={{
                background: 'var(--surface-subtle)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#0369a1',
                borderLeft: '4px solid #0284c7',
              }}
            >
              {selectedLesson.ruleUrdu}
            </div>
          </div>

          {/* Examples */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>
              Practical Examples:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedLesson.examples.map((ex, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'var(--surface-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '2px' }}>
                      {ex.en}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                      {ex.ur}
                    </div>
                  </div>
                  <button
                    onClick={() => playTTS(ex.en)}
                    style={{
                      background: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                    title="Listen to sentence"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={18} style={{ color: '#ea580c' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
                Common Traps & Mistakes to Avoid:
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedLesson.commonMistakes.map((mistake, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #fed7aa',
                    background: '#fffaf5',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>
                    <span>❌ Wrong:</span>
                    <span>"{mistake.incorrect}"</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                    <span>✓ Right:</span>
                    <span>"{mistake.correct}"</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#78350f', lineHeight: 1.5 }}>
                    {mistake.explanation}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9a3412', marginTop: '4px', fontWeight: '500' }}>
                    {mistake.explanationUrdu}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Unit Quiz */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <HelpCircle size={18} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
                Unit Practice Questions
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedLesson.practiceQuestions.map((q, qIdx) => {
                const userAns = selectedAnswers[qIdx]
                const isCorrect = userAns === q.correctIndex

                return (
                  <div key={qIdx} style={{ background: 'var(--surface-subtle)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>
                      {qIdx + 1}. {q.question}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                      {q.options.map((opt, optIdx) => {
                        let btnBg = 'white'
                        let btnBorder = 'var(--border)'

                        if (submittedQuiz) {
                          if (optIdx === q.correctIndex) {
                            btnBg = '#dcfce7'
                            btnBorder = '#86efac'
                          } else if (userAns === optIdx && !isCorrect) {
                            btnBg = '#fee2e2'
                            btnBorder = '#fca5a5'
                          }
                        } else if (userAns === optIdx) {
                          btnBg = 'var(--primary-100)'
                          btnBorder = 'var(--color-primary)'
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submittedQuiz}
                            onClick={() => handleSelectAnswer(qIdx, optIdx)}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: `1px solid ${btnBorder}`,
                              background: btnBg,
                              fontSize: '13px',
                              fontWeight: '600',
                              textAlign: 'left',
                              cursor: submittedQuiz ? 'default' : 'pointer',
                            }}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>

                    {submittedQuiz && (
                      <div style={{ marginTop: '10px', fontSize: '12px', color: isCorrect ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                        {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                        <span style={{ color: 'var(--foreground-muted)', fontWeight: '400' }}>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {!submittedQuiz ? (
                <button
                  onClick={handleCheckAnswers}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Check Answers
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSubmittedQuiz(false)
                    setSelectedAnswers({})
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'var(--surface-subtle)',
                    color: 'var(--foreground)',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                >
                  Retry Quiz
                </button>
              )}

              <button
                onClick={handleCompleteLesson}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: '#10b981',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle size={16} />
                <span>Mark Lesson Complete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
