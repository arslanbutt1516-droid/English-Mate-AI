'use client'
import { useState, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import {
  IELTSTestType,
  IELTSSkill,
  IELTSPreferences,
  IELTSWritingFeedback,
  IELTSSpeakingFeedback,
} from '@/lib/types'
import {
  IELTS_STUDY_PLANS,
  IELTS_LISTENING_SECTIONS,
  IELTS_READING_PASSAGES,
  IELTS_WRITING_PROMPTS,
  IELTS_SPEAKING_PROMPTS,
  calculateListeningBand,
  calculateReadingBandAcademic,
  calculateReadingBandGeneral,
} from '@/lib/data/ieltsData'
import { playTTS, addXP } from '@/lib/storage'
import confetti from 'canvas-confetti'
import {
  GraduationCap,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Award,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCw,
  FileText,
  AlertTriangle,
  Play,
  Pause,
  HelpCircle,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export default function IELTSCenterPage() {
  const [testType, setTestType] = useState<IELTSTestType>('Academic')
  const [targetBand, setTargetBand] = useState<number>(7.5)
  const [studyDuration, setStudyDuration] = useState<7 | 14 | 30>(30)
  const [activeTab, setActiveTab] = useState<'overview' | 'listening' | 'reading' | 'writing' | 'speaking' | 'mock'>('overview')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Listening state
  const [listeningSectionIndex, setListeningSectionIndex] = useState(0)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({})
  const [listeningSubmitted, setListeningSubmitted] = useState(false)
  const [listeningBand, setListeningBand] = useState<number | null>(null)
  const [showListeningScript, setShowListeningScript] = useState(false)

  // Reading state
  const [readingPassageIndex, setReadingPassageIndex] = useState(0)
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({})
  const [readingSubmitted, setReadingSubmitted] = useState(false)
  const [readingBand, setReadingBand] = useState<number | null>(null)
  const [readingTimeRemaining, setReadingTimeRemaining] = useState(1200) // 20 mins

  // Writing state
  const [writingPromptIndex, setWritingPromptIndex] = useState(0)
  const [writingText, setWritingText] = useState('')
  const [writingFeedback, setWritingFeedback] = useState<IELTSWritingFeedback | null>(null)
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState(false)
  const [showModelAnswer, setShowModelAnswer] = useState(false)

  // Speaking state
  const [speakingPartIndex, setSpeakingPartIndex] = useState(1) // Part 2 cue card
  const [prepTimeRemaining, setPrepTimeRemaining] = useState<number | null>(null)
  const [speakingTimeRemaining, setSpeakingTimeRemaining] = useState<number | null>(null)
  const [isRecordingSpeaking, setIsRecordingSpeaking] = useState(false)
  const [spokenTranscript, setSpokenTranscript] = useState('')
  const [scratchNotes, setScratchNotes] = useState('')
  const [speakingFeedback, setSpeakingFeedback] = useState<IELTSSpeakingFeedback | null>(null)
  const [isEvaluatingSpeaking, setIsEvaluatingSpeaking] = useState(false)

  const activeListeningSection = IELTS_LISTENING_SECTIONS[listeningSectionIndex] || IELTS_LISTENING_SECTIONS[0]
  const relevantReadingPassages = IELTS_READING_PASSAGES.filter((p) => p.testType === testType)
  const activeReadingPassage = relevantReadingPassages[readingPassageIndex] || relevantReadingPassages[0] || IELTS_READING_PASSAGES[0]
  const activeWritingPrompt = IELTS_WRITING_PROMPTS[writingPromptIndex] || IELTS_WRITING_PROMPTS[0]
  const activeSpeakingPrompt = IELTS_SPEAKING_PROMPTS[speakingPartIndex] || IELTS_SPEAKING_PROMPTS[1]

  // Timer effects for speaking cue card
  useEffect(() => {
    let timer: any
    if (prepTimeRemaining !== null && prepTimeRemaining > 0) {
      timer = setInterval(() => setPrepTimeRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0)), 1000)
    } else if (prepTimeRemaining === 0) {
      setToastMessage('Preparation time finished! Please begin speaking for 2 minutes.')
      setPrepTimeRemaining(null)
      setSpeakingTimeRemaining(120)
    }
    return () => clearInterval(timer)
  }, [prepTimeRemaining])

  useEffect(() => {
    let timer: any
    if (speakingTimeRemaining !== null && speakingTimeRemaining > 0) {
      timer = setInterval(() => setSpeakingTimeRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0)), 1000)
    } else if (speakingTimeRemaining === 0) {
      setSpeakingTimeRemaining(null)
      setIsRecordingSpeaking(false)
      setToastMessage('2-minute speaking time completed!')
    }
    return () => clearInterval(timer)
  }, [speakingTimeRemaining])

  // Audio simulation for Listening section
  const handlePlayListeningAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel()
      setIsPlayingAudio(false)
    } else {
      setIsPlayingAudio(true)
      const accent = activeListeningSection.accent === 'Australian' ? 'en-AU' : 'en-GB'
      playTTS(activeListeningSection.audioScript, 0.9, 1.0, accent)
      setToastMessage(`Playing ${activeListeningSection.accent} accent audio...`)
    }
  }

  // Listening submission
  const handleCheckListening = () => {
    let score = 0
    activeListeningSection.questions.forEach((q) => {
      const userAns = (listeningAnswers[q.id] || '').trim().toLowerCase()
      const correct = q.correctAnswer.toLowerCase()
      const isAcceptable = q.acceptableAnswers?.some((a) => a.toLowerCase() === userAns)
      if (userAns === correct || isAcceptable) {
        score++
      }
    })
    setListeningSubmitted(true)
    const band = calculateListeningBand(score * 10) // scaled to 40
    setListeningBand(band)
    addXP(score * 20)
    setToastMessage(`Scored ${score}/${activeListeningSection.questions.length}! Estimated Band: ${band}`)
  }

  // Reading submission
  const handleCheckReading = () => {
    let score = 0
    activeReadingPassage.questions.forEach((q) => {
      const userAns = (readingAnswers[q.id] || '').trim().toLowerCase()
      const correct = q.correctAnswer.toLowerCase()
      const isAcceptable = q.acceptableAnswers?.some((a) => a.toLowerCase() === userAns)
      if (userAns === correct || isAcceptable) {
        score++
      }
    })
    setReadingSubmitted(true)
    const band = testType === 'Academic' ? calculateReadingBandAcademic(score * 10) : calculateReadingBandGeneral(score * 10)
    setReadingBand(band)
    addXP(score * 20)
    setToastMessage(`Scored ${score}/${activeReadingPassage.questions.length}! Estimated Band: ${band}`)
  }

  // Writing AI Evaluation
  const handleEvaluateWriting = async () => {
    if (!writingText.trim() || writingText.trim().split(/\s+/).length < 20) {
      setToastMessage('Please write at least 20 words before requesting feedback.')
      return
    }

    setIsEvaluatingWriting(true)
    try {
      const res = await fetch('/api/ielts-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'writing',
          taskType: activeWritingPrompt.taskType,
          userText: writingText,
          targetBand,
        }),
      })
      const data = await res.json()
      if (data.success && data.feedback) {
        setWritingFeedback(data.feedback)
        confetti({ particleCount: 50, spread: 60 })
        addXP(50)
        setToastMessage(`Writing evaluated! Estimated Band Range: ${data.feedback.estimatedBand}`)
      }
    } catch {
      setToastMessage('Unable to complete AI evaluation right now. Please try again.')
    } finally {
      setIsEvaluatingWriting(false)
    }
  }

  // Speaking Recording simulation
  const handleToggleSpeakingRecording = () => {
    if (isRecordingSpeaking) {
      setIsRecordingSpeaking(false)
      if (!spokenTranscript) {
        setSpokenTranscript(activeSpeakingPrompt.sampleAnswer.slice(0, 160) + '...')
      }
    } else {
      setIsRecordingSpeaking(true)
      setSpokenTranscript('')
      setSpeakingFeedback(null)

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const rec = new SpeechRec()
        rec.continuous = true
        rec.interimResults = true
        rec.lang = 'en-US'
        rec.onresult = (e: any) => {
          const text = Array.from(e.results)
            .map((r: any) => r[0].transcript)
            .join(' ')
          setSpokenTranscript(text)
        }
        rec.start()
      } else {
        // Fallback
        setSpokenTranscript('I would like to speak about my experience in learning public speaking...')
      }
    }
  }

  const handleEvaluateSpeaking = async () => {
    if (!spokenTranscript.trim()) {
      setToastMessage('Please record or type an answer to evaluate.')
      return
    }

    setIsEvaluatingSpeaking(true)
    try {
      const res = await fetch('/api/ielts-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'speaking',
          userText: spokenTranscript,
          targetBand,
        }),
      })
      const data = await res.json()
      if (data.success && data.feedback) {
        setSpeakingFeedback(data.feedback)
        confetti({ particleCount: 50, spread: 60 })
        addXP(50)
      }
    } catch {
      setToastMessage('Evaluation temporary fallback used.')
    } finally {
      setIsEvaluatingSpeaking(false)
    }
  }

  const writingWordCount = writingText.trim() ? writingText.trim().split(/\s+/).length : 0

  return (
    <AppShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #1e3a8a 100%)',
          borderRadius: '20px',
          padding: '28px 24px',
          color: 'white',
          marginBottom: '24px',
          boxShadow: '0 8px 30px rgba(30, 27, 75, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={24} style={{ color: '#67e8f9' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a5b4fc' }}>
                Official Preparation Hub
              </div>
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: '900', color: 'white', margin: 0 }}>
                IELTS Academic & General Masterclass
              </h1>
            </div>
          </div>

          {/* Test Type Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.12)', padding: '4px', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
            <button
              onClick={() => {
                setTestType('Academic')
                setReadingPassageIndex(0)
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: testType === 'Academic' ? 'white' : 'transparent',
                color: testType === 'Academic' ? '#1e1b4b' : 'white',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Academic (University / Licensing)
            </button>

            <button
              onClick={() => {
                setTestType('General')
                setReadingPassageIndex(0)
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: testType === 'General' ? 'white' : 'transparent',
                color: testType === 'General' ? '#1e1b4b' : 'white',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              General Training (Immigration / Work)
            </button>
          </div>
        </div>

        {/* Readiness and Band Targets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#c7d2fe', fontWeight: '700' }}>TARGET BAND SCORE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <select
                value={targetBand}
                onChange={(e) => setTargetBand(Number(e.target.value))}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '15px',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  outline: 'none',
                }}
              >
                {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                  <option key={b} value={b} style={{ color: 'black' }}>
                    Band {b.toFixed(1)}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '12px', color: '#93c5fd' }}>C1 Proficient</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#c7d2fe', fontWeight: '700' }}>ESTIMATED READINESS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '68%', background: '#38bdf8' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '800' }}>68% Ready</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#c7d2fe', fontWeight: '700' }}>STUDY DURATION</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setStudyDuration(d as any)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: studyDuration === d ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)',
                    color: studyDuration === d ? '#0f172a' : 'white',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#c7d2fe', fontWeight: '700' }}>PRIMARY WEAK AREAS</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fde047', marginTop: '4px' }}>
              Writing Task 2 • Listening Sec 4
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {[
          { id: 'overview', label: 'Dashboard & Roadmap', icon: TrendingUp },
          { id: 'listening', label: 'Listening Practice', icon: Headphones },
          { id: 'reading', label: 'Reading Studio', icon: BookOpen },
          { id: 'writing', label: 'Writing Workspace & AI Feedback', icon: PenTool },
          { id: 'speaking', label: 'Speaking Lab & Cue Cards', icon: Mic },
          { id: 'mock', label: 'Full Timed Mock Test', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'var(--surface-subtle)',
                color: isActive ? 'white' : 'var(--foreground-muted)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW & ROADMAP ================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 4 Skill Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div
              onClick={() => setActiveTab('listening')}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                padding: '22px',
                cursor: 'pointer',
                boxShadow: 'var(--card-shadow)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headphones size={20} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>Band 7.0 Est.</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
                Listening Module
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '14px' }}>
                4 sections, authentic British & Australian audio, form/note completions & multiple-choice sets.
              </p>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Start Practice</span>
                <ChevronRight size={14} />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('reading')}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                padding: '22px',
                cursor: 'pointer',
                boxShadow: 'var(--card-shadow)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>Band 7.5 Est.</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
                Reading Studio
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '14px' }}>
                {testType === 'Academic' ? 'Academic scientific passages' : 'Workplace manuals & public notices'}, True/False/Not Given & headings matching.
              </p>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Start Practice</span>
                <ChevronRight size={14} />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('writing')}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                padding: '22px',
                cursor: 'pointer',
                boxShadow: 'var(--card-shadow)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PenTool size={20} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#f59e0b' }}>Band 6.5 Est.</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
                Writing Workspace
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '14px' }}>
                Task 1 reports/letters & Task 2 essays with instant 4-criteria official band analysis.
              </p>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Start Practice</span>
                <ChevronRight size={14} />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('speaking')}
              style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                padding: '22px',
                cursor: 'pointer',
                boxShadow: 'var(--card-shadow)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mic size={20} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>Band 7.0 Est.</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
                Speaking Lab
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '14px' }}>
                Part 1 interviews, Part 2 cue cards with 1-min timer, and Part 3 abstract reasoning questions.
              </p>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Start Practice</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>

          {/* Active Study Path Schedule */}
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
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                  {IELTS_STUDY_PLANS[studyDuration].duration}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginTop: '2px' }}>
                  {IELTS_STUDY_PLANS[studyDuration].focus} • Target: {IELTS_STUDY_PLANS[studyDuration].dailyTarget}
                </p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '4px 10px', borderRadius: '6px' }}>
                Customizable Plan
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {IELTS_STUDY_PLANS[studyDuration].schedule.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--surface-subtle)',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '4px' }}>
                    STEP {idx + 1}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>
                    {item.title}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--foreground-muted)' }}>
                    {item.tasks.map((task, tIdx) => (
                      <li key={tIdx} style={{ marginBottom: '2px' }}>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: LISTENING PRACTICE ================= */}
      {activeTab === 'listening' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Audio Player Card */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              padding: '24px',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '4px' }}>
                  {activeListeningSection.accent} Accent • Section {activeListeningSection.sectionNumber}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginTop: '4px' }}>
                  {activeListeningSection.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: 0 }}>
                  {activeListeningSection.description}
                </p>
              </div>

              {/* Audio Controls */}
              <button
                onClick={handlePlayListeningAudio}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isPlayingAudio ? '#ef4444' : 'var(--color-primary)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Play Test Audio'}</span>
              </button>
            </div>

            {/* Questions Form */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '14px' }}>
                Questions 1–{activeListeningSection.questions.length}: Fill the gaps or select the correct answer
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeListeningSection.questions.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: 'var(--surface-subtle)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                      {q.prompt}
                    </div>

                    {q.options ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={listeningAnswers[q.id] === opt}
                              onChange={(e) => setListeningAnswers({ ...listeningAnswers, [q.id]: e.target.value })}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Write your answer..."
                        value={listeningAnswers[q.id] || ''}
                        onChange={(e) => setListeningAnswers({ ...listeningAnswers, [q.id]: e.target.value })}
                        style={{
                          width: '100%',
                          maxWidth: '320px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          background: 'var(--surface)',
                          color: 'var(--foreground)',
                          fontSize: '14px',
                        }}
                      />
                    )}

                    {listeningSubmitted && (
                      <div style={{ marginTop: '10px', fontSize: '13px', color: (listeningAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase() ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                        Correct Answer: {q.correctAnswer} — {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit & Transcript button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => setShowListeningScript(!showListeningScript)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--foreground-muted)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {showListeningScript ? 'Hide Full Script' : 'View Audio Transcript'}
                </button>

                <button
                  onClick={handleCheckListening}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <CheckCircle size={16} />
                  <span>Submit Listening Answers</span>
                </button>
              </div>

              {/* Transcript Drawer */}
              {showListeningScript && (
                <div style={{ marginTop: '16px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  <div style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--color-primary)' }}>Audio Transcript:</div>
                  {activeListeningSection.audioScript}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: READING STUDIO ================= */}
      {activeTab === 'reading' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '20px', alignItems: 'start' }}>
          {/* Left Column: Full Passage */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              padding: '24px',
              boxShadow: 'var(--card-shadow)',
              maxHeight: '750px',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '4px' }}>
                {testType} Reading • Passage {activeReadingPassage.passageNumber}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
                {activeReadingPassage.estimatedMinutes} Mins Suggested
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
              {activeReadingPassage.title}
            </h3>
            <div style={{ fontSize: '13px', color: '#0284c7', fontWeight: '600', marginBottom: '16px' }}>
              {activeReadingPassage.urduTitle}
            </div>

            <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>
              {activeReadingPassage.passageText}
            </div>
          </div>

          {/* Right Column: Questions & Evidence */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              padding: '24px',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>
              Reading Questions & Statements
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeReadingPassage.questions.map((q) => (
                <div key={q.id} style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                    {q.questionNumber}. {q.prompt}
                  </div>

                  {q.type === 'true-false-not-given' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setReadingAnswers({ ...readingAnswers, [q.id]: opt })}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${readingAnswers[q.id] === opt ? 'var(--color-primary)' : 'var(--border)'}`,
                            background: readingAnswers[q.id] === opt ? 'var(--primary-100)' : 'var(--surface)',
                            color: readingAnswers[q.id] === opt ? 'var(--color-primary)' : 'var(--foreground)',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : q.options ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={readingAnswers[q.id] === opt}
                            onChange={(e) => setReadingAnswers({ ...readingAnswers, [q.id]: e.target.value })}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Your answer..."
                      value={readingAnswers[q.id] || ''}
                      onChange={(e) => setReadingAnswers({ ...readingAnswers, [q.id]: e.target.value })}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        color: 'var(--foreground)',
                        fontSize: '14px',
                        width: '100%',
                      }}
                    />
                  )}

                  {readingSubmitted && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: (readingAnswers[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase() ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                      Answer: {q.correctAnswer} — {q.explanation}
                      {q.evidenceSnippet && (
                        <div style={{ fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '2px', fontStyle: 'italic' }}>
                          Passage Evidence: "{q.evidenceSnippet}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCheckReading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                <CheckCircle size={16} />
                <span>Submit Reading Test</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: WRITING WORKSPACE ================= */}
      {activeTab === 'writing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Prompt Selector */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {IELTS_WRITING_PROMPTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setWritingPromptIndex(idx)
                  setWritingFeedback(null)
                  setShowModelAnswer(false)
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${writingPromptIndex === idx ? 'var(--color-primary)' : 'var(--border)'}`,
                  background: writingPromptIndex === idx ? 'var(--primary-100)' : 'var(--surface-subtle)',
                  color: writingPromptIndex === idx ? 'var(--color-primary)' : 'var(--foreground)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {p.taskType} {p.chartType || p.letterType || p.essayType}
              </button>
            ))}
          </div>

          {/* Prompt Instructions */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              padding: '24px',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '4px' }}>
                {activeWritingPrompt.taskType}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground-muted)' }}>
                Target: At least {activeWritingPrompt.minWords} words • {activeWritingPrompt.suggestedMinutes} mins
              </span>
            </div>

            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '14px' }}>
              {activeWritingPrompt.prompt}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--foreground-subtle)' }}>Recommended Linkers:</span>
              {activeWritingPrompt.keyVocabTips.map((tip, idx) => (
                <span key={idx} style={{ fontSize: '11px', fontWeight: '600', background: 'var(--surface-subtle)', padding: '2px 8px', borderRadius: '4px', color: 'var(--foreground)' }}>
                  {tip}
                </span>
              ))}
            </div>
          </div>

          {/* Writing Area */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              padding: '24px',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: writingWordCount >= activeWritingPrompt.minWords ? '#10b981' : '#f59e0b' }}>
                Word Count: {writingWordCount} / {activeWritingPrompt.minWords} words required
              </div>

              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {showModelAnswer ? 'Hide Band 8 Sample' : 'View Band 8+ Sample Answer'}
              </button>
            </div>

            {showModelAnswer && (
              <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '16px', fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                <div style={{ fontWeight: '800', color: '#10b981', marginBottom: '6px' }}>Band 8.5 Model Response:</div>
                {activeWritingPrompt.sampleAnswerBand8}
              </div>
            )}

            <textarea
              rows={12}
              placeholder="Type your IELTS response here... (Aim for structured paragraphs, academic cohesion, and varied vocabulary)"
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--foreground)',
                fontSize: '14px',
                lineHeight: 1.7,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
                Evaluated against the 4 Official IELTS Assessment Criteria
              </span>

              <button
                disabled={isEvaluatingWriting}
                onClick={handleEvaluateWriting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: isEvaluatingWriting ? 'wait' : 'pointer',
                  opacity: isEvaluatingWriting ? 0.7 : 1,
                }}
              >
                <Sparkles size={16} />
                <span>{isEvaluatingWriting ? 'Analyzing with AI...' : 'Submit for 4-Criteria AI Feedback'}</span>
              </button>
            </div>

            {/* AI Feedback Report */}
            {writingFeedback && (
              <div
                style={{
                  marginTop: '24px',
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border-strong)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                      IELTS Writing Diagnostic Report
                    </span>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                      Estimated Overall Band: {writingFeedback.estimatedBand}
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', fontWeight: '700' }}>
                    Educational Estimate
                  </span>
                </div>

                {/* 4 Criteria Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'var(--surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>
                      <span>1. Task Achievement / Response</span>
                      <span style={{ color: 'var(--color-primary)' }}>Band {writingFeedback.criteriaScores.taskAchievementOrResponse.band}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                      {writingFeedback.criteriaScores.taskAchievementOrResponse.feedback}
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>
                      <span>2. Coherence and Cohesion</span>
                      <span style={{ color: 'var(--color-primary)' }}>Band {writingFeedback.criteriaScores.coherenceAndCohesion.band}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                      {writingFeedback.criteriaScores.coherenceAndCohesion.feedback}
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>
                      <span>3. Lexical Resource</span>
                      <span style={{ color: 'var(--color-primary)' }}>Band {writingFeedback.criteriaScores.lexicalResource.band}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                      {writingFeedback.criteriaScores.lexicalResource.feedback}
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>
                      <span>4. Grammatical Range & Accuracy</span>
                      <span style={{ color: 'var(--color-primary)' }}>Band {writingFeedback.criteriaScores.grammaticalRangeAndAccuracy.band}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                      {writingFeedback.criteriaScores.grammaticalRangeAndAccuracy.feedback}
                    </div>
                  </div>
                </div>

                {/* Key Strengths & Improvements */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#10b981', marginBottom: '6px' }}>Key Strengths Observed:</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--foreground)' }}>
                      {writingFeedback.keyStrengths.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#d97706', marginBottom: '6px' }}>Actionable Areas for Improvement:</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--foreground)' }}>
                      {writingFeedback.actionableImprovements.map((imp, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  {writingFeedback.disclaimer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 5: SPEAKING LAB ================= */}
      {activeTab === 'speaking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Part Selector */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {IELTS_SPEAKING_PROMPTS.map((sp, idx) => (
              <button
                key={sp.id}
                onClick={() => {
                  setSpeakingPartIndex(idx)
                  setPrepTimeRemaining(null)
                  setSpeakingTimeRemaining(null)
                  setSpeakingFeedback(null)
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${speakingPartIndex === idx ? 'var(--color-primary)' : 'var(--border)'}`,
                  background: speakingPartIndex === idx ? 'var(--primary-100)' : 'var(--surface-subtle)',
                  color: speakingPartIndex === idx ? 'var(--color-primary)' : 'var(--foreground)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Part {sp.part}: {sp.part === 1 ? 'Personal Interview' : sp.part === 2 ? 'Cue Card (Long Turn)' : 'Abstract Discussion'}
              </button>
            ))}
          </div>

          {/* Active Speaking Card */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              padding: '24px',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '3px 8px', borderRadius: '4px' }}>
                Part {activeSpeakingPrompt.part} • Topic: {activeSpeakingPrompt.topic}
              </span>
            </div>

            {/* Cue Card Specific Layout */}
            {activeSpeakingPrompt.cueCard ? (
              <div
                style={{
                  background: 'var(--surface-subtle)',
                  padding: '20px',
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '6px' }}>
                  Candidate Task Card:
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                  {activeSpeakingPrompt.cueCard.topic}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: '8px' }}>
                  You should say:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--foreground)', lineHeight: 1.6 }}>
                  {activeSpeakingPrompt.cueCard.bulletPoints.map((bp, idx) => (
                    <li key={idx}>{bp}</li>
                  ))}
                </ul>

                {/* Timers Bar */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setPrepTimeRemaining(60)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--foreground)',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Start 1-Min Preparation {prepTimeRemaining !== null ? `(${prepTimeRemaining}s)` : ''}
                  </button>

                  <button
                    onClick={() => setSpeakingTimeRemaining(120)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--foreground)',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Start 2-Min Speaking Timer {speakingTimeRemaining !== null ? `(${speakingTimeRemaining}s)` : ''}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '10px' }}>
                  Examiner Questions:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', color: 'var(--foreground)', lineHeight: 1.8 }}>
                  {activeSpeakingPrompt.questions?.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recording Controls */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <button
                  onClick={handleToggleSpeakingRecording}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isRecordingSpeaking ? '#ef4444' : 'var(--color-primary)',
                    color: 'white',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <Mic size={18} />
                  <span>{isRecordingSpeaking ? 'Stop Recording' : 'Record My Spoken Answer'}</span>
                </button>

                <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
                  {isRecordingSpeaking ? 'Listening... Speak into microphone' : 'Or type your transcript below'}
                </span>
              </div>

              <textarea
                rows={4}
                placeholder="Spoken answer transcript will appear here, or you can type your practiced response..."
                value={spokenTranscript}
                onChange={(e) => setSpokenTranscript(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  outline: 'none',
                  marginBottom: '14px',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  disabled={isEvaluatingSpeaking}
                  onClick={handleEvaluateSpeaking}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={16} />
                  <span>{isEvaluatingSpeaking ? 'Evaluating...' : 'Get Speaking Band Evaluation'}</span>
                </button>
              </div>

              {/* Speaking Feedback Card */}
              {speakingFeedback && (
                <div style={{ marginTop: '20px', padding: '18px', background: 'var(--surface-subtle)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>
                      Estimated Speaking Band: {speakingFeedback.estimatedBand}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>
                      Fluency • Vocabulary • Grammar
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
                    <strong>Fluency:</strong> {speakingFeedback.criteriaScores.fluencyAndCoherence.feedback}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)', fontStyle: 'italic' }}>
                    {speakingFeedback.criteriaScores.pronunciationNotice}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: FULL TIMED MOCK TEST ================= */}
      {activeTab === 'mock' && (
        <div
          style={{
            background: 'var(--card-bg)',
            borderRadius: '18px',
            border: '1px solid var(--card-border)',
            padding: '32px 24px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '4px 10px', borderRadius: '6px' }}>
              Full IELTS {testType} Simulation
            </span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground-muted)' }}>
              Standard Total Timing: 2h 45m
            </span>
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
            Complete 4-Skill Mock Examination
          </h3>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', maxWidth: '750px', marginBottom: '24px' }}>
            Take an authentic simulation following official timing conventions: 30 minutes for Listening, 60 minutes for Reading, 60 minutes for Writing, and 15 minutes for Speaking. Auto-saves your answers throughout.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--foreground)' }}>1. Listening (30 mins)</div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '4px' }}>40 Questions across 4 audio sections</div>
            </div>

            <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--foreground)' }}>2. Reading (60 mins)</div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '4px' }}>3 Passages with 40 comprehension items</div>
            </div>

            <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--foreground)' }}>3. Writing (60 mins)</div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '4px' }}>Task 1 (150w) & Task 2 (250w) essays</div>
            </div>

            <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--foreground)' }}>4. Speaking (15 mins)</div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '4px' }}>3 Parts including 2-min cue card</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setActiveTab('listening')
                setToastMessage('Beginning Section 1 of Listening...')
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--color-primary)',
                color: 'white',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <Play size={18} />
              <span>Start Timed Mock Test Now</span>
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
