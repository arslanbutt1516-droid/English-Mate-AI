'use client'
import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--surface-subtle)',
        border: '1px solid var(--border)',
        color: isDark ? '#fbbf24' : 'var(--color-primary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title={isDark ? 'Switch to Eye-Comfort Light Mode' : 'Switch to Night-Care Dark Mode'}
      aria-label="Toggle Dark and Light Mode"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
