'use client'
import { useState } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { playTTS, addXP } from '@/lib/storage'
import {
  Video,
  Play,
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Volume2
} from 'lucide-react'

interface VideoLesson {
  id: string
  title: string
  urduTitle: string
  duration: string
  level: string
  category: string
  description: string
  summaryUrdu: string
  keyTakeaways: string[]
}

const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'vid1',
    title: 'English Pronunciation Masterclass: Master the "TH" & "R" Sounds',
    urduTitle: 'درست انگریزی تلفظ: "TH" اور "R" آوازوں کی تربیت',
    duration: '8:45',
    level: 'A1 - B1',
    category: 'Pronunciation',
    description: 'Learn tongue placement techniques to distinguish between "Think" (θ) and "This" (ð) without straining your jaw.',
    summaryUrdu: 'اس سبق میں زبان کو دانتوں کے درمیان رکھ کر "TH" کی نرم اور بھاری آوازیں نکالنے کا طریقہ سکھایا گیا ہے۔',
    keyTakeaways: [
      'Voiceless "TH": Air passes without vocal cord vibration (Think, Thought)',
      'Voiced "TH": Vocal cords vibrate with tongue tip touching front teeth (The, They, This)',
      'Practice with a mirror to inspect tongue position',
    ],
  },
  {
    id: 'vid2',
    title: 'Top 10 English Mistakes Made by Urdu Speakers',
    urduTitle: 'اردو بولنے والوں کی 10 عام انگریزی غلطیاں اور ان کا حل',
    duration: '11:20',
    level: 'A2 - B2',
    category: 'Common Pitfalls',
    description: 'Fix habitual translation traps like "I am having doubt", "take exam" vs "give exam", and preposition confusion.',
    summaryUrdu: 'اردو سے لفظ بہ لفظ ترجمہ کرنے کی عادت ختم کریں اور انگریزی کے فطری محاورے سیکھیں۔',
    keyTakeaways: [
      'Say "I have a question" instead of "I have a doubt"',
      'Teachers "give" an exam; students "take" or "sit for" an exam',
      'Use "discuss something" (never "discuss about something")',
    ],
  },
  {
    id: 'vid3',
    title: 'How to Confidently Introduce Yourself in an English Job Interview',
    urduTitle: 'نوکری کے انٹرویو میں پر اعتماد تعارف کا طریقہ',
    duration: '14:10',
    level: 'B1 - C1',
    category: 'Career & Interviews',
    description: 'A 3-step formula (Past experience, Present strengths, Future alignment with company) to ace the first 90 seconds.',
    summaryUrdu: 'انٹرویو کے پہلے 90 سیکنڈز میں مؤثر اور پر اثر تعارف کروانے کا آزمودہ فارمولا دیکھیں۔',
    keyTakeaways: [
      'Hook the interviewer in 15 seconds with your core value proposition',
      'Mention 1-2 quantified metrics of past accomplishment',
      'Conclude by connecting your passion with the company\'s current challenge',
    ],
  },
]

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(VIDEO_LESSONS[0])
  const [watchedIds, setWatchedIds] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleMarkWatched = (vidId: string) => {
    if (!watchedIds.includes(vidId)) {
      setWatchedIds([...watchedIds, vidId])
      addXP(40)
      setToastMessage('Lesson completed! +40 XP awarded!')
      setTimeout(() => setToastMessage(null), 3500)
    }
  }

  return (
    <AppShell>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '700',
            fontSize: '14px',
            zIndex: 100,
          }}
        >
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'var(--primary-100)',
              color: 'var(--color-primary)',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            Video Masterclasses
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            High-Impact Visual Lessons with Bilingual Notes
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
          Video Lessons • ویڈیو اسباق
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Visual, high-impact video breakdowns covering pronunciation techniques, common Urdu-to-English translation errors, and job interview preparation.
        </p>
      </div>

      {/* Grid: Video Player & List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* Left: Active Video Stage */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          {/* Simulated Video Player */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              className="hover:scale-110"
              onClick={() => playTTS(selectedVideo.description)}
            >
              <Play size={28} fill="white" />
            </div>
            <div style={{ marginTop: '14px', fontSize: '14px', fontWeight: '600', opacity: 0.85 }}>
              Click to preview lesson audio
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                fontSize: '12px',
                background: 'rgba(0,0,0,0.6)',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              {selectedVideo.duration}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                {selectedVideo.category} • {selectedVideo.level}
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', lineHeight: 1.3, marginBottom: '6px' }}>
              {selectedVideo.title}
            </h2>
            <div style={{ fontSize: '15px', color: '#0284c7', fontWeight: '600' }}>
              {selectedVideo.urduTitle}
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            {selectedVideo.description}
          </p>

          {/* Urdu Summary Callout */}
          <div
            style={{
              background: 'var(--surface-subtle)',
              borderLeft: '4px solid #0284c7',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#0369a1',
              marginBottom: '20px',
            }}
          >
            {selectedVideo.summaryUrdu}
          </div>

          {/* Key Takeaways */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '10px' }}>
              Key Takeaways:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedVideo.keyTakeaways.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--foreground-muted)' }}>
                  <CheckCircle2 size={15} color="#10b981" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleMarkWatched(selectedVideo.id)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: watchedIds.includes(selectedVideo.id) ? '#dcfce7' : 'var(--color-primary)',
              color: watchedIds.includes(selectedVideo.id) ? '#16a34a' : 'white',
              fontWeight: '700',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{watchedIds.includes(selectedVideo.id) ? 'Lesson Completed (+40 XP)' : 'Mark Lesson as Completed (+40 XP)'}</span>
          </button>
        </div>

        {/* Right: Playlist */}
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>
            Lesson Playlist
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {VIDEO_LESSONS.map((vid) => {
              const isSelected = selectedVideo.id === vid.id
              const isWatched = watchedIds.includes(vid.id)

              return (
                <button
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-50)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)' }}>
                      {vid.category}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {vid.duration}
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? 'var(--color-primary)' : 'var(--foreground)', marginBottom: '2px' }}>
                    {vid.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
                    {vid.urduTitle}
                  </div>

                  {isWatched && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} />
                      <span>Completed</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
