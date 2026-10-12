'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('muhammad@example.com')
  const [password, setPassword] = useState('••••••••')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 400)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--card-border)',
          padding: '36px',
          boxShadow: 'var(--card-shadow-lg)',
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--gradient-hero)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '900',
              margin: '0 auto 14px',
              boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
            }}
          >
            E
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
            Log in to continue your English learning streak
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-subtle)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--foreground-subtle)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-subtle)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--foreground-subtle)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '8px',
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--color-primary)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--card-shadow-md)',
            }}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--foreground-muted)' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>
            Register Free
          </Link>
        </div>
      </div>
    </div>
  )
}
