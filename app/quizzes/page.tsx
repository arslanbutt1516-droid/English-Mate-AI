'use client'
import { useState } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { QUIZ_QUESTIONS } from '@/lib/data/quizzes'
import { addXP } from '@/lib/storage'
import confetti from 'canvas-confetti'
import {
  HelpCircle,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function QuizzesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [showUrduPrompt, setShowUrduPrompt] = useState(true)

  const currentQ = QUIZ_QUESTIONS[currentIndex]

  const handleSelect = (optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }))
  }

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // Calculate score and finish
      let score = 0
      QUIZ_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.answer) score++
      })
      setIsCompleted(true)
      const earnedXP = score * 30
      addXP(earnedXP)

      if (score >= 4) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswers({})
    setIsCompleted(false)
  }

  const calculateTotalScore = () => {
    let score = 0
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) score++
    })
    return score
  }

  return (
    <AppShell>
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
            Adaptive Assessment System
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            Server-Authoritative Evaluation & Level Certification
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
          Skill Assessment & Quizzes • ٹیسٹ اور کوئز
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Test your English knowledge across grammar, vocabulary, and workplace communication. Earn bonus XP and diagnose areas to improve.
        </p>
      </div>

      {!isCompleted ? (
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            padding: '32px',
            boxShadow: 'var(--card-shadow)',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {/* Progress Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground-muted)' }}>
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setShowUrduPrompt(!showUrduPrompt)}
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                }}
              >
                اردو ترجمہ: {showUrduPrompt ? 'آن' : 'آف'}
              </button>
              <span style={{ fontSize: '12px', background: 'var(--primary-50)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '6px', fontWeight: '800' }}>
                {currentQ.category}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '28px' }}>
            <div
              style={{
                width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                height: '100%',
                background: 'var(--color-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Prompt */}
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', lineHeight: 1.4, marginBottom: '8px' }}>
            {currentQ.prompt}
          </h2>
          {showUrduPrompt && currentQ.urduPrompt && (
            <div style={{ fontSize: '16px', color: '#0284c7', fontWeight: '600', marginBottom: '24px' }}>
              {currentQ.urduPrompt}
            </div>
          )}

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {currentQ.options?.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(optIdx)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-50)' : 'var(--surface-subtle)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--foreground)',
                    fontSize: '15px',
                    fontWeight: '600',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{opt}</span>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-strong)'}`,
                      background: isSelected ? 'var(--color-primary)' : 'transparent',
                    }}
                  />
                </button>
              )
            })}
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentIndex] === undefined}
              style={{
                padding: '12px 32px',
                borderRadius: '10px',
                background: selectedAnswers[currentIndex] !== undefined ? 'var(--color-primary)' : 'var(--surface-subtle)',
                color: selectedAnswers[currentIndex] !== undefined ? 'white' : 'var(--foreground-subtle)',
                fontWeight: '700',
                fontSize: '15px',
                border: 'none',
                cursor: selectedAnswers[currentIndex] !== undefined ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish & Submit Test'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            padding: '40px',
            boxShadow: 'var(--card-shadow)',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Award size={40} />
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
            Assessment Completed!
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--foreground-muted)', marginBottom: '24px' }}>
            You answered <span style={{ fontWeight: '800', color: '#16a34a' }}>{calculateTotalScore()}</span> out of {QUIZ_QUESTIONS.length} questions correctly.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'var(--primary-50)',
              color: 'var(--color-primary)',
              fontWeight: '800',
              fontSize: '18px',
              marginBottom: '32px',
            }}
          >
            <span>+ {calculateTotalScore() * 30} XP Earned</span>
            <span>•</span>
            <span>Suggested CEFR: B1 Intermediate</span>
          </div>

          {/* Breakdown Review */}
          <div style={{ textAlign: 'left', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>
              Detailed Answer Key:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {QUIZ_QUESTIONS.map((q, idx) => {
                const isCorrect = selectedAnswers[idx] === q.answer

                return (
                  <div key={idx} style={{ padding: '16px', borderRadius: '12px', background: 'var(--surface-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {isCorrect ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#dc2626" />}
                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                        {idx + 1}. {q.prompt}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginLeft: '26px' }}>
                      <span style={{ fontWeight: '700', color: '#16a34a' }}>Correct Answer: </span>
                      {q.options?.[q.answer as number]}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginLeft: '26px', marginTop: '4px' }}>
                      {q.explanation}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleRestart}
            style={{
              marginTop: '32px',
              padding: '12px 28px',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              color: 'white',
              fontWeight: '700',
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RotateCcw size={16} />
            <span>Retake Assessment</span>
          </button>
        </div>
      )}
    </AppShell>
  )
}
