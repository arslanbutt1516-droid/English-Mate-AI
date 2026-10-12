'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Briefcase,
  Plane,
  GraduationCap,
  MessageCircle,
  Clock,
  Compass
} from 'lucide-react'
import { addXP } from '@/lib/storage'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [urduSupport, setUrduSupport] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState('career')
  const [selectedLevel, setSelectedLevel] = useState('B1')
  const [dailyTime, setDailyTime] = useState('15')

  const handleFinish = () => {
    addXP(100)
    router.push('/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
      }}
    >
      {/* Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--card-border)',
          padding: '40px',
          boxShadow: 'var(--card-shadow-lg)',
        }}
      >
        {/* Header Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-hero)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
              }}
            >
              E
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>
              EnglishMate AI Setup
            </span>
          </div>

          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
            Step {step} of 3
          </div>
        </div>

        {/* Step 1: Goals & Language */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
              What is your primary learning goal?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginBottom: '24px' }}>
              We will tailor your daily vocabulary, reading articles, and speaking drills around this focus.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              {[
                { id: 'career', title: 'Career & Job Interviews', urdu: 'ملازمت اور انٹرویو کی تیاری', icon: Briefcase },
                { id: 'daily', title: 'Everyday Conversation', urdu: 'روزمرہ کی پر اعتماد گفتگو', icon: MessageCircle },
                { id: 'academic', title: 'Exams & Academic Writing', urdu: 'امتحانات اور تعلیمی مضامین', icon: GraduationCap },
                { id: 'travel', title: 'Travel & Relocation', urdu: 'بیرونِ ملک سفر اور رہائش', icon: Plane },
              ].map((goal) => {
                const Icon = goal.icon
                const isSelected = selectedGoal === goal.id

                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    style={{
                      padding: '18px',
                      borderRadius: '14px',
                      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary-50)' : 'var(--surface-subtle)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Icon size={20} color={isSelected ? 'var(--color-primary)' : 'var(--foreground-muted)'} />
                      {isSelected && <CheckCircle2 size={16} color="var(--color-primary)" />}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>
                      {goal.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#0284c7' }}>
                      {goal.urdu}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Urdu Toggle card */}
            <div
              style={{
                background: 'var(--surface-subtle)',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Globe size={22} color="var(--color-primary)" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                    Enable Urdu Explanations (اردو رہنمائی)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                    Includes translations and pronunciation phonetics in Urdu
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={urduSupport}
                onChange={(e) => setUrduSupport(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Level Assessment */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
              Select your current English comfort level
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginBottom: '24px' }}>
              Don't worry — the AI adapts automatically based on your answers and speaking exercises.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { id: 'A1', label: 'Beginner (A1)', desc: 'I know basic words but struggle to form full sentences.' },
                { id: 'A2', label: 'Elementary (A2)', desc: 'I can speak simple daily phrases but need time to think.' },
                { id: 'B1', label: 'Intermediate (B1)', desc: 'I understand most conversations and want to improve fluency and professional tone.' },
                { id: 'B2', label: 'Advanced (B2+)', desc: 'I speak comfortably and want native idioms, accent perfection, and nuance.' },
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.id

                return (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary-50)' : 'var(--surface-subtle)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: isSelected ? 'var(--color-primary)' : 'var(--foreground)' }}>
                        {lvl.label}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginTop: '2px' }}>
                        {lvl.desc}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={18} color="var(--color-primary)" />}
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: 'var(--foreground-muted)',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Commitment & Plan Generation */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
              How much time can you commit daily?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginBottom: '24px' }}>
              Consistent daily practice beats long infrequent cram sessions every time.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
              {[
                { mins: '10', label: 'Casual', desc: '1 drill + 5 words' },
                { mins: '15', label: 'Recommended', desc: 'Speaking + Grammar' },
                { mins: '30', label: 'Intensive', desc: 'Full Mastery track' },
              ].map((t) => {
                const isSelected = dailyTime === t.mins

                return (
                  <button
                    key={t.mins}
                    onClick={() => setDailyTime(t.mins)}
                    style={{
                      padding: '20px 14px',
                      borderRadius: '14px',
                      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary-50)' : 'var(--surface-subtle)',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: '900', color: isSelected ? 'var(--color-primary)' : 'var(--foreground)' }}>
                      {t.mins}m
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginTop: '4px' }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)', marginTop: '2px' }}>
                      {t.desc}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Generated Plan Preview Box */}
            <div
              style={{
                background: 'var(--gradient-card)',
                border: '1px solid var(--primary-200)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '32px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: '800', fontSize: '14px', marginBottom: '6px' }}>
                <Sparkles size={16} />
                <span>Your Personalized Curriculum is Ready</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
                Level: <strong style={{ color: 'var(--foreground)' }}>{selectedLevel}</strong> • Goal: <strong style={{ color: 'var(--foreground)' }}>{selectedGoal}</strong> • Urdu Explanations: <strong style={{ color: 'var(--foreground)' }}>{urduSupport ? 'Enabled' : 'Disabled'}</strong>. You will receive +100 bonus XP for completing setup!
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: 'var(--foreground-muted)',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>

              <button
                onClick={handleFinish}
                style={{
                  padding: '14px 36px',
                  borderRadius: '12px',
                  background: 'var(--gradient-hero)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(29, 78, 216, 0.3)',
                }}
              >
                <span>Start Learning (+100 XP)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
