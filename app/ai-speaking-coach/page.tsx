'use client'

import { useState, useEffect, useRef } from 'react'
import AppShell from '@/components/navigation/AppShell'
import {
  SpeakingCoachTopic,
  CEFRLevel,
  SpeakingCoachSessionState,
  SpeakingCoachMessage,
  SpeakingCorrection,
} from '@/lib/types'
import {
  SPEAKING_TOPICS,
  LEVEL_DESCRIPTIONS,
} from '@/lib/data/speakingCoach'
import { SpeakingCoachClient } from '@/lib/speakingCoachClient'
import { getUserProgress, addXP } from '@/lib/storage'
import confetti from 'canvas-confetti'
import Link from 'next/link'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Square,
  ArrowRight,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Award,
  GraduationCap,
  Heart,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Flame,
  Check,
  Info,
} from 'lucide-react'

export default function AISpeakingCoachPage() {
  const [topic, setTopic] = useState<SpeakingCoachTopic>('daily')
  const [level, setLevel] = useState<CEFRLevel>('B1')
  const [urduSupport, setUrduSupport] = useState<boolean>(true)
  const [mode, setMode] = useState<'push-to-talk' | 'live-voice' | 'text'>('push-to-talk')
  const [sessionState, setSessionState] = useState<SpeakingCoachSessionState>('idle')
  const [messages, setMessages] = useState<SpeakingCoachMessage[]>([])
  const [interimTranscript, setInterimTranscript] = useState<string>('')
  const [textInput, setTextInput] = useState<string>('')
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [speechRate, setSpeechRate] = useState<number>(0.95)
  const [sessionActive, setSessionActive] = useState<boolean>(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [sessionDurationSeconds, setSessionDurationSeconds] = useState<number>(0)
  const [quota, setQuota] = useState<{
    turnsUsed: number
    maxTurns: number
    turnsRemaining: number
    isGuest: boolean
  }>({
    turnsUsed: 0,
    maxTurns: 5,
    turnsRemaining: 5,
    isGuest: true,
  })
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [alertError, setAlertError] = useState<{ title: string; message: string } | null>(null)
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false)
  const [summaryData, setSummaryData] = useState<{
    duration: number
    turns: number
    corrections: SpeakingCorrection[]
    topic: SpeakingCoachTopic
    level: CEFRLevel
  } | null>(null)

  const clientRef = useRef<SpeakingCoachClient | null>(null)
  const chatBottomRef = useRef<HTMLDivElement | null>(null)
  const durationTimerRef = useRef<any>(null)

  // Initialize client on mount
  useEffect(() => {
    const userProgress = getUserProgress()
    if (userProgress.level) {
      setLevel(userProgress.level)
    }

    const client = new SpeakingCoachClient({
      topic,
      level,
      urduSupport,
      mode,
      onStateChange: (state) => {
        setSessionState(state)
      },
      onTranscriptUpdate: (text) => {
        setInterimTranscript(text)
      },
      onMessageReceived: (message) => {
        setMessages((prev) => [...prev, message])
        setInterimTranscript('')
      },
      onQuotaUpdate: (q) => {
        setQuota(q)
      },
      onError: (err) => {
        setAlertError({ title: err.title, message: err.message })
      },
    })

    clientRef.current = client

    return () => {
      client.cleanup()
      clearInterval(durationTimerRef.current)
    }
  }, [])

  // Update client options when topic/level/urduSupport change
  useEffect(() => {
    if (clientRef.current) {
      clientRef.current.updateConfig(topic, level, urduSupport)
    }
  }, [topic, level, urduSupport])

  // Update client mode
  useEffect(() => {
    if (clientRef.current) {
      clientRef.current.setMode(mode)
    }
  }, [mode])

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, interimTranscript])

  // Track session timer
  useEffect(() => {
    if (sessionActive) {
      durationTimerRef.current = setInterval(() => {
        setSessionDurationSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(durationTimerRef.current)
    }
    return () => clearInterval(durationTimerRef.current)
  }, [sessionActive])

  // Start new practice session
  const handleStartSession = async () => {
    if (!clientRef.current) return
    setAlertError(null)
    const success = await clientRef.current.startSession()
    if (success) {
      setSessionActive(true)
      setSessionStartTime(Date.now())
      setSessionDurationSeconds(0)
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: `Hello! I am your AI Speaking Coach for today's ${
            SPEAKING_TOPICS.find((t) => t.id === topic)?.title || 'English'
          } session. Whenever you are ready, press the microphone button or hold down spacebar to speak.`,
          urduExplanation: urduSupport
            ? 'السلام علیکم! میں آپ کا انگریزی بول چال کا استاد ہوں۔ مائیکروفون دبائیں اور قدرتی انداز میں بات کریں۔'
            : undefined,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }
  }

  // End session and show summary
  const handleEndSession = async () => {
    if (!clientRef.current) return
    const { turnCount } = clientRef.current.endSession()
    setSessionActive(false)

    // Gather all corrections
    const allCorrections: SpeakingCorrection[] = []
    messages.forEach((m) => {
      if (m.corrections && m.corrections.length > 0) {
        allCorrections.push(...m.corrections)
      }
    })

    const summary = {
      duration: sessionDurationSeconds,
      turns: turnCount || messages.filter((m) => m.role === 'user').length,
      corrections: allCorrections,
      topic,
      level,
    }

    setSummaryData(summary)
    setShowSummaryModal(true)

    // Award XP
    const earnedXP = Math.max(20, summary.turns * 15)
    addXP(earnedXP)
    confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } })

    // Save to API
    try {
      await fetch('/api/speaking-coach/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `spk_${Date.now()}`,
          userId: 'user_active',
          topic,
          level,
          durationSeconds: sessionDurationSeconds,
          turnCount: summary.turns,
          corrections: allCorrections,
          summary: `Completed ${summary.turns} spoken turns on ${topic} (${level}).`,
        }),
      })
    } catch {
      // offline handling
    }
  }

  // Push-to-Talk event handlers
  const handleMouseDown = () => {
    if (!sessionActive || mode !== 'push-to-talk') return
    clientRef.current?.onPushToTalkStart()
  }

  const handleMouseUp = () => {
    if (!sessionActive || mode !== 'push-to-talk') return
    clientRef.current?.onPushToTalkEnd()
  }

  // Live voice toggle
  const handleLiveToggle = () => {
    if (!sessionActive) return
    if (sessionState === 'listening') {
      clientRef.current?.stopListening()
    } else {
      clientRef.current?.startListening()
    }
  }

  // Interrupt AI speech
  const handleInterrupt = () => {
    clientRef.current?.interruptResponse()
  }

  // Text submit fallback
  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!textInput.trim() || !sessionActive) return
    clientRef.current?.sendTurnText(textInput.trim())
    setTextInput('')
  }

  // Starter chip click
  const handleSelectStarter = (starterText: string) => {
    if (!sessionActive) {
      handleStartSession().then(() => {
        setTimeout(() => {
          clientRef.current?.sendTurnText(starterText)
        }, 500)
      })
    } else {
      clientRef.current?.sendTurnText(starterText)
    }
  }

  // Replay message aloud
  const handleReplayMessage = (text: string) => {
    clientRef.current?.speakText(text)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const currentTopicConfig = SPEAKING_TOPICS.find((t) => t.id === topic) || SPEAKING_TOPICS[0]

  return (
    <AppShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Feature Branding */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'var(--primary-100)',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: '800',
              }}
            >
              <Mic size={14} />
              Real-Time AI Speaking Coach
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--foreground-muted)',
                background: 'var(--surface-subtle)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: '600',
              }}
            >
              بول چال کا اے آئی استاد
            </span>
          </div>

          {/* Quota & Session Timer Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {sessionActive && (
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--surface-subtle)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#16a34a',
                    display: 'inline-block',
                  }}
                />
                Session Time: {formatTime(sessionDurationSeconds)}
              </span>
            )}

            <div
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: quota.turnsRemaining <= 1 ? '#fee2e2' : 'var(--surface-subtle)',
                color: quota.turnsRemaining <= 1 ? '#dc2626' : 'var(--foreground-muted)',
                fontWeight: '700',
              }}
            >
              {quota.isGuest ? 'Guest Trial Turns: ' : 'Session Turns: '}
              <span style={{ color: 'var(--color-primary)', fontWeight: '800' }}>
                {quota.turnsRemaining}
              </span>{' '}
              / {quota.maxTurns}
            </div>
          </div>
        </div>

        <h1
          style={{
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            fontWeight: '800',
            color: 'var(--foreground)',
            marginBottom: '6px',
          }}
        >
          Speak with AI English Coach
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', maxWidth: '750px', lineHeight: 1.5 }}>
          Converse naturally with your patient AI English teacher. Speak through live voice or push-to-talk, receive instant spoken responses, and get gentle corrections with bilingual Urdu insights.
        </p>
      </div>

      {/* Control Bar: Topic, Level, Urdu, Mute */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: 'var(--card-shadow)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          {/* Topic Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--foreground-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Conversation Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as SpeakingCoachTopic)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--foreground)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {SPEAKING_TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} • {t.urduTitle}
                </option>
              ))}
            </select>
          </div>

          {/* CEFR Level Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--foreground-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Learner Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as CEFRLevel)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--foreground)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {(Object.keys(LEVEL_DESCRIPTIONS) as CEFRLevel[]).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {LEVEL_DESCRIPTIONS[lvl].label} ({LEVEL_DESCRIPTIONS[lvl].urdu})
                </option>
              ))}
            </select>
          </div>

          {/* Urdu Toggle */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--foreground-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Urdu Hints
            </label>
            <button
              type="button"
              onClick={() => setUrduSupport(!urduSupport)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: urduSupport ? 'var(--primary-50)' : 'var(--surface)',
                color: urduSupport ? 'var(--color-primary)' : 'var(--foreground-muted)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>اردو وضاحت: {urduSupport ? 'آن' : 'آف'}</span>
            </button>
          </div>
        </div>

        {/* Audio Output Settings & Session Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              const newMuted = !isMuted
              setIsMuted(newMuted)
              clientRef.current?.setMuted(newMuted)
            }}
            title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: isMuted ? '#fee2e2' : 'var(--surface)',
              color: isMuted ? '#dc2626' : 'var(--foreground)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          {!sessionActive ? (
            <button
              type="button"
              onClick={handleStartSession}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                background: 'var(--color-primary)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              <Mic size={16} />
              <span>Start Speaking Session</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEndSession}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                background: 'var(--surface-subtle)',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Square size={14} />
              <span>Finish & Review Summary</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert Error Banner */}
      {alertError && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: '#fee2e2',
            border: '1px solid #f87171',
            color: '#991b1b',
            fontSize: '13px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <div>
              <strong>{alertError.title}: </strong>
              <span>{alertError.message}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAlertError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: '800',
              cursor: 'pointer',
              color: '#991b1b',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Conversation Window */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)',
          display: 'flex',
          flexDirection: 'column',
          height: 'min(620px, calc(100vh - 380px))',
          minHeight: '440px',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        {/* Chat message stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                margin: 'auto',
                textAlign: 'center',
                maxWidth: '480px',
                padding: '20px',
                color: 'var(--foreground-muted)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--primary-50)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Mic size={32} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                Ready to practice your spoken English?
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                Choose a conversation topic above and press <strong>Start Speaking Session</strong>. You can practice job interviews, workplace presentations, IELTS Speaking, or free conversation.
              </p>

              {/* Suggested Starters */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '8px' }}>
                  Quick Conversation Starters:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentTopicConfig.suggestedStarters.map((starter, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSelectStarter(starter)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface-subtle)',
                        color: 'var(--foreground)',
                        fontSize: '13px',
                        fontWeight: '600',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>"{starter}"</span>
                      <ArrowRight size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === 'user'

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Message Bubble */}
                <div
                  style={{
                    maxWidth: '85%',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '14px 18px',
                    background: isUser ? 'var(--color-primary)' : 'var(--surface)',
                    color: isUser ? 'white' : 'var(--foreground)',
                    border: isUser ? 'none' : '1px solid var(--border)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    fontSize: '15px',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', opacity: 0.8 }}>
                      {isUser ? 'You (Learner)' : 'AI Speaking Coach'}
                    </span>
                    <span style={{ fontSize: '10px', opacity: 0.7 }}>{msg.timestamp}</span>
                  </div>

                  <div>{msg.text}</div>

                  {/* Single Follow-up question highlight */}
                  {msg.followUpQuestion && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'rgba(79, 70, 229, 0.08)',
                        borderLeft: '3px solid var(--color-primary)',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <span>💬 {msg.followUpQuestion}</span>
                    </div>
                  )}

                  {/* Urdu Explanation if present */}
                  {msg.urduExplanation && (
                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '13px',
                        color: '#0284c7',
                        fontWeight: '600',
                        lineHeight: 1.5,
                      }}
                    >
                      {msg.urduExplanation}
                    </div>
                  )}

                  {/* Audio Replay Control for AI message */}
                  {!isUser && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleReplayMessage(msg.text)}
                        title="Replay Spoken Voice"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 6px',
                        }}
                      >
                        <Volume2 size={13} />
                        <span>Listen Aloud</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Educational Corrections Panel if present */}
                {msg.corrections && msg.corrections.length > 0 && (
                  <div
                    style={{
                      maxWidth: '85%',
                      marginTop: '8px',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      background: '#fffaf5',
                      border: '1px solid #fed7aa',
                      fontSize: '13px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontWeight: '800', marginBottom: '6px' }}>
                      <Sparkles size={14} />
                      <span>Coach's Language Polish & Corrections:</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.corrections.map((corr, cIdx) => (
                        <div key={cIdx} style={{ lineHeight: 1.4 }}>
                          <div style={{ color: '#dc2626', fontWeight: '600' }}>
                            <span style={{ opacity: 0.8 }}>Instead of: </span>
                            <span style={{ textDecoration: 'line-through' }}>"{corr.original}"</span>
                          </div>
                          <div style={{ color: '#16a34a', fontWeight: '700' }}>
                            <span>✓ Better way: </span>
                            <span>"{corr.improved}"</span>
                          </div>
                          <div style={{ color: '#78350f', fontSize: '12px', marginTop: '2px' }}>
                            {corr.explanation}
                          </div>
                          {corr.explanationUrdu && (
                            <div style={{ color: '#9a3412', fontSize: '12px', fontWeight: '500' }}>
                              {corr.explanationUrdu}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Real-time Interim Transcription Banner */}
          {interimTranscript && (
            <div
              style={{
                alignSelf: 'flex-end',
                maxWidth: '85%',
                borderRadius: '16px',
                padding: '10px 16px',
                background: 'rgba(79, 70, 229, 0.1)',
                border: '1px dashed var(--color-primary)',
                color: 'var(--color-primary)',
                fontSize: '14px',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  animation: 'pulse 1.2s infinite',
                }}
              />
              <span>Listening: "{interimTranscript}"</span>
            </div>
          )}

          {/* Processing Indicator */}
          {sessionState === 'processing' && (
            <div
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '14px',
                background: 'var(--surface-subtle)',
                color: 'var(--foreground-muted)',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              <RotateCcw size={16} className="animate-spin" />
              <span>Coach is listening & analyzing your response...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* State Status Banner above interaction dock */}
        <div
          style={{
            background: 'var(--surface-subtle)',
            borderTop: '1px solid var(--border)',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {sessionState === 'listening' && (
              <span style={{ color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                Listening now... Speak freely
              </span>
            )}
            {sessionState === 'speaking' && (
              <span style={{ color: 'var(--color-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Volume2 size={14} />
                Coach is speaking aloud...
              </span>
            )}
            {sessionState === 'interrupted' && (
              <span style={{ color: '#ea580c', fontWeight: '700' }}>
                Interrupted — Coach paused
              </span>
            )}
            {sessionState === 'idle' && sessionActive && (
              <span style={{ color: 'var(--foreground-muted)' }}>
                Ready for your turn. Press the mic or type below.
              </span>
            )}
            {!sessionActive && (
              <span style={{ color: 'var(--foreground-muted)' }}>
                Session inactive. Press "Start Speaking Session" to begin.
              </span>
            )}
          </div>

          {sessionState === 'speaking' && (
            <button
              type="button"
              onClick={handleInterrupt}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#dc2626',
                cursor: 'pointer',
              }}
            >
              Interrupt Coach
            </button>
          )}
        </div>
      </div>

      {/* Audio & Interaction Dock */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          padding: '20px',
          boxShadow: 'var(--card-shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Interaction Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setMode('push-to-talk')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: `1px solid ${mode === 'push-to-talk' ? 'var(--color-primary)' : 'var(--border)'}`,
              background: mode === 'push-to-talk' ? 'var(--primary-50)' : 'transparent',
              color: mode === 'push-to-talk' ? 'var(--color-primary)' : 'var(--foreground-muted)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Mic size={14} />
            <span>Push-To-Talk</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('live-voice')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: `1px solid ${mode === 'live-voice' ? 'var(--color-primary)' : 'var(--border)'}`,
              background: mode === 'live-voice' ? 'var(--primary-50)' : 'transparent',
              color: mode === 'live-voice' ? 'var(--color-primary)' : 'var(--foreground-muted)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Volume2 size={14} />
            <span>Live Voice (Hands-Free)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('text')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: `1px solid ${mode === 'text' ? 'var(--color-primary)' : 'var(--border)'}`,
              background: mode === 'text' ? 'var(--primary-50)' : 'transparent',
              color: mode === 'text' ? 'var(--color-primary)' : 'var(--foreground-muted)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Send size={14} />
            <span>Text Fallback</span>
          </button>
        </div>

        {/* Central Audio Controls */}
        {mode !== 'text' ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            {mode === 'push-to-talk' ? (
              <button
                type="button"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                disabled={!sessionActive}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background:
                    sessionState === 'listening'
                      ? '#16a34a'
                      : sessionActive
                      ? 'var(--color-primary)'
                      : 'var(--surface-subtle)',
                  color: sessionActive ? 'white' : 'var(--foreground-subtle)',
                  border: 'none',
                  cursor: sessionActive ? 'pointer' : 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    sessionState === 'listening'
                      ? '0 0 0 10px rgba(22, 163, 74, 0.25)'
                      : sessionActive
                      ? '0 6px 20px rgba(79, 70, 229, 0.35)'
                      : 'none',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  touchAction: 'manipulation',
                }}
              >
                <Mic size={40} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLiveToggle}
                disabled={!sessionActive}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background:
                    sessionState === 'listening'
                      ? '#16a34a'
                      : sessionActive
                      ? 'var(--color-primary)'
                      : 'var(--surface-subtle)',
                  color: sessionActive ? 'white' : 'var(--foreground-subtle)',
                  border: 'none',
                  cursor: sessionActive ? 'pointer' : 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    sessionState === 'listening'
                      ? '0 0 0 10px rgba(22, 163, 74, 0.25)'
                      : 'none',
                  transition: 'all 0.15s ease',
                  touchAction: 'manipulation',
                }}
              >
                {sessionState === 'listening' ? <Mic size={40} /> : <MicOff size={40} />}
              </button>
            )}

            <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
              {mode === 'push-to-talk'
                ? sessionState === 'listening'
                  ? 'Release to send speech turn'
                  : 'Hold button or spacebar to speak'
                : sessionState === 'listening'
                ? 'Listening... Click to pause'
                : 'Click to start continuous listening'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '2px' }}>
              Microphone audio is processed safely in real time without raw permanent storage.
            </div>
          </div>
        ) : (
          /* Text input fallback form */
          <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your response to the AI Coach here..."
              disabled={!sessionActive}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--foreground)',
                fontSize: '15px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!sessionActive || !textInput.trim()}
              style={{
                padding: '0 24px',
                borderRadius: '12px',
                background: textInput.trim() ? 'var(--color-primary)' : 'var(--surface-subtle)',
                color: textInput.trim() ? 'white' : 'var(--foreground-subtle)',
                fontWeight: '700',
                border: 'none',
                cursor: textInput.trim() ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        )}
      </div>

      {/* End-of-Session Summary Modal */}
      {showSummaryModal && summaryData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '24px',
              border: '1px solid var(--card-border)',
              padding: '36px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--card-shadow-lg)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <Award size={36} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>
                Speaking Session Completed!
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>
                Great work on actively speaking English today! Here is your session summary.
              </p>
            </div>

            {/* Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <div style={{ background: 'var(--surface-subtle)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>
                  Duration
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)' }}>
                  {formatTime(summaryData.duration)}
                </div>
              </div>

              <div style={{ background: 'var(--surface-subtle)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>
                  Spoken Turns
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>
                  {summaryData.turns}
                </div>
              </div>

              <div style={{ background: 'var(--surface-subtle)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>
                  XP Earned
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#ea580c' }}>
                  +{Math.max(20, summaryData.turns * 15)} XP
                </div>
              </div>
            </div>

            {/* Corrections Review */}
            {summaryData.corrections.length > 0 ? (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '10px' }}>
                  Key Language Polish Points ({summaryData.corrections.length}):
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                  {summaryData.corrections.map((corr, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'var(--surface-subtle)',
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ color: '#dc2626' }}>
                        <span style={{ fontWeight: '700' }}>Original: </span>
                        <span style={{ textDecoration: 'line-through' }}>"{corr.original}"</span>
                      </div>
                      <div style={{ color: '#16a34a', fontWeight: '700' }}>
                        <span>Improved: </span>
                        <span>"{corr.improved}"</span>
                      </div>
                      <div style={{ color: 'var(--foreground-muted)', fontSize: '12px', marginTop: '2px' }}>
                        {corr.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  fontSize: '13px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={18} />
                <span>Zero grammar slips! Your spoken syntax was remarkably clean.</span>
              </div>
            )}

            {/* Guest Registration Callout */}
            {quota.isGuest && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '4px' }}>
                  Save your speaking history & unlock unlimited turns
                </div>
                <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginBottom: '10px' }}>
                  Create a free EnglishMate AI account to store speech progress, vocabulary vault, and CEFR milestones.
                </p>
                <Link
                  href="/register"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'white',
                    background: 'var(--color-primary)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Create Free Account</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
