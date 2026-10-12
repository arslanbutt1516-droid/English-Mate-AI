'use client'
import { useState, useEffect } from 'react'
import { Volume2, Sliders, X, Check, Play } from 'lucide-react'
import { getUserProgress, updateVoiceSettings, playTTS } from '@/lib/storage'
import { VoiceSettings } from '@/lib/types'

export default function VoiceSettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [settings, setSettings] = useState<VoiceSettings>({
    rate: 0.95,
    pitch: 1.0,
    accent: 'en-US',
  })
  const [savedToast, setSavedToast] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const p = getUserProgress()
      setSettings(p.voiceSettings)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    updateVoiceSettings(settings)
    setSavedToast(true)
    setTimeout(() => {
      setSavedToast(false)
      onClose()
    }, 1000)
  }

  const handleTestAudio = () => {
    playTTS(
      'Welcome to EnglishMate AI. This is how your audio coach sounds.',
      settings.rate,
      settings.pitch,
      settings.accent
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          boxShadow: 'var(--card-shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-100)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sliders size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>
                Audio & Pronunciation Coach
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
                Customize voice speed, pitch & accent
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--foreground-subtle)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Accent Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block', marginBottom: '8px' }}>
            Voice Accent:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { id: 'en-US', label: '🇺🇸 American', sub: 'Standard' },
              { id: 'en-GB', label: '🇬🇧 British', sub: 'Oxford' },
              { id: 'en-AU', label: '🇦🇺 Australian', sub: 'Pacific' },
            ].map((acc) => {
              const isSelected = settings.accent === acc.id

              return (
                <button
                  key={acc.id}
                  onClick={() => setSettings({ ...settings, accent: acc.id as any })}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-50)' : 'var(--surface-subtle)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--foreground)',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>{acc.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--foreground-subtle)' }}>{acc.sub}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Speed Slider */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
              Speech Tempo (Speed):
            </label>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)' }}>
              {settings.rate}x
            </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.05"
            value={settings.rate}
            onChange={(e) => setSettings({ ...settings, rate: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--foreground-subtle)', marginTop: '4px' }}>
            <span>0.7x (Slow & Clear)</span>
            <span>1.0x (Normal)</span>
            <span>1.3x (Fast Native)</span>
          </div>
        </div>

        {/* Pitch Slider */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
              Voice Pitch:
            </label>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)' }}>
              {settings.pitch}x
            </span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.2"
            step="0.05"
            value={settings.pitch}
            onChange={(e) => setSettings({ ...settings, pitch: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--foreground-subtle)', marginTop: '4px' }}>
            <span>Lower</span>
            <span>Natural</span>
            <span>Higher</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleTestAudio}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--surface-subtle)',
              color: 'var(--foreground)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Play size={14} />
            <span>Test Sound</span>
          </button>

          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              color: 'white',
              fontSize: '13px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {savedToast ? <Check size={16} /> : null}
            <span>{savedToast ? 'Saved!' : 'Save Voice Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
