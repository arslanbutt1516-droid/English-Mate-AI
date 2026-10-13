'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  BotMessageSquare,
  Mic,
  User,
} from 'lucide-react'

const mobileNavItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vocab', href: '/vocabulary', icon: BookOpen },
  { name: 'Speak', href: '/speaking', icon: Mic },
  { name: 'AI Tutor', href: '/ai-tutor', icon: BotMessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
      }}
      className="mobile-bottom-nav"
    >
      {mobileNavItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: isActive ? 'var(--color-primary)' : 'var(--foreground-subtle)',
              fontSize: '11px',
              fontWeight: isActive ? '700' : '500',
              flex: 1,
              height: '100%',
            }}
          >
            <Icon size={20} />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
