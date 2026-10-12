'use client'
import Link from 'next/link'

export default function LandingCTA() {
  return (
    <section
      style={{
        padding: '90px 24px',
        background: 'var(--gradient-hero)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Decorative radial glows */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px',
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          🚀 Start Today For Free • کوئی فیس نہیں
        </span>

        <h2
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '900',
            lineHeight: '1.15',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          Begin Your English Mastery Journey Now
        </h2>

        <p
          style={{
            fontSize: '18px',
            opacity: 0.9,
            lineHeight: '1.6',
            marginBottom: '36px',
            maxWidth: '620px',
            margin: '0 auto 36px',
          }}
        >
          Join thousands of learners achieving confident speech, job interview readiness, and effortless daily communication with EnglishMate AI.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link
            href="/onboarding"
            style={{
              padding: '16px 36px',
              borderRadius: '12px',
              background: 'white',
              color: '#1d4ed8',
              fontWeight: '700',
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            className="hover:translate-y-[-2px] hover:shadow-2xl"
          >
            <span>Get Started Free</span>
            <span>→</span>
          </Link>

          <Link
            href="/dashboard"
            style={{
              padding: '16px 32px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s ease',
            }}
            className="hover:bg-white/20"
          >
            Explore Dashboard
          </Link>
        </div>

        <div
          style={{
            marginTop: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '13px',
            opacity: 0.85,
            flexWrap: 'wrap',
          }}
        >
          <span>✓ No credit card required</span>
          <span>✓ Instant access to all modules</span>
          <span>✓ Works on Mobile & Desktop</span>
        </div>
      </div>
    </section>
  )
}
