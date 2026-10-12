'use client'
import { useState, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { VOCABULARY_LIST } from '@/lib/data/vocabulary'
import { getUserProgress, toggleSavedWord, playTTS } from '@/lib/storage'
import {
  BookmarkCheck,
  Bookmark,
  Volume2,
  Trash2,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function LibraryPage() {
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    setSavedIds(getUserProgress().savedWordIds)
  }, [])

  const savedWords = VOCABULARY_LIST.filter((w) => savedIds.includes(w.id))

  const handleRemove = (wordId: string) => {
    const { isSaved } = toggleSavedWord(wordId)
    setSavedIds((prev) => prev.filter((id) => id !== wordId))
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
            Personal Knowledge Vault
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            {savedWords.length} Saved Words for Spaced Review
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
          Saved Library • ذاتی ذخیرہ
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Your personalized collection of bookmarked vocabulary, idioms, and phrases. Review them daily to commit them to long-term memory.
        </p>
      </div>

      {savedWords.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {savedWords.map((word) => (
            <div
              key={word.id}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                padding: '24px',
                boxShadow: 'var(--card-shadow)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                      {word.level}
                    </span>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--foreground-subtle)' }}>
                      {word.partOfSpeech}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => playTTS(word.word)}
                      style={{
                        background: 'var(--surface-subtle)',
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
                    <button
                      onClick={() => handleRemove(word.id)}
                      style={{
                        background: 'var(--surface-subtle)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#ef4444',
                      }}
                      title="Remove from Library"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '2px' }}>
                  {word.word}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--foreground-subtle)', fontStyle: 'italic', marginBottom: '8px' }}>
                  {word.phonetic}
                </div>

                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0284c7', marginBottom: '8px' }}>
                  {word.urduMeaning}
                </div>

                <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {word.definition}
                </p>

                <div style={{ background: 'var(--surface-subtle)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: 'var(--foreground-muted)' }}>
                  "{word.exampleSentence}"
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '2px dashed var(--border)',
            padding: '60px 24px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <BookOpen size={48} style={{ color: 'var(--foreground-subtle)', opacity: 0.5, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
            Your Library is Empty
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginBottom: '24px' }}>
            Bookmark words in the Vocabulary Studio to review and memorize them here anytime.
          </p>
          <Link
            href="/vocabulary"
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Explore Vocabulary Studio</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </AppShell>
  )
}
