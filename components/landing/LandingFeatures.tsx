'use client'
import Link from 'next/link'

const features = [
  {
    icon: '🤖',
    badge: 'AI-Powered',
    title: 'Personal AI English Tutor',
    titleUrdu: 'ذاتی AI انگلش ٹیوٹر',
    desc: 'Practice real-life English anytime with an intelligent AI tutor that corrects mistakes gently, explains nuances, and provides bilingual Urdu-English translations on demand.',
    highlights: ['Adaptive to your fluency level', 'Instant error corrections with explanations', 'Urdu translation toggle'],
    accent: '#3b82f6',
  },
  {
    icon: '🗣️',
    badge: 'Speech & Audio',
    title: 'Speaking & Pronunciation Lab',
    titleUrdu: 'بول چال اور تلفظ کی تربیت',
    desc: 'Speak naturally into your microphone and receive immediate phonetic accuracy scores, syllable stress advice, and audio comparison with native speakers.',
    highlights: ['Live speech recognition feedback', 'Phonetic breakdown & accent tips', 'Confidence-building scenario drills'],
    accent: '#06b6d4',
  },
  {
    icon: '🧠',
    badge: 'Spaced Repetition',
    title: 'Smart Vocabulary Engine',
    titleUrdu: 'ذہین ذخیرہ الفاظ',
    desc: 'Learn high-frequency English words categorized by A1-C2 CEFR levels, interview vocabulary, and workplace idioms, reinforced using scientifically proven SM-2 spaced repetition.',
    highlights: ['1,000+ curated essential words', 'Real examples & Urdu meanings', 'Smart flashcard review schedules'],
    accent: '#8b5cf6',
  },
  {
    icon: '📖',
    badge: 'Step-by-Step',
    title: 'Grammar Academy',
    titleUrdu: 'جامع گرامر اکیڈمی',
    desc: 'From tenses and active/passive voice to prepositions and modal verbs. Every lesson features crystal-clear rules, common pitfalls, Urdu comparisons, and interactive quizzes.',
    highlights: ['30+ structured interactive units', 'Common errors spotlighted', 'Immediate practice questions'],
    accent: '#10b981',
  },
  {
    icon: '✍️',
    badge: 'AI Evaluator',
    title: 'Writing Studio & Paraphraser',
    titleUrdu: 'تحریری مہارت اور اصلاح',
    desc: 'Draft emails, resumes, and essays. Our AI marks grammatical slips, suggests sophisticated vocabulary, and rewrites your text for casual, professional, or academic tones.',
    highlights: ['Tone transformer (Casual / Formal)', 'Grammar & syntax analysis', 'Email & job application templates'],
    accent: '#f59e0b',
  },
  {
    icon: '🏆',
    badge: 'Gamification',
    title: 'Progress, Streaks & Badges',
    titleUrdu: 'روزانہ چیلنجز اور انعامات',
    desc: 'Stay motivated with daily streaks, XP points, celebratory milestones, level-up badges, and visual analytics tracking your listening, speaking, reading, and writing growth.',
    highlights: ['Streak freeze & bonus challenges', 'Level progress from Beginner to Fluent', 'Detailed competency analytics'],
    accent: '#ec4899',
  },
]

export default function LandingFeatures() {
  return (
    <section
      id="features"
      style={{
        padding: '100px 0',
        background: 'var(--background)',
        position: 'relative',
      }}
    >
      <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 64px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'var(--primary-50)',
              color: 'var(--color-primary)',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '16px',
              border: '1px solid var(--primary-200)',
            }}
          >
            <span>✨</span> Core Superpowers
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: '800',
              color: 'var(--foreground)',
              lineHeight: '1.2',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            Everything You Need to Master English
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--foreground-muted)',
              lineHeight: '1.6',
            }}
          >
            Built specifically for learners who want practical confidence, native-sounding pronunciation, and bilingual guidance when things get tough.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px',
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '20px',
                border: '1px solid var(--card-border)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--card-shadow)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="hover:translate-y-[-4px] hover:shadow-xl"
            >
              {/* Subtle top accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: feature.accent,
                }}
              />

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: `${feature.accent}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: `${feature.accent}15`,
                      color: feature.accent,
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--foreground)',
                    marginBottom: '4px',
                  }}
                >
                  {feature.title}
                </h3>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--foreground-subtle)',
                    marginBottom: '14px',
                    fontWeight: '500',
                  }}
                >
                  {feature.titleUrdu}
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--foreground-muted)',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                  }}
                >
                  {feature.desc}
                </p>
              </div>

              {/* Highlights List */}
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {feature.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: 'var(--foreground-muted)',
                    }}
                  >
                    <span style={{ color: feature.accent, fontWeight: '700' }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
