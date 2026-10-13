'use client'
import { useState, useRef, useEffect } from 'react'
import AppShell from '@/components/navigation/AppShell'
import { playTTS, addXP } from '@/lib/storage'
import {
  Send,
  Volume2,
  Sparkles,
  BotMessageSquare,
  User,
  RotateCcw,
  BookOpen,
  Briefcase,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  GraduationCap,
  Cpu
} from 'lucide-react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  correction?: string | null
  urduExplanation?: string | null
  timestamp: string
}

const suggestedPrompts = [
  'Can you explain the difference between Present Simple and Present Continuous?',
  'Help me practice answering: "Tell me about yourself" for a job interview.',
  'What are some formal alternatives to "I think"?',
  'Please correct this sentence: "He go to office yesterday."',
]

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am your AI English Coach. I am here to help you practice conversations, polish grammar, and prepare for interviews. You can type in English or ask questions in Urdu anytime. How can I help you today?',
      urduExplanation: 'السلام علیکم! میں آپ کا AI انگلش کوچ ہوں۔ آپ کسی بھی وقت انگریزی بولنے کی مشق کر سکتے ہیں یا سوالات پوچھ سکتے ہیں۔',
      timestamp: 'Just now',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeMode, setActiveMode] = useState<'free' | 'interview' | 'grammar'>('free')
  const [activePersona, setActivePersona] = useState<'mentor' | 'oxford' | 'silicon'>('mentor')
  const [errorToast, setErrorToast] = useState<string | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode: activeMode,
          persona: activePersona,
        }),
      })

      const data = await res.json()

      if (data.reply) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply,
          correction: data.correction,
          urduExplanation: data.urduExplanation,
          timestamp: 'Just now',
        }
        setMessages((prev) => [...prev, aiMsg])
        addXP(15)
      } else {
        // Show a friendly inline error message in the chat
        const errMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'I could not process that request right now. Please try rephrasing your question, or ask me a grammar rule, sentence correction, or interview practice question!',
          urduExplanation: 'ابھی جواب نہیں مل سکا۔ براہ کرم دوبارہ کوشش کریں یا کوئی گرامر سوال پوچھیں۔',
          timestamp: 'Just now',
        }
        setMessages((prev) => [...prev, errMsg])
      }
    } catch (err) {
      console.error(err)
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Network connection issue. Please check your internet connection and try again.',
        urduExplanation: 'انٹرنیٹ کنیکشن کا مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں۔',
        timestamp: 'Just now',
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'ai',
        text: 'Chat reset! What would you like to practice today?',
        urduExplanation: 'گفتگو دوبارہ شروع ہو گئی ہے۔ آپ کیا سیکھنا چاہتے ہیں؟',
        timestamp: 'Just now',
      },
    ])
  }

  return (
    <AppShell>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: 'white',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            Gemini AI Language Engine
          </span>
          <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
            24/7 Unlimited Conversational Coaching • Multi-Persona
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
          AI Personal Tutor • انٹیلیجنٹ انگلش ٹیوٹر
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', maxWidth: '700px' }}>
          Ask any grammar question, roleplay realistic interview scenarios, or have friendly conversational practice. Choose your coach's persona and get bilingual Urdu explanations.
        </p>
      </div>

      {/* Persona & Mode Selection Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Tutor Persona */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--foreground-subtle)', textTransform: 'uppercase' }}>Coach Persona:</span>
          {[
            { id: 'mentor', label: '🌟 Bilingual Mentor', icon: Sparkles },
            { id: 'oxford', label: '🎓 Oxford Professor', icon: GraduationCap },
            { id: 'silicon', label: '💼 Silicon Valley Coach', icon: Cpu },
          ].map((pers) => {
            const isSelected = activePersona === pers.id

            return (
              <button
                key={pers.id}
                onClick={() => setActivePersona(pers.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--primary-100)' : 'var(--surface-subtle)',
                  color: isSelected ? 'var(--color-primary)' : 'var(--foreground-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{pers.label}</span>
              </button>
            )
          })}
        </div>

        {/* Clear chat button */}
        <button
          onClick={handleClearChat}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--foreground-subtle)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <RotateCcw size={14} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Box Container */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          height: 'clamp(480px, 70vh, 680px)',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden',
        }}
      >
        {/* Messages Scroll Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai'

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                }}
              >
                {isAi && (
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'var(--gradient-hero)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <BotMessageSquare size={18} />
                  </div>
                )}

                <div
                  style={{
                    background: isAi ? 'var(--surface-subtle)' : 'var(--color-primary)',
                    color: isAi ? 'var(--foreground)' : 'white',
                    borderRadius: '16px',
                    borderBottomLeftRadius: isAi ? '4px' : '16px',
                    borderBottomRightRadius: !isAi ? '4px' : '16px',
                    padding: '16px 20px',
                    border: `1px solid ${isAi ? 'var(--border)' : 'transparent'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', opacity: isAi ? 0.6 : 0.8 }}>
                      {isAi ? 'EnglishMate Coach' : 'You'}
                    </span>
                    {isAi && (
                      <button
                        onClick={() => playTTS(msg.text)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-primary)',
                          padding: '2px',
                        }}
                        title="Listen to response"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </p>

                  {/* Gentle Error Correction alert */}
                  {msg.correction && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#fef3c7',
                        border: '1px solid #fde68a',
                        color: '#92400e',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      💡 Correction Tip: {msg.correction}
                    </div>
                  )}

                  {/* Urdu Explanation */}
                  {msg.urduExplanation && (
                    <div
                      style={{
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: isAi ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.2)',
                        fontSize: '13px',
                        color: isAi ? '#0284c7' : '#e0f2fe',
                        lineHeight: 1.5,
                      }}
                    >
                      {msg.urduExplanation}
                    </div>
                  )}
                </div>

                {!isAi && (
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <User size={18} />
                  </div>
                )}
              </div>
            )
          })}

          {isLoading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--gradient-hero)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BotMessageSquare size={18} />
              </div>
              <div
                style={{
                  background: 'var(--surface-subtle)',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  fontSize: '13px',
                  color: 'var(--foreground-muted)',
                }}
              >
                Coach is preparing guidance...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompt Pills */}
        <div
          style={{
            padding: '10px 16px',
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--foreground-muted)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
              className="hover:border-indigo-400 hover:text-indigo-600"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--card-bg)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Ask a question or practice typing in English or اردو..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--surface-subtle)',
              fontSize: '14px',
              color: 'var(--foreground)',
              outline: 'none',
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: inputText.trim() ? 'var(--color-primary)' : 'var(--surface-subtle)',
              color: inputText.trim() ? 'white' : 'var(--foreground-subtle)',
              fontWeight: '700',
              border: 'none',
              cursor: inputText.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Send</span>
            <Send size={16} />
          </button>
        </div>
      </div>
    </AppShell>
  )
}
