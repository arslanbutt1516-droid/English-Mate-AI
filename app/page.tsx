import Link from 'next/link'
import LandingHero from '@/components/landing/LandingHero'
import LandingFeatures from '@/components/landing/LandingFeatures'
import LandingModules from '@/components/landing/LandingModules'
import LandingCTA from '@/components/landing/LandingCTA'
import LandingNav from '@/components/landing/LandingNav'
import LandingFooter from '@/components/landing/LandingFooter'

export default function HomePage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingModules />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
