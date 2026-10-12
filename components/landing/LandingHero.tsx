'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const stats = [
  { label: 'Active Learners', value: '50,000+' },
  { label: 'Lessons Available', value: '500+' },
  { label: 'Languages Supported', value: 'Urdu & English' },
  { label: 'Daily Practice', value: 'Free Forever' },
]

const badges = [
  { emoji: '🎓', text: 'AI-Powered Tutor' },
  { emoji: '🗣️', text: 'Speaking Practice' },
  { emoji: '📚', text: 'Grammar Academy' },
  { emoji: '🌟', text: 'Urdu Explanations' },
]

export default function LandingHero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax effect on scroll
    const handleScroll = () => {
      if (!heroRef.current) return
      const scrolled = window.scrollY
      const elements = heroRef.current.querySelectorAll('[data-parallax]')
      elements.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.parallax || '0.3')
        ;(el as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Background decorations */}
      <div
        data-parallax="0.15"
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        data-parallax="0.25"
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '0%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Floating cards decoration */}
      <div
        className="hide-mobile animate-float"
        style={{
          position: 'absolute',
          right: '8%',
          top: '25%',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          padding: '16px 20px',
          color: 'white',
          animationDelay: '0.5s',
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '6px' }}>Today's Word</div>
        <div style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em' }}>Perseverance</div>
        <div style={{ fontSize: '13px', opacity: 0.75, marginTop: '4px' }}>مستقل مزاجی</div>
      </div>
      <div
        className="hide-mobile animate-float"
        style={{
          position: 'absolute',
          right: '15%',
          top: '60%',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          padding: '14px 18px',
          color: 'white',
          animationDelay: '1s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(52, 211, 153, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            🔥
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700' }}>7-Day Streak!</div>
            <div style={{ fontSize: '12px', opacity: 0.75 }}>Keep it up! 🎉</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="page-container" style={{ position: 'relative', zIndex: 2, paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '700px' }}>
          {/* Pill badges */}
          <div
            className="animate-fade-in"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}
          >
            {badges.map((badge, i) => (
              <span
                key={badge.text}
                className={`animate-fade-in stagger-${i + 1}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: '13px',
                  fontWeight: '500',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {badge.emoji} {badge.text}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in stagger-2"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'white',
              marginBottom: '20px',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: '900',
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
            }}
          >
            Learn English{' '}
            <span style={{ color: 'var(--cyan-400)' }}>Every Day</span>
            <br />
            with Your Personal
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #60a5fa, #22d3ee, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI Coach
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-in stagger-3"
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '18px',
              lineHeight: '1.7',
              marginBottom: '36px',
              maxWidth: '580px',
            }}
          >
            Master vocabulary, grammar, speaking, and writing with step-by-step AI lessons.
            Urdu explanations available. Built for beginners, loved by everyone.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in stagger-4"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}
          >
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                background: 'white',
                color: 'var(--color-primary)',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Start Learning Free</span>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="#features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 28px',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '14px',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              See How It Works
            </Link>
          </div>

          {/* Trust signals */}
          <div
            className="animate-fade-in stagger-5"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '28px',
              color: 'rgba(255,255,255,0.65)',
              fontSize: '13px',
              flexWrap: 'wrap',
            }}
          >
            <span>✓ No credit card needed</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>✓ Free to start</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>✓ Works on mobile</span>
          </div>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in stagger-6"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1px',
            marginTop: '64px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '24px 20px',
                background: 'rgba(255,255,255,0.05)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  fontWeight: '800',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          lineHeight: 0,
        }}
      >
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '80px' }}>
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  )
}
