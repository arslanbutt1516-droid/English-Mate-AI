export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface VocabWord {
  id: string
  word: string
  phonetic: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom' | 'phrasal_verb'
  definition: string
  urduMeaning: string
  urduPronunciation: string
  level: CEFRLevel
  exampleSentence: string
  exampleTranslation: string
  synonyms: string[]
  collocations: string[]
  category: 'daily' | 'business' | 'academic' | 'travel' | 'interview'
}

export interface GrammarLesson {
  id: string
  title: string
  urduTitle: string
  level: CEFRLevel
  category: string
  estimatedMinutes: number
  rule: string
  ruleUrdu: string
  formula: string
  examples: Array<{
    en: string
    ur: string
    highlight?: string
  }>
  commonMistakes: Array<{
    incorrect: string
    correct: string
    explanation: string
    explanationUrdu: string
  }>
  practiceQuestions: Array<{
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }>
}

export interface SpeakingScenario {
  id: string
  title: string
  urduTitle: string
  category: 'daily' | 'workplace' | 'travel' | 'interview' | 'social'
  level: CEFRLevel
  description: string
  dialogue: Array<{
    speaker: 'Partner' | 'User'
    text: string
    urdu: string
    suggestedResponses?: string[]
    audioTarget?: string
  }>
}

export interface ReadingArticle {
  id: string
  title: string
  urduTitle: string
  level: CEFRLevel
  category: string
  readTime: string
  content: string
  vocabularyHints: Array<{
    word: string
    meaning: string
    urdu: string
  }>
  quiz: Array<{
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }>
}

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'fill-blank' | 'reorder' | 'translate'
  prompt: string
  urduPrompt?: string
  options?: string[]
  answer: string | number
  explanation: string
  category: string
  level: CEFRLevel
}

export interface VoiceSettings {
  rate: number
  pitch: number
  accent: 'en-US' | 'en-GB' | 'en-AU'
}

export interface UserProgress {
  xp: number
  streakDays: number
  streakShields: number
  lastActiveDate: string
  level: CEFRLevel
  savedWordIds: string[]
  masteredWordIds: string[]
  completedLessons: string[]
  quizScores: Record<string, number>
  audioConfidenceScore: number
  voiceSettings: VoiceSettings
}
