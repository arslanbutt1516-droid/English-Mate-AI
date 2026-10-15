import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  passwordHash?: string
  nativeLanguage: string
  urduSupport: boolean
  level: string
  goal: string
  dailyTime: number
  xp: number
  streakDays: number
  streakShields: number
  savedWordIds: string[]
  masteredWordIds: string[]
  completedLessons: string[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String },
    nativeLanguage: { type: String, default: 'Urdu' },
    urduSupport: { type: Boolean, default: true },
    level: { type: String, default: 'B1' },
    goal: { type: String, default: 'career' },
    dailyTime: { type: Number, default: 15 },
    xp: { type: Number, default: 340 },
    streakDays: { type: Number, default: 4 },
    streakShields: { type: Number, default: 1 },
    savedWordIds: { type: [String], default: ['v1', 'v3'] },
    masteredWordIds: { type: [String], default: ['v1'] },
    completedLessons: { type: [String], default: ['g1'] },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

/* =====================================================
   Daily Vocabulary Set (10 words per user per local date)
   ===================================================== */
export interface IDailyVocabularySet extends Document {
  userId: string
  dateString: string // YYYY-MM-DD
  timeZone: string
  words: Array<{
    id: string
    word: string
    meaning: string
    urduMeaning: string
    phonetic: string
    pronunciationGuide: string
    partOfSpeech: string
    exampleSentence: string
    exampleTranslation: string
    practicalUsageTip: string
    synonyms: string[]
    antonyms?: string[]
    category: string
    level: string
  }>
  completedWordIds: string[]
  difficultWordIds: string[]
  quizScore?: {
    score: number
    total: number
    completedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

const DailyVocabularySetSchema = new Schema<IDailyVocabularySet>(
  {
    userId: { type: String, required: true, index: true },
    dateString: { type: String, required: true },
    timeZone: { type: String, default: 'Asia/Karachi' },
    words: { type: Array as any, required: true },
    completedWordIds: { type: [String], default: [] },
    difficultWordIds: { type: [String], default: [] },
    quizScore: {
      score: { type: Number },
      total: { type: Number },
      completedAt: { type: Date },
    },
  },
  { timestamps: true }
)

// Compound unique index ensuring exactly one canonical set per user per date
DailyVocabularySetSchema.index({ userId: 1, dateString: 1 }, { unique: true })

export const DailyVocabularySet: Model<IDailyVocabularySet> =
  mongoose.models.DailyVocabularySet ||
  mongoose.model<IDailyVocabularySet>('DailyVocabularySet', DailyVocabularySetSchema)

/* =====================================================
   IELTS Preparation Profile & Preferences
   ===================================================== */
export interface IIELTSProfile extends Document {
  userId: string
  testType: 'Academic' | 'General'
  targetBand: number
  currentLevel: string
  studyDurationDays: number
  dailyMinutes: number
  examDate?: string
  weakAreas: string[]
  completedMockTests: number
  readinessScore: number
  createdAt: Date
  updatedAt: Date
}

const IELTSProfileSchema = new Schema<IIELTSProfile>(
  {
    userId: { type: String, required: true, unique: true },
    testType: { type: String, enum: ['Academic', 'General'], default: 'Academic' },
    targetBand: { type: Number, default: 7.5 },
    currentLevel: { type: String, default: 'B1' },
    studyDurationDays: { type: Number, default: 30 },
    dailyMinutes: { type: Number, default: 45 },
    examDate: { type: String },
    weakAreas: { type: [String], default: ['Writing Task 2', 'Listening Section 4'] },
    completedMockTests: { type: Number, default: 0 },
    readinessScore: { type: Number, default: 48 },
  },
  { timestamps: true }
)

export const IELTSProfile: Model<IIELTSProfile> =
  mongoose.models.IELTSProfile ||
  mongoose.model<IIELTSProfile>('IELTSProfile', IELTSProfileSchema)

/* =====================================================
   IELTS Practice & Mock Attempt
   ===================================================== */
export interface IIELTSAttempt extends Document {
  userId: string
  testType: 'Academic' | 'General'
  skill: 'listening' | 'reading' | 'writing' | 'speaking' | 'full-mock'
  score?: number
  rawTotal?: number
  estimatedBand: number
  feedback?: any
  userResponseText?: string
  createdAt: Date
}

const IELTSAttemptSchema = new Schema<IIELTSAttempt>(
  {
    userId: { type: String, required: true, index: true },
    testType: { type: String, enum: ['Academic', 'General'], required: true },
    skill: { type: String, required: true },
    score: { type: Number },
    rawTotal: { type: Number },
    estimatedBand: { type: Number, required: true },
    feedback: { type: Schema.Types.Mixed },
    userResponseText: { type: String },
  },
  { timestamps: true }
)

export const IELTSAttempt: Model<IIELTSAttempt> =
  mongoose.models.IELTSAttempt ||
  mongoose.model<IIELTSAttempt>('IELTSAttempt', IELTSAttemptSchema)

/* =====================================================
   AI Speaking Coach Session Summary
   ===================================================== */
export interface ISpeakingSession extends Document {
  userId: string
  sessionId: string
  topic: string
  level: string
  durationSeconds: number
  turnCount: number
  corrections: Array<{
    original: string
    improved: string
    explanation: string
    explanationUrdu?: string
  }>
  summary: string
  recurringGrammarTopics?: string[]
  practiceRubricBand?: number
  createdAt: Date
}

const SpeakingSessionSchema = new Schema<ISpeakingSession>(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true },
    topic: { type: String, required: true },
    level: { type: String, default: 'B1' },
    durationSeconds: { type: Number, default: 0 },
    turnCount: { type: Number, default: 0 },
    corrections: { type: Array as any, default: [] },
    summary: { type: String, default: '' },
    recurringGrammarTopics: { type: [String], default: [] },
    practiceRubricBand: { type: Number },
  },
  { timestamps: true }
)

export const SpeakingSession: Model<ISpeakingSession> =
  mongoose.models.SpeakingSession ||
  mongoose.model<ISpeakingSession>('SpeakingSession', SpeakingSessionSchema)


