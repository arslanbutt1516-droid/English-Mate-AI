'use client'
import Link from 'next/link'

const modules = [
  {
    num: '01',
    title: 'Daily Vocabulary',
    urdu: 'روزانہ کے بنیادی الفاظ',
    desc: 'Bite-sized word packs, audio pronunciations, contextual sentences, and flashcards with spaced repetition.',
    href: '/vocabulary',
    stats: '1,200+ Words',
    tag: 'All Levels',
    icon: '📚',
  },
  {
    num: '02',
    title: 'Grammar Academy',
    urdu: 'گرامر اسباق اور مشقیں',
    desc: 'From present simple to complex conditional sentences, explained with clear rules, examples, and Urdu tips.',
    href: '/grammar',
    stats: '36 Units',
    tag: 'Beginner to Advanced',
    icon: '📝',
  },
  {
    num: '03',
    title: 'Reading Studio',
    urdu: 'مطالعہ اور فہم و ادراک',
    desc: 'Engaging real-world articles, stories, and dialogues with instant word definitions on click and comprehension quizzes.',
    href: '/reading',
    stats: '50+ Stories',
    tag: 'A1 - B2 Levels',
    icon: '📰',
  },
  {
    num: '04',
    title: 'Interactive Speaking',
    urdu: 'بولنے کی مشق اور مکالمے',
    desc: 'Simulated dialogues for shopping, restaurant ordering, job interviews, and hotel check-ins with pronunciation scores.',
    href: '/speaking',
    stats: '25 Scenarios',
    tag: 'Voice Interactive',
    icon: '🎙️',
  },
  {
    num: '05',
    title: 'Listening Lab',
    urdu: 'سننے اور سمجھنے کی صلاحیت',
    desc: 'Native speaker audio at multiple speeds (0.75x, 1x, 1.25x) with interactive fill-in-the-blank transcripts.',
    href: '/listening',
    stats: '40 Audio Tracks',
    tag: 'Accents & Speeds',
    icon: '🎧',
  },
  {
    num: '06',
    title: 'AI Personal Tutor',
    urdu: 'انٹیلیجنٹ AI ٹیوٹر',
    desc: '24/7 conversational partner that answers grammar queries, roleplays scenarios, and explains tough concepts.',
    href: '/ai-tutor',
    stats: 'Instant Replies',
    tag: 'Personalized',
    icon: '⚡',
  },
]

export default function LandingModules() {
  return (
    <section
      id="modules"
      style={{
        padding: '100px 0',
        background: 'var(--surface-subtle)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'var(--primary-100)',
              color: 'var(--color-primary)',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            <span>🧭</span> Structured Learning Path
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
            Explore the Learning Modules
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--foreground-muted)',
              lineHeight: '1.6',
            }}
          >
            A step-by-step modular curriculum designed to build your fluency brick by brick.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {modules.map((mod) => (
            <Link
              key={mod.num}
              href={mod.href}
              style={{
                textDecoration: 'none',
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--card-shadow)',
                transition: 'all 0.25s ease',
              }}
              className="hover:translate-y-[-4px] hover:border-blue-400"
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
                      fontSize: '32px',
                    }}
                  >
                    {mod.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'var(--foreground-subtle)',
                    }}
                  >
                    {mod.num}
                  </span>
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--color-primary)',
                    background: 'var(--primary-50)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    marginBottom: '10px',
                  }}
                >
                  {mod.tag}
                </div>

                <h3
                  style={{
                    fontSize: '19px',
                    fontWeight: '700',
                    color: 'var(--foreground)',
                    marginBottom: '4px',
                  }}
                >
                  {mod.title}
                </h3>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--foreground-subtle)',
                    marginBottom: '12px',
                  }}
                >
                  {mod.urdu}
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--foreground-muted)',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                  }}
                >
                  {mod.desc}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '16px',
                  fontSize: '13px',
                }}
              >
                <span style={{ fontWeight: '600', color: 'var(--foreground-muted)' }}>
                  {mod.stats}
                </span>
                <span style={{ color: 'var(--color-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Start Module →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
