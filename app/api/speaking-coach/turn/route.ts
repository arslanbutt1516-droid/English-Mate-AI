import { NextResponse } from 'next/server'
import {
  checkAndIncrementQuota,
  generateOfflineSpeakingResponse,
  TurnAIResult,
} from '@/lib/speakingCoachService'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      sessionId,
      turnText,
      topic = 'daily',
      level = 'B1',
      urduSupport = true,
      history = [],
    } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    if (!turnText || typeof turnText !== 'string' || !turnText.trim()) {
      return NextResponse.json({ error: 'Learner turn text is required' }, { status: 400 })
    }

    // Server-side quota enforcement
    const quotaStatus = checkAndIncrementQuota(sessionId)
    if (!quotaStatus.allowed) {
      return NextResponse.json(
        {
          error: 'QUOTA_EXCEEDED',
          message:
            quotaStatus.isGuest
              ? 'Free guest trial quota of speaking turns reached! Please sign in or create an account for full conversation access and progress saving.'
              : 'You have reached your session limit. Please finish and save your session or start a new speaking practice.',
          turnsUsed: quotaStatus.turnsUsed,
          maxTurns: quotaStatus.maxTurns,
          turnsRemaining: 0,
          isGuest: quotaStatus.isGuest,
        },
        { status: 403 }
      )
    }

    const cleanInput = turnText.trim().slice(0, 1000)
    const geminiKey = process.env.GEMINI_API_KEY
    let aiResult: TurnAIResult | null = null

    if (geminiKey) {
      try {
        const systemPrompt = `You are EnglishMate AI's Real-Time Spoken English Coach.
Role: Patient, highly encouraging English teacher and conversational partner.
Learner Level: CEFR ${level}.
Topic: ${topic}.
Urdu explanations enabled: ${urduSupport ? 'YES' : 'NO'}.

Guidelines:
1. Provide a natural, spoken, and warm conversational response first (2 to 3 sentences).
2. If the learner made grammatical, tense, preposition, or phrasing slips, present 1 or 2 important corrections.
   Each correction must have: "original", "improved", "explanation", and if Urdu is enabled, "explanationUrdu".
   If the speech was grammatically correct, leave "corrections" as an empty array [].
3. Explain corrections simply and constructively without embarrassing the learner.
4. Ask exactly ONE thoughtful follow-up question to keep the conversation flowing.
5. Match vocabulary and sentence length to CEFR level: ${level}.
6. If Urdu is enabled, provide a brief helpful Urdu summary tip in "urduExplanation". Do NOT translate the entire reply into Urdu.
${
  topic === 'ielts'
    ? '7. For IELTS speaking, include a practiceRubric object with keys: fluency, vocabulary, grammar, pronunciationNotes, estimatedPracticeBand (a number between 4.0 and 8.5). Label it clearly as practice feedback.'
    : ''
}

Respond strictly in valid JSON format with these exact keys:
{
  "reply": "string",
  "corrections": [
    {
      "original": "string",
      "improved": "string",
      "explanation": "string",
      "explanationUrdu": "string"
    }
  ],
  "urduExplanation": "string",
  "followUpQuestion": "string"
  ${
    topic === 'ielts'
      ? `, "practiceRubric": { "fluency": "string", "vocabulary": "string", "grammar": "string", "pronunciationNotes": "string", "estimatedPracticeBand": 6.5 }`
      : ''
  }
}`

        const recentHistory = Array.isArray(history)
          ? history.slice(-6).map((msg: any) => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }],
            }))
          : []

        const contents = [
          ...recentHistory,
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nLearner said: "${cleanInput}"` }],
          },
        ]

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 9000)

        const apiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents,
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            }),
          }
        )

        clearTimeout(timeoutId)

        if (apiRes.ok) {
          const apiData = await apiRes.json()
          const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text
          if (rawText) {
            try {
              const parsed = JSON.parse(rawText)
              if (parsed.reply) {
                aiResult = {
                  reply: parsed.reply,
                  corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
                  urduExplanation: parsed.urduExplanation || '',
                  followUpQuestion: parsed.followUpQuestion || '',
                  practiceRubric: parsed.practiceRubric,
                }
              }
            } catch {
              // JSON parse failure, fall back to offline pedagogical engine
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini Speaking Coach error, using intelligent fallback engine:', (geminiErr as Error).message)
      }
    }

    // Fallback to intelligent offline speaking response if Gemini is not available or timed out
    if (!aiResult) {
      aiResult = generateOfflineSpeakingResponse({
        userInput: cleanInput,
        topic,
        level,
        urduSupport,
      })
    }

    return NextResponse.json({
      success: true,
      ...aiResult,
      turnsUsed: quotaStatus.turnsUsed,
      maxTurns: quotaStatus.maxTurns,
      turnsRemaining: quotaStatus.turnsRemaining,
      isGuest: quotaStatus.isGuest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Speaking Coach Turn error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process speaking turn',
        message: 'A temporary audio processing error occurred. Please try speaking again.',
      },
      { status: 500 }
    )
  }
}
