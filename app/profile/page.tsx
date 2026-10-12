'use client'
import { useState, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { getUserProgress, saveUserProgress, DEFAULT_USER_PROGRESS } from '@/lib/storage'
import { UserProgress, CEFRLevel } from '@/lib/types'
import {
  User,
  Settings,
  Mail,
  Award,
  Flame,
  Shield,
  Globe,
  Clock,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Save,
  Check
} from 'lucide-react'

export default function ProfilePage() {
  const [name, setName] = useState('Muhammad')
  const [email, setEmail] = useState('muhammad@example.com')
  const [level, setLevel] = useState<CEFRLevel>('B1')
  const [goal, setGoal] = useState('career')
  const [dailyMinutes, setDailyMinutes] = useState(15)
  const [urduEnabled, setUrduEnabled] = useState(true)
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS)
  const [savedToast, setSavedToast] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  useEffect(() => {
    const p = getUserProgress()
    setProgress(p)
    setLevel(p.level || 'B1')
    try {
      const storedName = localStorage.getItem('englishmate_user_name')
      if (storedName) setName(storedName)
      const storedEmail = localStorage.getItem('englishmate_user_email')
      if (storedEmail) setEmail(storedEmail)
      const storedGoal = localStorage.getItem('englishmate_user_goal')
      if (storedGoal) setGoal(storedGoal)
    } catch {
      // fallback
    }
  }, [])

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('englishmate_user_name', name)
      localStorage.setItem('englishmate_user_email', email)
      localStorage.setItem('englishmate_user_goal', goal)

      const updated = {
        ...progress,
        level,
      }
      saveUserProgress(updated)
      setProgress(updated)
      setSavedToast(true)
      setTimeout(() => setSavedToast(false), 2500)
    } catch (e) {
      console.error(e)
    }
  }

  const handleResetData = () => {
    if (!resetConfirm) {
      setResetConfirm(true)
      setTimeout(() => setResetConfirm(false), 4000)
      return
    }
    saveUserProgress(DEFAULT_USER_PROGRESS)
    setProgress(DEFAULT_USER_PROGRESS)
    setLevel('B1')
    setResetConfirm(false)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2500)
  }

  return (
    <AppShell>
      {/* Toast Notification */}
      {savedToast && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
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
          <CheckCircle2 size={18} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{ marginBottom: '28px' }}>
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
            Learner Account & Settings
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            Personalized Curriculum Configuration
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
          User Profile & Preferences • پروفائل اور ترتیبات
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Manage your personal learning goals, target CEFR proficiency, bilingual explanations, and account statistics.
        </p>
      </div>

      {/* Grid: Profile Info & Preferences */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
          marginBottom: '32px',
        }}
      >
        {/* Left Column: Profile Card & Personal Info */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            padding: '28px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--gradient-hero)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '900',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
                flexShrink: 0,
              }}
            >
              {name.charAt(0) || 'M'}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '2px' }}>
                {name}
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '700' }}>
                Level {level} • Intermediate Learner
              </div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
                {email}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
                Full Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-subtle)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-subtle)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
                Target CEFR Level:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: `1.5px solid ${level === lvl ? 'var(--color-primary)' : 'var(--border)'}`,
                      background: level === lvl ? 'var(--primary-100)' : 'var(--surface-subtle)',
                      color: level === lvl ? 'var(--color-primary)' : 'var(--foreground-muted)',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
                Primary Goal:
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-subtle)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="career">💼 Career & Job Interviews (ملازمت اور انٹرویو)</option>
                <option value="daily">☕ Daily Conversation & Fluency (روزمرہ کی گفتگو)</option>
                <option value="academic">🎓 Academic & Exams (امتحانات اور تعلیمی)</option>
                <option value="travel">✈️ Travel & Living Abroad (بیرونِ ملک سفر)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
                Daily Study Target:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[10, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutes(mins)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1.5px solid ${dailyMinutes === mins ? 'var(--color-primary)' : 'var(--border)'}`,
                      background: dailyMinutes === mins ? 'var(--primary-100)' : 'var(--surface-subtle)',
                      color: dailyMinutes === mins ? 'var(--color-primary)' : 'var(--foreground)',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    {mins} mins/day
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              style={{
                marginTop: '12px',
                padding: '14px',
                borderRadius: '12px',
                background: 'var(--color-primary)',
                color: 'white',
                fontWeight: '700',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'var(--card-shadow-md)',
              }}
            >
              <Save size={16} />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </div>

        {/* Right Column: Account Stats & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Stats Snapshot */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              border: '1px solid var(--card-border)',
              padding: '24px',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>
              Learning Stats Overview
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  <Flame size={16} fill="#ea580c" />
                  <span>Streak</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--foreground)' }}>
                  {progress.streakDays} Days
                </div>
              </div>

              <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  <Award size={16} />
                  <span>Total XP</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--foreground)' }}>
                  {progress.xp} XP
                </div>
              </div>

              <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  <BookOpen size={16} />
                  <span>Mastered</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--foreground)' }}>
                  {progress.masteredWordIds?.length || 1} Words
                </div>
              </div>

              <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  <Shield size={16} />
                  <span>Shields</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--foreground)' }}>
                  {progress.streakShields || 1} Active
                </div>
              </div>
            </div>
          </div>

          {/* Bilingual Urdu Option */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              border: '1px solid var(--card-border)',
              padding: '24px',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={20} color="var(--color-primary)" />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>
                    Bilingual Urdu Explanations
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                    اردو ترجمہ اور تفصیلی گرائمر رہنمائی
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={urduEnabled}
                onChange={(e) => setUrduEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--foreground-subtle)', lineHeight: 1.5 }}>
              When enabled, complex vocabulary and difficult grammar rules display direct Urdu translations and contextual cultural comparisons.
            </p>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div
            style={{
              background: 'var(--surface-subtle)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '24px',
            }}
          >
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>
              Reset Study Progress
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginBottom: '16px' }}>
              Resetting progress will restore your XP, streaks, and lesson completions back to initial diagnostic defaults.
            </p>
            <button
              onClick={handleResetData}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #fca5a5',
                background: resetConfirm ? '#dc2626' : '#fee2e2',
                color: resetConfirm ? 'white' : '#991b1b',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <RotateCcw size={14} />
              <span>{resetConfirm ? 'Click again to confirm reset' : 'Reset My Progress'}</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
