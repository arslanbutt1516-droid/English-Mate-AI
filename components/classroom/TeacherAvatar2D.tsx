'use client'
import { Sparkles, Volume2, UserCheck, Award } from 'lucide-react'

interface TeacherAvatar2DProps {
  mood?: 'greeting' | 'explaining' | 'pointing' | 'encouraging' | 'celebrating'
  isSpeaking?: boolean
  speechText?: string
  speechUrdu?: string
}

export default function TeacherAvatar2D({
  mood = 'explaining',
  isSpeaking = false,
  speechText = '',
  speechUrdu = '',
}: TeacherAvatar2DProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        height: '100%',
        minHeight: '340px',
        position: 'relative',
      }}
    >
      {/* 2D Animated Teacher Graphic */}
      <div
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSpeaking ? '0 0 30px rgba(99, 102, 241, 0.5)' : '0 10px 25px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          transition: 'all 0.3s ease',
          animation: isSpeaking ? 'pulse 2s infinite' : 'none',
        }}
      >
        {/* Academic Cap / Icon Badge */}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-4px',
            background: '#f59e0b',
            color: 'white',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
          }}
        >
          <Award size={22} />
        </div>

        {/* Illustrated Avatar Silhouette / SVG Face */}
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          {/* Head */}
          <circle cx="50" cy="42" r="24" fill="#fde047" />
          {/* Hair */}
          <path d="M26 38 C 26 22, 74 22, 74 38 C 66 26, 34 26, 26 38 Z" fill="#1e1b4b" />
          {/* Glasses */}
          <circle cx="42" cy="40" r="7" stroke="#1e1b4b" strokeWidth="2.5" fill="none" />
          <circle cx="58" cy="40" r="7" stroke="#1e1b4b" strokeWidth="2.5" fill="none" />
          <line x1="49" y1="40" x2="51" y2="40" stroke="#1e1b4b" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="42" cy="40" r="2.5" fill="#1e1b4b" />
          <circle cx="58" cy="40" r="2.5" fill="#1e1b4b" />
          {/* Smile / Mouth */}
          {isSpeaking ? (
            <ellipse cx="50" cy="52" rx="5" ry="4" fill="#be123c" />
          ) : (
            <path d="M44 51 Q 50 56, 56 51" stroke="#be123c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {/* Body / Suit */}
          <path d="M22 92 C 22 68, 78 68, 78 92 Z" fill="#1e1b4b" />
          {/* Shirt Collar */}
          <polygon points="50,68 42,80 58,80" fill="white" />
          {/* Tie */}
          <polygon points="50,76 46,92 54,92" fill="#38bdf8" />
        </svg>

        {/* Live Speaking Indicator */}
        {isSpeaking && (
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              background: '#10b981',
              color: 'white',
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 10px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Volume2 size={12} />
            <span>Speaking</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>
          Professor Elena Vance
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '700' }}>
          Senior AI English Coach & IELTS Mentor
        </div>
      </div>
    </div>
  )
}
