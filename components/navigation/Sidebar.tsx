'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Mic,
  Headphones,
  FileText,
  BotMessageSquare,
  HelpCircle,
  BookmarkCheck,
  TrendingUp,
  Settings,
  GraduationCap,
  User
} from 'lucide-react'
import ThemeToggle from '@/components/theme/ThemeToggle'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: '' },
  { name: 'Daily Vocabulary', href: '/vocabulary', icon: BookOpen, badge: 'New' },
  { name: 'Grammar Academy', href: '/grammar', icon: GraduationCap, badge: '' },
  { name: 'Reading Studio', href: '/reading', icon: FileText, badge: '' },
  { name: 'Speaking Lab', href: '/speaking', icon: Mic, badge: 'Voice' },
  { name: 'Listening Lab', href: '/listening', icon: Headphones, badge: '' },
  { name: 'AI Tutor', href: '/ai-tutor', icon: BotMessageSquare, badge: 'AI' },
  { name: 'Writing Assistant', href: '/writing', icon: Sparkles, badge: '' },
  { name: 'Quizzes & Tests', href: '/quizzes', icon: HelpCircle, badge: '' },
  { name: 'Saved Library', href: '/library', icon: BookmarkCheck, badge: '' },
  { name: 'Progress & Badges', href: '/progress', icon: TrendingUp, badge: '' },
  { name: 'Profile & Settings', href: '/profile', icon: User, badge: '' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '260px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
      }}
      className="hidden md:flex"
    >
      {/* Brand header */}
      <div
        style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 24px',
          borderBottom: '1px solid var(--border)',
        }}
      >
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
              fontSize: '20px',
              fontWeight: '900',
              color: 'white',
              boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)',
            }}
          >
            E
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', lineHeight: 1.1 }}>
              English<span style={{ color: 'var(--color-primary)' }}>Mate</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)', fontWeight: '600' }}>
              AI Language Coach
            </div>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            fontWeight: '700',
            letterSpacing: '0.05em',
            color: 'var(--foreground-subtle)',
            padding: '8px 12px 4px',
          }}
        >
          Learning Hub
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--color-primary)' : 'var(--foreground-muted)',
                background: isActive ? 'var(--primary-50)' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon
                  size={18}
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'inherit',
                  }}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    background: item.badge === 'AI' ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'var(--primary-100)',
                    color: item.badge === 'AI' ? 'white' : 'var(--color-primary)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer Profile summary & Theme Toggle */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Link
          href="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit',
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '14px',
            }}
          >
            M
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--foreground)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Muhammad
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '600' }}>
              Level B1 • Intermediate
            </div>
          </div>
        </Link>

        <ThemeToggle />
      </div>
    </aside>
  )
}
