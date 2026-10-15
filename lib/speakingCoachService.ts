import type { SpeakingCoachTopic, CEFRLevel, SpeakingCorrection } from './types'

// In-memory server session store (backed by process memory with 24h TTL)
interface ServerSpeakingSession {
  sessionId: string
  userId: string
  isGuest: boolean
  turnsUsed: number
  maxTurns: number
  topic: SpeakingCoachTopic
  level: CEFRLevel
  urduSupport: boolean
  createdAt: number
  lastActivity: number
}

const sessionStore = new Map<string, ServerSpeakingSession>()

// Cleanup stale sessions older than 24 hours
function cleanupStaleSessions() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  for (const [id, sess] of sessionStore.entries()) {
    if (sess.lastActivity < cutoff) {
      sessionStore.delete(id)
    }
  }
}

export function getQuotaLimits(): { guestLimit: number; userLimit: number } {
  const guestLimit = parseInt(process.env.SPEAKING_COACH_GUEST_LIMIT || '5', 10)
  const userLimit = parseInt(process.env.SPEAKING_COACH_USER_LIMIT || '30', 10)
  return {
    guestLimit: isNaN(guestLimit) ? 5 : guestLimit,
    userLimit: isNaN(userLimit) ? 30 : userLimit,
  }
}

export function getOrCreateSession(params: {
  sessionId?: string
  userId?: string
  topic?: SpeakingCoachTopic
  level?: CEFRLevel
  urduSupport?: boolean
}): { session: ServerSpeakingSession; isNew: boolean } {
  cleanupStaleSessions()
  const { guestLimit, userLimit } = getQuotaLimits()

  const id = params.sessionId || `spk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const existing = sessionStore.get(id)

  if (existing) {
    existing.lastActivity = Date.now()
    if (params.topic) existing.topic = params.topic
    if (params.level) existing.level = params.level
    if (params.urduSupport !== undefined) existing.urduSupport = params.urduSupport
    return { session: existing, isNew: false }
  }

  const isGuest = !params.userId || params.userId.startsWith('guest_')
  const newSession: ServerSpeakingSession = {
    sessionId: id,
    userId: params.userId || `guest_${Math.random().toString(36).substring(2, 9)}`,
    isGuest,
    turnsUsed: 0,
    maxTurns: isGuest ? guestLimit : userLimit,
    topic: params.topic || 'daily',
    level: params.level || 'B1',
    urduSupport: params.urduSupport ?? true,
    createdAt: Date.now(),
    lastActivity: Date.now(),
  }

  sessionStore.set(id, newSession)
  return { session: newSession, isNew: true }
}

export function checkAndIncrementQuota(sessionId: string): {
  allowed: boolean
  turnsUsed: number
  maxTurns: number
  turnsRemaining: number
  isGuest: boolean
} {
  const { session } = getOrCreateSession({ sessionId })

  if (session.turnsUsed >= session.maxTurns) {
    return {
      allowed: false,
      turnsUsed: session.turnsUsed,
      maxTurns: session.maxTurns,
      turnsRemaining: 0,
      isGuest: session.isGuest,
    }
  }

  session.turnsUsed += 1
  session.lastActivity = Date.now()

  return {
    allowed: true,
    turnsUsed: session.turnsUsed,
    maxTurns: session.maxTurns,
    turnsRemaining: Math.max(0, session.maxTurns - session.turnsUsed),
    isGuest: session.isGuest,
  }
}

export interface TurnAIResult {
  reply: string
  corrections: SpeakingCorrection[]
  urduExplanation: string
  followUpQuestion: string
  practiceRubric?: {
    fluency: string
    vocabulary: string
    grammar: string
    pronunciationNotes: string
    estimatedPracticeBand: number
  }
}

// Fallback rule-based pedagogical engine when Gemini is offline or overloaded
export function generateOfflineSpeakingResponse(params: {
  userInput: string
  topic: SpeakingCoachTopic
  level: CEFRLevel
  urduSupport: boolean
}): TurnAIResult {
  const text = params.userInput.trim()
  const lower = text.toLowerCase()

  const corrections: SpeakingCorrection[] = []
  let reply = ''
  let urduExplanation = ''
  let followUpQuestion = ''

  // Heuristic grammar check
  if (lower.includes('i am go ') || lower.includes('i go to yesterday') || lower.includes('yesterday i go')) {
    corrections.push({
      original: 'I am go / I go to yesterday',
      improved: 'I went yesterday / I am going',
      explanation: 'Use the past tense "went" for completed past actions, or "am going" for present continuous.',
      explanationUrdu: 'ماضی کے کاموں کے لیے ورب کی دوسری فارم "went" استعمال کی جاتی ہے۔',
    })
  } else if (lower.includes('he go ') || lower.includes('she go ') || lower.includes('it work ')) {
    corrections.push({
      original: 'he go / she go',
      improved: 'he goes / she goes',
      explanation: 'In present simple tense, third-person singular subjects (he, she, it) take an "-s" or "-es" suffix.',
      explanationUrdu: 'ہی (He) یا شی (She) کے ساتھ ورب میں s یا es لگانا ضروری ہوتا ہے۔',
    })
  } else if (lower.includes('more better') || lower.includes('most best')) {
    corrections.push({
      original: 'more better',
      improved: 'much better / better',
      explanation: '"Better" is already a comparative adjective. Avoid combining it with "more".',
      explanationUrdu: 'انگریزی میں "more better" غلط ہے، صرف "much better" یا "better" بولیں۔',
    })
  } else if (lower.includes('tell me about') || lower.includes('give me')) {
    corrections.push({
      original: 'Give me information',
      improved: 'Could you please share more details?',
      explanation: 'In professional and polite conversation, modal phrases like "Could you please..." soften requests.',
      explanationUrdu: 'شائستہ گفتگو کے لیے "Could you please..." کا استعمال زیادہ بااثر سمجھا جاتا ہے۔',
    })
  }

  // Topic specific responses
  switch (params.topic) {
    case 'workplace':
      reply = `Thank you for sharing that workplace update. You articulated your main point effectively. In corporate communication, always leading with the immediate business impact makes your speaking sound authoritative and concise.`
      followUpQuestion = `How did your team members react when you communicated this, and what is your target completion date?`
      urduExplanation = params.urduSupport
        ? `دفتری انگریزی میں پہلے اصل نتیجہ بیان کریں تاکہ سننے والے کا وقت بچ سکے اور آپ کا پیغام واضح ہو۔`
        : ''
      break

    case 'interview':
      reply = `That is a strong start to answering an interview question! To make your response stand out under the STAR method, remember to highlight the specific action YOU took, and quantify the result if possible.`
      followUpQuestion = `Could you describe the biggest challenge you encountered during this process, and how you resolved it?`
      urduExplanation = params.urduSupport
        ? `انٹرویو میں STAR فارمولہ (صورتحال، ٹاسک، اقدام اور نتیجہ) استعمال کریں۔ ہمیشہ بتائیں کہ آپ کا ذاتی کردار کیا تھا۔`
        : ''
      break

    case 'ielts':
      reply = `You expressed your ideas with commendable topical relevance and steady sentence structure. To achieve higher band descriptors, aim to link your points using diverse discourse markers like "Consequently", "On the other hand", or "From an analytical standpoint".`
      followUpQuestion = `How do you think this trend will evolve over the upcoming decade in modern society?`
      urduExplanation = params.urduSupport
        ? `آئی ایل ٹی ایس اسپیکنگ میں جملوں کو جوڑنے والے الفاظ (Linking Words) کا متنوع استعمال بینڈ اسکور کو بہتر بناتا ہے۔`
        : ''
      break

    case 'grammar':
      reply = `Well spoken! I listened carefully to your phrasing and tense usage. Focusing on smooth transitions and natural preposition placement will quickly elevate your accuracy.`
      followUpQuestion = `Could you try explaining that same thought once more, using a conditional sentence starting with "If..."?`
      urduExplanation = params.urduSupport
        ? `گرامر کی درستی کے لیے مختلف اقسام کے جملے (جیسے شرطیہ جملے) بولنے کی مشق کریں۔`
        : ''
      break

    case 'friend':
      reply = `I really enjoy chatting with you about this! You have a very warm and conversational speaking cadence. It feels very natural and engaging.`
      followUpQuestion = `What is something exciting or interesting that you are looking forward to this week?`
      urduExplanation = params.urduSupport
        ? `بہت خوب! دوستوں کے ساتھ آزادانہ گفتگو میں روانی اور پرسکون انداز سب سے زیادہ اہم ہوتا ہے۔`
        : ''
      break

    case 'daily':
    default:
      reply = `That is very interesting! You expressed your thoughts clearly, and I can hear your confidence growing. Daily speaking practice is the fastest way to build permanent fluency.`
      followUpQuestion = `What other factors contributed to this, or what would you like to explore next?`
      urduExplanation = params.urduSupport
        ? `روزمرہ گفتگو میں عام الفاظ کی بجائے باقاعدہ فقرے بولنے سے زبان پر تیزی سے روانی آتی ہے۔`
        : ''
      break
  }

  const result: TurnAIResult = {
    reply,
    corrections,
    urduExplanation,
    followUpQuestion,
  }

  if (params.topic === 'ielts') {
    result.practiceRubric = {
      fluency: 'Good continuity of speech with minor hesitations for vocabulary search.',
      vocabulary: 'Appropriate topic-specific vocabulary with opportunity for broader collocation use.',
      grammar: corrections.length === 0 ? 'Consistent control of basic and complex structures.' : 'Minor slips in tense or agreement; meaning remained clear.',
      pronunciationNotes: 'Clear articulation; focus on natural sentence stress and rhythm.',
      estimatedPracticeBand: corrections.length === 0 ? 6.5 : 6.0,
    }
  }

  return result
}
