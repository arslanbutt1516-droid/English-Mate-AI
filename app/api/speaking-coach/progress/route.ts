import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { SpeakingSession } from '@/lib/db/models'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      sessionId,
      userId = 'guest',
      topic,
      level = 'B1',
      durationSeconds = 0,
      turnCount = 0,
      corrections = [],
      summary = '',
      practiceRubricBand,
    } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const mongoose = await connectToDatabase().catch(() => null)
    let savedInDb = false

    if (mongoose) {
      try {
        await SpeakingSession.findOneAndUpdate(
          { sessionId },
          {
            userId,
            sessionId,
            topic,
            level,
            durationSeconds,
            turnCount,
            corrections,
            summary,
            practiceRubricBand,
          },
          { upsert: true, new: true }
        )
        savedInDb = true
      } catch (dbErr) {
        console.warn('Could not save speaking session to MongoDB:', (dbErr as Error).message)
      }
    }

    return NextResponse.json({
      success: true,
      savedInDb,
      session: {
        sessionId,
        userId,
        topic,
        level,
        durationSeconds,
        turnCount,
        correctionsCount: corrections.length,
        summary,
        practiceRubricBand,
        savedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Speaking Coach Save Progress error:', error)
    return NextResponse.json(
      { error: 'Failed to record speaking progress' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const mongoose = await connectToDatabase().catch(() => null)
    if (!mongoose) {
      return NextResponse.json({
        success: true,
        sessions: [],
        offlineStorageNote: 'MongoDB is offline or not configured; local storage history active.',
      })
    }

    const sessions = await SpeakingSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    return NextResponse.json({
      success: true,
      sessions,
    })
  } catch (error) {
    console.error('Speaking Coach Get Progress error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve speaking history' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const mongoose = await connectToDatabase().catch(() => null)
    if (mongoose) {
      if (sessionId) {
        await SpeakingSession.deleteOne({ userId, sessionId })
      } else {
        await SpeakingSession.deleteMany({ userId })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Speaking session history deleted successfully',
    })
  } catch (error) {
    console.error('Speaking Coach Delete Progress error:', error)
    return NextResponse.json(
      { error: 'Failed to delete speaking history' },
      { status: 500 }
    )
  }
}
