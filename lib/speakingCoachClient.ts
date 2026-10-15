'use client'

import {
  SpeakingCoachTopic,
  CEFRLevel,
  SpeakingCoachSessionState,
  SpeakingCoachMessage,
  SpeakingCorrection,
} from './types'

export interface SpeakingCoachClientOptions {
  topic: SpeakingCoachTopic
  level: CEFRLevel
  urduSupport: boolean
  mode: 'push-to-talk' | 'live-voice' | 'text'
  onStateChange: (state: SpeakingCoachSessionState) => void
  onTranscriptUpdate: (text: string, isFinal: boolean) => void
  onMessageReceived: (message: SpeakingCoachMessage) => void
  onQuotaUpdate: (quota: { turnsUsed: number; maxTurns: number; turnsRemaining: number; isGuest: boolean }) => void
  onError: (error: { title: string; message: string; code?: string }) => void
  onAudioLevel?: (level: number) => void
}

export class SpeakingCoachClient {
  private options: SpeakingCoachClientOptions
  private state: SpeakingCoachSessionState = 'idle'
  private sessionId: string | null = null
  private recognition: any = null
  private isPushToTalkActive: boolean = false
  private silenceTimer: any = null
  private currentTurnText: string = ''
  private isMuted: boolean = false
  private speechRate: number = 0.95
  private activeUtterance: SpeechSynthesisUtterance | null = null
  private history: Array<{ role: 'user' | 'assistant'; text: string }> = []
  private isAudioUnlocked: boolean = false

  constructor(options: SpeakingCoachClientOptions) {
    this.options = options
    this.initRecognition()
  }

  private setState(newState: SpeakingCoachSessionState) {
    this.state = newState
    this.options.onStateChange(newState)
  }

  public getSessionStatus(): {
    state: SpeakingCoachSessionState
    sessionId: string | null
    isMuted: boolean
    isSpeechRecognitionSupported: boolean
  } {
    return {
      state: this.state,
      sessionId: this.sessionId,
      isMuted: this.isMuted,
      isSpeechRecognitionSupported: typeof window !== 'undefined' && Boolean(
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      ),
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.6, Math.min(1.5, rate))
  }

  public setMode(mode: 'push-to-talk' | 'live-voice' | 'text') {
    this.options.mode = mode
    if (this.state === 'listening' && mode === 'text') {
      this.stopListening()
    }
  }

  public updateConfig(topic: SpeakingCoachTopic, level: CEFRLevel, urduSupport: boolean) {
    this.options.topic = topic
    this.options.level = level
    this.options.urduSupport = urduSupport
  }

  private initRecognition() {
    if (typeof window === 'undefined') return

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRec) {
      return
    }

    try {
      const rec = new SpeechRec()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'
      rec.maxAlternatives = 1

      rec.onresult = (event: any) => {
        let interimText = ''
        let finalText = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalText += trans + ' '
          } else {
            interimText += trans
          }
        }

        const combined = (this.currentTurnText + ' ' + finalText + interimText).trim()
        this.options.onTranscriptUpdate(combined, Boolean(finalText))

        if (finalText) {
          this.currentTurnText = (this.currentTurnText + ' ' + finalText).trim()
        }

        // Live voice mode silence auto-detection (1.4 seconds of silence completes the turn)
        if (this.options.mode === 'live-voice') {
          clearTimeout(this.silenceTimer)
          this.silenceTimer = setTimeout(() => {
            if (this.currentTurnText.trim().length > 0 && this.state === 'listening') {
              this.submitCurrentTurn()
            }
          }, 1400)
        }
      }

      rec.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error)
        if (event.error === 'not-allowed') {
          this.options.onError({
            title: 'Microphone Access Denied',
            message: 'Please allow microphone access in your browser settings to speak with the AI coach.',
            code: 'MIC_PERMISSION_DENIED',
          })
          this.setState('error')
        } else if (event.error === 'no-speech') {
          // Normal timeout when silence occurs
        } else if (event.error !== 'aborted') {
          this.options.onError({
            title: 'Recognition Alert',
            message: 'Audio input was interrupted. You can also type your message using the text input below.',
            code: event.error,
          })
        }
      }

      rec.onend = () => {
        // If in live mode and still supposed to be listening
        if (this.state === 'listening' && this.options.mode === 'live-voice') {
          try {
            rec.start()
          } catch {
            // Already started or restarting
          }
        }
      }

      this.recognition = rec
    } catch (err) {
      console.error('Failed to initialize SpeechRecognition:', err)
    }
  }

  public async startSession(userId?: string): Promise<boolean> {
    this.interruptResponse()
    try {
      const res = await fetch('/api/speaking-coach/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'guest_' + Math.random().toString(36).substring(2, 9),
          topic: this.options.topic,
          level: this.options.level,
          urduSupport: this.options.urduSupport,
        }),
      })

      if (!res.ok) throw new Error('Session creation failed')
      const data = await res.json()

      this.sessionId = data.sessionId
      this.options.onQuotaUpdate({
        turnsUsed: data.turnsUsed,
        maxTurns: data.maxTurns,
        turnsRemaining: data.turnsRemaining,
        isGuest: data.isGuest,
      })

      this.setState('idle')
      return true
    } catch (err) {
      console.error('startSession error:', err)
      this.options.onError({
        title: 'Connection Error',
        message: 'Could not connect to the speaking coach service. Please check your connection.',
      })
      this.setState('error')
      return false
    }
  }

  public startListening() {
    this.interruptResponse()
    this.currentTurnText = ''
    this.options.onTranscriptUpdate('', false)

    if (!this.recognition) {
      this.options.onError({
        title: 'Browser Speech Recognition Unavailable',
        message: 'Your browser does not have speech recognition enabled. You can use the text input below to practice.',
        code: 'SPEECH_REC_UNAVAILABLE',
      })
      this.setState('idle')
      return
    }

    try {
      this.recognition.start()
      this.setState('listening')
    } catch (e) {
      try {
        this.recognition.stop()
        setTimeout(() => {
          this.recognition.start()
          this.setState('listening')
        }, 150)
      } catch {
        this.setState('idle')
      }
    }
  }

  public stopListening() {
    clearTimeout(this.silenceTimer)
    if (this.recognition) {
      try {
        this.recognition.stop()
      } catch {
        // ignore
      }
    }
    if (this.state === 'listening') {
      this.setState('idle')
    }
  }

  // Push-to-Talk handlers
  public onPushToTalkStart() {
    if (this.state === 'processing') return
    this.isPushToTalkActive = true
    this.startListening()
  }

  public onPushToTalkEnd() {
    if (!this.isPushToTalkActive) return
    this.isPushToTalkActive = false
    this.stopListening()

    // Wait 300ms for final recognized tokens to flush, then submit
    setTimeout(() => {
      if (this.currentTurnText.trim().length > 0) {
        this.submitCurrentTurn()
      }
    }, 350)
  }

  public interruptResponse() {
    clearTimeout(this.silenceTimer)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (this.state === 'speaking' || this.state === 'processing') {
      this.setState('interrupted')
      setTimeout(() => {
        if (this.state === 'interrupted') this.setState('idle')
      }, 400)
    }
  }

  public async sendTurnText(text: string) {
    this.currentTurnText = text
    return this.submitCurrentTurn()
  }

  private async submitCurrentTurn() {
    const textToSend = this.currentTurnText.trim()
    if (!textToSend) return

    this.stopListening()
    this.interruptResponse()
    this.setState('processing')

    // Append user message
    const userMsg: SpeakingCoachMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    this.options.onMessageReceived(userMsg)
    this.history.push({ role: 'user', text: textToSend })
    this.currentTurnText = ''
    this.options.onTranscriptUpdate('', true)

    try {
      const res = await fetch('/api/speaking-coach/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          turnText: textToSend,
          topic: this.options.topic,
          level: this.options.level,
          urduSupport: this.options.urduSupport,
          history: this.history,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 403 && data.error === 'QUOTA_EXCEEDED') {
          this.options.onError({
            title: 'Trial Quota Reached',
            message: data.message,
            code: 'QUOTA_EXCEEDED',
          })
          this.setState('idle')
          return
        }
        throw new Error(data.message || 'Error processing response')
      }

      this.options.onQuotaUpdate({
        turnsUsed: data.turnsUsed,
        maxTurns: data.maxTurns,
        turnsRemaining: data.turnsRemaining,
        isGuest: data.isGuest,
      })

      const aiMsg: SpeakingCoachMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        corrections: data.corrections,
        urduExplanation: data.urduExplanation,
        followUpQuestion: data.followUpQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      this.options.onMessageReceived(aiMsg)
      this.history.push({ role: 'assistant', text: data.reply + ' ' + (data.followUpQuestion || '') })

      // Speak response aloud if not muted
      if (!this.isMuted) {
        this.speakText(`${data.reply} ${data.followUpQuestion || ''}`)
      } else {
        this.setState('idle')
      }
    } catch (err: any) {
      console.error('Turn submission error:', err)
      this.options.onError({
        title: 'Response Error',
        message: err.message || 'Could not reach the coach. Please try speaking again.',
      })
      this.setState('idle')
    }
  }

  public speakText(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.setState('idle')
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = this.speechRate
    utterance.pitch = 1.0

    // Choose preferred voice if available
    const voices = window.speechSynthesis.getVoices()
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Karen'))
    )
    if (naturalVoice) {
      utterance.voice = naturalVoice
    }

    utterance.onstart = () => {
      this.setState('speaking')
    }

    utterance.onend = () => {
      this.setState('idle')
      // If live voice mode is active, restart listening for the learner's turn automatically
      if (this.options.mode === 'live-voice') {
        setTimeout(() => {
          if (this.state === 'idle') {
            this.startListening()
          }
        }, 600)
      }
    }

    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event)
      this.setState('idle')
    }

    this.activeUtterance = utterance
    window.speechSynthesis.speak(utterance)
  }

  public endSession(): { turnCount: number } {
    this.interruptResponse()
    this.stopListening()
    this.setState('ended')
    const count = this.history.filter((h) => h.role === 'user').length
    this.history = []
    this.sessionId = null
    return { turnCount: count }
  }

  public cleanup() {
    this.stopListening()
    this.interruptResponse()
    this.recognition = null
  }
}
