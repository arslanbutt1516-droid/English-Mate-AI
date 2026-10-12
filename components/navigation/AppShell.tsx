'use client'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease',
        }}
        className="md:pl-[260px]"
      >
        <Header />

        <main
          style={{
            flex: 1,
            padding: '24px',
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
