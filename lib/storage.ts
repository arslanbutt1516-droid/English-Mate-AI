'use client'
import { UserProgress, VoiceSettings } from './types'

const STORAGE_KEY = 'englishmate_user_progress'

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  rate: 0.95,
  pitch: 1.0,
  accent: 'en-US',
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
  xp: 340,
  streakDays: 4,
  streakShields: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  level: 'B1',
  savedWordIds: ['v1', 'v3'],
  masteredWordIds: ['v1'],
  completedLessons: ['g1'],
  quizScores: { general_diagnostic: 85 },
  audioConfidenceScore: 78,
  voiceSettings: DEFAULT_VOICE_SETTINGS,
}

export function getUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_USER_PROGRESS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER_PROGRESS))
      return DEFAULT_USER_PROGRESS
    }
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_USER_PROGRESS,
      ...parsed,
      voiceSettings: {
        ...DEFAULT_VOICE_SETTINGS,
        ...(parsed.voiceSettings || {}),
      },
    }
  } catch {
    return DEFAULT_USER_PROGRESS
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (err) {
    console.error('Failed to save progress to localStorage', err)
  }
}

export function addXP(amount: number): UserProgress {
  const current = getUserProgress()
  const updated = { ...current, xp: current.xp + amount }
  saveUserProgress(updated)
  return updated
}

export function toggleSavedWord(wordId: string): { isSaved: boolean; progress: UserProgress } {
  const current = getUserProgress()
  const exists = current.savedWordIds.includes(wordId)
  const savedWordIds = exists
    ? current.savedWordIds.filter((id) => id !== wordId)
    : [...current.savedWordIds, wordId]
  const updated = { ...current, savedWordIds }
  saveUserProgress(updated)
  return { isSaved: !exists, progress: updated }
}

export function toggleMasteredWord(wordId: string): { isMastered: boolean; progress: UserProgress } {
  const current = getUserProgress()
  const exists = current.masteredWordIds.includes(wordId)
  const masteredWordIds = exists
    ? current.masteredWordIds.filter((id) => id !== wordId)
    : [...current.masteredWordIds, wordId]
  const updated = {
    ...current,
    masteredWordIds,
    xp: exists ? current.xp : current.xp + 25,
  }
  saveUserProgress(updated)
  return { isMastered: !exists, progress: updated }
}

export function markLessonComplete(lessonId: string): UserProgress {
  const current = getUserProgress()
  if (!current.completedLessons.includes(lessonId)) {
    const updated = {
      ...current,
      completedLessons: [...current.completedLessons, lessonId],
      xp: current.xp + 50,
    }
    saveUserProgress(updated)
    return updated
  }
  return current
}

export function updateVoiceSettings(settings: Partial<VoiceSettings>): UserProgress {
  const current = getUserProgress()
  const updated = {
    ...current,
    voiceSettings: { ...current.voiceSettings, ...settings },
  }
  saveUserProgress(updated)
  return updated
}

export function activateStreakShield(): { success: boolean; progress: UserProgress } {
  const current = getUserProgress()
  if (current.xp >= 100) {
    const updated = {
      ...current,
      xp: current.xp - 100,
      streakShields: current.streakShields + 1,
    }
    saveUserProgress(updated)
    return { success: true, progress: updated }
  }
  return { success: false, progress: current }
}

export function playTTS(
  text: string,
  customRate?: number,
  customPitch?: number,
  customAccent?: string
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()

  const progress = getUserProgress()
  const utterance = new SpeechSynthesisUtterance(text)

  utterance.lang = customAccent || progress.voiceSettings.accent || 'en-US'
  utterance.rate = customRate ?? progress.voiceSettings.rate ?? 0.95
  utterance.pitch = customPitch ?? progress.voiceSettings.pitch ?? 1.0

  window.speechSynthesis.speak(utterance)
}
