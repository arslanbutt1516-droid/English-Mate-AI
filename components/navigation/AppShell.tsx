'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Desktop Sidebar (automatically hidden on mobile screens via .desktop-sidebar) */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
          }}
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            style={{
              width: '280px',
              maxWidth: '85vw',
              height: '100%',
              background: 'var(--surface)',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInLeft 0.22s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isMobileDrawer onClose={() => setMobileDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className="app-main-content"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease',
        }}
      >
        <Header onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        <main
          style={{
            flex: 1,
            padding: '20px 16px',
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
          }}
          className="pb-24 md:pb-8"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
