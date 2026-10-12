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
