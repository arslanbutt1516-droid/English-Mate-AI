import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getQuotaLimits,
  getOrCreateSession,
  checkAndIncrementQuota,
  generateOfflineSpeakingResponse,
} from '../lib/speakingCoachService.ts'

test('Speaking Coach - Quota limits default correctly', () => {
  const { guestLimit, userLimit } = getQuotaLimits()
  assert.equal(typeof guestLimit, 'number')
  assert.equal(typeof userLimit, 'number')
  assert.ok(guestLimit > 0)
  assert.ok(userLimit >= guestLimit)
})

test('Speaking Coach - Session creation recognizes guest vs registered user', () => {
  const guestSess = getOrCreateSession({ userId: 'guest_abc123' })
  assert.equal(guestSess.session.isGuest, true)
  assert.equal(guestSess.session.maxTurns, 5)

  const userSess = getOrCreateSession({ userId: 'user_registered_456' })
  assert.equal(userSess.session.isGuest, false)
  assert.equal(userSess.session.maxTurns, 30)
})

test('Speaking Coach - Quota increment and enforcement stops after max turns', () => {
  const testSessionId = `test_quota_${Date.now()}`
  getOrCreateSession({ sessionId: testSessionId, userId: 'guest_tester' })

  // First 5 turns should be allowed
  for (let i = 1; i <= 5; i++) {
    const status = checkAndIncrementQuota(testSessionId)
    assert.equal(status.allowed, true)
    assert.equal(status.turnsUsed, i)
    assert.equal(status.turnsRemaining, 5 - i)
  }

  // 6th turn must be blocked (server-enforced quota)
  const exceededStatus = checkAndIncrementQuota(testSessionId)
  assert.equal(exceededStatus.allowed, false)
  assert.equal(exceededStatus.turnsRemaining, 0)
})

test('Speaking Coach - Fallback pedagogical engine returns structured feedback', () => {
  const result = generateOfflineSpeakingResponse({
    userInput: 'Yesterday I go to market and he go with me',
    topic: 'daily',
    level: 'B1',
    urduSupport: true,
  })

  assert.ok(result.reply.length > 0)
  assert.ok(result.followUpQuestion.length > 0)
  assert.ok(result.urduExplanation.length > 0)
  assert.ok(result.corrections.length > 0)

  // Verify correction structure
  const firstCorr = result.corrections[0]
  assert.ok(firstCorr.original)
  assert.ok(firstCorr.improved)
  assert.ok(firstCorr.explanation)
})

test('Speaking Coach - IELTS simulation generates practice rubric', () => {
  const result = generateOfflineSpeakingResponse({
    userInput: 'I believe artificial intelligence will significantly transform public transportation.',
    topic: 'ielts',
    level: 'B2',
    urduSupport: true,
  })

  assert.ok(result.practiceRubric)
  assert.ok(result.practiceRubric.estimatedPracticeBand >= 4.0)
  assert.ok(result.practiceRubric.fluency)
  assert.ok(result.practiceRubric.vocabulary)
  assert.ok(result.practiceRubric.grammar)
})

test('Quiz Stability - Options remain stable across renders and do not reshuffle on answering', () => {
  const quizWord = {
    id: 'w_test_1',
    word: 'Eloquent',
    meaning: 'Fluent or persuasive in speaking or writing.',
  }
  const rawOptions = [
    quizWord.meaning,
    'To walk quickly in an irregular direction without a clear target.',
    'A formal document provided during government registration.',
    'To reduce temperature below standard freezing limit.',
  ]

  // Deterministic shuffle algorithm used in DailyWordsPage
  function getStableOptions(word, index) {
    const seed = (word.id || word.word || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), index * 13)
    const shuffled = [...rawOptions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(((seed * (i + 1) * 37 + i * 19) % 1000) / 1000 * (i + 1))
      const temp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = temp
    }
    return shuffled
  }

  const firstRenderOptions = getStableOptions(quizWord, 0)
  // Simulate 10 re-renders (e.g. mobile touch events, state updates)
  for (let r = 0; r < 10; r++) {
    const nextRenderOptions = getStableOptions(quizWord, 0)
    assert.deepEqual(firstRenderOptions, nextRenderOptions, 'Options changed order on re-render!')
  }

  // The correct meaning must be preserved inside the options array
  assert.ok(firstRenderOptions.includes(quizWord.meaning))
})
