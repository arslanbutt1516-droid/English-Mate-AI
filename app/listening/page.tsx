'use client'
import { useState } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { playTTS, addXP } from '@/lib/storage'
import {
  Headphones,
  Play,
  RotateCcw,
  Volume2,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock,
  Gauge
} from 'lucide-react'

interface ListeningTrack {
  id: string
  title: string
  urduTitle: string
  level: string
  duration: string
  audioText: string
  transcriptBlanks: Array<{
    before: string
    blankWord: string
    after: string
  }>
  questions: Array<{
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }>
}

const LISTENING_TRACKS: ListeningTrack[] = [
  {
    id: 'l1',
    title: 'Airport Flight Gate Change Announcement',
    urduTitle: 'ایئرپورٹ فلائٹ گیٹ تبدیلی کا اعلان',
    level: 'A2',
    duration: '45 sec',
    audioText: 'Attention passengers on Emirates Flight 204 to London Heathrow. Your departure gate has been changed from Gate B12 to Gate C28. Boarding will commence in twenty minutes. Please have your boarding passes and passports ready for final inspection.',
    transcriptBlanks: [
      { before: 'Your departure gate has been changed from Gate B12 to Gate ', blankWord: 'C28', after: '.' },
      { before: 'Boarding will commence in ', blankWord: 'twenty', after: ' minutes.' },
      { before: 'Please have your boarding passes and ', blankWord: 'passports', after: ' ready for inspection.' },
    ],
    questions: [
      {
        question: 'What is the new departure gate for flight 204?',
        options: ['Gate B12', 'Gate C28', 'Gate A15', 'Gate D4'],
        correctIndex: 1,
        explanation: 'The announcement clearly states: "changed from Gate B12 to Gate C28".',
      },
      {
        question: 'When will boarding begin?',
        options: ['In 10 minutes', 'Immediately', 'In twenty minutes', 'Tomorrow morning'],
        correctIndex: 2,
        explanation: 'The announcer states boarding will commence in twenty minutes.',
      },
    ],
  },
  {
    id: 'l2',
    title: 'Morning Engineering Team Standup',
    urduTitle: 'صبح کی انجینئرنگ ٹیم اسٹینڈ اپ میٹنگ',
    level: 'B1',
    duration: '1 min',
    audioText: 'Good morning everyone. Yesterday I resolved the authentication latency issue and pushed the patch to staging. Today I am collaborating with the design team to polish our onboarding flow. I do not have any blockers at the moment.',
    transcriptBlanks: [
      { before: 'Yesterday I resolved the authentication ', blankWord: 'latency', after: ' issue.' },
      { before: 'Today I am collaborating with the design team to polish our ', blankWord: 'onboarding', after: ' flow.' },
      { before: 'I do not have any ', blankWord: 'blockers', after: ' at the moment.' },
    ],
    questions: [
      {
        question: 'What did the speaker resolve yesterday?',
        options: ['Database migration', 'Authentication latency issue', 'Billing bug', 'Customer refund'],
        correctIndex: 1,
        explanation: 'The speaker resolved the authentication latency issue and pushed the patch to staging.',
      },
      {
        question: 'Does the speaker have any current blockers?',
        options: ['Yes, waiting for approvals', 'No blockers at the moment', 'Needs a new laptop', 'System is down'],
        correctIndex: 1,
        explanation: 'The engineer explicitly said "I do not have any blockers at the moment."',
      },
    ],
  },
]

export default function ListeningPage() {
  const [selectedTrack, setSelectedTrack] = useState<ListeningTrack>(LISTENING_TRACKS[0])
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [blankInputs, setBlankInputs] = useState<Record<number, string>>({})
  const [blankSubmitted, setBlankSubmitted] = useState<boolean>(false)
  const [selectedQuestions, setSelectedQuestions] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handlePlayAudio = () => {
    setIsPlaying(true)
    playTTS(selectedTrack.audioText, playbackSpeed)
    setTimeout(() => setIsPlaying(false), 8000)
  }

  const handleCheckBlanks = () => {
    setBlankSubmitted(true)
    let correct = 0
    selectedTrack.transcriptBlanks.forEach((b, idx) => {
      if ((blankInputs[idx] || '').trim().toLowerCase() === b.blankWord.toLowerCase()) {
        correct++
      }
    })
    const gained = correct * 20
    addXP(gained)
    setToastMessage(`You filled ${correct}/${selectedTrack.transcriptBlanks.length} correctly! +${gained} XP!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleCheckQuestions = () => {
    setQuizSubmitted(true)
    let correct = 0
    selectedTrack.questions.forEach((q, idx) => {
      if (selectedQuestions[idx] === q.correctIndex) correct++
    })
    const gained = correct * 25
    addXP(gained)
    setToastMessage(`Comprehension score: ${correct}/${selectedTrack.questions.length}! +${gained} XP!`)
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
            Audio Immersion & Ear Training
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            Variable Speed Audio & Gap-Fill Transcripts
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
          Listening Lab • سننے اور سمجھنے کی صلاحیت
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Train your ear to natural English spoken at realistic tempos. Adjust speeds, transcribe missing words, and answer comprehension questions.
        </p>
      </div>

      {/* Track Selector */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {LISTENING_TRACKS.map((track) => {
          const isSelected = selectedTrack.id === track.id

          return (
            <button
              key={track.id}
              onClick={() => {
                setSelectedTrack(track)
                setBlankInputs({})
                setBlankSubmitted(false)
                setSelectedQuestions({})
                setQuizSubmitted(false)
              }}
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--card-border)'}`,
                background: isSelected ? 'var(--primary-50)' : 'var(--card-bg)',
                color: isSelected ? 'var(--color-primary)' : 'var(--foreground)',
                cursor: 'pointer',
                textAlign: 'left',
                minWidth: '240px',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '4px' }}>
                {track.level} • {track.duration}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>
                {track.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '2px' }}>
                {track.urduTitle}
              </div>
            </button>
          )
        })}
      </div>

      {/* Audio Player Card */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          padding: '28px',
          boxShadow: 'var(--card-shadow)',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
              Level {selectedTrack.level} Audio Track
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', marginTop: '4px' }}>
              {selectedTrack.title}
            </h2>
          </div>

          {/* Speed Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Gauge size={14} /> Speed:
            </span>
            {[0.75, 1.0, 1.25].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: playbackSpeed === spd ? 'var(--color-primary)' : 'var(--surface-subtle)',
                  color: playbackSpeed === spd ? 'white' : 'var(--foreground)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Play Button & Waveform visualizer */}
        <div
          style={{
            background: 'var(--surface-subtle)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <button
            onClick={handlePlayAudio}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--gradient-hero)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(29, 78, 216, 0.3)',
              flexShrink: 0,
            }}
          >
            <Play size={24} fill="white" />
          </button>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>
              {isPlaying ? 'Playing Audio Track...' : 'Click to listen to native speaker'}
            </div>
            <div style={{ display: 'flex', gap: '4px', height: '24px', alignItems: 'center' }}>
              {[40, 70, 30, 90, 60, 45, 80, 100, 50, 70, 35, 85, 60, 40, 75].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: isPlaying ? `${h}%` : '20%',
                    background: isPlaying ? 'var(--color-primary)' : 'var(--border)',
                    borderRadius: '2px',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 1: Fill in the missing words */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          padding: '28px',
          boxShadow: 'var(--card-shadow)',
          marginBottom: '28px',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
          Exercise 1: Gap-Fill Dictation (خالی جگہیں پر کریں)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '20px' }}>
          Listen to the audio and type the exact missing words you hear.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {selectedTrack.transcriptBlanks.map((b, idx) => {
            const userWord = blankInputs[idx] || ''
            const isCorrect = userWord.trim().toLowerCase() === b.blankWord.toLowerCase()

            return (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'var(--surface-subtle)',
                  fontSize: '15px',
                  color: 'var(--foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                <span>{b.before}</span>
                <input
                  type="text"
                  value={userWord}
                  disabled={blankSubmitted}
                  onChange={(e) => setBlankInputs({ ...blankInputs, [idx]: e.target.value })}
                  style={{
                    width: '120px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: `2px solid ${
                      blankSubmitted
                        ? isCorrect
                          ? '#16a34a'
                          : '#dc2626'
                        : 'var(--color-primary)'
                    }`,
                    background: blankSubmitted && isCorrect ? '#dcfce7' : 'white',
                    fontWeight: '700',
                    fontSize: '14px',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                  placeholder="???"
                />
                <span>{b.after}</span>
                {blankSubmitted && !isCorrect && (
                  <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', marginLeft: '6px' }}>
                    (Correct: {b.blankWord})
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '20px' }}>
          {!blankSubmitted ? (
            <button
              onClick={handleCheckBlanks}
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
              Verify Missing Words
            </button>
          ) : (
            <button
              onClick={() => {
                setBlankSubmitted(false)
                setBlankInputs({})
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

      {/* Exercise 2: Comprehension Questions */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          padding: '28px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
          Exercise 2: Audio Comprehension Test
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
          {selectedTrack.questions.map((q, qIdx) => {
            const userAns = selectedQuestions[qIdx]
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
                        onClick={() => setSelectedQuestions({ ...selectedQuestions, [qIdx]: optIdx })}
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
              onClick={handleCheckQuestions}
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
              Check Comprehension
            </button>
          ) : (
            <button
              onClick={() => {
                setQuizSubmitted(false)
                setSelectedQuestions({})
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
              Reset Quiz
            </button>
          )}
        </div>
      </div>
    </AppShell>
  )
}
