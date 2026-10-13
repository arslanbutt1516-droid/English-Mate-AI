'use client'
import { useState } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { READING_ARTICLES } from '@/lib/data/reading'
import { ReadingArticle } from '@/lib/types'
import { playTTS, addXP } from '@/lib/storage'
import {
  BookOpen,
  Volume2,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function ReadingPage() {
  const [selectedArticle, setSelectedArticle] = useState<ReadingArticle>(READING_ARTICLES[0])
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)
  const [activeVocabTooltip, setActiveVocabTooltip] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleCheckQuiz = () => {
    setQuizSubmitted(true)
    let correct = 0
    selectedArticle.quiz.forEach((q, idx) => {
      if (selectedQuizAnswers[idx] === q.correctIndex) correct++
    })
    const gained = correct * 25
    addXP(gained)
    setToastMessage(`You got ${correct}/${selectedArticle.quiz.length} correct! +${gained} XP awarded!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <AppShell>
      {/* Toast */}
      {toastMessage && (
        <div className="toast-notification">
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
            Comprehension & Immersion Studio
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            Real-world Articles with Click-to-Translate Words
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
          Reading Studio • مطالعہ اور فہم و ادراک
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Read carefully curated contemporary articles. Click highlighted words for instant bilingual definitions and test your comprehension with interactive questions.
        </p>
      </div>

      {/* Two Column Layout: Articles list & Article Reader */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Article Selector */}
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
            Available Reading Material
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {READING_ARTICLES.map((article) => {
              const isSelected = selectedArticle.id === article.id

              return (
                <button
                  key={article.id}
                  onClick={() => {
                    setSelectedArticle(article)
                    setSelectedQuizAnswers({})
                    setQuizSubmitted(false)
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-50)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
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
                      {article.level}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {article.readTime}
                    </span>
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: '700', color: isSelected ? 'var(--color-primary)' : 'var(--foreground)', marginBottom: '4px' }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--foreground-subtle)' }}>
                    {article.urduTitle}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Reader */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            padding: '32px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          {/* Article Header */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  background: 'var(--primary-50)',
                  padding: '3px 10px',
                  borderRadius: '4px',
                }}
              >
                {selectedArticle.category} • Level {selectedArticle.level}
              </span>

              <button
                onClick={() => playTTS(selectedArticle.content.slice(0, 300))}
                style={{
                  background: 'var(--primary-50)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  color: 'var(--color-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                <Volume2 size={15} />
                <span>Listen Audio</span>
              </button>
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', lineHeight: 1.25, marginBottom: '6px' }}>
              {selectedArticle.title}
            </h2>
            <div style={{ fontSize: '16px', color: '#0284c7', fontWeight: '600' }}>
              {selectedArticle.urduTitle}
            </div>
          </div>

          {/* Interactive Vocabulary Pills */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Key Vocabulary in this Article (click for meaning):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedArticle.vocabularyHints.map((vh, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVocabTooltip(activeVocabTooltip === vh.word ? null : vh.word)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: activeVocabTooltip === vh.word ? 'var(--primary-100)' : 'var(--surface-subtle)',
                    color: activeVocabTooltip === vh.word ? 'var(--color-primary)' : 'var(--foreground)',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📖 {vh.word}
                </button>
              ))}
            </div>

            {/* Active vocabulary hint callout */}
            {activeVocabTooltip && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                {selectedArticle.vocabularyHints
                  .filter((vh) => vh.word === activeVocabTooltip)
                  .map((vh, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontWeight: '800', color: 'var(--color-primary)', marginRight: '8px' }}>
                          {vh.word}:
                        </span>
                        <span style={{ color: 'var(--foreground)', fontSize: '14px' }}>{vh.meaning}</span>
                        <span style={{ marginLeft: '12px', color: '#0284c7', fontWeight: '700' }}>{vh.urdu}</span>
                      </div>
                      <button
                        onClick={() => playTTS(vh.word)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Article Text Content */}
          <div
            style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--foreground)',
              whiteSpace: 'pre-line',
              marginBottom: '36px',
            }}
          >
            {selectedArticle.content}
          </div>

          {/* Comprehension Quiz */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <HelpCircle size={18} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>
                Comprehension Check
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedArticle.quiz.map((q, qIdx) => {
                const userAns = selectedQuizAnswers[qIdx]
                const isCorrect = userAns === q.correctIndex

                return (
                  <div key={qIdx} style={{ background: 'var(--surface-subtle)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>
                      {qIdx + 1}. {q.question}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {q.options.map((opt, optIdx) => {
                        let btnBg = 'white'
                        let btnBorder = 'var(--border)'

                        if (quizSubmitted) {
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
                            disabled={quizSubmitted}
                            onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: `1px solid ${btnBorder}`,
                              background: btnBg,
                              fontSize: '13px',
                              fontWeight: '600',
                              textAlign: 'left',
                              cursor: quizSubmitted ? 'default' : 'pointer',
                            }}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>

                    {quizSubmitted && (
                      <div style={{ marginTop: '10px', fontSize: '12px', color: isCorrect ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                        {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                        <span style={{ color: 'var(--foreground-muted)', fontWeight: '400' }}>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '20px' }}>
              {!quizSubmitted ? (
                <button
                  onClick={handleCheckQuiz}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '10px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Verify Comprehension
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false)
                    setSelectedQuizAnswers({})
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
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
