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
  ieltsTargetBand?: number
  ieltsTestType?: 'Academic' | 'General'
  daily10CompletedDates?: string[]
}

/* =====================================================
   MODULE 1: IELTS PREPARATION TYPES
   ===================================================== */
export type IELTSTestType = 'Academic' | 'General'
export type IELTSSkill = 'listening' | 'reading' | 'writing' | 'speaking'

export interface IELTSPreferences {
  testType: IELTSTestType
  targetBand: number
  currentLevel: CEFRLevel
  studyDurationDays: 7 | 14 | 30 | 60 | 90
  dailyMinutes: number
  examDate?: string
}

export interface IELTSQuestion {
  id: string
  questionNumber: number
  type: 'multiple-choice' | 'form-completion' | 'note-completion' | 'sentence-completion' | 'true-false-not-given' | 'yes-no-not-given' | 'matching-headings' | 'short-answer'
  prompt: string
  options?: string[]
  correctAnswer: string
  acceptableAnswers?: string[]
  explanation: string
  evidenceSnippet?: string
}

export interface IELTSListeningSection {
  id: string
  sectionNumber: 1 | 2 | 3 | 4
  title: string
  description: string
  accent: 'British' | 'Australian' | 'American' | 'International'
  audioScript: string
  audioVoiceType: 'dialogue' | 'monologue'
  questions: IELTSQuestion[]
}

export interface IELTSReadingPassage {
  id: string
  testType: IELTSTestType
  passageNumber: 1 | 2 | 3
  title: string
  urduTitle: string
  topic: string
  estimatedMinutes: number
  passageText: string
  questions: IELTSQuestion[]
  vocabularyList: Array<{ word: string; meaning: string; urdu: string }>
}

export interface IELTSWritingPrompt {
  id: string
  taskType: 'Task 1 Academic' | 'Task 1 General' | 'Task 2 Essay'
  prompt: string
  chartType?: 'Bar Chart' | 'Line Graph' | 'Pie Chart' | 'Process' | 'Map'
  letterType?: 'Formal' | 'Semi-Formal' | 'Informal'
  essayType?: 'Opinion' | 'Discussion' | 'Advantage-Disadvantage' | 'Problem-Solution' | 'Two-Part'
  instructions: string[]
  minWords: number
  suggestedMinutes: number
  sampleAnswerBand8: string
  keyVocabTips: string[]
}

export interface IELTSWritingFeedback {
  estimatedBand: number
  criteriaScores: {
    taskAchievementOrResponse: { band: number; feedback: string }
    coherenceAndCohesion: { band: number; feedback: string }
    lexicalResource: { band: number; feedback: string }
    grammaticalRangeAndAccuracy: { band: number; feedback: string }
  }
  keyStrengths: string[]
  actionableImprovements: string[]
  grammarCorrections: Array<{ original: string; corrected: string; explanation: string }>
  vocabularyUpgrades: Array<{ basicWord: string; upgradedWord: string; context: string }>
  disclaimer: string
}

export interface IELTSSpeakingPrompt {
  id: string
  part: 1 | 2 | 3
  topic: string
  questions?: string[]
  cueCard?: {
    topic: string
    bulletPoints: string[]
    followUpQuestion: string
  }
  usefulPhrases: string[]
  sampleAnswer: string
}

export interface IELTSSpeakingFeedback {
  estimatedBand: number
  criteriaScores: {
    fluencyAndCoherence: { band: number; feedback: string }
    lexicalResource: { band: number; feedback: string }
    grammaticalRange: { band: number; feedback: string }
    pronunciationNotice: string
  }
  strengths: string[]
  improvementAreas: string[]
  transcriptReview: string
}

/* =====================================================
   MODULE 2: DAILY 10 VOCABULARY WORDS TYPES
   ===================================================== */
export interface DailyWord {
  id: string
  word: string
  meaning: string
  urduMeaning: string
  phonetic: string
  pronunciationGuide: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom' | 'phrasal_verb'
  exampleSentence: string
  exampleTranslation: string
  practicalUsageTip: string
  synonyms: string[]
  antonyms?: string[]
  category: 'daily' | 'business' | 'academic' | 'ielts' | 'interview'
  level: CEFRLevel
}

export interface DailyWordSet {
  id: string
  dateString: string // YYYY-MM-DD in user's timezone
  timeZone: string
  words: DailyWord[]
  completedWordIds: string[]
  difficultWordIds: string[]
  quizScore?: {
    score: number
    total: number
    completedAt: string
  }
}

/* =====================================================
   MODULE 3: 3D AI CLASSROOM TYPES
   ===================================================== */
export type ClassroomMode = 'teacher' | 'mentor' | 'student'

export interface WhiteboardContent {
  headline: string
  topic: string
  conceptFormula?: string
  bulletPoints: string[]
  exampleSentences: Array<{ en: string; ur: string; highlight?: string }>
  timelineOrDiagram?: {
    title: string
    steps: Array<{ label: string; detail: string; status?: 'past' | 'present' | 'future' }>
  }
  grammarTipUrdu: string
  interactiveQuestion?: {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }
}

export interface ClassroomLesson {
  id: string
  title: string
  urduTitle: string
  category: 'grammar' | 'vocabulary' | 'ielts' | 'speaking' | 'interview'
  level: CEFRLevel
  teacherAvatarMood: 'greeting' | 'explaining' | 'pointing' | 'encouraging' | 'celebrating'
  speechText: string
  speechUrdu: string
  whiteboard: WhiteboardContent
  visualKeyword?: 'apple' | 'walk' | 'clock' | 'workplace' | 'timeline' | 'dialogue' | 'books'
}

/* =====================================================
   MODULE 4: REAL-TIME AI SPEAKING COACH TYPES
   ===================================================== */
export type SpeakingCoachTopic =
  | 'daily'
  | 'workplace'
  | 'interview'
  | 'ielts'
  | 'friend'
  | 'grammar'

export type SpeakingCoachSessionState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'interrupted'
  | 'paused'
  | 'error'
  | 'ended'

export interface SpeakingCorrection {
  original: string
  improved: string
  explanation: string
  explanationUrdu?: string
}

export interface SpeakingCoachMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  corrections?: SpeakingCorrection[]
  urduExplanation?: string
  followUpQuestion?: string
  timestamp: string
  isInterim?: boolean
}

export interface SpeakingCoachSessionSummary {
  id: string
  sessionId: string
  userId: string
  topic: SpeakingCoachTopic
  level: CEFRLevel
  durationSeconds: number
  turnCount: number
  corrections: SpeakingCorrection[]
  summary: string
  recurringGrammarTopics?: string[]
  practiceRubricBand?: number
  createdAt: string
}

