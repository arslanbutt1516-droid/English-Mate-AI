'use client'
import { useState, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import TeacherCanvas3D from '@/components/classroom/TeacherCanvas3D'
import TeacherAvatar2D from '@/components/classroom/TeacherAvatar2D'
import { CLASSROOM_LESSONS } from '@/lib/data/classroomLessons'
import { ClassroomLesson, ClassroomMode } from '@/lib/types'
import { playTTS, addXP } from '@/lib/storage'
import confetti from 'canvas-confetti'
import {
  GraduationCap,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  Send,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  RotateCw,
  Compass,
  UserCheck,
  Monitor,
  Eye,
  Layers,
  ChevronRight,
  BookOpen,
  Globe,
  Clock,
  Zap,
} from 'lucide-react'

export default function AIClassroomPage() {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0)
  const [mode, setMode] = useState<ClassroomMode>('teacher')
  const [use3D, setUse3D] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showUrdu, setShowUrdu] = useState(true)
  const [studentMessage, setStudentMessage] = useState('')
  const [chatLog, setChatLog] = useState<Array<{ role: 'teacher' | 'student'; text: string; urdu?: string }>>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isRecordingStudent, setIsRecordingStudent] = useState(false)

  const activeLesson: ClassroomLesson = CLASSROOM_LESSONS[selectedLessonIndex] || CLASSROOM_LESSONS[0]

  // Play teacher voice for the active lesson on initial load or change
  const handleSpeakLesson = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      playTTS(activeLesson.speechText, 0.92, 1.05)
      // Stop mouth animation after estimated duration
      const durationSec = Math.max(3, activeLesson.speechText.split(' ').length / 2.5)
      setTimeout(() => {
        setIsSpeaking(false)
      }, durationSec * 1000)
    }
  }

  const handleSelectOption = (idx: number) => {
    if (answerSubmitted) return
    setSelectedAnswer(idx)
    setAnswerSubmitted(true)

    const isCorrect = idx === activeLesson.whiteboard.interactiveQuestion?.correctIndex
    if (isCorrect) {
      confetti({ particleCount: 50, spread: 60 })
      addXP(25)
      setToastMessage('Correct answer! +25 XP awarded!')
    } else {
      setToastMessage('Incorrect. Check the explanation on the whiteboard!')
    }
  }

  const handleSendStudentMessage = async () => {
    if (!studentMessage.trim()) return

    const userText = studentMessage.trim()
    setChatLog((prev) => [...prev, { role: 'student', text: userText }])
    setStudentMessage('')

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          persona: mode === 'mentor' ? 'silicon' : 'oxford',
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setChatLog((prev) => [
          ...prev,
          { role: 'teacher', text: data.reply, urdu: data.urduExplanation },
        ])
        setIsSpeaking(true)
        playTTS(data.reply.slice(0, 160), 0.95, 1.05)
        setTimeout(() => setIsSpeaking(false), 5000)
      }
    } catch {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'teacher',
          text: `Splendid question! In English, remember to always align your subject with the correct verb form and practice with active daily examples.`,
          urdu: `بہترین سوال! ہمیشہ فاعل اور فعل کی مطابقت کا خیال رکھیں اور روزانہ جملے بنا کر مشق کریں۔`,
        },
      ])
    }
  }

  const handleVoiceInput = () => {
    if (isRecordingStudent) {
      setIsRecordingStudent(false)
    } else {
      setIsRecordingStudent(true)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const rec = new SpeechRec()
        rec.lang = 'en-US'
        rec.onresult = (e: any) => {
          const spoken = e.results[0][0].transcript
          setStudentMessage(spoken)
          setIsRecordingStudent(false)
        }
        rec.onerror = () => setIsRecordingStudent(false)
        rec.start()
      } else {
        setStudentMessage('Can you explain this rule again simply?')
        setIsRecordingStudent(false)
      }
    }
  }

  return (
    <AppShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Classroom Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--primary-100)',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: '800',
              }}
            >
              <Zap size={14} />
              3D AI Virtual Classroom
            </span>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: 'var(--surface-subtle)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {[
                { id: 'teacher', label: 'Teacher Mode', icon: GraduationCap },
                { id: 'mentor', label: 'Mentor Mode', icon: Compass },
                { id: 'student', label: 'Practice Mode', icon: UserCheck },
              ].map((m) => {
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background: mode === m.id ? 'var(--color-primary)' : 'transparent',
                      color: mode === m.id ? 'white' : 'var(--foreground-muted)',
                      fontWeight: '700',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={13} />
                    <span>{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3D / 2D Toggle & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowUrdu(!showUrdu)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: showUrdu ? 'var(--primary-50)' : 'var(--surface)',
                color: showUrdu ? 'var(--color-primary)' : 'var(--foreground-muted)',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              اردو تشریح: {showUrdu ? 'آن' : 'آف'}
            </button>

            <button
              onClick={() => setUse3D(!use3D)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--foreground)',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              title="Toggle between 3D WebGL and 2D low-power mode"
            >
              <Monitor size={14} />
              <span>{use3D ? '3D Active (Switch 2D)' : '2D Mode (Switch 3D)'}</span>
            </button>
          </div>
        </div>

        {/* Lesson Selector Bar */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CLASSROOM_LESSONS.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => {
                setSelectedLessonIndex(idx)
                setSelectedAnswer(null)
                setAnswerSubmitted(false)
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: `1px solid ${selectedLessonIndex === idx ? 'var(--color-primary)' : 'var(--border)'}`,
                background: selectedLessonIndex === idx ? 'var(--primary-100)' : 'var(--card-bg)',
                color: selectedLessonIndex === idx ? 'var(--color-primary)' : 'var(--foreground)',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {l.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Classroom Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ================= LEFT COLUMN: TEACHER AVATAR & SPEECH ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Avatar Frame */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              border: '1px solid var(--card-border)',
              height: '420px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--card-shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {use3D ? (
              <TeacherCanvas3D
                mood={activeLesson.teacherAvatarMood}
                isSpeaking={isSpeaking}
                onWebGLError={() => setUse3D(false)}
              />
            ) : (
              <TeacherAvatar2D
                mood={activeLesson.teacherAvatarMood}
                isSpeaking={isSpeaking}
                speechText={activeLesson.speechText}
                speechUrdu={activeLesson.speechUrdu}
              />
            )}

            {/* Quick Play Voice Button Over Avatar */}
            <button
              onClick={handleSpeakLesson}
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: isSpeaking ? '#ef4444' : 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isSpeaking ? 'Pause Teacher' : 'Teacher Voice'}</span>
            </button>
          </div>

          {/* Teacher Speech Bubble */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              padding: '18px',
              boxShadow: 'var(--card-shadow)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Teacher Explanation:
              </span>
              <span style={{ fontSize: '11px', color: 'var(--foreground-subtle)' }}>
                Level {activeLesson.level}
              </span>
            </div>

            <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--foreground)', fontWeight: '600', marginBottom: '8px' }}>
              "{activeLesson.speechText}"
            </div>

            {showUrdu && (
              <div style={{ fontSize: '13px', color: '#0284c7', fontWeight: '700', direction: 'rtl', textAlign: 'right', background: 'var(--surface-subtle)', padding: '8px 12px', borderRadius: '8px' }}>
                {activeLesson.speechUrdu}
              </div>
            )}

            {/* Quick Classroom Helper Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              <button
                onClick={() => {
                  setStudentMessage('Can you please explain this step-by-step with a simple formula?')
                  handleSendStudentMessage()
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--foreground-muted)',
                  cursor: 'pointer',
                }}
              >
                Explain simply
              </button>

              <button
                onClick={() => {
                  setStudentMessage('Please provide one more real-life example in business English.')
                  handleSendStudentMessage()
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--foreground-muted)',
                  cursor: 'pointer',
                }}
              >
                Give another example
              </button>

              <button
                onClick={() => {
                  setStudentMessage('اس موضوع کو اردو میں مزید آسان الفاظ میں سمجھائیں۔')
                  handleSendStudentMessage()
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#0284c7',
                  cursor: 'pointer',
                }}
              >
                اردو میں سمجھائیں
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE DIGITAL WHITEBOARD ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '20px',
              border: '2px solid var(--primary-300)',
              padding: '28px 24px',
              boxShadow: 'var(--card-shadow-lg)',
              position: 'relative',
            }}
          >
            {/* Whiteboard Header Frame */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--foreground-subtle)', marginLeft: '6px' }}>
                  Digital Classroom Whiteboard
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                {activeLesson.category.toUpperCase()}
              </span>
            </div>

            {/* Headline and Topic */}
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--foreground)', marginBottom: '4px' }}>
              {activeLesson.whiteboard.headline}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '16px' }}>
              Topic: {activeLesson.whiteboard.topic}
            </div>

            {/* Concept Formula */}
            {activeLesson.whiteboard.conceptFormula && (
              <div
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  borderLeft: '4px solid var(--color-primary)',
                  padding: '12px 16px',
                  borderRadius: '0 10px 10px 0',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--foreground)',
                  marginBottom: '18px',
                }}
              >
                {activeLesson.whiteboard.conceptFormula}
              </div>
            )}

            {/* Visual Timeline / Diagram */}
            {activeLesson.whiteboard.timelineOrDiagram && (
              <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '10px' }}>
                  {activeLesson.whiteboard.timelineOrDiagram.title}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {activeLesson.whiteboard.timelineOrDiagram.steps.map((st, sIdx) => (
                    <div key={sIdx} style={{ background: 'var(--card-bg)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)' }}>{st.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '2px' }}>{st.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Bullet Points */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--foreground-subtle)', marginBottom: '6px' }}>
                Key Principles:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--foreground)', lineHeight: 1.7 }}>
                {activeLesson.whiteboard.bulletPoints.map((bp, bIdx) => (
                  <li key={bIdx}>{bp}</li>
                ))}
              </ul>
            </div>

            {/* Example Sentences */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--foreground-subtle)', marginBottom: '8px' }}>
                Demonstrated Examples:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeLesson.whiteboard.exampleSentences.map((ex, exIdx) => (
                  <div key={exIdx} style={{ background: 'var(--surface-subtle)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
                      {ex.en}
                    </div>
                    {showUrdu && (
                      <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '2px', direction: 'rtl', textAlign: 'right' }}>
                        {ex.ur}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Comprehension Question */}
            {activeLesson.whiteboard.interactiveQuestion && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '10px' }}>
                  Interactive Check: {activeLesson.whiteboard.interactiveQuestion.question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeLesson.whiteboard.interactiveQuestion.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === oIdx
                    const isCorrect = oIdx === activeLesson.whiteboard.interactiveQuestion?.correctIndex

                    let bg = 'var(--surface)'
                    let borderColor = 'var(--border)'
                    if (answerSubmitted) {
                      if (isCorrect) {
                        bg = 'rgba(16, 185, 129, 0.15)'
                        borderColor = '#10b981'
                      } else if (isSelected) {
                        bg = 'rgba(239, 68, 68, 0.15)'
                        borderColor = '#ef4444'
                      }
                    } else if (isSelected) {
                      bg = 'var(--primary-50)'
                      borderColor = 'var(--color-primary)'
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: `2px solid ${borderColor}`,
                          background: bg,
                          color: 'var(--foreground)',
                          fontSize: '13px',
                          fontWeight: '600',
                          textAlign: 'left',
                          cursor: answerSubmitted ? 'default' : 'pointer',
                        }}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {answerSubmitted && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--foreground-muted)', fontWeight: '600' }}>
                    {activeLesson.whiteboard.interactiveQuestion.explanation}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Student Q&A Input Bar */}
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              padding: '14px 18px',
              boxShadow: 'var(--card-shadow)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <button
              onClick={handleVoiceInput}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: 'none',
                background: isRecordingStudent ? '#ef4444' : 'var(--surface-subtle)',
                color: isRecordingStudent ? 'white' : 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title="Speak question to AI teacher"
            >
              <Mic size={18} />
            </button>

            <input
              type="text"
              placeholder="Ask Professor Elena anything about grammar, IELTS, or vocabulary..."
              value={studentMessage}
              onChange={(e) => setStudentMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendStudentMessage()}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: 'var(--foreground)',
              }}
            />

            <button
              onClick={handleSendStudentMessage}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <span>Ask</span>
              <Send size={14} />
            </button>
          </div>

          {/* Q&A Dialog History */}
          {chatLog.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chatLog.slice(-3).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: item.role === 'teacher' ? 'var(--card-bg)' : 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: '800', color: item.role === 'teacher' ? 'var(--color-primary)' : 'var(--foreground)', marginBottom: '2px' }}>
                    {item.role === 'teacher' ? 'Professor Elena Vance:' : 'You:'}
                  </div>
                  <div>{item.text}</div>
                  {item.urdu && (
                    <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '4px', direction: 'rtl', textAlign: 'right' }}>
                      {item.urdu}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
