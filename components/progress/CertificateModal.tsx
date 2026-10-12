'use client'
import { useState } from 'react'
import { Award, CheckCircle, Printer, X, Share2, Sparkles } from 'lucide-react'

export default function CertificateModal({
  isOpen,
  onClose,
  userName = 'Muhammad',
  level = 'B1',
}: {
  isOpen: boolean
  onClose: () => void
  userName?: string
  level?: string
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://englishmate.ai/verify/EM-2026-${level}-8492`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '680px',
          boxShadow: 'var(--card-shadow-lg)',
          overflow: 'hidden',
          padding: '32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-100)', padding: '4px 10px', borderRadius: '6px' }}>
              Official Verification
            </span>
            <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
              ID: EM-2026-{level}-8492
            </span>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--foreground-subtle)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Certificate Printable Canvas */}
        <div
          id="printable-certificate"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '8px double #4338ca',
            borderRadius: '16px',
            padding: '36px 32px',
            textAlign: 'center',
            color: '#0f172a',
            position: 'relative',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          }}
        >
          {/* Watermark Logo */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: '900',
              margin: '0 auto 16px',
              boxShadow: '0 4px 12px rgba(67, 56, 202, 0.3)',
            }}
          >
            E
          </div>

          <div style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '13px', fontWeight: '800', color: '#4338ca', marginBottom: '8px' }}>
            Certificate of English Competency
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>
            EnglishMate AI Academy
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>
            This certifies that
          </div>

          <div
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#1e1b4b',
              borderBottom: '2px solid #cbd5e1',
              paddingBottom: '8px',
              maxWidth: '380px',
              margin: '0 auto 20px',
              letterSpacing: '-0.02em',
            }}
          >
            {userName}
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155', maxWidth: '480px', margin: '0 auto 24px' }}>
            has demonstrated consistent mastery across Vocabulary, Grammar Structures, Audio Listening Comprehension, and Interactive Speaking Drills at the:
          </p>

          <div
            style={{
              display: 'inline-block',
              background: '#eef2ff',
              border: '2px solid #6366f1',
              borderRadius: '12px',
              padding: '10px 24px',
              fontSize: '20px',
              fontWeight: '900',
              color: '#312e81',
              marginBottom: '28px',
            }}
          >
            CEFR Level {level} • Intermediate User
          </div>

          {/* Verification Signatures Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
              fontSize: '12px',
              color: '#64748b',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>AI Evaluation Engine</div>
              <div>EnglishMate Pedagogy Board</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Award size={28} color="#d97706" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#d97706' }}>VERIFIED ACCREDITED</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>Issue Date: 2026</div>
              <div>Verifiable Code: #EM-8492</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCopyLink}
            style={{
              padding: '10px 18px',
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
            <Share2 size={15} />
            <span>{copied ? 'Link Copied!' : 'Share Credential'}</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'var(--color-primary)',
              color: 'white',
              fontSize: '13px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}
