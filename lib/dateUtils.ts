/**
 * Timezone and Calendar Date Utilities
 * Accurately determines local calendar date using standard IANA time zones
 * (e.g. Asia/Karachi, America/New_York, Europe/London, Asia/Dubai)
 */

export const DEFAULT_TIMEZONE = 'Asia/Karachi'

/**
 * Returns the current calendar date string (YYYY-MM-DD) for a specific IANA timezone.
 * Handles daylight saving transitions and month/year boundaries correctly.
 */
export function getLocalDateString(timeZone: string = DEFAULT_TIMEZONE, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    return formatter.format(date) // Returns YYYY-MM-DD
  } catch {
    // Fallback if timezone string is invalid
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: DEFAULT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    return formatter.format(date)
  }
}

/**
 * Generates a stable numeric hash from a date string (YYYY-MM-DD)
 * to deterministically select the canonical daily set for that day.
 */
export function getDateSeed(dateString: string): number {
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Detects the client's current timezone or falls back to Asia/Karachi.
 */
export function getClientTimeZone(): string {
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz) return tz
    } catch {}
  }
  return DEFAULT_TIMEZONE
}

/**
 * Returns formatted local time string for UI indicators
 */
export function formatLocalTime(timeZone: string = DEFAULT_TIMEZONE): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date())
  } catch {
    return new Date().toLocaleTimeString()
  }
}
