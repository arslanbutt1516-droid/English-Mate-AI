import { NextResponse } from 'next/server'
import { getOrCreateSession } from '@/lib/speakingCoachService'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { sessionId, userId, topic, level, urduSupport } = body

    const { session, isNew } = getOrCreateSession({
      sessionId,
      userId,
      topic,
      level,
      urduSupport,
    })

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      userId: session.userId,
      isGuest: session.isGuest,
      turnsUsed: session.turnsUsed,
      maxTurns: session.maxTurns,
      turnsRemaining: Math.max(0, session.maxTurns - session.turnsUsed),
      topic: session.topic,
      level: session.level,
      urduSupport: session.urduSupport,
      isNew,
    })
  } catch (error) {
    console.error('Speaking Coach Session error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize speaking session' },
      { status: 500 }
    )
  }
}
