'use client'
import Link from 'next/link'

export default function LandingFooter() {
  return (
    <footer
      style={{
        background: '#090d16',
        color: '#94a3b8',
        padding: '60px 24px 32px',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--gradient-hero)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '900',
                  color: 'white',
                }}
              >
                E
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>
                English<span style={{ color: '#38bdf8' }}>Mate</span> <span style={{ fontSize: '14px', opacity: 0.8 }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#64748b', maxWidth: '280px' }}>
              Your intelligent, step-by-step English learning companion. Master speech, grammar, vocabulary, and confident everyday communication.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>
              Learning Modules
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link href="/vocabulary" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Daily Vocabulary</Link></li>
              <li><Link href="/grammar" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Grammar Academy</Link></li>
              <li><Link href="/speaking" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Speaking Lab</Link></li>
              <li><Link href="/reading" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Reading Studio</Link></li>
              <li><Link href="/listening" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Listening Lab</Link></li>
              <li><Link href="/ai-tutor" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">AI Personal Tutor</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>
              Tools & Features
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link href="/writing" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">AI Writing Assistant</Link></li>
              <li><Link href="/quizzes" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Skill Assessment & Quizzes</Link></li>
              <li><Link href="/library" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Saved Words & Bookmarks</Link></li>
              <li><Link href="/progress" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Analytics & Badges</Link></li>
              <li><Link href="/videos" style={{ color: '#94a3b8', textDecoration: 'none' }} className="hover:text-white">Video Lessons</Link></li>
            </ul>
          </div>

          {/* Support & Community */}
          <div>
            <h4 style={{ color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>
              Bilingual Learning
            </h4>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#64748b', marginBottom: '12px' }}>
              اردو بولنے والے طلباء اور پروفیشنلز کے لیے خصوصی رہنمائی اور تفصیلی وضاحتیں دستیاب ہیں۔
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <span style={{ fontSize: '12px', background: '#1e293b', padding: '4px 10px', borderRadius: '6px', color: '#38bdf8' }}>
                English + Urdu
              </span>
              <span style={{ fontSize: '12px', background: '#1e293b', padding: '4px 10px', borderRadius: '6px', color: '#34d399' }}>
                A1 to C2
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          <div>
            © 2026 EnglishMate AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
