'use client'
import { useState, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { getUserProgress, activateStreakShield, addXP } from '@/lib/storage'
import CertificateModal from '@/components/progress/CertificateModal'
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Calendar,
  BookOpen,
  Mic,
  Clock,
  Sparkles,
  Shield,
  GraduationCap,
  Eye,
  HeartHandshake
} from 'lucide-react'

const BADGES = [
  { id: 'b1', title: 'First Conversation', desc: 'Completed your first voice roleplay drill', icon: '🎙️', unlocked: true },
  { id: 'b2', title: 'Grammar Pioneer', desc: 'Mastered 3 core grammar units without errors', icon: '📝', unlocked: true },
  { id: 'b3', title: 'Phonetic Accuracy Ace', desc: 'Achieved >80% speech pronunciation accuracy', icon: '🌟', unlocked: true },
  { id: 'b4', title: '7-Day Streak Warrior', desc: 'Maintained a full week uninterrupted practice', icon: '🔥', unlocked: false },
  { id: 'b5', title: 'Vocabulary Prodigy', desc: 'Saved and memorized over 50 essential words', icon: '📚', unlocked: false },
  { id: 'b6', title: 'Fluent Speaker C1', desc: 'Completed advanced executive workplace dialogues', icon: '👑', unlocked: false },
]

export default function ProgressPage() {
  const [xp, setXp] = useState(340)
  const [streak, setStreak] = useState(4)
  const [shields, setShields] = useState(1)
  const [certOpen, setCertOpen] = useState(false)
  const [shieldToast, setShieldToast] = useState<string | null>(null)

  useEffect(() => {
    const data = getUserProgress()
    setXp(data.xp)
    setStreak(data.streakDays)
    setShields(data.streakShields || 1)
  }, [])

  const handleBuyShield = () => {
    const { success, progress } = activateStreakShield()
    if (success) {
      setXp(progress.xp)
      setShields(progress.streakShields)
      setShieldToast('🛡️ Streak Freeze Shield activated! -100 XP')
    } else {
      setShieldToast('⚠️ You need at least 100 XP to activate a Streak Shield!')
    }
    setTimeout(() => setShieldToast(null), 3500)
  }

  return (
    <AppShell>
      {/* Toast */}
      {shieldToast && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--card-shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '700',
            fontSize: '14px',
            zIndex: 100,
          }}
        >
          <Sparkles size={18} />
          <span>{shieldToast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--primary-100)',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              Learner Growth & Accreditations
            </span>
            <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
              CEFR Level B1 Competency
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: '800',
              color: 'var(--foreground)',
              marginBottom: '8px',
            }}
          >
            Progress & Badges • آپ کی کارکردگی اور انعامات
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '640px' }}>
            Monitor study streaks, skills mastery, verified certificates, and achievement badges as you progress toward native English fluency.
          </p>
        </div>

        {/* Certificate Trigger Button */}
        <button
          onClick={() => setCertOpen(true)}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'var(--gradient-hero)',
            color: 'white',
            fontWeight: '700',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--card-shadow-md)',
          }}
          className="hover:translate-y-[-2px] transition-transform"
        >
          <GraduationCap size={18} />
          <span>View Verified Certificate</span>
        </button>
      </div>

      {/* Top Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ea580c', marginBottom: '12px' }}>
            <Flame size={24} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Active Streak</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)' }}>
            {streak} Days
          </div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '4px' }}>
            Keep practicing daily to reach 7 days
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)', marginBottom: '12px' }}>
            <Award size={24} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Experience XP</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)' }}>
            {xp} XP
          </div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '4px' }}>
            160 XP to reach Level B2 status
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0284c7', marginBottom: '12px' }}>
            <Clock size={24} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Study Time</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)' }}>
            4.8 Hours
          </div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '4px' }}>
            Across vocabulary, audio & dialogues
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '12px' }}>
            <TrendingUp size={24} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Current CEFR</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)' }}>
            B1
          </div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '4px' }}>
            Intermediate Independent User
          </div>
        </div>
      </div>

      {/* Streak Freeze & Eye-Health Wellness Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Streak Shield Card */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={22} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>
                  Streak Freeze Protection
                </h3>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  background: 'var(--primary-50)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                {shields} Active {shields === 1 ? 'Shield' : 'Shields'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
              A Streak Shield automatically protects your daily streak counter if you are busy or miss a single day of practice.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>Cost: 100 XP</span>
            <button
              onClick={handleBuyShield}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--color-primary)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Activate Shield (+1)
            </button>
          </div>
        </div>

        {/* Eye Health & Visual Wellness Alert */}
        <div
          style={{
            background: 'var(--surface-subtle)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0d9488' }}>
            <Eye size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>
              Eye-Care & Ergonomic Study
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
            EnglishMate AI uses tuned low-strain contrast ratios to prevent digital eye fatigue during extended reading and listening sessions.
          </p>
          <div style={{ background: 'var(--card-bg)', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: 'var(--foreground-muted)' }}>
            💡 <strong>The 20-20-20 Habit:</strong> Every 20 minutes of study, look 20 feet away for 20 seconds to relax your optic nerves.
          </div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          padding: '32px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
          Achievements & Milestone Badges
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginBottom: '24px' }}>
          Unlock badges as you complete quizzes, practice dialogues, and maintain daily habits.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {BADGES.map((b) => (
            <div
              key={b.id}
              style={{
                border: `1px solid ${b.unlocked ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                background: b.unlocked ? 'var(--primary-50)' : 'var(--surface-subtle)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                opacity: b.unlocked ? 1 : 0.65,
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: b.unlocked ? 'var(--surface)' : 'var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: b.unlocked ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  flexShrink: 0,
                }}
              >
                {b.icon}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>
                    {b.title}
                  </h3>
                  {b.unlocked ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : (
                    <Lock size={14} color="var(--foreground-subtle)" />
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Certificate Modal */}
      <CertificateModal
        isOpen={certOpen}
        onClose={() => setCertOpen(false)}
        userName="Muhammad"
        level="B1"
      />
    </AppShell>
  )
}
