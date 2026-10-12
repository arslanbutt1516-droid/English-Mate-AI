'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppShell from '@/components/navigation/AppShell'
import {
  Flame,
  Award,
  BookOpen,
  GraduationCap,
  Mic,
  Headphones,
  Sparkles,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  Brain
} from 'lucide-react'
import { getUserProgress, playTTS } from '@/lib/storage'
import { VOCABULARY_LIST } from '@/lib/data/vocabulary'

export default function DashboardPage() {
  const [progress, setProgress] = useState({
    xp: 340,
    streakDays: 4,
    level: 'B1',
    completedLessons: ['g1'],
  })

  useEffect(() => {
    const data = getUserProgress()
    setProgress(data)
  }, [])

  const wordOfTheDay = VOCABULARY_LIST[0]

  return (
    <AppShell>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'var(--gradient-hero)',
          borderRadius: '20px',
          padding: '32px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '28px',
          boxShadow: '0 8px 30px rgba(29, 78, 216, 0.2)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.2)',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '12px',
            }}
          >
            <span>✨</span> Welcome back, Muhammad!
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 3.5vw, 32px)',
              fontWeight: '800',
              lineHeight: 1.2,
              marginBottom: '8px',
            }}
          >
            Ready for your daily 15-minute English sprint?
          </h1>
          <p style={{ opacity: 0.9, fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
            You are on a <span style={{ fontWeight: '700' }}>{progress.streakDays}-day streak</span>! Complete today's speaking drill to reach your weekly B1 milestone.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/speaking"
              style={{
                background: 'white',
                color: '#1d4ed8',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Mic size={16} />
              <span>Resume Speaking Drill</span>
            </Link>

            <Link
              href="/ai-tutor"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Brain size={16} />
              <span>Practice with AI Tutor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Main sections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1: Today's Word of the Day */}
        <div
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--color-primary)',
                  background: 'var(--primary-50)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                WORD OF THE DAY • آج کا لفظ
              </span>
              <button
                onClick={() => playTTS(wordOfTheDay.word)}
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
                title="Pronounce Word"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>
                {wordOfTheDay.word}
              </h2>
              <span style={{ fontSize: '13px', color: 'var(--foreground-subtle)', fontStyle: 'italic' }}>
                {wordOfTheDay.phonetic}
              </span>
            </div>

            <div style={{ fontSize: '15px', color: '#0284c7', fontWeight: '600', marginBottom: '8px' }}>
              {wordOfTheDay.urduMeaning}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
              {wordOfTheDay.definition}
            </p>

            <div
              style={{
                background: 'var(--surface-subtle)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--foreground-muted)',
                borderLeft: '3px solid var(--color-primary)',
              }}
            >
              "{wordOfTheDay.exampleSentence}"
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              href="/vocabulary"
              style={{
                fontSize: '13px',
                color: 'var(--color-primary)',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Explore 1,000+ words</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Card 2: Today's Daily Target Checklist */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
              Today's Targets
            </h3>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#10b981',
                background: '#d1fae5',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              2 / 4 Completed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--surface-subtle)',
              }}
            >
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', textDecoration: 'line-through' }}>
                  Review 5 Flashcards
                </div>
                <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>+20 XP earned</div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--surface-subtle)',
              }}
            >
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', textDecoration: 'line-through' }}>
                  Read "Active Listening" Article
                </div>
                <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>+30 XP earned</div>
              </div>
            </div>

            <Link
              href="/speaking"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--primary-50)',
                textDecoration: 'none',
                border: '1px solid var(--primary-200)',
              }}
            >
              <Mic size={18} style={{ color: 'var(--color-primary)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                  Complete 1 Dialogue Practice
                </div>
                <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>Incomplete • +50 XP</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--color-primary)' }} />
            </Link>

            <Link
              href="/quizzes"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--surface-subtle)',
                textDecoration: 'none',
              }}
            >
              <Award size={18} style={{ color: 'var(--foreground-subtle)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>
                  Take Quick Diagnostic Quiz
                </div>
                <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>Incomplete • +40 XP</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--foreground-subtle)' }} />
            </Link>
          </div>
        </div>

        {/* Card 3: Skills Mastery Radar */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
              Skills Competency Breakdown
            </h3>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)' }}>
              B1 Level
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>Vocabulary Mastery</span>
                <span style={{ color: 'var(--foreground-subtle)' }}>72%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', background: '#3b82f6', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>Grammar Precision</span>
                <span style={{ color: 'var(--foreground-subtle)' }}>85%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: '#10b981', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>Speaking & Fluency</span>
                <span style={{ color: 'var(--foreground-subtle)' }}>64%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '64%', height: '100%', background: '#f59e0b', borderRadius: '9999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>Listening Comprehension</span>
                <span style={{ color: 'var(--foreground-subtle)' }}>80%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', background: '#8b5cf6', borderRadius: '9999px' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link
              href="/progress"
              style={{
                fontSize: '13px',
                color: 'var(--color-primary)',
                fontWeight: '700',
                textDecoration: 'none',
              }}
            >
              View Detailed Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '800',
          color: 'var(--foreground)',
          marginBottom: '16px',
        }}
      >
        Quick Learning Modules
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <Link
          href="/vocabulary"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--card-shadow)',
          }}
          className="hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>Flashcards</div>
            <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>Spaced Repetition</div>
          </div>
        </Link>

        <Link
          href="/grammar"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--card-shadow)',
          }}
          className="hover:border-emerald-500 hover:shadow-md transition-all"
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>Grammar Lessons</div>
            <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>36 Interactive Units</div>
          </div>
        </Link>

        <Link
          href="/speaking"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--card-shadow)',
          }}
          className="hover:border-cyan-500 hover:shadow-md transition-all"
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
            <Mic size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>Speaking Lab</div>
            <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>Voice Practice</div>
          </div>
        </Link>

        <Link
          href="/ai-tutor"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--card-shadow)',
          }}
          className="hover:border-purple-500 hover:shadow-md transition-all"
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>AI Tutor</div>
            <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>24/7 Practice Partner</div>
          </div>
        </Link>
      </div>
    </AppShell>
  )
}
