'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flame, Award, Globe, Volume2, Sparkles, User, Search, BookOpen, X, Sliders, Settings, GraduationCap, Menu } from 'lucide-react'
import { getUserProgress, playTTS } from '@/lib/storage'
import ThemeToggle from '@/components/theme/ThemeToggle'
import VoiceSettingsModal from '@/components/shared/VoiceSettingsModal'
import { VOCABULARY_LIST } from '@/lib/data/vocabulary'

export default function Header({
  onOpenMobileDrawer,
}: {
  onOpenMobileDrawer?: () => void
}) {
  const [xp, setXp] = useState(340)
  const [streak, setStreak] = useState(4)
  const [urduEnabled, setUrduEnabled] = useState(true)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const progress = getUserProgress()
    setXp(progress.xp)
    setStreak(progress.streakDays)
  }, [])

  const searchResults = searchTerm.trim()
    ? VOCABULARY_LIST.filter(
        (w) =>
          w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.urduMeaning.includes(searchTerm) ||
          w.definition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <>
      <header
        style={{
          height: '70px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backdropFilter: 'blur(12px)',
          maxWidth: '100vw',
        }}
      >
        {/* Left title / breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onOpenMobileDrawer}
              style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--foreground)',
                cursor: 'pointer',
              }}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
            <Link href="/" style={{ textDecoration: 'none', fontWeight: '800', color: 'var(--color-primary)', fontSize: '17px' }}>
              EnglishMate
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span style={{ color: 'var(--foreground-muted)' }}>Personal Coaching</span>
            <span>•</span>
            <span style={{ fontWeight: '700', color: 'var(--foreground)' }}>Interactive Curriculum</span>
          </div>

          {/* Quick Dictionary Search Trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              color: 'var(--foreground-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              marginLeft: '8px',
            }}
            className="hover:border-indigo-400 transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Quick Dictionary (Ctrl+K)</span>
          </button>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Voice Coach Settings */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Audio & Pronunciation Speed Settings"
            aria-label="Voice Settings"
          >
            <Sliders size={17} />
          </button>

          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* Urdu toggle button */}
          <button
            onClick={() => setUrduEnabled(!urduEnabled)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: urduEnabled ? 'var(--primary-50)' : 'var(--surface-subtle)',
              border: `1px solid ${urduEnabled ? 'var(--primary-300)' : 'var(--border)'}`,
              fontSize: '12px',
              fontWeight: '600',
              color: urduEnabled ? 'var(--color-primary)' : 'var(--foreground-muted)',
              cursor: 'pointer',
            }}
            title="Toggle Urdu translations throughout lessons"
          >
            <Globe size={14} />
            <span className="hidden sm:inline">اردو: {urduEnabled ? 'فعال' : 'بند'}</span>
          </button>

          {/* Streak counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(234, 88, 12, 0.1)',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              color: '#ea580c',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            <Flame size={16} fill="#ea580c" />
            <span>{streak}d</span>
          </div>

          {/* XP Points */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              color: 'var(--color-primary)',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            <Award size={16} />
            <span>{xp} XP</span>
          </div>

          {/* User Profile Avatar with Interactive Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--gradient-hero)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                transition: 'transform 0.15s ease',
              }}
              title="User Account & Settings"
              aria-label="User Profile Menu"
            >
              <User size={18} />
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '260px',
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '16px',
                  boxShadow: 'var(--card-shadow-lg)',
                  padding: '16px',
                  zIndex: 80,
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                {/* User info row */}
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--foreground)' }}>
                    Muhammad
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '700' }}>
                    Level B1 • Intermediate Learner
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>
                    muhammad@example.com
                  </div>
                </div>

                {/* Navigation links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--foreground)',
                      textDecoration: 'none',
                    }}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Settings size={15} style={{ color: 'var(--color-primary)' }} />
                    <span>My Profile & Settings</span>
                  </Link>

                  <Link
                    href="/progress"
                    onClick={() => setProfileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--foreground)',
                      textDecoration: 'none',
                    }}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <GraduationCap size={15} style={{ color: '#10b981' }} />
                    <span>CEFR Certificate & Badges</span>
                  </Link>

                  <Link
                    href="/library"
                    onClick={() => setProfileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--foreground)',
                      textDecoration: 'none',
                    }}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <BookOpen size={15} style={{ color: '#0284c7' }} />
                    <span>Saved Word Vault</span>
                  </Link>
                </div>

                {/* Footer sign out / reset link */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '10px' }}>
                  <Link
                    href="/login"
                    onClick={() => setProfileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#ef4444',
                      textDecoration: 'none',
                    }}
                    className="hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <span>Sign Out / Switch Account</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '100px',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: '18px',
              width: '100%',
              maxWidth: '560px',
              boxShadow: 'var(--card-shadow-lg)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Search size={18} style={{ color: 'var(--color-primary)' }} />
              <input
                autoFocus
                type="text"
                placeholder="Search English word, meaning, or اردو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: 'var(--foreground)',
                }}
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--foreground-subtle)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '12px 16px' }}>
              {searchResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {searchResults.map((word) => (
                    <div
                      key={word.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'var(--surface-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '800', color: 'var(--foreground)', fontSize: '15px' }}>{word.word}</span>
                          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)', fontStyle: 'italic' }}>{word.phonetic}</span>
                          <span style={{ fontSize: '10px', fontWeight: '800', background: 'var(--primary-100)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>
                            {word.level}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#0284c7', marginTop: '2px', fontWeight: '600' }}>
                          {word.urduMeaning}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '2px' }}>
                          {word.definition}
                        </div>
                      </div>

                      <button
                        onClick={() => playTTS(word.word)}
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--color-primary)',
                          flexShrink: 0,
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : searchTerm.trim() ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--foreground-muted)', fontSize: '14px' }}>
                  No exact word matches found for "{searchTerm}"
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--foreground-subtle)', fontSize: '13px' }}>
                  Start typing to look up high-frequency words, Urdu translations & pronunciations...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Voice Coach Settings Modal */}
      <VoiceSettingsModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
    </>
  )
}
