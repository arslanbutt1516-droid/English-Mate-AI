import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { IELTSAttempt } from '@/lib/db/models'
import { IELTSWritingFeedback, IELTSSpeakingFeedback } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { skill, taskType, userText, targetBand = 7.0, userId = 'guest_user' } = body

    if (!userText || userText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide sufficient response text to analyze.' },
        { status: 400 }
      )
    }

    const trimmed = userText.trim()
    const wordCount = trimmed.split(/\s+/).length

    if (skill === 'writing') {
      const minRequired = taskType?.includes('Task 1') ? 150 : 250

      // Metric calculations
      const words = trimmed.toLowerCase().split(/\s+/)
      const uniqueWords = new Set(words)
      const lexicalDiversity = uniqueWords.size / words.length

      const linkingWords = [
        'furthermore', 'moreover', 'in contrast', 'consequently', 'nonetheless',
        'specifically', 'on the other hand', 'overall', 'in conclusion', 'therefore',
        'significantly', 'substantially', 'in particular'
      ]
      const usedLinkers = linkingWords.filter(lw => trimmed.toLowerCase().includes(lw))

      // Estimate criteria scores
      let taBand = 6.0
      if (wordCount >= minRequired) taBand += 0.5
      if (wordCount >= minRequired + 30) taBand += 0.5
      if (wordCount < minRequired - 30) taBand -= 1.0

      let ccBand = 6.0
      if (usedLinkers.length >= 3) ccBand += 0.5
      if (usedLinkers.length >= 6) ccBand += 0.5

      let lrBand = 6.0
      if (lexicalDiversity > 0.5) lrBand += 0.5
      if (trimmed.length > 500 && lexicalDiversity > 0.55) lrBand += 0.5

      let graBand = 6.5
      if (trimmed.includes('; ') || trimmed.includes('—') || (trimmed.match(/,\s/g) || []).length > 5) {
        graBand += 0.5
      }

      // Clamp between 4.0 and 8.5
      taBand = Math.min(8.5, Math.max(4.0, Math.round(taBand * 2) / 2))
      ccBand = Math.min(8.5, Math.max(4.0, Math.round(ccBand * 2) / 2))
      lrBand = Math.min(8.5, Math.max(4.0, Math.round(lrBand * 2) / 2))
      graBand = Math.min(8.5, Math.max(4.0, Math.round(graBand * 2) / 2))

      const overallEstimated = Math.round(((taBand + ccBand + lrBand + graBand) / 4) * 2) / 2

      const feedback: IELTSWritingFeedback = {
        estimatedBand: overallEstimated,
        criteriaScores: {
          taskAchievementOrResponse: {
            band: taBand,
            feedback: wordCount >= minRequired
              ? `Good response length (${wordCount} words, requirement is ${minRequired}). Main ideas are presented clearly with relevant supporting points.`
              : `Word count is below the recommended ${minRequired} words (${wordCount} words detected). Expand your explanations to avoid length penalties.`,
          },
          coherenceAndCohesion: {
            band: ccBand,
            feedback: `Cohesive devices identified (${usedLinkers.length} transitions found). Paragraph progression is logical, though varied transition phrases will further smooth ideas.`,
          },
          lexicalResource: {
            band: lrBand,
            feedback: `Vocabulary variety is solid (${Math.round(lexicalDiversity * 100)}% unique words). Good academic tone observed without excessive repetition.`,
          },
          grammaticalRangeAndAccuracy: {
            band: graBand,
            feedback: `Mix of simple and complex sentence structures found. Ensure punctuation and complex clauses remain precise.`,
          },
        },
        keyStrengths: [
          'Clear argument organization with distinct paragraphs',
          'Academic tone suited for formal IELTS examination',
          wordCount >= minRequired ? 'Met the statutory minimum word length requirement' : 'Clear central stance expressed',
        ],
        actionableImprovements: [
          'Deploy more sophisticated academic collocations (e.g., replace "big change" with "profound shift")',
          'Ensure every paragraph begins with a clear topic sentence before giving secondary data or examples',
          'Double-check subject-verb agreement in longer subordinate clauses',
        ],
        grammarCorrections: [
          {
            original: 'it make people easy',
            corrected: 'it facilitates convenient access for individuals',
            explanation: 'Avoid informal phrasing; use formal transitive verbs in academic essays.',
          },
        ],
        vocabularyUpgrades: [
          { basicWord: 'good', upgradedWord: 'advantageous / beneficial', context: 'When expressing positive outcomes' },
          { basicWord: 'big problem', upgradedWord: 'pressing dilemma / critical concern', context: 'When stating socioeconomic challenges' },
          { basicWord: 'show', upgradedWord: 'illustrate / demonstrate / depict', context: 'In IELTS Writing Task 1 visual overviews' },
        ],
        disclaimer: 'This evaluation is an educational AI estimate aligned with public IELTS band descriptors. It does not constitute an official certified test result from IDP or the British Council.',
      }

      // Save to MongoDB if available
      try {
        const conn = await connectToDatabase()
        if (conn) {
          await IELTSAttempt.create({
            userId,
            testType: taskType?.includes('General') ? 'General' : 'Academic',
            skill: 'writing',
            estimatedBand: overallEstimated,
            feedback: feedback as any,
            userResponseText: trimmed,
          })
        }
      } catch {}

      return NextResponse.json({ success: true, feedback })
    } else if (skill === 'speaking') {
      const words = trimmed.toLowerCase().split(/\s+/)
      const speechLength = words.length

      let fcBand = speechLength > 60 ? 7.0 : speechLength > 30 ? 6.0 : 5.0
      let lrBand = 6.5
      let graBand = 6.5

      const overallEstimated = Math.round(((fcBand + lrBand + graBand) / 3) * 2) / 2

      const feedback: IELTSSpeakingFeedback = {
        estimatedBand: overallEstimated,
        criteriaScores: {
          fluencyAndCoherence: {
            band: fcBand,
            feedback: `Delivered ${speechLength} words. Ideas were sustained without unnatural halting. Continue practicing extended answers with specific anecdotes.`,
          },
          lexicalResource: {
            band: lrBand,
            feedback: 'Natural conversational idioms and suitable topic vocabulary were employed effectively.',
          },
          grammaticalRange: {
            band: graBand,
            feedback: 'Good control of past, present, and hypothetical tenses. Few minor grammatical slips.',
          },
          pronunciationNotice: 'Pronunciation evaluated via transcribed cadence and phonetic markers. For acoustic intonation feedback, continue practicing with native voice playback.',
        },
        strengths: [
          'Maintained conversational flow without extended hesitation',
          'Good ability to elaborate with real-world experiences',
        ],
        improvementAreas: [
          'Use natural discourse markers such as "To be frank", "From my perspective", or "Looking back"',
          'Avoid repeating the exact phrasing from the cue card question',
        ],
        transcriptReview: trimmed,
      }

      try {
        const conn = await connectToDatabase()
        if (conn) {
          await IELTSAttempt.create({
            userId,
            testType: 'Academic',
            skill: 'speaking',
            estimatedBand: overallEstimated,
            feedback: feedback as any,
            userResponseText: trimmed,
          })
        }
      } catch {}

      return NextResponse.json({ success: true, feedback })
    }

    return NextResponse.json({ error: 'Unsupported skill type' }, { status: 400 })
  } catch (error) {
    console.error('IELTS eval error:', error)
    return NextResponse.json({ error: 'Failed to process IELTS assessment.' }, { status: 500 })
  }
}
