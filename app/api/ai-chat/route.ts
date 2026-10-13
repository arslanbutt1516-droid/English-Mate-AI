import { NextResponse } from 'next/server'

// Intelligent rule-based fallback engine - always returns a valid response
function getRuleBasedResponse(message: string, persona: string): {
  reply: string
  correction: string | null
  urduExplanation: string
} {
  const lower = message.toLowerCase()
  let reply = ''
  let correction: string | null = null
  let urduExplanation = ''

  if (persona === 'oxford') {
    if (lower.includes('interview') || lower.includes('job')) {
      reply = `Splendid question regarding interview deportment. In high-calibre collegiate and professional settings, one ought to employ measured articulation. Rather than colloquially stating "I work hard," observe: "I pride myself upon methodological rigor and diligent stewardship of key deliverables."`
      urduExplanation = `آکسفورڈ اسلوب: عام الفاظ کی بجائے باوقار اور باضابطہ الفاظ کا انتخاب کریں تاکہ آپ کی گفتگو بااثر معلوم ہو۔`
    } else if (lower.includes('grammar') || lower.includes('tense')) {
      reply = `An admirable enquiry into grammatical precision. In the Oxford tradition, one must master the subjunctive mood, the distinction between "shall" and "will", and the proper deployment of the passive voice for formal correspondence.`
      urduExplanation = `آکسفورڈ انگریزی میں گرامر کی درستگی انتہائی اہم ہے۔ باضابطہ تحریر میں غیر فعالی جملے زیادہ مؤثر ہوتے ہیں۔`
    } else {
      reply = `Indeed. You have articulated your premise with notable lucidity. Might I recommend augmenting your lexicon with more elevated transitions, such as "furthermore", "in consequence thereof", or "predominantly"?`
      urduExplanation = `اپنے جملوں میں ربط پیدا کرنے کے لیے معیاری اور علمی کنیکٹرز استعمال کریں۔`
    }
  } else if (persona === 'silicon') {
    if (lower.includes('interview') || lower.includes('job') || lower.includes('strength')) {
      reply = `Here is how you nail this in modern tech leadership:\nUse the STAR framework (Situation, Task, Action, Result). Quantify your impact. \nInstead of: "I fixed the bug,"\nSay: "I identified the root cause of the latency degradation and deployed an optimized caching pipeline, cutting response time by 42%."`
      urduExplanation = `سلیکون ویلی کوچ: ہمیشہ ٹھوس اعداد و شمار بتائیں کہ آپ نے پرابلم کیسے حل کی اور کمپنی کے میٹرکس میں کیا بہتری آئی۔`
    } else if (lower.includes('email') || lower.includes('message') || lower.includes('write')) {
      reply = `In professional tech communication, lead with the outcome first. Structure: Action Required → Context → Deadline.\n\nExample: "Need your approval on the API spec by Friday EOD. Attached the updated doc. Key change: auth flow now uses OAuth 2.0."`
      urduExplanation = `پیشہ ورانہ ای میل میں پہلے نتیجہ بتائیں، پھر تفصیل۔ وقت کی قدر کریں اور مختصر لکھیں۔`
    } else {
      reply = `Direct and actionable! In executive business English, brevity is power. Cut filler phrases like "I just wanted to check" and lead with the value proposition.`
      urduExplanation = `کارپوریٹ گفتگو میں غیر ضروری الفاظ ہٹائیں اور براہِ راست اصل نکتے پر بات کریں۔`
    }
  } else {
    // Friendly Urdu-Bilingual Mentor
    if (lower.includes('present perfect') || lower.includes('have been') || lower.includes('has been')) {
      reply = `The Present Perfect tense connects the past to the present! We use it when an action occurred at an unspecified time in the past or has consequences right now.\n\nFormula:\nSubject + have / has + Past Participle (V3)\n\nExamples:\n• "I have visited London three times." (Life experience)\n• "She has lost her keys." (The result matters right now: she cannot enter)`
      urduExplanation = `پریزنٹ پرفیکٹ ماضی اور حال کو جوڑتا ہے۔ جب کوئی کام ماضی میں مکمل ہوا ہو لیکن اس کا نتیجہ اب بھی موجود ہو، جیسے "میں کھانا کھا چکا ہوں" (I have eaten).`
    } else if (lower.includes('past simple') || lower.includes('past tense') || lower.includes('yesterday') || lower.includes('ago')) {
      reply = `The Past Simple tense is used for completed actions at a specific time in the past.\n\nFormula:\nSubject + Verb (V2 / Past form)\n\nExamples:\n• "I went to the market yesterday."\n• "She called me an hour ago."\n• "They finished the project last week."`
      urduExplanation = `ماضی مطلق: جو کام مکمل طور پر ختم ہو چکا ہو اس کے لیے استعمال ہوتا ہے۔ اردو میں "کیا، گئی، آیا" جیسے الفاظ ماضی مطلق کو ظاہر کرتے ہیں۔`
    } else if (lower.includes('i am go') || lower.includes('he go') || lower.includes('she go')) {
      reply = `I noticed a small grammatical slip in your message! In English, we say:\n• "He goes to work" (not "He go")\n• "I am going" (not "I am go")\n\nRemember that singular subjects (he, she, it) take an "-s" or "-es" in Present Simple.`
      correction = 'Subject-verb agreement: Use "goes" for he/she, or "am going" for present continuous.'
      urduExplanation = `یاد رکھیں: He اور She کے ساتھ ورب میں 's' یا 'es' کا اضافہ لازمی ہوتا ہے۔`
    } else if (lower.includes('preposition') || lower.includes('at') || lower.includes('in') || lower.includes('on')) {
      reply = `Prepositions of time — a common challenge! Here is a quick guide:\n\n• IN: months, years, seasons → "in January", "in 2024", "in summer"\n• ON: specific days and dates → "on Monday", "on 5th April"\n• AT: specific times and clock times → "at 9am", "at noon", "at night"`
      urduExplanation = `حروف جار (Prepositions) انگریزی کا مشکل حصہ ہیں۔ IN مہینوں اور سالوں کے لیے، ON مخصوص دنوں کے لیے، اور AT مخصوص اوقات کے لیے استعمال ہوتا ہے۔`
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('salam') || lower.includes('السلام')) {
      reply = `Hello! Welcome back to your English learning journey! 🌟\n\nI am your AI English Coach. Today we can practice:\n• 💬 Daily conversation skills\n• 📝 Grammar rules with Urdu explanations\n• 🎤 Job interview preparation\n• ✏️ Sentence correction\n\nWhat would you like to work on today?`
      urduExplanation = `السلام علیکم! آپ کا انگریزی سیکھنے کا سفر جاری ہے۔ آج ہم گفتگو، گرامر یا انٹرویو کی تیاری کر سکتے ہیں۔`
    } else {
      reply = `That is an excellent point! You expressed that very clearly. \n\nTo make your English sound even more natural and confident, you could also phrase it like this:\n"From my perspective, practicing daily conversation is the most effective way to gain fluency."\n\nWhat topic would you like to discuss next? We can roleplay a job interview, practice ordering at a restaurant, or review grammar rules!`
      urduExplanation = `بہترین! اپنی انگریزی کو مزید پر اعتماد بنانے کے لیے روزانہ نئے الفاظ اور جملوں کے خاکے استعمال کریں۔`
    }
  }

  return { reply, correction, urduExplanation }
}

export async function POST(req: Request) {
  try {
    const { message, mode, persona, history } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const geminiKey = process.env.GEMINI_API_KEY

    // If Gemini API Key is configured, attempt live Google Gemini LLM completion
    if (geminiKey) {
      try {
        const systemPrompt = `You are EnglishMate AI, an expert English language coach helping learners who speak or understand Urdu. 
Current persona: ${persona || 'mentor'}.
If persona is 'oxford': use refined British English, classical academic vocabulary, and polite Oxford cadence.
If persona is 'silicon': focus on executive tech leadership, crisp corporate negotiation, and STAR method.
If persona is 'mentor': be warmly encouraging, provide simple examples, and always include bilingual Urdu explanations for difficult idioms or grammatical rules.

Analyze the user's message, provide a helpful and conversational answer, gently highlight any grammatical errors, and provide an Urdu explanation if helpful.
Format response in JSON with keys:
"reply": (string, markdown allowed)
"correction": (string or null, any grammatical correction)
"urduExplanation": (string, concise Urdu translation/explanation)`

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const apiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nUser Message: "${message}"` }],
                },
              ],
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
                return NextResponse.json({
                  reply: parsed.reply,
                  correction: parsed.correction || null,
                  urduExplanation: parsed.urduExplanation || '',
                  timestamp: new Date().toISOString(),
                })
              }
            } catch {
              // JSON parse failed, fall through to rule-based engine
            }
          }
        }
        // If API returned non-ok status (e.g., 503 overloaded), fall through silently
      } catch (geminiError) {
        // Network error, timeout, or overload — fall through to rule-based engine
        console.warn('Gemini API unavailable, using rule-based engine:', (geminiError as Error).message)
      }
    }

    // Intelligent Offline Pedagogic Rule-Based Fallback
    // Always returns a valid, educational response
    const { reply, correction, urduExplanation } = getRuleBasedResponse(message, persona || 'mentor')

    return NextResponse.json({
      reply,
      correction,
      urduExplanation,
      timestamp: new Date().toISOString(),
      offline: !geminiKey, // hint to client that AI engine was offline
    })
  } catch (error) {
    console.error('AI Chat Error:', error)
    // Return a graceful fallback instead of a 500 error
    return NextResponse.json({
      reply: 'I am having trouble connecting right now. Please try again in a moment, or feel free to ask a grammar question and I will do my best to help!',
      correction: null,
      urduExplanation: 'ابھی کنیکشن میں مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں۔',
      timestamp: new Date().toISOString(),
    })
  }
}
