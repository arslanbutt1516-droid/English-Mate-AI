'use client'
import { useState, useEffect, useRef } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { SPEAKING_SCENARIOS } from '@/lib/data/speaking'
import { SpeakingScenario } from '@/lib/types'
import { playTTS, addXP } from '@/lib/storage'
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle,
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  MessageSquare
} from 'lucide-react'

export default function SpeakingPage() {
  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario>(SPEAKING_SCENARIOS[0])
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [isListening, setIsListening] = useState<boolean>(false)
  const [transcript, setTranscript] = useState<string>('')
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [speechSupported, setSpeechSupported] = useState<boolean>(true)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check Speech Recognition support in browser
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
          const current = event.resultIndex
          const text = event.results[current][0].transcript
          setTranscript(text)
        }

        recognition.onerror = () => {
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      } else {
        setSpeechSupported(false)
      }
    }
  }, [])

  const currentStep = selectedScenario.dialogue[currentStepIndex]
  const isUserTurn = currentStep.speaker === 'User'

  const toggleListening = () => {
    if (!speechSupported) {
      // Mock voice input for browsers without speech recognition
      setTranscript(currentStep.audioTarget || 'I am ready to practice speaking.')
      calculateScore(currentStep.audioTarget || 'I am ready to practice speaking.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      if (transcript) {
        calculateScore(transcript)
      }
    } else {
      setTranscript('')
      setAccuracyScore(null)
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const calculateScore = (spokenText: string) => {
    if (!currentStep.audioTarget) return
    const targetWords = currentStep.audioTarget.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ')
    const spokenWords = spokenText.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ')
    
    let matched = 0
    targetWords.forEach((word) => {
      if (spokenWords.includes(word)) matched++
    })

    const score = Math.min(100, Math.round((matched / targetWords.length) * 100) + 15)
    setAccuracyScore(score)

    if (score >= 60) {
      addXP(25)
      setToastMessage(`Great job! ${score}% match accuracy. +25 XP awarded!`)
      setTimeout(() => setToastMessage(null), 3500)
    }
  }

  const handleNextStep = () => {
    if (currentStepIndex < selectedScenario.dialogue.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
      setTranscript('')
      setAccuracyScore(null)
      const nextStep = selectedScenario.dialogue[currentStepIndex + 1]
      if (nextStep.speaker === 'Partner') {
        playTTS(nextStep.text)
      }
    } else {
      addXP(50)
      setToastMessage('🎉 Scenario completed! +50 XP bonus earned!')
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  const handleReset = () => {
    setCurrentStepIndex(0)
    setTranscript('')
    setAccuracyScore(null)
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
            Voice Interactive Lab
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            Real-time Pronunciation & Fluency Evaluation
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
          Interactive Speaking Lab • بول چال کی تربیت
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Practice real-life conversations aloud. Listen to natural native dialogues, speak your lines into the microphone, and receive instant phonetic feedback.
        </p>
      </div>

      {/* Scenario Selector tabs */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {SPEAKING_SCENARIOS.map((scen) => {
          const isSelected = selectedScenario.id === scen.id

          return (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenario(scen)
                setCurrentStepIndex(0)
                setTranscript('')
                setAccuracyScore(null)
              }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--card-border)'}`,
                background: isSelected ? 'var(--color-primary)' : 'var(--card-bg)',
                color: isSelected ? 'white' : 'var(--foreground)',
                cursor: 'pointer',
                textAlign: 'left',
                minWidth: '220px',
                boxShadow: isSelected ? '0 4px 16px rgba(29, 78, 216, 0.25)' : 'var(--card-shadow)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '11px', opacity: isSelected ? 0.9 : 0.6, fontWeight: '700', textTransform: 'uppercase' }}>
                {scen.category} • {scen.level}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', marginTop: '4px' }}>
                {scen.title}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>
                {scen.urduTitle}
              </div>
            </button>
          )
        })}
      </div>

      {/* Main Interaction Area */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          padding: '32px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        {/* Progress step bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground-muted)' }}>
            Turn {currentStepIndex + 1} of {selectedScenario.dialogue.length}
          </div>
          <button
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--foreground-subtle)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCcw size={14} />
            <span>Restart Dialogue</span>
          </button>
        </div>

        {/* Current Speaker Bubble */}
        <div
          style={{
            background: isUserTurn ? '#f0f9ff' : 'var(--surface-subtle)',
            borderRadius: '16px',
            border: `1px solid ${isUserTurn ? '#bae6fd' : 'var(--border)'}`,
            padding: '24px',
            marginBottom: '24px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: isUserTurn ? '#0284c7' : '#64748b',
                color: 'white',
              }}
            >
              {isUserTurn ? '🗣️ Your Turn to Speak' : '🤖 Conversation Partner'}
            </span>

            <button
              onClick={() => playTTS(currentStep.text)}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-primary)',
              }}
              title="Listen to native voice"
            >
              <Volume2 size={18} />
            </button>
          </div>

          <p
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--foreground)',
              lineHeight: 1.5,
              marginBottom: '10px',
            }}
          >
            "{currentStep.text}"
          </p>

          <div
            style={{
              fontSize: '15px',
              color: isUserTurn ? '#0369a1' : 'var(--foreground-muted)',
              lineHeight: 1.5,
            }}
          >
            {currentStep.urdu}
          </div>
        </div>

        {/* Suggested Alternatives if User Turn */}
        {isUserTurn && currentStep.suggestedResponses && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Alternative ways to phrase this:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentStep.suggestedResponses.map((alt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setTranscript(alt)
                    calculateScore(alt)
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--surface-subtle)',
                    fontSize: '13px',
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    border: '1px solid var(--border)',
                  }}
                  className="hover:border-blue-400"
                >
                  💡 {alt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Voice Input Section */}
        {isUserTurn && (
          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={toggleListening}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: isListening
                    ? '#ef4444'
                    : 'linear-gradient(135deg, #1d4ed8, #06b6d4)',
                  color: 'white',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isListening
                    ? '0 0 0 10px rgba(239, 68, 68, 0.2)'
                    : '0 8px 24px rgba(29, 78, 216, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
            </div>

            <div style={{ fontSize: '14px', fontWeight: '600', color: isListening ? '#ef4444' : 'var(--foreground)' }}>
              {isListening ? 'Listening... Speak now!' : 'Click the microphone and speak aloud'}
            </div>

            {transcript && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'var(--surface-subtle)',
                  maxWidth: '540px',
                  margin: '16px auto 0',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--foreground-subtle)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  What we heard:
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)' }}>
                  "{transcript}"
                </div>

                {accuracyScore !== null && (
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: accuracyScore >= 70 ? '#dcfce7' : '#fef3c7',
                        color: accuracyScore >= 70 ? '#16a34a' : '#d97706',
                        fontSize: '13px',
                        fontWeight: '800',
                      }}
                    >
                      Accuracy: {accuracyScore}%
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
                      {accuracyScore >= 80 ? '🌟 Outstanding pronunciation!' : accuracyScore >= 60 ? '👍 Clear & comprehensible' : 'Keep practicing for higher clarity'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button
            onClick={handleNextStep}
            style={{
              padding: '12px 28px',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)',
            }}
          >
            <span>{currentStepIndex < selectedScenario.dialogue.length - 1 ? 'Next Turn' : 'Finish Scenario'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </AppShell>
  )
}
