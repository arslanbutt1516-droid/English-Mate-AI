import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message, mode, persona, history } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const geminiKey = process.env.GEMINI_API_KEY

    // If Gemini API Key is configured, execute live Google Gemini LLM completion
    if (geminiKey) {
      try {
        let systemPrompt = `You are EnglishMate AI, an expert English language coach helping learners who speak or understand Urdu. 
Current persona: ${persona || 'mentor'}.
If persona is 'oxford': use refined British English, classical academic vocabulary, and polite Oxford cadence.
If persona is 'silicon': focus on executive tech leadership, crisp corporate negotiation, and STAR method.
If persona is 'mentor': be warmly encouraging, provide simple examples, and always include bilingual Urdu explanations for difficult idioms or grammatical rules.

Analyze the user's message, provide a helpful and conversational answer, gently highlight any grammatical errors, and provide an Urdu explanation if helpful.
Format response in JSON with keys:
"reply": (string, markdown allowed)
"correction": (string or null, any grammatical correction)
"urduExplanation": (string, concise Urdu translation/explanation)`

        const apiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

        if (apiRes.ok) {
          const apiData = await apiRes.json()
          const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text
          if (rawText) {
            const parsed = JSON.parse(rawText)
            return NextResponse.json({
              reply: parsed.reply,
              correction: parsed.correction || null,
              urduExplanation: parsed.urduExplanation || '',
              timestamp: new Date().toISOString(),
            })
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to intelligent rule engine:', geminiError)
      }
    }

    // Intelligent Offline Pedagogic Rule-Based Fallback
    const lower = message.toLowerCase()
    let reply = ''
    let correction = null
    let urduExplanation = ''

    if (persona === 'oxford') {
      if (lower.includes('interview') || lower.includes('job')) {
        reply = `Splendid question regarding interview deportment. In high-calibre collegiate and professional settings, one ought to employ measured articulation. Rather than colloquially stating "I work hard," observe: "I pride myself upon methodological rigor and diligent stewardship of key deliverables."`
        urduExplanation = `آکسفورڈ اسلوب: عام الفاظ کی بجائے باوقار اور باضابطہ الفاظ کا انتخاب کریں تاکہ آپ کی گفتگو بااثر معلوم ہو۔`
      } else {
        reply = `Indeed. You have articulated your premise with notable lucidity. Might I recommend augmenting your lexicon with more elevated transitions, such as "furthermore", "in consequence thereof", or "predominantly"?`
        urduExplanation = `اپنے جملوں میں ربط پیدا کرنے کے لیے معیاری اور علمی کنیکٹرز استعمال کریں۔`
      }
    } else if (persona === 'silicon') {
      if (lower.includes('interview') || lower.includes('job') || lower.includes('strength')) {
        reply = `Here is how you nail this in modern tech leadership:
Use the STAR framework (Situation, Task, Action, Result). Quantify your impact. 
Instead of: "I fixed the bug,"
Say: "I identified the root cause of the latency degradation and deployed an optimized caching pipeline, cutting response time by 42%."`
        urduExplanation = `سلیکون ویلی کوچ: ہمیشہ ٹھوس اعداد و شمار بتائیں کہ آپ نے پرابلم کیسے حل کی اور کمپنی کے میٹرکس میں کیا بہتری آئی۔`
      } else {
        reply = `Direct and actionable! In executive business English, brevity is power. Cut filler phrases like "I just wanted to check" and lead with the value proposition.`
        urduExplanation = `کارپوریٹ گفتگو میں غیر ضروری الفاظ ہٹائیں اور براہِ راست اصل نکتے پر بات کریں۔`
      }
    } else {
      // Friendly Urdu-Bilingual Mentor
      if (lower.includes('present perfect') || lower.includes('have been') || lower.includes('has been')) {
        reply = `The Present Perfect tense connects the past to the present! We use it when an action occurred at an unspecified time in the past or has consequences right now.

Formula:
Subject + have / has + Past Participle (V3)

Examples:
• "I have visited London three times." (Life experience)
• "She has lost her keys." (The result matters right now: she cannot enter)`
        urduExplanation = `پریزنٹ پرفیکٹ ماضی اور حال کو جوڑتا ہے۔ جب کوئی کام ماضی میں مکمل ہوا ہو لیکن اس کا نتیجہ اب بھی موجود ہو، جیسے "میں کھانا کھا چکا ہوں" (I have eaten).`
      } else if (lower.includes('i am go') || lower.includes('he go') || lower.includes('she go')) {
        reply = `I noticed a small grammatical slip in your message! In English, we say:
• "He goes to work" (not "He go")
• "I am going" (not "I am go")

Remember that singular subjects (he, she, it) take an "-s" or "-es" in Present Simple.`
        correction = 'Subject-verb agreement: Use "goes" for he/she, or "am going" for present continuous.'
        urduExplanation = `یاد رکھیں: He اور She کے ساتھ ورب میں 's' یا 'es' کا اضافہ لازمی ہوتا ہے۔`
      } else {
        reply = `That is an excellent point! You expressed that very clearly. 

To make your English sound even more natural and confident, you could also phrase it like this:
"From my perspective, practicing daily conversation is the most effective way to gain fluency."

What topic would you like to discuss next? We can roleplay a job interview, practice ordering at a restaurant, or review grammar rules!`
        urduExplanation = `بہترین! اپنی انگریزی کو مزید پر اعتماد بنانے کے لیے روزانہ نئے الفاظ اور جملوں کے خاکے استعمال کریں۔`
      }
    }

    return NextResponse.json({
      reply,
      correction,
      urduExplanation,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json({ error: 'Failed to process AI chat' }, { status: 500 })
  }
}
