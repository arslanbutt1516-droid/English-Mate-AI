import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'EnglishMate AI — Your Personal English Learning Coach',
    template: '%s | EnglishMate AI',
  },
  description:
    'Learn English step by step with AI-powered lessons, vocabulary, grammar, speaking practice, and a personal tutor. Perfect for beginners and professionals. Urdu explanations available.',
  keywords: [
    'learn english online',
    'english learning app',
    'english for beginners',
    'english grammar',
    'english vocabulary',
    'english speaking practice',
    'urdu to english',
    'ai english tutor',
    'english pronunciation',
  ],
  authors: [{ name: 'EnglishMate AI' }],
  creator: 'EnglishMate AI',
  openGraph: {
    title: 'EnglishMate AI — Your Personal English Learning Coach',
    description: 'AI-powered English learning with vocabulary, grammar, speaking, and personal tutoring.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EnglishMate AI',
    description: 'Learn English with your AI-powered personal coach.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1d4ed8',
}

import { ThemeProvider } from '@/components/theme/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable}`}
        style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
