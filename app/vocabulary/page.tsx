'use client'
import { useState, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { VOCABULARY_LIST } from '@/lib/data/vocabulary'
import { VocabWord, CEFRLevel } from '@/lib/types'
import { playTTS, toggleSavedWord, toggleMasteredWord, addXP, getUserProgress } from '@/lib/storage'
import confetti from 'canvas-confetti'
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  Search,
  RotateCw,
  Sparkles,
  CheckCircle,
  Filter,
  Zap,
  CheckCircle2,
  Award
} from 'lucide-react'

export default function VocabularyPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [masteryFilter, setMasteryFilter] = useState<'ALL' | 'LEARNING' | 'MASTERED' | 'SAVED'>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [masteredIds, setMasteredIds] = useState<string[]>([])
  const [xpRewardToast, setXpRewardToast] = useState<string | null>(null)

  useEffect(() => {
    const p = getUserProgress()
    setSavedIds(p.savedWordIds)
    setMasteredIds(p.masteredWordIds || [])
  }, [])

  const filteredWords = VOCABULARY_LIST.filter((w) => {
    const matchesLevel = selectedLevel === 'ALL' || w.level === selectedLevel
    const matchesCategory = selectedCategory === 'ALL' || w.category === selectedCategory
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.urduMeaning.includes(searchQuery) ||
      w.definition.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesMastery = true
    if (masteryFilter === 'MASTERED') {
      matchesMastery = masteredIds.includes(w.id)
    } else if (masteryFilter === 'LEARNING') {
      matchesMastery = !masteredIds.includes(w.id)
    } else if (masteryFilter === 'SAVED') {
      matchesMastery = savedIds.includes(w.id)
    }

    return matchesLevel && matchesCategory && matchesSearch && matchesMastery
  })

  const handleToggleSave = (wordId: string) => {
    const { isSaved } = toggleSavedWord(wordId)
    setSavedIds((prev) =>
      isSaved ? [...prev, wordId] : prev.filter((id) => id !== wordId)
    )
  }

  const handleToggleMastered = (wordId: string) => {
    const { isMastered } = toggleMasteredWord(wordId)
    setMasteredIds((prev) =>
      isMastered ? [...prev, wordId] : prev.filter((id) => id !== wordId)
    )
    if (isMastered) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })
      setXpRewardToast('🎉 Word Mastered! +25 XP added to your profile!')
      setTimeout(() => setXpRewardToast(null), 3000)
    }
  }

  const handleRateWord = (rating: 'easy' | 'good' | 'hard') => {
    const xpGain = rating === 'easy' ? 15 : rating === 'good' ? 10 : 5
    addXP(xpGain)
    setXpRewardToast(`+${xpGain} XP earned! Keep up the great momentum!`)
    setTimeout(() => setXpRewardToast(null), 3000)
  }

  return (
    <AppShell>
      {/* Toast Notification */}
      {xpRewardToast && (
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
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <Sparkles size={18} />
          <span>{xpRewardToast}</span>
        </div>
      )}

      {/* Header Banner */}
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
            SM-2 Spaced Repetition Engine
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            {masteredIds.length} of {VOCABULARY_LIST.length} Words Mastered
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
          Smart Vocabulary Studio • ذخیرہ الفاظ
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Click cards to flip between English and Urdu definitions. Listen to native pronunciations, bookmark key words, and mark items as mastered to build permanent memory.
        </p>
      </div>

      {/* Controls Bar */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '28px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--surface-subtle)',
              padding: '8px 14px',
              borderRadius: '10px',
              flex: '1 1 260px',
              border: '1px solid var(--border)',
            }}
          >
            <Search size={16} style={{ color: 'var(--foreground-subtle)' }} />
            <input
              type="text"
              placeholder="Search word, meaning, or اردو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                color: 'var(--foreground)',
              }}
            />
          </div>

          {/* Mastery filter tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Words' },
              { id: 'LEARNING', label: 'In Progress' },
              { id: 'MASTERED', label: '🏆 Mastered' },
              { id: 'SAVED', label: '🔖 Bookmarked' },
            ].map((mf) => (
              <button
                key={mf.id}
                onClick={() => setMasteryFilter(mf.id as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: masteryFilter === mf.id ? 'var(--color-primary)' : 'var(--surface-subtle)',
                  color: masteryFilter === mf.id ? 'white' : 'var(--foreground-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {mf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level & Category Filters Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          {/* Level tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--foreground-subtle)', textTransform: 'uppercase' }}>CEFR:</span>
            {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  border: `1px solid ${selectedLevel === lvl ? 'var(--color-primary)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  background: selectedLevel === lvl ? 'var(--primary-100)' : 'transparent',
                  color: selectedLevel === lvl ? 'var(--color-primary)' : 'var(--foreground-muted)',
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Contexts' },
              { id: 'daily', label: 'Daily Life' },
              { id: 'business', label: 'Workplace' },
              { id: 'interview', label: 'Interview' },
              { id: 'academic', label: 'Academic' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === cat.id ? 'var(--primary-50)' : 'transparent',
                  color: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--foreground-muted)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {filteredWords.map((word) => {
          const isFlipped = flippedCardId === word.id
          const isSaved = savedIds.includes(word.id)
          const isMastered = masteredIds.includes(word.id)

          return (
            <div
              key={word.id}
              style={{
                minHeight: '300px',
                background: 'var(--card-bg)',
                borderRadius: '18px',
                border: `1px solid ${isMastered ? '#10b981' : 'var(--card-border)'}`,
                padding: '24px',
                boxShadow: 'var(--card-shadow)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              className="hover:shadow-lg hover:border-indigo-400"
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'var(--primary-50)',
                      color: 'var(--color-primary)',
                      fontSize: '11px',
                      fontWeight: '800',
                    }}
                  >
                    {word.level}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      color: 'var(--foreground-subtle)',
                      fontWeight: '600',
                    }}
                  >
                    {word.partOfSpeech}
                  </span>
                  {isMastered && (
                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>
                      Mastered ✓
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleToggleMastered(word.id)}
                    style={{
                      background: isMastered ? '#d1fae5' : 'var(--surface-subtle)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isMastered ? '#10b981' : 'var(--foreground-subtle)',
                    }}
                    title={isMastered ? 'Word mastered' : 'Mark word as mastered (+25 XP)'}
                  >
                    <CheckCircle2 size={16} />
                  </button>

                  <button
                    onClick={() => handleToggleSave(word.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: isSaved ? '#eab308' : 'var(--foreground-subtle)',
                    }}
                    title={isSaved ? 'Word saved' : 'Save word'}
                  >
                    {isSaved ? <BookmarkCheck size={20} fill="#eab308" /> : <Bookmark size={20} />}
                  </button>

                  <button
                    onClick={() => playTTS(word.word)}
                    style={{
                      background: 'var(--primary-50)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--color-primary)',
                    }}
                    title="Audio Pronunciation"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div
                onClick={() => setFlippedCardId(isFlipped ? null : word.id)}
                style={{ cursor: 'pointer', padding: '16px 0', userSelect: 'none' }}
              >
                {!isFlipped ? (
                  <div>
                    <h3
                      style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        color: 'var(--foreground)',
                        letterSpacing: '-0.02em',
                        marginBottom: '4px',
                      }}
                    >
                      {word.word}
                    </h3>
                    <div style={{ fontSize: '14px', color: 'var(--foreground-subtle)', fontStyle: 'italic', marginBottom: '14px' }}>
                      {word.phonetic}
                    </div>

                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#0284c7',
                        marginBottom: '8px',
                      }}
                    >
                      {word.urduMeaning}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--foreground-subtle)' }}>
                      تلفظ: <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>{word.urduPronunciation}</span>
                    </div>

                    <div
                      style={{
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: 'var(--color-primary)',
                        fontWeight: '600',
                      }}
                    >
                      <RotateCw size={13} />
                      <span>Click card to reveal example sentence & synonyms</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '4px' }}>
                      Definition:
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: 1.5, marginBottom: '12px' }}>
                      {word.definition}
                    </p>

                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '4px' }}>
                      Example:
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontStyle: 'italic', marginBottom: '6px' }}>
                      "{word.exampleSentence}"
                    </p>
                    <p style={{ fontSize: '12px', color: '#0284c7', marginBottom: '14px' }}>
                      {word.exampleTranslation}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {word.synonyms.map((syn, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '11px',
                            background: 'var(--surface-subtle)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            color: 'var(--foreground-muted)',
                          }}
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Recall rating */}
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--foreground-subtle)', fontWeight: '600' }}>
                  Recall:
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleRateWord('hard')}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #fed7aa',
                      background: '#fff7ed',
                      color: '#c2410c',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => handleRateWord('good')}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #c7d2fe',
                      background: '#eef2ff',
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleRateWord('easy')}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #bbf7d0',
                      background: '#f0fdf4',
                      color: '#15803d',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Easy +15XP
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
