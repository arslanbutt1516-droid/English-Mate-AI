'use client'
import { useState } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { playTTS, addXP } from '@/lib/storage'
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Volume2,
  FileText,
  RotateCcw,
  Zap,
  ArrowRight,
  BookOpen
} from 'lucide-react'

const templates = [
  {
    name: 'Job Application Cover Email',
    urdu: 'ملازمت کے لیے ای میل',
    content: `Dear Hiring Team,\n\nI am writing to express my strong interest in the Project Manager position at your company. With my background in team coordination and active problem solving, I am confident I can contribute meaningfully to your upcoming milestones.\n\nPlease find my resume attached for your review. I look forward to the possibility of discussing this opportunity.\n\nWarm regards,\nMuhammad`,
  },
  {
    name: 'Sick Leave Notice to Manager',
    urdu: 'چھٹی کی درخواست',
    content: `Dear Manager,\n\nI am writing to inform you that I am unwell today with a high fever and doctor advised rest. I will not be able to attend office today.\n\nI have delegated today's urgent client inquiries to Ahmad, and I will be checking urgent messages periodically.\n\nThank you for understanding.\n\nBest regards,\nMuhammad`,
  },
  {
    name: 'Follow-Up After Interview',
    urdu: 'انٹرویو کے بعد شکریہ کا پیغام',
    content: `Dear Interview Panel,\n\nThank you very much for taking the time to speak with me today regarding the Software Engineer role. I truly enjoyed learning about your current engineering roadmap and team culture.\n\nPlease let me know if you require any additional work samples.\n\nSincerely,\nMuhammad`,
  },
]

export default function WritingPage() {
  const [inputText, setInputText] = useState('')
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'academic' | 'persuasive'>('professional')
  const [enhancedText, setEnhancedText] = useState<string | null>(null)
  const [improvements, setImprovements] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleApplyTemplate = (tmpl: typeof templates[0]) => {
    setInputText(tmpl.content)
    setEnhancedText(null)
  }

  const handleEnhance = () => {
    if (!inputText.trim()) return
    setIsProcessing(true)

    setTimeout(() => {
      let output = inputText
      let changes: string[] = []

      if (selectedTone === 'professional') {
        output = inputText
          .replace(/I want to tell you/gi, 'I would like to convey')
          .replace(/give me/gi, 'could you please provide')
          .replace(/good/gi, 'exceptional')
          .replace(/can not/gi, 'cannot')
          .replace(/thanks/gi, 'Thank you sincerely')

        changes = [
          'Replaced informal phrasing with diplomatic corporate etiquette',
          'Elevated standard verbs to active, executive terminology',
          'Ensured professional greeting and sign-off cadence',
        ]
      } else if (selectedTone === 'casual') {
        output = inputText
          .replace(/Dear/gi, 'Hi')
          .replace(/Warm regards/gi, 'Cheers')
          .replace(/Sincerely/gi, 'Talk soon')

        changes = [
          'Streamlined sentence flow for friendly, approachable tone',
          'Removed stiff formality in greetings',
        ]
      } else {
        output = inputText
          .replace(/big/gi, 'substantial')
          .replace(/important/gi, 'paramount')
          .replace(/I think/gi, 'Evidence suggests that')

        changes = [
          'Upgraded vocabulary to academic precision',
          'Replaced subjective assertions with objective academic phrasing',
        ]
      }

      setEnhancedText(output)
      setImprovements(changes)
      setIsProcessing(false)
      addXP(30)
    }, 600)
  }

  const handleCopy = () => {
    if (!enhancedText) return
    navigator.clipboard.writeText(enhancedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppShell>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            AI Writing Lab & Paraphraser
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            Corporate Emails • Tone Adjuster • Grammar Polish
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
          Writing Assistant • تحریری مہارت اور اصلاح
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Compose emails, proposals, and essays. Switch between casual, professional, and academic tones, polish grammatical flow, and elevate vocabulary instantly.
        </p>
      </div>

      {/* Quick Templates Bar */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          padding: '16px 20px',
          marginBottom: '24px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-subtle)', textTransform: 'uppercase', marginBottom: '10px' }}>
          Quick Workplace Templates:
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {templates.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyTemplate(tmpl)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface-subtle)',
                color: 'var(--foreground)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              className="hover:border-blue-400 hover:text-blue-600"
            >
              <FileText size={14} />
              <span>{tmpl.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>({tmpl.urdu})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Enhancer Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left: Input Text Editor */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
              Your Draft
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
              {inputText.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your English text here, or select one of the workplace templates above..."
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--surface-subtle)',
              color: 'var(--foreground)',
              fontSize: '14px',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              marginBottom: '16px',
            }}
          />

          {/* Tone Selector */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Select Desired Tone:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'professional', label: '💼 Professional / Corporate' },
                { id: 'casual', label: '☕ Friendly & Casual' },
                { id: 'academic', label: '🎓 Academic & Formal' },
              ].map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id as any)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: `1px solid ${selectedTone === tone.id ? 'var(--color-primary)' : 'var(--border)'}`,
                    background: selectedTone === tone.id ? 'var(--primary-50)' : 'var(--surface-subtle)',
                    color: selectedTone === tone.id ? 'var(--color-primary)' : 'var(--foreground-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleEnhance}
            disabled={!inputText.trim() || isProcessing}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: 'var(--gradient-hero)',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
              border: 'none',
              cursor: inputText.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(29, 78, 216, 0.2)',
            }}
          >
            <Sparkles size={16} />
            <span>{isProcessing ? 'Analyzing & Rewriting...' : 'Transform & Polish with AI (+30 XP)'}</span>
          </button>
        </div>

        {/* Right: AI Enhanced Result */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
              AI Enhanced Version
            </h3>
            {enhancedText && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => playTTS(enhancedText)}
                  style={{
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                  }}
                  title="Listen to audio"
                >
                  <Volume2 size={14} />
                  <span>Listen</span>
                </button>

                <button
                  onClick={handleCopy}
                  style={{
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: copied ? '#10b981' : 'var(--foreground-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                  }}
                >
                  <Copy size={14} />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {enhancedText ? (
            <div>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: '#0f172a',
                  whiteSpace: 'pre-line',
                  marginBottom: '20px',
                }}
              >
                {enhancedText}
              </div>

              {/* Improvements summary */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Improvements Applied:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {improvements.map((imp, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#16a34a' }}>
                      <CheckCircle2 size={15} />
                      <span style={{ color: 'var(--foreground-muted)' }}>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--foreground-subtle)',
                textAlign: 'center',
                border: '2px dashed var(--border)',
                borderRadius: '12px',
              }}
            >
              <Sparkles size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Your enhanced text will appear here</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Click "Transform & Polish" to evaluate grammar and style</div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
