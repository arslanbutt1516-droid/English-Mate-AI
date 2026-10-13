'use client'
import { useState, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { DailyWord } from '@/lib/types'
import { playTTS, toggleSavedWord, addXP, getUserProgress } from '@/lib/storage'
import { getLocalDateString, getClientTimeZone, DEFAULT_TIMEZONE } from '@/lib/dateUtils'
import { getDaily10WordsForDate } from '@/lib/data/daily10Pool'
import confetti from 'canvas-confetti'
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  RotateCw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  HelpCircle,
  List,
  Layers,
  Headphones,
  Award,
  AlertCircle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react'

export default function Daily10WordsPage() {
  const [words, setWords] = useState<DailyWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedWordIds, setCompletedWordIds] = useState<string[]>([])
  const [difficultWordIds, setDifficultWordIds] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [showUrdu, setShowUrdu] = useState(true)
  const [showAltExample, setShowAltExample] = useState(false)
  const [viewMode, setViewMode] = useState<'flashcard' | 'list' | 'quiz'>('flashcard')
  const [timeZone, setTimeZone] = useState(DEFAULT_TIMEZONE)
  const [localDate, setLocalDate] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    const tz = getClientTimeZone()
    setTimeZone(tz)
    const todayStr = getLocalDateString(tz)
    setLocalDate(todayStr)

    // Load initial local progress
    const progress = getUserProgress()
    setSavedIds(progress.savedWordIds || [])

    // Fetch daily 10 set from API with fallback
    fetch(`/api/daily-words?timeZone=${encodeURIComponent(tz)}&date=${todayStr}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.words?.length === 10) {
          setWords(data.words)
          setCompletedWordIds(data.completedWordIds || [])
          setDifficultWordIds(data.difficultWordIds || [])
        } else {
          setWords(getDaily10WordsForDate(todayStr))
        }
      })
      .catch(() => {
        setWords(getDaily10WordsForDate(todayStr))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const currentWord = words[currentIndex] || words[0]

  const handleNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setShowAltExample(false)
    }
  }

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setShowAltExample(false)
    }
  }

  const handleMarkLearned = (wordId: string) => {
    if (!completedWordIds.includes(wordId)) {
      const updated = [...completedWordIds, wordId]
      setCompletedWordIds(updated)
      addXP(15)
      setToastMessage(`Word marked learned! +15 XP earned`)
      setTimeout(() => setToastMessage(null), 3000)

      // Report to API
      fetch('/api/daily-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateString: localDate,
          wordId,
          action: 'complete',
          timeZone,
        }),
      }).catch(() => {})

      if (updated.length === 10) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } })
        setToastMessage(`🎉 All 10 words completed today! +50 Daily Bonus XP!`)
        addXP(50)
      }
    }
  }

  const handleMarkDifficult = (wordId: string) => {
    if (!difficultWordIds.includes(wordId)) {
      setDifficultWordIds((prev) => [...prev, wordId])
      setToastMessage('Word flagged for revision.')
      setTimeout(() => setToastMessage(null), 2500)

      fetch('/api/daily-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateString: localDate,
          wordId,
          action: 'difficult',
          timeZone,
        }),
      }).catch(() => {})
    }
  }

  const handleToggleSave = (wordId: string) => {
    const { isSaved } = toggleSavedWord(wordId)
    setSavedIds((prev) => (isSaved ? [...prev, wordId] : prev.filter((id) => id !== wordId)))
    setToastMessage(isSaved ? 'Saved to Word Vault' : 'Removed from Saved')
    setTimeout(() => setToastMessage(null), 2500)
  }

  // Quiz logic
  const quizWord = words[quizIndex]
  const quizOptions = quizWord
    ? [
        quizWord.meaning,
        'To walk quickly in an irregular direction without a clear target.',
        'A formal document provided during government registration.',
        'To reduce temperature below standard freezing limit.',
      ].sort(() => 0.5 - Math.random())
    : []

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted) return
    setSelectedQuizOption(optionIdx)
    setQuizSubmitted(true)

    const isCorrect = quizOptions[optionIdx] === quizWord.meaning
    if (isCorrect) {
      setQuizScore((prev) => prev + 1)
      addXP(10)
    }
  }

  const handleNextQuizQuestion = () => {
    if (quizIndex < words.length - 1) {
      setQuizIndex((prev) => prev + 1)
      setSelectedQuizOption(null)
      setQuizSubmitted(false)
    } else {
      setQuizCompleted(true)
      confetti({ particleCount: 80, spread: 80 })
      addXP(quizScore * 10)
    }
  }

  return (
    <AppShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Timezone Indicator */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--primary-100)',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: '800',
              }}
            >
              <Zap size={14} />
              Daily 10 Vocabulary Words
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                color: 'var(--foreground-muted)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              <Calendar size={13} />
              {localDate} • {timeZone}
            </span>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface-subtle)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setViewMode('flashcard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'flashcard' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'flashcard' ? 'white' : 'var(--foreground-muted)',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <Layers size={14} />
              <span>Card Mode</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'list' ? 'white' : 'var(--foreground-muted)',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <List size={14} />
              <span>10-Word List</span>
            </button>

            <button
              onClick={() => {
                setViewMode('quiz')
                setQuizIndex(0)
                setQuizScore(0)
                setQuizCompleted(false)
                setSelectedQuizOption(null)
                setQuizSubmitted(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'quiz' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'quiz' ? 'white' : 'var(--foreground-muted)',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <HelpCircle size={14} />
              <span>Daily Quiz</span>
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>
          Today's 10 Essential Words • روزانہ دس نئے الفاظ
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', maxWidth: '700px' }}>
          Quality-checked, high-frequency English vocabulary updated automatically at midnight. Concise definitions, Urdu translations, pronunciation, and practical usage tips.
        </p>
      </div>

      {/* Progress Bar & Indicators */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '14px',
          border: '1px solid var(--card-border)',
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--foreground)' }}>
            Progress: <span style={{ color: 'var(--color-primary)' }}>{completedWordIds.length} / 10 Mastered</span>
          </div>
          <div style={{ width: '180px', height: '8px', background: 'var(--surface-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(completedWordIds.length / 10) * 100}%`,
                background: 'linear-gradient(90deg, var(--color-primary), #10b981)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowUrdu(!showUrdu)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: showUrdu ? 'var(--primary-50)' : 'var(--surface-subtle)',
              border: `1px solid ${showUrdu ? 'var(--primary-300)' : 'var(--border)'}`,
              color: showUrdu ? 'var(--color-primary)' : 'var(--foreground-muted)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            اردو ترجمہ: {showUrdu ? 'آن' : 'آف'}
          </button>

          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            Automatic Midnight Refresh Active
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--foreground-muted)' }}>
          Preparing your daily 10 words...
        </div>
      ) : viewMode === 'flashcard' && currentWord ? (
        /* ================= FLASHCARD MODE ================= */
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* Card Top Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--foreground-subtle)' }}>
              Word {currentIndex + 1} of {words.length}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'var(--primary-100)', color: 'var(--color-primary)' }}>
                Level {currentWord.level}
              </span>
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: 'var(--surface-subtle)', color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>
                {currentWord.partOfSpeech}
              </span>
            </div>
          </div>

          {/* Interactive Word Card */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              border: `2px solid ${completedWordIds.includes(currentWord.id) ? '#10b981' : 'var(--card-border)'}`,
              padding: '32px 28px',
              boxShadow: 'var(--card-shadow-lg)',
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button
                onClick={() => playTTS(currentWord.word)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  color: 'var(--color-primary)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <Volume2 size={18} />
                <span>Listen ({currentWord.pronunciationGuide})</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggleSave(currentWord.id)}
                  style={{
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: savedIds.includes(currentWord.id) ? '#f59e0b' : 'var(--foreground-muted)',
                  }}
                  title="Bookmark word"
                >
                  {savedIds.includes(currentWord.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>

                <button
                  onClick={() => handleMarkDifficult(currentWord.id)}
                  style={{
                    background: difficultWordIds.includes(currentWord.id) ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-subtle)',
                    border: `1px solid ${difficultWordIds.includes(currentWord.id) ? '#ef4444' : 'var(--border)'}`,
                    borderRadius: '8px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: difficultWordIds.includes(currentWord.id) ? '#ef4444' : 'var(--foreground-muted)',
                  }}
                  title="Mark as difficult"
                >
                  <AlertCircle size={18} />
                </button>
              </div>
            </div>

            {/* Main Word Title */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '38px', fontWeight: '900', color: 'var(--foreground)', letterSpacing: '-0.02em', margin: 0 }}>
                  {currentWord.word}
                </h2>
                <span style={{ fontSize: '16px', color: 'var(--foreground-subtle)', fontStyle: 'italic' }}>
                  {currentWord.phonetic}
                </span>
              </div>

              {/* Simple Meaning */}
              <div style={{ marginTop: '12px', fontSize: '17px', color: 'var(--foreground)', lineHeight: 1.5, fontWeight: '600' }}>
                {currentWord.meaning}
              </div>

              {/* Urdu Translation */}
              {showUrdu && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '18px',
                    color: '#0284c7',
                    fontWeight: '700',
                    direction: 'rtl',
                    textAlign: 'right',
                    background: 'var(--surface-subtle)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                  }}
                >
                  {currentWord.urduMeaning}
                </div>
              )}
            </div>

            {/* Example Sentence */}
            <div
              style={{
                background: 'var(--surface-subtle)',
                borderLeft: '4px solid var(--color-primary)',
                padding: '16px 18px',
                borderRadius: '0 12px 12px 0',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '4px' }}>
                Natural Example:
              </div>
              <div style={{ fontSize: '15px', color: 'var(--foreground)', fontWeight: '600', lineHeight: 1.5 }}>
                "{currentWord.exampleSentence}"
              </div>
              {showUrdu && (
                <div style={{ fontSize: '13px', color: '#0369a1', marginTop: '4px', direction: 'rtl', textAlign: 'right' }}>
                  {currentWord.exampleTranslation}
                </div>
              )}
            </div>

            {/* Practical Usage Tip */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px' }}>
              <Lightbulb size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ fontWeight: '700', fontSize: '12px', color: '#d97706', textTransform: 'uppercase' }}>Usage Tip: </span>
                <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>{currentWord.practicalUsageTip}</span>
              </div>
            </div>

            {/* Synonyms & Antonyms */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '28px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-subtle)' }}>Synonyms:</span>
              {currentWord.synonyms.map((syn, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    background: 'var(--surface-subtle)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: 'var(--foreground)',
                  }}
                >
                  {syn}
                </span>
              ))}
              {currentWord.antonyms && currentWord.antonyms.length > 0 && (
                <>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-subtle)', marginLeft: '12px' }}>Opposite:</span>
                  {currentWord.antonyms.map((ant, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        background: 'rgba(239, 68, 68, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: '#ef4444',
                      }}
                    >
                      {ant}
                    </span>
                  ))}
                </>
              )}
            </div>

            {/* Card Footer Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <button
                onClick={() => handleMarkLearned(currentWord.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: completedWordIds.includes(currentWord.id) ? '#10b981' : 'var(--color-primary)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <CheckCircle size={16} />
                <span>{completedWordIds.includes(currentWord.id) ? 'Mastered ✓' : 'Mark as Learned (+15 XP)'}</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  disabled={currentIndex === 0}
                  onClick={handlePrevWord}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--foreground)',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentIndex === 0 ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Prev</span>
                </button>

                <button
                  disabled={currentIndex === words.length - 1}
                  onClick={handleNextWord}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                    cursor: currentIndex === words.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentIndex === words.length - 1 ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                >
                  <span>Next Word</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* ================= 10-WORD LIST MODE ================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {words.map((w, idx) => (
            <div
              key={w.id}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '14px',
                border: '1px solid var(--card-border)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: completedWordIds.includes(w.id) ? '#10b981' : 'var(--primary-100)',
                    color: completedWordIds.includes(w.id) ? 'white' : 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '13px',
                  }}
                >
                  {idx + 1}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>{w.word}</span>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>({w.partOfSpeech})</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '2px 6px', borderRadius: '4px' }}>
                      {w.level}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginTop: '2px' }}>
                    {w.meaning} {showUrdu && <span style={{ color: '#0284c7', fontWeight: '600', marginRight: '6px' }}>• {w.urduMeaning}</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => playTTS(w.word)}
                  style={{
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                  }}
                  title="Pronounce"
                >
                  <Volume2 size={16} />
                </button>

                <button
                  onClick={() => handleMarkLearned(w.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${completedWordIds.includes(w.id) ? '#10b981' : 'var(--border)'}`,
                    background: completedWordIds.includes(w.id) ? '#10b981' : 'transparent',
                    color: completedWordIds.includes(w.id) ? 'white' : 'var(--foreground)',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {completedWordIds.includes(w.id) ? 'Learned ✓' : 'Mark Learned'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= DAILY QUIZ MODE ================= */
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {!quizCompleted && quizWord ? (
            <div
              style={{
                background: 'var(--card-bg)',
                borderRadius: '18px',
                border: '1px solid var(--card-border)',
                padding: '28px',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '4px 10px', borderRadius: '6px' }}>
                  Question {quizIndex + 1} of 10
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground-muted)' }}>
                  Score: {quizScore}
                </span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                What is the meaning of "{quizWord.word}"?
              </h2>
              {showUrdu && (
                <div style={{ fontSize: '14px', color: '#0284c7', marginBottom: '20px', fontWeight: '600' }}>
                  اردو اشارہ: {quizWord.urduMeaning}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {quizOptions.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx
                  const isCorrect = opt === quizWord.meaning

                  let bg = 'var(--surface)'
                  let borderColor = 'var(--border)'
                  if (quizSubmitted) {
                    if (isCorrect) {
                      bg = 'rgba(16, 185, 129, 0.12)'
                      borderColor = '#10b981'
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.12)'
                      borderColor = '#ef4444'
                    }
                  } else if (isSelected) {
                    bg = 'var(--primary-50)'
                    borderColor = 'var(--color-primary)'
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: `2px solid ${borderColor}`,
                        background: bg,
                        color: 'var(--foreground)',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'left',
                        cursor: quizSubmitted ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              {quizSubmitted && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleNextQuizQuestion}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'var(--color-primary)',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{quizIndex < 9 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                background: 'var(--card-bg)',
                borderRadius: '18px',
                border: '1px solid var(--card-border)',
                padding: '36px 24px',
                textAlign: 'center',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <Award size={48} style={{ color: '#10b981', margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                Daily Quiz Complete!
              </h2>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', marginBottom: '20px' }}>
                You scored <strong style={{ color: 'var(--color-primary)' }}>{quizScore} out of 10</strong> on today's vocabulary set!
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={() => {
                    setViewMode('flashcard')
                    setCurrentIndex(0)
                  }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-subtle)',
                    color: 'var(--foreground)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Review Words
                </button>

                <button
                  onClick={() => {
                    setQuizIndex(0)
                    setQuizScore(0)
                    setQuizCompleted(false)
                    setSelectedQuizOption(null)
                    setQuizSubmitted(false)
                  }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  )
}
