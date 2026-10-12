'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/theme/ThemeToggle'

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div
        className="page-container"
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--gradient-hero)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '900',
              color: 'white',
              flexShrink: 0,
            }}
          >
            E
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontSize: '20px',
              color: scrolled ? 'var(--foreground)' : 'white',
            }}
          >
            EnglishMate<span style={{ color: scrolled ? 'var(--color-primary)' : 'var(--cyan-400)' }}> AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hide-mobile"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {['Features', 'Modules', 'For Beginners', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: scrolled ? 'var(--foreground-muted)' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLElement).style.color = scrolled ? 'var(--foreground)' : 'white'
                ;(e.target as HTMLElement).style.background = scrolled ? 'var(--surface-subtle)' : 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLElement).style.color = scrolled ? 'var(--foreground-muted)' : 'rgba(255,255,255,0.85)'
                ;(e.target as HTMLElement).style.background = 'transparent'
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA Buttons & Theme Toggle */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          <Link
            href="/login"
            style={{
              padding: '9px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              color: scrolled ? 'var(--color-primary)' : 'white',
              border: `1.5px solid ${scrolled ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)'}`,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Log in
          </Link>
          <Link
            href="/register"
            style={{
              padding: '9px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              background: scrolled ? 'var(--color-primary)' : 'white',
              color: scrolled ? 'white' : 'var(--color-primary)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: scrolled ? '0 2px 8px rgba(29,78,216,0.25)' : '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Start for Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="hide-desktop"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: scrolled ? 'var(--foreground)' : 'white',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: 'white',
            borderBottom: '1px solid var(--border)',
            padding: '16px 24px 24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
            {['Features', 'Modules', 'For Beginners', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--foreground-muted)',
                  textDecoration: 'none',
                }}
              >
                {item}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/login" className="btn btn-secondary">Log in</Link>
            <Link href="/register" className="btn btn-primary">Start for Free</Link>
          </div>
        </div>
      )}
    </header>
  )
}
