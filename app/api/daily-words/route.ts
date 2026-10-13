import { NextRequest, NextResponse } from 'next/server'
import { getLocalDateString, DEFAULT_TIMEZONE } from '@/lib/dateUtils'
import { getDaily10WordsForDate } from '@/lib/data/daily10Pool'
import { connectToDatabase } from '@/lib/db/mongodb'
import { DailyVocabularySet } from '@/lib/db/models'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const timeZone = searchParams.get('timeZone') || DEFAULT_TIMEZONE
    const requestedDate = searchParams.get('date') // optional historical date
    const userId = searchParams.get('userId') || 'guest_user'

    // Server-side calculation of the user's local calendar date
    const dateString = requestedDate || getLocalDateString(timeZone)

    // Connect to MongoDB if available
    let dbConnected = false
    try {
      const conn = await connectToDatabase()
      dbConnected = !!conn
    } catch {
      dbConnected = false
    }

    if (dbConnected) {
      // Look up existing set for this user & date
      let existingSet = await DailyVocabularySet.findOne({ userId, dateString })

      if (!existingSet) {
        // Deterministically generate exactly 10 words for this calendar date
        const words = getDaily10WordsForDate(dateString)

        try {
          // Concurrency-safe atomic upsert to prevent race conditions across multiple tabs
          existingSet = await DailyVocabularySet.findOneAndUpdate(
            { userId, dateString },
            {
              $setOnInsert: {
                userId,
                dateString,
                timeZone,
                words,
                completedWordIds: [],
                difficultWordIds: [],
              },
            },
            { upsert: true, new: true }
          )
        } catch {
          // Fallback if concurrent insert collided
          existingSet = await DailyVocabularySet.findOne({ userId, dateString })
        }
      }

      return NextResponse.json({
        success: true,
        dateString,
        timeZone,
        words: existingSet?.words || getDaily10WordsForDate(dateString),
        completedWordIds: existingSet?.completedWordIds || [],
        difficultWordIds: existingSet?.difficultWordIds || [],
        quizScore: existingSet?.quizScore || null,
        source: 'database',
      })
    }

    // In-memory / stateless fallback (e.g. offline or no MongoDB connection)
    const words = getDaily10WordsForDate(dateString)
    return NextResponse.json({
      success: true,
      dateString,
      timeZone,
      words,
      completedWordIds: [],
      difficultWordIds: [],
      quizScore: null,
      source: 'deterministic_engine',
    })
  } catch (error) {
    console.error('Daily words API error:', error)
    const fallbackDate = getLocalDateString(DEFAULT_TIMEZONE)
    return NextResponse.json({
      success: true,
      dateString: fallbackDate,
      timeZone: DEFAULT_TIMEZONE,
      words: getDaily10WordsForDate(fallbackDate),
      completedWordIds: [],
      difficultWordIds: [],
      quizScore: null,
      source: 'safe_fallback',
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId = 'guest_user', dateString, wordId, action, quizResult, timeZone = DEFAULT_TIMEZONE } = body

    if (!dateString) {
      return NextResponse.json({ error: 'dateString is required' }, { status: 400 })
    }

    let dbConnected = false
    try {
      const conn = await connectToDatabase()
      dbConnected = !!conn
    } catch {
      dbConnected = false
    }

    if (dbConnected) {
      const updateQuery: any = {}

      if (action === 'complete' && wordId) {
        updateQuery.$addToSet = { completedWordIds: wordId }
      } else if (action === 'difficult' && wordId) {
        updateQuery.$addToSet = { difficultWordIds: wordId }
      } else if (action === 'quiz' && quizResult) {
        updateQuery.$set = {
          quizScore: {
            score: quizResult.score,
            total: quizResult.total,
            completedAt: new Date(),
          },
        }
      }

      const updated = await DailyVocabularySet.findOneAndUpdate(
        { userId, dateString },
        updateQuery,
        { new: true, upsert: true }
      )

      return NextResponse.json({
        success: true,
        completedWordIds: updated.completedWordIds,
        difficultWordIds: updated.difficultWordIds,
        quizScore: updated.quizScore,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Acknowledged in offline mode',
    })
  } catch (error) {
    console.error('Update daily words error:', error)
    return NextResponse.json({ error: 'Failed to update daily word progress' }, { status: 500 })
  }
}
